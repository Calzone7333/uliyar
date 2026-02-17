import React from 'react';
import {
    LayoutDashboard,
    Briefcase,
    PlusCircle,
    Building2,
    Users,
    LogOut,
    Shield
} from 'lucide-react';

const EmployerSidebar = ({ activeTab, setActiveTab, onLogout, companyName }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: 'My Jobs & Applicants', icon: Briefcase },
        { id: 'post-job', label: 'Post a New Job', icon: PlusCircle },
        { id: 'profile', label: 'Company Profile', icon: Building2 },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 z-30 flex flex-col shadow-sm">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-lg">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg leading-tight">Employer</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon size={18} className={`mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Footer / Account Info */}
            <div className="p-4 border-t border-slate-50">
                <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-sm">
                            {companyName ? companyName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{companyName || 'My Company'}</p>
                            <p className="text-[10px] text-slate-500 truncate">Employer Account</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors gap-2"
                >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default EmployerSidebar;
