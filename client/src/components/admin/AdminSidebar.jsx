import React from 'react';
import {
    LayoutDashboard,
    FileText,
    Building2,
    Briefcase,
    Users,
    PlusCircle,
    LogOut,
    ShieldCheck,
    X
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, pendingCounts, onLogout, isOpen, onClose }) => {
    const dashboardNav = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'resumes', label: 'Verify Resumes', icon: FileText, count: pendingCounts.resumes || 0 },
        { id: 'companies', label: 'Verify Companies', icon: Building2, count: pendingCounts.companies || 0 },
        { id: 'jobs', label: 'Verify Emp. Jobs', icon: Briefcase, count: pendingCounts.jobs || 0 },
    ];

    const databaseNav = [
        { id: 'users_list', label: 'All Users', icon: Users },
        { id: 'companies_list', label: 'All Companies', icon: Building2 },
        { id: 'job_applications', label: 'Job Applications', icon: FileText },
        { id: 'post_job', label: 'Post Admin Job', icon: PlusCircle },
        { id: 'admin_jobs', label: 'My Admin Jobs', icon: Briefcase },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 z-50 flex flex-col shadow-sm transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">Admin</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Panel</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div>
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dashboard</p>
                        <div className="space-y-1">
                            {dashboardNav.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); if (onClose) onClose(); }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold py-0.5 px-2 rounded-full shadow-sm shadow-red-200">
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Database</p>
                        <div className="space-y-1">
                            {databaseNav.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); if (onClose) onClose(); }}
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
                    </div>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors gap-3"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
