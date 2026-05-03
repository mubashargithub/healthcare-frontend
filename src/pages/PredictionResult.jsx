import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    User,
    MapPin,
    Phone,
    Star,
    ExternalLink,
    ChevronRight,
    Clipboard,
    ShieldAlert
} from 'lucide-react';

import { dataService, aiService, activityService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('doctors');
    const [recommendedDoctors, setRecommendedDoctors] = useState([]);
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [notification, setNotification] = useState(null);

    const predictionData = location.state?.prediction;
    const prediction = predictionData?.prediction || predictionData;
    const initialRecommendations = predictionData?.recommendations;

    useEffect(() => {
        const fetchRecommendations = async () => {
            // Priority 1: Use provided recommendations if they exist
            if (initialRecommendations) {
                setRecommendedDoctors(initialRecommendations.doctors || []);
                setNearbyPharmacies(initialRecommendations.pharmacies || []);
                setIsLoading(false);
                
                // Log prediction activity
                activityService.logActivity({
                    type: 'prediction',
                    userName: user?.name || 'Guest User',
                    details: {
                        prediction: {
                            disease: prediction.predictedDisease,
                            confidence: prediction.confidence,
                            symptoms: prediction.symptoms || []
                        }
                    }
                }).catch(err => console.error("Auto-logging failed:", err));

                return;
            }

            if (!prediction) return;
            setIsLoading(true);
            try {
                // Priority 2: Fetch specialists without city filtering as requested
                // We don't pass the city anymore to show specialists regardless of location
                const docRes = await dataService.getDoctors({
                    disease: prediction.predictedDisease
                });
                setRecommendedDoctors(docRes.data.data);

                // For pharmacies, we still want nearby ones
                const pharmRes = await dataService.getPharmacies({ city: user?.city || 'Karachi' });
                setNearbyPharmacies(pharmRes.data.data);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [prediction, user, initialRecommendations]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async () => {
        if (!prediction || isSaved) return;

        setIsSaving(true);
        try {
            await aiService.savePrediction({
                predictedDisease: prediction.predictedDisease,
                symptoms: prediction.symptoms,
                description: prediction.description,
                precautions: prediction.precautions,
                confidence: prediction.confidence,
                city: prediction.city || user?.city || 'Karachi'
            });
            setIsSaved(true);
            showNotification('Prediction saved successfully to your history!');
        } catch (err) {
            console.error('Save failed:', err);
            showNotification('Failed to save record. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!prediction) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <ShieldAlert className="h-16 w-16 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">No symptoms analyzed</h2>
                <button onClick={() => navigate('/symptom-check')} className="mt-4 text-primary-600 font-bold hover:underline">
                    Go to Symptom Check
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-14 my-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Prediction Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-primary-600 px-6 py-8 md:px-8 md:py-10 text-white text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-primary-100 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">Analysis Complete</p>
                            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 leading-tight">Likely Disease: {prediction.predictedDisease}</h1>
                            <div className="flex items-center justify-center sm:justify-start space-x-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-bold">Confidence: {prediction.confidence}%</span>
                                <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isSaved}
                            className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold shadow-lg transition-all flex items-center text-sm md:text-base active:scale-95 ${isSaved
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-primary-600 hover:bg-gray-50'
                                }`}
                        >
                            {isSaving ? (
                                <div className="h-5 w-5 border-2 border-primary-600 border-t-white rounded-full animate-spin mr-2"></div>
                            ) : (
                                <Clipboard className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            )}
                            {isSaved ? 'Saved to History' : isSaving ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">About {prediction.predictedDisease}</h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {prediction.description}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Precautions</h3>
                                <ul className="space-y-3">
                                    {prediction.precautions?.map((p, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-sm md:text-base text-gray-600">
                                            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary-600 flex-shrink-0"></div>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="space-y-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'doctors'
                                ? 'border-b-4 border-primary-600 text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Specialist Recommendations
                        </button>
                        <button
                            onClick={() => setActiveTab('pharmacies')}
                            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'pharmacies'
                                ? 'border-b-4 border-primary-600 text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Nearby Pharmacies
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex justify-center">
                            <div className="h-10 w-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeTab === 'doctors' ? (
                                recommendedDoctors.length > 0 ? (
                                    recommendedDoctors.map((doc) => (
                                        <div key={doc.id || doc._id} className="card p-6 flex flex-col hover:shadow-lg transition-all group border-b-4 border-transparent hover:border-primary-600">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-primary-50 p-3 rounded-xl">
                                                    <User className="h-6 w-6 text-primary-600" />
                                                </div>
                                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
                                                    <Star className="h-3 w-3 mr-1 fill-yellow-400 border-none" />
                                                    {doc.rating}
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{doc.name}</h4>
                                            <p className="text-primary-600 text-sm font-semibold mb-4">{doc.specialization}</p>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center text-gray-500 text-xs overflow-hidden">
                                                    <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{doc.city || 'Nearby'}, Pakistan</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-xs overflow-hidden text-nowrap">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                                    {typeof doc.contact === 'object' ? doc.contact.phone : doc.contact}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Log activity
                                                    activityService.logActivity({
                                                        type: 'doctor_booking',
                                                        details: {
                                                            doctor: {
                                                                id: (doc.id || doc._id).toString(),
                                                                name: doc.name,
                                                                specialization: doc.specialization
                                                            }
                                                        }
                                                    }).catch(err => console.error("Logging failed:", err));

                                                    const phone = typeof doc.contact === 'object' ? doc.contact.phone : doc.contact;
                                                    window.location.href = `tel:${phone}`;
                                                }}
                                                className="mt-auto w-full border border-gray-200 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all flex items-center justify-center"
                                            >
                                                Book Appointment
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                                        No specialists found for this condition.
                                    </div>
                                )
                            ) : (
                                nearbyPharmacies.length > 0 ? (
                                    nearbyPharmacies.map((pharm) => (
                                        <div key={pharm.id || pharm._id} className="card p-6 flex flex-col hover:shadow-lg transition-all group border-b-4 border-transparent hover:border-green-500">
                                            <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                                <MapPin className="h-6 w-6 text-green-600" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{pharm.name}</h4>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pharm.address}</p>

                                            <div className="flex items-center text-gray-500 text-xs mb-6 text-nowrap">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                <a href={`tel:${pharm.contact}`} className="hover:text-green-600 transition-colors">
                                                    {pharm.contact}
                                                </a>
                                                <span className="mx-2">•</span>
                                                <span className="font-bold">{pharm.city}</span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Log activity
                                                    activityService.logActivity({
                                                        type: 'pharmacy_interaction',
                                                        details: {
                                                            pharmacy: {
                                                                id: (pharm.id || pharm._id).toString(),
                                                                name: pharm.name,
                                                                address: pharm.address
                                                            }
                                                        }
                                                    }).catch(err => console.error("Logging failed:", err));

                                                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(pharm.name + ' ' + pharm.city)}`, '_blank');
                                                }}
                                                className="mt-auto w-full border border-gray-200 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center justify-center"
                                            >
                                                Get Directions
                                                <ExternalLink className="h-3 w-3 ml-2" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                                        No nearby pharmacies found in your city.
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Notification */}
            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className={`${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        } text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-6 w-6" />
                        ) : (
                            <ShieldAlert className="h-6 w-6" />
                        )}
                        <span className="font-bold">{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionResult;
