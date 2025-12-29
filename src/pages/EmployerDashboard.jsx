import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Briefcase, MapPin, DollarSign, Loader, Users, FileText, Layout, Building, Globe, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const EmployerDashboard = () => {
    const { user, login, loading } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);

    // Company Registration Form
    const [companyForm, setCompanyForm] = useState({
        name: user?.companyName || '',
        type: 'Private Limited',
        industry: 'IT Services',
        size: '10-50 Employees',
        location: '',
        website: ''
    });

    const navigate = useNavigate();

    // New Job Form
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full Time',
        salary: '',
        experience: '0-1 Years',
        description: '',
        skills_required: '',
        vacancies: '',
        work_mode: 'Day Shift',
        benefits: '',
        deadline: '',
        education_required: '10th Pass',
        food_allowance: 'No',
        accommodation: 'No',
        category: 'Delivery & Transport',
        tags: []
    });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'employer')) {
            navigate('/login');
            return;
        }
        if (user) {
            checkCompanyStatus();
            fetchMyJobs();
        }
    }, [user, loading]);

    const checkCompanyStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/company/status/${user.id}`);
            const data = await res.json();
            if (data.company) {
                setCompany(data.company);
            }
        } catch (error) {
            console.error("Error fetching company status");
        }
    };

    const fetchMyJobs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs?employerId=${user.id}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/company/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...companyForm, recruiterId: user.id }),
            });
            const data = await response.json();
            if (data.success) {
                // Update local status immediately
                setCompany({ ...companyForm, status: data.status });
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
                // Update local state to reflect change immediately
                setApplicants(applicants.map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
            console.error("Error deleting job:", error);
            alert("Error deleting job");
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();

        // Final Safety Check
        if (!company) {
            alert("Please complete company profile first.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newJob, employerId: user.id }),
            });
            if (response.ok) {
                setShowPostModal(false);
                fetchMyJobs();
            } else {
                const d = await response.json();
                alert(d.error);
            }
        } catch (error) { alert("Failed"); }
    };

    if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

    // --- CASE 1: NO COMPANY PROFILE (MANDATORY STEP) ---
    if (!company) {
        return (
            <div className="bg-[#ebf2f7] min-h-screen pt-24 px-4 pb-12">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
                    <div className="text-center mb-10">
                        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building className="text-blue-600 w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#031d31]">Create Company Profile</h2>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">To start posting jobs, tell us about your organization. This builds trust with candidates.</p>
                    </div>

                    <form onSubmit={handleCreateCompany} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Industry Type</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" value={companyForm.industry} onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })}>
                                    <option>IT Services</option>
                                    <option>Construction</option>
                                    <option>Healthcare</option>
                                    <option>Manufacturing</option>
                                    <option>Education</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Type</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" value={companyForm.type} onChange={e => setCompanyForm({ ...companyForm, type: e.target.value })}>
                                    <option>Private Limited</option>
                                    <option>Startup</option>
                                    <option>MNC</option>
                                    <option>Conglomerate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Size</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" value={companyForm.size} onChange={e => setCompanyForm({ ...companyForm, size: e.target.value })}>
                                    <option>1-10 Employees</option>
                                    <option>10-50 Employees</option>
                                    <option>50-200 Employees</option>
                                    <option>200+ Employees</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Headquarters Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input type="text" required placeholder="e.g. Mumbai, India" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 outline-none" value={companyForm.location} onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Website (Optional)</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input type="text" placeholder="https://example.com" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 outline-none" value={companyForm.website} onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-6">
                            <button type="submit" className="w-full bg-[#031d31] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
                                <Building size={20} /> Create Company Profile
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">By creating a profile, you verify that you are an authorized representative.</p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- CASE 2: DASHBOARD (ACTIVE) ---
    return (
        <div className="bg-[#ebf2f7] min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-2xl font-bold text-[#031d31]">{company.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#031d31] leading-none">{company.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">{company.industry} • {company.location}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right mr-4">
                            <p className="text-sm font-bold text-gray-900">Recruiter Plan</p>
                            <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-block">FREE TIER</p>
                        </div>
                        <button
                            onClick={() => setShowPostModal(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                        >
                            <Plus size={20} /> Post New Job
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Jobs List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-[#031d31]">Active Jobs</h2>
                            <span className="text-gray-400 text-sm font-medium">{jobs.length} Posted</span>
                        </div>

                        <div className="space-y-4">
                            {jobs.length > 0 ? jobs.map(job => (
                                <div
                                    key={job.id}
                                    className={`bg-white p-5 rounded-2xl shadow-sm border cursor-pointer transition-all group relative ${selectedJob === job.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-300'}`}
                                    onClick={() => fetchApplicants(job.id)}
                                >
                                    <h3 className="font-bold text-[#031d31] group-hover:text-blue-600 transition-colors pr-8">{job.title}</h3>
                                    <button
                                        onClick={(e) => handleDeleteJob(e, job.id)}
                                        className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Delete Job"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <p className="text-sm text-gray-500 mb-3">{job.location} • {job.type}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-3 border-t border-gray-50">
                                        <span className="flex items-center gap-1"><Users size={14} /> Candidates</span>
                                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">View &rarr;</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm font-medium">No active jobs</p>
                                    <button onClick={() => setShowPostModal(true)} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Post your first job</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Applicants View */}
                    <div className="lg:col-span-2">
                        {selectedJob ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                                <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2">
                                    Applicants for <span className="text-blue-600">{jobs.find(j => j.id === selectedJob)?.title}</span>
                                </h2>

                                {applicants.length > 0 ? (
                                    <div className="space-y-4">
                                        {applicants.map(app => (
                                            <div key={app.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                                {app.name.charAt(0)}
                                                            </div>
                                                            <h4 className="font-bold text-lg text-[#031d31]">{app.name}</h4>
                                                        </div>
                                                        <div className="ml-11 text-sm text-gray-500 space-y-1">
                                                            <p>{app.email}</p>
                                                            <p>{app.phone}</p>
                                                        </div>
                                                        <div className="ml-11 mt-3 flex gap-4">
                                                            {app.resumePath && (
                                                                <a href={`${API_BASE_URL}${app.resumePath}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-xs font-bold border border-blue-100 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                                                                    <FileText size={12} /> RESUME
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Status Control */}
                                                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                                                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Stage</span>
                                                        <select
                                                            value={app.status || 'Applied'}
                                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 border-none outline-none cursor-pointer hover:bg-gray-200 transaction-colors"
                                                        >
                                                            <option value="Applied">Applied</option>
                                                            <option value="Viewed">Viewed</option>
                                                            <option value="Shortlisted">Shortlisted</option>
                                                            <option value="Interview">Interview</option>
                                                            <option value="Hired">Hired</option>
                                                            <option value="Selected">Selected</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                                            <Users className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No applicants yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Candidates will appear here once they apply.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 min-h-[500px] flex flex-col items-center justify-center text-center">
                                <Layout className="w-16 h-16 text-blue-100 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Job</h3>
                                <p className="text-gray-500 max-w-sm">Click on any active job from the list to view and manage candidate applications.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Job Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-[#031d31] mb-6">Post a New Job</h2>
                        <form onSubmit={handlePostJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                                    <input type="text" required placeholder="e.g. Delivery Executive" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" value={newJob.category} onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}>
                                        <option value="Delivery & Transport">Delivery & Transport</option>
                                        <option value="Factory & Manufacturing">Factory & Manufacturing</option>
                                        <option value="Technician & Skilled Trades">Technician & Skilled Trades</option>
                                        <option value="Housekeeping & Cleaning">Housekeeping & Cleaning</option>
                                        <option value="Security Jobs">Security Jobs</option>
                                        <option value="Hotel, Restaurant & Food">Hotel, Restaurant & Food</option>
                                        <option value="Shop & Retail">Shop & Retail</option>
                                        <option value="Healthcare Support">Healthcare Support</option>
                                        <option value="Construction & Site">Construction & Site</option>
                                        <option value="Domestic & Personal Services">Domestic & Personal Services</option>
                                        <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                                        <option value="Agriculture & Outdoor">Agriculture & Outdoor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Shift Timing</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" value={newJob.work_mode} onChange={(e) => setNewJob({ ...newJob, work_mode: e.target.value })}>
                                        <option value="Day Shift">Day Shift (General)</option>
                                        <option value="Night Shift">Night Shift</option>
                                        <option value="Rotational">Rotational Shift</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vacancies</label>
                                    <input type="number" placeholder="Number of openings" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.vacancies} onChange={(e) => setNewJob({ ...newJob, vacancies: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Food / Canteen?</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" value={newJob.food_allowance} onChange={(e) => setNewJob({ ...newJob, food_allowance: e.target.value })}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes, Provided</option>
                                        <option value="Subsidized">Subsidized</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Accommodation?</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" value={newJob.accommodation} onChange={(e) => setNewJob({ ...newJob, accommodation: e.target.value })}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes, Provided</option>
                                        <option value="Assistance">Assistance Provided</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Education Required</label>
                                    <input type="text" placeholder="e.g. 10th Pass, ITI, Diploma" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.education_required} onChange={(e) => setNewJob({ ...newJob, education_required: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Application Deadline</label>
                                    <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.deadline} onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Perks & Benefits</label>
                                <input type="text" placeholder="e.g. Health Insurance, Transport, WFH" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.benefits} onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    <input type="text" required placeholder="e.g. Bangalore" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range</label>
                                    <input type="text" required placeholder="e.g. 5L - 8L LPA" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Key Skills Required</label>
                                <input type="text" required placeholder="e.g. React, Node.js, Leadership" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={newJob.skills_required} onChange={(e) => setNewJob({ ...newJob, skills_required: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description</label>
                                <textarea required rows="4" placeholder="Detailed job roles and responsibilities..." className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowPostModal(false)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg">Publish Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
