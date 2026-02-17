import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, IndianRupee, AlignLeft, Layers, Loader, PlusCircle, FileText, Phone, Mail, Calendar, Image, Edit3 } from 'lucide-react';
import { JOB_CATEGORIES } from '../../constants/jobCategories';

const AdminJobForm = ({ onPost, isPosting }) => {
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

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
                            <PlusCircle size={20} />
                        </div>
                        Post New Job
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium ml-[3rem]">Enter job details to publish instantly.</p>
                </div>
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
                                            label="Social Post Date"
                                            icon={Calendar}
                                            type="date"
                                            value={jobData.socialMediaDate || ''}
                                            onChange={v => setJobData({ ...jobData, socialMediaDate: v })}
                                            required={true}
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
                                            label="Social Media Image"
                                            onChange={file => setJobData({ ...jobData, socialMediaImage: file })}
                                            accept="image/*"
                                            required={true}
                                        />
                                        <FileGroup
                                            label="Newspaper Image"
                                            onChange={file => setJobData({ ...jobData, newspaperImage: file })}
                                            accept="image/*"
                                            required={true}
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

const FileGroup = ({ label, onChange, accept, required }) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
            {label} {required && <span className="text-red-500 text-lg leading-none">*</span>}
        </label>
        <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
                type="file"
                accept={accept}
                onChange={(e) => onChange(e.target.files[0])}
                required={required}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-white"
            />
        </div>
    </div>
);

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
