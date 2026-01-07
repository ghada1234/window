import { Heart, Apple, Activity, Sparkles, BookOpen, BarChart3, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './About.css'

const About = () => {
  const { t } = useTranslation()
  
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </header>

      <section className="creator-section" style={{
        background: 'linear-gradient(135deg, #7FB3A8 0%, #9B9BC8 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        marginBottom: '3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <img 
            src="/ghads-alani.jpg" 
            alt="Ghada Al-Ani" 
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              marginBottom: '1.5rem'
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{t('about.creator.name')}</h2>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', opacity: 0.95 }}>
            {t('about.creator.title')}
          </p>
          <p style={{ margin: '0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.8' }}>
            {t('about.creator.bio')}
          </p>
        </div>
      </section>

      <section className="mission-section">
        <h2>{t('about.mission')}</h2>
        <p className="mission-statement">
          <strong>{t('about.missionStatement')}</strong>
        </p>
        <p>
          {t('about.missionDescription')}
        </p>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Heart size={32} />
          </div>
          <h3>{t('about.features.mentalHealth.title')}</h3>
          <p>{t('about.features.mentalHealth.description')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Apple size={32} />
          </div>
          <h3>{t('about.features.nutrition.title')}</h3>
          <p>{t('about.features.nutrition.description')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Activity size={32} />
          </div>
          <h3>{t('about.features.physicalActivity.title')}</h3>
          <p>{t('about.features.physicalActivity.description')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Heart size={32} />
          </div>
          <h3>{t('about.features.emotionalWellness.title')}</h3>
          <p>{t('about.features.emotionalWellness.description')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={32} />
          </div>
          <h3>{t('about.features.aiInsights.title')}</h3>
          <p>{t('about.features.aiInsights.description')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <BookOpen size={32} />
          </div>
          <h3>{t('about.features.journaling.title')}</h3>
          <p>{t('about.features.journaling.description')}</p>
        </div>
      </section>

      <section className="highlights-section">
        <h2>{t('about.featuresTitle')}</h2>
        <div className="highlights-grid">
          <div className="highlight-item">
            <BarChart3 size={24} />
            <div>
              <h3>{t('about.highlights.comprehensiveTracking.title')}</h3>
              <p>{t('about.highlights.comprehensiveTracking.description')}</p>
            </div>
          </div>

          <div className="highlight-item">
            <Sparkles size={24} />
            <div>
              <h3>{t('about.highlights.aiAnalysis.title')}</h3>
              <p>{t('about.highlights.aiAnalysis.description')}</p>
            </div>
          </div>

          <div className="highlight-item">
            <Users size={24} />
            <div>
              <h3>{t('about.highlights.communitySupport.title')}</h3>
              <p>{t('about.highlights.communitySupport.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About


