import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader, ArrowRight } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const email = queryParams.get('email');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otp }),
            });

            const data = await response.json();

            if (data.success) {
                // Login user immediately after verification
                login(data.user);
                if (data.user.role === 'employer') {
                    navigate('/employer-dashboard');
                } else {
                    navigate('/find-jobs');
                }
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ebf2f7] px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center">
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="text-green-600 w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-[#031d31] mb-2">Verify Your Account</h2>
                <p className="text-gray-500 mb-8">
                    We sent a verification code to <span className="font-semibold text-gray-800">{email}</span>. <br />
                    (Demo OTP: <span className="font-mono bg-yellow-100 px-1 rounded">1234</span>)
                </p>

                <form onSubmit={handleVerify} className="space-y-6">
                    <input
                        type="text"
                        maxLength="4"
                        className="w-full text-center text-4xl font-bold tracking-widest py-4 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••"
                        autoFocus
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#031d31] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader className="animate-spin" /> : <>Verify & Continue <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-400">
                    Didn't receive code? <button className="text-blue-600 font-bold hover:underline">Resend</button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
