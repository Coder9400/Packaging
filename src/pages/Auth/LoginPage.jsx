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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Left Panel: Enterprise Branding & Trust Seals (Desktop Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-12 flex-col justify-between border-r border-slate-800/80 overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-emerald-500/10">
              <Recycle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl text-white tracking-tight">Circular</span>
              <span className="font-bold text-xl text-emerald-400 tracking-tight">Exchange</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Enterprise Secondary Raw Materials Network</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Closed-loop packaging management for forward-thinking enterprises.
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Eliminate landfill overhead, monetise industrial surplus packaging, and automate certified Scope 3 GHG carbon offset tracking.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Leaf className="w-4 h-4" />
                <span>12.45+ Tons</span>
              </div>
              <p className="text-[11px] text-slate-400">Landfill Waste Diverted</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
                <Building2 className="w-4 h-4" />
                <span>320+ Facilities</span>
              </div>
              <p className="text-[11px] text-slate-400">Active Generators & Recyclers</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
          <span>EPA WARM 15.0 Standard</span>
          <span>ISO 14044 LCA Accounting</span>
        </div>
      </div>

      {/* Right Panel: Clean Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-12 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Mobile Brand Link */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">Circular Exchange</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise Sign-In
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Access your industrial material streams, RFQs, and circular telemetry.
            </p>
          </div>

          {/* Error Banner for Incorrect Credentials */}
          {authError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Authentication Failed</p>
                <p className="mt-0.5 text-rose-300/90">{authError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span>Remember this terminal</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(formData.email);
                  setIsForgotModalOpen(true);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition"
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
          <div className="pt-6 border-t border-slate-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Demo Test Personas
              </span>
              <Badge variant="teal" size="xs">One-Click Load</Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {availableUsers.slice(0, 2).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  disabled={isLoading || isSuccess}
                  className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between transition text-xs group"
                >
                  <div className="truncate">
                    <p className="font-semibold text-white group-hover:text-emerald-400 transition truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{u.companyName} • {u.role}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition">Select ➔</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have a verified facility account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold">
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
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white">Reset Email Dispatched!</h4>
            <p className="text-xs text-slate-400">
              Please check <span className="text-white font-medium">{forgotEmail}</span> for instructions to reset your password.
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
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
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
