import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes.constants';
import { Rocket, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, Lock, Mail, User } from 'lucide-react';
import '../styles/global.css';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-grid-pattern" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl) var(--space-md)',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      {/* Top Back Link */}
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: 'var(--space-lg)' }}>
        <Link to={ROUTES.HOME} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-muted)',
          transition: 'color var(--transition-fast)',
        }}>
          <ArrowLeft size={16} />
          Back to CollabSphere
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: 'clamp(var(--space-xl), 5vw, var(--space-2xl))',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Rocket size={24} />
          </div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-xs)' }}>
            Create an account
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Join CollabSphere to discover projects and build software teams.
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-sm)',
            color: '#DC2626',
            fontSize: 'var(--font-size-sm)',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Full Name Field */}
          <div>
            <label htmlFor="name" style={labelStyle}>
              Full Name
            </label>
            <div style={inputWrapperStyle}>
              <User size={18} color="var(--color-text-subtle)" style={{ marginLeft: '12px' }} />
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label htmlFor="email" style={labelStyle}>
              University Email Address
            </label>
            <div style={inputWrapperStyle}>
              <Mail size={18} color="var(--color-text-subtle)" style={{ marginLeft: '12px' }} />
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@university.edu"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={inputWrapperStyle}>
              <Lock size={18} color="var(--color-text-subtle)" style={{ marginLeft: '12px' }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-subtle)',
                  cursor: 'pointer',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: 'var(--font-size-base)',
              marginTop: 'var(--space-xs)',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Creating account...
              </>
            ) : (
              'Create Student Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-xl)',
          paddingTop: 'var(--space-lg)',
          borderTop: '1px solid var(--color-border-subtle)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
        }}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-weight-bold)' }}>
            Log in
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-main)',
  marginBottom: 'var(--space-xs)',
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--color-bg-primary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  transition: 'border-color var(--transition-fast)',
};

const inputStyle = {
  flex: 1,
  background: 'none',
  border: 'none',
  outline: 'none',
  padding: '0.75rem 0.85rem',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-main)',
  fontFamily: 'var(--font-sans)',
};
