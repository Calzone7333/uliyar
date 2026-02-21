import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Briefcase, Building, Loader, Phone, ArrowRight, ShieldCheck, ChevronDown, Globe } from 'lucide-react';
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
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    className="relative w-full max-w-[700px] min-h-[450px] md:h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-100"
                >
                    {/* Close Button Mobile/Tablet */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    {/* Left Side Image Panel */}
                    <div className="hidden md:flex md:w-[45%] p-2">
                        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-slate-900 border border-slate-900/10">
                            <img
                                src={registerData.role === 'employer'
                                    ? "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1500&auto=format&fit=crop"
                                    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1500&auto=format&fit=crop"}
                                alt="Contextual Login Background"
                                className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/30"></div>

                            <div className="relative z-10 w-full h-full flex flex-col justify-between p-8">
                                <div className="flex justify-between items-center text-white">
                                    <span className="font-bold text-sm tracking-tight text-white/90">Uliyar Works</span>
                                    <button
                                        onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                        className="text-[11px] font-bold border border-white/20 rounded-full py-1.5 px-4 hover:bg-white/10 transition-colors backdrop-blur-sm"
                                    >
                                        {view === 'login' ? 'Sign Up' : 'Log In'}
                                    </button>
                                </div>

                                <div className="flex justify-between items-end text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden shadow-lg shadow-black/20">
                                            {registerData.role === 'employer' ? <Building size={18} className="text-white" /> : <Briefcase size={18} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{registerData.role === 'employer' ? "Find Top Talent" : "Grow Your Career"}</p>
                                            <p className="text-[11px] text-white/70 font-medium">{registerData.role === 'employer' ? "Connect with skilled workers & manage team" : "Connect with top employers"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm"><ArrowRight className="scale-x-[-1]" size={14} /></div>
                                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm"><ArrowRight size={14} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Form Panel */}
                    <div className="w-full md:w-[55%] flex flex-col p-6 md:p-8 relative overflow-y-auto no-scrollbar">

                        {/* Form Welcome Header */}
                        <div className="mb-6 text-center">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                                {view === 'verify' ? 'Verify OTP' : (registerData.role === 'employer' ? (view === 'login' ? 'Employer / Admin' : 'Join as Employer') : (view === 'login' ? 'Hi Worker' : 'Join as Worker'))}
                            </h2>
                            <p className="text-slate-500 text-[13px] font-medium">
                                {view === 'verify' ? `OTP sent to ${verificationData.email}` : 'Welcome to Uliyar platform'}
                            </p>
                        </div>

                        <form onSubmit={view === 'login' ? handleLoginSubmit : view === 'verify' ? handleVerifySubmit : handleRegisterSubmit} className="space-y-4 flex-1 flex flex-col max-w-[320px] mx-auto w-full">

                            {/* Inputs */}
                            <div className="space-y-3.5 flex-1 w-full">
                                {view === 'register' && (
                                    <>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="Full Name"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            required
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="Mobile Number"
                                            value={registerData.mobile}
                                            onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                                        />
                                        {registerData.role === 'employer' && (
                                            <input
                                                type="text"
                                                required
                                                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="Company Name"
                                                value={registerData.companyName || ''}
                                                onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                                            />
                                        )}
                                    </>
                                )}

                                {view !== 'verify' && (
                                    <>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="Email address"
                                            value={view === 'login' ? loginData.email : registerData.email}
                                            onChange={(e) => view === 'login'
                                                ? setLoginData({ ...loginData, email: e.target.value })
                                                : setRegisterData({ ...registerData, email: e.target.value })
                                            }
                                        />
                                        <input
                                            type="password"
                                            required
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="Password"
                                            value={view === 'login' ? loginData.password : registerData.password}
                                            onChange={(e) => view === 'login'
                                                ? setLoginData({ ...loginData, password: e.target.value })
                                                : setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                        />
                                    </>
                                )}

                                {view === 'verify' && (
                                    <input
                                        type="text"
                                        required
                                        maxLength="4"
                                        className="block w-full px-4 py-4 bg-white border border-slate-200 rounded-[12px] text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-300"
                                        placeholder="••••"
                                        value={verificationData.otp}
                                        onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                                        autoFocus
                                    />
                                )}

                                {view === 'login' && (
                                    <div className="flex justify-end pt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => { onClose(); navigate('/forgot-password'); }}
                                            className="text-[11px] font-bold text-primary hover:text-teal-700 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-[11px] text-center font-bold"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Or Divider & Google Logic */}
                            {view !== 'verify' && (
                                <div className="mt-1 mb-1">
                                    <div className="relative flex items-center gap-3 mb-4">
                                        <div className="flex-grow border-t border-slate-200"></div>
                                        <span className="text-slate-800 text-[10px] font-bold lowercase tracking-widest bg-white">or</span>
                                        <div className="flex-grow border-t border-slate-200"></div>
                                    </div>

                                    <div className="flex justify-center mb-5 hover:opacity-90 transition-opacity rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => setError('Google Login Failed')}
                                            useOneTap
                                            theme="outline"
                                            size="large"
                                            width="320"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Main Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 text-[13px] font-bold rounded-full text-white transition-all shadow-md mt-auto bg-primary hover:bg-teal-700 shadow-primary/20`}
                            >
                                {isSubmitting ? <Loader size={16} className="animate-spin" /> : (
                                    view === 'login' ? 'Login' : view === 'verify' ? 'Confirm OTP' : 'Sign Up'
                                )}
                            </button>

                            {/* Switch Modes */}
                            {view !== 'verify' && (
                                <div className="text-center pt-1 pb-1">
                                    <p className="text-[12px] text-slate-500 font-medium tracking-tight">
                                        {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                                        <button
                                            type="button"
                                            onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                            className="font-bold text-primary hover:text-teal-700 transition-colors"
                                        >
                                            {view === 'login' ? 'Sign up' : 'Login'}
                                        </button>
                                    </p>
                                    {registerData.role === 'employer' && view === 'register' && (
                                        <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-1">
                                            Admin accounts cannot sign up here. Please <button type="button" onClick={() => setView('login')} className="underline text-primary">login</button>.
                                        </p>
                                    )}
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
