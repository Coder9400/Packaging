import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Recycle,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Building2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { validateEmail, validatePassword } from '../../utils/validators';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login, resetPassword, availableUsers = [], isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: 'elena.r@apexgoods.com',
    password: 'password123',
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, redirectPath]);

  // Forgot password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, success: false, error: '' });

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      setIsSuccess(true);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (user) => {
    setFormData({ email: user.email, password: 'password123' });
    setAuthError('');
    setIsLoading(true);
    try {
      await login(user.email, 'password123');
      setIsSuccess(true);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setAuthError(err.message);
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotStatus({ loading: true, success: false, error: '' });

    const emailErr = validateEmail(forgotEmail);
    if (emailErr) {
      setForgotStatus({ loading: false, success: false, error: emailErr });
      return;
    }

    try {
      await resetPassword(forgotEmail);
      setForgotStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setForgotStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Left Panel: Enterprise Branding & Trust Seals (Desktop Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between overflow-hidden text-white shadow-2xl">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-white/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <Recycle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight font-display">SYNAPSE</span>
              <span className="text-[10px] font-bold tracking-widest text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30 uppercase">
                Circular
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Verified Enterprise Secondary Raw Materials Network</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
            Closed-loop packaging management for forward-thinking enterprises.
          </h2>

          <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
            Eliminate landfill overhead, monetise industrial surplus packaging, and automate certified Scope 3 GHG carbon offset tracking.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span>12.45+ Tons</span>
              </div>
              <p className="text-[11px] text-blue-100/80 font-medium">Landfill Waste Diverted</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>320+ Facilities</span>
              </div>
              <p className="text-[11px] text-blue-100/80 font-medium">Active Generators & Recyclers</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-blue-100/80 font-medium">
          <span>EPA WARM 15.0 Standard</span>
          <span>ISO 14044 LCA Accounting</span>
        </div>
      </div>

      {/* Right Panel: Clean Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-12 relative bg-slate-50">
        <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card">
          {/* Mobile Brand Link */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 font-display">SYNAPSE</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Enterprise Sign-In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
              Access your industrial material streams, RFQs, and circular telemetry.
            </p>
          </div>

          {/* Error Banner for Incorrect Credentials */}
          {authError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Authentication Failed</p>
                <p className="mt-0.5 text-rose-700">{authError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 animate-fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Credentials verified! Redirecting to enterprise dashboard...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Business Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. elena.r@apexgoods.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              disabled={isLoading || isSuccess}
              required
            />

            <Input
              label="Secure Password"
              type="password"
              icon={Lock}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              disabled={isLoading || isSuccess}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <span>Remember this terminal</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(formData.email);
                  setIsForgotModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-bold transition"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full mt-2"
              loading={isLoading}
              disabled={isSuccess}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to B2B Portal
            </Button>
          </form>

          {/* Quick Persona Logins for Hackathon Testing */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Demo Test Personas
              </span>
              <Badge variant="blue" size="xs">One-Click Load</Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {availableUsers.slice(0, 2).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  disabled={isLoading || isSuccess}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-left flex items-center justify-between transition text-xs group"
                >
                  <div className="truncate">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{u.companyName} • {u.role}</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 group-hover:translate-x-0.5 transition">Select ➔</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 font-medium">
            Don't have a verified facility account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
              Create Business Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Corporate Account Password"
        subtitle="We will send a secure password reset link to your business email."
      >
        {forgotStatus.success ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-display">Reset Email Dispatched!</h4>
            <p className="text-xs text-slate-500">
              Please check <span className="text-slate-900 font-bold">{forgotEmail}</span> for instructions to reset your password.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4"
              onClick={() => setIsForgotModalOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            {forgotStatus.error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {forgotStatus.error}
              </div>
            )}

            <Input
              label="Registered Business Email"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="ghost" onClick={() => setIsForgotModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={forgotStatus.loading}>
                Send Password Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
