import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader, Briefcase, PlusCircle, Trash2 } from 'lucide-react';

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

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [pendingResumes, setPendingResumes] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
    const [adminJobs, setAdminJobs] = useState([]);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [viewCompany, setViewCompany] = useState(null);
    const [viewCandidate, setViewCandidate] = useState(null);
    const [viewJob, setViewJob] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

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
            // Clear state so it doesn't persist on refresh if we don't want it to, 
            // or just leave it. Clearing is safer to avoid stuck state.
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
            fetchList('jobs', setAdminJobs)
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

            const response = await fetch(`${API_BASE_URL}/api/admin/post-job`, {
                method: 'POST',
                // Content-Type is set automatically by the browser for FormData
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                alert("Job Posted Successfully!");
                onSuccess();
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

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
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
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'resumes' && 'Verify Resumes'}
                            {activeTab === 'companies' && 'Verify Companies'}
                            {activeTab === 'jobs' && 'Verify Employer Jobs'}
                            {activeTab === 'users_list' && 'All Users Database'}
                            {activeTab === 'companies_list' && 'All Companies Database'}
                            {activeTab === 'post_job' && 'Post Admin Job'}
                            {activeTab === 'admin_jobs' && 'My Admin Jobs'}
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
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resumes' && <PendingList items={pendingResumes} type="resume" onView={setViewCandidate} />}
                    {activeTab === 'companies' && <PendingList items={pendingCompanies} type="company" onView={setViewCompany} />}
                    {activeTab === 'jobs' && <PendingList items={pendingJobs} type="job" onView={setViewJob} />}
                    {activeTab === 'users_list' && <UserTable users={allUsers} onDelete={(id) => handleDelete('users', id)} onRoleChange={handleRoleChange} />}
                    {activeTab === 'companies_list' && <CompanyTable companies={allCompanies} onDelete={(id) => handleDelete('companies', id)} />}
                    {activeTab === 'post_job' && <AdminJobForm onPost={handlePostJob} isPosting={isPosting} />}

                    {activeTab === 'admin_jobs' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-700">Admin Posted Jobs ({adminJobs.length})</h3>
                                <button onClick={() => setActiveTab('post_job')} className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md">
                                    <PlusCircle size={16} /> Post New
                                </button>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-primary">Job Title</th>
                                                <th className="px-6 py-4">Company</th>
                                                <th className="px-6 py-4">Cat / Sub-Cat</th>
                                                <th className="px-6 py-4">Location</th>
                                                <th className="px-6 py-4">Salary</th>
                                                <th className="px-6 py-4">Contact</th>
                                                <th className="px-6 py-4">Dates (Social/Ann)</th>
                                                <th className="px-6 py-4">Images</th>
                                                <th className="px-6 py-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {adminJobs.length > 0 ? adminJobs.map(job => (
                                                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-slate-700">{job.title}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{job.company}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{job.category}</span>
                                                            <span className="text-xs text-slate-400">{job.subCategory}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">{job.location}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">₹ {job.salary}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                                        <div className="flex flex-col">
                                                            <span>{job.contactPhone}</span>
                                                            <span className="text-xs text-blue-500">{job.contactEmail}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">S: {job.socialMediaDate || '-'}</span>
                                                            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">A: {job.jobAnnouncedDate || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                                        <div className="flex gap-2">
                                                            {job.socialMediaImage && (
                                                                <a href={`${API_BASE_URL}${job.socialMediaImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">Social Img</a>
                                                            )}
                                                            {job.newspaperImage && (
                                                                <a href={`${API_BASE_URL}${job.newspaperImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">Paper Img</a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={() => deleteAdminJob(job.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all mx-auto block">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="9" className="px-6 py-12 text-center text-slate-400 italic">No admin jobs found.</td>
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
        </div>
    );
};

export default AdminDashboard;
