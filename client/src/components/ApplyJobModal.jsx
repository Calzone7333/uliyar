import React, { useState } from 'react';
import { X, Upload, Loader, User, Mail, Phone, FileText, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, MapPin, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ApplyJobModal = ({ job, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Steps configuration
    const steps = [
        { id: 1, title: 'Basic Details' },
        { id: 2, title: 'Experience' },
        { id: 3, title: 'Skills & Location' },
        { id: 4, title: 'Documents' },
    ];
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        // Basic Details
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        altMobile: '',
        dob: user?.dob || '',
        gender: user?.gender || '',

        // Job Info (Auto-filled)
        jobTitle: job.title,
        jobId: job.id || job._id,
        companyName: job.company,
        location: job.location,

        // Experience Details
        experienceType: 'Fresher', // Fresher | Experienced
        totalExperience: '',
        previousCompany: '',
        currentSalary: '',
        expectedSalary: '',

        // Skills
        skillType: '', // Electrician, Driver, Helper etc.
        licenseType: '', // LMV, HMV, None
        certification: '',

        // Location Preference
        currentLocation: user?.address || '',
        willingToRelocate: 'No',

        // Documents
        resume: null,
        aadhaar: null,
        drivingLicense: null,
        photo: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        switch (step) {
            case 1:
                if (!formData.name) newErrors.name = 'Full Name is required';
                if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
                if (!formData.dob) newErrors.dob = 'Date of Birth is required';
                if (!formData.gender) newErrors.gender = 'Gender is required';
                break;
            case 2:
                if (formData.experienceType === 'Experienced') {
                    if (!formData.totalExperience) newErrors.totalExperience = 'Experience (Years) is required';
                    if (!formData.previousCompany) newErrors.previousCompany = 'Previous Company is required';
                }
                break;
            case 3:
                if (!formData.skillType) newErrors.skillType = 'Skill Type is required';
                if (!formData.currentLocation) newErrors.currentLocation = 'Current Location is required';
                break;
            default:
                break;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            const data = new FormData();
            // Append all fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });
            if (user) data.append('applicantId', user.id || user._id);

            const response = await fetch(`${API_BASE_URL}/api/apply`, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                onClose();
                navigate('/candidate-dashboard');
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Details
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="Enter Full Name"
                                />
                                {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.mobile ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="10-digit Mobile Number"
                                />
                                {errors.mobile && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.mobile}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Alternate Number</label>
                                <input type="tel" name="altMobile" value={formData.altMobile} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary" placeholder="Optional" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.dob ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                />
                                {errors.dob && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.dob}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Gender <span className="text-red-500">*</span></label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.gender ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.gender}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Email (Optional)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary" placeholder="email@example.com" />
                            </div>
                        </div>

                        {/* Job Info Read-only */}
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-4">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Applying For</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-slate-500">Job:</span> <span className="font-bold text-slate-800">{formData.jobTitle}</span></div>
                                <div><span className="text-slate-500">ID:</span> <span className="font-bold text-slate-800">{formData.jobId}</span></div>
                                <div><span className="text-slate-500">Company:</span> <span className="font-bold text-slate-800">{formData.companyName}</span></div>
                                <div><span className="text-slate-500">Loc:</span> <span className="font-bold text-slate-800">{formData.location}</span></div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Experience
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">Are you a Fresher or Experienced? <span className="text-red-500">*</span></label>
                            <div className="flex gap-4">
                                {['Fresher', 'Experienced'].map(type => (
                                    <label key={type} className={`flex-1 p-3 border-2 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all ${formData.experienceType === type ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                                        <input type="radio" name="experienceType" value={type} checked={formData.experienceType === type} onChange={handleChange} className="hidden" />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {formData.experienceType === 'Experienced' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Previous Company Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="previousCompany"
                                        value={formData.previousCompany}
                                        onChange={handleChange}
                                        className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.previousCompany ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="e.g. ABC Constructions"
                                    />
                                    {errors.previousCompany && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.previousCompany}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Total Experience (Years) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="totalExperience"
                                        value={formData.totalExperience}
                                        onChange={handleChange}
                                        className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.totalExperience ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                        placeholder="e.g. 2.5"
                                    />
                                    {errors.totalExperience && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.totalExperience}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Current Salary (/month)</label>
                                    <input type="number" name="currentSalary" value={formData.currentSalary} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary" placeholder="e.g. 15000" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Expected Salary (/month)</label>
                            <input type="number" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary" placeholder="e.g. 20000" />
                        </div>
                    </div>
                );

            case 3: // Skills & Location
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Skill Type / Role <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="skillType"
                                value={formData.skillType}
                                onChange={handleChange}
                                className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.skillType ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                placeholder="e.g. Electrician, Driver, Helper"
                            />
                            {errors.skillType && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.skillType}</p>}
                        </div>

                        {formData.skillType.toLowerCase().includes('driver') && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">License Type</label>
                                <select name="licenseType" value={formData.licenseType} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary">
                                    <option value="">Select License</option>
                                    <option value="LMV">LMV (Light Motor Vehicle)</option>
                                    <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Certification (Optional)</label>
                            <input type="text" name="certification" value={formData.certification} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary" placeholder="e.g. ITI Compelted" />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Current Location <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="currentLocation"
                                value={formData.currentLocation}
                                onChange={handleChange}
                                className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary ${errors.currentLocation ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                placeholder="e.g. Chennai, Tamil Nadu"
                            />
                            {errors.currentLocation && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.currentLocation}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">Willing to Relocate?</label>
                            <div className="flex gap-4">
                                {['Yes', 'No'].map(opt => (
                                    <label key={opt} className={`flex-1 p-2.5 border rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${formData.willingToRelocate === opt ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                                        <input type="radio" name="willingToRelocate" value={opt} checked={formData.willingToRelocate === opt} onChange={handleChange} className="hidden" />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Documents
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {[
                            { label: 'Resume / CV', name: 'resume', optional: true, icon: FileText },
                            { label: 'Aadhaar Card', name: 'aadhaar', optional: true, icon: FileText },
                            { label: 'Driving License', name: 'drivingLicense', show: formData.skillType.toLowerCase().includes('driver'), icon: FileText },
                            { label: 'Profile Photo', name: 'photo', optional: true, icon: User }
                        ].map(doc => {
                            if (doc.show === false) return null;
                            return (
                                <div key={doc.name} className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">
                                        {doc.label} {doc.optional && <span className="text-slate-400 font-normal">(Optional)</span>}
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <doc.icon size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            {formData[doc.name] ? (
                                                <p className="text-xs font-bold text-primary truncate">{formData[doc.name].name}</p>
                                            ) : (
                                                <p className="text-xs text-slate-400">Click to upload {doc.label.toLowerCase()}</p>
                                            )}
                                        </div>
                                        <input type="file" name={doc.name} onChange={handleChange} className="hidden" accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" />
                                        <Upload size={16} className="text-slate-400" />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] max-h-[700px]">

                {/* Header with Steps */}
                <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Job Application</h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Step {currentStep} of {steps.length}: <span className="text-primary font-bold">{steps[currentStep - 1].title}</span></p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-100 w-full">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar bg-white">
                    <form id="apply-form" onSubmit={handleSubmit}>
                        {renderStepContent()}
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center gap-3">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                    ) : (
                        <div className="w-20"></div> // Spacer
                    )}

                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center gap-1 transition-all active:scale-95"
                        >
                            Next Step <ChevronRight size={14} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isSubmitting ? <Loader size={14} className="animate-spin" /> : <><CheckCircle2 size={16} /> Submit Application</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;
