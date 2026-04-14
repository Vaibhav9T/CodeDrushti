import { useState, useEffect } from "react";

const MAUVE = "#9c6b7a";

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #c08070;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  input::placeholder { color: #c0b0c0; }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px white inset; }

  .auth-card {
    width: 100%;
    max-width: 1100px;
    min-height: 600px;
    background: #f4f1f4;
    border-radius: 28px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(80,40,50,0.28), 0 8px 24px rgba(80,40,50,0.12);
    position: relative;
  }

  /* LEFT PANEL */
  .form-panel {
    position: relative;
    padding: 60px 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    min-height: 600px;
  }

  .form-slide {
    position: absolute;
    inset: 0;
    padding: 60px 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s ease;
    will-change: transform, opacity;
  }

  .form-slide.active {
    transform: translateX(0);
    opacity: 1;
    pointer-events: all;
  }

  .form-slide.exit-left {
    transform: translateX(-60px);
    opacity: 0;
    pointer-events: none;
  }

  .form-slide.exit-right {
    transform: translateX(60px);
    opacity: 0;
    pointer-events: none;
  }

  .form-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 38px;
    font-weight: 700;
    color: #1a1020;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 8px;
  }

  .form-subtitle {
    font-size: 13.5px;
    color: #8a7a8a;
    margin-bottom: 32px;
    font-weight: 400;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  .input-wrap {
    position: relative;
  }

  .input-wrap input {
    width: 100%;
    padding: 15px 20px;
    border-radius: 14px;
    border: 1.5px solid #e4dce4;
    background: white;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #2a2035;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  .input-wrap input:focus {
    border-color: ${MAUVE};
    box-shadow: 0 0 0 3px ${MAUVE}20, 0 2px 6px rgba(0,0,0,0.04);
  }

  .input-wrap .eye-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #b0a0b0;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: color 0.2s;
  }
  .input-wrap .eye-btn:hover { color: #7a5a6a; }

  .recovery-link {
    text-align: right;
    margin-bottom: 22px;
    margin-top: -4px;
  }
  .recovery-link a {
    font-size: 13px;
    color: #9a8a9a;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .recovery-link a:hover { color: ${MAUVE}; }

  .primary-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #9c6b7a 0%, #7a5260 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 24px ${MAUVE}45;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    letter-spacing: 0.01em;
    margin-bottom: 18px;
  }
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px ${MAUVE}55;
  }
  .primary-btn:active { transform: translateY(0); }
  .primary-btn:disabled {
    background: #c0a0a8;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  .switch-text {
    font-size: 13.5px;
    color: #9a8a9a;
    margin-bottom: 28px;
  }
  .switch-text a {
    color: ${MAUVE};
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
  }
  .switch-text a:hover { color: #7a4050; }

  .divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .divider-line { flex: 1; height: 1px; background: #e0d8e0; }
  .divider-label { font-size: 12.5px; color: #b0a0b0; white-space: nowrap; }

  .social-row {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .social-btn {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    border: 1.5px solid #e8e0e8;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s, transform 0.15s;
  }
  .social-btn:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.13);
    transform: translateY(-2px);
  }

  /* RIGHT PANEL */
  .illustration-panel {
    position: relative;
    border-radius: 22px;
    margin: 12px 12px 12px 0;
    overflow: hidden;
    background: linear-gradient(160deg, #d4956a 0%, #c8836e 20%, #b07a8a 45%, #8a7aa8 70%, #7a8ab8 100%);
  }

  .illustration-panel svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .panel-caption {
    position: absolute;
    bottom: 28px;
    left: 28px;
    right: 28px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .panel-caption p {
    color: rgba(255,255,255,0.93);
    font-size: 16px;
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    letter-spacing: 0.02em;
    line-height: 1.55;
  }

  .nav-btns {
    display: flex;
    gap: 8px;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-size: 13px;
    transition: background 0.2s;
    backdrop-filter: blur(4px);
  }
  .nav-btn:hover { background: rgba(255,255,255,0.28); }

  /* Responsive */
  @media (max-width: 820px) {
    .auth-card {
      grid-template-columns: 1fr;
      max-width: 480px;
    }
    .illustration-panel {
      display: none;
    }
    .form-slide {
      padding: 48px 36px;
    }
  }

  @media (max-width: 480px) {
    body { padding: 16px; }
    .form-slide { padding: 40px 24px; }
    .form-title { font-size: 30px; }
  }
`;

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IllustrationSVG = () => (
  <svg viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c07070"/>
        <stop offset="40%" stopColor="#d4956a"/>
        <stop offset="70%" stopColor="#c8836e"/>
        <stop offset="100%" stopColor="#9a7a9a"/>
      </linearGradient>
      <radialGradient id="sunGrad" cx="50%" cy="45%" r="18%">
        <stop offset="0%" stopColor="#fff9c4" stopOpacity="1"/>
        <stop offset="60%" stopColor="#ffe082" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#ffb74d" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="glowGrad" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stopColor="#ffe082" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="#ffb74d" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="500" height="600" fill="url(#skyGrad)"/>
    <ellipse cx="250" cy="260" rx="180" ry="150" fill="url(#glowGrad)"/>
    <circle cx="250" cy="260" r="52" fill="url(#sunGrad)"/>
    <path d="M0 380 Q80 340 160 355 Q240 370 320 348 Q400 326 500 345 L500 600 L0 600Z" fill="#8a7aaa" opacity="0.7"/>
    <path d="M0 400 Q100 375 200 388 Q300 401 400 378 Q450 366 500 372 L500 600 L0 600Z" fill="#7a6a9a" opacity="0.85"/>
    <path d="M0 430 Q120 410 230 420 Q350 430 500 410 L500 600 L0 600Z" fill="#6a5a8a" opacity="0.9"/>
    <path d="M320 340 Q360 280 400 340Z" fill="#5a5070" opacity="0.8"/>
    <path d="M350 340 Q395 270 440 340Z" fill="#4a4060" opacity="0.7"/>
    <path d="M0 420 Q60 390 120 400 L120 600 L0 600Z" fill="#5a5070" opacity="0.75"/>
    <ellipse cx="340" cy="330" rx="30" ry="12" fill="#2a2035" opacity="0.7"/>
    <line x1="340" y1="318" x2="340" y2="295" stroke="#2a2035" strokeWidth="1.5" opacity="0.8"/>
    <circle cx="340" cy="292" r="5" fill="#2a2035" opacity="0.8"/>
    <line x1="335" y1="296" x2="328" y2="290" stroke="#2a2035" strokeWidth="1.2" opacity="0.8"/>
    <line x1="345" y1="296" x2="352" y2="290" stroke="#2a2035" strokeWidth="1.2" opacity="0.8"/>
    <line x1="338" y1="294" x2="332" y2="287" stroke="#2a2035" strokeWidth="1" opacity="0.7"/>
    <line x1="342" y1="294" x2="348" y2="287" stroke="#2a2035" strokeWidth="1" opacity="0.7"/>
    <path d="M380 310 Q410 290 430 305 Q410 310 380 310Z" fill="#2a2035" opacity="0.6"/>
    <path d="M385 308 Q415 285 440 300 Q415 305 385 308Z" fill="#2a2035" opacity="0.5"/>
    <line x1="170" y1="580" x2="170" y2="490" stroke="#1a1525" strokeWidth="2.5"/>
    <line x1="170" y1="530" x2="155" y2="510" stroke="#1a1525" strokeWidth="1.5"/>
    <line x1="170" y1="520" x2="185" y2="500" stroke="#1a1525" strokeWidth="1.5"/>
    <line x1="170" y1="540" x2="152" y2="520" stroke="#1a1525" strokeWidth="1.2"/>
    <line x1="220" y1="580" x2="220" y2="488" stroke="#1a1525" strokeWidth="2.5"/>
    <line x1="220" y1="525" x2="205" y2="505" stroke="#1a1525" strokeWidth="1.5"/>
    <line x1="220" y1="515" x2="235" y2="495" stroke="#1a1525" strokeWidth="1.5"/>
    <line x1="260" y1="580" x2="260" y2="500" stroke="#1a1525" strokeWidth="2"/>
    <line x1="260" y1="540" x2="248" y2="522" stroke="#1a1525" strokeWidth="1.3"/>
    <line x1="260" y1="530" x2="272" y2="512" stroke="#1a1525" strokeWidth="1.3"/>
    <line x1="130" y1="580" x2="130" y2="505" stroke="#1a1525" strokeWidth="2"/>
    <line x1="130" y1="545" x2="118" y2="525" stroke="#1a1525" strokeWidth="1.3"/>
  </svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [transitioning, setTransitioning] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const switchTo = (target) => {
    if (target === mode || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setMode(target);
      setForm({ name: "", email: "", password: "", confirm: "" });
      setShowPwd(false);
      setShowConfirmPwd(false);
      setTimeout(() => setTransitioning(false), 50);
    }, 320);
  };

  const loginSlideClass = mode === "login"
    ? (transitioning ? "form-slide exit-left" : "form-slide active")
    : "form-slide exit-right";

  const registerSlideClass = mode === "register"
    ? (transitioning ? "form-slide exit-right" : "form-slide active")
    : "form-slide exit-left";

  return (
    <>
      <style>{globalCSS}</style>
      <div className="auth-card">
        {/* LEFT: FORM PANEL */}
        <div className="form-panel">

          {/* LOGIN */}
          <div className={loginSlideClass}>
            <h1 className="form-title">Hello Again!</h1>
            <p className="form-subtitle">Let's get started with your 30 days trial</p>

            <div className="input-group">
              <div className="input-wrap">
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="input-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: "48px" }}
                />
                <button className="eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  <EyeIcon open={showPwd}/>
                </button>
              </div>
            </div>

            <div className="recovery-link">
              <a href="#">Recovery Password</a>
            </div>

            <button className="primary-btn">Sign In</button>

            <p className="switch-text">
              Don't have an account?{" "}
              <a onClick={() => switchTo("register")}>Register</a>
            </p>

            <div className="divider">
              <div className="divider-line"/>
              <span className="divider-label">Or continue with</span>
              <div className="divider-line"/>
            </div>

            <div className="social-row">
              <button className="social-btn"><GoogleIcon/></button>
              <button className="social-btn"><AppleIcon/></button>
              <button className="social-btn"><FacebookIcon/></button>
            </div>
          </div>

          {/* REGISTER */}
          <div className={registerSlideClass}>
            <h1 className="form-title">Create account</h1>
            <p className="form-subtitle">Let's get started with your 30 days trial</p>

            <div className="input-group">
              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="input-wrap">
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="input-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: "48px" }}
                />
                <button className="eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  <EyeIcon open={showPwd}/>
                </button>
              </div>
            </div>

            <button className="primary-btn" style={{ marginTop: "4px" }}>Create account</button>

            <p className="switch-text">
              Already have an account?{" "}
              <a onClick={() => switchTo("login")}>Login</a>
            </p>

            <div className="divider">
              <div className="divider-line"/>
              <span className="divider-label">Or continue with</span>
              <div className="divider-line"/>
            </div>

            <div className="social-row">
              <button className="social-btn"><GoogleIcon/></button>
              <button className="social-btn"><AppleIcon/></button>
              <button className="social-btn"><FacebookIcon/></button>
            </div>
          </div>

        </div>

        {/* RIGHT: ILLUSTRATION */}
        <div className="illustration-panel">
          <IllustrationSVG/>
          <div className="panel-caption">
            <p>Finally, all your work<br/>in one place.</p>
            <div className="nav-btns">
              <button className="nav-btn">←</button>
              <button className="nav-btn">→</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}