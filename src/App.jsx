import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const DoctorNetwork = lazy(() => import('./pages/DoctorNetwork'));
const PharmacyLocator = lazy(() => import('./pages/PharmacyLocator'));
const HealthHistory = lazy(() => import('./pages/HealthHistory'));
const HealthInsights = lazy(() => import('./pages/HealthInsights'));
const MedicationReminders = lazy(() => import('./pages/MedicationReminders'));
const Profile = lazy(() => import('./pages/Profile'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const SymptomCheck = lazy(() => import('./pages/SymptomCheck'));
const PredictionResult = lazy(() => import('./pages/PredictionResult'));

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Suspense fallback={<Loading />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/pharmacy-locator" element={<PharmacyLocator />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/dashboard" element={<UserDashboard />} />
                                    <Route path="/symptom-check" element={<SymptomCheck />} />
                                    <Route path="/prediction-result" element={<PredictionResult />} />
                                    <Route path="/health-history" element={<HealthHistory />} />
                                    <Route path="/doctor-network" element={<DoctorNetwork />} />
                                    <Route path="/health-insights" element={<HealthInsights />} />
                                    <Route path="/medication-reminders" element={<MedicationReminders />} />
                                </Route>

                                {/* Admin Routes */}
                                <Route element={<ProtectedRoute adminOnly={true} />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                </Route>
                            </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
