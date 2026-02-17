import React, { useState } from 'react';
import { Plus, Trash2, Users, FileText, ArrowRight, Layout, Briefcase } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const EmployerJobs = ({ jobs, applicants, selectedJob, fetchApplicants, handleStatusUpdate, handleDeleteJob, setActiveTab }) => {
    return (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
            {/* Jobs List - Fixed Height with Scroll */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden max-h-full">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700 text-sm">Jobs List ({jobs.length})</h3>
                    <button onClick={() => setActiveTab('post-job')} className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all" title="Add Job">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="overflow-y-auto p-3 space-y-2 custom-scrollbar flex-1">
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <div
                                key={job.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all group relative ${selectedJob === job.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}`}
                                onClick={() => fetchApplicants(job.id)}
                            >
                                <div className="pr-6">
                                    <h4 className={`font-bold text-sm line-clamp-1 ${selectedJob === job.id ? 'text-blue-800' : 'text-slate-800'}`}>{job.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{job.location}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {job.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteJob(e, job.id)}
                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Job"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 px-4">
                            <p className="text-xs text-slate-400">No jobs posted yet.</p>
                            <button onClick={() => setActiveTab('post-job')} className="mt-1 text-blue-600 text-[10px] font-bold hover:underline">Create First Job</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Applicants View */}
            <div className="lg:col-span-3 flex flex-col max-h-full">
                {selectedJob ? (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                Applicants for <span className="text-blue-600 truncate max-w-[200px]">{jobs.find(j => j.id === selectedJob)?.title}</span>
                            </h2>
                            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600">
                                {applicants.length} Applicant(s)
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {applicants.length > 0 ? (
                                <div className="space-y-3">
                                    {applicants.map(app => (
                                        <div key={app.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors group">
                                            <div className="flex flex-col md:flex-row justify-between gap-3">
                                                <div className="flex gap-3 items-start">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">
                                                        {app.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{app.name}</h4>
                                                        <div className="text-[10px] text-slate-500 space-y-0.5 mt-0.5">
                                                            <p className="flex items-center gap-1"><span className="font-semibold text-slate-400 w-8">Email:</span> {app.email}</p>
                                                            <p className="flex items-center gap-1"><span className="font-semibold text-slate-400 w-8">Phone:</span> {app.phone}</p>
                                                        </div>
                                                        {app.resumePath && (
                                                            <a href={`${API_BASE_URL}${app.resumePath}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-[10px] font-bold border border-blue-100 bg-blue-50 px-2 py-1 rounded mt-2 hover:bg-blue-100 transition-colors">
                                                                <FileText size={10} /> Resume
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Control */}
                                                <div className="min-w-[140px] flex flex-col justify-center border-l border-slate-100 pl-4 md:pl-6">
                                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Stage</span>
                                                    <div className="relative">
                                                        <select
                                                            value={app.status || 'Applied'}
                                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                            className={`w-full px-2 py-1.5 rounded-md text-[11px] font-bold border-none outline-none cursor-pointer transaction-colors appearance-none pr-6
                                                                ${app.status === 'Hired' || app.status === 'Selected' ? 'bg-green-100 text-green-700' :
                                                                    app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                                        'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                                        >
                                                            <option value="Applied">Applied</option>
                                                            <option value="Viewed">Viewed</option>
                                                            <option value="Shortlisted">Shortlisted</option>
                                                            <option value="Interview">Interview</option>
                                                            <option value="Hired">Hired</option>
                                                            <option value="Selected">Selected</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        {/* Custom Arrow */}
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="bg-slate-50 p-4 rounded-full mb-3 animate-pulse">
                                        <Users className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-600 font-bold mb-1 text-sm">No applicants yet</p>
                                    <p className="text-[10px] text-slate-400 max-w-xs">Waiting for candidates to apply.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-center p-8 opacity-75">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <Briefcase className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-600 mb-1">Select a Job to Manage</h3>
                        <p className="text-xs text-slate-400 max-w-xs mb-4">Click on any job from the list on the left to view applicants.</p>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                            <ArrowRight size={12} /> Select from left panel
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerJobs;
