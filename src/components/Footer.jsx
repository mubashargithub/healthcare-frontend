import React, { useState } from 'react';
import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [openModal, setOpenModal] = useState(null);

    const legalContent = {
        privacy: {
            title: "Privacy Policy",
            content: "We value your privacy. DiagnoAI collects essential diagnostic data solely to improve our AI models and provide you with better health insights. We strictly comply with global data regulations and never sell your personal information."
        },
        terms: {
            title: "Terms of Service",
            content: "By using DiagnoAI, you agree to our terms. Please remember that DiagnoAI is an AI-assisted informational tool. It does not replace professional medical advice, diagnosis, or treatment always consult a qualified healthcare provider."
        },
        cookies: {
            title: "Cookie Policy",
            content: "We use essential cookies to maintain your active session, alongside functional cookies to remember your dashboard preferences. No third-party tracking cookies are utilized for advertising."
        }
    };

    return (
        <footer className="bg-[#0b1120] border-t border-slate-800 pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-600/10 rounded-full blur-[100px] md:blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-20">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-gradient-to-br from-primary-500 to-cyan-500 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter">Diagno<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">AI</span></span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed font-medium max-w-xs">
                            Leading the charge in AI-driven healthcare diagnostics. Making professional medical advice accessible to everyone, everywhere.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="w-11 h-11 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-primary-500 hover:to-cyan-500 hover:text-white hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-black tracking-wide mb-8 text-lg">Quick Links</h3>
                        <ul className="space-y-4">
                            {['Home', 'Services', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-slate-400 font-medium hover:text-cyan-400 hover:translate-x-1.5 inline-block transition-all duration-300"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black tracking-wide mb-8 text-lg">Services</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Symptom Checker', path: '/symptom-check' },
                                { name: 'Doctor Network', path: '/doctor-network' },
                                { name: 'Pharmacy Locator', path: '/pharmacy-locator' },
                                { name: 'Health Analytics', path: '/dashboard' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-slate-400 font-medium hover:text-cyan-400 hover:translate-x-1.5 inline-block transition-all duration-300">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black tracking-wide mb-6 text-lg">Newsletter</h3>
                        <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">
                            Stay updated with the latest in healthcare tech.
                        </p>
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 pl-5 pr-14 text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                            />
                            <button className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-md hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 relative">
                    <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                        <span>© {new Date().getFullYear()} DiagnoAI. Crafted with</span>
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
                        <span>for a healthier world.</span>
                    </div>

                    <div className="flex space-x-8 text-slate-500 text-sm font-medium tracking-wide">
                        <button onClick={() => setOpenModal('privacy')} className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
                        <button onClick={() => setOpenModal('terms')} className="hover:text-cyan-400 transition-colors">Terms of Service</button>
                        <button onClick={() => setOpenModal('cookies')} className="hover:text-cyan-400 transition-colors">Cookies</button>
                    </div>
                </div>
            </div>

            {/* Legal Information Modal */}
            {openModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setOpenModal(null)}
                >
                    <div
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setOpenModal(null)}
                            className="absolute right-5 top-5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-1 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="mb-6 inline-flex p-3 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
                            <Activity className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{legalContent[openModal].title}</h3>
                        <p className="text-slate-300 leading-relaxed text-[15px] mb-8">
                            {legalContent[openModal].content}
                        </p>
                        <button
                            onClick={() => setOpenModal(null)}
                            className="w-full py-3 bg-gradient-to-r from-primary-500 to-cyan-500 text-white rounded-xl font-bold tracking-wide hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;

