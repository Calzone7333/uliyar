import React, { useState } from 'react';
import { Bookmark, Building2 } from 'lucide-react';
import ApplyJobModal from './ApplyJobModal';
import JobDetailsModal from './JobDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

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

    // Helper to format time ago
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}mo ago`;

        return `${Math.floor(diffInMonths / 12)}y ago`;
    };

    const applicantsCount = job.applicants ? job.applicants.length : (job.applicationsCount || 0);

    return (
        <>
            <div
                className="group bg-white rounded-[16px] p-5 border border-slate-100/80 hover:border-[#0D9488]/30 hover:shadow-lg hover:shadow-[#0D9488]/10 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
                onClick={handleDetailsClick}
            >
                {/* Header: Logo, Title, Bookmark */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-slate-100 p-1 shadow-sm">
                            {job.logo ? (
                                <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-md" />
                            ) : (
                                <Building2 size={20} className="text-slate-700" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-[#0D9488] transition-colors mb-0.5 break-words">
                                {job.title}
                            </h3>
                            <p className="text-[12px] font-medium text-slate-500 truncate">
                                {job.company || "Company"} <span className="text-slate-300 mx-1">•</span> {job.location || "Remote"}
                            </p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-[#0D9488] transition-colors p-1 hover:bg-[#F0FDFA] rounded-full -mt-1 -mr-1">
                        <Bookmark size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Match Text */}
                <div className="mb-3 pl-[52px] -mt-2">
                    <span className="text-[11px] font-semibold text-[#0D9488]">
                        Match with your profile
                    </span>
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.type && (
                        <span className="bg-[#F0FDFA] text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-transparent group-hover:border-[#0D9488]/10 transition-colors">
                            {job.type}
                        </span>
                    )}
                    <span className="bg-[#F0FDFA] text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-transparent group-hover:border-[#0D9488]/10 transition-colors">
                        {job.locationType || "Onsite"}
                    </span>
                    {(job.level || job.experience) && (
                        <span className="bg-[#F0FDFA] text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-transparent group-hover:border-[#0D9488]/10 transition-colors">
                            {job.level || job.experience}
                        </span>
                    )}
                </div>

                <div className="mt-auto mb-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <span>{formatTimeAgo(job.createdAt || job.postedAt)}</span>
                </div>

                {/* Footer: Button (Salary Hidden) */}
                <div className="flex items-center justify-end pt-0 mt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleApplyClick(e);
                        }}
                        className="bg-[#F0FDFA] hover:bg-[#0D9488] text-[#0D9488] hover:text-white px-5 py-2 rounded-[10px] text-[12px] font-bold transition-all duration-300 border border-[#0D9488]/20 hover:border-[#0D9488]"
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
            )}

            {isDetailsOpen && (
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
            )}
        </>
    );
};

export default JobCard;
