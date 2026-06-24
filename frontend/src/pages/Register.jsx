import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconCheck } from '../components/icons';
import '../styles/auth.css';

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#f87171', '#f59e0b', '#38bdf8', '#34d399'];

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('You must accept the Terms & Conditions.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (strength < 2) { setError('Password is too weak.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a78bfa' }}><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 4-6"/></svg>
          </div>
          <h1>Create Account</h1>
          <p>Join the Software Evolution Predictor platform</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="John Doe" required />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="At least 6 characters" required />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="strength-seg" style={{ background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrap">
              <input id="confirmPassword" type={showCpw ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" required />
              <button type="button" className="pw-toggle" onClick={() => setShowCpw(!showCpw)} aria-label="Toggle password visibility">
                {showCpw ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span className="field-error">Passwords do not match</span>
            )}
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I agree to the <a href="#terms" className="link">Terms &amp; Conditions</a> and <a href="#privacy" className="link">Privacy Policy</a></span>
          </label>

          <button type="submit" disabled={loading || !agreed} className="btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
