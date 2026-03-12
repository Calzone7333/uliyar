import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Bookmark, CheckCircle2, Briefcase, IndianRupee, Clock, Building2, ShieldCheck, Share2, Calendar, Layout, Award, Zap, ChevronRight, Globe, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getImgUrl } from '../config';

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
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-[10px] p-4 md:p-6"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] md:h-[80vh] overflow-hidden shadow-2xl relative flex flex-col font-roboto border border-slate-200"
                >
                    {/* Compact Premium Header */}
                    <div className="relative h-32 md:h-40 shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0D9488] to-[#0A7369] border-b border-white/10">
                        {/* Background Visual */}
                        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="bg" />
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
                            <button 
                                onClick={handleSaveJob}
                                className={`p-2 rounded-lg backdrop-blur-md transition-all border ${isSaved ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                            >
                                <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20">
                                <X size={14} />
                            </button>
                        </div>

                        {/* Title & Logo Info */}
                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end gap-4">
                            <div className="w-16 h-16 bg-white rounded-xl p-1.5 shadow-md border border-slate-100 shrink-0 relative z-20">
                                <div className="w-full h-full rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
                                    {job.logo || job.socialMediaImage ? (
                                        <img 
                                            src={getImgUrl(job.logo || job.socialMediaImage)} 
                                            alt="Logo" 
                                            className="w-full h-full object-contain"
                                            onError={(e) => { e.target.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>'; }}
                                        />
                                    ) : (
                                        <Building2 size={24} className="text-slate-300" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-1 pb-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#0D9488] text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                        {job.type || 'Full Time'}
                                    </span>
                                </div>
                                <h1 className="text-lg md:text-xl font-black text-white tracking-tight leading-none truncate pr-4">
                                    {job.title}
                                </h1>
                                <p className="text-white/60 text-[10px] font-medium flex items-center gap-1.5 truncate">
                                    <Building2 size={10} className="text-[#0D9488]" /> {job.company} • #{job.id || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section - Simplified & Fixed Scroll */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
                        {/* Sidebar */}
                        <div className="w-full md:w-[220px] bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 p-5 shrink-0 overflow-y-auto">
                            <div className="space-y-6">
                                <section className="space-y-2 flex flex-col gap-1">
                                    <PolicyItem icon={ShieldCheck} title="Hiring Now" color="indigo" />
                                    <PolicyItem icon={MapPin} title={job.location || 'Location Not Specified'} color="blue" />
                                    <PolicyItem icon={Briefcase} title={job.experience || 'Entry Level / Fresher'} color="amber" />
                                </section>

                                <div className="pt-2">
                                    <button 
                                        onClick={onApply}
                                        className="w-full bg-[#0D9488] hover:bg-[#0b7a70] text-white text-[10px] font-black py-3 rounded-lg transition-all shadow-md shadow-[#0D9488]/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        <Zap size={12} fill="currentColor" /> Apply for this Job
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-white">
                            <div className="space-y-8">


                                {/* Overview Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-5 bg-[#0D9488] rounded-full"></div>
                                        <h3 className="text-sm font-black text-slate-800 tracking-tight">Job Summary</h3>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                        <p className="text-slate-600 leading-[1.6] font-medium whitespace-pre-line text-xs md:text-sm">
                                            {job.description || "The employer has not provided a detailed summary for this professional requirement. Please apply to learn more about the specific workflows and responsibilities involved in this role."}
                                        </p>
                                    </div>
                                </section>

                                {/* Skills Section */}
                                {skillsArray.length > 0 && (
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-5 bg-[#0D9488] rounded-full"></div>
                                            <h3 className="text-sm font-black text-slate-800 tracking-tight">Skills Required</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsArray.map((skill, idx) => (
                                                <span key={idx} className="bg-teal-50 text-[#0D9488] px-3 py-1.5 rounded-lg text-[10px] font-black border border-teal-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Internal Components

const PolicyItem = ({ icon: Icon, title, desc, color }) => {
    const iconColors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600'
    };
    return (
        <div className="flex gap-3 group items-center">
            <div className={`w-8 h-8 shrink-0 ${iconColors[color]} rounded-lg flex items-center justify-center transition-transform group-hover:scale-105`}>
                <Icon size={16} />
            </div>
            <div>
                <h5 className="text-[10px] font-black text-slate-800">{title}</h5>
                {desc && <p className="text-[9px] text-slate-400 font-medium leading-tight">{desc}</p>}
            </div>
        </div>
    );
};

const FileText = ({ className, size }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
);

export default JobDetailsModal;
