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
            <div onClick={handleApplyClick} className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 w-full relative cursor-pointer group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 border border-orange-50 text-orange-600 font-bold text-lg">
                        {job.company?.[0]?.toUpperCase() || <Building2 size={24} />}
                    </div>
                    <div className="text-gray-300 hover:text-gray-500 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
                        {job.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-400 line-clamp-2">
                        {job.description || `The ${job.title} position exists to create compelling and elegant digital user experiences.`}
                    </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                    {job.type && (
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600">
                            {job.type}
                        </span>
                    )}
                    {job.experience && (
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600">
                            {job.experience}
                        </span>
                    )}
                    {job.level && (
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600">
                            {job.level}
                        </span>
                    )}
                    {job.salary && (
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-50 text-green-700">
                            ₹ {job.salary}
                        </span>
                    )}
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
