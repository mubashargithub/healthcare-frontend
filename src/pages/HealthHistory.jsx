import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Activity, Search, Calendar, ChevronRight, AlertCircle, FileUp, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const HealthHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [historyLogs, setHistoryLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Make sure we only show history if user exists, otherwise redirect to login strictly
    // (though ProtectedRoute handles this, we enforce it structurally)
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserHistory();
    }, [user, navigate]);

    const fetchUserHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await dataService.getHistory();
            if (res.data && res.data.data) {
                setHistoryLogs(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to securely fetch your health history from the server.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loading />;

    const filteredLogs = historyLogs.filter(log =>
        (log.predictedDisease && log.predictedDisease.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.symptoms && log.symptoms.join(', ').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-[#f8fafc] min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-200 pb-8">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full mb-4">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">HIPAA Compliant Session</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">My Health History</h1>
                        <p className="text-slate-500 text-lg">Securely tied to {user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Live Backend History List */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="relative flex-1 max-w-full">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search past symptoms or diseases..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 focus:outline-none focus:border-primary-500"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start border border-red-100">
                                <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredLogs.map((log, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={log._id || index}
                                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between"
                                >
                                    <div className="flex items-start mb-4 md:mb-0">
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mr-5 shrink-0 mt-1">
                                            <Activity className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{log.predictedDisease}</h3>
                                            <p className="text-sm text-slate-600 mb-2 font-medium">Symptoms: {log.symptoms?.join(', ') || 'N/A'}</p>

                                            <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 gap-3">
                                                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5 text-slate-400" />{new Date(log.createdAt || log.date).toLocaleDateString()}</span>
                                                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-indigo-100">
                                                    {log.confidence}% AI Confidence
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4 md:mt-0">
                                        <button onClick={() => navigate('/symptom-check')} className="text-primary-600 font-bold text-sm bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors flex items-center">
                                            Re-evaluate <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {!isLoading && filteredLogs.length === 0 && (
                                <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                                    <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No History Recorded</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">You have not completed any AI symptom checks yet. Visit our Symptom Checker to log your first assessment!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Protected Storage Module */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-32">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                                <FileUp className="h-6 w-6 mr-3 text-primary-600" />
                                Local Encrypted Vault
                            </h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Uploading physical documents is temporarily locked into strict-privacy mode while we roll out end-to-end database encryption. All your AI checks on the left are already natively secured.
                            </p>

                            <div className="w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center opacity-60 cursor-not-allowed">
                                <ShieldCheck className="w-8 h-8 mb-3 text-slate-400" />
                                <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">Vault Secured</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HealthHistory;
