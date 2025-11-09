import { useState, useEffect } from 'react'
import { Share2, Heart, MessageCircle, Trophy, Users, Lock, Globe, UserPlus, Check, Award, Flame, TrendingUp, Target, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getJSON, setJSON } from '../utils/storage'
import { getCurrentUser } from '../utils/firebaseAuth'
import './SocialFeed.css'

const SocialFeed = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('feed') // 'feed', 'friends', 'achievements'
  const [posts, setPosts] = useState([])
  const [friends, setFriends] = useState([])
  const [achievements, setAchievements] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all', 'sleep', 'activity', 'mood', etc.
  const [currentUser, setCurrentUser] = useState(null)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')
  const [friendSearchResults, setFriendSearchResults] = useState([])

  useEffect(() => {
    setCurrentUser(getCurrentUser())
    
    // Load posts
    setPosts(getJSON('socialPosts', []))
    
    // Load friends with sample data if empty
    const savedFriends = getJSON('friends', [])
    if (savedFriends.length === 0) {
      const initialFriends = [
        { id: 1, name: t('social.friend1'), avatar: '👤', status: 'connected', streak: 15, activities: 42 },
        { id: 2, name: t('social.friend2'), avatar: '👤', status: 'connected', streak: 8, activities: 28 },
        { id: 3, name: t('social.friend3'), avatar: '👤', status: 'pending', activities: 0 },
        { id: 4, name: t('social.friend4'), avatar: '👤', status: 'connected', streak: 22, activities: 67 }
      ]
      setJSON('friends', initialFriends)
      setFriends(initialFriends)
    } else {
      setFriends(savedFriends)
    }
    
    // Load achievements
    setAchievements(getJSON('userAchievements', []))
  }, [t])


  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedByMe
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedByMe: !isLiked
        }
      }
      return post
    })
    setPosts(updatedPosts)
    setJSON('socialPosts', updatedPosts)
  }

  const addComment = (postId) => {
    const comment = prompt(t('social.enterComment'))
    if (comment?.trim()) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), {
              id: Date.now(),
              text: comment,
              user: currentUser?.displayName || 'You',
              date: new Date().toISOString()
            }]
          }
        }
        return post
      })
      setPosts(updatedPosts)
      setJSON('socialPosts', updatedPosts)
    }
  }

  const searchFriends = (email) => {
    setFriendEmail(email)
    // Simulate search - in production, this would call Firebase
    if (email.length > 3) {
      const mockResults = [
        { id: Date.now(), email: email, name: email.split('@')[0], avatar: '👤', mutual: 2 },
        { id: Date.now() + 1, email: `wellness.${email}`, name: `Wellness ${email.split('@')[0]}`, avatar: '👤', mutual: 0 }
      ]
      setFriendSearchResults(mockResults)
    } else {
      setFriendSearchResults([])
    }
  }

  const sendFriendRequest = (user) => {
    const newFriend = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      status: 'pending',
      requestedAt: new Date().toISOString()
    }
    
    const updatedFriends = [newFriend, ...friends]
    setFriends(updatedFriends)
    setJSON('friends', updatedFriends)
    
    alert(t('social.friendRequestSent', { name: user.name }))
    setShowAddFriendModal(false)
    setFriendEmail('')
    setFriendSearchResults([])
  }

  const acceptFriendRequest = (friendId) => {
    const updatedFriends = friends.map(f =>
      f.id === friendId ? { ...f, status: 'connected', streak: 0, activities: 0 } : f
    )
    setFriends(updatedFriends)
    setJSON('friends', updatedFriends)
  }

  const declineFriendRequest = (friendId) => {
    const updatedFriends = friends.filter(f => f.id !== friendId)
    setFriends(updatedFriends)
    setJSON('friends', updatedFriends)
  }

  const removeFriend = (friendId) => {
    if (confirm(t('social.confirmRemoveFriend'))) {
      const updatedFriends = friends.filter(f => f.id !== friendId)
      setFriends(updatedFriends)
      setJSON('friends', updatedFriends)
    }
  }

  const getPostIcon = (type) => {
    const icons = {
      sleep: '😴',
      activity: '💪',
      mood: '😊',
      nutrition: '🍎',
      water: '💧',
      milestone: '🎯',
      achievement: '🏆',
      meditation: '🧘',
      journal: '📔'
    }
    return icons[type] || '✨'
  }

  const getPostColor = (type) => {
    const colors = {
      sleep: '#8b5cf6',
      activity: '#f97316',
      mood: '#ec4899',
      nutrition: '#10b981',
      water: '#3b82f6',
      milestone: '#eab308',
      achievement: '#f59e0b',
      meditation: '#a78bfa',
      journal: '#06b6d4'
    }
    return colors[type] || '#6366f1'
  }

  // Sample posts with achievements
  const samplePosts = posts.length === 0 ? [
    {
      id: 1,
      userId: 'user1',
      userName: t('social.sampleUser1'),
      userAvatar: '👤',
      type: 'achievement',
      title: t('social.posts.weekStreak'),
      description: t('social.posts.weekStreakDesc'),
      stats: { streak: '7 days', activities: 12 },
      likes: 24,
      comments: 5,
      timeAgo: t('social.time.hoursAgo', { count: 2 }),
      privacy: 'public',
      likedByMe: false,
      commentsList: []
    },
    {
      id: 2,
      userId: 'user2',
      userName: t('social.sampleUser2'),
      userAvatar: '👤',
      type: 'sleep',
      title: t('social.posts.greatSleep'),
      description: t('social.posts.greatSleepDesc'),
      stats: { hours: '8.5', quality: t('sleepTracker.excellent') },
      likes: 15,
      comments: 3,
      timeAgo: t('social.time.hoursAgo', { count: 5 }),
      privacy: 'public',
      likedByMe: false,
      commentsList: []
    },
    {
      id: 3,
      userId: 'user3',
      userName: t('social.sampleUser3'),
      userAvatar: '👤',
      type: 'activity',
      title: t('social.posts.completedWorkout'),
      description: t('social.posts.completedWorkoutDesc'),
      stats: { duration: '45 min', calories: '350 cal' },
      likes: 18,
      comments: 4,
      timeAgo: t('social.time.hoursAgo', { count: 8 }),
      privacy: 'friends',
      likedByMe: true,
      commentsList: []
    },
    {
      id: 4,
      userId: 'user4',
      userName: t('social.sampleUser4'),
      userAvatar: '👤',
      type: 'meditation',
      title: t('social.posts.meditationStreak'),
      description: t('social.posts.meditationStreakDesc'),
      stats: { days: '30', total: '5 hours' },
      likes: 32,
      comments: 7,
      timeAgo: t('social.time.daysAgo', { count: 1 }),
      privacy: 'public',
      likedByMe: false,
      commentsList: []
    }
  ] : posts

  // Use friends directly (loaded with sample data initially)

  // Sample achievements
  const sampleAchievements = achievements.length === 0 ? [
    { id: 1, icon: '🔥', title: t('social.achievements.weekStreak'), description: t('social.achievements.weekStreakDesc'), earned: true, date: new Date().toLocaleDateString(), progress: 100 },
    { id: 2, icon: '💧', title: t('social.achievements.hydration'), description: t('social.achievements.hydrationDesc'), earned: true, date: new Date().toLocaleDateString(), progress: 100 },
    { id: 3, icon: '😴', title: t('social.achievements.sleepMaster'), description: t('social.achievements.sleepMasterDesc'), earned: true, date: new Date().toLocaleDateString(), progress: 100 },
    { id: 4, icon: '💪', title: t('social.achievements.fitnessWarrior'), description: t('social.achievements.fitnessWarriorDesc'), earned: false, progress: 60 },
    { id: 5, icon: '🧘', title: t('social.achievements.mindfulnessGuru'), description: t('social.achievements.mindfulnessGuruDesc'), earned: false, progress: 45 },
    { id: 6, icon: '🎯', title: t('social.achievements.goalCrusher'), description: t('social.achievements.goalCrusherDesc'), earned: false, progress: 30 },
    { id: 7, icon: '📔', title: t('social.achievements.journalMaster'), description: t('social.achievements.journalMasterDesc'), earned: false, progress: 80 },
    { id: 8, icon: '🌟', title: t('social.achievements.wellnessChampion'), description: t('social.achievements.wellnessChampionDesc'), earned: false, progress: 25 }
  ] : achievements

  const filteredPosts = filterType === 'all' ? samplePosts : samplePosts.filter(p => p.type === filterType)

  return (
    <div className="social-feed-page">
      <header className="page-header">
        <div>
          <h1><Users size={32} /> {t('social.title')}</h1>
          <p>{t('social.subtitle')}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="social-tabs">
        <button 
          className={`social-tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <Share2 size={18} />
          {t('social.tabs.feed')}
        </button>
        <button 
          className={`social-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Users size={18} />
          {t('social.tabs.friends')}
          {friends.filter(f => f.status === 'pending').length > 0 && (
            <span className="pending-badge">{friends.filter(f => f.status === 'pending').length}</span>
          )}
        </button>
        <button 
          className={`social-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy size={18} />
          {t('social.tabs.achievements')}
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="social-feed-content">
          {/* Info Banner */}
          <div className="social-info-banner">
            <Share2 size={24} />
            <div>
              <strong>{t('social.shareYourProgress')}</strong>
              <p>{t('social.shareProgressDesc')}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="feed-filters">
            <Filter size={18} />
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              {t('social.filters.all')}
            </button>
            <button 
              className={`filter-btn ${filterType === 'sleep' ? 'active' : ''}`}
              onClick={() => setFilterType('sleep')}
            >
              😴 {t('social.filters.sleep')}
            </button>
            <button 
              className={`filter-btn ${filterType === 'activity' ? 'active' : ''}`}
              onClick={() => setFilterType('activity')}
            >
              💪 {t('social.filters.activity')}
            </button>
            <button 
              className={`filter-btn ${filterType === 'mood' ? 'active' : ''}`}
              onClick={() => setFilterType('mood')}
            >
              😊 {t('social.filters.mood')}
            </button>
            <button 
              className={`filter-btn ${filterType === 'achievement' ? 'active' : ''}`}
              onClick={() => setFilterType('achievement')}
            >
              🏆 {t('social.filters.achievements')}
            </button>
          </div>

          {/* Posts */}
          <div className="posts-list">
            {filteredPosts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="user-avatar">{post.userAvatar}</div>
                    <div className="user-details">
                      <div className="user-name">{post.userName}</div>
                      <div className="post-meta">
                        <span>{post.timeAgo}</span>
                        <span className="meta-separator">•</span>
                        {post.privacy === 'public' ? (
                          <span className="privacy-indicator">
                            <Globe size={12} /> {t('social.public')}
                          </span>
                        ) : (
                          <span className="privacy-indicator">
                            <Lock size={12} /> {t('social.friendsOnly')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="post-content">
                  <div className="post-type-badge" style={{ background: getPostColor(post.type) }}>
                    {getPostIcon(post.type)} {t(`social.types.${post.type}`)}
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>
                  
                  {post.stats && (
                    <div className="post-stats-grid">
                      {Object.entries(post.stats).map(([key, value]) => (
                        <div key={key} className="stat-badge">
                          <span className="stat-label">{t(`social.stats.${key}`)}</span>
                          <span className="stat-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button 
                    className={`action-btn ${post.likedByMe ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={post.likedByMe ? 'currentColor' : 'none'} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="action-btn" onClick={() => addComment(post.id)}>
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                  </button>
                  <button className="action-btn">
                    <Share2 size={18} />
                    <span>{t('social.share')}</span>
                  </button>
                </div>

                {/* Comments */}
                {post.commentsList && post.commentsList.length > 0 && (
                  <div className="post-comments">
                    {post.commentsList.slice(0, 2).map(comment => (
                      <div key={comment.id} className="comment-item">
                        <strong>{comment.user}:</strong> {comment.text}
                      </div>
                    ))}
                    {post.commentsList.length > 2 && (
                      <button className="view-more-comments">
                        {t('social.viewMore', { count: post.commentsList.length - 2 })}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="friends-section">
          <div className="section-header">
            <h2>{t('social.myFriends')}</h2>
            <button className="add-friend-btn" onClick={() => setShowAddFriendModal(true)}>
              <UserPlus size={18} />
              {t('social.addFriend')}
            </button>
          </div>

          <div className="friends-grid">
            {friends.map(friend => (
              <div key={friend.id} className="friend-card">
                <div className="friend-avatar-large">{friend.avatar}</div>
                <div className="friend-info">
                  <h3 className="friend-name">{friend.name}</h3>
                  {friend.status === 'connected' && (
                    <>
                      <div className="friend-stats">
                        <div className="friend-stat">
                          <Flame size={16} />
                          <span>{t('social.dayStreak', { count: friend.streak })}</span>
                        </div>
                        <div className="friend-stat">
                          <TrendingUp size={16} />
                          <span>{t('social.activitiesLogged', { count: friend.activities })}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {friend.status === 'pending' && (
                    <div className="friend-pending-badge">{t('social.pendingRequest')}</div>
                  )}
                </div>
                {friend.status === 'connected' ? (
                  <button className="friend-action-btn connected">
                    <Check size={16} />
                    {t('social.connected')}
                  </button>
                ) : (
                  <div className="friend-pending-actions">
                    <button className="friend-action-btn accept" onClick={() => acceptFriendRequest(friend.id)}>
                      {t('social.accept')}
                    </button>
                    <button className="friend-action-btn decline" onClick={() => declineFriendRequest(friend.id)}>
                      {t('social.decline')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="achievements-section">
          <div className="section-header">
            <div>
              <h2>{t('social.myAchievements')}</h2>
              <p>{t('social.earnBadges')}</p>
            </div>
            <div className="achievement-summary">
              <Award size={20} />
              <span>{sampleAchievements.filter(a => a.earned).length}/{sampleAchievements.length} {t('social.earned')}</span>
            </div>
          </div>

          <div className="achievements-grid">
            {sampleAchievements.map(achievement => (
              <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                <div className="achievement-icon">{achievement.icon}</div>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                
                {achievement.earned ? (
                  <div className="achievement-earned-badge">
                    <Trophy size={16} />
                    <span>{t('social.earnedOn')}: {achievement.date}</span>
                  </div>
                ) : (
                  <>
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{achievement.progress}%</span>
                    </div>
                    <div className="achievement-locked-badge">
                      <Lock size={14} />
                      <span>{t('social.locked')}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="social-modal-overlay" onClick={() => setShowAddFriendModal(false)}>
          <div className="social-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('social.addFriend')}</h2>
            <p className="modal-subtitle">{t('social.addFriendDesc')}</p>

            <div className="search-input-group">
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => searchFriends(e.target.value)}
                placeholder={t('social.enterEmail')}
                className="friend-search-input"
              />
            </div>

            {friendSearchResults.length > 0 && (
              <div className="search-results">
                <h3>{t('social.searchResults')}</h3>
                {friendSearchResults.map(user => (
                  <div key={user.id} className="search-result-item">
                    <div className="result-user-info">
                      <div className="result-avatar">{user.avatar}</div>
                      <div>
                        <div className="result-name">{user.name}</div>
                        <div className="result-email">{user.email}</div>
                        {user.mutual > 0 && (
                          <div className="mutual-friends">{t('social.mutualFriends', { count: user.mutual })}</div>
                        )}
                      </div>
                    </div>
                    <button 
                      className="send-request-btn"
                      onClick={() => sendFriendRequest(user)}
                    >
                      <UserPlus size={16} />
                      {t('social.sendRequest')}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {friendEmail.length > 0 && friendSearchResults.length === 0 && (
              <div className="no-results">
                {t('social.noUsersFound')}
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setShowAddFriendModal(false)
                  setFriendEmail('')
                  setFriendSearchResults([])
                }}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialFeed

