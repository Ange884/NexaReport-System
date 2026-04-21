"use client";
import React from 'react';
import { Send } from 'lucide-react';

const SubmitIssue = () => {
  return (
    <>
      <div className="page-header animate-slide-up">
        <h1 className="page-title">Submit New Issue</h1>
        <p className="page-subtitle">Report an issue and we'll track it for you.</p>
      </div>

      <div className="form-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <form className="issue-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Issue Title <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Brief title describing the issue" required />
          </div>

          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-textarea" placeholder="Provide detailed information about the issue..." rows="6" required></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">Category <span className="required">*</span></label>
              <select className="filter-select form-dropdown" required defaultValue="">
                <option value="" disabled>Select category</option>
                <option value="academic">Academic</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="administrative">Administrative</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            
            <div className="form-group half-width">
              <label className="form-label">Priority <span className="required">*</span></label>
              <select className="filter-select form-dropdown" required defaultValue="">
                <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-footer" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary form-submit-btn">
              <span>Submit Issue</span>
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SubmitIssue;
