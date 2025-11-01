import { useState } from 'react'
import { Mail, HelpCircle } from 'lucide-react'
import './Contact.css'

const Contact = () => {
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
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the sign-in page and click "Forgot Password" to receive a reset link via email.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security practices to protect your information.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your wellness data from your profile settings.'
    }
  ]

  return (
    <div className="contact-page">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
      </header>

      <div className="contact-content">
        <div className="contact-form-section">
          <div className="form-section-header">
            <h2>Get in Touch</h2>
            <p>Send us a message and we'll respond as soon as possible</p>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ghadaabdulaziz1@gmail.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us more..."
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        <div className="contact-sidebar">
          <div className="other-ways-card">
            <h2>Other Ways to Reach Us</h2>
            
            <div className="contact-method">
              <div className="contact-method-header">
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <a href="mailto:ghadaabdulaziz1@gmail.com" className="contact-link">
                    ghadaabdulaziz1@gmail.com
                  </a>
                </div>
              </div>
              <p className="contact-method-note">We typically respond within 24-48 hours</p>
            </div>
          </div>

          <div className="faq-section">
            <div className="faq-header">
              <HelpCircle size={24} />
              <h2>Frequently Asked Questions</h2>
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

