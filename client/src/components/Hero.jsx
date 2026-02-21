import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Typewriter = ({ text, typingSpeed = 80, pauseTime = 3000, deleteSpeed = 40 }) => {
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Reset state entirely if language/translation changes abruptly
        setCurrentText('');
        setIsDeleting(false);
    }, [text]);

    useEffect(() => {
        let timeout;

        if (!isDeleting && currentText.length < text.length) {
            // Typing forward
            timeout = setTimeout(() => {
                setCurrentText(text.slice(0, currentText.length + 1));
            }, typingSpeed);
        } else if (!isDeleting && currentText.length === text.length) {
            // Pause when fully typed
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, pauseTime);
        } else if (isDeleting && currentText.length > 0) {
            // Deleting backwards
            timeout = setTimeout(() => {
                setCurrentText(text.slice(0, currentText.length - 1));
            }, deleteSpeed);
        } else if (isDeleting && currentText.length === 0) {
            // Slight pause after complete deletion before restarting
            timeout = setTimeout(() => {
                setIsDeleting(false);
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, text, typingSpeed, pauseTime, deleteSpeed]);

    return (
        <span>
            {currentText}
            <span className="animate-[pulse_1s_ease-in-out_infinite] border-r-[3px] border-primary ml-0.5 h-[0.9em] inline-block align-middle -translate-y-[2px]"></span>
        </span>
    );
};

const Hero = () => {
    const { t } = useTranslation();
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

    const { openLogin, openRegister } = useUI();

    return (
        <div
            className="bg-secondary text-slate-900 overflow-hidden relative pt-4 pb-20 lg:pb-32"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[600px]">

                {/* Left Content */}
                <div className="flex flex-col justify-center z-10 -mt-16 lg:-mt-32 xl:-mt-40">
                    <div className="inline-flex self-start items-center px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full mb-6 md:mb-8 border border-blue-100 shadow-sm">
                        <span className="text-primary font-bold text-[11px] md:text-xs tracking-wider uppercase">
                            # India’s Trusted Platform for Salary-Based Blue-Collar Jobs
                        </span>
                    </div>

                    <div className="space-y-4 mb-10">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-[700] leading-[1.2] text-slate-800">
                            {t("Find Jobs and")}
                        </h1>
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-[700] leading-[1.2] text-primary min-h-[1.2em]">
                            <Typewriter text={t("Hire Skilled Workers Across India")} />
                        </h1>
                    </div>

                    <div className="pl-6 border-l-4 border-primary max-w-xl opacity-90">
                        <p className="text-[17px] text-slate-600 leading-relaxed font-[500]">
                            Upload your resume and connect with employers looking for
                            skilled trades. Post a job and hire the workers you need, fast.
                        </p>
                    </div>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                            onClick={() => openRegister('candidate')}
                            className="px-8 py-4 bg-primary hover:bg-teal-700 text-white rounded-full font-[600] text-[16px] transition-all shadow-lg shadow-primary/20"
                        >
                            {t("I am a worker")}
                        </button>
                        <button
                            onClick={() => openLogin('employer')}
                            className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 border border-slate-200 rounded-full font-[600] text-[16px] transition-all shadow-sm"
                        >
                            {t("I am an employer")}
                        </button>
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
