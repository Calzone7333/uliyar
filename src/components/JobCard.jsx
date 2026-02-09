import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, Building2 } from 'lucide-react';
import ApplyJobModal from './ApplyJobModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const JobCard = ({ job }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const { openLogin } = useUI();
    const navigate = useNavigate();

    // Dynamic styles for labels based on job category/type logic
    const getLabelStyle = (type) => {
        const styles = {
            'Full Time': 'bg-blue-50 text-blue-700 border-blue-100',
            'Part Time': 'bg-orange-50 text-orange-700 border-orange-100',
            'Contract': 'bg-purple-50 text-purple-700 border-purple-100',
            'Freelance': 'bg-green-50 text-green-700 border-green-100'
        };
        return styles[type] || 'bg-gray-50 text-gray-700 border-gray-100';
    };

    const handleApplyClick = () => {
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

    return (
        <>
            <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group w-full relative">

                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Logo Placeholder */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                        <Building2 size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                    {job.title}
                                </h3>
                                <p className="text-sm font-medium text-gray-500">{job.company}</p>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 self-start md:self-auto flex-wrap">
                                {job.category && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-purple-50 text-purple-700 border-purple-100">
                                        {job.category}
                                    </span>
                                )}
                                {job.work_mode && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-teal-50 text-teal-700 border-teal-100">
                                        {job.work_mode}
                                    </span>
                                )}
                                {(job.food_allowance === 'Yes' || job.accommodation === 'Yes') && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-orange-50 text-orange-700 border-orange-100">
                                        Food/Stay
                                    </span>
                                )}
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getLabelStyle(job.type)}`}>
                                    {job.type}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {job.description || `We are hiring a skilled ${job.title} to join our team at ${job.company}. ${job.experience || 'Experience'} required.`}
                        </p>

                        {/* Meta Info & Action */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-gray-50 pt-4 mt-auto">

                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Clock size={14} className="text-gray-400" />
                                    <span>{job.experience || 'Fr/Exp'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <DollarSign size={14} className="text-gray-400" />
                                    <span className="text-gray-700">{job.salary}</span>
                                </div>
                                {job.vacancies && (
                                    <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-green-700">
                                        <span>{job.vacancies} Openings</span>
                                    </div>
                                )}
                                {job.deadline && (
                                    <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-red-600">
                                        <span>Ends {job.deadline}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleApplyClick}
                                className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 group/btn ${user?.role === 'employer'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 text-white hover:bg-primary shadow-gray-200 hover:shadow-teal-200'
                                    }`}
                                disabled={user?.role === 'employer'}
                            >
                                {user?.role === 'employer' ? 'Employer View' : 'Apply Now'}
                                {user?.role !== 'employer' && <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ApplyJobModal
                    job={job}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default JobCard;
