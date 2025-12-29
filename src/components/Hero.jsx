import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    // Base sets of images
    // Base sets of images
    const set1 = [
        "/images/hero/construction_worker.png", // Indian Construction Worker
        "/images/hero/security_guard.png",      // Indian Security Guard
        "/images/hero/electrician.png",         // Indian Electrician
    ];
    const set2 = [
        "/images/hero/factory_worker.png",      // Indian Factory Worker
        "/images/hero/delivery_driver.png",     // Indian Delivery Driver
        "/images/hero/mechanic.png",            // Indian Mechanic
    ];
    const set3 = [
        "/images/hero/plumber.png",             // Indian Plumber
        "/images/hero/painter.png",             // Indian Painter
        "/images/hero/cleaner.png",             // Indian Cleaner
    ];

    // Duplicate sets to create seamless loop (A, B, C -> A, B, C, A, B, C)
    // When translating -50%, we move from the start of the first set to the start of the second set.
    const col1 = [...set1, ...set1, ...set1]; // Tripled for safety on large screens
    const col2 = [...set2, ...set2, ...set2];
    const col3 = [...set3, ...set3, ...set3];

    return (
        <div className="bg-secondary text-slate-900 overflow-hidden relative pt-4 pb-20 lg:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[600px]">

                {/* Left Content */}
                <div className="flex flex-col justify-center z-10 pt-0 lg:pt-0">
                    <div className="inline-flex self-start items-center px-5 py-2.5 bg-white rounded-full mb-8 border border-blue-100 shadow-sm">
                        <span className="text-primary font-bold text-sm tracking-wide uppercase">
                            #1 Trusted Blue-Collar Job Platform
                        </span>
                    </div>

                    <div className="space-y-4 mb-10">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                            Find Better Jobs
                        </h1>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-primary">
                            Hire Skilled Workers
                        </h1>
                    </div>

                    <div className="pl-6 border-l-4 border-primary max-w-xl">
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Upload your resume and connect with employers looking for
                            skilled trades. Post a job and hire the workers you need, fast.
                        </p>
                    </div>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link to="/login" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20">Join as Worker</Link>
                        <Link to="/login" className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 rounded-xl font-bold text-lg transition-all shadow-sm">Post a Job</Link>
                    </div>
                </div>

                {/* Right Content - 3 Column Grid with Animation */}
                <div className="grid grid-cols-3 gap-3 md:gap-5 h-[500px] lg:h-[800px] overflow-hidden relative mask-gradient-bottom mt-8 lg:mt-0">

                    {/* Column 1 - Scroll Up */}
                    <div className="space-y-5 animate-scroll-up">
                        {col1.map((src, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden h-[240px] bg-white border-4 border-white shadow-lg shadow-blue-500/10">
                                <img src={src} className="w-full h-full object-cover transition-opacity duration-300" alt="" />
                            </div>
                        ))}
                    </div>
                    {/* Column 2 - Scroll Down */}
                    <div className="space-y-5 animate-scroll-down -mt-20">
                        {col2.map((src, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden h-[240px] bg-white border-4 border-white shadow-lg shadow-blue-500/10">
                                <img src={src} className="w-full h-full object-cover transition-opacity duration-300" alt="" />
                            </div>
                        ))}
                    </div>

                    {/* Column 3 - Scroll Up */}
                    <div className="space-y-5 animate-scroll-up">
                        {col3.map((src, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden h-[240px] bg-white border-4 border-white shadow-lg shadow-blue-500/10">
                                <img src={src} className="w-full h-full object-cover transition-opacity duration-300" alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Hero;
