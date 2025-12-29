import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-primary border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-white tracking-tight">Uliyar</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-10">
                        <Link to="/find-jobs" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">Find jobs</Link>
                        <Link to="/categories" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">Categories</Link>
                        <Link to="/about-us" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">About us</Link>

                        <Link to="/contact-us" className="text-white text-[15px] font-medium hover:text-white/80 transition-colors">Contact Us</Link>

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

                                    {user.role === 'employer' ? (
                                        <>
                                            <Link to="/employer-dashboard" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                                Employer Dashboard
                                            </Link>
                                            <Link to="/employer-profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors">
                                                Company Profile
                                            </Link>
                                        </>
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
                            <Link to="/login" className="flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                                <User size={18} /> Login
                            </Link>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
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
                        <Link to="/find-jobs" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Find jobs</Link>
                        <Link to="/categories" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Categories</Link>
                        <Link to="/about-us" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>About us</Link>
                        <Link to="/resources" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Resources</Link>
                        <Link to="/contact-us" className="text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Contact Us</Link>
                        {user ? (
                            <>
                                {user.role === 'employer' ? (
                                    <Link to="/employer-dashboard" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>Employer Dashboard</Link>
                                ) : (
                                    <>
                                        <Link to="/candidate-profile" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>My Profile</Link>
                                        <Link to="/candidate-dashboard" className="text-lg font-medium text-white/90" onClick={() => setIsOpen(false)}>My Applications</Link>
                                    </>
                                )}
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-lg font-medium text-red-300 text-left">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-lg font-medium text-primary bg-white p-3 rounded-xl text-center font-bold" onClick={() => setIsOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;
