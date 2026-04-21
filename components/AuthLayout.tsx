import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-bg-grid"></div>
      <div className="auth-blob blob-1"></div>
      <div className="auth-blob blob-2"></div>
      
      <div className="auth-content">
        <div className="auth-showcase">
          <h1 className="auth-showcase-title">Speak Up!</h1>
          <p className="auth-showcase-subtitle">
            A fast, secure, and hassle-free platform for students to report issues easily to the staff. Your voice matters here.
          </p>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
