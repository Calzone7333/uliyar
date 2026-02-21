import React from 'react';
import { Upload, Monitor, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();
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
        <div className="py-24 bg-white border-t border-gray-100" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-primary font-bold text-[12px] tracking-wider uppercase mb-3">{t("PROCESS")}</h2>
                    <h3 className="text-4xl md:text-5xl font-[700] leading-[1.2] text-slate-800 mb-6">How it works, step by step</h3>
                    <p className="text-[17px] text-slate-600 font-[500]">
                        Success is just a few clicks away. We've streamlined the process for both workers and employers.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="mb-6 text-gray-400">
                                <step.icon size={48} strokeWidth={1.5} />
                            </div>

                            <h4 className="text-xl font-[700] text-slate-800 mb-2">{step.title}</h4>
                            <p className="text-primary text-[14px] font-[600] mb-4">{step.subtitle}</p>
                            <p className="text-[15px] text-slate-500 font-[500] leading-relaxed max-w-xs mx-auto">
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
