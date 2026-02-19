import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronDown, Filter, X, Grid, List, Check, RotateCcw } from 'lucide-react';
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
        <div className="py-6 border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full mb-4 group outline-none"
            >
                <h3 className="font-bold text-slate-900 text-[15px] group-hover:text-[#0D9488] transition-colors">{title}</h3>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Checkbox = ({ label, count, checked, onChange }) => (
    <label
        className="flex items-center justify-between cursor-pointer group py-1 select-none"
        onClick={(e) => {
            e.preventDefault();
            onChange();
        }}
    >
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-200 ${checked ? 'border-[#0D9488] bg-[#0D9488]' : 'border-slate-300 group-hover:border-[#0D9488] bg-white'}`}>
                {checked && <Check size={12} className="text-white stroke-[3]" />}
            </div>
            <span className={`text-[13px] font-medium transition-colors ${checked ? 'text-slate-900 font-semibold' : 'text-slate-500 group-hover:text-slate-900'}`}>
                {label}
            </span>
        </div>
        {count !== undefined && <span className="text-[11px] text-slate-400 font-medium">{count}</span>}
    </label>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-5 border-b border-gray-100">
        <span className="font-bold text-slate-900 text-[15px]">{label}</span>
        <button
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-[#0D9488]' : 'bg-slate-200'}`}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`}></div>
        </button>
    </div>
);

// Custom Dual Range Slider with Histogram
const SalarySlider = ({ min, max, value, onChange }) => {
    const minVal = value[0];
    const maxVal = value[1];
    const getPercent = (v) => Math.round(((v - min) / (max - min)) * 100);

    return (
        <div className="px-1 pb-4 pt-4">
            {/* Histogram approximation */}
            <div className="flex items-end gap-1 h-12 mb-2 px-2 opacity-50">
                {[4, 7, 5, 9, 12, 8, 6, 10, 14, 9, 5, 3].map((h, i) => (
                    <div key={i} className="flex-1 bg-teal-200 rounded-t-sm" style={{ height: `${h * 8}%` }}></div>
                ))}
            </div>

            <div className="relative h-1.5 bg-slate-100 rounded-full w-full">
                <div
                    className="absolute h-full bg-[#0D9488] rounded-full alpha"
                    style={{ left: `${getPercent(minVal)}%`, width: `${getPercent(maxVal) - getPercent(minVal)}%` }}
                ></div>
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
                {/* Thumbs with teal outline circle and white fill like reference/material design somewhat */}
                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#0D9488] rounded-full shadow-md pointer-events-none transition-transform hover:scale-110 flex items-center justify-center cursor-grab" style={{ left: `${getPercent(minVal)}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#0D9488] rounded-full shadow-md pointer-events-none transition-transform hover:scale-110 flex items-center justify-center cursor-grab" style={{ left: `${getPercent(maxVal)}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="flex justify-between mt-4 font-bold text-slate-600 text-sm">
                <span>₹{minVal}k</span>
                <span>₹{maxVal}k</span>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");

    // Category & Sub-Category
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All Sub-categories");

    // Sidebar Filters
    const [jobTypes, setJobTypes] = useState([]);
    const [openToRemote, setOpenToRemote] = useState(true);
    const [salaryRange, setSalaryRange] = useState([10, 200]); // in K INR
    const [salaryPreset, setSalaryPreset] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState([]);

    // Sort & View
    const [sortBy, setSortBy] = useState("Relevancy");
    const [viewMode, setViewMode] = useState('grid');

    // Dynamic Counts State
    const [jobTypeCounts, setJobTypeCounts] = useState([]);
    const [expLevelCounts, setExpLevelCounts] = useState([]);

    // UI Dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);

    const { openLogin } = useUI();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Data Fetching: Filter Counts (Mock or Real)
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
    }, []);

    // Helper: Category Options
    const categoryOptions = useMemo(() => ["All Categories", ...Object.keys(JOB_CATEGORIES)], []);
    const subCategoryOptions = useMemo(() => {
        if (!selectedCategory || selectedCategory === "All Categories") return ["All Sub-categories"];
        return ["All Sub-categories", ...(JOB_CATEGORIES[selectedCategory] || [])];
    }, [selectedCategory]);

    // Update Sub-category whenever Category changes
    useEffect(() => {
        setSelectedSubCategory("All Sub-categories");
    }, [selectedCategory]);

    // Data Fetching: Jobs
    useEffect(() => {
        const timer = setTimeout(() => fetchJobs(), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, selectedSubCategory, jobTypes, experienceLevel, sortBy, salaryRange, salaryPreset, openToRemote]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);

            if (selectedCategory && selectedCategory !== "All Categories") params.append('category', selectedCategory);
            if (selectedSubCategory && selectedSubCategory !== "All Sub-categories") params.append('subCategory', selectedSubCategory);

            if (jobTypes.length > 0) params.append('type', jobTypes.join(','));
            if (openToRemote) params.append('remote', 'true');

            // Salary Logic - Assuming standard 'k' values for INR range 
            // 10k to 200k INR
            params.append('minSalary', salaryRange[0] * 1000);
            params.append('maxSalary', salaryRange[1] * 1000);

            params.append('sortBy', sortBy);

            const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                let filtered = data;
                // Client-side filtering for Experience
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
        setSalaryRange([10, 200]);
        setSalaryPreset([]);
        setOpenToRemote(false);
        setSearchQuery("");
        setSelectedCategory("All Categories");
        setSelectedSubCategory("All Sub-categories");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

            <div className="max-w-[1600px] mx-auto p-6 md:p-8 flex gap-8">

                {/* --- LEFT SIDEBAR --- */}
                <aside className="w-[280px] flex-shrink-0 bg-white rounded-[16px] p-6 h-fit sticky top-24 hidden lg:block shadow-sm boorder border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Filter</h2>
                        <button onClick={clearAllFilters} className="text-sm font-bold text-[#0D9488] hover:text-[#0D9488]/80">
                            Clear All
                        </button>
                    </div>

                    {/* Job Type */}
                    <FilterSection title="Job Type" isOpen={true}>
                        {['Contract', 'Full-Time', 'Part-Time', 'Internship'].map(label => (
                            <Checkbox
                                key={label}
                                label={label}
                                checked={jobTypes.includes(label)}
                                onChange={() => handleCheckboxChange(setJobTypes, jobTypes, label)}
                            />
                        ))}
                    </FilterSection>

                    {/* Remote Toggle */}
                    <ToggleSwitch
                        label="Open to remote"
                        checked={openToRemote}
                        onChange={setOpenToRemote}
                    />

                    {/* Range Salary (INR) */}
                    <FilterSection title="Range Salary" isOpen={true}>
                        {['Less than ₹10k', '₹10k - ₹50k', 'More than ₹50k'].map(label => (
                            <Checkbox
                                key={label}
                                label={label}
                                checked={salaryPreset.includes(label)}
                                onChange={() => handleCheckboxChange(setSalaryPreset, salaryPreset, label)}
                            />
                        ))}
                        <Checkbox
                            label="Custom"
                            checked={true}
                            onChange={() => { }}
                        />
                        <SalarySlider
                            min={10}
                            max={200}
                            value={salaryRange}
                            onChange={setSalaryRange}
                        />
                    </FilterSection>

                    {/* Experience */}
                    <FilterSection title="Experience" isOpen={true}>
                        {['Less than a year', '1-3 years', '3-5 years', '5-10 years'].map(label => (
                            <Checkbox
                                key={label}
                                label={label}
                                checked={experienceLevel.includes(label)}
                                onChange={() => handleCheckboxChange(setExperienceLevel, experienceLevel, label)}
                            />
                        ))}
                    </FilterSection>

                </aside>


                {/* --- RIGHT CONTENT --- */}
                <main className="flex-1 w-full min-w-0">

                    {/* Top Search Bar with Category & Sub-category */}
                    <div className="bg-white p-2 rounded-[16px] shadow-sm mb-8 flex flex-col xl:flex-row items-center gap-0 border border-slate-100 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                        {/* Keyword Input */}
                        <div className="flex-[1.2] flex items-center px-4 py-3 gap-3 w-full">
                            <Search className="text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative flex-1 w-full">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors h-full"
                            >
                                <div className="flex flex-col items-start truncate">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                                    <span className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{selectedCategory}</span>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'category' && (
                                <div className="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                                    {categoryOptions.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                                            className={`block w-full text-left px-5 py-3 text-sm font-medium hover:bg-[#F0FDFA] hover:text-[#0D9488] transition-colors border-b border-gray-50 last:border-0 ${selectedCategory === cat ? 'bg-[#F0FDFA] text-[#0D9488]' : 'text-slate-600'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sub-Category Dropdown */}
                        <div className="relative flex-1 w-full">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'subcategory' ? null : 'subcategory')}
                                className={`w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors h-full ${selectedCategory === "All Categories" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={selectedCategory === "All Categories"}
                            >
                                <div className="flex flex-col items-start truncate">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sub-Category</span>
                                    <span className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{selectedSubCategory}</span>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeDropdown === 'subcategory' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'subcategory' && subCategoryOptions.length > 0 && (
                                <div className="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                                    {subCategoryOptions.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => { setSelectedSubCategory(sub); setActiveDropdown(null); }}
                                            className={`block w-full text-left px-5 py-3 text-sm font-medium hover:bg-[#F0FDFA] hover:text-[#0D9488] transition-colors border-b border-gray-50 last:border-0 ${selectedSubCategory === sub ? 'bg-[#F0FDFA] text-[#0D9488]' : 'text-slate-600'}`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Search Button */}
                        <div className="p-2 w-full xl:w-auto">
                            <button
                                onClick={fetchJobs}
                                className="w-full xl:w-auto bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-bold px-8 py-3 rounded-[12px] transition-all shadow-lg shadow-teal-200"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-[15px] font-medium text-slate-500">
                            Showing <span className="text-slate-900 font-bold">{jobs.length}</span> Jobs <span className="text-slate-900 font-bold">{searchQuery ? searchQuery : ""}</span> in <span className="text-slate-900 font-bold">{selectedCategory !== "All Categories" ? selectedCategory : "All Categories"}</span>
                        </h2>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-2 text-slate-500 font-medium text-[14px]">
                                <span>Sort by</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                                        className="flex items-center gap-1.5 text-slate-900 font-bold hover:text-[#0D9488] transition-colors"
                                    >
                                        {sortBy} <ChevronDown size={14} />
                                    </button>
                                    {activeDropdown === 'sort' && (
                                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                                            {['Relevancy', 'Newest', 'Oldest', 'Salary High', 'Salary Low'].map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => { setSortBy(opt); setActiveDropdown(null); }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0D9488] font-medium"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job Grid */}
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-[24px] h-[350px] p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                        <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="w-3/4 h-6 bg-slate-100 rounded-md"></div>
                                        <div className="w-1/2 h-4 bg-slate-100 rounded-md"></div>
                                    </div>
                                    <div className="w-1/3 h-5 bg-slate-100 rounded-md mb-6"></div>
                                    <div className="flex gap-2 mb-6">
                                        <div className="w-16 h-6 bg-slate-100 rounded-md"></div>
                                        <div className="w-16 h-6 bg-slate-100 rounded-md"></div>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                                        <div className="w-20 h-6 bg-slate-100 rounded-md"></div>
                                        <div className="w-24 h-9 bg-slate-100 rounded-xl"></div>
                                    </div>
                                </div>
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <div key={job.id || job._id || index} className={viewMode === 'list' ? "w-full" : ""}>
                                    <JobCard job={job} index={index} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[24px] border border-slate-200 border-dashed">
                                <div className="inline-flex bg-slate-50 p-6 rounded-full mb-6">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found matching filters</h3>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                    Try adjusting your filters or search keywords to find what you are looking for.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-8 py-3 bg-[#F0FDFA] text-[#0D9488] font-bold rounded-xl hover:bg-teal-100 transition-all border border-[#0D9488]/20"
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
