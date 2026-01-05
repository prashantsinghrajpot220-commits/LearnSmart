"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomTabNavigatorWeb = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("../context/ThemeContext");
var fa_1 = require("react-icons/fa");
var tabs = [
    { path: '/dashboard', icon: <fa_1.FaHome />, label: 'Home' },
    { path: '/chapters', icon: <fa_1.FaBook />, label: 'Study' },
    { path: '/qa-forum', icon: <fa_1.FaQuestionCircle />, label: 'Q&A' },
    { path: '/study-groups', icon: <fa_1.FaUsers />, label: 'Groups' },
    { path: '/profile', icon: <fa_1.FaUser />, label: 'Profile' },
];
var BottomTabNavigatorWeb = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var isActive = function (path) {
        return location.pathname === path ||
            (path === '/dashboard' && location.pathname === '/');
    };
    return (<div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            borderTop: "1px solid ".concat(colors.border),
            display: 'flex',
            justifyContent: 'space-around',
            padding: '8px 0',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
        }}>
      {tabs.map(function (tab) {
            var active = isActive(tab.path);
            return (<button key={tab.path} onClick={function () { return navigate(tab.path); }} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    minWidth: '60px',
                }}>
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
            {active && (<div style={{
                        position: 'absolute',
                        bottom: '4px',
                        width: '24px',
                        height: '3px',
                        backgroundColor: colors.primary,
                        borderRadius: '2px',
                    }}/>)}
          </button>);
        })}
    </div>);
};
exports.BottomTabNavigatorWeb = BottomTabNavigatorWeb;
