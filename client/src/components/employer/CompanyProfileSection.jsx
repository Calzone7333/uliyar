import React, { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Loader, Upload, Shield, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CompanyProfileSection = ({ company }) => {

    if (!company) return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Building2 size={48} className="mb-4 text-slate-200" />
            <p className="font-bold">No Company Profile Found</p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Cover */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-6 pb-6 relative">
                    <div className="absolute -top-10 left-6 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center text-slate-300">
                            {company.logo_path ? (
                                <img src={`${API_BASE_URL}${company.logo_path}`} alt="Company Logo" className="w-full h-full object-contain" />
                            ) : (
                                <Building2 size={32} />
                            )}
                        </div>
                    </div>
                    <div className="ml-28 pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{company.name}</h1>
                            <div className="flex items-center gap-3 text-slate-500 mt-1 text-xs font-medium">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {company.location}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{company.industry}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{company.size} Employees</span>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${company.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {company.status === 'APPROVED' ? <CheckCircle size={12} /> : <Shield size={12} />}
                            {company.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* About / Web */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Building2 size={16} className="text-blue-600" /> Company Overview
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-xs">
                            <span className="text-slate-500 font-medium">Industry</span>
                            <span className="font-bold text-slate-800">{company.industry}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-xs">
                            <span className="text-slate-500 font-medium">Company Type</span>
                            <span className="font-bold text-slate-800">{company.type}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-xs">
                            <span className="text-slate-500 font-medium">Company Size</span>
                            <span className="font-bold text-slate-800">{company.size}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-xs">
                            <span className="text-slate-500 font-medium">Website</span>
                            {company.website ? (
                                <a href={company.website} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    {company.website} <Globe size={10} />
                                </a>
                            ) : <span className="text-slate-400">N/A</span>}
                        </div>
                    </div>
                </div>

                {/* Documents Status */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={16} className="text-purple-600" /> Verification Documents
                    </h3>
                    <div className="space-y-3">
                        <DocumentStatusItem label="Business Registration" path={company.business_proof_path} />
                        <DocumentStatusItem label="Personal ID Proof" path={company.id_proof_path} />
                        <DocumentStatusItem label="Other Documents" path={company.doc_path} />
                    </div>
                    {company.status !== 'APPROVED' && (
                        <div className="bg-orange-50 p-3 rounded-lg text-[10px] text-orange-700 border border-orange-100 mt-2 leading-relaxed">
                            <strong>Note:</strong> Your verification is currently {company.status}. Admin will review these documents shortly.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DocumentStatusItem = ({ label, path }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        {path ? (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={10} /> Uploaded
            </span>
        ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Pending</span>
        )}
    </div>
);

export default CompanyProfileSection;
