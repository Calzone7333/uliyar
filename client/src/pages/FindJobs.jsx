import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Briefcase, ChevronDown, Filter, PlusCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { API_BASE_URL } from '../config';
import { JOB_CATEGORIES } from '../constants/jobCategories';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const { openLogin } = useUI();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All Sub-categories");
    const [jobType, setJobType] = useState("All Types");

    // DYNAMIC CATEGORIES: Merge predefined list with unique categories found in current jobs
    const mainCategories = useMemo(() => {
        const predefined = Object.keys(JOB_CATEGORIES);
        const dynamic = [...new Set(jobs.map(j => j.category).filter(c => c && !predefined.includes(c)))];
        return ["All Categories", ...predefined, ...dynamic];
    }, [jobs]);

    // DYNAMIC SUB-CATEGORIES: Merge predefined list for selected category with unique subcategories found in jobs
    const subCategories = useMemo(() => {
        if (selectedCategory === "All Categories") return [];
        const predefined = JOB_CATEGORIES[selectedCategory] || [];
        const dynamic = [...new Set(jobs
            .filter(j => j.category === selectedCategory)
            .map(j => j.subCategory)
            .filter(s => s && !predefined.includes(s))
        )];
        return ["All Sub-categories", ...predefined, ...dynamic];
    }, [selectedCategory, jobs]);

    useEffect(() => {
        if (selectedCategory === "All Categories") {
            setSelectedSubCategory("All Sub-categories");
        } else if (subCategories.length > 0 && !subCategories.includes(selectedSubCategory)) {
            setSelectedSubCategory("All Sub-categories");
        }
    }, [selectedCategory]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchJobs(), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, location, selectedCategory, selectedSubCategory, jobType]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (location) params.append('location', location);
            if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
            if (selectedSubCategory !== 'All Sub-categories') params.append('subCategory', selectedSubCategory);
            if (jobType !== 'All Types') params.append('type', jobType);

            const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="relative h-[600px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                        alt="Construction Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pb-20">
                    <div className="flex items-center justify-center gap-4 mb-8 animate-in slide-in-from-bottom-5 duration-700">
                        <div className="h-0.5 w-16 bg-primary/30"></div>
                        <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase">India's No.1 Platform</span>
                        <div className="h-0.5 w-16 bg-primary/30"></div>
                    </div>

                    <div className="inline-block mb-10 animate-in slide-in-from-bottom-5 duration-700 delay-100">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight uppercase drop-shadow-xl font-sans">
                            We Help You <span className="text-primary relative inline-block">
                                Find
                                <svg className="absolute w-full h-4 -bottom-2 left-0 text-primary opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span> <br />
                            The Perfect Job
                        </h1>
                    </div>
                </div>

                <div className="absolute -bottom-24 w-full px-4 z-20 animate-in slide-in-from-bottom-10 duration-700 delay-200">
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)] max-w-7xl mx-auto border border-slate-700 backdrop-blur-xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-2 relative group">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">What</label>
                                <div className="flex items-center bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent group-focus-within:border-primary hover:bg-slate-800 transition-all">
                                    <Search className="text-primary w-4 h-4 mr-3 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Job Title"
                                        className="bg-transparent w-full text-white placeholder-slate-500 focus:outline-none font-bold text-base h-6"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 relative group">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">Where</label>
                                <div className="flex items-center bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent group-focus-within:border-primary hover:bg-slate-800 transition-all">
                                    <MapPin className="text-primary w-4 h-4 mr-3 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="bg-transparent w-full text-white placeholder-slate-500 focus:outline-none font-bold text-base h-6"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 relative group dropdown-container">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">Category</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                                        className="relative flex items-center w-full bg-white rounded-xl px-4 py-3 border border-gray-200 hover:border-blue-200 transition-all text-left shadow-sm active:scale-[0.98]"
                                    >
                                        <span className={`font-semibold text-sm truncate pr-6 ${selectedCategory !== 'All Categories' ? 'text-blue-600' : 'text-slate-600'}`}>
                                            {selectedCategory}
                                        </span>
                                        <ChevronDown className={`absolute right-3 text-slate-400 transition-transform duration-300 ${openDropdown === 'category' ? 'rotate-180' : ''}`} size={16} />
                                    </button>

                                    {openDropdown === 'category' && (
                                        <div className="absolute top-full left-0 min-w-[300px] mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-[100] max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 py-1">
                                            {mainCategories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-5 py-3.5 text-[14px] font-semibold transition-all hover:bg-slate-50 ${selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 relative group dropdown-container">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">Sub Category</label>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            if (selectedCategory !== "All Categories") {
                                                setOpenDropdown(openDropdown === 'subcategory' ? null : 'subcategory');
                                            }
                                        }}
                                        disabled={selectedCategory === "All Categories"}
                                        className={`relative flex items-center w-full bg-white rounded-xl px-4 py-3 border border-gray-200 transition-all text-left shadow-sm ${selectedCategory === "All Categories" ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-200 active:scale-[0.98]'}`}
                                    >
                                        <span className={`font-semibold text-sm truncate pr-6 ${selectedSubCategory !== 'All Sub-categories' ? 'text-blue-600' : 'text-slate-600'}`}>
                                            {selectedCategory === "All Categories" ? 'Select Category first' : selectedSubCategory}
                                        </span>
                                        <ChevronDown className={`absolute right-3 text-slate-400 transition-transform duration-200 ${openDropdown === 'subcategory' ? 'rotate-180' : ''}`} size={16} />
                                    </button>

                                    {openDropdown === 'subcategory' && subCategories.length > 0 && (
                                        <div className="absolute top-full left-0 min-w-[300px] mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-[100] max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 py-1">
                                            {subCategories.map(sub => (
                                                <button
                                                    key={sub}
                                                    onClick={() => {
                                                        setSelectedSubCategory(sub);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-5 py-3.5 text-[14px] font-semibold transition-all hover:bg-slate-50 ${selectedSubCategory === sub ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    onClick={fetchJobs}
                                    className="w-full bg-primary hover:bg-teal-600 text-white font-black h-[58px] rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40 flex items-center justify-center border border-primary/20"
                                >
                                    <Search size={24} />
                                </button>
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            openLogin();
                                        } else if (user.role === 'admin') {
                                            navigate('/admin', { state: { activeTab: 'post_job' } });
                                        } else if (user.role === 'employer') {
                                            navigate('/employer-dashboard', { state: { openPostModal: true } });
                                        } else {
                                            alert("Workers cannot post jobs. Please register as an Employer.");
                                        }
                                    }}
                                    className="w-full bg-white hover:bg-teal-50 text-slate-900 font-bold h-[58px] rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg flex items-center justify-center border border-gray-200 group"
                                >
                                    <PlusCircle size={20} className="text-primary mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm lg:text-base">Post Job</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-gray-200 pb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Recommended Jobs</h2>
                        <p className="text-slate-500 font-medium">Based on available opportunities</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {["All Types", "Full Time", "Part Time", "Contract"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setJobType(type)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${jobType === type
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-slate-500 hover:border-gray-300 hover:text-slate-800'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm animate-pulse h-52 w-full">
                                <div className="h-5 bg-gray-100 rounded w-32 mb-6"></div>
                                <div className="h-8 bg-gray-100 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-8"></div>
                                <div className="flex gap-4">
                                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                                </div>
                            </div>
                        ))
                    ) : jobs.length > 0 ? (
                        jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))
                    ) : (
                        <div className="py-24 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm w-full">
                            <div className="inline-flex bg-slate-50 p-6 rounded-full mb-6">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs found</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Try different keywords or filters.</p>
                            <button onClick={() => { setSearchQuery(""); setLocation(""); setSelectedCategory("All Categories"); setSelectedSubCategory("All Sub-categories"); setJobType("All Types") }} className="text-primary font-bold hover:underline text-base">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
