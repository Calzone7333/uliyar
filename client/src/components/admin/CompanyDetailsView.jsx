import React, { useState, useEffect } from 'react';
import { X, Briefcase, Users, Hash, Calendar, Download, MapPin, IndianRupee, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CompanyDetailsView = ({ company, onClose }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedJob, setExpandedJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/company/${company.id}/full-data`);
                const data = await response.json();
                setJobs(data.jobs || []);
                setApplications(data.applications || []);
            } catch (error) {
                console.error("Error fetching company details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [company]);

    // Group applications by job
    const applicationsByJob = applications.reduce((acc, app) => {
        if (!acc[app.jobId]) acc[app.jobId] = [];
        acc[app.jobId].push(app);
        return acc;
    }, {});

    if (isLoading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl animate-spin">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-slate-100">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{company.name}</h2>
                        <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {company.location}</span>
                            <span>•</span>
                            <span>{company.industry}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Briefcase size={20} /></div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Jobs</span>
                            </div>
                            <p className="text-3xl font-black text-slate-800">{jobs.length}</p>
                        </div>
                        <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 border-l-4 border-l-purple-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users size={20} /></div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Applications</span>
                            </div>
                            <p className="text-3xl font-black text-slate-800">{applications.length}</p>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Layers size={20} className="text-blue-500" /> Posted Jobs & Candidates
                        </h3>

                        <div className="space-y-4">
                            {jobs.length > 0 ? jobs.map(job => (
                                <div key={job.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-200 transition-colors">
                                    <div
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                    >
                                        <div>
                                            <h4 className="font-bold text-slate-700">{job.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                                <span className="flex items-center gap-1"><IndianRupee size={12} /> {job.salary}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{job.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                                {(applicationsByJob[job.id] || []).length} Applicants
                                            </span>
                                            {expandedJob === job.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Applications List */}
                                    {expandedJob === job.id && (
                                        <div className="bg-slate-50 border-t border-slate-100 p-4 animate-in slide-in-from-top-2 duration-200">
                                            {(applicationsByJob[job.id] || []).length > 0 ? (
                                                <div className="space-y-3">
                                                    {(applicationsByJob[job.id] || []).map(app => (
                                                        <div key={app.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-sm">{app.name}</p>
                                                                <div className="flex flex-col text-xs text-slate-500 mt-1">
                                                                    <span>{app.email}</span>
                                                                    <span>{app.phone}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className="text-[10px] font-bold text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                                                                {app.resumePath && (
                                                                    <a
                                                                        href={`${API_BASE_URL}${app.resumePath}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                                                    >
                                                                        <Download size={12} /> Resume
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-slate-400 text-xs py-4 italic">No applications received yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium">No jobs posted by this company.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsView;
