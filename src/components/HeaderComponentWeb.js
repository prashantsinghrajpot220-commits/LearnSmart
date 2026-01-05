"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderComponentWeb = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("../context/ThemeContext");
var fa_1 = require("react-icons/fa");
var HeaderComponentWeb = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var getTitle = function () {
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
    var showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';
    var showSearchButton = ['/qa-forum', '/study-groups'].includes(location.pathname);
    return (<div style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: colors.surface,
            borderBottom: "1px solid ".concat(colors.border),
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBackButton && (<button onClick={function () { return navigate(-1); }} style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: colors.text,
            }}>
            <fa_1.FaArrowLeft size={18}/>
          </button>)}
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
        {showSearchButton && (<button onClick={function () { return console.log('Search clicked'); }} style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: colors.textSecondary,
            }}>
            <fa_1.FaSearch size={18}/>
          </button>)}
        
        <button onClick={function () { return navigate('/notifications'); }} style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: colors.textSecondary,
            position: 'relative',
        }}>
          <fa_1.FaBell size={18}/>
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: colors.error,
            borderRadius: '50%',
            display: 'none', // Show when notifications exist
        }}/>
        </button>

        <button onClick={function () { return navigate('/settings'); }} style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: colors.textSecondary,
        }}>
          <fa_1.FaCog size={18}/>
        </button>
      </div>
    </div>);
};
exports.HeaderComponentWeb = HeaderComponentWeb;
