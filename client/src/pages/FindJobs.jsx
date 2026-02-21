import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronDown, ChevronUp, Filter, X, Grid, List, Check, RotateCcw, Folder, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JobCard from '../components/JobCard';
import { API_BASE_URL } from '../config';
import { JOB_CATEGORIES } from '../constants/jobCategories';

// --- HELPER COMPONENTS ---

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none">
                <span className="text-[13px] font-[600] text-slate-800">{title}</span>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {isOpen && <div className="p-4 pt-0">{children}</div>}
        </div>
    );
};

const Checkbox = ({ label, count, checked, onChange, type = "checkbox" }) => (
    <label
        className="flex items-center gap-3 cursor-pointer group py-1.5 select-none"
        onClick={(e) => {
            e.preventDefault();
            onChange();
        }}
    >
        {type === "checkbox" ? (
            <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-all ${checked ? 'border-primary bg-primary' : 'border-slate-300 bg-white group-hover:border-primary'}`}>
                {checked && <Check size={12} className="text-white stroke-[3]" />}
            </div>
        ) : (
            <div className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center transition-all ${checked ? 'border-primary' : 'border-slate-300 bg-white group-hover:border-primary'}`}>
                {checked && <div className="w-[8px] h-[8px] rounded-full bg-primary" />}
            </div>
        )}
        <span className={`text-[13px] transition-colors ${checked ? 'text-slate-700 font-[400]' : 'text-slate-600 hover:text-slate-800 group-hover:text-slate-800 font-[400]'}`}>
            {label}
        </span>
    </label>
);


// --- MAIN PAGE COMPONENT ---

const FindJobs = () => {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    // Category
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // Sidebar Filters
    const [jobTypes, setJobTypes] = useState([]);
    const [salaryMin, setSalaryMin] = useState("Min");
    const [salaryMax, setSalaryMax] = useState("Max");
    const [experienceLevel, setExperienceLevel] = useState([]);
    const [careerLevel, setCareerLevel] = useState([]);

    // Sort & View
    const [sortBy, setSortBy] = useState("Newest");
    const [viewMode, setViewMode] = useState('list');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 15;

    // UI Dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Data Fetching: Filter Counts (Mock or Real)
    useEffect(() => {
        // Mock fetch if needed
    }, []);

    // Helper: Category Options
    const categoryOptions = useMemo(() => ["All Categories", ...Object.keys(JOB_CATEGORIES)], []);

    // Data Fetching: Jobs
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when filters change
            fetchJobs();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, locationQuery, selectedCategory, jobTypes, experienceLevel, careerLevel, sortBy, salaryMin, salaryMax]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (locationQuery) params.append('location', locationQuery);
            if (selectedCategory && selectedCategory !== "All Categories") params.append('category', selectedCategory);
            if (jobTypes.length > 0) params.append('type', jobTypes.join(','));
            if (salaryMin !== "Min" && salaryMin > 0) params.append('minSalary', salaryMin);
            params.append('sortBy', sortBy);

            const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                let filtered = data;
                setJobs(filtered);
            } else {
                setJobs([]);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (setter, current, value) => {
        if (current.includes(value)) setter(current.filter(i => i !== value));
        else setter([...current, value]);
    };

    const clearAllFilters = () => {
        setJobTypes([]);
        setExperienceLevel([]);
        setCareerLevel([]);
        setSalaryMin("Min");
        setSalaryMax("Max");
        setSearchQuery("");
        setLocationQuery("");
        setSelectedCategory("All Categories");
        setSortBy("Newest");
    };

    return (
        <div className="min-h-screen bg-[#F4F5F7] font-sans text-slate-900 pb-20" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="max-w-[1240px] mx-auto p-4 md:p-6 pt-8 flex flex-col gap-6">

                {/* Title & Small Search Bar inline */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <h1 className="text-[18px] md:text-[20px] font-[600] text-[#1E293B]">
                        {searchQuery ? `${searchQuery} Jobs` : "All Jobs"} - {jobs.length || 600} Verified Vacancies
                    </h1>

                    <div className="flex items-center bg-white rounded-[6px] border border-slate-200 px-3 py-2 w-full md:w-80 shadow-sm relative focus-within:border-primary transition-colors">
                        <Search size={16} className="text-slate-400 absolute left-3" />
                        <input
                            type="text"
                            placeholder="Search jobs by title, company..."
                            className="w-full bg-transparent outline-none text-[13px] text-slate-700 font-[500] placeholder:text-slate-400 placeholder:font-[400] pl-6"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* --- MOBILE FILTER OVERLAY --- */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 bg-slate-900/50 z-[100] lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)}></div>
                    )}

                    {/* --- LEFT SIDEBAR --- */}
                    <aside className={`fixed inset-y-0 left-0 z-[110] lg:z-10 w-[260px] bg-white border border-slate-200 shadow-sm rounded-none md:rounded-[8px] transform transition-transform duration-300 overflow-y-auto lg:transform-none lg:translate-x-0 lg:static lg:p-0 lg:shadow-sm lg:overflow-visible lg:h-fit lg:shrink-0 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-between lg:hidden p-4 border-b border-slate-100">
                            <h3 className="font-[600] text-slate-800 text-[16px]">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 border-b border-slate-100 flex items-center justify-between hidden lg:flex">
                            <div className="flex items-center gap-2 text-[13px] font-[600] text-slate-800">
                                <Filter size={14} /> Filters (0)
                            </div>
                            <button onClick={clearAllFilters} className="text-[12px] text-primary font-[500] hover:underline cursor-pointer focus:outline-none">Clear all</button>
                        </div>

                        <FilterSection title="Category" defaultOpen={false}>
                            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                {categoryOptions.map((cat) => (
                                    <Checkbox
                                        key={cat}
                                        label={cat}
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                        type="radio"
                                    />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Subcategory" defaultOpen={false}>
                            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                {['Software Development', 'Web Design', 'Data Entry', 'HR Management', 'Sales & Marketing', 'Customer Support', 'Graphic Design', 'Finance', 'Engineering'].map((sub) => (
                                    <Checkbox key={sub} label={sub} checked={false} onChange={() => { }} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Date posted">
                            <div className="flex flex-col gap-1.5">
                                {['All', 'Last 24 hours', 'Last 3 days', 'Last 7 days'].map((label, idx) => (
                                    <Checkbox key={label} label={label} type="radio" checked={idx === 0} onChange={() => { }} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Salary">
                            <div className="text-[12px] text-slate-500 mb-2 font-[400]">Minimum monthly salary</div>
                            <div className="relative pt-2 pb-2 px-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="150000"
                                    step="5000"
                                    value={salaryMin === "Min" ? 0 : salaryMin}
                                    onChange={(e) => setSalaryMin(e.target.value)}
                                    className="w-full h-[4px] bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[11px] font-[600] text-slate-500">₹0</span>
                                    <span className="text-[12px] font-[700] text-[#064E3B] bg-[#064E3B]/10 px-2 py-0.5 rounded shadow-sm border border-[#064E3B]/20">
                                        ₹{salaryMin === "Min" ? "0" : Number(salaryMin).toLocaleString()}
                                    </span>
                                    <span className="text-[11px] font-[600] text-slate-500">₹1.5L+</span>
                                </div>
                            </div>
                        </FilterSection>

                        <FilterSection title="Work Mode" defaultOpen={false}>
                            <div className="flex flex-col gap-1.5">
                                {['Work from home', 'Work from office', 'Work from field'].map((label, idx) => (
                                    <Checkbox key={label} label={label} checked={false} onChange={() => { }} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Work Type">
                            <div className="flex flex-col gap-1.5">
                                {['Full time', 'Part time', 'Internship'].map((label) => (
                                    <Checkbox key={label} label={label} checked={jobTypes.includes(label)} onChange={() => handleCheckboxChange(setJobTypes, jobTypes, label)} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Sort By">
                            <div className="flex flex-col gap-1.5">
                                {['Relevant', 'Salary - High to low', 'Date posted - New to Old'].map((label, idx) => (
                                    <Checkbox key={label} label={label} type="radio" checked={idx === 0} onChange={() => { }} />
                                ))}
                            </div>
                        </FilterSection>
                    </aside>


                    {/* --- MIDDLE CONTENT --- */}
                    <main className="flex-1 w-full min-w-0 flex flex-col">
                        <div className="lg:hidden mb-4 flex justify-between items-center">
                            <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 text-[13px] font-[600] text-slate-700 bg-white px-3 py-1.5 rounded-[6px] border border-slate-200 shadow-sm">
                                <Filter size={14} /> Filters
                            </button>
                        </div>

                        {/* Job List */}
                        <div className="grid gap-3 grid-cols-1">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-[12px] h-[160px] p-4 border border-slate-200 animate-pulse flex flex-col justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded"></div>
                                            <div className="flex-1 space-y-2"><div className="h-4 bg-slate-100 w-1/2 rounded"></div><div className="h-3 bg-slate-100 w-1/4 rounded"></div></div>
                                        </div>
                                    </div>
                                ))
                            ) : jobs.length > 0 ? (
                                jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job, index) => (
                                    <JobCard key={job.id || job._id || index} job={job} index={index} viewMode={'list'} />
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-[12px] border border-slate-200 shadow-sm">
                                    <Search size={40} className="text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-[16px] font-[600] text-slate-900 mb-2">No jobs matched</h3>
                                    <button onClick={clearAllFilters} className="text-[13px] text-primary font-[500] hover:underline">Clear all filters</button>
                                </div>
                            )}
                        </div>

                        {/* Pagination Component */}
                        {jobs.length > 0 && Math.ceil(jobs.length / jobsPerPage) > 1 && (
                            <div className="mt-8 mb-4 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className={`w-8 h-8 flex items-center justify-center rounded-[6px] transition-colors ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-transparent' : 'text-slate-500 hover:bg-white bg-white border border-slate-200 shadow-sm'}`}
                                >
                                    <ChevronDown size={14} className="rotate-90" />
                                </button>

                                {[...Array(Math.ceil(jobs.length / jobsPerPage))].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-[600] transition-colors ${currentPage === i + 1 ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-white hover:shadow-sm'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / jobsPerPage)));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === Math.ceil(jobs.length / jobsPerPage)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-[6px] transition-colors ${currentPage === Math.ceil(jobs.length / jobsPerPage) ? 'text-slate-300 cursor-not-allowed bg-transparent' : 'text-slate-500 hover:bg-white bg-white border border-slate-200 shadow-sm'}`}
                                >
                                    <ChevronDown size={14} className="-rotate-90" />
                                </button>
                            </div>
                        )}
                    </main>

                    {/* --- RIGHT SIDEBAR BANNER --- */}
                    <aside className="hidden xl:block w-[300px] shrink-0 sticky top-24 self-start">
                        <div className="bg-[#F0FDF4] rounded-[16px] border border-[#DCFCE7] overflow-hidden relative shadow-sm h-fit">
                            <div className="p-5 pb-20">
                                <h3 className="text-[18px] font-[700] text-teal-900 mb-4 leading-snug tracking-tight">Get Hired Faster with<br />Uliyar Verified Network</h3>
                                <ul className="text-left text-[13px] text-teal-800 font-[500] space-y-3 mb-6 relative z-10">
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
                                        Verified Employers Only
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
                                        Direct WhatsApp Connect
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
                                        100% Free for Workers
                                    </li>
                                </ul>

                                {/* UI Mockup Image Placeholders (abstracted) */}
                                <div className="bg-white rounded-[12px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 w-full relative z-10 mx-auto h-[180px] overflow-hidden -mb-10">
                                    <div className="w-full flex justify-center mb-3"><div className="w-12 h-1 bg-slate-200 rounded-full" /></div>
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 w-3/4 bg-slate-200 rounded"></div>
                                            <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-[8px]"></div>
                                        <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-[8px]"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                <button className="w-full bg-primary hover:bg-teal-700 text-white font-[600] text-[14px] py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    Setup profile <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
