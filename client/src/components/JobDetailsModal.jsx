import React, { useEffect, useRef } from 'react';
import { X, Briefcase, Clock, DollarSign, Calendar, Building2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobDetailsModal = ({ job, onClose, onApply }) => {
    const modalRef = useRef();

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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
                >
                    {/* Header Section */}
                    <div className="p-8 pb-4 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-start gap-5">
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                                {job.logo ? (
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-xl" />
                                ) : (
                                    <Building2 size={32} className="text-slate-700" />
                                )}
                            </div>
                            <div className="pt-1">
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{job.title}</h2>
                                <div className="flex items-center gap-2 text-slate-500 font-medium text-[15px]">
                                    <span className="text-slate-700 font-semibold">{job.company || "Unknown Company"}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>{job.location || "Remote"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="px-8 py-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-50">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Experience</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <Briefcase size={16} className="text-[#0D9488]" />
                                    {job.experience || "Freshers"}
                                </div>
                            </div>
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-50">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Job Type</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <Clock size={16} className="text-[#0D9488]" />
                                    {job.type || "Full Time"}
                                </div>
                            </div>
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-50">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Salary</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <DollarSign size={16} className="text-[#0D9488]" />
                                    {job.salary ? `₹${(job.salary / 1000)}k` : "Not Disclosed"}
                                </div>
                            </div>
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-50">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Posted</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <Calendar size={16} className="text-[#0D9488]" />
                                    Recently
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Overview Content */}
                    <div className="p-8 pt-6 flex-1 overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Job Overview</h3>
                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium">
                            <p className="mb-4">
                                This role requires a dedicated professional ready to take on challenges in a fast-paced environment.
                                Ideally, you have experience in {job.title} roles and are looking to grow your career with {job.company || "us"}.
                            </p>

                            {job.description ? (
                                <p>{job.description}</p>
                            ) : (
                                <p>
                                    We are looking for a skilled individual to join our team. The ideal candidate will have strong communication skills and a passion for their work.
                                    Responsibilities effectively managing tasks, collaborating with team members, and ensuring project goals are met.
                                </p>
                            )}

                            <div className="mt-6 p-4 bg-[#F0FDFA] rounded-xl border border-[#0D9488]/10">
                                <h4 className="font-bold text-[#0D9488] mb-2 text-sm">Requirements:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-2">
                                    <li>Proven experience as a {job.title} or similar role</li>
                                    <li>Excellent communication and organizational skills</li>
                                    <li>Ability to work independently as well as in a team</li>
                                    <li>Knowledge of industry-standard tools and practices</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Job Attachments */}
                    {(job.socialMediaImage || job.newspaperImage) && (
                        <div className="mt-8 px-8 pb-4">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Job Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {job.socialMediaImage && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-slate-500">Social Media Ad</h4>
                                        <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative group cursor-pointer" onClick={() => window.open(job.socialMediaImage.startsWith('http') ? (job.socialMediaImage.includes('uliyar.com') && window.location.hostname === 'localhost' ? job.socialMediaImage.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082') : job.socialMediaImage) : `http://localhost:8082${encodeURI(job.socialMediaImage)}`, '_blank')}>
                                            <img
                                                src={job.socialMediaImage.startsWith('http') ? (job.socialMediaImage.includes('uliyar.com') && window.location.hostname === 'localhost' ? job.socialMediaImage.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082') : job.socialMediaImage) : `http://localhost:8082${encodeURI(job.socialMediaImage)}`}
                                                alt="Social Media Ad"
                                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                )}
                                {job.newspaperImage && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-slate-500">Newspaper Ad</h4>
                                        <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative group cursor-pointer" onClick={() => window.open(job.newspaperImage.startsWith('http') ? (job.newspaperImage.includes('uliyar.com') && window.location.hostname === 'localhost' ? job.newspaperImage.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082') : job.newspaperImage) : `http://localhost:8082${encodeURI(job.newspaperImage)}`, '_blank')}>
                                            <img
                                                src={job.newspaperImage.startsWith('http') ? (job.newspaperImage.includes('uliyar.com') && window.location.hostname === 'localhost' ? job.newspaperImage.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082') : job.newspaperImage) : `http://localhost:8082${encodeURI(job.newspaperImage)}`}
                                                alt="Newspaper Ad"
                                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-[24px] sticky bottom-0 z-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onApply}
                            className="px-8 py-2.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0D9488]/90 transition-colors shadow-lg shadow-[#0D9488]/20"
                        >
                            Apply Now
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JobDetailsModal;
