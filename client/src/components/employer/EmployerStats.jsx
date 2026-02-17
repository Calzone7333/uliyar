import React from 'react';
import { Briefcase, Users, Shield } from 'lucide-react';

const EmployerStats = ({ jobs, company }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-slate-700">{jobs.length}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Briefcase size={20} />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Total Applicants</p>
                    <h3 className="text-2xl font-bold text-slate-700">
                        {jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0)}
                    </h3>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <Users size={20} />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Account Status</p>
                    <h3 className={`text-lg font-bold ${company.status === 'APPROVED' ? 'text-green-600' : 'text-orange-500'}`}>
                        {company.status}
                    </h3>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                    <Shield size={20} />
                </div>
            </div>
        </div>
    );
};

export default EmployerStats;
