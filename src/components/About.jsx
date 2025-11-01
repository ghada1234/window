import { Heart, Apple, Activity, Sparkles, BookOpen, BarChart3, Users } from 'lucide-react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>About Find Your Inner Peace</h1>
        <p>Your comprehensive wellness companion for holistic health and mindfulness</p>
      </header>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p className="mission-statement">
          <strong>Empowering you to achieve holistic wellness through technology and mindfulness</strong>
        </p>
        <p>
          Find Your Inner Peace is designed to support your journey toward better physical, mental, and emotional health. 
          We combine AI-powered insights with intuitive tools to help you track, understand, and improve your overall wellness.
        </p>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Heart size={32} />
          </div>
          <h3>Mental Health</h3>
          <p>Track your mood, journal your thoughts, and practice mindfulness with guided meditations and breathing exercises.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Apple size={32} />
          </div>
          <h3>Nutrition</h3>
          <p>Monitor your nutrition, get AI-powered meal plans, and track your eating habits with intelligent food analysis.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Activity size={32} />
          </div>
          <h3>Physical Activity</h3>
          <p>Log your workouts, track your sleep, monitor water intake, and maintain an active lifestyle.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Heart size={32} />
          </div>
          <h3>Emotional Wellness</h3>
          <p>Practice self-love, track your emotional patterns, and develop healthy habits for long-term wellbeing.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={32} />
          </div>
          <h3>AI-Powered Insights</h3>
          <p>Get personalized recommendations, analyze your wellness data, and receive intelligent insights tailored to your journey.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <BookOpen size={32} />
          </div>
          <h3>Journaling</h3>
          <p>Express your thoughts through voice transcription or text, track your journey, and reflect on your growth.</p>
        </div>
      </section>

      <section className="highlights-section">
        <h2>Features</h2>
        <div className="highlights-grid">
          <div className="highlight-item">
            <BarChart3 size={24} />
            <div>
              <h3>Comprehensive Tracking</h3>
              <p>Monitor all aspects of your wellness in one place - nutrition, activity, sleep, mood, and more.</p>
            </div>
          </div>

          <div className="highlight-item">
            <Sparkles size={24} />
            <div>
              <h3>AI-Powered Analysis</h3>
              <p>Get intelligent insights and personalized recommendations based on your unique patterns and goals.</p>
            </div>
          </div>

          <div className="highlight-item">
            <Users size={24} />
            <div>
              <h3>Community Support</h3>
              <p>Connect with others on similar wellness journeys through hobbies, habits, and community groups.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About


