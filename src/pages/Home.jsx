import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Users, MapPin, ArrowRight, ChevronLeft, ChevronRight, BrainCircuit, Lock, Clock, CheckCircle2, Stethoscope, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Import Hero Images
import img1 from '../assets/hero/img1.jpg';
import img2 from '../assets/hero/image2.jpg';
import img3 from '../assets/hero/img3.jpg';

const slides = [
    {
        title: "AI-Powered Healthcare Diagnostics",
        highlight: "Diagnostics",
        description: "Get instant disease predictions based on your symptoms with 95% accuracy. Professional healthcare made accessible everywhere.",
        image: img1,
        color: "primary"
    },
    {
        title: "Connect with Expert Medical Specialists",
        highlight: "Specialists",
        description: "Find the best doctors in your city tailored to your specific health needs. Quality care is just a click away.",
        image: img2,
        color: "blue"
    },
    {
        title: "Find Reliable Pharmacies Near You",
        highlight: "Pharmacies",
        description: "Locate medical stores and check availability of medicines in your area with our localized search system.",
        image: img3,
        color: "green"
    }
];
let hasPlayedIntro = false;

const Home = () => {
    const { user } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showIntro, setShowIntro] = useState(!hasPlayedIntro);

    useEffect(() => {
        if (showIntro) {
            hasPlayedIntro = true;
            const introTimer = setTimeout(() => {
                setShowIntro(false);
            }, 2000);
            return () => clearTimeout(introTimer);
        }
    }, [showIntro]);

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => {
            clearInterval(slideTimer);
        };
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="bg-[#f8fafc] overflow-x-hidden min-h-screen">
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        key="intro-screen"
                        initial={{ opacity: 1 }}
                        exit={{ 
                            opacity: 0,
                            scale: 1.5,
                            filter: "blur(20px)"
                        }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden"
                    >
                        {/* Beautiful Intro Animation Elements */}
                        <div className="relative flex flex-col items-center z-10">
                            {/* Central Expanding Circle */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    duration: 1, 
                                    ease: "easeOut",
                                    type: "spring",
                                    stiffness: 100
                                }}
                                className="relative w-32 h-32 flex items-center justify-center mb-8"
                            >
                                <motion.div 
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 3, ease: "linear", repeat: Infinity },
                                        scale: { duration: 2, ease: "easeInOut", repeat: Infinity }
                                    }}
                                    className="absolute inset-0 border-t-4 border-l-4 border-primary-500 rounded-full"
                                />
                                <motion.div 
                                    animate={{ 
                                        rotate: -360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 4, ease: "linear", repeat: Infinity },
                                        scale: { duration: 2.5, ease: "easeInOut", repeat: Infinity, delay: 0.5 }
                                    }}
                                    className="absolute inset-2 border-b-4 border-r-4 border-blue-400 rounded-full opacity-70"
                                />
                                
                                <Activity className="w-12 h-12 text-white relative z-10" />
                                
                                {/* Pulse Effect */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    transition={{ 
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                    className="absolute inset-0 bg-primary-500 rounded-full -z-10"
                                />
                            </motion.div>

                            {/* Text Animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-center justify-center space-x-2">
                                    <span>Diagno</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">AI</span>
                                </h1>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="flex flex-col items-center"
                                >
                                    <p className="text-slate-400 tracking-widest uppercase text-xs font-bold mb-3">
                                        Initializing Health Engine
                                    </p>
                                    <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-full h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Background Decor */}
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.15 }}
                            transition={{ duration: 1.5 }}
                            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[150px] pointer-events-none"
                        />
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.1 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] pointer-events-none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Slider Section */}
            <section className="relative h-[85vh] lg:h-[calc(90vh-56px)] min-h-[550px] mt-14 bg-slate-900 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {/* Background Image with Enhanced Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                            <div className="max-w-2xl text-white">
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                >
                                    {/* Medical Badge */}
                                    <div className="inline-flex items-center space-x-2 bg-primary-500/20 backdrop-blur-md border border-primary-500/30 px-4 py-2 rounded-full mb-8">
                                        <Activity className="h-4 w-4 text-primary-400" />
                                        <span className="text-primary-100 text-xs font-bold uppercase tracking-widest leading-none">Diagnostic Intelligence</span>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl lg:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
                                        {slides[currentSlide].title.split(slides[currentSlide].highlight)[0]}
                                        <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                            {slides[currentSlide].highlight}
                                        </span>
                                        {slides[currentSlide].title.split(slides[currentSlide].highlight)[1]}
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                                        {slides[currentSlide].description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                                        <Link
                                            to={user ? ((user.role === 'admin' || user.role === 'superadmin') ? "/admin" : "/dashboard") : "/signup"}
                                            className="group bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-8 text-lg flex items-center justify-center rounded-2xl shadow-2xl shadow-primary-600/20 transition-all active:scale-95"
                                        >
                                            {user ? ((user.role === 'admin' || user.role === 'superadmin') ? "Admin Dashboard" : "Personal Dashboard") : "Start For Free"}
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <Link
                                            to="/about"
                                            className="bg-white/5 backdrop-blur-xl text-white border border-white/20 font-bold py-4 px-8 rounded-2xl hover:bg-white/10 transition-all text-lg text-center"
                                        >
                                            How it Works
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Modern Slider Controls */}
                <div className="absolute bottom-12 right-4 sm:right-6 lg:right-8 flex items-center space-x-4 z-20">
                    <button
                        onClick={prevSlide}
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-primary-600 transition-all active:scale-90"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex space-x-2 px-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === currentSlide ? "w-8 bg-primary-500" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={nextSlide}
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-primary-600 transition-all active:scale-90"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                {/* Animated Background Decor */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
            </section>

            {/* Features Section - Premium Cards */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary-600 font-bold text-sm tracking-widest uppercase mb-4 block"
                        >
                            Medical Excellence
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8"
                        >
                            Bridging AI and <span className="text-primary-600">Healthcare</span>
                        </motion.h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                            Access professional medical insights powered by advanced neural networks and verified doctor networks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Activity,
                                title: "Smart Prediction",
                                desc: "Our AI analysis tool utilizes massive clinical datasets to provide near-instant diagnostic insights.",
                                color: "blue",
                                link: "/symptom-check"
                            },
                            {
                                icon: Users,
                                title: "Verified Experts",
                                desc: "Connect directly with certified specialists who can review your AI results and provide care.",
                                color: "indigo",
                                link: "/doctor-network"
                            },
                            {
                                icon: MapPin,
                                title: "Hyper-Local Aid",
                                desc: "Real-time geolocation mapping to find the nearest emergency care and medical stores instantly.",
                                color: "cyan",
                                link: "/pharmacy-locator"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-primary-100 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.1)] transition-all duration-500"
                            >
                                <div className="mb-8 relative">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-500">
                                        <item.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-all" />
                                    </div>
                                    <div className="absolute -inset-2 bg-primary-600/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
                                <Link to={item.link} className="mt-8 flex items-center text-primary-600 font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION: How It Works */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary-600 font-bold text-sm tracking-widest uppercase mb-4 block"
                        >
                            Streamlined Process
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                        >
                            Your Journey to <span className="text-primary-600">Better Health</span>
                        </motion.h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            A seamless, intuitive experience designed to transform your symptoms into actionable medical guidance in minutes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"></div>

                        {[
                            {
                                step: "01",
                                icon: Activity,
                                title: "Detail Symptoms",
                                desc: "Enter your health concerns into our intuitive, responsive AI interface."
                            },
                            {
                                step: "02",
                                icon: BrainCircuit,
                                title: "AI Analysis",
                                desc: "Our proprietary algorithm evaluates millions of data points instantly."
                            },
                            {
                                step: "03",
                                icon: CheckCircle2,
                                title: "Get Insights",
                                desc: "Receive highly accurate preliminary diagnoses and health reports."
                            },
                            {
                                step: "04",
                                icon: Stethoscope,
                                title: "Take Action",
                                desc: "Connect with verified specialists or locate nearby pharmacies seamlessly."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15 }}
                                viewport={{ once: true }}
                                className="relative pt-8 md:pt-0"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-white border-[8px] border-slate-50 shadow-xl flex items-center justify-center relative z-10 mb-6 group hover:border-primary-100 transition-colors duration-300">
                                        <item.icon className="h-10 w-10 text-primary-600" />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION: The DiagnoAI Advantage */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary-600 font-bold text-sm tracking-widest uppercase mb-4 block">
                                Beyond Basic Checking
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                Intelligent Healthcare, <br/>
                                <span className="text-primary-600">Uncompromising Security.</span>
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                We combine state-of-the-art machine learning with established medical protocols to deliver a platform that doesn't just guess, but analyzes and guides with precision.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: HeartPulse,
                                        title: "Comprehensive Health Tracking",
                                        desc: "Monitor your vitals and medical history over time with personalized dashboards."
                                    },
                                    {
                                        icon: Lock,
                                        title: "Bank-Grade Data Privacy",
                                        desc: "Your medical data is fully encrypted and strictly confidential, adhering to global standards."
                                    },
                                    {
                                        icon: Clock,
                                        title: "24/7 Uninterrupted Access",
                                        desc: "Health concerns don't wait for business hours. Get preliminary insights anytime, anywhere."
                                    }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                                                <feature.icon className="h-6 w-6 text-primary-600" />
                                            </div>
                                        </div>
                                        <div className="ml-5">
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{feature.title}</h4>
                                            <p className="text-slate-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl">
                                <img 
                                    src={img2} 
                                    alt="Medical Professional" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-white">
                                    <div className="flex items-center mb-4">
                                        <Shield className="h-8 w-8 text-primary-400 mr-3" />
                                        <div>
                                            <h5 className="font-bold text-lg">Clinically Validated</h5>
                                            <p className="text-white/70 text-sm">Trusted by healthcare networks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-100 rounded-full blur-2xl -z-10"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-2xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Premium Stats - Modern Glassmorphism */}
            <section className="py-20 md:py-28 relative">
                <div className="absolute inset-0 bg-slate-900 skew-y-1 origin-right"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "AI Precision", val: "95%" },
                            { label: "Active Users", val: "15K+" },
                            { label: "Specialists", val: "800+" },
                            { label: "Live 24/7", val: "YES" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative py-8"
                            >
                                <div className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">{stat.val}</div>
                                <div className="text-primary-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-white overflow-hidden relative">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-primary-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary-600/20">
                        {/* Decorative background circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">Ready to take control of your health?</h2>
                        <p className="text-primary-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90 relative z-10">
                            Join thousands of users who trust DiagnoAI for their daily health monitoring and medical guidance.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                            <Link to={user ? ((user.role === 'admin' || user.role === 'superadmin') ? "/admin" : "/dashboard") : "/signup"} className="bg-white text-primary-600 hover:bg-primary-50 px-10 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg">
                                {user ? "Go to Dashboard" : "Get Started Free"}
                            </Link>
                            <Link to="/contact" className="text-white border border-white/30 hover:bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg transition-all">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
