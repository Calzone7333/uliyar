import React, { useState, useEffect } from 'react';

const Features = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const features = [
        {
            title: "Quick uploads",
            desc: "Get your resume in the system in minutes, Employers see you right away.",
            img: "/images/features/quick_upload.png"
        },
        {
            title: "Verified Profiles",
            desc: "Every worker passes a 3-step verification process for your peace of mind.",
            img: "/images/features/verified_profile.png"
        },
        {
            title: "Smart Matching",
            desc: "Our AI connects you with the jobs that match your exact skill set.",
            img: "/images/features/smart_matching.png"
        },
        {
            title: "Secure Payments",
            desc: "Guaranteed payments via our secure escrow for every completed milestone.",
            img: "/images/features/secure_payment.png"
        },
    ];

    // Extended list with the first item cloned at the end for infinite loop effect
    const extendedFeatures = [...features, features[0]];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setActiveIndex((current) => current + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // If we reached the clone (last item), reset to 0 after animation
        if (activeIndex === features.length) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setActiveIndex(0);
            }, 700); // 700ms matches CSS duration
            return () => clearTimeout(timeout);
        }
    }, [activeIndex, features.length]);

    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Content */}
                    <div className="w-full lg:w-5/12 pt-8">
                        <h2 className="text-base font-medium text-slate-900 mb-4">Features</h2>
                        <h3 className="text-5xl font-medium text-slate-900 mb-6 leading-tight">
                            Everything you need to <br />
                            work or hire
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed max-w-sm">
                            We built a platform that simplifies the entire process. Whether you are looking for your next gig or need to crew up fast, we have the tools you need.
                        </p>
                        {/* Progress Indicators */}
                        <div className="flex gap-2 mt-8">
                            {features.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setActiveIndex(idx);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${(activeIndex % features.length) === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Auto Sliding Carousel */}
                    <div className="w-full lg:w-7/12 overflow-hidden rounded-3xl shadow-2xl relative">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {extendedFeatures.map((feature, idx) => (
                                <div key={idx} className="min-w-full relative bg-gray-200 group">
                                    <img
                                        src={feature.img}
                                        alt={feature.title}
                                        className="w-full h-[500px] object-cover object-center transition-opacity duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/95 p-8 flex flex-col justify-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <h4 className="text-white text-2xl font-bold">{feature.title}</h4>
                                        <p className="text-blue-100 text-base font-light opacity-90 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Features;
