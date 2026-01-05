import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import { MainLayoutWeb } from './layouts/MainLayoutWeb';

// Pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayoutWeb />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Additional routes will be added as components are converted */}
          <Route path="qa-forum" element={<div>QA Forum - Coming Soon</div>} />
          <Route path="profile" element={<div>Profile - Coming Soon</div>} />
          <Route path="explore" element={<div>Explore - Coming Soon</div>} />
          <Route path="study-groups" element={<div>Study Groups - Coming Soon</div>} />
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