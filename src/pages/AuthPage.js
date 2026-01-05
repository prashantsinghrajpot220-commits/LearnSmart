"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPage = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("../context/ThemeContext");
var fa_1 = require("react-icons/fa");
var AuthPage = function () {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(true), isLogin = _a[0], setIsLogin = _a[1];
    var _b = (0, react_1.useState)({
        email: '',
        password: '',
        username: ''
    }), formData = _b[0], setFormData = _b[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        localStorage.setItem('learnsmart_user', JSON.stringify({ email: formData.email }));
        navigate('/dashboard');
    };
    var handleInputChange = function (e) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.value, _a)));
        });
    };
    return (<div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(135deg, ".concat(colors.primary, "20 0%, ").concat(colors.secondary, "20 100%)"),
            padding: '24px'
        }}>
      <div className="web-card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: colors.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
        }}>
            <span style={{ fontSize: '32px', color: 'white' }}>
              🎓
            </span>
          </div>
          <h1 style={{ color: colors.text, marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back!' : 'Join LearnSmart'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (<div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: colors.textSecondary }}>
                <fa_1.FaUser /> Username
              </label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter your username" required className="web-input"/>
            </div>)}
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: colors.textSecondary }}>
              <fa_1.FaEnvelope /> Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required className="web-input"/>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: colors.textSecondary }}>
              <fa_1.FaLock /> Password
            </label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" required className="web-input"/>
          </div>

          <button type="submit" className="web-button web-button-primary" style={{ marginTop: '16px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
            <fa_1.FaArrowRight style={{ marginLeft: '8px' }}/>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: "1px solid ".concat(colors.border) }}>
          <p style={{ color: colors.textSecondary, marginBottom: '8px' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button onClick={function () { return setIsLogin(!isLogin); }} style={{
            background: 'transparent',
            border: 'none',
            color: colors.primary,
            fontWeight: '600',
            cursor: 'pointer'
        }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>);
};
exports.AuthPage = AuthPage;
