import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, Brain, BookOpen, Apple, Droplet, Activity, Moon, Heart, Users, MessageCircle, Palette, Target, Sparkles, FileText, Info, Phone, User, UserCircle, Crown, BarChart3, ClipboardList, Database, Bell, Share2, ChefHat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  // Re-create menu items when language changes
  const menuItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Brain, label: t('nav.mind'), children: [
      { label: t('sidebar.journal'), path: '/mind/journal' },
      { label: t('sidebar.voiceJournal'), path: '/mind/voice-journal' },
      { label: t('sidebar.cbtTherapy'), path: '/mind/cbt-therapy' },
      { label: t('sidebar.emotionInsights'), path: '/mind/emotions' }
    ]},
    { icon: Apple, label: t('nav.body'), children: [
      { label: t('sidebar.nutrition'), path: '/body/nutrition' },
      { icon: ChefHat, label: t('sidebar.meredithShirk'), path: '/body/meal-plans' },
      { label: t('sidebar.waterLog'), path: '/body/water' },
      { icon: Activity, label: t('sidebar.activity'), path: '/body/activity' },
      { icon: Moon, label: t('sidebar.sleep'), path: '/body/sleep' }
    ]},
    { icon: Heart, label: t('nav.wellness'), children: [
      { label: t('sidebar.mood'), path: '/wellness/mood' },
      { label: t('sidebar.selfLove'), path: '/wellness/self-love' }
    ]},
    { icon: Users, label: t('nav.community'), children: [
      { icon: Share2, label: t('sidebar.social'), path: '/community/social' },
      { label: t('sidebar.whatsappGroups'), path: '/community/whatsapp-groups' },
      { icon: Palette, label: t('sidebar.hobbies'), path: '/community/hobbies' }
    ]},
    { icon: Target, label: t('sidebar.habitsGoals'), path: '/habits-goals' },
    { icon: Sparkles, label: t('sidebar.aiHub'), path: '/ai-hub' },
    { icon: ClipboardList, label: t('sidebar.wellnessReport'), path: '/wellness-report' },
    { icon: BarChart3, label: t('sidebar.webAnalytics'), path: '/analytics' },
    { icon: Users, label: t('sidebar.userStats'), path: '/user-stats' },
    { icon: Database, label: t('sidebar.dataBackup'), path: '/data-backup' },
    { icon: Activity, label: t('sidebar.wearableDevices'), path: '/wearable-sync' },
    { icon: Bell, label: t('nav.notifications'), path: '/notifications' },
    { icon: UserCircle, label: t('nav.profile'), children: [
      { label: t('nav.profile'), path: '/profile' },
      { label: t('sidebar.personalInfo'), path: '/profile/personal-info' },
      { icon: Crown, label: t('nav.subscription'), path: '/subscription' }
    ]},
    { icon: Info, label: t('sidebar.about'), children: [
      { label: t('sidebar.about'), path: '/info/about' },
      { label: t('sidebar.contact'), path: '/info/contact' }
    ]}
  ]

  const [expandedItems, setExpandedItems] = useState({})

  // Force re-render when language changes
  const [, forceUpdate] = useState({})
  
  React.useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({})
    }
    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const toggleExpanded = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  return (
    <>
      <button className={`sidebar-toggle ${isOpen ? 'sidebar-open' : ''}`} onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header" onClick={() => navigate('/dashboard')}>
          <img src="/sun.jpg" alt={t('app.name')} className="sidebar-logo-img" />
          <h2>{t('app.name')}</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon || Home
            return (
              <div key={index} className="nav-item">
                {item.children ? (
                  <>
                    <div 
                      className="nav-item-header" 
                      onClick={() => toggleExpanded(item.label)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {expandedItems[item.label] && (
                      <div className="nav-item-children">
                        {item.children.map((child, childIndex) => (
                          <div
                            key={childIndex}
                            onClick={() => navigate(child.path)}
                            className={`nav-child-item ${location.pathname === child.path || (child.path === '/profile' && location.pathname.startsWith('/profile')) ? 'active' : ''}`}
                          >
                            {child.icon && <child.icon size={16} />}
                            <span>{child.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    onClick={() => navigate(item.path)}
                    className={`nav-item-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

