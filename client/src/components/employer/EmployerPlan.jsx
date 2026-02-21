import React, { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, Loader } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const EmployerPlan = ({ user, company, setActiveTab }) => {
    const [loading, setLoading] = useState(false);

    const isPlanActive = company && company.plan_expiry_date && (new Date(company.plan_expiry_date) > new Date());

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async () => {
        setLoading(true);

        const resScript = await loadRazorpayScript();
        if (!resScript) {
            alert("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_BASE_URL}/api/create-razorpay-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 499 })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok || !orderData.id) {
                alert(orderData.error || "Failed to initiate payment");
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout Modal
            const options = {
                key: "rzp_live_RsCU4fzmfxNC71", // MUST MATCH BACKEND!
                amount: orderData.amount,
                currency: "INR",
                name: "Uliyar Verified Network",
                description: "Employer 30-Day Subscription",
                order_id: orderData.id,
                theme: { color: "#2563EB" },
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 3. Verify Payment Signature
                        const verifyRes = await fetch(`${API_BASE_URL}/api/verify-razorpay-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...response, employerId: user.id })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            alert("Payment Successful! Plan activated for 30 days.");
                            // Force page reload to reflect active plan state from backend
                            window.location.reload();
                        } else {
                            alert("Payment verification failed. If money was deducted, contact support.");
                            setLoading(false);
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Exception verifying payment.");
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Order error:", error);
            alert("Error initiating checkout.");
            setLoading(false);
        }
    };

    if (isPlanActive) {
        return (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-center py-16 px-6">
                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Active Subscription</h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    Your employer subscription is currently active. You can post unlimited jobs and access all verified candidates until your plan expires on <strong className="text-slate-800">{new Date(company.plan_expiry_date).toLocaleDateString()}</strong>.
                </p>
                <button
                    onClick={() => setActiveTab('post-job')}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-primary/20"
                >
                    Go to Post Job
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Unlock Recruitment Tools</h2>
                <p className="text-slate-500 mt-2">Subscribe to post jobs and find the best verified workers.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row max-w-3xl mx-auto">
                {/* Plan Details */}
                <div className="p-8 md:p-10 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="inline-block bg-blue-100 text-blue-700 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        Standard Plan
                    </div>
                    <div className="flex items-end gap-1 mb-6">
                        <span className="text-5xl font-extrabold text-slate-900">₹499</span>
                        <span className="text-slate-500 font-medium pb-1">/ 30 days</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" /> Focus on Verified Workers
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" /> Unlimited Job Postings
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" /> Automated Application Tracking
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" /> Direct Messaging & Calls
                        </li>
                    </ul>
                </div>

                {/* Checkout Section */}
                <div className="p-8 md:p-10 flex-[0.7] bg-slate-50 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 relative">
                        <CreditCard className="text-blue-600 w-8 h-8" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl mb-2">Ready to start?</h3>
                    <p className="text-sm text-slate-500 mb-8">Secure payment via Razorpay. Instantly unlocks access to job postings.</p>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin w-5 h-5" /> : "Subscribe for ₹499"}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Secure Checkout
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployerPlan;
