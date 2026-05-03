import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/api';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userCity = user?.city || 'Pakistan';
    const mapQuery = encodeURIComponent(`${userCity}, Pakistan`);
    const publicMapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await contactService.submitMessage(formData);
            if (res.data.success) {
                alert('Thank you for your message! The Admin team will review it shortly.');
                setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
            }
        } catch (err) {
            console.error('Contact submission error:', err);
            alert(err.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="bg-[#f8fafc] overflow-hidden min-h-screen pt-24 pb-20 relative">

            {/* Ambient Background Splashes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Hero Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full mb-6 font-bold text-xs uppercase tracking-widest shadow-sm border border-primary-200">
                            <MessageSquare className="h-4 w-4" />
                            <span>Global Support Network</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">Health Together</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            Whether you need technical support, diagnostic clarifications, or partnership inquiries—our dedicated medical tech team is actively standing by.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Left Column: Info & Map */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-5 space-y-8"
                    >
                        <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>

                            <h3 className="text-2xl font-black text-white mb-8">Direct Channels</h3>

                            <div className="space-y-8 relative z-10">
                                {/* Email */}
                                <div className="flex items-start space-x-5 group">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:border-transparent transition-all duration-300 shrink-0 shadow-lg">
                                        <Mail className="h-6 w-6 text-primary-400 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Protocol</p>
                                        <p className="text-lg font-medium text-white">support@diagnoai.com</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start space-x-5 group">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-transparent transition-all duration-300 shrink-0 shadow-lg">
                                        <Phone className="h-6 w-6 text-cyan-400 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Live Dispatch</p>
                                        <p className="text-lg font-medium text-white">+92 (300) 123-4567</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start space-x-5 group">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-transparent transition-all duration-300 shrink-0 shadow-lg">
                                        <MapPin className="h-6 w-6 text-indigo-400 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Node</p>
                                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">{userCity}, Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive Map Feed */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] h-64 overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative group">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center text-xs font-bold text-slate-700">
                                <Activity className="h-3 w-3 mr-2 text-primary-500 animate-pulse" />
                                Geolocator Active
                            </div>
                            <iframe
                                title="Local Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={publicMapSrc}
                                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            ></iframe>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Premium Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 md:p-12 h-full">
                            <h3 className="text-2xl font-black text-slate-900 mb-8">Send a Secured Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium text-slate-900 placeholder-slate-400"
                                            placeholder="Jane Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Email Identity</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium text-slate-900 placeholder-slate-400"
                                            placeholder="jane@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Subject Vector</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium text-slate-900 placeholder-slate-400"
                                        placeholder="How can we assist your diagnostic routing?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Transmission Data</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium text-slate-900 placeholder-slate-400 resize-none"
                                        placeholder="Enter your encrypted message contents here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 mt-4 flex items-center justify-center space-x-2 rounded-2xl font-bold text-lg text-white transition-all shadow-xl shadow-primary-600/30 ${isSubmitting ? 'bg-primary-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:shadow-primary-600/50 hover:scale-[1.02] active:scale-[0.98]'}`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Transmitting...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Initialize Transmission</span>
                                            <Send className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
