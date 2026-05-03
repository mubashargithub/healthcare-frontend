import React, { useState, useEffect, useMemo } from 'react';
import {
    Activity,
    History,
    TrendingUp,
    PlusCircle,
    ChevronRight,
    ShieldCheck,
    Calendar,
    Target,
    Bell,
    Video,
    MapPin,
    Pill,
    CheckCircle,
    Search
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/api';
import Loading from '../components/Loading';
import { formatDistanceToNow, format, subMonths } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentPredictions, setRecentPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('6');

    // Mock data for new features
    const upcomingConsultations = [
        { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: 'Tomorrow, 10:00 AM', type: 'Video' }
    ];

    const [medications, setMedications] = useState([
        { id: 1, name: 'Lisinopril', dosage: '20mg', time: 'After breakfast', taken: true },
        { id: 2, name: 'Vitamin D3', dosage: '1000 IU', time: 'With lunch', taken: false }
    ]);

    const handleToggleMedication = (id) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, taken: !med.taken } : med
        ));
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await dataService.getHistory();
                setRecentPredictions(res.data.data || []);
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Derived statistics
    const stats = useMemo(() => {
        if (!recentPredictions.length) return { healthStatus: 'No Data', avgConfidence: 0, lastCheckup: 'Never' };

        const validPredictions = recentPredictions.filter(p => typeof p.confidence === 'number');
        const avgConf = validPredictions.length > 0
            ? (validPredictions.reduce((acc, curr) => acc + curr.confidence, 0) / validPredictions.length).toFixed(1)
            : 0;

        const lastDate = new Date(recentPredictions[0].createdAt || recentPredictions[0].date);
        const lastCheckup = formatDistanceToNow(lastDate, { addSuffix: true });

        let healthStatus = 'Excellent';
        if (avgConf < 70) healthStatus = 'Review Needed';
        else if (avgConf < 85) healthStatus = 'Good';

        return { healthStatus, avgConfidence: avgConf, lastCheckup };
    }, [recentPredictions]);

    // Derived chart data
    const chartData = useMemo(() => {
        const monthsCount = parseInt(chartPeriod, 10);
        const labels = [];
        const data = [];

        for (let i = monthsCount - 1; i >= 0; i--) {
            const d = subMonths(new Date(), i);
            labels.push(format(d, 'MMM'));

            const monthPreds = recentPredictions.filter(p => {
                const pDate = new Date(p.createdAt || p.date);
                return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
            });

            if (monthPreds.length > 0) {
                const avg = monthPreds.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / monthPreds.length;
                data.push(Math.round(avg));
            } else {
                data.push(0);
            }
        }

        const isEmpty = data.every(v => v === 0);
        const finalData = isEmpty ? Array(monthsCount).fill(70) : data;

        return {
            labels,
            datasets: [
                {
                    label: isEmpty ? 'Health Score (No Data)' : 'Avg. Confidence Score',
                    data: finalData,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.4,
                },
            ],
        };
    }, [recentPredictions, chartPeriod]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, max: 100 },
        },
    };

    if (isLoading) return <Loading />;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mt-16 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'User'}!</h1>
                        <p className="text-gray-600 mt-1">Here's an overview of your real-time health analytics & command center.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate('/pharmacy-locator')}
                            className="btn-secondary flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors bg-white font-medium shadow-sm transition"
                        >
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Find Pharmacy</span>
                        </button>
                        <button
                            onClick={() => navigate('/symptom-check')}
                            className="btn-primary flex items-center justify-center space-x-2 py-3 px-6"
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span>New Symptom Check</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card flex items-center p-6">
                        <div className={`p-4 rounded-xl mr-4 ${stats.healthStatus === 'Excellent' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                            <ShieldCheck className={`h-8 w-8 ${stats.healthStatus === 'Excellent' ? 'text-green-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Health Status</p>
                            <h3 className="text-xl font-bold text-gray-900">{stats.healthStatus}</h3>
                        </div>
                    </div>
                    <div className="card flex items-center p-6">
                        <div className="bg-blue-50 p-4 rounded-xl mr-4">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Avg. Confidence</p>
                            <h3 className="text-xl font-bold text-gray-900">{stats.avgConfidence}%</h3>
                        </div>
                    </div>
                    <div className="card flex items-center p-6">
                        <div className="bg-purple-50 p-4 rounded-xl mr-4">
                            <Calendar className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Last Checkup</p>
                            <h3 className="text-xl font-bold text-gray-900 capitalize">{stats.lastCheckup}</h3>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Chart & Widgets */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chart Section */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Activity className="h-5 w-5 text-primary-600 mr-2" />
                                    Health Analytics
                                </h3>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none"
                                    value={chartPeriod}
                                    onChange={(e) => setChartPeriod(e.target.value)}
                                >
                                    <option value="6">Last 6 Months</option>
                                    <option value="12">Last 12 Months</option>
                                </select>
                            </div>
                            <div className="h-64">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Additional Widgets Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Upcoming Consultations */}
                            <div className="card p-6 border-t-4 border-t-indigo-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <Video className="h-5 w-5 text-indigo-500 mr-2" />
                                        Next Consultation
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {upcomingConsultations.map(consult => (
                                        <div key={consult.id} className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                                            <p className="font-bold text-gray-900">{consult.doctor}</p>
                                            <p className="text-xs text-indigo-600 font-semibold mb-2">{consult.specialty}</p>
                                            <div className="flex items-center text-sm mb-3">
                                                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-700">{consult.date}</span>
                                            </div>
                                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-md transition">
                                                Join virtual room
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Medication Reminders */}
                            <div className="card p-6 border-t-4 border-t-teal-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <Pill className="h-5 w-5 text-teal-500 mr-2" />
                                        Medications
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {medications.map(med => (
                                        <div key={med.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${med.taken ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-teal-100 shadow-sm'}`}>
                                            <div className="flex items-center cursor-pointer" onClick={() => handleToggleMedication(med.id)}>
                                                {med.taken ? (
                                                    <CheckCircle className="h-5 w-5 text-teal-500 mr-3 shrink-0" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-teal-500 mr-3 shrink-0"></div>
                                                )}
                                                <div>
                                                    <p className={`font-bold text-sm ${med.taken ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{med.name} - {med.dosage}</p>
                                                    <p className="text-xs text-gray-500">{med.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Goals Widget */}
                            <div className="card p-6 border-t-4 border-t-primary-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <Target className="h-5 w-5 text-primary-600 mr-2" />
                                        Health Checkup Goal
                                    </h3>
                                </div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-semibold text-gray-700">Checkups this month</span>
                                    <span className="text-primary-600 font-bold">{Math.min(recentPredictions.length, 3)}/3</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min((recentPredictions.length / 3) * 100, 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-500">Regular self-checks help track your health metrics accurately.</p>
                            </div>

                            {/* Notifications Widget */}
                            <div className="card p-6 border-t-4 border-t-yellow-400">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <Bell className="h-5 w-5 text-yellow-500 mr-2" />
                                        Alerts
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {stats.healthStatus === 'Review Needed' && (
                                        <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-md flex items-start">
                                            <span className="font-semibold mr-1">Alert:</span> Your recent average health confidence is low. Consider consulting a specialist.
                                        </div>
                                    )}
                                    {recentPredictions.length === 0 && (
                                        <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md">
                                            Welcome! Start your first symptom check to see insights.
                                        </div>
                                    )}
                                    {stats.healthStatus !== 'Review Needed' && recentPredictions.length > 0 && (
                                        <div className="bg-green-50 text-green-800 text-sm p-3 rounded-md flex items-start">
                                            <span className="font-semibold mr-1">Great Job!</span> You're maintaining a strong health profile this month.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - History Section */}
                    <div className="card h-fit sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <History className="h-5 w-5 text-primary-600 mr-2" />
                                Recent History
                            </h3>
                            <button onClick={() => navigate('/health-history')} className="text-primary-600 text-xs font-semibold hover:underline">View Full</button>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentPredictions.slice(0, 8).map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="font-bold text-gray-900 truncate">{item.predictedDisease}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.createdAt || item.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'Saved' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {item.status || 'Analyzed'}
                                        </span>
                                        <p className="text-xs font-semibold text-primary-600 mt-1">{item.confidence}%</p>
                                    </div>
                                </div>
                            ))}
                            {recentPredictions.length === 0 && (
                                <p className="text-center text-gray-500 py-8 text-sm">No recent history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
