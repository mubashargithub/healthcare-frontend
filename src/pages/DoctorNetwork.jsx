import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Network, BrainCircuit, Activity, Stethoscope, ArrowRight, CheckCircle, Clock, ShieldCheck, Users, Search, MapPin, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService, activityService } from '../services/api';

const DoctorNetwork = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [searchQuery, setSearchQuery] = useState('');
    const [cityQuery, setCityQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isCityFocused, setIsCityFocused] = useState(false);
    const [popularDoctors, setPopularDoctors] = useState([]);
    
    const searchRef = React.useRef(null);
    const cityRef = React.useRef(null);
    
    useEffect(() => {
        const fetchPopularDoctors = async () => {
            try {
                const res = await activityService.getPopularDoctors();
                if (res.data.success && res.data.data.length > 0) {
                    setPopularDoctors(res.data.data);
                } else {
                    // Fallback to placeholders if no activity data
                    setPopularDoctors([
                        { name: "Dr. Sarah Jenkins", specialization: "Dermatology", bookingCount: 124 },
                        { name: "Dr. Marcus Chen", specialization: "Cardiology", bookingCount: 98 },
                        { name: "Dr. Emily Rostova", specialization: "Neurology", bookingCount: 86 }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch popular doctors", error);
            }
        };

        fetchPopularDoctors();

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setIsCityFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const specialtiesList = [
        'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon', 
        'Pediatrician', 'General Physician', 'Psychiatrist', 'Oncologist', 
        'Gastroenterologist', 'Endocrinologist', 'ENT Specialist', 'Gynecologist',
        'Urologist', 'Ophthalmologist', 'Dentist', 'Pulmonologist'
    ];

    const citiesList = [
        'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
        'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
        'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur',
        'Jhelum', 'Sheikhupura', 'Larkana', 'Gujrat', 'Mardan', 'Kasur', 'Rahim Yar Khan'
    ];

    const filteredSuggestions = specialtiesList.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    const filteredCitySuggestions = citiesList.filter(c => 
        c.toLowerCase().includes(cityQuery.toLowerCase())
    ).slice(0, 5);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() && !cityQuery.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        try {
            const res = await dataService.getAllDoctors({ limit: 1000 });
            if (res.data.success) {
                const allDocs = res.data.data;
                const filtered = allDocs.filter(doc => {
                    const matchesQuery = !searchQuery.trim() || 
                        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    const matchesCity = !cityQuery.trim() || 
                        doc.city?.toLowerCase().includes(cityQuery.toLowerCase());
                    
                    return matchesQuery && matchesCity;
                });
                setDoctors(filtered);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const steps = [
        {
            icon: Activity,
            title: "Symptom Analysis",
            description: "Input your symptoms and let our core AI engine analyze your condition against millions of clinical data points."
        },
        {
            icon: BrainCircuit,
            title: "Neural Matching",
            description: "Our algorithm matches your specific diagnostic needs with the precise expertise of doctors in our global network."
        },
        {
            icon: Network,
            title: "Smart Connection",
            description: "Get instantly paired with a verified specialist who is best equipped to handle your unique health profile."
        },
        {
            icon: Stethoscope,
            title: "Direct Consultation",
            description: "Book an appointment or initiate a direct chat with your matched specialist seamlessly through our platform."
        }
    ];

    const stats = [
        { label: 'Verified Specialists', value: '2,500+' },
        { label: 'Match Accuracy', value: '98.5%' },
        { label: 'Avg Connection Time', value: '< 2 mins' },
        { label: 'Active Regions', value: '45+' }
    ];

    return (
        <div className="bg-[#f8fafc] overflow-x-hidden min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-primary-900/20"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center space-x-2 bg-primary-500/20 border border-primary-500/30 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm">
                            <Network className="h-5 w-5 text-primary-400" />
                            <span className="text-primary-100 text-sm font-bold uppercase tracking-widest">Intelligent Healthcare Routing</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Specialist Matching</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
                            Don't guess what doctor you need. Our neural network analyzes your symptoms and perfectly matches you with the right verified expert in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button 
                                onClick={() => {
                                    document.getElementById('search-specialist')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-primary-600 font-bold text-white px-10 py-5 rounded-2xl text-lg hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/30 flex items-center group active:scale-95"
                            >
                                Try AI Matching Now
                                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link to="/about" className="bg-white/10 font-bold text-white px-10 py-5 rounded-2xl text-lg hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm">
                                Explore Our Network
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 flex flex-wrap justify-between items-center gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex-1 min-w-[150px] text-center md:text-left">
                            <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Search Section */}
            <section id="search-specialist" className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Find Your Specialist</h2>
                        <p className="text-slate-500 text-lg md:text-xl mb-8">
                            Search our network by specialty (e.g., Cardiologist, General Physician) or doctor name.
                        </p>
                        
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-4">
                            <div className="relative" ref={searchRef}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                    <Search className="h-6 w-6 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-lg shadow-sm relative z-10"
                                    placeholder="Search by Specialization or Name..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsFocused(true);
                                    }}
                                    onFocus={() => setIsFocused(true)}
                                />
                                
                                {/* Specialization Suggestions Dropdown */}
                                {isFocused && searchQuery && filteredSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-30">
                                        {filteredSuggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-slate-700 font-medium flex items-center"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setSearchQuery(s);
                                                    setIsFocused(false);
                                                }}
                                            >
                                                <Search className="h-4 w-4 mr-3 text-slate-400" />
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={cityRef}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                    <MapPin className="h-6 w-6 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-lg shadow-sm relative z-10"
                                    placeholder="Enter City (e.g., Karachi, Lahore)..."
                                    value={cityQuery}
                                    onChange={(e) => {
                                        setCityQuery(e.target.value);
                                        setIsCityFocused(true);
                                    }}
                                    onFocus={() => setIsCityFocused(true)}
                                />
                                
                                {/* City Suggestions Dropdown */}
                                {isCityFocused && cityQuery && filteredCitySuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-30">
                                        {filteredCitySuggestions.map((c, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-slate-700 font-medium flex items-center"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setCityQuery(c);
                                                    setIsCityFocused(false);
                                                }}
                                            >
                                                <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="w-full md:w-auto px-12 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-70 flex items-center justify-center text-lg active:scale-95"
                                >
                                    {isSearching ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            Find Specialist
                                            <Search className="ml-3 h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Search Results */}
                    {hasSearched && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                                {doctors.length > 0 ? `Found ${doctors.length} Specialist${doctors.length > 1 ? 's' : ''}` : "No Specialists Found"}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {doctors.map((doctor, index) => (
                                    <motion.div
                                        key={doctor._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-primary-200 hover:-translate-y-1 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h4>
                                                <div className="inline-flex items-center space-x-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-bold mb-3">
                                                    <BrainCircuit className="h-4 w-4 mr-1" />
                                                    {doctor.specialization}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg font-bold text-sm">
                                                <Star className="h-4 w-4 fill-amber-500" />
                                                <span>{doctor.rating || '4.8'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-slate-500 text-sm">
                                                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                                                {doctor.city}, {doctor.country || 'Pakistan'}
                                            </div>
                                            <div className="flex items-center text-slate-500 text-sm">
                                                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                                                {doctor.experience} Years Experience
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => {
                                                // Log activity
                                                activityService.logActivity({
                                                    type: 'doctor_booking',
                                                    details: {
                                                        doctor: {
                                                            id: (doctor._id || index).toString(),
                                                            name: doctor.name,
                                                            specialization: doctor.specialization
                                                        }
                                                    }
                                                }).catch(err => console.error("Logging failed:", err));

                                                const phone = doctor.contact?.phone;
                                                if (phone) {
                                                    window.location.href = `tel:${phone}`;
                                                } else {
                                                    alert('Contact number is currently unavailable for this specialist.');
                                                }
                                            }}
                                            className="w-full py-3 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white font-bold rounded-xl transition-colors border border-primary-100"
                                        >
                                            Book Appointment
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 md:py-32 bg-[#f8fafc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">How Our Engine Works</h2>
                        <p className="text-slate-500 text-lg md:text-xl">
                            We combine deep clinical data with intelligent node-mapping to bridge the gap between patient uncertainty and specialized medical care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-primary-200 hover:-translate-y-2 transition-all duration-300 relative group"
                            >
                                <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 group-hover:text-primary-50 transition-colors pointer-events-none">
                                    0{idx + 1}
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 relative z-10 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-400">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed relative z-10">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Assurance Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Elite Professionals, <br /><span className="text-primary-600">Verified Protocol.</span></h2>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                Every professional in our network undergoes a rigorous vetting process. We ensure high-quality care metrics so that when the AI matches you, you are guaranteed premium medical attention.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    { icon: ShieldCheck, text: "HIPAA-Compliant & Secure Referrals" },
                                    { icon: Users, text: "Collaborative Doctor Portal for Complex Cases" },
                                    { icon: CheckCircle, text: "Strict Medical Board Verification" },
                                    { icon: Clock, text: "Priority Booking & Reduced Wait Times" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-700 font-medium">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-4 text-green-600 shrink-0">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-slate-900 rounded-[3rem] p-10 md:p-14 relative shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent rounded-[3rem]"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Live Network Status</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-8">Popular Specialists</h3>

                                <div className="space-y-4">
                                    {popularDoctors.map((doc, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                                            <div>
                                                <div className="text-slate-300 text-sm mb-1">
                                                    {doc.bookingCount ? `${doc.bookingCount}+ Consultations` : 'High Success Rate'}
                                                </div>
                                                <div className="text-white font-bold">{doc.name}</div>
                                            </div>
                                            <div className="bg-primary-600/30 text-primary-200 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                {doc.specialization}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#f8fafc]">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary-600/30">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">Ready to find the right specialist?</h2>
                        <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 relative z-10">
                            Stop the guesswork. Use our advanced symptom checker to get an AI diagnosis and a direct link to the best doctors in our network.
                        </p>
                        <div className="flex justify-center relative z-10">
                            <Link to="/symptom-check" className="bg-white text-primary-600 px-10 py-5 rounded-2xl font-black text-lg transition-transform hover:scale-105 shadow-xl flex items-center">
                                Start Diagnostic AI
                                <Activity className="ml-3 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DoctorNetwork;
