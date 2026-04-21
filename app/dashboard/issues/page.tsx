"use client";
import React from 'react';
import { Search, FileText } from 'lucide-react';

const MyIssues = () => {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">My Issues</h1>
        <p className="page-subtitle">View and track all your submitted issues.</p>
      </div>

      <div className="filter-bar animate-slide-up">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or tracking ID..." 
            className="search-input" 
          />
        </div>
        
        <div className="filter-dropdowns">
          <select className="filter-select">
            <option>All Categories</option>
            <option>Academic</option>
            <option>Infrastructure</option>
            <option>Administrative</option>
          </select>
          <select className="filter-select">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="issues-empty-state animate-slide-up" style={{ animationDelay: '0.1s' }}>
         <div className="empty-icon-wrapper">
           <FileText size={42} strokeWidth={2} />
         </div>
         <h3>No issues found</h3>
         <p>You haven't submitted any issues yet</p>
      </div>
    </>
  );
};

export default MyIssues;
