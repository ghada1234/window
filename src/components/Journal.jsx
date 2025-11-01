import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Sparkles, Plus, BookOpen } from 'lucide-react'
import './Journal.css'

const Journal = () => {
  const { journalEntries, addJournalEntry } = useWellness()
  const [currentEntry, setCurrentEntry] = useState('')
  const [showNewEntry, setShowNewEntry] = useState(false)

  const handleSave = () => {
    if (currentEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        content: currentEntry,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      }
      addJournalEntry(newEntry)
      setCurrentEntry('')
      setShowNewEntry(false)
    }
  }

  const handleAnalyze = () => {
    // AI analysis would go here
    alert('Analyzing journal entries...')
  }

  return (
    <div className="journal-page">
      <header className="page-header">
        <h1>Simple Journal</h1>
        <p>Write your thoughts and reflections</p>
      </header>

      <div className="journal-actions">
        <button className="analyze-btn" onClick={handleAnalyze}>
          <Sparkles size={18} />
          <span>Analyze Journal</span>
        </button>
        <button className="new-entry-btn" onClick={() => setShowNewEntry(true)}>
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {showNewEntry && (
        <div className="new-entry-section">
          <h2>Write your thoughts and feelings</h2>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="What's on your mind today?"
            className="journal-textarea-large"
            rows={8}
          />
          <div className="entry-actions">
            <button className="cancel-btn" onClick={() => {
              setShowNewEntry(false)
              setCurrentEntry('')
            }}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave} disabled={!currentEntry.trim()}>
              Save
            </button>
          </div>
        </div>
      )}

      <div className="journal-entries">
        <h2>Journal Entries</h2>
        <p className="entries-subtitle">Your recent journal entries</p>
        
        {journalEntries.length === 0 ? (
          <div className="no-entries">
            <BookOpen size={48} />
            <p>No entries yet. Start writing!</p>
          </div>
        ) : (
          <div className="entries-list">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-date">{entry.date}</span>
                  <span className="entry-time">{entry.time}</span>
                </div>
                <div className="entry-content">{entry.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Journal

