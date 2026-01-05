"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayoutWeb = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("../context/ThemeContext");
var BottomTabNavigatorWeb_1 = require("../components/BottomTabNavigatorWeb");
var HeaderComponentWeb_1 = require("../components/HeaderComponentWeb");
var MainLayoutWeb = function () {
    var _a = (0, ThemeContext_1.useTheme)(), theme = _a.theme, colors = _a.colors;
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), isLoaded = _b[0], setIsLoaded = _b[1];
    (0, react_1.useEffect)(function () {
        // Simulate app initialization
        var timer = setTimeout(function () {
            setIsLoaded(true);
        }, 100);
        return function () { return clearTimeout(timer); };
    }, []);
    if (!isLoaded) {
        return (<div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background
            }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: colors.text }}>Loading LearnSmart...</h2>
          <div style={{ marginTop: '16px' }}>
            <div className="web-spinner" style={{
                width: '40px',
                height: '40px',
                border: "4px solid ".concat(colors.border),
                borderTop: "4px solid ".concat(colors.primary),
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
            }}/>
          </div>
        </div>
      </div>);
    }
    var hideBottomNav = ['/auth', '/'].includes(location.pathname);
    return (<div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.background,
            color: colors.text
        }} className={"app-".concat(theme)}>
      <HeaderComponentWeb_1.HeaderComponentWeb />
      
      <main style={{
            flex: 1,
            paddingBottom: hideBottomNav ? '0px' : '80px'
        }}>
        <react_router_dom_1.Outlet />
      </main>

      {!hideBottomNav && <BottomTabNavigatorWeb_1.BottomTabNavigatorWeb />}

      <style jsx>{"\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n      "}</style>
    </div>);
};
exports.MainLayoutWeb = MainLayoutWeb;
