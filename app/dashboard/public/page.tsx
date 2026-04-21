"use client";
import React from 'react';
import { Globe, Filter, Shield, ShieldCheck } from 'lucide-react';

const PublicFeed = () => {
  return (
    <>
      <div className="page-header animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div className="header-icon-box">
           <Globe size={32} strokeWidth={2} />
        </div>
        <div>
          <h1 className="page-title">Public Issue Feed</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>View anonymized issues from the community. Your identity is always protected.</p>
        </div>
      </div>

      <div className="public-stats-grid animate-slide-up" style={{ animationDelay: '0.1s', marginTop: '2.5rem' }}>
        <div className="public-stat-card">
          <h4><span className="pulse-dot-small" style={{ background: '#fbc02d', boxShadow: '0 0 8px rgba(251, 192, 45, 0.6)' }}></span>Maintenance</h4>
          <div className="stat-value">0</div>
          <div className="stat-label">issues reported</div>
        </div>
        <div className="public-stat-card">
          <h4><span className="pulse-dot-small" style={{ background: '#1976d2', boxShadow: '0 0 8px rgba(25, 118, 210, 0.6)' }}></span>ICT</h4>
          <div className="stat-value">0</div>
          <div className="stat-label">issues reported</div>
        </div>
        <div className="public-stat-card">
          <h4><span className="pulse-dot-small" style={{ background: '#388e3c', boxShadow: '0 0 8px rgba(56, 142, 60, 0.6)' }}></span>Academic</h4>
          <div className="stat-value">0</div>
          <div className="stat-label">issues reported</div>
        </div>
        <div className="public-stat-card">
          <h4><span className="pulse-dot-small" style={{ background: '#9e9e9e', boxShadow: '0 0 8px rgba(158, 158, 158, 0.6)' }}></span>Other</h4>
          <div className="stat-value">0</div>
          <div className="stat-label">issues reported</div>
        </div>
      </div>

      <div className="filter-bar public-filter-bar animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="filter-header">
           <Filter size={20} />
           <h3>Filter Issues</h3>
        </div>
        <div className="filter-dropdowns">
          <select className="filter-select">
            <option>All Categories</option>
          </select>
          <select className="filter-select">
            <option>All Statuses</option>
          </select>
          <select className="filter-select">
            <option>All Priorities</option>
          </select>
        </div>
      </div>

      <div className="recent-issues-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="card-header">
           <h3>Recent Issues (0)</h3>
        </div>
        <div className="issues-empty-state" style={{ minHeight: '350px', border: 'none', background: 'transparent', boxShadow: 'none', padding: '4rem 2rem' }}>
           <div className="empty-icon-wrapper">
             <Shield size={42} strokeWidth={2} />
           </div>
           <h3>No issues found</h3>
           <p>Try adjusting your filters</p>
        </div>
      </div>

      <div className="privacy-notice animate-slide-up" style={{ animationDelay: '0.4s' }}>
         <ShieldCheck className="icon" size={26} strokeWidth={2.5} />
         <div>
           <h4>Privacy Notice</h4>
           <p>This feed shows anonymized issue data from all students. No personal information, names, or detailed descriptions are displayed to protect everyone's privacy.</p>
         </div>
      </div>
    </>
  );
};

export default PublicFeed;
