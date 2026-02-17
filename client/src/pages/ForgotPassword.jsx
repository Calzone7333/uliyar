import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Mail, Lock, ArrowRight, Loader, CheckCircle, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (data.success) {
                setStep(2);
                setSuccess('OTP has been sent to your email.');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                }),
            });
            const data = await response.json();
            if (data.success) {
                setSuccess('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop")' }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
                    <div className="text-center mb-8">
                        <div className="bg-[#031d31] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg -rotate-3">
                            <span className="text-white font-bold text-2xl">U</span>
                        </div>
                        <h2 className="text-3xl font-bold text-[#031d31]">
                            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            {step === 1
                                ? "No worries, it happens. We'll send you an OTP."
                                : "Check your email for the code and set a new password."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center">{error}</div>}
                            {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-100 text-center flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> {success}
                            </div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#031d31] hover:bg-blue-900 transition-all shadow-lg"
                            >
                                {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    maxLength="4"
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all text-center text-2xl tracking-[1em] font-bold"
                                    placeholder="0000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                />
                                <p className="text-[10px] text-center text-gray-400 mt-1 uppercase font-bold tracking-wider">Enter 4-Digit OTP</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                                    placeholder="New Password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>

                            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center">{error}</div>}
                            {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-100 text-center flex items-center justify-center gap-2 font-bold">
                                <CheckCircle size={16} /> {success}
                            </div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#031d31] hover:bg-blue-900 transition-all shadow-lg"
                            >
                                {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
