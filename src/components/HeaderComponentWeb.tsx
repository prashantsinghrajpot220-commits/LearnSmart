import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaArrowLeft, FaBell, FaCog, FaSearch } from 'react-icons/fa';

export const HeaderComponentWeb: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
      case '/':
        return 'Dashboard';
      case '/chapters':
        return 'Chapters';
      case '/qa-forum':
        return 'Q&A Forum';
      case '/study-groups':
        return 'Study Groups';
      case '/profile':
        return 'Profile';
      case '/explore':
        return 'Explore';
      default:
        return 'LearnSmart';
    }
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';
  const showSearchButton = ['/qa-forum', '/study-groups'].includes(location.pathname);

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: colors.text,
            }}
          >
            <FaArrowLeft size={18} />
          </button>
        )}
        <h1 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: 0,
          color: colors.text 
        }}>
          {getTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showSearchButton && (
          <button
            onClick={() => console.log('Search clicked')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: colors.textSecondary,
            }}
          >
            <FaSearch size={18} />
          </button>
        )}
        
        <button
          onClick={() => navigate('/notifications')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: colors.textSecondary,
            position: 'relative',
          }}
        >
          <FaBell size={18} />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: colors.error,
            borderRadius: '50%',
            display: 'none', // Show when notifications exist
          }} />
        </button>

        <button
          onClick={() => navigate('/settings')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: colors.textSecondary,
          }}
        >
          <FaCog size={18} />
        </button>
      </div>
    </div>
  );
};