import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, UserCheck, Activity, ClipboardList, MapPin, ArrowRight, ShieldCheck, Lightbulb, HeartPulse } from 'lucide-react';

const Services = () => {
    // Array of services with modernized aesthetics and dynamic class mappings
    const services = [
        {
            title: "AI Disease Prediction",
            description: "Harness our advanced ML models to intelligently analyze your symptoms and receive instant, precise clinical predictions.",
            icon: Activity,
            link: "/symptom-check",
            bg: "bg-blue-50/50",
            hoverBg: "group-hover:bg-blue-600",
            iconColor: "text-blue-600",
            borderColor: "hover:border-blue-200",
            shadowColor: "hover:shadow-blue-500/20"
        },
        {
            title: "Doctor Recommendation",
            description: "Seamlessly connect with verified specialists tailored to your precise diagnosis and geographic proximity.",
            icon: UserCheck,
            link: "/doctor-network",
            bg: "bg-indigo-50/50",
            hoverBg: "group-hover:bg-indigo-600",
            iconColor: "text-indigo-600",
            borderColor: "hover:border-indigo-200",
            shadowColor: "hover:shadow-indigo-500/20"
        },
        {
            title: "Pharmacy Locator",
            description: "Instantly discover nearby pharmacies with real-time route optimization, contact data, and active operating hours.",
            icon: MapPin,
            link: "/pharmacy-locator",
            bg: "bg-teal-50/50",
            hoverBg: "group-hover:bg-teal-600",
            iconColor: "text-teal-600",
            borderColor: "hover:border-teal-200",
            shadowColor: "hover:shadow-teal-500/20"
        },
        {
            title: "Health History",
            description: "Your secure HIPAA-compliant vault. Consolidate and track all your historical predictions safely in one integrated dashboard.",
            icon: ShieldCheck,
            link: "/health-history",
            bg: "bg-green-50/50",
            hoverBg: "group-hover:bg-green-600",
            iconColor: "text-green-600",
            borderColor: "hover:border-green-200",
            shadowColor: "hover:shadow-green-500/20"
        },
        {
            title: "AI Health Insights",
            description: "Generate proactive wellness regimes and personalized therapy routines explicitly mapped to your historical diagnostic data.",
            icon: Lightbulb,
            link: "/health-insights",
            bg: "bg-amber-50/50",
            hoverBg: "group-hover:bg-amber-600",
            iconColor: "text-amber-600",
            borderColor: "hover:border-amber-200",
            shadowColor: "hover:shadow-amber-500/20"
        },
        {
            title: "Medication Reminders",
            description: "Maintain absolute therapeutic compliance with automated, intelligent tracking and prescriptive scheduling notifications.",
            icon: Pill,
            link: "/medication-reminders",
            bg: "bg-rose-50/50",
            hoverBg: "group-hover:bg-rose-600",
            iconColor: "text-rose-600",
            borderColor: "hover:border-rose-200",
            shadowColor: "hover:shadow-rose-500/20"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    return (
        <div className="bg-[#f8fafc] overflow-hidden min-h-screen pt-24 pb-20">

            {/* Ambient Base Glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Premium Header Layout */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full mb-6 font-bold text-xs uppercase tracking-widest shadow-sm">
                            <HeartPulse className="h-4 w-4" />
                            <span>Comprehensive Ecosystem</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Elevating Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Healthcare Journey</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
                            Navigate a seamlessly integrated suite of intelligent medical tools designed to empower you with precision diagnostics, verified experts, and active data retention.
                        </p>

                        <Link
                            to="/doctor-network"
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 hover:shadow-primary-600/40 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-white opacity-20 group-hover:animate-[shine_1.5s_ease-out_infinite]"></div>

                            <div className="relative z-10 flex items-center space-x-3">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="font-bold tracking-wide uppercase text-sm">Access Verified Doctor Network</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Staggered Animated Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
                >
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Link
                                to={service.link}
                                className={`block h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/30 ${service.shadowColor} ${service.borderColor} transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden relative`}
                            >
                                {/* Abstract Hover Shape */}
                                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${service.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-3xl pointer-events-none`}></div>

                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 ${service.bg} ${service.hoverBg} transition-colors duration-500 shadow-sm`}>
                                        <service.icon className={`h-8 w-8 ${service.iconColor} group-hover:text-white transition-colors duration-500`} />
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed font-medium mb-8 line-clamp-3">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-primary-600 transition-colors mt-auto">
                                        Enter Portal <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default Services;
