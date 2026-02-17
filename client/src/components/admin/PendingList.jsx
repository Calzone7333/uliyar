import React, { useState } from 'react';
import { UserCheck, Building2, Briefcase, Clock, Calendar, MapPin, CheckCircle, XCircle, Search } from 'lucide-react';

const PendingList = ({ items, type, onView, onQuickAction }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        if (type === 'resume') {
            return (item.name?.toLowerCase().includes(term) || item.email?.toLowerCase().includes(term));
        } else if (type === 'company') {
            return (item.name?.toLowerCase().includes(term) || item.industry?.toLowerCase().includes(term) || item.location?.toLowerCase().includes(term));
        } else if (type === 'job') {
            return (item.title?.toLowerCase().includes(term) || item.companyName?.toLowerCase().includes(term) || item.location?.toLowerCase().includes(term));
        }
        return true;
    });

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-green-500">
                    <CheckCircle size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800">All Cleared!</h3>
                <p className="text-slate-400 text-xs">No pending {type}s to review.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Bar for Grid */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 w-full max-w-md">
                <Search size={16} className="text-slate-400" />
                <input
                    type="text"
                    placeholder={`Search ${type}s...`}
                    className="flex-1 outline-none text-sm text-slate-700 font-medium placeholder:font-normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 group relative overflow-hidden h-fit">
                            {/* Status Indicator Stripe */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 group-hover:bg-orange-500 transition-colors"></div>

                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0
                                        ${type === 'resume' ? 'bg-blue-500' : type === 'company' ? 'bg-indigo-500' : 'bg-purple-500'}`}>
                                        {type === 'resume' && <UserCheck size={18} />}
                                        {type === 'company' && <Building2 size={18} />}
                                        {type === 'job' && <Briefcase size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate pr-2">
                                            {type === 'job' ? item.title : item.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                            <Clock size={10} /> Just now
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 mb-4 pl-2">
                                {type === 'resume' && (
                                    <>
                                        <p className="text-xs text-slate-600 truncate">{item.email}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                            <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Candidate</span>
                                            <span>•</span>
                                            <span>Profile Review</span>
                                        </div>
                                    </>
                                )}
                                {type === 'company' && (
                                    <>
                                        <p className="text-xs text-slate-600 truncate">{item.industry}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <MapPin size={10} /> {item.location}
                                        </div>
                                    </>
                                )}
                                {type === 'job' && (
                                    <>
                                        <p className="text-xs text-blue-600 font-medium truncate">{item.companyName}</p>
                                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                            <span>{item.location}</span>
                                            <span>{item.salary}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pl-2">
                                <button
                                    onClick={() => onView(item)}
                                    className="w-full py-2 bg-slate-50 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors border border-slate-100"
                                >
                                    Review Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 border border-dashed rounded-2xl">
                        <p>No results found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingList;
