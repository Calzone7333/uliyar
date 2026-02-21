import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Star, Bookmark, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const JobDetailsModal = ({ job, onClose, onApply }) => {
    const modalRef = useRef();
    const { user } = useAuth();
    const { openLogin } = useUI();

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!job) return;
        const savedJobs = JSON.parse(localStorage.getItem(`savedJobs_${user?.id || 'guest'}`) || '[]');
        setIsSaved(savedJobs.includes(job.id));
    }, [job, user]);

    const handleSaveJob = () => {
        if (!user) {
            onClose();
            openLogin();
            return;
        }
        if (user.role === 'employer') {
            alert("Employers cannot save jobs.");
            return;
        }

        const storageKey = `savedJobs_${user.id}`;
        let savedJobs = JSON.parse(localStorage.getItem(storageKey) || '[]');

        if (isSaved) {
            savedJobs = savedJobs.filter(id => id !== job.id);
        } else {
            savedJobs.push(job.id);
        }

        localStorage.setItem(storageKey, JSON.stringify(savedJobs));
        setIsSaved(!isSaved);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Disable background scroll
        document.body.style.overflow = 'hidden';

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    if (!job) return null;

    const skillsArray = job.skills_required ? job.skills_required.split(',').map(s => s.trim()) : [];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
            >
                {/* Close Button Outside Popup */}
                <button
                    onClick={onClose}
                    className="fixed top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 z-[10000] p-2.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 text-white transition-all backdrop-blur-md"
                >
                    <X size={24} />
                </button>

                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-[16px] w-full max-w-[950px] max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative flex flex-col font-sans scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Cover Image Placeholder */}
                    <div className="w-full h-[140px] md:h-[180px] bg-gradient-to-r from-blue-100 to-cyan-100 relative overflow-hidden shrink-0">
                        {/* Abstract shapes mimicking image banner */}
                        <div className="absolute inset-0 opacity-80 mix-blend-multiply">
                            <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1500" alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1">

                        {/* LEFT COLUMN */}
                        <div className="flex-1 p-8 md:pr-10">
                            {/* Header: Logo, Title, Badges */}
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[50px] h-[50px] bg-white border border-slate-100 rounded-[10px] flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1">
                                        {job.logo ? (
                                            <img src={job.logo} alt="Company" className="w-full h-full object-contain" />
                                        ) : (
                                            <img src="/company.png" alt="Company Fallback" className="w-full h-full object-contain" />
                                        )}
                                    </div>
                                    <div className="pt-0.5">
                                        <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
                                            {job.title || "Not Applicable"}
                                        </h1>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[14px] text-slate-500">{job.company || "Not Applicable"}</span>
                                            <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-3">
                                    <span className="px-3 py-1 bg-green-50 text-emerald-600 outline outline-1 outline-emerald-100 text-[12px] font-semibold rounded-full">
                                        {job.type || "Full Time"}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 outline outline-1 outline-blue-100 text-[12px] font-semibold rounded-full">
                                        Expert
                                    </span>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-8">
                                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Job Description:</h3>
                                <div className="text-[14px] text-slate-600 leading-relaxed font-medium">
                                    {job.description ? (
                                        <p>{job.description}</p>
                                    ) : (
                                        <p>Not Applicable</p>
                                    )}
                                </div>
                            </div>

                            {/* Required Skill */}
                            <div className="mb-8 md:mb-0">
                                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Required skill :</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsArray.length > 0 ? (
                                        skillsArray.map((skill, idx) => (
                                            <span key={idx} className="bg-slate-100/80 text-slate-600 hover:bg-slate-200 transition-colors text-[12px] font-medium px-4 py-1.5 rounded-full">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="bg-slate-100/80 text-slate-600 text-[12px] font-medium px-4 py-1.5 rounded-full">Not Applicable</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="w-full md:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col">

                            <div className="p-8 border-b border-slate-100">
                                <h3 className="text-[15px] font-bold text-slate-900 mb-6">About Client</h3>

                                <div className="space-y-5">
                                    <div>
                                        <div className="text-[13px] text-slate-500 font-medium mb-1">Client name</div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[14px] text-slate-900 font-semibold">{job.company || "Not Applicable"}</span>
                                            <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/10" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[13px] text-slate-500 font-medium mb-1">Status</div>
                                        <div className="text-[14px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block">Active Hiring</div>
                                    </div>

                                    <div>
                                        <div className="text-[13px] text-slate-500 font-medium mb-1">Location</div>
                                        <div className="text-[14px] text-slate-900 font-medium">{job.location || "Not Applicable"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pb-6 border-b border-slate-100">
                                <h3 className="text-[15px] font-bold text-slate-900 mb-4">Other Information</h3>

                                <div className="space-y-4">
                                    <div className="text-[13px] text-slate-700 font-medium leading-relaxed">
                                        Uliyar verifies all employer accounts before they are allowed to post active job listings on our platform to ensure worker safety.
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-8 mt-auto flex flex-col gap-3 pb-8">
                                <button onClick={onApply} className="w-full bg-[#27825E] hover:bg-[#1f6b4d] text-white text-[14px] font-semibold py-3 rounded-[8px] transition-colors shadow-sm">
                                    Apply job
                                </button>
                                <button
                                    onClick={handleSaveJob}
                                    className={`w-full text-[14px] font-semibold py-3 rounded-[8px] transition-colors flex items-center justify-center gap-2 shadow-sm border ${isSaved ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'}`}
                                >
                                    {isSaved ? "Saved" : "Save Job"} <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JobDetailsModal;
