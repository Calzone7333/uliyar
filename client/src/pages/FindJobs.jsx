import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, ChevronDown, Briefcase, Filter, X, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { API_BASE_URL } from '../config';
import { JOB_CATEGORIES } from '../constants/jobCategories';

// --- HELPER COMPONENTS ---

const FilterSection = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="py-5 border-b border-gray-100 last:border-0 border-dashed">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full mb-3 group outline-none"
            >
                <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-primary transition-colors">{title}</h3>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pt-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Checkbox = ({ label, count, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group py-1 select-none">
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-200 ${checked ? 'border-primary bg-primary' : 'border-slate-300 group-hover:border-primary bg-white'}`}>
                {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className={`text-[13px] font-semibold transition-colors ${checked ? 'text-primary' : 'text-slate-600 group-hover:text-slate-800'}`}>
                {label}
            </span>
        </div>
        {count !== undefined && <span className="text-[11px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full">{count}</span>}
    </label>
);

// Custom Dual Range Slider
const SalarySlider = ({ min, max, value, onChange }) => {
    const minVal = value[0];
    const maxVal = value[1];

    // Convert to percentage
    const getPercent = (v) => Math.round(((v - min) / (max - min)) * 100);

    return (
        <div className="px-2 pb-4 pt-2">
            <div className="flex justify-between items-center mb-4">
                <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">₹{minVal}k</div>
                <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">₹{maxVal}k</div>
            </div>
            <div className="relative h-1.5 bg-slate-100 rounded-full w-full">
                <div
                    className="absolute h-full bg-primary rounded-full alpha"
                    style={{ left: `${getPercent(minVal)}%`, width: `${getPercent(maxVal) - getPercent(minVal)}%` }}
                ></div>

                {/* Inputs stacked on top */}
                <input
                    type="range"
                    min={min} max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        onChange([value, maxVal]);
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto z-30"
                    style={{ zIndex: minVal > max - 100 && "50" }}
                />
                <input
                    type="range"
                    min={min} max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        onChange([minVal, value]);
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto z-40"
                />

                {/* Visual Thumbs */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-transform hover:scale-110"
                    style={{ left: `${getPercent(minVal)}%`, transform: 'translate(-50%, -50%)' }}
                ></div>
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-transform hover:scale-110"
                    style={{ left: `${getPercent(maxVal)}%`, transform: 'translate(-50%, -50%)' }}
                ></div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Core Search
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All Sub-categories");
    const [salaryRange, setSalaryRange] = useState([10, 200]); // in K
    const [jobTypes, setJobTypes] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState([]);
    const [sortBy, setSortBy] = useState("Newest");

    // Dynamic Counts State
    const [jobTypeCounts, setJobTypeCounts] = useState([]);
    const [expLevelCounts, setExpLevelCounts] = useState([]);

    // UI State for dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);

    const { openLogin } = useUI();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Reset sub-category when category changes
    useEffect(() => {
        if (selectedCategory === "All Categories") {
            setSelectedSubCategory("All Sub-categories");
        } else {
            setSelectedSubCategory("All Sub-categories");
        }
    }, [selectedCategory]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-dropdown')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Derived Lists
    const categoriesList = useMemo(() => ["All Categories", ...Object.keys(JOB_CATEGORIES)], []);
    const subCategoriesList = useMemo(() => {
        if (selectedCategory === "All Categories") return [];
        return ["All Sub-categories", ...(JOB_CATEGORIES[selectedCategory] || [])];
    }, [selectedCategory]);

    // Data Fetching: Filter Counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/jobs-filter-counts`);
                if (response.ok) {
                    const data = await response.json();
                    setJobTypeCounts(data.jobTypes || []);
                    setExpLevelCounts(data.experienceLevels || []);
                }
            } catch (error) {
                console.error("Error fetching filter counts:", error);
            }
        };
        fetchCounts();
    }, []); // Run once on mount

    // Data Fetching: Jobs
    useEffect(() => {
        const timer = setTimeout(() => fetchJobs(), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, location, selectedCategory, selectedSubCategory, salaryRange, jobTypes, experienceLevel, sortBy]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (location) params.append('location', location);

            if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
            if (selectedSubCategory !== 'All Sub-categories') params.append('subCategory', selectedSubCategory);

            if (jobTypes.length > 0) params.append('type', jobTypes.join(','));

            // Salary Logic
            params.append('minSalary', salaryRange[0] * 1000);
            params.append('maxSalary', salaryRange[1] * 1000);

            // Sort
            params.append('sortBy', sortBy);

            const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                let filtered = data;
                if (experienceLevel.length > 0) {
                    filtered = filtered.filter(job => {
                        const level = (job.level || job.experience || "").toLowerCase();
                        return experienceLevel.some(exp => level.includes(exp.toLowerCase()));
                    });
                }
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
        setSelectedCategory("All Categories");
        setSelectedSubCategory("All Sub-categories");
        setSalaryRange([10, 200]);
        setSearchQuery("");
        setLocation("");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900">

            {/* STICKY TOP SEARCH BAR */}
            <div className="sticky top-0 z-50 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 py-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-center">

                        {/* Search Inputs Container */}
                        <div className="w-full bg-white border border-gray-200 rounded-[12px] flex flex-col lg:flex-row items-center p-2 transition-all divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                            {/* Keyword */}
                            <div className="flex-1 w-full lg:w-auto flex items-center px-4 py-2 gap-3 group">
                                <Search className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                                <div className="flex flex-col w-full">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">What</label>
                                    <input
                                        type="text"
                                        placeholder="Job title, keywords..."
                                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-gray-300"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex-1 w-full lg:w-auto flex items-center px-4 py-2 gap-3 group">
                                <MapPin className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                                <div className="flex flex-col w-full">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Where</label>
                                    <input
                                        type="text"
                                        placeholder="City or Country"
                                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-gray-300"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category Dropdown */}
                            <div className="flex-1 w-full lg:w-auto flex items-center px-4 py-2 gap-3 relative search-dropdown group">
                                <Briefcase className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                                <div className="flex flex-col w-full relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category</label>
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                        className="flex items-center justify-between w-full text-left outline-none"
                                    >
                                        <span className={`text-sm font-bold truncate pr-2 ${selectedCategory !== 'All Categories' ? 'text-primary' : 'text-slate-700'}`}>
                                            {selectedCategory}
                                        </span>
                                        <ChevronDown size={14} className={`text-gray-300 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeDropdown === 'category' && (
                                        <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200 custom-scrollbar">
                                            {categoriesList.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors ${selectedCategory === cat ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sub-Category Dropdown */}
                            <div className={`flex-1 w-full lg:w-auto flex items-center px-4 py-2 gap-3 relative search-dropdown group ${selectedCategory === 'All Categories' ? 'opacity-50 pointer-events-none' : ''}`}>
                                <Layers className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                                <div className="flex flex-col w-full relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sub Category</label>
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === 'subcategory' ? null : 'subcategory')}
                                        disabled={selectedCategory === 'All Categories'}
                                        className="flex items-center justify-between w-full text-left outline-none"
                                    >
                                        <span className={`text-sm font-bold truncate pr-2 ${selectedSubCategory !== 'All Sub-categories' ? 'text-primary' : 'text-slate-700'}`}>
                                            {selectedSubCategory}
                                        </span>
                                        <ChevronDown size={14} className={`text-gray-300 transition-transform ${activeDropdown === 'subcategory' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeDropdown === 'subcategory' && (
                                        <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200 custom-scrollbar">
                                            {subCategoriesList.map(sub => (
                                                <button
                                                    key={sub}
                                                    onClick={() => { setSelectedSubCategory(sub); setActiveDropdown(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors ${selectedSubCategory === sub ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="p-1.5 w-full lg:w-auto">
                                <button
                                    onClick={fetchJobs}
                                    className="w-full lg:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-[16px] font-bold text-sm transition-all shadow-lg shadow-primary/25 flex justify-center items-center gap-2 transform active:scale-95 whitespace-nowrap"
                                >
                                    <Search size={18} />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <div className="max-w-[1400px] mx-auto px-6 py-8 flex items-start gap-8">

                {/* --- SIDEBAR FILTERS --- */}
                <aside className="hidden lg:block w-[280px] shrink-0 sticky top-32 max-h-[calc(100vh-140px)] overflow-y-auto px-1 pb-10 custom-scrollbar">

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-primary" />
                            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <X size={12} /> Clear all
                        </button>
                    </div>

                    {/* Salary Range */}
                    <FilterSection title="Salary Range (Monthly)" isOpen={true}>
                        <SalarySlider
                            min={0}
                            max={500}
                            value={salaryRange}
                            onChange={setSalaryRange}
                        />
                    </FilterSection>

                    {/* Job Type */}
                    <FilterSection title="Job Type" isOpen={true}>
                        {jobTypeCounts.length > 0 ? (
                            jobTypeCounts.map(type => (
                                <Checkbox
                                    key={type.label}
                                    label={type.label}
                                    count={type.count}
                                    checked={jobTypes.includes(type.label)}
                                    onChange={() => handleCheckboxChange(setJobTypes, jobTypes, type.label)}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-slate-400">No jobs available</p>
                        )}
                    </FilterSection>

                    {/* Experience Level */}
                    <FilterSection title="Experience Level" isOpen={true}>
                        {expLevelCounts.length > 0 ? (
                            expLevelCounts.map(exp => (
                                <Checkbox
                                    key={exp.label}
                                    label={exp.label}
                                    count={exp.count}
                                    checked={experienceLevel.includes(exp.label)}
                                    onChange={() => handleCheckboxChange(setExperienceLevel, experienceLevel, exp.label)}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-slate-400">No jobs available</p>
                        )}
                    </FilterSection>

                </aside>


                {/* --- JOB LISTING --- */}
                <main className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {searchQuery ? `Results for "${searchQuery}"` : "Recommended Jobs"}
                            <span className="text-lg font-normal text-slate-500 ml-3">{jobs.length} Jobs found</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <span className="text-sm font-semibold text-slate-500">Sort by:</span>
                            <div className="relative search-dropdown">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-primary/50 transition-colors shadow-sm"
                                >
                                    {sortBy === 'Newest' && 'Newest Post'}
                                    {sortBy === 'Oldest' && 'Oldest Post'}
                                    {sortBy === 'SalaryHigh' && 'Salary: High to Low'}
                                    {sortBy === 'SalaryLow' && 'Salary: Low to High'}
                                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'sort' && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                                        {[
                                            { label: 'Newest Post', value: 'Newest' },
                                            { label: 'Oldest Post', value: 'Oldest' },
                                            { label: 'Salary: High to Low', value: 'SalaryHigh' },
                                            { label: 'Salary: Low to High', value: 'SalaryLow' },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => { setSortBy(option.value); setActiveDropdown(null); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors ${sortBy === option.value ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-[24px] h-[320px] p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4">
                                    <div className="flex justify-between">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="w-3/4 h-6 bg-slate-100 rounded-lg"></div>
                                    <div className="w-1/2 h-4 bg-slate-100 rounded-lg"></div>
                                    <div className="flex gap-2 mt-auto">
                                        <div className="flex-1 h-10 bg-slate-100 rounded-xl"></div>
                                        <div className="flex-1 h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                </div>
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <JobCard key={job.id || job._id || index} job={job} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
                                <div className="inline-flex bg-slate-50 p-6 rounded-full mb-6">
                                    <Briefcase size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found matching filters</h3>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                    Try adjusting your search keywords, location, or remove some filters to see more results.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-8 py-3 bg-white border-2 border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-bold rounded-full transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FindJobs;
