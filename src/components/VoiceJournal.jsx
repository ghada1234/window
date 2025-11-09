import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Save, Play, Pause, Trash2, Volume2, Smile, Meh, Frown, Heart, Brain, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getJSON, setJSON } from '../utils/storage'
import './VoiceJournal.css'

const VoiceJournal = () => {
  const { t, i18n } = useTranslation()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [detectedEmotion, setDetectedEmotion] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceEntries, setVoiceEntries] = useState([])
  const [isPlaying, setIsPlaying] = useState(null)
  const [browserSupport, setBrowserSupport] = useState(true)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const audioElementsRef = useRef({})

  useEffect(() => {
    // Check browser support
    const hasMediaRecorder = 'mediaDevices' in navigator && 'MediaRecorder' in window
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setBrowserSupport(hasMediaRecorder && hasSpeechRecognition)

    // Load voice entries
    loadVoiceEntries()

    // Initialize Speech Recognition
    if (hasSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = i18n.language === 'ar' ? 'ar-AE' : 'en-US'

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' '
          } else {
            interimTranscript += transcriptPiece
          }
        }

        setTranscript(prev => prev + finalTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          console.log('No speech detected')
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [i18n.language])

  const loadVoiceEntries = () => {
    const entries = getJSON('voiceJournalEntries', [])
    setVoiceEntries(entries)
  }

  const analyzeEmotionFromAudio = async (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const detectEmotion = () => {
        if (!isRecording) return

        analyserRef.current.getByteFrequencyData(dataArray)
        analyserRef.current.getByteTimeDomainData(dataArray)

        // Calculate audio features
        const volume = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength
        const highFreq = dataArray.slice(bufferLength / 2).reduce((sum, val) => sum + val, 0) / (bufferLength / 2)
        const lowFreq = dataArray.slice(0, bufferLength / 2).reduce((sum, val) => sum + val, 0) / (bufferLength / 2)
        
        // Emotion detection based on audio characteristics
        let emotion = 'neutral'
        let emotionConfidence = 0

        // High volume + high frequency = excited/happy
        if (volume > 100 && highFreq > 80) {
          emotion = 'happy'
          emotionConfidence = Math.min(95, (volume / 128 + highFreq / 128) * 50)
        }
        // Low volume + low frequency = sad/calm
        else if (volume < 70 && lowFreq > highFreq) {
          emotion = 'sad'
          emotionConfidence = Math.min(90, ((128 - volume) / 128 + lowFreq / 128) * 45)
        }
        // Erratic patterns = anxious/stressed
        else if (volume > 90 && Math.abs(highFreq - lowFreq) > 40) {
          emotion = 'anxious'
          emotionConfidence = Math.min(85, (volume / 128) * 60)
        }
        // Moderate levels = calm
        else if (volume > 40 && volume < 90) {
          emotion = 'calm'
          emotionConfidence = Math.min(80, 50 + (20 * (1 - Math.abs(65 - volume) / 65)))
        }
        // Very low = neutral or tired
        else {
          emotion = 'neutral'
          emotionConfidence = 50
        }

        setDetectedEmotion(emotion)
        setConfidence(Math.round(emotionConfidence))

        if (isRecording) {
          requestAnimationFrame(detectEmotion)
        }
      }

      detectEmotion()
    } catch (error) {
      console.error('Error analyzing audio:', error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        saveVoiceEntry(audioUrl)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTranscript('')
      setDetectedEmotion(null)

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.lang = i18n.language === 'ar' ? 'ar-AE' : 'en-US'
        recognitionRef.current.start()
      }

      // Start emotion analysis
      analyzeEmotionFromAudio(stream)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert(t('voiceJournal.micAccessError'))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsPaused(false)

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        if (recognitionRef.current) recognitionRef.current.start()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        if (recognitionRef.current) recognitionRef.current.stop()
        setIsPaused(true)
      }
    }
  }

  const saveVoiceEntry = (audioUrl) => {
    const entry = {
      id: Date.now(),
      audioUrl,
      transcript,
      emotion: detectedEmotion || 'neutral',
      confidence,
      duration: recordingTime,
      date: new Date().toISOString(),
      dateString: new Date().toLocaleString(i18n.language === 'ar' ? 'ar-AE' : 'en-US')
    }

    const entries = getJSON('voiceJournalEntries', [])
    entries.unshift(entry)
    setJSON('voiceJournalEntries', entries)
    setVoiceEntries(entries)

    // Reset
    setRecordingTime(0)
    setTranscript('')
    setDetectedEmotion(null)
    setConfidence(0)
  }

  const playAudio = (id, audioUrl) => {
    if (isPlaying === id) {
      audioElementsRef.current[id]?.pause()
      setIsPlaying(null)
    } else {
      // Stop any currently playing audio
      Object.values(audioElementsRef.current).forEach(audio => audio?.pause())
      
      if (!audioElementsRef.current[id]) {
        audioElementsRef.current[id] = new Audio(audioUrl)
        audioElementsRef.current[id].onended = () => setIsPlaying(null)
      }
      
      audioElementsRef.current[id].play()
      setIsPlaying(id)
    }
  }

  const deleteEntry = (id) => {
    if (confirm(t('voiceJournal.confirmDelete'))) {
      const entries = voiceEntries.filter(entry => entry.id !== id)
      setJSON('voiceJournalEntries', entries)
      setVoiceEntries(entries)
      if (audioElementsRef.current[id]) {
        audioElementsRef.current[id].pause()
        delete audioElementsRef.current[id]
      }
    }
  }

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'happy': return { icon: Smile, color: '#10b981', emoji: '😊' }
      case 'sad': return { icon: Frown, color: '#3b82f6', emoji: '😢' }
      case 'anxious': return { icon: AlertCircle, color: '#f59e0b', emoji: '😰' }
      case 'calm': return { icon: Heart, color: '#8b5cf6', emoji: '😌' }
      case 'neutral': return { icon: Meh, color: '#6b7280', emoji: '😐' }
      default: return { icon: Brain, color: '#ec4899', emoji: '🤔' }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!browserSupport) {
    return (
      <div className="voice-journal-page">
        <header className="page-header">
          <h1><Mic size={32} /> {t('voiceJournal.title')}</h1>
          <p>{t('voiceJournal.subtitle')}</p>
        </header>
        <div className="browser-support-error">
          <AlertCircle size={48} />
          <h2>{t('voiceJournal.browserNotSupported')}</h2>
          <p>{t('voiceJournal.browserNotSupportedDesc')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="voice-journal-page">
      <header className="page-header">
        <h1><Mic size={32} /> {t('voiceJournal.title')}</h1>
        <p>{t('voiceJournal.subtitle')}</p>
      </header>

      {/* Recording Section */}
      <div className="voice-recorder-card">
        <div className="recorder-header">
          <h2>{t('voiceJournal.recordYourThoughts')}</h2>
          <p>{t('voiceJournal.speakFreely')}</p>
        </div>

        {/* Recording Controls */}
        <div className="recorder-controls">
          {!isRecording ? (
            <button className="record-btn start" onClick={startRecording}>
              <Mic size={32} />
              <span>{t('voiceJournal.startRecording')}</span>
            </button>
          ) : (
            <div className="recording-active">
              <div className="recording-indicator">
                <div className="pulse-dot"></div>
                <span className="recording-time">{formatTime(recordingTime)}</span>
              </div>
              
              <div className="recording-buttons">
                <button className="control-btn pause" onClick={pauseRecording}>
                  {isPaused ? <Play size={24} /> : <Pause size={24} />}
                  {isPaused ? t('voiceJournal.resume') : t('voiceJournal.pause')}
                </button>
                <button className="control-btn stop" onClick={stopRecording}>
                  <Save size={24} />
                  {t('voiceJournal.save')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Emotion Detection */}
        {isRecording && detectedEmotion && (
          <div className="emotion-detection">
            <div className="emotion-header">
              <Brain size={20} />
              <span>{t('voiceJournal.emotionDetected')}</span>
            </div>
            <div className="emotion-result" style={{ borderColor: getEmotionIcon(detectedEmotion).color }}>
              <span className="emotion-emoji">{getEmotionIcon(detectedEmotion).emoji}</span>
              <div className="emotion-details">
                <span className="emotion-name">{t(`voiceJournal.emotions.${detectedEmotion}`)}</span>
                <span className="emotion-confidence">{confidence}% {t('voiceJournal.confidence')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Transcript */}
        {transcript && (
          <div className="live-transcript">
            <div className="transcript-header">
              <Volume2 size={18} />
              <span>{t('voiceJournal.liveTranscript')}</span>
            </div>
            <div className="transcript-content">{transcript}</div>
          </div>
        )}
      </div>

      {/* Voice Entries */}
      <div className="voice-entries-section">
        <h2>{t('voiceJournal.yourEntries')}</h2>
        {voiceEntries.length === 0 ? (
          <div className="no-entries">
            <Mic size={48} />
            <p>{t('voiceJournal.noEntries')}</p>
          </div>
        ) : (
          <div className="entries-list">
            {voiceEntries.map(entry => {
              const emotionData = getEmotionIcon(entry.emotion)
              return (
                <div key={entry.id} className="voice-entry-card">
                  <div className="entry-header">
                    <div className="entry-emotion" style={{ background: emotionData.color }}>
                      <span className="emotion-emoji">{emotionData.emoji}</span>
                      <span className="emotion-label">{t(`voiceJournal.emotions.${entry.emotion}`)}</span>
                    </div>
                    <span className="entry-date">{entry.dateString}</span>
                  </div>

                  {entry.transcript && (
                    <div className="entry-transcript">
                      <p>{entry.transcript}</p>
                    </div>
                  )}

                  <div className="entry-meta">
                    <span className="entry-duration">{formatTime(entry.duration)}</span>
                    <span className="entry-confidence">{entry.confidence}% {t('voiceJournal.confidence')}</span>
                  </div>

                  <div className="entry-actions">
                    <button 
                      className={`play-btn ${isPlaying === entry.id ? 'playing' : ''}`}
                      onClick={() => playAudio(entry.id, entry.audioUrl)}
                    >
                      {isPlaying === entry.id ? <Pause size={18} /> : <Play size={18} />}
                      {isPlaying === entry.id ? t('voiceJournal.pause') : t('voiceJournal.play')}
                    </button>
                    <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceJournal


