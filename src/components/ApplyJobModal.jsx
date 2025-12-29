import React, { useState } from 'react';
import { X, Upload, Loader, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ApplyJobModal = ({ job, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Auto-fill from user context
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        resume: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resume Logic: Check if user has one in profile
    const hasProfileResume = user?.resume_path;
    const [useProfileResume, setUseProfileResume] = useState(!!hasProfileResume);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict Profile Check
        if (user && user.profile_status !== 'COMPLETE') {
            if (window.confirm("Your profile is incomplete. You must complete your profile and education details to apply. Go to Profile now?")) {
                navigate('/candidate-profile');
            }
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append('jobId', job.id);
        data.append('jobTitle', job.title);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        if (user) data.append('applicantId', user.id);

        // Resume Handling
        if (useProfileResume && hasProfileResume) {
            // Backend will use stored path
        } else if (formData.resume) {
            data.append('resume', formData.resume);
        } else {
            alert("Resume is mandatory.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/apply`, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                onClose();
                if (user) navigate('/candidate-dashboard');
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.message}`);
                if (errorData.message.includes('profile')) navigate('/candidate-profile');
            }
        } catch (error) {
            alert("Error submitting application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} className="text-gray-500" />
                </button>

                <div className="p-8">
                    <div className="mb-6">
                        <span className="text-blue-600 font-bold text-sm tracking-uppercase">{job.company}</span>
                        <h2 className="text-2xl font-serif font-bold text-[#031d31] mt-1">Apply for {job.title}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
                            <input
                                type="text"
                                disabled
                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                value={formData.name}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email / Mobile</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="email" disabled className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" value={formData.email} />
                                <input type="tel" disabled className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" value={formData.phone} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Resume</label>

                            {hasProfileResume && (
                                <div className={`mb-3 p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${useProfileResume ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setUseProfileResume(true)}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${useProfileResume ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                                        {useProfileResume && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-[#031d31] text-sm">Use Profile Resume</p>
                                        <p className="text-xs text-gray-500">Auto-attach from your profile</p>
                                    </div>
                                    <FileText className="text-blue-600" size={18} />
                                </div>
                            )}

                            <div className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${!useProfileResume ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setUseProfileResume(false)}>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!useProfileResume ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                                    {!useProfileResume && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-[#031d31] text-sm">Upload Different Resume</p>
                                </div>
                                <Upload className="text-gray-400" size={18} />
                            </div>

                            {!useProfileResume && (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                                    className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#031d31] text-white font-bold py-4 rounded-xl mt-4 hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-300"
                        >
                            {isSubmitting ? <Loader className="animate-spin" /> : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;
