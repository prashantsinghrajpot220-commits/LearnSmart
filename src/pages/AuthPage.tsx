import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export function AuthPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`
    }}>
      <div className="web-card" style={{ 
        maxWidth: '400px', 
        width: '100%',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '32px', color: 'white' }}>
            🎓
          </span>
        </div>
        <h1 style={{ color: colors.text, marginBottom: '8px' }}>
          LearnSmart
        </h1>
        <p style={{ color: colors.textSecondary, marginBottom: '32px' }}>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <FaUser style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textSecondary
            }} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: colors.surface,
                color: colors.text,
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FaLock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textSecondary
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: colors.surface,
                color: colors.text,
                fontSize: '14px'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: colors.textSecondary,
                cursor: 'pointer'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="web-button web-button-primary"
            style={{
              marginTop: '8px'
            }}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.primary,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}