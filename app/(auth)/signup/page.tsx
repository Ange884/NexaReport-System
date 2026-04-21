"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const SignUp = () => {
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
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the student portal to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="form-input-wrapper">
              <User className="form-icon" size={20} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                required
              />
            </div>
          </div>

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
                placeholder="Create a strong password" 
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

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Register Now
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link href="/login">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
