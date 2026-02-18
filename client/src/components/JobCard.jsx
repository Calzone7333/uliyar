import React, { useState } from 'react';
import { Heart, Building2 } from 'lucide-react';
import ApplyJobModal from './ApplyJobModal';
import JobDetailsModal from './JobDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

// Background colors for the cards in a cycle
const CARD_COLORS = [
    'bg-[#E0F2FF]', // Light Blue
    'bg-[#E0F9F4]', // Light Mint
    'bg-[#FFECEC]', // Light Pink
    'bg-[#F3E5F5]', // Light Purple
    'bg-[#FFE0B2]', // Light Orange
    'bg-[#F5F5F5]', // Light Gray
];

const JobCard = ({ job, index = 0 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { user } = useAuth();
    const { openLogin } = useUI();

    const bgColor = CARD_COLORS[index % CARD_COLORS.length] || 'bg-white';

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

    return (
        <>
            <div className={`rounded-[20px] p-6 relative group flex flex-col h-full transition-transform hover:-translate-y-1 ${bgColor}`}>

                {/* Header: Logo & Bookmark */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        {job.logo ? (
                            <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain" />
                        ) : (
                            <Building2 size={24} className="text-gray-400" />
                        )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>

                {/* Job Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                        {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 line-clamp-3 leading-relaxed">
                        {job.description || "Build cutting-edge web applications from start to finish, utilizing your expertise in both front-end and back-end technologies."}
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {job.type && (
                        <span className="px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg text-[11px] font-bold text-slate-700 border border-white/50">
                            {job.type}
                        </span>
                    )}
                    {(job.level || job.experience) && (
                        <span className="px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg text-[11px] font-bold text-slate-700 border border-white/50">
                            {job.level || job.experience}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={handleDetailsClick}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-900 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                        Details
                    </button>
                    <button
                        onClick={handleApplyClick}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
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
