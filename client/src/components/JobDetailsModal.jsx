import React from 'react';
import { X, MapPin, Briefcase, Calendar, Building2, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobDetailsModal = ({ job, onClose, onApply }) => {
    if (!job) return null;

    // Helper to render list or text
    const renderList = (content) => {
        if (Array.isArray(content)) {
            return (
                <ul className="space-y-2 mt-2">
                    {content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600 text-sm">
                            <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="text-slate-600 text-sm leading-relaxed mt-2 whitespace-pre-line">{content}</p>;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[85vh] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-20">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                            {job.logo ? (
                                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                            ) : (
                                <Building2 size={32} className="text-slate-300" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{job.title}</h2>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <span>{job.company || 'Unknown Company'}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {job.location || 'Remote'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-8 custom-scrollbar">

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Experience</div>
                            <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <Briefcase size={14} className="text-primary" />
                                {job.experience || job.level || 'Not specified'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Job Type</div>
                            <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <Clock size={14} className="text-primary" />
                                {job.type || 'Full Time'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Salary</div>
                            <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <IndianRupee size={14} className="text-primary" />
                                {job.salary ? `₹${job.salary}` : 'Not disclosed'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Posted</div>
                            <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <Calendar size={14} className="text-primary" />
                                {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently'}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-6">
                        <div className="prose prose-sm max-w-none text-slate-600">
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                Job Overview
                            </h3>
                            <p className="leading-relaxed">
                                {job.description || "No description provided for this position."}
                            </p>
                        </div>

                        {(job.requirements || job.skills) && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements & Skills</h3>
                                {renderList(job.requirements || job.skills)}
                            </div>
                        )}

                        {job.responsibilities && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                                {renderList(job.responsibilities)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onClose(); // Close details modal
                            onApply(); // Open apply modal
                        }}
                        className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all active:scale-95"
                    >
                        Apply Now
                    </button>
                </div>

            </div>
        </div>
    );
};

export default JobDetailsModal;
