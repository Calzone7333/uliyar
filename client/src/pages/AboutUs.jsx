import React from 'react';
import { Users, Target, Shield, Award, CheckCircle, MapPin } from 'lucide-react';

const StatCard = ({ number, label, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Icon size={24} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{number}</h3>
        <p className="text-slate-600">{label}</p>
    </div>
);

const AboutUs = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering Blue-Collar Professionals</h1>
                    <p className="text-lg md:text-xl text-slate-300 opacity-90 max-w-2xl mx-auto">
                        We are on a mission to organize the unorganized sector, providing dignity, stability, and growth opportunities to millions of skilled workers.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard number="2M+" label="Workers Hired" icon={Users} />
                    <StatCard number="15.8k+" label="Job Categories" icon={Target} />
                    <StatCard number="98%" label="Satisfaction" icon={Award} />
                    <StatCard number="300+" label="Active Cities" icon={MapPin} />
                </div>
            </div>

            {/* Our Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Construction team discussion"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                                <p className="font-bold text-xl text-slate-900">Since 2023</p>
                                <p className="text-slate-500 text-sm">Building Trust</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Story</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bridging the Gap Between Talent and Opportunity</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Uliyar was born from a simple observation: finding reliable skilled workers was hard, and finding reliable work was even harder. The traditional market was fragmented, inefficient, and often exploitative.
                        </p>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            We set out to change that by building a platform that values skill, ensures fair pay, and provides a seamless hiring experience. Today, we are proud to be the trusted partner for thousands of businesses and workers across the country.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Verified Professionals Only",
                                "Transparent Pricing & Payments",
                                "Skill Development Programs",
                                "Instant Job Matching"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="bg-teal-50 p-1 rounded-full"><CheckCircle size={16} className="text-primary" /></div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
                                <Target size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed">
                                To dignify labor and create sustainable livelihoods for blue-collar workers by connecting them with opportunities through technology, transparency, and trust. We aim to remove intermediaries and ensure fair wages for every hour of hard work.
                            </p>
                        </div>
                        <div className="bg-slate-950 p-10 rounded-3xl text-white">
                            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-slate-300 leading-relaxed">
                                A world where every skilled worker is respected, valued, and has access to consistent income. We envision an organized, efficient ecosystem where quality workmanship is recognized and rewarded instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Ready to Join the Revolution?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/find-jobs" className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-900/20">
                        Join as a Worker
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
