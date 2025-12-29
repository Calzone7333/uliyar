import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronDown, Filter, PlusCircle } from 'lucide-react';
import JobCard from '../components/JobCard';
import { API_BASE_URL } from '../config';
import { JOB_CATEGORIES } from '../constants/jobCategories';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");

    // Category States
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All Sub-categories");

    const [jobType, setJobType] = useState("All Types");

    // Derived lists
    const mainCategories = ["All Categories", ...Object.keys(JOB_CATEGORIES)];
    const subCategories = selectedCategory !== "All Categories" && JOB_CATEGORIES[selectedCategory]
        ? ["All Sub-categories", ...JOB_CATEGORIES[selectedCategory]]
        : [];

    useEffect(() => {
        // Reset sub-category when main category changes
        if (selectedCategory === "All Categories") {
            setSelectedSubCategory("All Sub-categories");
        } else if (subCategories.length > 0 && !subCategories.includes(selectedSubCategory)) {
            setSelectedSubCategory("All Sub-categories");
        }
    }, [selectedCategory]);

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
            {/* Hero Section */}
            <div className="relative h-[600px] flex flex-col items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                        alt="Construction Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
                    {/* Gradient Fade at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pb-20">
                    {/* Top Label */}
                    <div className="flex items-center justify-center gap-4 mb-8 animate-in slide-in-from-bottom-5 duration-700">
                        <div className="h-0.5 w-16 bg-primary/30"></div>
                        <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase">India's No.1 Platform</span>
                        <div className="h-0.5 w-16 bg-primary/30"></div>
                    </div>

                    {/* Main Heading */}
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

                {/* Search Bar - Floating deeply overlapping */}
                <div className="absolute -bottom-24 w-full px-4 z-20 animate-in slide-in-from-bottom-10 duration-700 delay-200">
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)] max-w-7xl mx-auto border border-slate-700 backdrop-blur-xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                            {/* Field 1: Keyword (2 cols) */}
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

                            {/* Field 2: Location (2 cols) */}
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

                            {/* Field 3: Category (2 cols) */}
                            <div className="md:col-span-2 relative group">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">Category</label>
                                <div className="relative flex items-center bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent group-focus-within:border-primary hover:bg-slate-800 transition-all">
                                    <Briefcase className="text-primary w-4 h-4 mr-3 shrink-0" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="appearance-none bg-transparent w-full text-white focus:outline-none font-bold text-base h-6 pr-6 cursor-pointer truncate"
                                    >
                                        {mainCategories.map(cat => (
                                            <option key={cat} value={cat} className="bg-slate-900 text-white py-2 font-medium truncate">{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 text-primary pointer-events-none w-4 h-4" />
                                </div>
                            </div>

                            {/* Field 4: Sub-Category (2 cols) */}
                            <div className="md:col-span-2 relative group">
                                <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 pl-1">Sub Category</label>
                                <div className={`relative flex items-center bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent ${selectedCategory === "All Categories" ? 'opacity-50 cursor-not-allowed' : 'group-focus-within:border-primary hover:bg-slate-800'} transition-all`}>
                                    <Filter className="text-primary w-4 h-4 mr-3 shrink-0" />
                                    <select
                                        value={selectedSubCategory}
                                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                                        disabled={selectedCategory === "All Categories"}
                                        className="appearance-none bg-transparent w-full text-white focus:outline-none font-bold text-base h-6 pr-6 cursor-pointer disabled:cursor-not-allowed truncate"
                                    >
                                        {subCategories.length > 0 ? (
                                            subCategories.map(sub => (
                                                <option key={sub} value={sub} className="bg-slate-900 text-white py-2 font-medium truncate">{sub}</option>
                                            ))
                                        ) : (
                                            <option className="bg-slate-900 text-slate-500">Select Category First</option>
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 text-primary pointer-events-none w-4 h-4" />
                                </div>
                            </div>

                            {/* Field 5: Search Button (2 cols) */}
                            <div className="md:col-span-2">
                                <button
                                    onClick={fetchJobs}
                                    className="w-full bg-primary hover:bg-teal-600 text-white font-black h-[58px] rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40 flex items-center justify-center border border-primary/20"
                                    title="Search Jobs"
                                >
                                    <Search size={24} />
                                </button>
                            </div>

                            {/* Field 6: Post Job Button (2 cols) */}
                            <div className="md:col-span-2">
                                <Link
                                    to="/login"
                                    className="w-full bg-white hover:bg-teal-50 text-slate-900 font-bold h-[58px] rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg flex items-center justify-center border border-gray-200 group"
                                    title="Post a Job"
                                >
                                    <PlusCircle size={20} className="text-primary mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm lg:text-base">Post Job</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-gray-200 pb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Recommended Jobs</h2>
                        <p className="text-slate-500 font-medium">Based on your recent search activity</p>
                    </div>

                    {/* Job Type Pills */}
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

                {/* Job List Stack */}
                <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any jobs matching your criteria. Try different keywords or locations.</p>
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
