"use client";
import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-page-container animate-slide-up">
      <div className="settings-header">
        <h1 className="settings-title">Profile Settings</h1>
        <p className="settings-subtitle">Manage your account information and security.</p>
      </div>

      <div className="settings-card">
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} strokeWidth={2.5} />
            Profile Information
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} strokeWidth={2.5} />
            Change Password
          </button>
        </div>

        <div className="settings-content">
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            {activeTab === 'profile' ? (
              <>
                <div className="settings-form-group">
                  <label className="settings-label">Full Name</label>
                  <input 
                    type="text" 
                    className="settings-input" 
                    defaultValue="John Doe" 
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Email Address</label>
                  <input 
                    type="email" 
                    className="settings-input" 
                    defaultValue="landrate2000@gmail.com" 
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Position</label>
                  <input 
                    type="text" 
                    className="settings-input disabled" 
                    defaultValue="Class Monitor"
                    readOnly
                    disabled 
                  />
                  <span className="settings-helper-text">Contact an administrator to change your position</span>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Role</label>
                  <input 
                    type="text" 
                    className="settings-input disabled" 
                    defaultValue="Student"
                    readOnly
                    disabled 
                  />
                  <span className="settings-helper-text">Your account role</span>
                </div>
              </>
            ) : (
              <>
                <div className="settings-form-group">
                  <label className="settings-label">Current Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Enter your current password" 
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">New Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Enter new password" 
                  />
                  <span className="settings-helper-text">Must be at least 8 characters long</span>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Re-enter new password" 
                  />
                </div>
              </>
            )}

            <button type="submit" className="settings-btn-submit">
              <Save size={20} strokeWidth={2.5} />
              {activeTab === 'profile' ? 'Save Changes' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
