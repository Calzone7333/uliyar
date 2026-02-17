import React from 'react';
import { Upload, Monitor, Briefcase } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            title: "For job seekers",
            subtitle: "Create profile and apply",
            icon: Upload,
            desc: "Sign up, create your professional profile, upload your skills and certifications, and start applying to better jobs instantly."
        },
        {
            title: "For employers",
            subtitle: "Post and connect",
            icon: Monitor, // Changed to match "screen" looking icon
            desc: "Post your job requirements, browse our database of verified professionals, and instantly connect with the right talent."
        },
        {
            title: "Then comes the work",
            subtitle: "Hire and get paid",
            icon: Briefcase,
            desc: "Agree on terms with transparent contracts, get the work done efficiently, and process secure payments upon completion."
        }
    ];

    return (
        <div className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">PROCESS</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How it works, step by step</h3>
                    <p className="text-gray-500">
                        Success is just a few clicks away. We've streamlined the process for both workers and employers.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="mb-6 text-gray-400">
                                <step.icon size={48} strokeWidth={1.5} />
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-primary text-sm font-semibold mb-4">{step.subtitle}</p>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default HowItWorks;
