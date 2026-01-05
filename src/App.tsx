import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import { MainLayoutWeb } from './layouts/MainLayoutWeb';

// Pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { QAPage } from './pages/QAPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorePage';
import { StudyGroupsPage } from './pages/StudyGroupsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayoutWeb />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="qa-forum" element={<QAPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="study-groups" element={<StudyGroupsPage />} />
          
          {/* Additional routes will be added as components are converted */}
          <Route path="chapters" element={<div>Chapters - Coming Soon</div>} />
          <Route path="lesson" element={<div>Lesson View - Coming Soon</div>} />
          <Route path="leaderboard" element={<div>Leaderboard - Coming Soon</div>} />
          <Route path="notifications" element={<div>Notifications - Coming Soon</div>} />
          <Route path="settings" element={<div>Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;