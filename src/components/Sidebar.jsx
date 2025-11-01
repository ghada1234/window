import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, Brain, BookOpen, Apple, Droplet, Activity, Moon, Heart, Users, MessageCircle, Palette, Target, Sparkles, FileText, Info, Phone, User, UserCircle, Crown, BarChart3, ClipboardList, Database } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Brain, label: 'Mind', children: [
      { label: 'Mind Practices', path: '/mind/practices' },
      { label: 'Journal', path: '/mind/journal' },
      { label: 'Emotion Insights', path: '/mind/emotions' }
    ]},
    { icon: Apple, label: 'Body', children: [
      { label: 'Nutrition', path: '/body/nutrition' },
      { label: 'Water Log', path: '/body/water' },
      { icon: Activity, label: 'Activity', path: '/body/activity' },
      { icon: Moon, label: 'Sleep', path: '/body/sleep' }
    ]},
    { icon: Heart, label: 'Wellness', children: [
      { label: 'Mood', path: '/wellness/mood' },
      { label: 'Self Love', path: '/wellness/self-love' }
    ]},
    { icon: Users, label: 'Community', children: [
      { label: 'WhatsApp Groups', path: '/community/whatsapp-groups' },
      { icon: Palette, label: 'Hobbies', path: '/community/hobbies' }
    ]},
    { icon: Target, label: 'Habits & Goals', path: '/habits-goals' },
    { icon: Sparkles, label: 'AI Hub', path: '/ai-hub' },
    { icon: ClipboardList, label: 'Wellness Report', path: '/wellness-report' },
    { icon: BarChart3, label: 'Web Analytics', path: '/analytics' },
    { icon: Database, label: 'Data Backup', path: '/data-backup' },
    { icon: UserCircle, label: 'Profile', children: [
      { label: 'Profile', path: '/profile' },
      { label: 'Personal Information', path: '/profile/personal-info' },
      { icon: Crown, label: 'Subscription', path: '/subscription' }
    ]},
    { icon: Info, label: 'Info', children: [
      { label: 'About', path: '/info/about' },
      { label: 'Contact', path: '/info/contact' }
    ]}
  ]

  const [expandedItems, setExpandedItems] = useState({})

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
          <img src="/sun.jpg" alt="Logo" className="sidebar-logo-img" />
          <h2>Find Your Inner Peace</h2>
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

