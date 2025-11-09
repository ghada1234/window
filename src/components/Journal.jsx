import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Sparkles, Plus, BookOpen, Edit2, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Journal.css'

const Journal = () => {
  const { t } = useTranslation()
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useWellness()
  const [currentEntry, setCurrentEntry] = useState('')
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleSave = () => {
    if (currentEntry.trim()) {
      if (editingEntry) {
        // Update existing entry
        updateJournalEntry(editingEntry.id, {
          content: currentEntry
        })
        setEditingEntry(null)
      } else {
        // Add new entry
        const newEntry = {
          id: Date.now(),
          content: currentEntry,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        }
        addJournalEntry(newEntry)
      }
      setCurrentEntry('')
      setShowNewEntry(false)
    }
  }

  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setCurrentEntry(entry.content)
    setShowNewEntry(true)
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
    setCurrentEntry('')
    setShowNewEntry(false)
  }

  const handleDeleteEntry = (entryId) => {
    deleteJournalEntry(entryId)
    setDeleteConfirm(null)
  }

  const handleAnalyze = () => {
    // AI analysis would go here
    alert(t('journal.analyzingMessage'))
  }

  return (
    <div className="journal-page">
      <header className="page-header">
        <h1>{t('journal.title')}</h1>
        <p>{t('journal.subtitle')}</p>
      </header>

      <div className="journal-actions">
        <button className="analyze-btn" onClick={handleAnalyze}>
          <Sparkles size={18} />
          <span>{t('journal.analyzeJournal')}</span>
        </button>
        <button className="new-entry-btn" onClick={() => setShowNewEntry(true)}>
          <Plus size={18} />
          <span>{t('journal.newEntry')}</span>
        </button>
      </div>

      {showNewEntry && (
        <div className="new-entry-section">
          <h2>{editingEntry ? t('common.edit') + ' ' + t('journal.entry') : t('journal.writeThoughts')}</h2>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder={t('journal.placeholder')}
            className="journal-textarea-large"
            rows={8}
          />
          <div className="entry-actions">
            <button className="cancel-btn" onClick={handleCancelEdit}>
              {t('common.cancel')}
            </button>
            <button className="save-btn" onClick={handleSave} disabled={!currentEntry.trim()}>
              {editingEntry ? t('common.update') : t('common.save')}
            </button>
          </div>
        </div>
      )}

      <div className="journal-entries">
        <h2>{t('journal.journalEntries')}</h2>
        <p className="entries-subtitle">{t('journal.entriesSubtitle')}</p>
        
        {journalEntries.length === 0 ? (
          <div className="no-entries">
            <BookOpen size={48} />
            <p>{t('journal.noEntries')}</p>
          </div>
        ) : (
          <div className="entries-list">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-date">{entry.date}</span>
                  <span className="entry-time">{entry.time}</span>
                  <div className="entry-actions">
                    <button 
                      className="icon-btn edit-btn" 
                      onClick={() => handleEditEntry(entry)}
                      title={t('common.edit')}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="icon-btn delete-btn" 
                      onClick={() => setDeleteConfirm(entry.id)}
                      title={t('common.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="entry-content">{entry.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('common.confirmDelete')}</h2>
              <button className="close-btn" onClick={() => setDeleteConfirm(null)}>
                <X size={24} />
              </button>
            </div>
            <p className="delete-message">{t('common.deleteMessage')}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>
                {t('common.cancel')}
              </button>
              <button className="delete-confirm-btn" onClick={() => handleDeleteEntry(deleteConfirm)}>
                <Trash2 size={18} />
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Journal
