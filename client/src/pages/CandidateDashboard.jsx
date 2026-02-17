import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, FileText, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CandidateDashboard = () => {
    const { user, loading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'employee')) {
            navigate('/');
            return;
        }

        if (user) fetchApplications();
    }, [user, loading]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my-applications?applicantId=${user.id}`);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Applied': 'bg-blue-50 text-blue-700',
            'Viewed': 'bg-yellow-50 text-yellow-700',
            'Shortlisted': 'bg-purple-50 text-purple-700',
            'Interview': 'bg-orange-50 text-orange-700',
            'Selected': 'bg-green-50 text-green-700',
            'Hired': 'bg-green-50 text-green-700',
            'Rejected': 'bg-red-50 text-red-700'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || styles['Applied']}`}>
                {status}
            </span>
        );
    };

    if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

    return (
        <div className="bg-[#ebf2f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#031d31]">My Applications</h1>
                        <p className="text-gray-600 mt-1">Manage and track your job applications.</p>
                    </div>
                    <button onClick={() => navigate('/find-jobs')} className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                        Browse More Jobs <span className="text-xl">&rarr;</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <div key={app.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                {/* Status Accent Bar */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${['Selected', 'Hired'].includes(app.status) ? 'bg-green-500' :
                                    app.status === 'Rejected' ? 'bg-red-500' :
                                        app.status === 'Interview' ? 'bg-orange-500' :
                                            'bg-blue-500'
                                    }`}></div>

                                <div className="pl-4 flex flex-col md:flex-row gap-6 justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#031d31] group-hover:text-blue-600 transition-colors">{app.jobTitle}</h3>
                                                <p className="text-gray-500 font-medium flex items-center gap-2">
                                                    {app.company} <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-sm">{app.location}</span>
                                                </p>
                                            </div>
                                            <div className="md:hidden">
                                                {getStatusBadge(app.status)}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                            {app.resumePath && (
                                                <a
                                                    href={`${API_BASE_URL}${app.resumePath}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    <FileText size={16} /> View Resume
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Application Progress Stepper */}
                                    <div className="hidden md:flex flex-col items-end min-w-[200px]">
                                        <div className="mb-3 text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Current Status</p>
                                            {getStatusBadge(app.status)}
                                        </div>

                                        {/* Simple Progress Bar Visual */}
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden flex">
                                            {/* Stage 1: Applied (Always filled) */}
                                            <div className="h-full bg-blue-500 w-1/4"></div>

                                            {/* Stage 2: Viewed */}
                                            <div className={`h-full bg-blue-500 ${['Viewed', 'Shortlisted', 'Interview', 'Hired', 'Selected', 'Rejected'].includes(app.status) ? 'w-1/4' : 'w-0'}`}></div>

                                            {/* Stage 3: Shortlisted/Interview */}
                                            <div className={`h-full bg-blue-500 ${['Shortlisted', 'Interview', 'Hired', 'Selected', 'Rejected'].includes(app.status) ? 'w-1/4' : 'w-0'}`}></div>

                                            {/* Stage 4: Final Decision */}
                                            <div className={`h-full ${['Hired', 'Selected'].includes(app.status) ? 'bg-green-500 w-1/4' :
                                                app.status === 'Rejected' ? 'bg-red-500 w-1/4' :
                                                    app.status === 'Interview' ? 'bg-orange-500 w-1/4' :
                                                        'w-0'
                                                }`}></div>
                                        </div>
                                        <div className="flex justify-between w-full text-[10px] text-gray-400 font-bold uppercase mt-1">
                                            <span>Sent</span>
                                            <span>Viewed</span>
                                            <span>Shortlist</span>
                                            <span>Decision</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start looking for your next opportunity. Your applications will track right here.</p>
                            <button
                                onClick={() => navigate('/find-jobs')}
                                className="bg-[#031d31] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all transform hover:-translate-y-1"
                            >
                                Browse Open Jobs
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
