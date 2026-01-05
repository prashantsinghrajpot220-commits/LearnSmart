import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaBook, FaQuestionCircle, FaUsers, FaUser } from 'react-icons/fa';

interface Tab {
  path: string;
  icon: React.ReactElement;
  label: string;
}

const tabs: Tab[] = [
  { path: '/dashboard', icon: <FaHome />, label: 'Home' },
  { path: '/chapters', icon: <FaBook />, label: 'Study' },
  { path: '/qa-forum', icon: <FaQuestionCircle />, label: 'Q&A' },
  { path: '/study-groups', icon: <FaUsers />, label: 'Groups' },
  { path: '/profile', icon: <FaUser />, label: 'Profile' },
];

export function BottomTabNavigatorWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <button 
            key={tab.path} 
            onClick={() => navigate(tab.path)} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: '60px',
              position: 'relative',
            }}
          >
            <span style={{
              fontSize: '20px',
              color: active ? colors.primary : colors.textSecondary,
              marginBottom: '4px'
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: '10px',
              color: active ? colors.primary : colors.textSecondary,
              fontWeight: active ? '600' : '400'
            }}>
              {tab.label}
            </span>
            {active && (
              <div style={{
                position: 'absolute',
                bottom: '4px',
                width: '24px',
                height: '3px',
                backgroundColor: colors.primary,
                borderRadius: '2px',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}