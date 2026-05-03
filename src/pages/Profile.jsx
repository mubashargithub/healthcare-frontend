import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, MapPin, Edit2 } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="bg-gray-50 min-h-[80vh] py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar & Basic Info */}
                    <div className="card p-8 text-center flex flex-col items-center">
                        <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-16 w-16 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 text-sm mb-6">{user?.role || 'Patient'}</p>
                        <button className="btn-primary w-full py-2 flex items-center justify-center text-sm">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="bg-gray-50 p-2 rounded mr-4 text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                        <p className="text-gray-900 font-semibold">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="bg-gray-50 p-2 rounded mr-4 text-gray-400">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Account Status</p>
                                        <p className="text-green-600 font-semibold">Verified</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="bg-gray-50 p-2 rounded mr-4 text-gray-400">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Location</p>
                                        <p className="text-gray-900 font-semibold">New York, USA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security Settings</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-gray-500 font-medium">Add an extra layer of security to your account.</p>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
