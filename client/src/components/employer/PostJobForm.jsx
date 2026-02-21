import React, { useState } from 'react';
import { Upload, X, Loader, PlusCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const PostJobForm = ({ user, company, setActiveTab }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        salary: '',
        experience: '0-1 Years',
        skills_required: '',
        vacancies: 1,
        work_mode: 'On-site',
        description: '',
        benefits: '',
        deadline: '',
        education_required: '',
        food_allowance: 'No',
        accommodation: 'No',
        category: 'Construction',
        tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e) => {
        const val = e.target.value;
        if (val.includes(',')) {
            const newTags = val.split(',').map(t => t.trim()).filter(t => t);
            setFormData(prev => ({ ...prev, tags: newTags }));
        } else {
            // Simplified handling for text input, usually tags are comma separated
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentAndSubmit = async (e) => {
        e.preventDefault();

        // Admin gets to post jobs without paying
        if (user && user.role === 'admin') {
            postJobToBackend();
            return;
        }

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
                key: "rzp_test_YourKeyIdHere", // MUST MATCH BACKEND!
                amount: orderData.amount,
                currency: "INR",
                name: "Uliyar Verified Network",
                description: "Employer Job Posting Fee",
                order_id: orderData.id,
                theme: { color: "#2563EB" },
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 3. Verify Payment Signature
                        const verifyRes = await fetch(`${API_BASE_URL}/api/verify-razorpay-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response)
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            // Payment Verified! Now Post Job
                            postJobToBackend();
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

    const postJobToBackend = async () => {
        setLoading(true);

        try {
            const payload = {
                ...formData,
                employerId: user.id,
                company: company.name
            };

            const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Job Posted Successfully! Waiting for Admin Approval.');
                setActiveTab('jobs'); // Navigate to Jobs list
            } else {
                alert(data.error || 'Failed to post job');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <PlusCircle size={20} /> Post a New Job
                    </h2>
                    <p className="opacity-80 text-xs mt-0.5">Create a listing to attract talent.</p>
                </div>
            </div>

            <form onSubmit={handlePaymentAndSubmit} className="p-6 space-y-5">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-1 uppercase tracking-wider">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Job Title *</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-700" placeholder="e.g. Senior Electrician" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium text-slate-700">
                                <option>Construction</option>
                                <option>Manufacturing</option>
                                <option>IT & Software</option>
                                <option>Sales & Marketing</option>
                                <option>Education</option>
                                <option>Healthcare</option>
                                <option>Logistics</option>
                                <option>Hospitality</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Location *</label>
                            <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" placeholder="City, State" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Vacancies</label>
                            <input type="number" name="vacancies" min="1" value={formData.vacancies} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Work Mode</label>
                            <select name="work_mode" value={formData.work_mode} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium">
                                <option>On-site</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Compensation & Requirements */}
                <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-1 uppercase tracking-wider">Requirements & Perks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Salary Range *</label>
                            <input type="text" name="salary" required value={formData.salary} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" placeholder="e.g. ₹15k - ₹25k/mo" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Experience</label>
                            <select name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium">
                                <option>Fresher</option>
                                <option>0-1 Years</option>
                                <option>1-3 Years</option>
                                <option>3-5 Years</option>
                                <option>5+ Years</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Education</label>
                            <input type="text" name="education_required" value={formData.education_required} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" placeholder="e.g. 10th Pass, ITI" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Skills</label>
                            <input type="text" name="skills_required" value={formData.skills_required} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" placeholder="e.g. Wiring, Teamwork" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Food</label>
                            <select name="food_allowance" value={formData.food_allowance} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium">
                                <option>No</option>
                                <option>Yes (Free)</option>
                                <option>Yes (Subsidized)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Accommodation</label>
                            <select name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium">
                                <option>No</option>
                                <option>Yes (Free)</option>
                                <option>Yes (Paid)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Deadline</label>
                            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Detailed Description */}
                <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-1 uppercase tracking-wider">Description</h3>
                    <textarea name="description" rows="3" required value={formData.description} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium resize-none" placeholder="Describe the job role..." />
                </div>

                {/* Submit Logic */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-sm flex items-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" size={16} /> : <PlusCircle size={16} />}
                        {user && user.role === 'admin' ? "Post Job" : "Pay & Post Job (₹499)"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJobForm;
