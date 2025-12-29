import React from 'react';

const Benefits = () => {
    return (
        <div className="py-24 bg-slate-50 min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-3">Benefits</h2>
                    <h3 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">What you gain here</h3>
                    <p className="text-gray-600 text-lg">
                        For workers seeking steady employment and better opportunities
                    </p>
                </div>

                {/* Grid Layout - Asymmetrical (Restored Design) */}
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">

                    {/* Card 1 - For Workers (Spans 2 columns, Horizontal Layout) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group">
                        {/* Image Section - Left */}
                        <div className="w-full md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                            <img
                                src="/images/benefits/benefit_1.png"
                                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                                alt="Worker Benefits"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                        </div>

                        {/* Text Section - Right */}
                        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                            <div className="inline-flex items-center space-x-2 mb-4">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                <h4 className="text-primary font-bold text-sm uppercase tracking-wider">For Workers</h4>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                Find work without the runaround
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Join thousands of skilled professionals finding daily opportunities.
                            </p>

                            {/* Feature List (from previous 6 items) */}
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 font-medium">Instant Connections</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 font-medium">Fair & Transparent Wages</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 font-medium">Diverse Roles (Plumbing, etc.)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 2 - For Employers (Spans 1 column, Vertical Layout) */}
                    <div className="lg:col-span-1 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                        {/* Image Section - Top */}
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src="/images/benefits/benefit_3.png"
                                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                                alt="Employer Benefits"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Text Section - Bottom */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="inline-flex items-center space-x-2 mb-4">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                <h4 className="text-blue-600 font-bold text-sm uppercase tracking-wider">For Employers</h4>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                                Hire skilled talent fast
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Eliminate friction in your hiring process.
                            </p>

                            {/* Feature List */}
                            <ul className="space-y-3 mt-auto">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-slate-700 font-medium">Verified Talent</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-slate-700 font-medium">Zero Hiring Friction</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-slate-700 font-medium">Support Local Growth</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Benefits;
