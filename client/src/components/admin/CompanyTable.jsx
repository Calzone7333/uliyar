import React, { useState } from 'react';
import { Search, Building2, MapPin, Trash2, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CompanyTable = ({ companies, onDelete, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredCompanies = companies.filter(comp => {
        const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comp.industry?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-800">All Companies</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-full sm:w-64 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white text-sm text-slate-600 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="APPROVED">Verified</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Industry/Type</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Verification</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCompanies.length > 0 ? filteredCompanies.map((comp) => (
                            <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer group-hover:scale-[1.01] transition-transform"
                                        onClick={() => onViewDetails(comp)}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 overflow-hidden relative group-hover:border-blue-300 transition-colors">
                                            {comp.logo_path ? (
                                                <img src={`${API_BASE_URL}${comp.logo_path}`} alt="" className="w-full h-full object-cover" />
                                            ) : <Building2 size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{comp.name}</p>
                                            {comp.website && (
                                                <div onClick={e => e.stopPropagation()} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <a href={comp.website} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                                        Visit Website <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-700">{comp.industry || 'Unknown'}</p>
                                    <span className="text-xs text-slate-400 capitalize">{comp.type || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MapPin size={14} className="text-slate-400" />
                                        {comp.location || 'Remote'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
                                        ${comp.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                            comp.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {comp.status === 'APPROVED' && <CheckCircle size={12} />}
                                        {comp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(comp.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Remove Company"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <AlertCircle size={32} className="opacity-20" />
                                        <p>No companies found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredCompanies.length} companies</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default CompanyTable;
