import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, Globe, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import logo from '../assets/logo.png';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const { openLogin, openRegister } = useUI();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show navbar at the top
            if (currentScrollY < 10) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY.current) {
                // Scrolling down -> Hide
                setIsVisible(false);
            } else {
                // Scrolling up -> Show
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handlePostJobClick = () => {
        if (!user) {
            openLogin('employer');
            return;
        }

        if (user.role === 'admin') {
            navigate('/admin', { state: { activeTab: 'post_job' } });
        } else if (user.role === 'employer') {
            navigate('/employer-dashboard', { state: { openPostModal: true } });
        } else {
            // Worker / Candidate
            alert("Please login to an Employer account to post jobs.");
        }
    };

    return (
        <nav
            className={`bg-primary border-b border-white/10 sticky top-0 z-[100] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                <img src={logo} alt="Uliyar Logo" className="w-full h-full object-contain" />
                            </div>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-10">
                        <button onClick={handlePostJobClick} className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">{t('Post Jobs')}</button>
                        <Link to="/find-jobs" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">{t('Find jobs')}</Link>
                        <Link to="/categories" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">{t('Categories')}</Link>
                        <Link to="/about-us" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">{t('About us')}</Link>
                        <Link to="/contact-us" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">{t('Contact Us')}</Link>

                        {/* Language Switcher */}
                        <div className="relative group/lang">
                            <button className="flex items-center gap-1.5 text-white text-[15px] font-medium hover:text-white/80 transition-colors py-2">
                                <Globe size={18} />
                                <span className="pt-0.5">{i18n.language === 'ta' ? 'தமிழ்' : i18n.language === 'hi' ? 'हिन्दी' : i18n.language === 'te' ? 'తెలుగు' : i18n.language === 'ml' ? 'മലയാളം' : 'English'}</span>
                                <ChevronDown size={14} className="group-hover/lang:rotate-180 transition-transform duration-300" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-[-20px] top-full mt-2 w-[120px] bg-white rounded-xl shadow-2xl py-1.5 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 transform group-hover/lang:translate-y-0 translate-y-2 border border-slate-100 z-50">
                                {/* Invisible Bridge */}
                                <div className="absolute -top-4 left-0 w-full h-4"></div>
                                <button onClick={() => i18n.changeLanguage('en')} className={`w-full text-left px-5 py-2 text-[15px] ${i18n.language === 'en' ? 'text-[#f97316]' : 'text-slate-700'} hover:text-[#ea580c] font-medium hover:bg-orange-50/50 transition-colors`}>English</button>
                                <button onClick={() => i18n.changeLanguage('ta')} className={`w-full text-left px-5 py-2 text-[16px] ${i18n.language === 'ta' ? 'text-[#f97316]' : 'text-slate-700'} hover:text-[#ea580c] font-medium hover:bg-slate-50 transition-colors`}>தமிழ்</button>
                                <button onClick={() => i18n.changeLanguage('hi')} className={`w-full text-left px-5 py-2 text-[15px] ${i18n.language === 'hi' ? 'text-[#f97316]' : 'text-slate-700'} hover:text-[#ea580c] font-medium hover:bg-slate-50 transition-colors`}>हिन्दी</button>
                                <button onClick={() => i18n.changeLanguage('te')} className={`w-full text-left px-5 py-2 text-[15px] ${i18n.language === 'te' ? 'text-[#f97316]' : 'text-slate-700'} hover:text-[#ea580c] font-medium hover:bg-slate-50 transition-colors`}>తెలుగు</button>
                                <button onClick={() => i18n.changeLanguage('ml')} className={`w-full text-left px-5 py-2 text-[15px] ${i18n.language === 'ml' ? 'text-[#f97316]' : 'text-slate-700'} hover:text-[#ea580c] font-medium hover:bg-slate-50 transition-colors`}>മലയാളം</button>
                            </div>
                        </div>

                        {user ? (
                            <div className="relative group ml-4">
                                <button className="flex items-center gap-3 text-white focus:outline-none">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20 overflow-hidden backdrop-blur-sm">
                                        {user.profile_photo_path ? (
                                            <img src={`${API_BASE_URL}${user.profile_photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="text-sm font-medium opacity-90 transition-opacity group-hover:opacity-100">
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 border border-slate-100 z-50">
                                    {/* Arrow */}
                                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white transform rotate-45 border-t border-l border-slate-100"></div>

                                    <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-inner">
                                            {user.profile_photo_path ? (
                                                <img src={`${API_BASE_URL}${user.profile_photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {user.role === 'admin' ? (
                                        <Link to="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    ) : user.role === 'employer' ? (
                                        <Link to="/employer-dashboard" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                            Employer Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/candidate-dashboard" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                                My Applications
                                            </Link>
                                            <Link to="/candidate-profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                                My Profile
                                            </Link>
                                        </>
                                    )}
                                    <div className="border-t border-gray-100 mt-1">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors rounded-b-xl flex items-center gap-2">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-2">
                                <button
                                    onClick={() => openLogin('candidate')}
                                    className="text-white hover:text-white/80 font-bold text-[14px] px-2 py-2 transition-colors"
                                >
                                    Worker Login
                                </button>
                                <button
                                    onClick={() => openLogin('employer')}
                                    className="bg-white hover:bg-slate-50 text-primary px-5 py-2.5 rounded-[8px] font-bold text-[14px] transition-all shadow-sm"
                                >
                                    Employer Login
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-primary border-t border-white/10 p-4 shadow-xl">
                    <div className="flex flex-col space-y-4">
                        {user && (
                            <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/10">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg overflow-hidden backdrop-blur-sm">
                                    {user.profile_photo_path ? (
                                        <img src={`${API_BASE_URL}${user.profile_photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{user.name}</p>
                                    <p className="text-white/70 text-xs">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <button onClick={() => { setIsOpen(false); handlePostJobClick(); }} className="text-lg font-medium text-white text-left">{t('Post Jobs')}</button>
                        <Link to="/find-jobs" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t('Find jobs')}</Link>
                        <Link to="/categories" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t('Categories')}</Link>
                        <Link to="/about-us" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t('About us')}</Link>
                        <Link to="/resources" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t('Resources')}</Link>
                        <Link to="/contact-us" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t('Contact Us')}</Link>

                        {/* Mobile Language Switcher */}
                        <div className="flex flex-col space-y-3 pb-2 pt-2">
                            <div className="flex items-center gap-2 text-white/90 font-medium text-lg">
                                <Globe size={20} /> Language
                            </div>
                            <div className="flex gap-4 pl-7 flex-wrap">
                                <button onClick={() => i18n.changeLanguage('en')} className={`text-[15px] font-bold ${i18n.language === 'en' ? 'text-orange-400' : 'text-white/70'} hover:text-white`}>English</button>
                                <button onClick={() => i18n.changeLanguage('ta')} className={`text-[16px] font-medium ${i18n.language === 'ta' ? 'text-orange-400' : 'text-white/70'} hover:text-white`}>தமிழ்</button>
                                <button onClick={() => i18n.changeLanguage('hi')} className={`text-[15px] font-medium ${i18n.language === 'hi' ? 'text-orange-400' : 'text-white/70'} hover:text-white`}>हिन्दी</button>
                                <button onClick={() => i18n.changeLanguage('te')} className={`text-[15px] font-medium ${i18n.language === 'te' ? 'text-orange-400' : 'text-white/70'} hover:text-white`}>తెలుగు</button>
                                <button onClick={() => i18n.changeLanguage('ml')} className={`text-[15px] font-medium ${i18n.language === 'ml' ? 'text-orange-400' : 'text-white/70'} hover:text-white`}>മലയാളം</button>
                            </div>
                        </div>

                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link to="/admin" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                                ) : user.role === 'employer' ? (
                                    <>
                                        {/* Employer Dashboard access is via 'Post Jobs' or Login modal logic mainly */}
                                    </>
                                ) : (
                                    <>
                                        <Link to="/candidate-profile" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>My Profile</Link>
                                        <Link to="/candidate-dashboard" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>My Applications</Link>
                                    </>
                                )}
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-lg font-medium text-red-300 text-left">Logout</button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { setIsOpen(false); openLogin('candidate'); }}
                                    className="text-lg font-bold text-white text-left py-2 hover:text-white/80"
                                >
                                    Worker Login
                                </button>
                                <button
                                    onClick={() => { setIsOpen(false); openLogin('employer'); }}
                                    className="text-lg font-bold text-primary bg-white p-3 rounded-xl text-center shadow-sm"
                                >
                                    Employer Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

        </nav>
    );
};
export default Navbar;
