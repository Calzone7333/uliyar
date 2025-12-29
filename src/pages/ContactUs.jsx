import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log("Form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* Header */}
            <div className="bg-slate-950 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Get in Touch</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">We're Here to Help</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Have questions about hiring or finding a job? Our team is ready to assist you.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8 mb-20">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Phone Support</h3>
                                <p className="text-slate-600 text-sm mb-1">Mon-Fri from 9am to 6pm</p>
                                <a href="tel:+919655771091" className="text-primary font-medium hover:underline">+91 96557 71091</a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Email Us</h3>
                                <p className="text-slate-600 text-sm mb-1">We'll respond within 24 hours</p>
                                <a href="mailto:info@uliyar.com" className="text-primary font-medium hover:underline">info@uliyar.com</a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Office</h3>
                                <p className="text-slate-600 text-sm">
                                    32, AJ Block 1st St, Sri Ayyappa Nagar, Chinmaya Nagar Stage II Extension, Kumaran Nagar,<br />
                                    Virugambakkam, Chennai, Tamil Nadu 600092
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="text-primary" />
                                <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                            </div>

                            {submitted ? (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 mb-6">
                                    <Send size={20} />
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="hiring">I want to hire workers</option>
                                        <option value="job">I am looking for a job</option>
                                        <option value="support">Technical Support</option>
                                        <option value="partnership">Partnership Inquiry</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                                >
                                    <span>Send Message</span>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section (Placeholder) */}
            <div className="h-96 w-full bg-gray-200 relative mb-[-1px]">
                <iframe
                    title="office-location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1394.2016471062104!2d80.19016353484919!3d13.063751214019497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267324f4ab783%3A0x5a5319e17f3a0a4b!2sGayathri%20Thiruvengadam%20%26%20Associates!5e1!3m2!1sen!2sin!4v1766990350497!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="filter grayscale opacity-80 hover:grayscale-0 transition-all duration-500"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactUs;
