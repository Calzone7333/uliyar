import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                <img src={logo} alt="Uliyar Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <p className="text-white mb-8 leading-relaxed">
                            Connecting skilled workers with the best opportunities across India.
                            The most trusted platform for blue-collar jobs.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                    <Icon size={18} className="text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            {['Find Jobs', 'Post a Job', 'About Us', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-white hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative inline-block">
                            Services
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            {['Worker Registration', 'Employer Verify', 'Skill Assessments', 'Premium Plans'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-white hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-white">
                                <MapPin className="w-5 h-5 shrink-0 mt-1 text-primary" />
                                <p>3/32, 1st Main Road, Ayyappa Nagar, Virugambakkam, Chennai-600092</p>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Phone className="w-5 h-5 shrink-0 text-primary" />
                                <p>+91 96557 71091</p>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Mail className="w-5 h-5 shrink-0 text-primary" />
                                <p>info@uliyar.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/70 text-sm">
                        © {new Date().getFullYear()} Hado Global Services Pvt Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-white/70">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
