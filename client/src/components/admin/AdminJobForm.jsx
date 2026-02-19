import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, IndianRupee, AlignLeft, Layers, Loader, PlusCircle, FileText, Phone, Mail, Calendar, Image, Edit3, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { JOB_CATEGORIES } from '../../constants/jobCategories';

const AdminJobForm = ({ onPost, isPosting, initialData, onCancel }) => {
    const [jobData, setJobData] = useState({
        title: '',
        companyName: '',
        category: '',
        subCategory: '',
        customCategory: '',
        customSubCategory: '',
        location: '',
        salary: '',
        description: '',
        requirements: '',
        jobType: 'Full Time',
        contactPhone: '',
        contactEmail: '',
        socialMediaDate: '',
        jobAnnouncedDate: '',
        socialMediaImage: null,
        newspaperImage: null
    });

    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [isOtherSubCategory, setIsOtherSubCategory] = useState(false);

    // Populate form on Edit
    React.useEffect(() => {
        if (initialData) {
            const isCustomCategory = !Object.keys(JOB_CATEGORIES).includes(initialData.category);
            const isCustomSubCategory = !((JOB_CATEGORIES[initialData.category] || []).includes(initialData.subCategory));

            setJobData({
                title: initialData.title || '',
                companyName: initialData.company || '',
                category: isCustomCategory ? '' : (initialData.category || ''),
                subCategory: isCustomSubCategory ? '' : (initialData.subCategory || ''),
                customCategory: isCustomCategory ? (initialData.category || '') : '',
                customSubCategory: isCustomSubCategory ? (initialData.subCategory || '') : '',
                location: initialData.location || '',
                salary: initialData.salary || '',
                description: initialData.description || '',
                requirements: initialData.requirements || '',
                jobType: initialData.type || 'Full Time',
                contactPhone: initialData.contactPhone || '',
                contactEmail: initialData.contactEmail || '',
                socialMediaDate: initialData.socialMediaDate || '',
                jobAnnouncedDate: initialData.jobAnnouncedDate || '',
                socialMediaImage: null,
                newspaperImage: null
            });

            setIsOtherCategory(isCustomCategory);
            setIsOtherSubCategory(isCustomSubCategory);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare final dataz
        const finalData = { ...jobData };
        if (isOtherCategory) {
            finalData.category = jobData.customCategory;
        }
        if (isOtherSubCategory) {
            finalData.subCategory = jobData.customSubCategory;
        }

        onPost(finalData, () => {
            // Reset form on success
            setJobData({
                title: '',
                companyName: '',
                category: '',
                subCategory: '',
                customCategory: '',
                customSubCategory: '',
                location: '',
                salary: '',
                description: '',
                requirements: '',
                jobType: 'Full Time',
                contactPhone: '',
                contactEmail: '',
                socialMediaDate: '',
                jobAnnouncedDate: '',
                socialMediaImage: null,
                newspaperImage: null
            });
            setIsOtherCategory(false);
            setIsOtherSubCategory(false);
        });
    };

    const categories = Object.keys(JOB_CATEGORIES);
    const subCategories = jobData.category ? (JOB_CATEGORIES[jobData.category] || []) : [];
    const isEditing = !!initialData;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
                            {isEditing ? <Edit3 size={20} /> : <PlusCircle size={20} />}
                        </div>
                        {isEditing ? 'Edit Job' : 'Post New Job'}
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium ml-[3rem]">
                        {isEditing ? 'Update job details below.' : 'Enter job details to publish instantly.'}
                    </p>
                </div>
                {isEditing && (
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 underline text-sm">
                        Cancel Edit
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                                    <Briefcase size={12} /> Job Information
                                </h3>
                                <div className="space-y-4">
                                    <InputGroup
                                        label="Job Title"
                                        icon={Briefcase}
                                        value={jobData.title}
                                        onChange={v => setJobData({ ...jobData, title: v })}
                                        placeholder="e.g. Senior Electrician"
                                        required={true}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup
                                            label="Company"
                                            icon={Building2}
                                            value={jobData.companyName}
                                            onChange={v => setJobData({ ...jobData, companyName: v })}
                                            placeholder="Company Name"
                                        />
                                        <InputGroup
                                            label="Location"
                                            icon={MapPin}
                                            value={jobData.location}
                                            onChange={v => setJobData({ ...jobData, location: v })}
                                            placeholder="City, Area"
                                            required={true}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                                    <AlignLeft size={12} /> Description
                                </h3>
                                <div>
                                    <textarea
                                        required
                                        rows="5"
                                        placeholder="Role responsibilities & requirements..."
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-sm text-slate-700 bg-slate-50 focus:bg-white leading-relaxed"
                                        value={jobData.description}
                                        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                                    <FileText size={12} /> Admin & Internal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <InputGroup
                                        label="Contact Phone"
                                        icon={Phone}
                                        type="tel"
                                        value={jobData.contactPhone || ''}
                                        onChange={v => setJobData({ ...jobData, contactPhone: v })}
                                        placeholder="+91 98765 43210"
                                    />
                                    <InputGroup
                                        label="Contact Email"
                                        icon={Mail}
                                        type="email"
                                        value={jobData.contactEmail || ''}
                                        onChange={v => setJobData({ ...jobData, contactEmail: v })}
                                        placeholder="hr@example.com"
                                    />

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <InputGroup
                                            label="Social Post Date (Optional)"
                                            icon={Calendar}
                                            type="date"
                                            value={jobData.socialMediaDate || ''}
                                            onChange={v => setJobData({ ...jobData, socialMediaDate: v })}
                                            required={false}
                                        />
                                        <InputGroup
                                            label="Job Announced Date"
                                            icon={Calendar}
                                            type="date"
                                            value={jobData.jobAnnouncedDate || ''}
                                            onChange={v => setJobData({ ...jobData, jobAnnouncedDate: v })}
                                            required={true}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                                        <FileGroup
                                            label="Social Media Image (Optional)"
                                            onChange={file => setJobData({ ...jobData, socialMediaImage: file })}
                                            accept="image/*"
                                            required={false}
                                            existingUrl={initialData?.socialMediaImage}
                                            selectedFile={jobData.socialMediaImage}
                                        />
                                        <FileGroup
                                            label="Newspaper Image"
                                            onChange={file => setJobData({ ...jobData, newspaperImage: file })}
                                            accept="image/*"
                                            required={true}
                                            existingUrl={initialData?.newspaperImage}
                                            selectedFile={jobData.newspaperImage}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 h-full">
                                <section className="mb-6">
                                    <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                                        <Layers size={12} /> Classify
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <SelectGroup
                                                label="Category"
                                                value={isOtherCategory ? 'Other' : jobData.category}
                                                onChange={v => {
                                                    if (v === 'Other') {
                                                        setIsOtherCategory(true);
                                                        setJobData({ ...jobData, category: '', subCategory: '', isOtherCategory: true });
                                                    } else {
                                                        setIsOtherCategory(false);
                                                        setJobData({ ...jobData, category: v, subCategory: '', isOtherCategory: false });
                                                    }
                                                }}
                                                options={[...categories, 'Other']}
                                                placeholder="Select"
                                                required={true}
                                            />
                                            {isOtherCategory && (
                                                <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                                                    <InputGroup
                                                        label="Enter Custom Category"
                                                        icon={Edit3}
                                                        value={jobData.customCategory}
                                                        onChange={v => setJobData({ ...jobData, customCategory: v })}
                                                        placeholder="Manual Entry"
                                                        required={true}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <SelectGroup
                                                label="Sub-Category"
                                                value={isOtherSubCategory ? 'Other' : jobData.subCategory}
                                                onChange={v => {
                                                    if (v === 'Other') {
                                                        setIsOtherSubCategory(true);
                                                        setJobData({ ...jobData, subCategory: '', isOtherSubCategory: true });
                                                    } else {
                                                        setIsOtherSubCategory(false);
                                                        setJobData({ ...jobData, subCategory: v, isOtherSubCategory: false });
                                                    }
                                                }}
                                                options={isOtherCategory ? ['Other'] : [...subCategories, 'Other']}
                                                disabled={!jobData.category && !isOtherCategory}
                                                placeholder="Select"
                                                required={true}
                                            />
                                            {isOtherSubCategory && (
                                                <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                                                    <InputGroup
                                                        label="Enter Custom Sub-Category"
                                                        icon={Edit3}
                                                        value={jobData.customSubCategory}
                                                        onChange={v => setJobData({ ...jobData, customSubCategory: v })}
                                                        placeholder="Manual Entry"
                                                        required={true}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <SelectGroup
                                            label="Type"
                                            value={jobData.jobType}
                                            onChange={v => setJobData({ ...jobData, jobType: v })}
                                            options={['Full Time', 'Part Time', 'Contract', 'Freelance']}
                                            placeholder={null}
                                            required={true}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                                        <IndianRupee size={12} /> Pay
                                    </h3>
                                    <InputGroup
                                        label="Salary"
                                        icon={IndianRupee}
                                        value={jobData.salary}
                                        onChange={v => setJobData({ ...jobData, salary: v })}
                                        placeholder="e.g. ₹20k"
                                    />
                                </section>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2.5 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
                            onClick={() => {
                                if (window.confirm('Discard changes?')) {
                                    setJobData({
                                        title: '', companyName: '', category: '', subCategory: '',
                                        customCategory: '', customSubCategory: '',
                                        location: '', salary: '', description: '', requirements: '', jobType: 'Full Time',
                                        contactPhone: '', contactEmail: '', socialMediaImage: null, newspaperImage: null,
                                        socialMediaDate: '', jobAnnouncedDate: ''
                                    });
                                    setIsOtherCategory(false);
                                    setIsOtherSubCategory(false);
                                }
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isPosting}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                        >
                            {isPosting ? <Loader className="animate-spin" size={16} /> : <><PlusCircle size={16} /> Publish Job</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FileGroup = ({ label, onChange, accept, required, existingUrl, selectedFile }) => {
    const [preview, setPreview] = React.useState(null);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const getExistingUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${encodeURI(path)}`;
    };

    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 flex items-center justify-between gap-1">
                <span>{label} {required && !existingUrl && <span className="text-red-500 text-lg leading-none">*</span>}</span>
                {existingUrl && (
                    <a href={getExistingUrl(existingUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-[10px] flex items-center gap-1 normal-case font-normal bg-blue-50 px-2 py-0.5 rounded-md">
                        View Current <ExternalLink size={10} />
                    </a>
                )}
            </label>
            <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => onChange(e.target.files[0])}
                    required={required && !existingUrl}
                    className={`w-full pl-10 pr-3 py-2 rounded-xl border ${existingUrl ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer`}
                />
            </div>
            {preview && (
                <div className="mt-2 relative w-full h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove Image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            )}
            {existingUrl && !preview && <p className="text-[10px] text-slate-400 mt-1 ml-1">Upload new file to replace existing image.</p>}
        </div>
    );
};

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text", required }) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
            {label} {required && <span className="text-red-500 text-lg leading-none">*</span>}
        </label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm text-slate-700 font-medium placeholder:font-normal"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

const SelectGroup = ({ label, value, onChange, options, disabled, placeholder, required }) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
            {label} {required && <span className="text-red-500 text-lg leading-none">*</span>}
        </label>
        <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
                required={required}
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white transition-all appearance-none cursor-pointer font-medium text-sm text-slate-700 ${disabled ? 'opacity-50 bg-slate-50 cursor-not-allowed' : ''}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 scale-75"></div>
        </div>
    </div>
);

export default AdminJobForm;
