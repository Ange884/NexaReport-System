"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="auth-card animate-slide-up">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your credentials to access the portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="form-icon" size={20} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="student@university.edu" 
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <Lock className="form-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••" 
                required
              />
              <button 
                type="button" 
                className="pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-group">
              <input type="checkbox" className="checkbox-input" />
              <div className="custom-checkbox"></div>
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link href="/signup">Register Now</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
