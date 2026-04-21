"use client";
import React from 'react';
import { Clock, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
const Dashboard = () => {
  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here's your overview.</p>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card total">
          <div className="kpi-icon-wrapper">
            <FileText size={26} strokeWidth={2} />
          </div>
          <div className="kpi-label">Total Issues</div>
          <div className="kpi-value">0</div>
        </div>

        <div className="kpi-card pending">
          <div className="kpi-icon-wrapper">
            <Clock size={26} strokeWidth={2} />
          </div>
          <div className="kpi-label">Pending</div>
          <div className="kpi-value">0</div>
        </div>

        <div className="kpi-card progress">
          <div className="kpi-icon-wrapper">
            <AlertCircle size={26} strokeWidth={2} />
          </div>
          <div className="kpi-label">In Progress</div>
          <div className="kpi-value">0</div>
        </div>

        <div className="kpi-card resolved">
          <div className="kpi-icon-wrapper">
            <CheckCircle2 size={26} strokeWidth={2} />
          </div>
          <div className="kpi-label">Resolved</div>
          <div className="kpi-value">0</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <div className="activity-header">
          <h2>Recent Activity</h2>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={32} color="var(--color-gray)" strokeWidth={2.5}/>
          </div>
          <h3>No issues reported yet</h3>
          <p>Start by submitting your first issue</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
