import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL, getImgUrl } from '../config';

import { useAuth } from '../context/AuthContext';
import { X, ShieldAlert, Loader, Briefcase, PlusCircle, Trash2, Edit3, MapPin, IndianRupee, Calendar, Image, Search, Menu, Bell, LogOut, ChevronRight, Info, Home, Building2 } from 'lucide-react';

// Components
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardStats from '../components/admin/DashboardStats';
import PendingList from '../components/admin/PendingList';
import UserTable from '../components/admin/UserTable';
import CompanyTable from '../components/admin/CompanyTable';
import AdminJobForm from '../components/admin/AdminJobForm';
import CandidateModal from '../components/admin/CandidateModal';
import CompanyModal from '../components/admin/CompanyModal';
import JobModal from '../components/admin/JobModal';
import CompanyDetailsView from '../components/admin/CompanyDetailsView';
import { exportJobsToExcel } from '../utils/exportToExcel';
import { DownloadCloud, TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [pendingResumes, setPendingResumes] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
    const [adminJobs, setAdminJobs] = useState([]);
    const [adminJobApplications, setAdminJobApplications] = useState([]);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [viewCompany, setViewCompany] = useState(null);
    const [viewCandidate, setViewCandidate] = useState(null);
    const [viewJob, setViewJob] = useState(null);
    const [viewCompanyDetails, setViewCompanyDetails] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [imageModal, setImageModal] = useState({ isOpen: false, src: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const stats = {
        totalUsers: allUsers.length,
        totalCompanies: allCompanies.length,
        totalJobs: adminJobs.length,
        pendingTotal: pendingResumes.length + pendingCompanies.length + pendingJobs.length
    };

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            navigate(location.pathname, { replace: true, state: {} });
        }
        fetchAllData();
    }, [location, navigate]);

    const fetchAllData = () => {
        setIsLoading(true);
        Promise.all([
            fetchPending('resumes', setPendingResumes),
            fetchPending('companies', setPendingCompanies),
            fetchPending('jobs', setPendingJobs),
            fetchList('users', setAllUsers),
            fetchList('companies', setAllCompanies),
            fetchList('jobs', setAdminJobs),
            fetchList('job-applications', setAdminJobApplications)
        ]).finally(() => setIsLoading(false));
    };

    const fetchList = async (type, setter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/${type}`);
            const data = await response.json();
            setter(data);
        } catch (error) { console.error(error); }
    };

    const fetchPending = async (type, setter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/pending-${type}`);
            const data = await response.json();
            setter(data);
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("ARE YOU SURE?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
            fetchAllData();
        } catch (error) { alert("Failed to delete"); }
    };

    const handleAction = async (type, idKey, idValue, status) => {
        const endpointMap = {
            'resume': 'verify-resume',
            'company': 'verify-company',
            'job': 'verify-job'
        };
        const body = { status, [idKey]: idValue };

        try {
            await fetch(`${API_BASE_URL}/api/admin/${endpointMap[type]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            setViewCandidate(null);
            setViewCompany(null);
            setViewJob(null);
            fetchAllData();
        } catch (error) { alert("Action Failed"); }
    };

    const handlePostJob = async (jobData, onSuccess) => {
        setIsPosting(true);
        try {
            const formData = new FormData();
            Object.keys(jobData).forEach(key => {
                if (jobData[key] !== null && jobData[key] !== undefined) {
                    formData.append(key, jobData[key]);
                }
            });

            // Determine URL and Method based on Edit Mode
            const url = editJob
                ? `${API_BASE_URL}/api/admin/jobs/${editJob.id}`
                : `${API_BASE_URL}/api/admin/post-job`;

            const method = editJob ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                // Content-Type is set automatically by the browser for FormData
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                alert(editJob ? "Job Updated Successfully!" : "Job Posted Successfully!");
                onSuccess();
                setEditJob(null); // Clear edit state
                setActiveTab('admin_jobs');
                fetchAllData();
            } else {
                alert(data.message || "Failed to post job");
            }
        } catch (error) {
            alert("Error posting job");
        } finally {
            setIsPosting(false);
        }
    };

    const deleteAdminJob = async (id) => {
        if (!window.confirm("Delete this admin job?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
            fetchAllData();
        } catch (error) { alert("Delete failed"); }
    };

    const startEditJob = (job) => {
        setEditJob(job);
        setActiveTab('post_job');
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await response.json();
            if (data.success) {
                fetchAllData();
            } else {
                alert(data.message || "Failed to update role");
            }
        } catch (error) {
            alert("Error updating role");
        }
    };

    const handleExport = async () => {
        if (filteredAdminJobs.length === 0) {
            alert("No data to export");
            return;
        }
        setIsExporting(true);
        try {
            await exportJobsToExcel(filteredAdminJobs);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export Excel file");
        } finally {
            setIsExporting(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredAdminJobs = adminJobs.filter(job => {
        const searchStr = searchTerm.toLowerCase();
        return (
            job?.title?.toLowerCase().includes(searchStr) ||
            job?.company?.toLowerCase().includes(searchStr) ||
            job?.location?.toLowerCase().includes(searchStr) ||
            job?.category?.toLowerCase().includes(searchStr) ||
            job?.subCategory?.toLowerCase().includes(searchStr) ||
            job?.type?.toLowerCase().includes(searchStr) ||
            job?.salary?.toLowerCase().includes(searchStr) ||
            job?.description?.toLowerCase().includes(searchStr)
        );
    }).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    const totalPages = Math.ceil(filteredAdminJobs.length / itemsPerPage);
    const paginatedJobs = filteredAdminJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-slate-50/50 flex font-roboto">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                pendingCounts={{
                    resumes: pendingResumes.length,
                    companies: pendingCompanies.length,
                    jobs: pendingJobs.length
                }}
                onLogout={() => {
                    if (logout) logout();
                    navigate('/');
                }}
            />

            <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-3 flex justify-between items-center z-30 shrink-0 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 relative ${isNotificationOpen ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-slate-50 text-slate-600 border-slate-200 shadow-sm hover:border-primary/20 hover:text-primary'}`}
                                title="Notifications"
                            >
                                <Bell size={14} className={stats.pendingTotal > 0 ? 'animate-bounce' : ''} strokeWidth={2.5} />
                                {stats.pendingTotal > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="p-3 border-b border-slate-50 flex items-center justify-between">
                                            <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                                            <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase truncate max-w-[100px]">{stats.pendingTotal} Pending</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto custom-scrollbar py-2">
                                            {stats.pendingTotal > 0 ? (
                                                <div className="space-y-1">
                                                    {pendingResumes.length > 0 && (
                                                        <button
                                                            onClick={() => { setActiveTab('resumes'); setIsNotificationOpen(false); }}
                                                            className="w-full p-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 text-left group"
                                                        >
                                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                                <ShieldAlert size={16} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-slate-800">{pendingResumes.length} Resumes Pending</p>
                                                                <p className="text-[9px] text-slate-400 mt-0.5">Verification required</p>
                                                            </div>
                                                            <ChevronRight size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                        </button>
                                                    )}
                                                    {pendingCompanies.length > 0 && (
                                                        <button
                                                            onClick={() => { setActiveTab('companies'); setIsNotificationOpen(false); }}
                                                            className="w-full p-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 text-left group"
                                                        >
                                                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                                                <Briefcase size={16} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-slate-800">{pendingCompanies.length} Companies Pending</p>
                                                                <p className="text-[9px] text-slate-400 mt-0.5">Verification required</p>
                                                            </div>
                                                            <ChevronRight size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                        </button>
                                                    )}
                                                    {pendingJobs.length > 0 && (
                                                        <button
                                                            onClick={() => { setActiveTab('jobs'); setIsNotificationOpen(false); }}
                                                            className="w-full p-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 text-left group"
                                                        >
                                                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                                                <PlusCircle size={16} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-slate-800">{pendingJobs.length} Jobs Pending</p>
                                                                <p className="text-[9px] text-slate-400 mt-0.5">Verification required</p>
                                                            </div>
                                                            <ChevronRight size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <Info size={16} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400">All cleared!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-primary-dark border border-slate-200 transition-all shadow-sm"
                            title="Back to Home"
                        >
                            <Home className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => {
                                if (logout) logout();
                                navigate('/');
                            }}
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-red-500 border border-slate-200 transition-all shadow-sm relative"
                            title="Log Out"
                        >
                            <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>

                        <div className="relative group ml-1">
                            <button
                                className="w-8 h-8 rounded-full focus:outline-none transition-all shadow-[0_0_0_2px_theme(colors.slate.100)] hover:shadow-[0_0_0_2px_theme(colors.primary)] flex items-center justify-center overflow-hidden bg-primary text-white font-black text-xs cursor-default"
                            >
                                {(user?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
                            </button>
                            {/* Hover tooltip */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-black text-slate-800 truncate">{user?.fullName || 'Administrator'}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/30">
                    <div className="max-w-7xl mx-auto pb-20">
                    {/* Page Titles based on Active Tab */}
                    {activeTab !== 'dashboard' && activeTab !== 'admin_jobs' && activeTab !== 'job_applications' && (
                        <div className="mb-8 mt-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                {activeTab === 'resumes' && 'Verify Resumes'}
                                {activeTab === 'companies' && 'Verify Companies'}
                                {activeTab === 'jobs' && 'Verify Employer Jobs'}
                                {activeTab === 'users_list' && 'All Users Database'}
                                {activeTab === 'companies_list' && 'All Companies Database'}
                                {activeTab === 'post_job' && (editJob ? 'Edit Admin Job' : 'Post Admin Job')}
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm">System Administration Panel</p>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-8 mt-6">
                                <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                                <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, {user?.fullName || 'Admin'}</p>
                            </div>

                            <DashboardStats stats={stats} />
                            
                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                                {/* Daily Job Postings Area Chart */}
                                <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-800">Job Posting Growth</h3>
                                            <p className="text-xs text-slate-400">Daily job uploads tracking</p>
                                        </div>
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                            <TrendingUp size={18} />
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={(() => {
                                                const last14Days = Array.from({ length: 14 }, (_, i) => {
                                                    const d = new Date();
                                                    d.setDate(d.getDate() - (13 - i));
                                                    return {
                                                        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                                        fullDate: d.toISOString().split('T')[0],
                                                        count: 0
                                                    };
                                                });
                                                
                                                adminJobs.forEach(job => {
                                                    const jobDate = new Date(job.postedAt).toISOString().split('T')[0];
                                                    const dayObj = last14Days.find(d => d.fullDate === jobDate);
                                                    if (dayObj) dayObj.count++;
                                                });
                                                
                                                return last14Days;
                                            })()}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <Tooltip 
                                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* User Categories Pie Chart */}
                                <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-base font-bold text-slate-800">User Types</h3>
                                        <PieIcon size={18} className="text-slate-400" />
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Candidates', value: allUsers.filter(u => u.role === 'candidate').length },
                                                        { name: 'Employers', value: allUsers.filter(u => u.role === 'employer').length },
                                                        { name: 'Admins', value: allUsers.filter(u => u.role === 'admin').length }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {['#2563eb', '#10b981', '#f59e0b'].map((color, index) => (
                                                        <Cell key={`cell-${index}`} fill={color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                                        <div><div className="w-2 h-2 rounded-full bg-blue-600 mx-auto mb-1"></div>Cand.</div>
                                        <div><div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1"></div>Emp.</div>
                                        <div><div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1"></div>Admin</div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                                {/* Daily User Registrations Area Chart */}
                                <div className="lg:col-span-12 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-800">User Acquisition</h3>
                                            <p className="text-xs text-slate-400">Daily new user registrations tracking</p>
                                        </div>
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                            <TrendingUp size={18} />
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={(() => {
                                                const last14Days = Array.from({ length: 14 }, (_, i) => {
                                                    const d = new Date();
                                                    d.setDate(d.getDate() - (13 - i));
                                                    return {
                                                        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                                        fullDate: d.toISOString().split('T')[0],
                                                        count: 0
                                                    };
                                                });
                                                
                                                allUsers.forEach(user => {
                                                    if (!user.createdAt) return;
                                                    const userDate = new Date(user.createdAt).toISOString().split('T')[0];
                                                    const dayObj = last14Days.find(d => d.fullDate === userDate);
                                                    if (dayObj) dayObj.count++;
                                                });
                                                
                                                return last14Days;
                                            })()}>
                                                <defs>
                                                    <linearGradient id="colorUserCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <Tooltip 
                                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUserCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-6">Recent Resumes</h3>
                                    <PendingList items={pendingResumes.slice(0, 3)} type="resume" onView={setViewCandidate} />
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="font-bold text-slate-700 mb-6">New Companies</h3>
                                        <PendingList items={pendingCompanies.slice(0, 3)} type="company" onView={setViewCompany} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700 mb-6">Pending Jobs</h3>
                                        <PendingList items={pendingJobs.slice(0, 3)} type="job" onView={setViewJob} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700 mb-6 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setActiveTab('job_applications')}>
                                            Recent Admin Applications ({adminJobApplications.length})
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resumes' && <PendingList items={pendingResumes} type="resume" onView={setViewCandidate} />}
                    {activeTab === 'companies' && <PendingList items={pendingCompanies} type="company" onView={setViewCompany} />}
                    {activeTab === 'jobs' && <PendingList items={pendingJobs} type="job" onView={setViewJob} />}
                    {activeTab === 'users_list' && <UserTable users={allUsers} onDelete={(id) => handleDelete('users', id)} onRoleChange={handleRoleChange} />}
                    {activeTab === 'companies_list' && <CompanyTable companies={allCompanies} onDelete={(id) => handleDelete('companies', id)} onViewDetails={setViewCompanyDetails} />}
                    {activeTab === 'post_job' && (
                        <AdminJobForm
                            onPost={handlePostJob}
                            isPosting={isPosting}
                            initialData={editJob}
                            onCancel={() => { setEditJob(null); setActiveTab('admin_jobs'); }}
                        />
                    )}

                    {activeTab === 'admin_jobs' && (
                        <div className="animate-in fade-in duration-500">
                            {/* Header Section */}
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                        <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
                                            <Briefcase size={22} />
                                        </div>
                                        Admin Posted Jobs
                                        <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-bold ml-2">
                                            {filteredAdminJobs.length}
                                        </span>
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium ml-12">
                                        Manage your organization's direct job postings
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                                    <div className="relative w-full sm:w-80 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by title, location..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={handleExport}
                                            disabled={isExporting}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                                        >
                                            {isExporting ? <Loader className="animate-spin" size={18} /> : <DownloadCloud size={18} />}
                                            Export
                                        </button>
                                        <button 
                                            onClick={() => { setEditJob(null); setActiveTab('post_job'); }} 
                                            className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                        >
                                            <PlusCircle size={18} /> 
                                            Post New Job
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Jobs List - Compact Design */}
                            <div className="flex flex-col gap-4">
                                {paginatedJobs.length > 0 ? (
                                    paginatedJobs.map((job, idx) => (
                                        <div 
                                            key={job.id} 
                                            className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 p-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            {/* Left side: Basic Info */}
                                            <div className="flex items-center gap-4 flex-1 w-full">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                                                    <Briefcase size={20} strokeWidth={2} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors" title={job.title}>{job.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                                                        <span className="flex items-center gap-1"><Building2 size={12} /> {job.company || 'Uliyar'}</span>
                                                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Middle side: Category & Salary */}
                                            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                                                <div className="flex flex-col gap-1 items-start md:items-end min-w-[100px]">
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Category</span>
                                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-100 max-w-[120px] truncate">{job.category}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-start md:items-end min-w-[80px]">
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Salary</span>
                                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><IndianRupee size={10} />{job.salary}</span>
                                                </div>
                                            </div>

                                            {/* Right side: Previews */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="flex -space-x-2 group/avatars">
                                                    {job.socialMediaImage ? (
                                                        <div 
                                                            className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-sm cursor-pointer hover:-translate-y-1 transition-transform relative z-10"
                                                            onClick={() => setImageModal({ isOpen: true, src: getImgUrl(job.socialMediaImage) })}
                                                            title="Social Media Image"
                                                        >
                                                            <img src={getImgUrl(job.socialMediaImage)} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300 shadow-sm relative z-0">
                                                            <Image size={14} />
                                                        </div>
                                                    )}
                                                    {job.newspaperImage ? (
                                                        <div 
                                                            className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-sm cursor-pointer hover:-translate-y-1 transition-transform relative z-20"
                                                            onClick={() => setImageModal({ isOpen: true, src: getImgUrl(job.newspaperImage) })}
                                                            title="Newspaper Image"
                                                        >
                                                            <img src={getImgUrl(job.newspaperImage)} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-slate-300 shadow-sm relative z-0">
                                                            <Image size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pl-4 border-l border-slate-50 shrink-0 w-full md:w-auto justify-end">
                                                <button 
                                                    onClick={() => startEditJob(job)} 
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteAdminJob(job.id)} 
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium">No results found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0D9488] hover:border-[#0D9488] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        <ChevronRight size={18} className="rotate-180" />
                                    </button>
                                    
                                    <div className="flex items-center gap-1.5">
                                        {(() => {
                                            const pages = [];
                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                                            } else {
                                                if (currentPage <= 4) {
                                                    for (let i = 1; i <= 5; i++) pages.push(i);
                                                    pages.push('...');
                                                    pages.push(totalPages);
                                                } else if (currentPage >= totalPages - 3) {
                                                    pages.push(1);
                                                    pages.push('...');
                                                    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                                                } else {
                                                    pages.push(1);
                                                    pages.push('...');
                                                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                                                    pages.push('...');
                                                    pages.push(totalPages);
                                                }
                                            }
                                            return pages.map((page, idx) =>
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm font-bold select-none">...</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page 
                                                            ? 'bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20' 
                                                            : 'bg-white border border-slate-200 text-slate-500 hover:border-[#0D9488] hover:text-[#0D9488]'}`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            );
                                        })()}
                                    </div>

                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0D9488] hover:border-[#0D9488] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'job_applications' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">Applications for Admin Jobs</h3>
                                    <p className="text-slate-400 text-xs mt-1">Candidates who applied to jobs posted by Admin.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Applicant Name</th>
                                                <th className="px-6 py-4">Applied For Job</th>
                                                <th className="px-6 py-4">Contact Info</th>
                                                <th className="px-6 py-4">Resume</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {adminJobApplications.length > 0 ? adminJobApplications.map(app => (
                                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 font-bold text-slate-700">{app.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-primary">{app.jobTitle}</span>
                                                            <span className="text-[10px] text-slate-400">{app.jobLocation}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        <div className="flex flex-col">
                                                            <span>{app.phone}</span>
                                                            <span className="text-xs text-blue-500">{app.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {app.resumePath ? (
                                                            <a href={`${API_BASE_URL}${app.resumePath}`} target="_blank" rel="noreferrer" className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                                                                View Resume
                                                            </a>
                                                        ) : <span className="text-xs text-slate-300">No Resume</span>}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No applications received yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </main>

            <CandidateModal candidate={viewCandidate} onClose={() => setViewCandidate(null)} onAction={(status) => handleAction('resume', 'userId', viewCandidate.id, status)} />
            <CompanyModal company={viewCompany} onClose={() => setViewCompany(null)} onAction={(status) => handleAction('company', 'companyId', viewCompany.id, status)} />
            <JobModal job={viewJob} onClose={() => setViewJob(null)} onAction={(status) => handleAction('job', 'jobId', viewJob.id, status)} />

            {viewCompanyDetails && (
                <CompanyDetailsView
                    company={viewCompanyDetails}
                    onClose={() => setViewCompanyDetails(null)}
                />
            )}

            {/* Simple Image Modal */}
            {imageModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setImageModal({ isOpen: false, src: '' })}>
                    <div className="relative max-w-4xl max-h-screen p-2" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setImageModal({ isOpen: false, src: '' })}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X size={32} />

                        </button>
                        <img
                            src={imageModal.src}
                            alt="Preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
