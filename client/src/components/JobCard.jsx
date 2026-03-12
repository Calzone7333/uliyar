import React, { useState } from 'react';
import { Bookmark, Building2, CheckCircle2, Heart, MapPin, Crown, Zap, Lock, ChevronRight, Home, IndianRupee, Clock, Briefcase, GraduationCap } from 'lucide-react';
import ApplyJobModal from './ApplyJobModal';
import JobDetailsModal from './JobDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getImgUrl } from '../config';

const JobCard = ({ job, index = 0 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { user } = useAuth();
    const { openLogin } = useUI();

    const handleApplyClick = (e) => {
        e.stopPropagation();
        if (!user) {
            openLogin();
            return;
        }
        if (user.role === 'employer') {
            alert("Please login as a Worker to apply for jobs.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleDetailsClick = (e) => {
        e.stopPropagation();
        setIsDetailsOpen(true);
    };

    // Styling logic based on index mimicking the image
    const isFeatured = index < 2;

    // Mock specific brand styles like the image for visual layout match
    const getLogoStyle = (idx) => {
        switch (idx % 4) {
            case 0: return 'bg-[#FFEDD5] text-[#EA580C]'; // Orange-ish
            case 1: return 'bg-slate-900 text-white'; // Black
            case 2: return 'bg-[#E0E7FF] text-[#4F46E5]'; // Indigo
            case 3: return 'bg-[#D1FAE5] text-[#059669]'; // Emerald
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const logoChar = job.company ? job.company.charAt(0).toUpperCase() : 'C';

    return (
        <>
            <div
                className="group bg-white rounded-[12px] p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer mb-3 flex flex-col"
                onClick={handleDetailsClick}
            >
                {/* Header: Logo & Title */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3.5">
                        <div className="w-[42px] h-[42px] flex-shrink-0 rounded-[8px] flex items-center justify-center overflow-hidden bg-slate-50 border border-slate-100 shadow-sm p-1">
                            {job.logo || job.socialMediaImage ? (
                                <img 
                                    src={getImgUrl(job.logo || job.socialMediaImage)} 
                                    alt={job.company} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.target.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>'; }}
                                />
                            ) : (
                                <Building2 size={24} className="text-slate-300" />
                            )}
                        </div>
                        <div className="flex flex-col pt-0.5">
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-[15px] font-[600] text-[#1E293B] leading-tight group-hover:text-primary transition-colors">{job.title || "Not Applicable"}</h3>
                            </div>
                            <div className="text-[13px] text-slate-500 font-[400] mt-1">{job.company || "Not Applicable"}</div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                </div>

                {/* Info Rows */}
                <div className="mt-4 ml-[56px] flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-[400]">
                        <Home size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{job.location || "Not Applicable"}</span>
                    </div>

                    {/* Tiny Description Preview */}
                    <p className="text-[13px] text-slate-500 font-[400] truncate mt-1 pr-4">
                        {job.description || "Not Applicable"}
                    </p>
                </div>

                {/* Tags & Action */}
                <div className="mt-3.5 ml-[56px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 flex-1">
                        <span className="flex items-center gap-1.5 bg-[#F1F5F9] text-slate-600 text-[11px] font-[500] px-2.5 py-1 rounded-[6px]">
                            <Clock size={12} className="text-slate-400" strokeWidth={2.5} /> {job.type || "Not Applicable"}
                        </span>
                    </div>

                    <button
                        onClick={handleApplyClick}
                        className="self-start sm:self-auto shrink-0 px-4 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-600/20 hover:border-indigo-600 rounded-[6px] text-[12px] font-[600] transition-all"
                    >
                        Apply Now
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <ApplyJobModal
                    job={job}
                    onClose={() => setIsModalOpen(false)}
                />
            )
            }

            {
                isDetailsOpen && (
                    <JobDetailsModal
                        job={job}
                        onClose={() => setIsDetailsOpen(false)}
                        onApply={() => {
                            setIsDetailsOpen(false);
                            if (!user) {
                                openLogin();
                            } else if (user.role === 'employer') {
                                alert("Please login as a Worker to apply for jobs.");
                            } else {
                                setIsModalOpen(true);
                            }
                        }}
                    />
                )
            }
        </>
    );
};

export default JobCard;
