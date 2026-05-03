import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, AlertCircle, PlusCircle, CheckCircle, BellRing, Activity, Calendar, Clock, RotateCcw, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const PENDING = 'pending';
const TAKEN = 'taken';

const MedicationReminders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    // Active Reminders Local State
    const [reminders, setReminders] = useState([
        { id: 1, name: 'Vitamin D3', dosage: '5000 IU', time: '08:00', status: TAKEN, type: 'supplement' },
        { id: 2, name: 'Omega-3 Fish Oil', dosage: '1000 mg', time: '20:00', status: PENDING, type: 'supplement' }
    ]);
    const [newMeds, setNewMeds] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchDiagnosticHistory();
    }, [user, navigate]);

    const fetchDiagnosticHistory = async () => {
        setIsLoading(true);
        try {
            const res = await dataService.getHistory();
            if (res.data && res.data.data) {
                generateAiSchedules(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAiSchedules = (logs) => {
        if (!logs || logs.length === 0) return;

        const allDiseases = logs.map(log => log.predictedDisease || '').join(' ').toLowerCase();
        let suggestions = [];

        if (allDiseases.includes('cardio') || allDiseases.includes('heart')) {
            suggestions.push({
                condition: 'Cardiac Risk Profile',
                med: 'Review Aspirin / Beta-Blockers with Doctor',
                freq: 'Daily Morning',
                color: 'text-red-600',
                bg: 'bg-red-50',
                border: 'border-red-200'
            });
        }
        if (allDiseases.includes('derm') || allDiseases.includes('allergy') || allDiseases.includes('rash')) {
            suggestions.push({
                condition: 'Dermatological Response',
                med: 'Topical Ointment / Antihistamines',
                freq: 'As needed (Nightly)',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'border-amber-200'
            });
        }
        if (allDiseases.includes('neuro') || allDiseases.includes('migraine')) {
            suggestions.push({
                condition: 'Neurological Tension',
                med: 'NSAIDs / Prescribed Triptans',
                freq: 'Stat (At symptom onset)',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                border: 'border-purple-200'
            });
        }

        setAiSuggestions(suggestions.slice(0, 3));
    };

    const toggleStatus = (id) => {
        setReminders(reminders.map(r =>
            r.id === id ? { ...r, status: r.status === TAKEN ? PENDING : TAKEN } : r
        ));
    };

    const addReminder = (e) => {
        e.preventDefault();
        if (!newMeds.trim()) return;

        setReminders([
            ...reminders,
            { id: Date.now(), name: newMeds, dosage: 'Custom', time: '12:00', status: PENDING, type: 'custom' }
        ]);
        setNewMeds('');
    };

    const deleteReminder = (id) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    if (isLoading) return <Loading />;

    return (
        <div className="bg-[#f8fafc] min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Module */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl relative p-10 md:p-16">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="relative z-10 lg:w-2/3">
                        <div className="inline-flex items-center space-x-2 bg-blue-500/30 text-blue-100 px-4 py-1.5 rounded-full mb-6 border border-blue-400/30 backdrop-blur-md">
                            <BellRing className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Active Medication Protocol</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Med Reminders</span>
                        </h1>
                        <p className="text-lg text-blue-100/80 mb-0 max-w-xl leading-relaxed font-medium">
                            Manage your daily prescriptions seamlessly. Our engine actively cross-references your AI diagnostic health history to ensure no vital recovery therapies are forgotten.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Core Tracker */}
                    <div className="lg:col-span-2">

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center">
                                <Clock className="h-6 w-6 mr-3 text-primary-600" />
                                Today's Schedule
                            </h2>
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                        </div>

                        {/* Medications Form */}
                        <form onSubmit={addReminder} className="mb-8 relative flex shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                            <input
                                type="text"
                                value={newMeds}
                                onChange={(e) => setNewMeds(e.target.value)}
                                placeholder="Add new medication (e.g., Amoxicillin 500mg...)"
                                className="w-full py-4 px-6 outline-none text-slate-700 bg-transparent text-lg font-medium placeholder-slate-400"
                            />
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 transition-colors flex items-center justify-center shrink-0"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" /> Add
                            </button>
                        </form>

                        {/* Tracker Roster */}
                        <div className="space-y-4 mb-10">
                            <AnimatePresence>
                                {reminders.map((med, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={med.id}
                                        className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex items-center justify-between ${med.status === TAKEN ? 'border-green-200 bg-green-50/30 opacity-75' : 'border-slate-200 hover:border-primary-300 hover:shadow-md'}`}
                                    >
                                        <div className="flex items-center space-x-6">
                                            {/* Status Toggle Bubble */}
                                            <button
                                                onClick={() => toggleStatus(med.id)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border-2 shrink-0 ${med.status === TAKEN ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-50 border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-500'}`}
                                            >
                                                {med.status === TAKEN ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                            </button>

                                            <div>
                                                <h3 className={`font-bold text-lg mb-1 transition-colors ${med.status === TAKEN ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                    {med.name}
                                                </h3>
                                                <div className="flex items-center text-sm font-medium text-slate-500 space-x-4">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs">{med.dosage}</span>
                                                    <span className="flex items-center"><BellRing className="h-3 w-3 mr-1" />{med.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={() => deleteReminder(med.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {reminders.length === 0 && (
                                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                                    <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">All Clear!</h3>
                                    <p className="text-slate-500">No active medications scheduled for today.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: AI Integrations */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-32">
                            <div className="bg-slate-900 p-6 flex items-center">
                                <Activity className="h-6 w-6 text-primary-400 mr-3 shrink-0" />
                                <h3 className="text-lg font-bold text-white">AI Diagnostic Synthesis</h3>
                            </div>

                            <div className="p-6">
                                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                                    Based on your previously saved medical history, our AI framework securely flags therapeutic profiles you might need to schedule soon.
                                </p>

                                <div className="space-y-4">
                                    {aiSuggestions.length > 0 ? (
                                        aiSuggestions.map((sug, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                                key={idx}
                                                className={`p-4 rounded-2xl border ${sug.bg} ${sug.border}`}
                                            >
                                                <div className={`text-xs font-black uppercase tracking-wider mb-2 ${sug.color}`}>
                                                    {sug.condition}
                                                </div>
                                                <div className="font-bold text-slate-800 text-sm mb-1">{sug.med}</div>
                                                <div className="flex items-center text-xs font-medium text-slate-500">
                                                    <RotateCcw className="h-3 w-3 mr-1" /> {sug.freq}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                                            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-slate-900 mb-1">Insufficient Data</p>
                                            <p className="text-xs text-slate-500">Complete an AI symptom assessment to receive therapeutic reminders.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                                    <button onClick={() => navigate('/health-insights')} className="text-primary-600 font-bold text-sm bg-primary-50 hover:bg-primary-100 px-4 py-2.5 rounded-xl transition-colors inline-block">
                                        View Full Health Insights
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MedicationReminders;
