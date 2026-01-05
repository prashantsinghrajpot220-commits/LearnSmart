"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./App.css");
// Layout
var MainLayoutWeb_1 = require("./layouts/MainLayoutWeb");
// Pages
var HomePage_1 = require("./pages/HomePage");
var AuthPage_1 = require("./pages/AuthPage");
var DashboardPage_1 = require("./pages/DashboardPage");
var QAPage_1 = require("./pages/QAPage");
var ProfilePage_1 = require("./pages/ProfilePage");
var ExplorePage_1 = require("./pages/ExplorePage");
var StudyGroupsPage_1 = require("./pages/StudyGroupsPage");
function App() {
    return (<div className="App">
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<MainLayoutWeb_1.MainLayoutWeb />}>
          <react_router_dom_1.Route index element={<HomePage_1.HomePage />}/>
          <react_router_dom_1.Route path="auth" element={<AuthPage_1.AuthPage />}/>
          <react_router_dom_1.Route path="dashboard" element={<DashboardPage_1.DashboardPage />}/>
          <react_router_dom_1.Route path="qa-forum" element={<QAPage_1.QAPage />}/>
          <react_router_dom_1.Route path="profile" element={<ProfilePage_1.ProfilePage />}/>
          <react_router_dom_1.Route path="explore" element={<ExplorePage_1.ExplorePage />}/>
          <react_router_dom_1.Route path="study-groups" element={<StudyGroupsPage_1.StudyGroupsPage />}/>
          
          {/* Additional routes will be added as components are converted */}
          <react_router_dom_1.Route path="chapters" element={<div>Chapters - Coming Soon</div>}/>
          <react_router_dom_1.Route path="lesson" element={<div>Lesson View - Coming Soon</div>}/>
          <react_router_dom_1.Route path="leaderboard" element={<div>Leaderboard - Coming Soon</div>}/>
          <react_router_dom_1.Route path="notifications" element={<div>Notifications - Coming Soon</div>}/>
          <react_router_dom_1.Route path="settings" element={<div>Settings - Coming Soon</div>}/>
        </react_router_dom_1.Route>
      </react_router_dom_1.Routes>
    </div>);
}
exports.default = App;
