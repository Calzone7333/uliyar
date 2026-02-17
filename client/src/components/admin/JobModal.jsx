import React from 'react';
import { X, Building2, MapPin, DollarSign, AlignLeft, Calendar, UserCheck, CheckCircle, XCircle, FileText, Phone, Mail } from 'lucide-react';
import { JOB_CATEGORIES } from '../../constants/jobCategories';

const JobModal = ({ job, onClose, onAction }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Building2 size={16} className="text-slate-400" />
                            <span className="text-slate-600 font-medium">{job.companyName}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* ... Existing Grid Items ... */}
                        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Salary</p>
                                <p className="font-bold text-slate-800">{job.salary}</p>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-2xl flex items-center gap-4 border border-purple-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Location</p>
                                <p className="font-bold text-slate-800">{job.location}</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 border border-orange-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Job Type</p>
                                <p className="font-bold text-slate-800">{job.jobType || 'Full Time'}</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-4 border border-emerald-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Category</p>
                                <p className="font-bold text-slate-800">{job.category} ({job.subCategory})</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4 mb-8">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <AlignLeft size={16} /> Description
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="space-y-4 mb-8">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                <CheckCircle size={16} /> Requirements
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {job.requirements}
                            </div>
                        </div>
                    )}

                    {/* Admin Details */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                            <FileText size={16} /> Admin & Internal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Info</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400"><Phone size={14} /></div>
                                        <p className="font-medium text-slate-700 text-sm">{job.contactPhone || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400"><Mail size={14} /></div>
                                        <p className="font-medium text-slate-700 text-sm">{job.contactEmail || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dates</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Social Post:</span>
                                        <span className="font-bold text-slate-700">{job.socialMediaDate || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <span className="text-slate-500">Announced:</span>
                                        <span className="font-bold text-slate-700">{job.jobAnnouncedDate || '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Social Media Image</p>
                                    {job.socialMediaImage ? (
                                        <img src={job.socialMediaImage} alt="Social Media" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                                    ) : (
                                        <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs italic">No Image</div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Newspaper Image</p>
                                    {job.newspaperImage ? (
                                        <img src={job.newspaperImage} alt="Newspaper" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                                    ) : (
                                        <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs italic">No Image</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-4">
                    <button
                        onClick={() => onAction('REJECTED')}
                        className="flex-1 py-3 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle size={20} /> Reject Post
                    </button>
                    <button
                        onClick={() => onAction('OPEN')}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} /> Approve Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobModal;
