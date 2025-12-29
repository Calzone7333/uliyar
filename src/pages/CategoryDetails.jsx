import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Briefcase, ChevronRight } from 'lucide-react';
import { JOB_CATEGORIES } from '../constants/jobCategories';

// Map icons roughly or use a generic one if not perfectly matched
// We can import the same icons map or just use Briefcase for sub-items
import {
    Calculator, Headphones, TrendingUp, Settings, Truck, Utensils,
    HeartPulse, Shield, ShoppingBag, Factory, GraduationCap,
    Music, Scissors
} from 'lucide-react';

const categoryIcons = {
    "Accounts, Finance, Admin & HR": Calculator,
    "Customer Support & Call Center": Headphones,
    "Sales, Marketing & Field": TrendingUp,
    "Operations & Management": Settings,
    "Logistics, Warehouse, Driver & Delivery": Truck,
    "Kitchen, Restaurant & Hospitality": Utensils,
    "Healthcare, Clinic & Care Staff": HeartPulse,
    "Facility Management, Maintenance & Security": Shield,
    "Retail, Store & Showroom Staff": ShoppingBag,
    "Production / Factory / Workshop": Factory,
    "Education, Training & Institutional Support": GraduationCap,
    "Events, Community, Media Support (non-IT)": Music,
    "Beauty Parlour / Salon & Wellness": Scissors
};

const CategoryDetails = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const decodedCategory = decodeURIComponent(categoryId);
    const subCategories = JOB_CATEGORIES[decodedCategory];
    const Icon = categoryIcons[decodedCategory] || Briefcase;

    const [searchTerm, setSearchTerm] = useState("");

    // Redirect if invalid category
    useEffect(() => {
        if (!subCategories) {
            navigate('/categories');
        }
    }, [subCategories, navigate]);

    if (!subCategories) return null;

    const filteredSubCats = subCategories.filter(sub =>
        sub.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header / Hero */}
            <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/categories" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors font-medium">
                        <ArrowLeft size={20} className="mr-2" /> Back to Categories
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-primary shadow-2xl border border-white/10">
                            <Icon size={48} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{decodedCategory}</h1>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                Browse through <span className="text-white font-bold">{subCategories.length}</span> specialized roles available in this category.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">

                    {/* Search Bar */}
                    <div className="mb-10 max-w-2xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search for a specific role..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Subcategories Grid */}
                    {filteredSubCats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSubCats.map((sub, index) => (
                                <Link
                                    key={index}
                                    to={`/find-jobs?category=${encodeURIComponent(decodedCategory)}&subCategory=${encodeURIComponent(sub)}`}
                                    className="group flex items-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-md hover:bg-slate-50 transition-all duration-200"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0 mr-4">
                                        <Briefcase size={18} />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-slate-900 flex-1">{sub}</span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                <Search size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No roles found</h3>
                            <p className="text-slate-500">Try searching for something else</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;
