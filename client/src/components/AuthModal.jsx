import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Briefcase, Building, Loader, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, initialView = 'login', initialRole = 'candidate' }) => {
    const [view, setView] = useState(initialView); // 'login' or 'register'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Sync state with props when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setRegisterData(prev => ({ ...prev, role: initialRole || 'candidate' }));
            setError('');
        }
    }, [isOpen, initialView, initialRole]);

    // Form states
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: initialRole || 'candidate',
        companyName: ''
    });
    const [verificationData, setVerificationData] = useState({ userId: '', email: '', otp: '' });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (data.success) {
                login(data.user);
                onClose();
                const targetPath = data.user.role === 'admin' ? '/admin' : (data.user.role === 'employer' ? '/employer-dashboard' : '/find-jobs');
                navigate(targetPath);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await response.json();
            if (data.success) {
                setVerificationData({ userId: data.userId, email: registerData.email, otp: '' });
                setView('verify');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: verificationData.userId, otp: verificationData.otp }),
            });
            const data = await response.json();
            if (data.success) {
                login(data.user);
                onClose();
                const targetPath = data.user.role === 'employer' ? '/employer-dashboard' : '/find-jobs';
                navigate(targetPath);
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                    role: view === 'register' ? registerData.role : undefined
                }),
            });
            const data = await response.json();
            if (data.success) {
                login(data.user);
                onClose();
                navigate(data.user.role === 'employer' ? '/employer-dashboard' : '/find-jobs');
            } else {
                setError(data.message || 'Google login failed');
            }
        } catch (err) {
            setError('Google login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    className="relative w-full max-w-[380px] bg-white rounded-[2rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] border border-slate-100 no-scrollbar"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-10"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-6">
                        {/* Header */}
                        <div className="text-center mb-6 pt-2">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                {view === 'login' ? 'Welcome Back' : view === 'verify' ? 'Verify OTP' : 'Create Account'}
                            </h2>
                            <p className="text-slate-500 mt-1 text-[13px] font-medium">
                                {view === 'login' ? `Sign in as ${registerData.role === 'employer' ? 'Employer' : 'Worker'}` : view === 'verify' ? `OTP sent to ${verificationData.email}` : 'Join our community'}
                            </p>
                        </div>

                        {view !== 'verify' && (
                            <>
                                {/* Role Selection Tabs */}
                                <div className="flex bg-slate-50 p-1 rounded-[14px] mb-5 border border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setRegisterData({ ...registerData, role: 'candidate' })}
                                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${registerData.role === 'candidate' ? 'bg-white shadow-sm text-primary border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <User size={12} /> Worker
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRegisterData({ ...registerData, role: 'employer' })}
                                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${registerData.role === 'employer' ? 'bg-white shadow-sm text-primary border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <Briefcase size={12} /> Employer
                                    </button>
                                </div>

                                <div className="flex justify-center mb-4 scale-90">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google Login Failed')}
                                        useOneTap
                                        theme="outline"
                                        shape="pill"
                                        width="100%"
                                    />
                                </div>

                                <div className="relative flex items-center gap-3 mb-5">
                                    <div className="flex-grow border-t border-slate-50"></div>
                                    <span className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">or continue with email</span>
                                    <div className="flex-grow border-t border-slate-50"></div>
                                </div>
                            </>
                        )}

                        <form onSubmit={view === 'login' ? handleLoginSubmit : view === 'verify' ? handleVerifySubmit : handleRegisterSubmit} className="space-y-3.5">
                            {view === 'register' && (
                                <>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
                                            placeholder="Full Name"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Phone className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
                                            placeholder="Mobile Number"
                                            value={registerData.mobile}
                                            onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {view !== 'verify' && (
                                <>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
                                            placeholder="Email address"
                                            value={view === 'login' ? loginData.email : registerData.email}
                                            onChange={(e) => view === 'login'
                                                ? setLoginData({ ...loginData, email: e.target.value })
                                                : setRegisterData({ ...registerData, email: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
                                            placeholder="Password"
                                            value={view === 'login' ? loginData.password : registerData.password}
                                            onChange={(e) => view === 'login'
                                                ? setLoginData({ ...loginData, password: e.target.value })
                                                : setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            {view === 'verify' && (
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength="4"
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                                        placeholder="••••"
                                        value={verificationData.otp}
                                        onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            )}

                            {view === 'login' && (
                                <div className="flex justify-end pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => { onClose(); navigate('/forgot-password'); }}
                                        className="text-[11px] font-bold text-primary hover:text-teal-700 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-500 text-[11px] p-2.5 rounded-xl border border-red-100 text-center font-bold"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 text-[13px] font-bold rounded-2xl text-white bg-primary hover:bg-teal-700 transition-all shadow-md active:scale-[0.98]"
                            >
                                {isSubmitting ? <Loader size={16} className="animate-spin" /> : (
                                    view === 'login' ? <>Sign In <ArrowRight size={14} /></> : view === 'verify' ? 'Confirm OTP' : 'Verify & Join'
                                )}
                            </button>

                            {view !== 'verify' && (
                                <div className="text-center pt-2">
                                    <p className="text-[12px] text-slate-400 font-medium">
                                        {view === 'login' ? "New to Uliyar?" : "Already a member?"}{' '}
                                        <button
                                            type="button"
                                            onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                            className="font-bold text-primary hover:text-teal-700 underline underline-offset-4 decoration-primary/20"
                                        >
                                            {view === 'login' ? 'Create Account' : 'Log In'}
                                        </button>
                                    </p>
                                </div>
                            )}

                            {view === 'verify' && (
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setView('register')}
                                        className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Back to Register
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
