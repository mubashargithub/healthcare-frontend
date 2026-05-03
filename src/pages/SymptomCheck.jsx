import React, { useState, useEffect, useRef } from 'react';
import {
    Activity,
    Search,
    Trash2,
    ArrowRight,
    ChevronLeft,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/api';

const SymptomCheck = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [allSymptoms, setAllSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [patientDescription, setPatientDescription] = useState('');
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const res = await aiService.getSymptoms();
                if (res.data.success) {
                    setAllSymptoms(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch symptoms:', err);
            }
        };
        fetchSymptoms();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSymptoms = allSymptoms.filter(s => {
        const lowerS = s.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();

        // Exact character matching: 
        // 1. Starts with search term (Priority)
        // 2. Contains search term as a word or substring
        return (lowerS.startsWith(lowerSearch) || lowerS.includes(lowerSearch)) &&
            !selectedSymptoms.includes(s);
    })
        .sort((a, b) => {
            const lowerA = a.toLowerCase();
            const lowerB = b.toLowerCase();
            const lowerSearch = searchTerm.toLowerCase();

            // Boost those that START with the search term
            const aStarts = lowerA.startsWith(lowerSearch);
            const bStarts = lowerB.startsWith(lowerSearch);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return a.localeCompare(b);
        })
        .slice(0, 15);

    const addSymptom = (s) => {
        setSelectedSymptoms([...selectedSymptoms, s]);
        setSearchTerm('');
        setIsFocused(false);
    };

    const removeSymptom = (s) => {
        setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length < 3) {
            alert('Please select at least 3 symptoms for a more accurate prediction.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await aiService.predict(selectedSymptoms);
            if (res.data.success) {
                navigate('/prediction-result', { state: { prediction: res.data.data } });
            }
        } catch (err) {
            alert('Error generating prediction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-[80vh] py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Dashboard
                </button>

                <div className="card p-5 md:p-8">
                    <div className="text-center mb-8 md:mb-10">
                        <div className="bg-primary-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="h-7 w-7 md:h-8 md:w-8 text-primary-600" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analyze Symptoms</h1>
                        <p className="text-sm md:text-base text-gray-600 mt-2">Our AI will help you identify potential health issues.</p>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-6" ref={dropdownRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="Search or select symptoms..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsFocused(true);
                            }}
                            onFocus={() => setIsFocused(true)}
                        />

                        {/* Suggestions Dropdown */}
                        {isFocused && filteredSymptoms.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                {filteredSymptoms.map((s, i) => (
                                    <button
                                        key={i}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            addSymptom(s);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-primary-50 text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Symptoms Tags */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Your Selection:</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.length > 0 ? (
                                selectedSymptoms.map((s, i) => (
                                    <span key={i} className="inline-flex items-center bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-bold">
                                        {s}
                                        <button onClick={() => removeSymptom(s)} className="ml-2 hover:text-primary-900">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-400 italic text-sm">No symptoms selected yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Optional Patient Description */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Describe your condition (Optional)
                        </label>
                        <textarea
                            className="block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm resize-none text-gray-700"
                            rows="3"
                            placeholder="Tell us more about how you're feeling in your own words..."
                            value={patientDescription}
                            onChange={(e) => setPatientDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Info className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-bold">Disclaimer:</span> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={isLoading || selectedSymptoms.length === 0}
                        className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Analyzing Symptoms...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Prediction</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SymptomCheck;
