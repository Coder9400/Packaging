import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Building2,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validatePhone
} from '../../utils/validators';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: 'Manufacturer',
    location: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = () => {
    const newErrors = {};

    const compErr = validateRequired(formData.companyName, 'Company name');
    if (compErr) newErrors.companyName = compErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const locErr = validateRequired(formData.location, 'Location');
    if (locErr) newErrors.location = locErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    const confErr = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confErr) newErrors.confirmPassword = confErr;

    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the circular exchange trading terms & privacy policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      await register({
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessType: formData.businessType,
        location: formData.location,
        contactName: formData.companyName.split(' ')[0] + ' Lead',
      });

      setIsSuccess(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200">
            <Recycle className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl text-white tracking-tight">Circular</span>
            <span className="font-bold text-xl text-emerald-400 tracking-tight">Exchange</span>
          </div>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Register Enterprise Facility
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Create an audited corporate profile to list surplus packaging materials, submit wholesale RFQs, and automate Scope 3 ESG reporting.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <Card className="p-6 sm:p-10 space-y-6">
          {/* Error Banner */}
          {authError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Registration Failed</p>
                <p className="mt-0.5 text-rose-300/90">{authError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Facility account created successfully! Setting up your enterprise dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Company Name & Business Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Facility Name"
                icon={Building2}
                placeholder="e.g. Apex Consumer Goods Ltd."
                value={formData.companyName}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value });
                  if (errors.companyName) setErrors({ ...errors, companyName: null });
                }}
                error={errors.companyName}
                disabled={isLoading || isSuccess}
                required
              />

              <Select
                label="Business Type"
                options={[
                  'Manufacturer',
                  'Retailer',
                  'Packaging Recycler',
                  'Logistics Provider',
                ]}
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                disabled={isLoading || isSuccess}
              />
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Email"
                type="email"
                icon={Mail}
                placeholder="procurement@company.com"
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
                label="Corporate Phone"
                type="tel"
                icon={Phone}
                placeholder="+1 (312) 555-0192"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                error={errors.phone}
                disabled={isLoading || isSuccess}
                required
              />
            </div>

            {/* Row 3: Location */}
            <Input
              label="Primary Facility Location (City, State / Region)"
              icon={MapPin}
              placeholder="e.g. Chicago, IL or Detroit, MI"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
                if (errors.location) setErrors({ ...errors, location: null });
              }}
              error={errors.location}
              disabled={isLoading || isSuccess}
              required
            />

            {/* Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Account Password"
                type="password"
                icon={Lock}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                error={errors.password}
                disabled={isLoading || isSuccess}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                error={errors.confirmPassword}
                disabled={isLoading || isSuccess}
                required
              />
            </div>

            {/* Compliance Guarantee Callout */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Trust & Chain-of-Custody Standard</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                All registered facilities receive verified ISPM-15, EPA WARM 15.0 carbon accounting, and escrow dispute settlement coverage.
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    setFormData({ ...formData, termsAccepted: e.target.checked });
                    if (errors.terms) setErrors({ ...errors, terms: null });
                  }}
                  disabled={isLoading || isSuccess}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="leading-relaxed">
                  I agree to the <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 font-medium">Circular Trading Terms</Link>, <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 font-medium">Privacy Policy</Link>, and secondary material inspection protocols.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-rose-400 mt-1 pl-6">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
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
              Create Business Account
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-850 text-center text-xs text-slate-400">
            Already have a registered enterprise account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              Sign In to B2B Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
