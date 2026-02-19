import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { X, ShieldAlert, Loader, Briefcase, PlusCircle, Trash2, Edit3, MapPin, IndianRupee, Calendar, Image, Search } from 'lucide-react';

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

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

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

    const [searchTerm, setSearchTerm] = useState('');

    const filteredAdminJobs = adminJobs.filter(job =>
        job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            {/* ... Sidebar ... */}
            {/* Same logic as before */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
                {/* ... Header ... */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'resumes' && 'Verify Resumes'}
                            {activeTab === 'companies' && 'Verify Companies'}
                            {activeTab === 'jobs' && 'Verify Employer Jobs'}
                            {activeTab === 'users_list' && 'All Users Database'}
                            {activeTab === 'companies_list' && 'All Companies Database'}
                            {activeTab === 'post_job' && (editJob ? 'Edit Admin Job' : 'Post Admin Job')}
                            {activeTab === 'admin_jobs' && 'My Admin Jobs'}
                            {activeTab === 'job_applications' && 'Applications for Admin Jobs'}
                        </h1>
                        <p className="text-slate-500 mt-1">System Administration Panel</p>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto pb-20">
                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in duration-500">
                            <DashboardStats stats={stats} />
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
                        <div className="animate-in fade-in duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Admin Posted Jobs ({filteredAdminJobs.length})</h3>
                                    <p className="text-slate-500 text-sm mt-1">Manage jobs posted directly by the administration.</p>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search jobs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                                        />
                                    </div>
                                    <button onClick={() => { setEditJob(null); setActiveTab('post_job'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap">
                                        <PlusCircle size={18} /> Post New
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAdminJobs.length > 0 ? filteredAdminJobs.map(job => (
                                    <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group relative overflow-hidden">

                                        {/* Actions Overlay */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-slate-100 shadow-sm z-10">
                                            <button onClick={() => startEditJob(job)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Job">
                                                <Edit3 size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-slate-200"></div>
                                            <button onClick={() => deleteAdminJob(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Job Header */}
                                        <div className="mb-5 pr-8">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
                                                <Briefcase size={24} />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 leading-tight mb-1 line-clamp-2" title={job.title}>{job.title}</h4>
                                            <p className="text-sm font-medium text-slate-500 line-clamp-1">{job.company || 'No Company Name'}</p>
                                        </div>

                                        {/* Details Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-100">{job.category}</span>
                                            {job.type && <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">{job.type}</span>}
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate" title={job.location}>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{job.salary}</span>
                                            </div>
                                            <div className="flex items-center gap-2 col-span-2">
                                                <Calendar size={14} className="text-slate-400 shrink-0" />
                                                <span>Posted: {new Date(job.postedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {job.socialMediaImage ? (
                                                    <button
                                                        onClick={() => {
                                                            const getImgUrl = (path) => {
                                                                if (!path) return "";
                                                                if (path.startsWith('http')) {
                                                                    if (path.includes('uliyar.com') && window.location.hostname === 'localhost') {
                                                                        return path.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082');
                                                                    }
                                                                    return path;
                                                                }
                                                                return `http://localhost:8082${encodeURI(path)}`;
                                                            };
                                                            setImageModal({ isOpen: true, src: getImgUrl(job.socialMediaImage) });
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline bg-blue-50 px-2 py-1 rounded-md transition-colors hover:bg-blue-100"
                                                    >
                                                        <Image size={12} /> Social
                                                    </button>
                                                ) : <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 px-2 py-1"><Image size={12} /> No Social</span>}

                                                {job.newspaperImage ? (
                                                    <button
                                                        onClick={() => {
                                                            const getImgUrl = (path) => {
                                                                if (!path) return "";
                                                                if (path.startsWith('http')) {
                                                                    if (path.includes('uliyar.com') && window.location.hostname === 'localhost') {
                                                                        return path.replace(/https?:\/\/(www\.)?uliyar\.com/, 'http://localhost:8082');
                                                                    }
                                                                    return path;
                                                                }
                                                                return `http://localhost:8082${encodeURI(path)}`;
                                                            };
                                                            setImageModal({ isOpen: true, src: getImgUrl(job.newspaperImage) });
                                                        }}
                                                        className="text-[10px] font-bold text-purple-600 flex items-center gap-1 hover:underline bg-purple-50 px-2 py-1 rounded-md transition-colors hover:bg-purple-100"
                                                    >
                                                        <Image size={12} /> Paper
                                                    </button>
                                                ) : <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 px-2 py-1"><Image size={12} /> No Paper</span>}
                                            </div>
                                            <span className={`w-2 h-2 rounded-full ${job.status === 'OPEN' ? 'bg-green-500' : 'bg-slate-300'}`} title={job.status}></span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase size={24} className="text-slate-300" />
                                        </div>
                                        <p className="font-medium">No admin jobs posted yet.</p>
                                        <button onClick={() => setActiveTab('post_job')} className="text-blue-600 font-bold hover:underline mt-2 text-sm">Post your first job</button>
                                    </div>
                                )}
                            </div>
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
