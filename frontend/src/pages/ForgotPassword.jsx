import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const STEPS = ['enter', 'otp', 'reset', 'done'];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email or phone.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); }, 1200);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) { setError('Enter a valid OTP.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1000);
  };

  const resetPassword = (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a78bfa' }}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9.5 12l1.8 1.8 3.2-3.6"/></svg>
          </div>
          {step === 0 && <><h1>Forgot Password</h1><p>Enter your email or phone to reset</p></>}
          {step === 1 && <><h1>Verify OTP</h1><p>Enter the code sent to {email}</p></>}
          {step === 2 && <><h1>New Password</h1><p>Set a new password for your account</p></>}
          {step === 3 && <><h1>All Set!</h1><p>Your password has been reset successfully.</p></>}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Step indicators */}
        <div className="step-indicators">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot${i <= step ? ' active' : ''}`} />
          ))}
        </div>

        {step === 0 && (
          <form onSubmit={sendOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email or Phone Number</label>
              <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com or +1234567890" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={verifyOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} required style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: 20, fontWeight: 700 }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Verifying...' : 'Verify Code'}</button>
            <button type="button" className="btn-link" onClick={() => setStep(0)}>Resend Code</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPw">New Password</label>
              <div className="input-wrap">
                <input id="newPw" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPw">Confirm Password</label>
              <input id="confirmPw" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}

        {step === 3 && (
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>&#10003;</div>
            <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: 13 }}>Back to Login</Link>
          </div>
        )}

        {step < 3 && (
          <div className="auth-footer">
            <p>Remember your password? <Link to="/login" className="link">Login here</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
