import React from 'react';
import { X, Building2, Globe, MapPin, FileCheck, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CompanyModal = ({ company, onClose, onAction }) => {
    if (!company) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                            {company.logo_path ? (
                                <img src={`${API_BASE_URL}${company.logo_path}`} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <Building2 size={24} className="text-slate-300" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">{company.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                    {company.type}
                                </span>
                                <span className="text-slate-400 text-xs">•</span>
                                <span className="text-slate-500 font-medium text-xs">{company.industry}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard label="Location" value={company.location} icon={MapPin} />
                        <InfoCard label="Company Size" value={company.size} icon={Building2} />

                        {company.website && (
                            <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Website</p>
                                    <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-sm truncate max-w-[200px] block">
                                        {company.website}
                                    </a>
                                </div>
                                <Globe className="text-slate-300" size={18} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Documents</h3>

                        {company.business_proof_path && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                        <FileCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Business Registration</p>
                                        <p className="text-blue-700/80 text-[10px]">GST / Shop Act / License</p>
                                    </div>
                                </div>
                                <a
                                    href={`${API_BASE_URL}${company.business_proof_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-bold text-[10px] hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    View
                                </a>
                            </div>
                        )}

                        {company.id_proof_path && (
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                                        <FileCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Personal ID Proof</p>
                                        <p className="text-purple-700/80 text-[10px]">Aadhar / PAN / Voter ID</p>
                                    </div>
                                </div>
                                <a
                                    href={`${API_BASE_URL}${company.id_proof_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-purple-600 text-white rounded-md font-bold text-[10px] hover:bg-purple-700 shadow-sm transition-all"
                                >
                                    View
                                </a>
                            </div>
                        )}

                        {company.doc_path && !company.business_proof_path && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 shrink-0">
                                        <FileCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Verification Doc</p>
                                        <p className="text-yellow-700/80 text-[10px]">Official Registration</p>
                                    </div>
                                </div>
                                <a
                                    href={`${API_BASE_URL}${company.doc_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-md font-bold text-[10px] hover:bg-yellow-600 shadow-sm transition-all"
                                >
                                    View
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                    <button
                        onClick={() => onAction('REJECTED')}
                        className="flex-1 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                    <button
                        onClick={() => onAction('APPROVED')}
                        className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1 text-slate-400">
            <Icon size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-sm font-bold text-slate-700 truncate">{value || 'N/A'}</p>
    </div>
);

export default CompanyModal;
