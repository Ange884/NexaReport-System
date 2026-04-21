"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const NotFound = () => {
  const location = usePathname();
  const isDashboard = location.startsWith('/dashboard');

  return (
    <AuthLayout>
      <div className="auth-card animate-slide-up" style={{ textAlign: 'center', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="auth-header">
          <div className="auth-icon-wrapper" style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', borderRadius: '24px' }}>
            <Compass size={40} strokeWidth={2} />
          </div>
          <h1 className="auth-title" style={{ fontSize: '4.5rem', letterSpacing: '4px', textShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>404</h1>
          <p className="auth-subtitle" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>Whoops! Page Not Found</p>
        </div>

        <p style={{ color: 'var(--color-gray)', marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.6 }}>
          The section <strong>{location}</strong> hasn't been developed yet or has been moved!
        </p>

        <Link href={isDashboard ? "/dashboard" : "/login"} className="btn-primary">
          {isDashboard ? "Return to Dashboard" : "Return to Login"}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default NotFound;
