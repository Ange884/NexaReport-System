"use client";
import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2, X } from 'lucide-react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'status_update',
      title: 'Issue Status Updated',
      description: "Your issue 'Broken classroom projector' is now in progress.",
      time: '1 day ago',
      icon: <Clock size={20} className="icon-blue" strokeWidth={2.5} />
    },
    {
      id: 2,
      type: 'resolution',
      title: 'Issue Resolved',
      description: "Your issue 'Slow WiFi connection' has been resolved.",
      time: '2 days ago',
      icon: <CheckCircle2 size={20} className="icon-green" strokeWidth={2.5} />
    }
  ];

  return (
    <div className="notifications-page-container animate-slide-up">
      <div className="notifications-header">
        <div className="notifications-title-area">
          <h1 className="notifications-title">
            <Bell size={32} strokeWidth={2.5} />
            Notifications
          </h1>
          <span className="notifications-badge">2 new</span>
        </div>
        
        <button className="mark-all-read">
          Mark all as read
        </button>
      </div>

      <p className="notifications-subtitle">
        Stay updated on your issue submissions and status changes.
      </p>

      <div className="notifications-tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All (2)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread (2)
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            
            <div className="notification-main-content">
              <div className="notification-icon-wrapper">
                {notification.icon}
              </div>
              
              <div className="notification-text-wrapper">
                <h3 className="notification-item-title">{notification.title}</h3>
                <p className="notification-desc">{notification.description}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>

            <div className="notification-actions">
              <button className="notification-close" aria-label="Dismiss notification">
                <X size={18} strokeWidth={2.5} />
              </button>
              <button className="notification-mark-text">
                Mark as read
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
