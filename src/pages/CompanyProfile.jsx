import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Globe, Users, Save, Loader, Pencil, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CompanyProfile = () => {
    const { user, fetchUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [company, setCompany] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    useEffect(() => {
        if (user) fetchCompany();
    }, [user]);

    const fetchCompany = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/company/status/${user.id}`);
            const data = await res.json();
            if (data.company) {
                setCompany(data.company);
            }
        } catch (error) {
            console.error("Error fetching company");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 1. Update Personal Photo if provided
            if (photoFile) {
                const userFormData = new FormData();
                userFormData.append('photo', photoFile);
                userFormData.append('name', user.name); // Keep existing name
                await fetch(`${API_BASE_URL}/api/user/profile/${user.id}`, {
                    method: 'PUT',
                    body: userFormData
                });
                await fetchUser(user.id); // Refresh navbar
            }

            // 2. Update Company Details
            const formData = new FormData();
            formData.append('name', company.name);
            formData.append('industry', company.industry);
            formData.append('type', company.type);
            formData.append('size', company.size);
            formData.append('location', company.location);
            formData.append('website', company.website);
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/company/${company.id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                alert("Profile and Company Details Updated!");
                setIsEditing(false);
                fetchCompany();
            }
        } catch (error) {
            alert("Error updating profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

    if (!company) return <div className="min-h-screen flex items-center justify-center">No Company Profile Found. Please create one in Dashboard.</div>;

    // ----------------------------------------------------
    // 👀 VIEW MODE
    // ----------------------------------------------------
    if (!isEditing) {
        return (
            <div className="bg-[#ebf2f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header Card */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-hidden relative group">
                        {/* Gradient Banner */}
                        <div className="h-32 bg-gradient-to-r from-[#003366] to-[#031d31]"></div>

                        <div className="px-8 pb-8 flex flex-col md:flex-row justify-between items-end -mt-12 relative z-10">
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-[#031d31] text-4xl font-bold overflow-hidden">
                                        {company.logo_path ? <img src={`${API_BASE_URL}${company.logo_path}`} className="w-full h-full object-cover" alt="logo" /> : company.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-4xl font-bold text-[#031d31]">{company.name}</h1>
                                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                        <MapPin size={16} className="text-blue-500" /> {company.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 md:mt-0">
                                <button onClick={() => navigate('/employer-dashboard')} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                                    <Building size={18} /> Dashboard
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#031d31] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-900 transition-all hover:-translate-y-1">
                                    <Pencil size={18} /> Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex gap-4 mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${company.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                <CheckCircle size={14} /> Status: {company.status}
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                <Users size={14} /> {company.size}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Quick Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-6 flex items-center gap-2"><Globe size={20} className="text-purple-600" /> Web Presence</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold">Website</p>
                                        <a href={company.website} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline truncate block">
                                            {company.website || "Not Provided"}
                                        </a>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Internal Stats</p>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm">Active Jobs</span>
                                            <span className="font-bold text-[#031d31]">--</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">Total Hires</span>
                                            <span className="font-bold text-[#031d31]">--</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Column: Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-6 flex items-center gap-2"><Building size={20} className="text-blue-600" /> Organization Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Industry</p>
                                        <p className="text-xl font-bold text-[#031d31]">{company.industry}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Company Type</p>
                                        <p className="text-xl font-bold text-[#031d31]">{company.type}</p>
                                    </div>

                                </div>

                                <div className="mt-8 p-6 border border-gray-100 rounded-2xl flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-xl text-green-700">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#031d31]">Verification Documents</h4>
                                        <p className="text-gray-500 text-sm mt-1">Your business documents have been securely uploaded are pending review by our administration team.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // ✏️ EDIT MODE
    // ----------------------------------------------------
    return (
        <div className="bg-[#ebf2f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#031d31]">Edit Company</h1>
                        <p className="text-gray-600">Update organization details.</p>
                    </div>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-600 font-bold flex items-center gap-1">
                        <X size={20} /> Cancel
                    </button>
                </div>

                <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Personal Profile Photo (for Header)</label>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center overflow-hidden">
                                {previewPhoto ?
                                    <img src={previewPhoto} className="w-full h-full object-cover" alt="preview" /> :
                                    (user.profile_photo_path ?
                                        <img src={`${API_BASE_URL}${user.profile_photo_path}`} className="w-full h-full object-cover" alt="current" /> :
                                        <span className="text-2xl font-bold text-blue-300">{user.name.charAt(0)}</span>
                                    )
                                }
                            </div>
                            <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 font-bold py-2 px-4 rounded-xl hover:bg-blue-50 transition-all shadow-sm text-sm">
                                Change Profile Photo
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company Logo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden">
                                {previewLogo ?
                                    <img src={previewLogo} className="w-full h-full object-cover" alt="preview" /> :
                                    (company.logo_path ?
                                        <img src={`${API_BASE_URL}${company.logo_path}`} className="w-full h-full object-cover" alt="current" /> :
                                        <span className="text-2xl font-bold text-gray-300">{company.name.charAt(0)}</span>
                                    )
                                }
                            </div>
                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm">
                                Change Logo
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                        <input type="text" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                            <select value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                <option>IT Services</option>
                                <option>Construction</option>
                                <option>Healthcare</option>
                                <option>Manufacturing</option>
                                <option>Education</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                            <select value={company.type} onChange={e => setCompany({ ...company, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                <option>Private Limited</option>
                                <option>Startup</option>
                                <option>MNC</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Size</label>
                            <select value={company.size} onChange={e => setCompany({ ...company, size: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                <option>1-10 Employees</option>
                                <option>10-50 Employees</option>
                                <option>50-200 Employees</option>
                                <option>200+ Employees</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <input type="text" value={company.location} onChange={e => setCompany({ ...company, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                        <input type="text" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                    </div>

                    <button disabled={isSaving} type="submit" className="w-full bg-[#031d31] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
                        {isSaving ? <Loader className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfile;
