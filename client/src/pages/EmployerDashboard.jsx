import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building, AlertCircle, Loader, Plus, Users, Shield, MapPin, Globe, X, Upload, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

// Import Sidebar
import EmployerSidebar from '../components/employer/EmployerSidebar';
import EmployerStats from '../components/employer/EmployerStats';
import EmployerJobs from '../components/employer/EmployerJobs';
import PostJobForm from '../components/employer/PostJobForm';
import CompanyProfileSection from '../components/employer/CompanyProfileSection';
import EmployerPlan from '../components/employer/EmployerPlan';

const EmployerDashboard = () => {
    const { user, login, loading, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Company Registration Form State
    const [companyForm, setCompanyForm] = useState({
        name: user?.companyName || '',
        type: 'Private Limited',
        industry: 'IT Services',
        size: '10-50 Employees',
        location: '',
        website: ''
    });
    const [verificationDocs, setVerificationDocs] = useState({
        businessProof: null,
        idProof: null
    });

    // --- Effects ---
    useEffect(() => {
        if (!loading && (!user || user.role !== 'employer')) {
            navigate('/');
            return;
        }
        if (user) {
            checkCompanyStatus();
            fetchMyJobs();
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (location.state?.openPostModal) {
            setActiveTab('post-job');
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // --- API Interactions ---
    const checkCompanyStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/company/status/${user.id}`);
            const data = await res.json();
            if (data.company) {
                setCompany(data.company);
                setCompanyForm(prev => ({ ...prev, name: data.company.name }));
            } else {
                setIsCompanyModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching company status");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyJobs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs?employerId=${user.id}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs");
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        if (!verificationDocs.businessProof || !verificationDocs.idProof) {
            alert("Please upload verification documents to proceed.");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(companyForm).forEach(key => formData.append(key, companyForm[key]));
            formData.append('recruiterId', user.id);
            formData.append('businessProof', verificationDocs.businessProof);
            formData.append('idProof', verificationDocs.idProof);

            const response = await fetch(`${API_BASE_URL}/api/company/create`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setCompany({ ...companyForm, status: data.status || 'PENDING' });
                setIsCompanyModalOpen(false);
            } else {
                alert(data.error || "Failed to create company profile");
            }
        } catch (error) {
            alert("Failed to create company profile");
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/job-applications/${jobId}?employerId=${user.id}`);
            const data = await response.json();
            setApplicants(data);
            setSelectedJob(jobId);
        } catch (error) { console.error(error); }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${appId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setApplicants(applicants.map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            alert("Error updating status");
        }
    };

    const handleDeleteJob = async (e, jobId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setJobs(jobs.filter(job => job.id !== jobId));
                if (selectedJob === jobId) {
                    setSelectedJob(null);
                    setApplicants([]);
                }
            } else {
                alert("Failed to delete job");
            }
        } catch (error) {
            alert("Error deleting job");
        }
    };

    if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

    const isPlanActive = (user && user.role === 'admin') || (company && company.plan_expiry_date && new Date(company.plan_expiry_date) > new Date());

    return (
        <div className="min-h-screen bg-slate-50/50 flex relative">
            <EmployerSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={() => { logout(); navigate('/'); }}
                companyName={company?.name || 'My Company'}
                isPlanActive={isPlanActive}
            />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto h-screen custom-scrollbar">
                {/* Header */}
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                {activeTab === 'dashboard' && 'Dashboard Overview'}
                                {activeTab === 'jobs' && 'My Jobs & Applicants'}
                                {activeTab === 'post-job' && 'Post a New Job'}
                                {activeTab === 'profile' && 'Company Profile'}
                                {activeTab === 'plan' && 'Subscription Plan'}
                            </h1>
                            <p className="text-slate-500 mt-1 text-xs md:text-sm">Manage your recruitment pipeline efficiently.</p>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto pb-20">
                    {company && company.status === 'PENDING' && (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-bold text-orange-800">Verification Pending</h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    Your account is currently under review. Your jobs will not be published until verified.
                                </p>
                            </div>
                        </div>
                    )}
                    {company && company.status === 'REJECTED' && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-bold text-red-800">Verification Failed</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    Your verification was rejected. Please contact support.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- TAB CONTENT --- */}
                    {activeTab === 'dashboard' && company && (
                        <div className="animate-in fade-in duration-300 space-y-8">
                            <EmployerStats jobs={jobs} company={company} />
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-700 text-lg">Your Active Jobs</h3>
                                    <button onClick={() => setActiveTab('jobs')} className="text-primary font-bold text-sm hover:underline">View All &rarr;</button>
                                </div>
                                {jobs.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {jobs.slice(0, 4).map(job => (
                                            <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer" onClick={() => { setSelectedJob(job.id); fetchApplicants(job.id); setActiveTab('jobs'); }}>
                                                <h4 className="font-bold text-slate-800 line-clamp-1">{job.title}</h4>
                                                <p className="text-slate-500 text-sm mt-1">{job.location} • {job.type}</p>
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className={`text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600`}>{job.applicant_count || 0} Applicants</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                        <p className="text-slate-500 mb-4 font-medium">No jobs posted yet.</p>
                                        <button onClick={() => setActiveTab('post-job')} className="text-primary font-bold hover:underline">Create First Job</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'jobs' && company && (
                        <EmployerJobs
                            jobs={jobs}
                            applicants={applicants}
                            selectedJob={selectedJob}
                            fetchApplicants={fetchApplicants}
                            handleStatusUpdate={handleStatusUpdate}
                            handleDeleteJob={handleDeleteJob}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'post-job' && company && (
                        isPlanActive ? (
                            <PostJobForm user={user} company={company} setActiveTab={setActiveTab} />
                        ) : (
                            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-2xl mx-auto shadow-sm">
                                <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Locked Feature</h3>
                                <p className="text-slate-500 mb-6">Posting a job is locked because your "Standard Plan" is inactive. Subscribe to unlock unlimited recruiting.</p>
                                <button
                                    onClick={() => setActiveTab('plan')}
                                    className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-primary/20"
                                >
                                    Activate Plan
                                </button>
                            </div>
                        )
                    )}

                    {activeTab === 'plan' && company && (
                        <EmployerPlan user={user} company={company} setActiveTab={setActiveTab} />
                    )}

                    {activeTab === 'profile' && company && (
                        <CompanyProfileSection company={company} />
                    )}
                </div>
            </main>

            {/* Company Creation Modal */}
            <AnimatePresence>
                {isCompanyModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 overflow-y-auto no-scrollbar">
                                <div className="text-center mb-8">
                                    <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3">
                                        <Building className="text-primary w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Setup Company Profile</h2>
                                    <p className="text-slate-500 mt-1 text-sm">Tell us about your organization to start posting jobs.</p>
                                </div>

                                <form onSubmit={handleCreateCompany} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1"> <Building size={14} className="text-primary" /> Company Name</label>
                                            <input type="text" required placeholder="Uliyar Tech" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1"> <Briefcase size={14} className="text-primary" /> Industry</label>
                                            <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.industry} onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })}>
                                                <option>IT Services</option>
                                                <option>Construction</option>
                                                <option>Healthcare</option>
                                                <option>Manufacturing</option>
                                                <option>Education</option>
                                                <option>Logistics</option>
                                                <option>Retail</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1">Company Type</label>
                                            <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.type} onChange={e => setCompanyForm({ ...companyForm, type: e.target.value })}>
                                                <option>Private Limited</option>
                                                <option>Proprietorship</option>
                                                <option>Partnership</option>
                                                <option>LLP</option>
                                                <option>Public Limited</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1">Team Size</label>
                                            <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.size} onChange={e => setCompanyForm({ ...companyForm, size: e.target.value })}>
                                                <option>1-10 Employees</option>
                                                <option>10-50 Employees</option>
                                                <option>50-200 Employees</option>
                                                <option>200+ Employees</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1"> <MapPin size={14} className="text-primary" /> Location</label>
                                            <input type="text" required placeholder="Mumbai, India" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.location} onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 ml-1"> <Globe size={14} className="text-primary" /> Website</label>
                                            <input type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium" value={companyForm.website} onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Shield size={18} />
                                            <h4 className="font-bold text-sm">Security Verification</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Business Registration</label>
                                                <div className="relative">
                                                    <input type="file" required onChange={e => setVerificationDocs({ ...verificationDocs, businessProof: e.target.files[0] })} className="hidden" id="biz-proof" />
                                                    <label htmlFor="biz-proof" className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-primary/50 transition-all">
                                                        <Upload size={16} className="text-slate-400" />
                                                        <span className="text-xs font-semibold text-slate-600 truncate">{verificationDocs.businessProof ? verificationDocs.businessProof.name : 'Upload Proof'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Personal ID (Aadhar/PAN)</label>
                                                <div className="relative">
                                                    <input type="file" required onChange={e => setVerificationDocs({ ...verificationDocs, idProof: e.target.files[0] })} className="hidden" id="id-proof" />
                                                    <label htmlFor="id-proof" className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-primary/50 transition-all">
                                                        <Upload size={16} className="text-slate-400" />
                                                        <span className="text-xs font-semibold text-slate-600 truncate">{verificationDocs.idProof ? verificationDocs.idProof.name : 'Upload ID'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-4 rounded-3xl font-bold shadow-lg shadow-primary/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-widest"
                                        >
                                            Complete Setup
                                        </button>
                                        <button type="button" onClick={() => { logout(); navigate('/'); }} className="w-full text-slate-400 text-xs font-bold mt-4 hover:text-slate-600 transition-all">Sign out and go back</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployerDashboard;
