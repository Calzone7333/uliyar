import React, { useState } from 'react';
import { Heart, Building2 } from 'lucide-react';
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

    return (
        <>
            <div className={`rounded-[24px] p-6 relative group flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50`}>

                {/* Header: Logo & Bookmark */}
                <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-primary/20 transition-colors">
                        {job.logo ? (
                            <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain" />
                        ) : (
                            <Building2 size={24} className="text-slate-300" />
                        )}
                    </div>
                    <button className="text-slate-300 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-xl">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>

                {/* Job Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 line-clamp-3 leading-relaxed">
                        {job.description || "Build cutting-edge web applications from start to finish, utilizing your expertise in both front-end and back-end technologies."}
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {job.type && (
                        <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-100 uppercase tracking-wider">
                            {job.type}
                        </span>
                    )}
                    {(job.level || job.experience) && (
                        <span className="px-3 py-1.5 bg-blue-50/50 rounded-lg text-[10px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wider">
                            {job.level || job.experience}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                        onClick={handleDetailsClick}
                        className="py-3 px-4 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
                    >
                        View Details
                    </button>
                    <button
                        onClick={handleApplyClick}
                        className="py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-primary transition-all shadow-lg shadow-slate-200 active:scale-95 translate-y-0"
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
