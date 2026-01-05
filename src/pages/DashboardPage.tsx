import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaBook, FaQuestionCircle, FaUsers, FaTrophy } from 'react-icons/fa';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const DashboardPage: React.FC = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const cards: DashboardCard[] = [
    {
      title: 'NCERT Curriculum',
      description: 'Browse classes 1-12, all subjects and chapters',
      icon: <FaBook />,
      path: '/',
      color: colors.primary,
    },
    {
      title: 'Q&A Forum',
      description: 'Ask questions, get answers from community',
      icon: <FaQuestionCircle />,
      path: '/qa-forum',
      color: colors.success,
    },
    {
      title: 'Study Groups',
      description: 'Join study groups by subject and topic',
      icon: <FaUsers />,
      path: '/study-groups',
      color: colors.warning,
    },
    {
      title: 'Gamification',
      description: 'Earn SmartCoins, track streaks & milestones',
      icon: <FaTrophy />,
      path: '/profile',
      color: colors.error,
    },
  ];

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
          Welcome to LearnSmart Web 🌐
        </h2>
        <p style={{ color: colors.textSecondary }}>
          Your React Native app is now running on the web!
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => navigate(card.path)}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            className="hover:shadow-lg"
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: `${card.color}20`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '24px', color: card.color }}>
                {card.icon}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              {card.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};