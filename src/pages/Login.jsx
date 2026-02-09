import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user);
                if (data.user.role === 'employer') {
                    navigate('/employer-dashboard');
                } else {
                    navigate('/find-jobs');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user);
                if (data.user.role === 'employer') {
                    navigate('/employer-dashboard');
                } else {
                    navigate('/find-jobs');
                }
            } else {
                setError(data.message || 'Google login failed');
            }
        } catch (err) {
            setError('Google login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop")' }}>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-md p-4 animate-in zoom-in duration-300 slide-in-from-bottom-8">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                            <span className="text-white font-bold text-2xl">U</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2 font-medium">Sign in to find work or hire talent</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 px-4 py-3.5 bg-slate-50 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 px-4 py-3.5 bg-slate-50 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:text-teal-700 hover:underline transition-all">
                                Forgot Password?
                            </Link>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center justify-center font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : (
                                <>Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Or</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Login Failed')}
                                useOneTap
                                theme="outline"
                                shape="pill"
                                width="100%"
                            />
                        </div>


                        <div className="text-center pt-2">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-bold text-primary hover:text-teal-700 hover:underline transition-all">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center text-white/60 text-xs mt-6 font-medium">
                    &copy; 2024 BlueCaller. Trust & Safety First.
                </p>
            </div>
        </div>
    );
};

export default Login;
