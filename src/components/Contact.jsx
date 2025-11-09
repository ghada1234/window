import { useState } from 'react'
import { Mail, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

const Contact = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to a backend
    console.log('Form submitted:', formData)
    alert(t('contact.thankYou'))
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const faqs = [
    {
      question: t('contact.faqs.resetPassword.question'),
      answer: t('contact.faqs.resetPassword.answer')
    },
    {
      question: t('contact.faqs.dataSecure.question'),
      answer: t('contact.faqs.dataSecure.answer')
    },
    {
      question: t('contact.faqs.exportData.question'),
      answer: t('contact.faqs.exportData.answer')
    }
  ]

  return (
    <div className="contact-page">
      <header className="page-header">
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.subtitle')}</p>
      </header>

      <div className="contact-content">
        <div className="contact-form-section">
          <div className="form-section-header">
            <h2>{t('contact.getInTouch')}</h2>
            <p>{t('contact.getInTouchSubtitle')}</p>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">{t('contact.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">{t('contact.subject')}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('contact.subjectPlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">{t('contact.message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder={t('contact.messagePlaceholder')}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">{t('contact.sendMessage')}</button>
          </form>
        </div>

        <div className="contact-sidebar">
          <div className="other-ways-card">
            <h2>{t('contact.otherWays')}</h2>
            
            <div className="contact-method">
              <div className="contact-method-header">
                <Mail size={24} />
                <div>
                  <h3>{t('contact.emailLabel')}</h3>
                  <a href="mailto:ghadaabdulaziz1@gmail.com" className="contact-link">
                    ghadaabdulaziz1@gmail.com
                  </a>
                </div>
              </div>
              <p className="contact-method-note">{t('contact.responseTime')}</p>
            </div>
          </div>

          <div className="faq-section">
            <div className="faq-header">
              <HelpCircle size={24} />
              <h2>{t('contact.faqTitle')}</h2>
            </div>
            
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

