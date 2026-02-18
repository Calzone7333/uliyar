import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Trash2, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const UserTable = ({ users, onDelete, onRoleChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Header / Controls */}
            <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-base font-bold text-slate-800">All Users</h2>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-full sm:w-48 transition-all text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white text-xs text-slate-600 cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="candidate">Candidates</option>
                        <option value="employer">Employers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Change Role To</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-sm border border-white">
                                            {user.profile_photo_path ? (
                                                <img src={`${API_BASE_URL}${user.profile_photo_path}`} alt="" className="w-full h-full object-cover" />
                                            ) : user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm tracking-tight">{user.name}</p>
                                            <p className="text-slate-400 text-[10px] font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase
                                        ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            user.role === 'employer' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                                        <Shield size={10} />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {['candidate', 'employer', 'admin'].filter(r => r !== user.role).map(role => (
                                            <button
                                                key={role}
                                                onClick={() => onRoleChange(user.id, role)}
                                                className="text-[9px] font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all hover:shadow-sm capitalize"
                                            >
                                                Make {role}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold
                                        ${user.account_status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.account_status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.account_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                            <AlertCircle size={24} className="text-slate-200" />
                                        </div>
                                        <p className="text-xs font-medium">No users found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50">
                <span>Total: {filteredUsers.length} Users</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 shadow-xs" disabled>Prev</button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 shadow-xs" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
