import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export function HomePage() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`
    }}>
      <div className="web-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: colors.primary, marginBottom: '16px' }}>
          🎓 LearnSmart
        </h1>
        <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
          Free Indian Education Platform - Now on the Web!
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="web-button web-button-primary" onClick={() => navigate('/dashboard')}>
            📚 Browse Curriculum
          </button>
          
          <button className="web-button web-button-secondary" onClick={() => navigate('/qa-forum')}>
            💬 Q&A Forum
          </button>
          
          <button className="web-button web-button-secondary" onClick={() => navigate('/study-groups')}>
            👥 Study Groups
          </button>
          
          <button className="web-button web-button-secondary" onClick={() => navigate('/explore')}>
            🎯 Explore Features
          </button>
        </div>
        
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
          <p style={{ fontSize: '12px', color: colors.textSecondary }}>
            ✨ All your learning features now available on the web
          </p>
        </div>
      </div>
    </div>
  );
}