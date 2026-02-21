import React from 'react';
import { Link } from 'react-router-dom';
import {
    Calculator, Headphones, TrendingUp, Settings, Truck, Utensils,
    HeartPulse, Shield, ShoppingBag, Factory, GraduationCap,
    Music, Scissors, ArrowRight, Briefcase
} from 'lucide-react';
import { JOB_CATEGORIES } from '../constants/jobCategories';
import { useTranslation } from 'react-i18next';

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

const Categories = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-5 pointer-events-none select-none">
                        <span className="text-[120px] md:text-[200px] font-black text-slate-900 tracking-tighter leading-none">{t("SECTORS")}</span>
                    </div>

                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 inline-block">{t("Explore Opportunities")}</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 relative z-10">
                        {t("Job Categories")}
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
                        Discover tailored opportunities across various industries. Find the perfect role that matches your skills.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(JOB_CATEGORIES).map((category, index) => {
                        const Icon = categoryIcons[category] || Briefcase;
                        const subCats = JOB_CATEGORIES[category].slice(0, 3).join(", ") + "...";

                        return (
                            <Link
                                key={index}
                                to={`/category/${encodeURIComponent(category)}`}
                                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden"
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-md">
                                            <Icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {category}
                                    </h3>

                                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                        {subCats}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-50 group-hover:border-primary/10 transition-colors">
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-2">
                                            Explore Roles
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Categories;
