import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Lightbulb, Activity, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    // Animation configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1, y: 0,
            transition: { type: 'spring', stiffness: 80, damping: 15 }
        }
    };

    const corePillars = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To democratize healthcare access globally by deploying predictive AI models that provide instant diagnostic clarity and bridge the gap to specialized medical care.",
            bg: "bg-blue-50/70",
            iconColor: "text-blue-600",
            borderColor: "hover:border-blue-200 hover:shadow-blue-500/20"
        },
        {
            icon: Lightbulb,
            title: "Our Vision",
            description: "A future where every human being possesses a secure, hyper-intelligent health companion actively monitoring their wellness and streamlining complex medical decisions.",
            bg: "bg-indigo-50/70",
            iconColor: "text-indigo-600",
            borderColor: "hover:border-indigo-200 hover:shadow-indigo-500/20"
        },
        {
            icon: Heart,
            title: "Our Values",
            description: "Absolute patient privacy, clinical-grade accuracy, and radical empathy stand at the core of every single algorithm we train and deploy at DiagnoAI.",
            bg: "bg-rose-50/70",
            iconColor: "text-rose-600",
            borderColor: "hover:border-rose-200 hover:shadow-rose-500/20"
        }
    ];

    return (
        <div className="bg-[#f8fafc] overflow-hidden min-h-screen pt-24 pb-20">

            {/* Massive Ambient Background Overlay */}
            <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-primary-100/50 via-transparent to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Hero Module */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-24 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-8 font-bold text-xs uppercase tracking-widest shadow-sm">
                            <Activity className="h-4 w-4" />
                            <span>The DiagnoAI Manifesto</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                            Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Technology</span> & Human Health
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-6">
                            DiagnoAI was born from a singular, radical vision: making elite, clinical-grade healthcare guidance hyper-accessible to everyone, everywhere.
                        </p>
                        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-10">
                            We don't replace doctors. We strictly empower them. Our platform utilizes state-of-the-art neural networks to assess symptoms deeply—connecting patients cleanly to the right specialist instantly.
                        </p>

                        <Link to="/contact" className="group inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary-600 transition-colors shadow-xl shadow-slate-900/20 hover:shadow-primary-600/30">
                            Get in Touch <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Abstract Hero Image Module */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[3rem] shadow-2xl p-10 overflow-hidden flex items-center justify-center">
                            {/* Inner Glass Shapes */}
                            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-[30px]"></div>
                            <div className="absolute bottom-10 left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-[40px]"></div>

                            {/* Abstract Holographic UI */}
                            <div className="relative z-10 w-full max-w-sm">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                                    <div className="flex justify-between items-center mb-6">
                                        <Shield className="h-8 w-8 text-white" />
                                        <span className="bg-green-400/20 text-green-300 font-bold text-xs uppercase px-3 py-1 rounded-full">Secure</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                                        <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                                        <div className="h-2 w-full bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="mt-8 flex justify-between items-center">
                                        <Users className="h-6 w-6 text-white/50" />
                                        <div className="h-8 w-8 rounded-full border-2 border-white/30 bg-primary-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Core Pillars Grid */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The Core Tenets</h2>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                    >
                        {corePillars.map((pillar, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`bg-white rounded-3xl p-10 border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-300 transform hover:-translate-y-2 group ${pillar.borderColor}`}
                            >
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300 ${pillar.bg} group-hover:bg-slate-900`}>
                                    <pillar.icon className={`h-10 w-10 ${pillar.iconColor} group-hover:text-white transition-colors duration-300`} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-5">{pillar.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-lg">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default About;
