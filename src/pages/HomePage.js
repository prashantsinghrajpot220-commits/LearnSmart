"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("../context/ThemeContext");
var HomePage = function () {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (<div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(135deg, ".concat(colors.primary, "20 0%, ").concat(colors.secondary, "20 100%)")
        }}>
      <div className="web-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: colors.primary, marginBottom: '16px' }}>
          🎓 LearnSmart
        </h1>
        <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
          Free Indian Education Platform - Now on the Web!
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="web-button web-button-primary" onClick={function () { return navigate('/dashboard'); }}>
            📚 Browse Curriculum
          </button>
          
          <button className="web-button web-button-secondary" onClick={function () { return navigate('/qa-forum'); }}>
            💬 Q&A Forum
          </button>
          
          <button className="web-button web-button-secondary" onClick={function () { return navigate('/study-groups'); }}>
            👥 Study Groups
          </button>
          
          <button className="web-button web-button-secondary" onClick={function () { return navigate('/explore'); }}>
            🎯 Explore Features
          </button>
        </div>
        
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: "1px solid ".concat(colors.border) }}>
          <p style={{ fontSize: '12px', color: colors.textSecondary }}>
            ✨ All your learning features now available on the web
          </p>
        </div>
      </div>
    </div>);
};
exports.HomePage = HomePage;
