import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, Building, Users, Briefcase, FileText, UserCheck, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [pendingResumes, setPendingResumes] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
    const [activeTab, setActiveTab] = useState('resumes'); // resumes, companies, jobs, users_list, companies_list
    const [viewCompany, setViewCompany] = useState(null);
    const [viewCandidate, setViewCandidate] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (data.success) {
                setIsAuthenticated(true);
                fetchAllPending();
            } else {
                alert("Invalid Password");
            }
        } catch (error) {
            alert("Login Failed");
        }
    };

    const fetchAllPending = () => {
        fetchPending('resumes', setPendingResumes);
        fetchPending('companies', setPendingCompanies);
        fetchPending('jobs', setPendingJobs);
        fetchList('users', setAllUsers);
        fetchList('companies', setAllCompanies);
    };

    const fetchList = async (type, setter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/${type}`);
            const data = await response.json();
            setter(data);
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("ARTE YOU SURE? This will permanently delete the profile and all related data (Jobs, Applications, etc).")) return;
        try {
            await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
            alert("Deleted Successfully");
            fetchAllPending();
        } catch (error) { alert("Failed to delete"); }
    };

    const fetchPending = async (type, setter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/pending-${type}`);
            const data = await response.json();
            setter(data);
        } catch (error) { console.error(error); }
    };

    const handleAction = async (type, idKey, idValue, status) => {
        const endpointMap = {
            'resume': 'verify-resume',
            'company': 'verify-company',
            'job': 'verify-job'
        };
        const body = { status };
        body[idKey] = idValue;

        try {
            await fetch(`${API_BASE_URL}/api/admin/${endpointMap[type]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${status}!`);
            fetchAllPending();
        } catch (error) { alert("Failed"); }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#ebf2f7]">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-[#031d31] mb-6 text-center">Admin Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Admin Password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-[#031d31] text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all">
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ebf2f7]">
            <nav className="bg-[#031d31] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold">Master Control</span>
                            <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                <ShieldAlert size={12} /> ADMIN MODE
                            </span>
                        </div>
                        <button onClick={() => setIsAuthenticated(false)} className="text-gray-300 hover:text-white">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="col-span-1 space-y-2">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-4">Verification</div>
                        <button
                            onClick={() => setActiveTab('resumes')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'resumes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            <FileText size={18} /> Resumes
                            {pendingResumes.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{pendingResumes.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'companies' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            <Building size={18} /> New Companies
                            {pendingCompanies.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{pendingCompanies.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            <Briefcase size={18} /> New Jobs
                            {pendingJobs.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{pendingJobs.length}</span>}
                        </button>

                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2 px-4">Database Management</div>
                        <button
                            onClick={() => setActiveTab('users_list')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'users_list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            <Users size={18} /> All Users
                        </button>
                        <button
                            onClick={() => setActiveTab('companies_list')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'companies_list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            <Building size={18} /> All Companies
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3">
                        {activeTab === 'resumes' && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#031d31] mb-6">Pending Resume Verifications</h2>
                                <div className="space-y-4">
                                    {pendingResumes.length > 0 ? (
                                        pendingResumes.map(user => (
                                            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-yellow-400">
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#031d31]">{user.name}</h3>
                                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Uploaded: Just now</p>
                                                </div>
                                                <button onClick={() => setViewCandidate(user)} className="px-6 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-bold hover:bg-yellow-100 flex items-center gap-2">
                                                    <UserCheck size={18} /> Review Candidate
                                                </button>
                                            </div>
                                        ))
                                    ) : <EmptyState message="All resumes verified!" />}
                                </div>
                            </div>
                        )}

                        {/* Candidate Review Modal */}
                        {viewCandidate && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in duration-200">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                {viewCandidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-[#031d31]">{viewCandidate.name}</h2>
                                                <p className="text-gray-500">{viewCandidate.email}</p>
                                                <p className="text-gray-500 text-sm">{viewCandidate.mobile || 'No mobile'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setViewCandidate(null)} className="text-gray-400 hover:text-red-500"><XCircle size={28} /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 p-5 rounded-2xl">
                                            <h4 className="font-bold text-[#031d31] mb-2 flex items-center gap-2"><Briefcase size={16} /> Experience</h4>
                                            {viewCandidate.experience?.role ? (
                                                <div>
                                                    <p className="font-bold text-gray-800">{viewCandidate.experience.role}</p>
                                                    <p className="text-sm text-gray-600">{viewCandidate.experience.company}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{viewCandidate.experience.years} Years</p>
                                                </div>
                                            ) : <p className="text-gray-400 text-sm">Fresher</p>}
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-2xl">
                                            <h4 className="font-bold text-[#031d31] mb-2 flex items-center gap-2"><Building size={16} /> Education</h4>
                                            {viewCandidate.education?.degree ? (
                                                <div>
                                                    <p className="font-bold text-gray-800">{viewCandidate.education.degree}</p>
                                                    <p className="text-sm text-gray-600">{viewCandidate.education.college}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{viewCandidate.education.year}</p>
                                                </div>
                                            ) : <p className="text-gray-400 text-sm">Not specified</p>}
                                        </div>
                                        <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-2xl">
                                            <h4 className="font-bold text-[#031d31] mb-2">Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(viewCandidate.skills) && viewCandidate.skills.length > 0 ?
                                                    viewCandidate.skills.map((s, i) => <span key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-medium text-gray-700">{s}</span>)
                                                    : <p className="text-gray-400 text-sm">No skills listed</p>}
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Resume Document</p>
                                                <p className="font-bold text-gray-800 text-sm">resume_file.pdf</p>
                                            </div>
                                            <a href={`${API_BASE_URL}${viewCandidate.resume_path}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md flex items-center gap-2">
                                                <FileText size={16} /> Download
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                                        <button onClick={() => { handleAction('resume', 'userId', viewCandidate.id, 'REJECTED'); setViewCandidate(null); }} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                                            Reject Candidate
                                        </button>
                                        <button onClick={() => { handleAction('resume', 'userId', viewCandidate.id, 'APPROVED'); setViewCandidate(null); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle size={20} /> Approve Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'companies' && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#031d31] mb-6">Pending Company Verifications</h2>
                                <div className="space-y-4">
                                    {pendingCompanies.length > 0 ? (
                                        pendingCompanies.map(company => (
                                            <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2"><h3 className="text-xl font-bold text-[#031d31]">{company.name}</h3> <span className="bg-gray-100 text-xs px-2 py-0.5 rounded">{company.type}</span></div>
                                                    <p className="text-gray-500 text-sm">{company.industry} • {company.location}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Applied: Just now</p>
                                                </div>
                                                <button onClick={() => setViewCompany(company)} className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-2">
                                                    <Building size={18} /> Review Profile
                                                </button>
                                            </div>
                                        ))
                                    ) : <EmptyState message="All companies verified!" />}
                                </div>
                            </div>
                        )}

                        {/* Company Details Modal */}
                        {viewCompany && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in duration-200">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                                                {viewCompany.logo_path ? <img src={`${API_BASE_URL}${viewCompany.logo_path}`} className="w-full h-full object-cover rounded-xl" /> : <Building className="text-gray-300" />}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-[#031d31]">{viewCompany.name}</h2>
                                                <p className="text-gray-500">{viewCompany.industry}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setViewCompany(null)} className="text-gray-400 hover:text-red-500"><XCircle size={28} /></button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Type</p>
                                            <p className="font-bold text-gray-800">{viewCompany.type}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Size</p>
                                            <p className="font-bold text-gray-800">{viewCompany.size}</p>
                                        </div>
                                        <div className="col-span-2 bg-gray-50 p-4 rounded-xl">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Location</p>
                                            <p className="font-bold text-gray-800">{viewCompany.location}</p>
                                        </div>
                                        {viewCompany.website && (
                                            <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-xs text-blue-400 font-bold uppercase mb-1">Website</p>
                                                <a href={viewCompany.website} target="_blank" rel="noreferrer" className="font-bold text-blue-700 hover:underline">{viewCompany.website}</a>
                                            </div>
                                        )}
                                        {viewCompany.doc_path && (
                                            <div className="col-span-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-yellow-600 font-bold uppercase mb-1">Official Document</p>
                                                    <p className="font-bold text-gray-800 text-sm">verification_doc.pdf</p>
                                                </div>
                                                <a href={`${API_BASE_URL}${viewCompany.doc_path}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold hover:bg-yellow-200">View Document</a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                                        <button onClick={() => { handleAction('company', 'companyId', viewCompany.id, 'REJECTED'); setViewCompany(null); }} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                                            Reject Application
                                        </button>
                                        <button onClick={() => { handleAction('company', 'companyId', viewCompany.id, 'APPROVED'); setViewCompany(null); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle size={20} /> Approve Company
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#031d31] mb-6">Pending Job Approvals</h2>
                                <div className="space-y-4">
                                    {pendingJobs.length > 0 ? (
                                        pendingJobs.map(job => (
                                            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-400">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-[#031d31]">{job.title}</h3>
                                                        <p className="text-blue-600 font-medium">{job.companyName}</p>
                                                        <div className="flex gap-3 text-sm text-gray-500 mt-2"><span>{job.location}</span><span>• {job.salary}</span></div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                                    <button onClick={() => handleAction('job', 'jobId', job.id, 'REJECTED')} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100">Reject</button>
                                                    <button onClick={() => handleAction('job', 'jobId', job.id, 'OPEN')} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 flex items-center gap-2"><CheckCircle size={18} /> Approve</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : <EmptyState message="No pending jobs!" />}
                                </div>
                            </div>
                        )}

                        {activeTab === 'users_list' && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#031d31] mb-6">All Registered Users</h2>
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-4 text-sm font-bold text-gray-500">Name</th>
                                                <th className="p-4 text-sm font-bold text-gray-500">Email/Role</th>
                                                <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                                                <th className="p-4 text-sm font-bold text-gray-500 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map(user => (
                                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="p-4 font-bold text-[#031d31]">{user.name}</td>
                                                    <td className="p-4 text-sm text-gray-600">
                                                        <div>{user.email}</div>
                                                        <div className="text-xs uppercase bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">{user.role}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.account_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {user.account_status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => handleDelete('users', user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold text-sm">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'companies_list' && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#031d31] mb-6">All Companies</h2>
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-4 text-sm font-bold text-gray-500">Company</th>
                                                <th className="p-4 text-sm font-bold text-gray-500">Location/Industry</th>
                                                <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                                                <th className="p-4 text-sm font-bold text-gray-500 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allCompanies.map(comp => (
                                                <tr key={comp.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="p-4 font-bold text-[#031d31]">{comp.name}</td>
                                                    <td className="p-4 text-sm text-gray-600">
                                                        <div>{comp.location}</div>
                                                        <div className="text-xs text-gray-400 mt-1">{comp.industry}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${comp.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {comp.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => handleDelete('companies', comp.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold text-sm">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ message }) => (
    <div className="text-center py-20 bg-white rounded-3xl text-gray-400">
        <UserCheck className="w-16 h-16 mx-auto mb-4 text-green-100" />
        <p>{message}</p>
    </div>
);

export default AdminDashboard;
