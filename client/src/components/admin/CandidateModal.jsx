import React from 'react';
import { X, User, Briefcase, GraduationCap, Code, FileText, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CandidateModal = ({ candidate, onClose, onAction }) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                            {candidate.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{candidate.name}</h2>
                            <p className="text-slate-500 font-medium">{candidate.email}</p>
                            <p className="text-sm text-slate-400 mt-1">{candidate.mobile || 'No mobile provided'}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Experience Section */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                <Briefcase size={16} /> Experience
                            </h3>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                {candidate.experience?.role ? (
                                    <>
                                        <h4 className="font-bold text-slate-800 text-lg">{candidate.experience.role}</h4>
                                        <p className="text-blue-600 font-medium">{candidate.experience.company}</p>
                                        <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-400 uppercase">
                                            <span className="bg-white px-2 py-1 rounded border border-slate-200">{candidate.experience.years} Years</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-400 text-center py-4">No experience listed (Fresher)</div>
                                )}
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                <GraduationCap size={16} /> Education
                            </h3>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                {candidate.education?.degree ? (
                                    <>
                                        <h4 className="font-bold text-slate-800 text-lg">{candidate.education.degree}</h4>
                                        <p className="text-slate-600 font-medium">{candidate.education.college}</p>
                                        <p className="text-xs text-slate-400 mt-2">Class of {candidate.education.year}</p>
                                    </>
                                ) : (
                                    <div className="text-slate-400 text-center py-4">No education details</div>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                <Code size={16} /> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                                    candidate.skills.map((skill, index) => (
                                        <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 italic">No skills added</span>
                                )}
                            </div>
                        </div>

                        {/* Resume Document */}
                        <div className="md:col-span-2 bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg ring-1 ring-slate-900/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-300">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Resume Document</p>
                                    <p className="text-slate-400 text-sm">PDF Format • Uploaded recently</p>
                                </div>
                            </div>
                            <a
                                href={`${API_BASE_URL}${candidate.resume_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                            >
                                View PDF
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-4">
                    <button
                        onClick={() => onAction('REJECTED')}
                        className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle size={20} /> Reject Candidate
                    </button>
                    <button
                        onClick={() => onAction('APPROVED')}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} /> Approve Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateModal;
