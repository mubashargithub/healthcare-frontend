import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    MapPin,
    Settings,
    Activity,
    Database,
    ArrowUpRight,
    Plus,
    Trash2,
    Shield,
    X,
    UserMinus,
    Search,
    Edit,
    Stethoscope,
    Hospital,
    SearchX
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService, dataService, activityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Fix for Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [searchQueries, setSearchQueries] = useState({
        users: '',
        doctors: '',
        pharmacies: '',
        admins: '',
        pharmacyCity: '',
        pharmacyName: '',
        activityTimeframe: 'all',
        activityCategory: 'all'
    });
    const [pharmacyPage, setPharmacyPage] = useState(1);
    const [pharmacyTotalPages, setPharmacyTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState([
        { name: 'Total Users', value: '0', change: '+0%', icon: <Users className="h-5 w-5" /> },
        { name: 'Total Doctors', value: '0', change: '+0%', icon: <Stethoscope className="h-5 w-5" /> },
        { name: 'Pharmacies', value: '0', change: '+0%', icon: <Hospital className="h-5 w-5" /> },
        { name: 'Admins', value: '0', change: '+0%', icon: <Shield className="h-5 w-5" /> },
    ]);

    const [usersList, setUsersList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [pharmaciesList, setPharmaciesList] = useState([]);
    const [adminsList, setAdminsList] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [activityStats, setActivityStats] = useState(null);

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [addUserFormData, setAddUserFormData] = useState({ name: '', email: '', password: '', city: '', specialization: '', experience: '' });
    const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
    const [mapZoom, setMapZoom] = useState(5);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const currentSearch = searchQueries[activeTab];
            const params = { search: currentSearch };
            
            if (activeTab === 'users') {
                const res = await adminService.getUsers(params);
                if (res.data.success) {
                    setUsersList(res.data.data);
                    updateStat(0, res.data.data.length.toString());
                }
            } else if (activeTab === 'doctors') {
                const res = await adminService.getDoctors(params);
                if (res.data.success) {
                    setDoctorsList(res.data.data);
                    updateStat(1, res.data.data.length.toString());
                }
            } else if (activeTab === 'pharmacies') {
                const params = {
                    search: searchQueries.pharmacies,
                    city: searchQueries.pharmacyCity,
                    name: searchQueries.pharmacyName,
                    page: pharmacyPage,
                    limit: 20
                };
                
                const res = await adminService.getPharmacies(params);
                if (res.data.success) {
                    setPharmaciesList(res.data.data);
                    setPharmacyTotalPages(res.data.pages || 1);
                    updateStat(2, (res.data.total || res.data.data.length).toString());
                    
                    // Update map to center on first result if exists
                    if (res.data.data.length > 0) {
                        const first = res.data.data[0];
                        if (first.lat && first.lon) {
                            setMapCenter([first.lat, first.lon]);
                            setMapZoom(12);
                        }
                    }
                }
            } else if (activeTab === 'admins' && user?.role === 'superadmin') {
                const res = await adminService.getAdmins();
                if (res.data.success) {
                    setAdminsList(res.data.data);
                    updateStat(3, res.data.data.length.toString());
                }
            } else if (activeTab === 'system_activity' && user?.role === 'superadmin') {
                const params = {
                    timeframe: searchQueries.activityTimeframe,
                    category: searchQueries.activityCategory
                };
                const res = await activityService.getActivities(params);
                const statsRes = await activityService.getActivityStats();
                if (res.data.success) {
                    setActivitiesList(res.data.data);
                }
                if (statsRes.data.success) {
                    setActivityStats(statsRes.data.data);
                }
            }
        } catch (err) {
            console.error(`Failed to load ${activeTab}:`, err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQueries, user]);

    const fetchAllStats = useCallback(async () => {
        try {
            const [usersRes, doctorsRes, pharmaciesRes, adminsRes] = await Promise.all([
                adminService.getUsers(),
                adminService.getDoctors(),
                adminService.getPharmacies({ limit: 1 }),
                adminService.getAdmins()
            ]);

            setStats(prev => [
                { ...prev[0], value: (usersRes.data.count || usersRes.data.data?.length || 0).toString() },
                { ...prev[1], value: (doctorsRes.data.count || doctorsRes.data.data?.length || 0).toString() },
                { ...prev[2], value: (pharmaciesRes.data.total || pharmaciesRes.data.data?.length || 0).toString() },
                { ...prev[3], value: (adminsRes.data.count || adminsRes.data.data?.length || 0).toString() }
            ]);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }, []);

    useEffect(() => {
        fetchAllStats();
    }, [fetchAllStats]);

    const updateStat = (index, value) => {
        setStats(prev => {
            const newStats = [...prev];
            newStats[index].value = value;
            return newStats;
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchData]);

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                let res;
                if (type === 'user') res = await adminService.deleteUser(id);
                else if (type === 'doctor') res = await adminService.deleteDoctor(id);
                else if (type === 'pharmacy') res = await adminService.deletePharmacy(id);
                else if (type === 'admin') res = await adminService.deleteAdmin(id);

                if (res.data.success) {
                    fetchData();
                }
            } catch (err) {
                alert(`Failed to delete ${type}.`);
            }
        }
    };

    const handleEditClick = (item, type) => {
        setEditingItem({ ...item, type });
        setFormData(item);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            const { type, _id } = editingItem;
            if (type === 'user') res = await adminService.updateUser(_id, formData);
            else if (type === 'doctor') res = await adminService.updateDoctor(_id, formData);
            else if (type === 'pharmacy') res = await adminService.updatePharmacy(_id, formData);

            if (res.data.success) {
                setShowEditModal(false);
                fetchData();
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
            }
        } catch (err) {
            alert(err.response?.data?.error || "Error updating record");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (activeTab === 'admins') {
                res = await adminService.createAdmin(addUserFormData);
            } else if (activeTab === 'doctors') {
                res = await adminService.createDoctor(addUserFormData);
            } else {
                res = await adminService.createUser(addUserFormData);
            }
            if (res?.data?.success) {
                setShowAddModal(false);
                setAddUserFormData({ name: '', email: '', password: '', city: '', specialization: '', experience: '' });
                fetchData();
                const typeName = activeTab === 'admins' ? 'Admin' : (activeTab === 'doctors' ? 'Doctor' : 'User');
                alert(`${typeName} created successfully!`);
            }
        } catch (err) {
            const typeName = activeTab === 'admins' ? 'admin' : (activeTab === 'doctors' ? 'doctor' : 'user');
            alert(err.response?.data?.error || `Error adding ${typeName}`);
        }
    };

    const handlePromoteUser = async (id) => {
        if (window.confirm("Promote to Admin? They will be moved to the admins collection.")) {
            try {
                const res = await adminService.promoteUser(id);
                if (res.data.success) {
                    fetchData();
                    alert("User promoted successfully!");
                }
            } catch (err) {
                alert(err.response?.data?.error || "Failed to promote user.");
            }
        }
    };

    const handleDownloadReport = () => {
        if (activitiesList.length === 0) return;
        
        const headers = ["Date", "User", "Type", "Details"];
        const rows = activitiesList.map(act => [
            new Date(act.createdAt).toLocaleString(),
            act.userName || 'Anonymous',
            act.type,
            act.type === 'prediction' ? act.details.prediction?.disease : 
            act.type === 'doctor_booking' ? act.details.doctor?.name : 
            act.details.pharmacy?.name
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `DiagnoAI_System_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const handleShareReport = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DiagnoAI System Activity Report',
                text: `Current System Load: ${activitiesList.length} recent interactions monitored.`,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert("Sharing is not supported on this browser. Use the Download button instead.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Super Admin Suite</h1>
                        <p className="text-gray-600 mt-1">Full system control, dynamic search, and geospatial mapping.</p>
                        {user?.role === 'superadmin' && <span className="inline-block mt-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded shadow-sm font-bold border border-purple-200 uppercase tracking-widest">Master Authority</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {activeTab === 'system_activity' && (
                            <>
                                <button
                                    onClick={handleShareReport}
                                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center hover:bg-indigo-100 transition-colors border border-indigo-100"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={handleDownloadReport}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-emerald-700 transition-colors shadow-md"
                                >
                                    Download CSV
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-primary-700 transition-colors shadow-md"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                                    {stat.icon}
                                </div>
                                <span className="text-green-500 text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 space-x-8 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'users', label: 'Users', icon: <Users className="h-4 w-4 mr-2" /> },
                        { id: 'doctors', label: 'Doctors', icon: <Stethoscope className="h-4 w-4 mr-2" /> },
                        { id: 'pharmacies', label: 'Pharmacies', icon: <Hospital className="h-4 w-4 mr-2" /> },
                        { id: 'system_activity', label: 'System History', icon: <Activity className="h-4 w-4 mr-2" />, superOnly: true },
                        { id: 'admins', label: 'Admin Access', icon: <Shield className="h-4 w-4 mr-2" />, superOnly: true }
                    ].map(tab => (
                        (!tab.superOnly || user?.role === 'superadmin') && (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                                    activeTab === tab.id 
                                    ? 'text-primary-600 border-primary-600' 
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        )
                    ))}
                </div>

                {/* Data Tables Control Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab} Management</h2>
                        {activeTab === 'pharmacies' && (
                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-black border border-emerald-200 shadow-sm">
                                DATABASE RECORDS
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        {activeTab === 'pharmacies' && (
                            <>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text"
                                        placeholder="City..."
                                        value={searchQueries.pharmacyCity}
                                        onChange={(e) => setSearchQueries({ ...searchQueries, pharmacyCity: e.target.value })}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all w-full md:w-40 shadow-sm text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text"
                                        placeholder="Pharmacy Name..."
                                        value={searchQueries.pharmacyName}
                                        onChange={(e) => setSearchQueries({ ...searchQueries, pharmacyName: e.target.value })}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all w-full md:w-48 shadow-sm text-sm"
                                    />
                                </div>
                            </>
                        )}
                        {activeTab === 'system_activity' && (
                            <>
                                <select 
                                    value={searchQueries.activityTimeframe}
                                    onChange={(e) => setSearchQueries({ ...searchQueries, activityTimeframe: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all w-full md:w-auto shadow-sm text-sm"
                                >
                                    <option value="all">All Time</option>
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                <select 
                                    value={searchQueries.activityCategory}
                                    onChange={(e) => setSearchQueries({ ...searchQueries, activityCategory: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all w-full md:w-auto shadow-sm text-sm"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="user_registered">Users Registered</option>
                                    <option value="prediction">Access Services (Prediction)</option>
                                    <option value="doctor_booking">Doctor Interactions</option>
                                </select>
                            </>
                        )}
                        {(activeTab === 'users' || activeTab === 'admins' || activeTab === 'doctors') && user?.role === 'superadmin' && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-xl font-bold flex items-center hover:bg-primary-700 transition-colors shadow-sm text-sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {activeTab === 'admins' ? 'Add Admin' : (activeTab === 'doctors' ? 'Add Doctor' : 'Add User')}
                            </button>
                        )}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder={`Global filter...`}
                                value={searchQueries[activeTab]}
                                onChange={(e) => setSearchQueries({ ...searchQueries, [activeTab]: e.target.value })}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all w-full md:w-60 shadow-sm text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Data Tables */}
                {activeTab === 'system_activity' && activityStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Interaction Types</h4>
                            <div className="h-48">
                                <Doughnut 
                                    data={{
                                        labels: activityStats.types.map(t => t._id.replace('_', ' ')),
                                        datasets: [{
                                            data: activityStats.types.map(t => t.count),
                                            backgroundColor: ['#9333ea', '#2563eb', '#10b981'],
                                            borderWidth: 0
                                        }]
                                    }}
                                    options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Daily Activity Trends</h4>
                            <div className="h-48">
                                <Line 
                                    data={{
                                        labels: activityStats.daily.map(d => d._id),
                                        datasets: [{
                                            label: 'Events',
                                            data: activityStats.daily.map(d => d.count),
                                            borderColor: '#2563eb',
                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                            fill: true,
                                            tension: 0.4
                                        }]
                                    }}
                                    options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                            <p className="text-gray-500 mt-4 font-medium italic">Synchronizing with Database...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Entity Info</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location/City</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {activeTab === 'users' && usersList.map(u => (
                                        <tr key={u._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black border-2 border-white shadow-sm">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{u.name}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700">USER</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.city || 'Not Provided'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => handleEditClick(u, 'user')} className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handlePromoteUser(u._id)} className="text-gray-400 hover:text-green-600 transition-colors p-1"><Shield className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(u._id, 'user')} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'doctors' && doctorsList.map(d => (
                                        <tr key={d._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black border-2 border-white shadow-sm">
                                                        D
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{d.name}</div>
                                                        <div className="text-xs text-gray-500">{d.specialization}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-xs font-bold text-yellow-600">
                                                    <Activity className="h-3 w-3 mr-1" /> {d.experience} Years Exp.
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {d.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(d.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => handleEditClick(d, 'doctor')} className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(d._id, 'doctor')} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'pharmacies' && pharmaciesList.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black border-2 border-white shadow-sm">
                                                        P
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                                        <div className="text-xs text-gray-500 max-w-xs truncate">{p.address}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${p.isOpen24Hours ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {p.isOpen24Hours ? '24/7' : 'Standard'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {p.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button 
                                                    onClick={() => {
                                                        setMapCenter([p.lat, p.lon]);
                                                        setMapZoom(16);
                                                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                                    }} 
                                                    className="text-gray-400 hover:text-emerald-600 transition-colors p-1"
                                                    title="Locate on Map"
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                </button>
                                                {!p.isFromMap && (
                                                    <>
                                                        <button onClick={() => handleEditClick(p, 'pharmacy')} className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                                                        <button onClick={() => handleDelete(p._id, 'pharmacy')} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'system_activity' && activitiesList.map(act => (
                                        <tr key={act._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${
                                                        act.type === 'prediction' ? 'bg-purple-600' :
                                                        act.type === 'doctor_booking' ? 'bg-blue-600' : 
                                                        act.type === 'user_registered' ? 'bg-orange-500' : 'bg-emerald-600'
                                                    }`}>
                                                        {act.type === 'user_registered' ? 'U' : act.type.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-bold text-slate-900">{act.userName || 'Anonymous'}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{act.type.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {act.type === 'prediction' && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-purple-700">Disease:</span> {act.details.prediction?.disease}
                                                        <div className="text-slate-400 mt-1 italic">Conf: {act.details.prediction?.confidence}%</div>
                                                    </div>
                                                )}
                                                {act.type === 'doctor_booking' && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-blue-700">Doctor:</span> {act.details.doctor?.name}
                                                        <div className="text-slate-400 mt-1">{act.details.doctor?.specialization}</div>
                                                    </div>
                                                )}
                                                {act.type === 'pharmacy_interaction' && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-emerald-700">Pharmacy:</span> {act.details.pharmacy?.name}
                                                        <div className="text-slate-400 mt-1 truncate max-w-xs">{act.details.pharmacy?.address}</div>
                                                    </div>
                                                )}
                                                {act.type === 'user_registered' && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-orange-700">Email:</span> {act.details.email}
                                                        <div className="text-slate-400 mt-1">Platform Registration</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                System Event
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                                                {new Date(act.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'admins' && adminsList.map(a => (
                                        <tr key={a._id} className="hover:bg-purple-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black border-2 border-white shadow-sm">
                                                        {a.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{a.name}</div>
                                                        <div className="text-xs text-gray-500">{a.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-bold rounded-md bg-purple-100 text-purple-700">ADMIN</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                                                System Level Access
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(a.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {a.role !== 'superadmin' && (
                                                    <button onClick={() => handleDelete(a._id, 'admin')} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {((activeTab === 'users' && usersList.length === 0) || 
                                      (activeTab === 'doctors' && doctorsList.length === 0) || 
                                      (activeTab === 'pharmacies' && pharmaciesList.length === 0) || 
                                      (activeTab === 'system_activity' && activitiesList.length === 0) || 
                                      (activeTab === 'admins' && adminsList.length === 0)) && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <SearchX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 font-medium">No results found for "{searchQueries[activeTab]}"</p>
                                                <button onClick={() => setSearchQueries({ ...searchQueries, [activeTab]: '' })} className="text-primary-600 font-bold mt-2 hover:underline">Clear Search</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination for Pharmacies */}
                {activeTab === 'pharmacies' && pharmacyTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">
                            Page <span className="font-bold">{pharmacyPage}</span> of <span className="font-bold">{pharmacyTotalPages}</span>
                        </p>
                        <div className="flex space-x-2">
                            <button
                                disabled={pharmacyPage === 1}
                                onClick={() => setPharmacyPage(prev => prev - 1)}
                                className="px-4 py-2 text-sm font-bold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pharmacyPage === pharmacyTotalPages}
                                onClick={() => setPharmacyPage(prev => prev + 1)}
                                className="px-4 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Geospatial Section for Pharmacies */}
                {activeTab === 'pharmacies' && pharmaciesList.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                            Dynamic Pharmacy Distribution (Leaflet)
                        </h3>
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px] z-10">
                            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', borderRadius: '1rem' }} zoomControl={false}>
                                <ChangeView center={mapCenter} zoom={mapZoom} />
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                {pharmaciesList.map(p => (
                                    <Marker key={p._id} position={p.isFromMap ? [p.lat, p.lon] : [p.location.coordinates[1], p.location.coordinates[0]]}>
                                        <Popup>
                                            <div className="font-sans">
                                                <h4 className="font-bold text-gray-900">{p.name}</h4>
                                                <p className="text-xs text-gray-600 mt-1">{p.address}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className={`text-[10px] px-1 rounded ${p.isOpen24Hours ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {p.isOpen24Hours ? 'Open 24/7' : 'Standard Hours'}
                                                    </span>
                                                    <a 
                                                        href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 text-[10px] font-bold"
                                                    >
                                                        Open Navigation
                                                    </a>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Edit className="h-6 w-6 mr-2 text-primary-600" />
                                Edit {editingItem?.type.charAt(0).toUpperCase() + editingItem?.type.slice(1)}
                            </h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name || ''} 
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                />
                            </div>
                            
                            {editingItem?.type === 'user' && (
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">City</label>
                                    <input 
                                        type="text" 
                                        value={formData.city || ''} 
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                    />
                                </div>
                            )}

                            {editingItem?.type === 'doctor' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Specialization</label>
                                        <input 
                                            type="text" 
                                            value={formData.specialization || ''} 
                                            onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Experience (Years)</label>
                                        <input 
                                            type="number" 
                                            value={formData.experience || 0} 
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                </>
                            )}

                            {editingItem?.type === 'pharmacy' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Address</label>
                                        <input 
                                            type="text" 
                                            value={formData.address || ''} 
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3 py-2">
                                        <input 
                                            type="checkbox" 
                                            id="open24"
                                            checked={formData.isOpen24Hours || false} 
                                            onChange={e => setFormData({ ...formData, isOpen24Hours: e.target.checked })}
                                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500" 
                                        />
                                        <label htmlFor="open24" className="text-sm font-bold text-gray-700">Open 24 Hours</label>
                                    </div>
                                </>
                            )}

                            <div className="pt-4 flex space-x-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all"
                                >
                                    Save Updates
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Plus className="h-6 w-6 mr-2 text-primary-600" />
                                {activeTab === 'admins' ? 'Add New Admin' : (activeTab === 'doctors' ? 'Add New Doctor' : 'Add New User')}
                            </h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={addUserFormData.name} 
                                    onChange={e => setAddUserFormData({ ...addUserFormData, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                />
                            </div>
                            {(activeTab === 'users' || activeTab === 'admins') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            required 
                                            value={addUserFormData.email} 
                                            onChange={e => setAddUserFormData({ ...addUserFormData, email: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Password</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={addUserFormData.password} 
                                            onChange={e => setAddUserFormData({ ...addUserFormData, password: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                </>
                            )}
                            {activeTab === 'doctors' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Specialization</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={addUserFormData.specialization} 
                                            onChange={e => setAddUserFormData({ ...addUserFormData, specialization: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Experience (Years)</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="0"
                                            value={addUserFormData.experience} 
                                            onChange={e => setAddUserFormData({ ...addUserFormData, experience: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">City</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={addUserFormData.city} 
                                    onChange={e => setAddUserFormData({ ...addUserFormData, city: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all"
                                >
                                    {activeTab === 'admins' ? 'Create Admin' : (activeTab === 'doctors' ? 'Create Doctor' : 'Create User')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
