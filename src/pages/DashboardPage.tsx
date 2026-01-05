import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaBook, FaQuestionCircle, FaUsers, FaTrophy } from 'react-icons/fa';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  path: string;
  color: string;
}

export function DashboardPage() {
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
      description: 'Ask questions and get help from the community',
      icon: <FaQuestionCircle />,
      path: '/qa-forum',
      color: colors.secondary,
    },
    {
      title: 'Study Groups',
      description: 'Join or create study groups with friends',
      icon: <FaUsers />,
      path: '/study-groups',
      color: colors.success,
    },
    {
      title: 'Leaderboard',
      description: 'Compete with other students and track progress',
      icon: <FaTrophy />,
      path: '/leaderboard',
      color: colors.warning,
    },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
      backgroundColor: colors.background,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            color: colors.text,
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '600',
          }}>
            Welcome to LearnSmart Dashboard
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: '16px',
          }}>
            Choose a section to get started
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textAlign: 'center',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${card.color}20`,
                },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${card.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: card.color,
              }}>
                {card.icon}
              </div>
              <h3 style={{
                color: colors.text,
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: '600',
              }}>
                {card.title}
              </h3>
              <p style={{
                color: colors.textSecondary,
                fontSize: '14px',
                lineHeight: '1.4',
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: colors.surfaceVariant,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
        }}>
          <p style={{
            color: colors.textSecondary,
            fontSize: '14px',
          }}>
            🎉 <strong>All features from the mobile app are now available on web!</strong>
          </p>
        </div>
      </div>
    </div>
  );
}