import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, GraduationCap, Code, FileText, Save, Loader, AlertTriangle, Upload, CheckCircle, Pencil, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const BLUECOLLAR_MAP = {
    "Delivery & Transport": ["Delivery Boy / Delivery Executive", "Bike Rider", "Courier Boy", "Auto Driver", "Cab Driver", "Truck / Lorry Driver", "Helper (Driver Assistant)"],
    "Factory & Manufacturing": ["Factory Worker", "Machine Operator", "CNC Operator", "Helper / Labour", "Packing Staff", "Assembly Line Worker", "Warehouse Worker"],
    "Technician & Skilled Trades": ["Electrician", "Plumber", "AC Technician", "Refrigerator Technician", "Mobile Repair Technician", "Mechanic", "Welder", "Carpenter", "Painter"],
    "Housekeeping & Cleaning": ["Housekeeping Staff", "Office Cleaner", "Hotel Cleaning Staff", "Hospital Cleaner", "Janitor", "Sanitation Worker"],
    "Security Jobs": ["Security Guard", "Watchman", "Bouncer", "Night Guard", "CCTV Monitoring Staff"],
    "Hotel, Restaurant & Food": ["Hotel Boy", "Room Service", "Kitchen Helper", "Cook / Assistant Cook", "Waiter / Steward", "Dishwasher", "Tea Master"],
    "Shop & Retail": ["Shop Helper", "Sales Boy / Sales Girl", "Store Keeper", "Cashier", "Supermarket Staff", "Mall Helper"],
    "Healthcare Support": ["Hospital Attender", "Ward Boy", "Nurse Assistant", "Lab Helper", "Ambulance Driver"],
    "Construction & Site": ["Construction Worker", "Mason", "Site Helper", "Bar Bender", "Tiles Worker", "Painter (Construction)", "Scaffolding Worker"],
    "Domestic & Personal Services": ["House Maid", "Cook (Home)", "Driver (Personal)", "Babysitter", "Elder Care Helper"],
    "Warehouse & Logistics": ["Loader / Unloader", "Picker / Packer", "Warehouse Supervisor", "Inventory Helper"],
    "Agriculture & Outdoor": ["Farm Worker", "Gardener", "Poultry Worker", "Dairy Helper"]
};

const CandidateProfile = () => {
    const { user, fetchUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Controls View vs Edit Mode
    const [resumeFile, setResumeFile] = useState(null);
    const [errors, setErrors] = useState({}); // For red validation borders

    const [profile, setProfile] = useState({
        dob: '',
        gender: '',
        current_location: '',
        preferred_location: '',
        bio: '',
        languages: '',
        notice_period: '',
        expected_salary: '',
        full_address: '',
        driving_license: '',
        own_vehicle: '',
        shift_preference: '',
        education: { degree: '', college: '', year: '', percentage: '' },
        experience: { isFresher: 'true', years: '0', role: '', company: '', start_date: '', end_date: '', description: '' },
        skills: '',
        resume_path: null,
        resume_status: 'PENDING',
        profile_photo_path: null,
        interested_category: '',
        target_roles: ''
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/${user.id}`);
            const data = await res.json();

            setProfile({
                dob: data.dob || '',
                gender: data.gender || '',
                current_location: data.current_location || '',
                preferred_location: data.preferred_location || '',
                bio: data.bio || '',
                languages: data.languages || '',
                notice_period: data.notice_period || '',
                expected_salary: data.expected_salary || '',
                full_address: data.full_address || '',
                driving_license: data.driving_license || '',
                own_vehicle: data.own_vehicle || '',
                shift_preference: data.shift_preference || '',
                education: data.education || { degree: '', college: '', year: '', percentage: '' },
                experience: data.experience || { isFresher: 'true', years: '0', role: '', company: '', start_date: '', end_date: '', description: '' },
                skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
                resume_path: data.resume_path,
                resume_status: data.resume_status || 'PENDING',
                profile_photo_path: data.profile_photo_path,
                interested_category: data.interested_category || '',
                target_roles: Array.isArray(data.target_roles) ? data.target_roles.join(', ') : (data.target_roles || '')
            });

            // If profile is complete, start in View Mode. Otherwise Edit Mode.
            if (data.profile_status === 'COMPLETE') setIsEditing(false);
            else setIsEditing(true);

        } catch (error) {
            console.error("Fetch profile error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!profile.dob) newErrors.dob = true;
        if (!profile.gender) newErrors.gender = true;
        if (!profile.current_location) newErrors.current_location = true;
        if (!profile.education.degree) newErrors.degree = true;
        if (!profile.education.college) newErrors.college = true;
        if (!profile.skills) newErrors.skills = true;
        if (!profile.interested_category) newErrors.interested_category = true;
        if (!profile.target_roles) newErrors.target_roles = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validate()) {
            alert("Please fill all required fields highlighted in red.");
            return;
        }

        setIsSaving(true);
        try {
            // 1. Upload Resume if selected
            if (resumeFile) {
                const formData = new FormData();
                formData.append('resume', resumeFile);
                await fetch(`${API_BASE_URL}/api/user/resume/${user.id}`, {
                    method: 'POST',
                    body: formData
                });
            }

            // 2. Save Profile Data
            const normalizedSkills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
            const normalizedRoles = profile.target_roles.split(',').map(r => r.trim()).filter(r => r);

            // Build FormData
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                if (key === 'education' || key === 'experience' || key === 'skills' || key === 'target_roles') {
                    // Send as stringified JSON because backend expects objects/arrays but FormData sends strings
                    if (key === 'skills') formData.append(key, JSON.stringify(normalizedSkills));
                    else if (key === 'target_roles') formData.append(key, JSON.stringify(normalizedRoles));
                    else formData.append(key, JSON.stringify(profile[key]));
                } else if (key !== 'resume_path' && key !== 'resume_status' && key !== 'profile_photo_path') {
                    // resume_path etc are updated separately or read only
                    formData.append(key, profile[key]);
                }
            });

            if (photoFile) {
                formData.append('photo', photoFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/user/profile/${user.id}`, {
                method: 'PUT',
                body: formData // Content-Type header set automatically with boundary
            });

            if (response.ok) {
                // Determine if this was the first completion or an update
                const isFirstTime = user.profile_status !== 'COMPLETE';
                alert(isFirstTime ? "Profile Completed Successfully!" : "Profile Updated!");

                // Refresh global user context to update header image
                await fetchUser(user.id);

                // Switch to View Mode
                setIsEditing(false);
            }
        } catch (error) {
            alert("Error saving profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

    // ----------------------------------------------------
    // 👀 VIEW MODE (Read Only)
    // ----------------------------------------------------
    if (!isEditing) {
        return (
            <div className="bg-[#ebf2f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header Card */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-hidden relative group">
                        {/* Gradient Banner */}
                        <div className="h-32 bg-gradient-to-r from-[#031d31] to-[#054470]"></div>

                        <div className="px-8 pb-8 flex flex-col md:flex-row justify-between items-end -mt-12 relative z-10">
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <div className="w-full h-full bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                        {profile.profile_photo_path ?
                                            <img src={`${API_BASE_URL}${profile.profile_photo_path}`} className="w-full h-full object-cover" alt="Profile" /> :
                                            user.name.charAt(0).toUpperCase()
                                        }
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-4xl font-bold text-[#031d31]">{user.name}</h1>
                                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                        <MapPin size={16} className="text-blue-500" /> {profile.current_location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 md:mt-0">
                                <button onClick={() => navigate('/candidate-dashboard')} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                                    <Briefcase size={18} /> My Applications
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#031d31] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-900 transition-all hover:-translate-y-1">
                                    <Pencil size={18} /> Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex gap-4 mt-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle size={14} /> Profile 100% Complete
                            </span>
                            {profile.resume_path && profile.resume_status === 'APPROVED' ?
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <CheckCircle size={14} /> Resume Verified
                                </span> :
                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <AlertTriangle size={14} /> Resume Status: {profile.resume_status || 'Pending'}
                                </span>
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1: Personal & Skills */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-6 flex items-center gap-2"><Briefcase size={20} className="text-blue-600" /> Job Interests</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-2">Specialization</p>
                                        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 italic">
                                            {profile.interested_category || 'Not Specified'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-2">Target Role(s)</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(profile.target_roles || '').split(',').map((role, idx) => (
                                                role && <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200">{role.trim()}</span>
                                            ))}
                                            {!profile.target_roles && <span className="text-gray-400 text-sm">Not Specifed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-4 flex items-center gap-2"><User size={20} className="text-blue-600" /> Personal</h3>
                                <div className="space-y-4 text-sm">
                                    <div><p className="text-gray-400 text-xs uppercase font-bold">Email</p><p className="font-medium text-gray-800 break-all">{user.email}</p></div>
                                    <div><p className="text-gray-400 text-xs uppercase font-bold">Mobile</p><p className="font-medium text-gray-800">{user.mobile}</p></div>
                                    <div><p className="text-gray-400 text-xs uppercase font-bold">Date of Birth</p><p className="font-medium text-gray-800">{profile.dob}</p></div>
                                    <div><p className="text-gray-400 text-xs uppercase font-bold">Gender</p><p className="font-medium text-gray-800">{profile.gender}</p></div>
                                    {profile.linkedin_url && <div><p className="text-gray-400 text-xs uppercase font-bold">LinkedIn</p><a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">View Profile</a></div>}
                                    {profile.notice_period && <div><p className="text-gray-400 text-xs uppercase font-bold">Notice Period</p><p className="font-medium text-gray-800">{profile.notice_period}</p></div>}
                                    {profile.expected_salary && <div><p className="text-gray-400 text-xs uppercase font-bold">Expectations</p><p className="font-medium text-gray-800">{profile.expected_salary}</p></div>}
                                    {profile.driving_license && <div><p className="text-gray-400 text-xs uppercase font-bold">License</p><p className="font-medium text-gray-800">{profile.driving_license}</p></div>}
                                    {profile.own_vehicle && <div><p className="text-gray-400 text-xs uppercase font-bold">Vehicle</p><p className="font-medium text-gray-800">{profile.own_vehicle}</p></div>}
                                    {profile.shift_preference && <div><p className="text-gray-400 text-xs uppercase font-bold">Shift Pref</p><p className="font-medium text-gray-800">{profile.shift_preference}</p></div>}
                                    {profile.full_address && <div><p className="text-gray-400 text-xs uppercase font-bold">Address</p><p className="font-medium text-gray-800">{profile.full_address}</p></div>}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-4 flex items-center gap-2"><Code size={20} className="text-purple-600" /> Skills</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {profile.skills.split(',').map((skill, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">{skill.trim()}</span>
                                    ))}
                                </div>
                                {profile.languages && (
                                    <>
                                        <h3 className="text-lg font-bold text-[#031d31] mb-4 flex items-center gap-2"><Globe size={20} className="text-indigo-600" /> Languages</h3>
                                        <p className="text-gray-700 font-medium">{profile.languages}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Column 2 & 3: Experience, Education, Resume */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-6 flex items-center gap-2"><Briefcase size={20} className="text-orange-600" /> Professional Summary</h3>

                                {profile.bio && (
                                    <div className="mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <p className="text-gray-700 italic">"{profile.bio}"</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Education</p>
                                        <p className="text-lg font-bold text-[#031d31]">{profile.education.degree}</p>
                                        <p className="text-gray-600">{profile.education.college}</p>
                                        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                                            <span>Class of {profile.education.year}</span>
                                            {profile.education.percentage && <span className="font-bold text-gray-700">{profile.education.percentage}</span>}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Current Status</p>
                                        {profile.experience.isFresher === 'true' ? (
                                            <div>
                                                <p className="text-lg font-bold text-[#031d31] flex items-center gap-2">Fresher <span className="bg-green-200 text-green-800 text-[10px] px-2 py-0.5 rounded">ENTRY LEVEL</span></p>
                                                <p className="text-gray-600">Ready to start career</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-lg font-bold text-[#031d31]">{profile.experience.role}</p>
                                                <p className="text-gray-600 font-medium">{profile.experience.company}</p>
                                                <p className="text-xs text-gray-400 mt-1 mb-2">
                                                    {profile.experience.start_date} - {profile.experience.end_date || 'Present'} ({profile.experience.years} Yrs)
                                                </p>
                                                {profile.experience.description && (
                                                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-2 mt-2">
                                                        {profile.experience.description}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#031d31] mb-6 flex items-center gap-2"><FileText size={20} className="text-red-600" /> Resume Document</h3>

                                {profile.resume_path ? (
                                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#031d31]">My Resume.pdf</p>
                                                <p className="text-xs text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a href={`${API_BASE_URL}${profile.resume_path}`} target="_blank" rel="noreferrer" className="text-blue-700 font-bold text-sm hover:underline px-4">
                                            Download
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                                        <p className="text-gray-400">No Resume Uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // ✏️ EDIT MODE (Original Form with Validation)
    // ----------------------------------------------------
    return (
        <div className="bg-[#ebf2f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#031d31]">Edit Profile</h1>
                        <p className="text-gray-600">Update your information below.</p>
                    </div>
                    {user.profile_status === 'COMPLETE' && (
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-600 font-bold flex items-center gap-1">
                            <X size={20} /> Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* 1. Personal Details */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><User size={20} /> Personal Details</h2>

                        {/* Profile Photo Upload */}
                        <div className="mb-6 flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                {previewPhoto ?
                                    <img src={previewPhoto} className="w-full h-full object-cover" alt="preview" /> :
                                    (profile.profile_photo_path ?
                                        <img src={`${API_BASE_URL}${profile.profile_photo_path}`} className="w-full h-full object-cover" alt="current" /> :
                                        <User className="text-gray-400" size={32} />
                                    )
                                }
                            </div>
                            <div>
                                <label className="cursor-pointer bg-[#031d31] text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-900 transition-all shadow-md text-sm">
                                    Upload Photo
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Recommended: Square JPG/PNG</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 py-4 border-t border-gray-100 mt-4">
                                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Job Interests</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Interested Job Category <span className="text-red-500">*</span></label>
                                        <select
                                            value={profile.interested_category}
                                            onChange={e => setProfile({ ...profile, interested_category: e.target.value, target_roles: '' })}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none bg-white ${errors.interested_category ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                        >
                                            <option value="">Select Category</option>
                                            {Object.keys(BLUECOLLAR_MAP).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Target Job Role(s) <span className="text-red-500">*</span></label>
                                        {profile.interested_category ? (
                                            <select
                                                value={profile.target_roles}
                                                onChange={e => setProfile({ ...profile, target_roles: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border outline-none bg-white ${errors.target_roles ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                            >
                                                <option value="">Select Role</option>
                                                {BLUECOLLAR_MAP[profile.interested_category].map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                                <option value="Other">Other / General</option>
                                            </select>
                                        ) : (
                                            <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm">
                                                Select a category first
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input type="text" disabled value={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input type="text" disabled value={user.email} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                                <input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${errors.dob ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                                <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none bg-white ${errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Current Location <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input type="text" placeholder="City, State" value={profile.current_location} onChange={e => setProfile({ ...profile, current_location: e.target.value })}
                                        className={`w-full pl-10 px-4 py-3 rounded-xl border outline-none ${errors.current_location ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Driving License</label>
                                <select value={profile.driving_license} onChange={e => setProfile({ ...profile, driving_license: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                                    <option value="">None</option>
                                    <option value="2-Wheeler">2-Wheeler Only</option>
                                    <option value="LMV">Light Motor Vehicle (Car)</option>
                                    <option value="HMV">Heavy Motor Vehicle (Truck)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Own Vehicle</label>
                                <select value={profile.own_vehicle} onChange={e => setProfile({ ...profile, own_vehicle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                                    <option value="">No</option>
                                    <option value="Cycle">Bicycle</option>
                                    <option value="Bike">Motorbike / Scooter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Shift Preference</label>
                                <select value={profile.shift_preference} onChange={e => setProfile({ ...profile, shift_preference: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                                    <option value="Any">Any / Flexible</option>
                                    <option value="Day">Day Shift</option>
                                    <option value="Night">Night Shift</option>
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Residential Address</label>
                                <textarea rows="3" placeholder="Sector 1, Lane 2, City..." value={profile.full_address} onChange={e => setProfile({ ...profile, full_address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">About Me / Work Summary</label>
                                <textarea rows="3" placeholder="I am a hardworking person with experience in..." value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* 1.5 Job Preferences */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><Briefcase size={20} /> Job Preferences</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Location</label>
                                <input type="text" placeholder="e.g. Bangalore, Remote" value={profile.preferred_location} onChange={e => setProfile({ ...profile, preferred_location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Expected Salary</label>
                                <input type="text" placeholder="e.g. 8-12 LPA" value={profile.expected_salary} onChange={e => setProfile({ ...profile, expected_salary: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Notice Period</label>
                                <select value={profile.notice_period} onChange={e => setProfile({ ...profile, notice_period: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                    <option value="">Select</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="15 Days">15 Days</option>
                                    <option value="1 Month">1 Month</option>
                                    <option value="2 Months">2 Months</option>
                                    <option value="3 Months">3 Months</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Education */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><GraduationCap size={20} /> Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Highest Degree <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. B.Tech" value={profile.education.degree} onChange={e => setProfile({ ...profile, education: { ...profile.education, degree: e.target.value } })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none ${errors.degree ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">College <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="University Name" value={profile.education.college} onChange={e => setProfile({ ...profile, education: { ...profile.education, college: e.target.value } })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none ${errors.college ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Passing Year</label>
                                <input type="number" placeholder="202X" value={profile.education.year} onChange={e => setProfile({ ...profile, education: { ...profile.education, year: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Percentage / CGPA</label>
                                <input type="text" placeholder="e.g. 8.5" value={profile.education.percentage} onChange={e => setProfile({ ...profile, education: { ...profile.education, percentage: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Experience */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><Briefcase size={20} /> Experience</h2>
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="exp" checked={profile.experience.isFresher === 'true'} onChange={() => setProfile({ ...profile, experience: { ...profile.experience, isFresher: 'true' } })} />
                                <span className="font-medium text-gray-700">I am a Fresher</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="exp" checked={profile.experience.isFresher === 'false'} onChange={() => setProfile({ ...profile, experience: { ...profile.experience, isFresher: 'false' } })} />
                                <span className="font-medium text-gray-700">I am Experienced</span>
                            </label>
                        </div>
                        {profile.experience.isFresher === 'false' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Experience</label>
                                    <select value={profile.experience.years} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, years: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                        <option value="0">0-1 Years</option>
                                        <option value="2">2-5 Years</option>
                                        <option value="5">5+ Years</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Latest Role</label>
                                    <input type="text" placeholder="Designation" value={profile.experience.role} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, role: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                                </div>
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                        <input type="text" placeholder="Prev Company" value={profile.experience.company} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, company: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                                        <input type="date" value={profile.experience.start_date} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, start_date: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">End Date (or Present)</label>
                                        <input type="date" value={profile.experience.end_date} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, end_date: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities</label>
                                        <textarea rows="3" placeholder="Describe your achievements..." value={profile.experience.description} onChange={e => setProfile({ ...profile, experience: { ...profile.experience, description: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Skills & Languages */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><Code size={20} /> Skills & Languages <span className="text-red-500">*</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Key Skills</label>
                                <input type="text" placeholder="Java, React, SQL..." value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none ${errors.skills ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Languages Known</label>
                                <input type="text" placeholder="English, Tamil, Hindi..." value={profile.languages} onChange={e => setProfile({ ...profile, languages: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* 5. Resume */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-600"></div>
                        <h2 className="text-xl font-bold text-[#031d31] mb-6 flex items-center gap-2"><FileText size={20} /> Resume Upload</h2>

                        <label className="block text-sm font-bold text-gray-700 mb-2">Upload New Resume (PDF/DOC)</label>
                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all">
                            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <Upload className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500 font-medium">{resumeFile ? resumeFile.name : (user.resume_path ? "Resume already uploaded. Click to Replace." : "Click to select file")}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button disabled={isSaving} type="submit" className="flex-1 bg-[#031d31] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
                            {isSaving ? <Loader className="animate-spin" /> : <><Save size={20} /> Save & Complete Profile</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CandidateProfile;
