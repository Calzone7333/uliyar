import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

const WhatYouGain = () => {
    return (
        <div className="py-24 bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary tracking-wide uppercase mb-2">Benefits</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">What you gain here</h3>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Join thousands of others who are transforming their careers and businesses with us.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-primary/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                        <div className="p-10 relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <TrendingUp size={32} />
                            </div>
                            <h4 className="text-2xl font-bold mb-4">Fast-track your career</h4>
                            <p className="text-slate-400 leading-relaxed flex-grow">
                                Get access to exclusive job listings that match your skills. Our algorithm ensures you see the best opportunities first, helping you climb the ladder faster.
                            </p>
                            <img src="/images/features/verified_profile.png" alt="Career Growth" className="mt-8 rounded-xl shadow-lg border border-slate-700 opacity-80 group-hover:opacity-100 transition-opacity w-full h-64 object-cover object-top" />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-primary/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                        <div className="p-10 relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Users size={32} />
                            </div>
                            <h4 className="text-2xl font-bold mb-4">Get skilled workers</h4>
                            <p className="text-slate-400 leading-relaxed flex-grow">
                                Stop wasting time sifting through unqualified applications. Our platform verifies every candidate so you can hire with confidence and speed.
                            </p>
                            <img src="/images/gallery/gallery_card_hire.png" alt="Hiring" className="mt-8 rounded-xl shadow-lg border border-slate-700 opacity-80 group-hover:opacity-100 transition-opacity w-full h-64 object-cover object-top" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatYouGain;
