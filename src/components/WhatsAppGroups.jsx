import { useState } from 'react'
import { Users, Plus, MessageCircle, UserPlus } from 'lucide-react'
import './WhatsAppGroups.css'

const WhatsAppGroups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const groups = [
    {
      id: 1,
      name: 'Wellness Warriors',
      description: 'A supportive community for wellness enthusiasts sharing tips and motivation',
      category: 'General Wellness',
      members: 150,
      icon: '💪'
    },
    {
      id: 2,
      name: 'Mindful Meditation',
      description: 'Daily meditation sessions and mindfulness practices',
      category: 'Meditation',
      members: 89,
      icon: '🧘'
    },
    {
      id: 3,
      name: 'Nutrition & Health',
      description: 'Share recipes, meal plans, and nutrition advice',
      category: 'Nutrition',
      members: 203,
      icon: '🥗'
    },
    {
      id: 4,
      name: 'Fitness Buddies',
      description: 'Find workout partners and share fitness achievements',
      category: 'Fitness',
      members: 175,
      icon: '🏋️'
    }
  ]

  return (
    <div className="whatsapp-groups-page">
      <div className="whatsapp-groups-container">
        <div className="page-header">
        <div>
          <h1>WhatsApp Groups</h1>
          <p>Connect with others on their wellness journey through community groups</p>
        </div>
        <button 
          className="create-group-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <div className="group-icon">{group.icon}</div>
              <div className="group-info">
                <h3>{group.name}</h3>
                <span className="group-category">{group.category}</span>
              </div>
            </div>
            <p className="group-description">{group.description}</p>
            <div className="group-footer">
              <div className="group-members">
                <Users size={16} />
                <span>{group.members} members</span>
              </div>
              <button className="join-btn">
                <UserPlus size={16} />
                Join Group
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="about-section">
        <h2>About Community Groups</h2>
        <p>
          Our WhatsApp groups provide a supportive space for you to connect with others who share similar wellness goals. 
          Share your progress, ask questions, and support each other on your journey to better health.
        </p>
      </div>
      </div>
    </div>
  )
}

export default WhatsAppGroups

