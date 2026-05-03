import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, HeartPulse, Brain, Droplets, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const HealthInsights = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [personalizedTips, setPersonalizedTips] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [user, navigate]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const res = await dataService.getHistory();
            if (res.data && res.data.data) {
                const logs = res.data.data;
                setHistory(logs);
                generateInsights(logs);
            }
        } catch (err) {
            console.error('Error fetching data for insights:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Advanced dynamic rule engine mapping user history to personalized tips
    const generateInsights = (logs) => {
        const defaultTips = [
            {
                title: 'Hydration Baseline',
                desc: 'Drink at least 2 liters of water daily to maintain cellular function. Consider structured water breaks matching your sleep cycle.',
                icon: Droplets,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                border: 'border-blue-100'
            },
            {
                title: 'Neuro-Cognitive Rest',
                desc: 'Maintain a rigid 7-9 hours of uninterrupted screen-free sleep to ensure optimal neuro-plasticity and stress-hormone reduction.',
                icon: Brain,
                color: 'text-purple-500',
                bg: 'bg-purple-50',
                border: 'border-purple-100'
            }
        ];

        if (!logs || logs.length === 0) {
            setPersonalizedTips(defaultTips);
            return;
        }

        const tips = [...defaultTips];
        const allSymptoms = logs.flatMap(log => log.symptoms || []).join(' ').toLowerCase();
        const allDiseases = logs.map(log => log.predictedDisease || '').join(' ').toLowerCase();

        // Dynamically append advice based on matched keywords in history
        if (allSymptoms.includes('pain') || allSymptoms.includes('ache')) {
            tips.unshift({
                title: 'Pain Management Protocol',
                desc: 'Your history indicates recurring pain metrics. Incorporate daily anti-inflammatory turmeric diets and strictly limit pro-inflammatory refined sugars.',
                icon: Activity,
                color: 'text-rose-500',
                bg: 'bg-rose-50',
                border: 'border-rose-100'
            });
        }
        if (allDiseases.includes('cardio') || allSymptoms.includes('chest')) {
            tips.unshift({
                title: 'Cardiovascular Fortification',
                desc: 'Based on your diagnostic history, prioritize 150 minutes of Zone-2 cardio weekly to build endothelial resilience and vascular health.',
                icon: HeartPulse,
                color: 'text-red-500',
                bg: 'bg-red-50',
                border: 'border-red-100'
            });
        }
        if (allDiseases.includes('derm') || allSymptoms.includes('rash') || allSymptoms.includes('skin')) {
            tips.unshift({
                title: 'Dermatological Care',
                desc: 'Your previous scans flag skin concerns. Use non-comedogenic SPF 50 daily and ensure your hydration targets exceed standard baselines to repair the skin barrier.',
                icon: ShieldCheck,
                color: 'text-amber-500',
                bg: 'bg-amber-50',
                border: 'border-amber-100'
            });
        }

        setPersonalizedTips(tips.slice(0, 4)); // cap to top 4 most relevant insights
    };

    if (isLoading) return <Loading />;

    return (
        <div className="bg-[#f8fafc] min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Module */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden mb-12 shadow-2xl relative p-8 md:p-16">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                    <div className="relative z-10 lg:w-2/3">
                        <div className="inline-flex items-center space-x-2 bg-primary-500/20 text-primary-300 px-4 py-1.5 rounded-full mb-6 border border-primary-500/30">
                            <Lightbulb className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI Analysis Protocol Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">Health Insights</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                            We've scanned your entire AI diagnostic history. Explore these hyper-tailored, proactive health strategies engineered specifically for your body's recent patterns.
                        </p>
                    </div>
                </div>

                {/* Intelligent Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {personalizedTips.map((tip, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx}
                            className={`bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] ${tip.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none`}></div>

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${tip.bg} ${tip.border} ${tip.color}`}>
                                    <tip.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                                    {tip.title}
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                    {tip.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Analysis Breakdown Box */}
                {history.length > 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900">Data Source Confirmed</h4>
                            <p className="text-slate-500">Insights formulated analyzing your last {history.length} logged AI prediction(s).</p>
                        </div>
                        <button onClick={() => navigate('/health-history')} className="text-primary-600 font-bold hover:underline flex items-center">
                            Review History <ChevronRight className="h-5 w-5 ml-1" />
                        </button>
                    </div>
                ) : (
                    <div className="bg-primary-50 rounded-3xl shadow-sm border border-primary-100 p-8 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-primary-900 mb-1">We need more data on you!</h4>
                            <p className="text-primary-700">These are general metrics. Complete a symptom check to let our AI tailor these exclusively for you.</p>
                        </div>
                        <button onClick={() => navigate('/symptom-check')} className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-primary-600/20">
                            Run AI Check
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthInsights;
