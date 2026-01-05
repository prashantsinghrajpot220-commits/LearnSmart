import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { HeaderComponentWeb } from '../components/HeaderComponentWeb';
import { BottomTabNavigatorWeb } from '../components/BottomTabNavigatorWeb';

export function MainLayoutWeb() {
  const { theme, colors } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: colors.text }}>Loading LearnSmart...</h2>
          <div style={{ marginTop: '16px' }}>
            <div 
              className="web-spinner" 
              style={{
                width: '40px',
                height: '40px',
                border: `4px solid ${colors.border}`,
                borderTop: `4px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const hideBottomNav = ['/auth', '/'].includes(location.pathname);

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background,
        color: colors.text
      }} 
      className={`app-${theme}`}
    >
      <HeaderComponentWeb />
      
      <main style={{
        flex: 1,
        paddingBottom: hideBottomNav ? '0px' : '80px'
      }}>
        <Outlet />
      </main>

      {!hideBottomNav && <BottomTabNavigatorWeb />}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}