import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-1' : 'bg-slate-900 shadow-md py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-primary-600 p-2 rounded-lg shadow-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className={`text-2xl font-black tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'
                            }`}>
                            Diagno<span className="text-primary-500">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === link.path
                                    ? (scrolled ? 'bg-primary-50 text-primary-600' : 'bg-white/10 text-white')
                                    : (scrolled ? 'text-slate-600 hover:bg-slate-50 hover:text-primary-600' : 'text-slate-300 hover:bg-white/5 hover:text-white')
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="ml-6 flex items-center space-x-4 border-l pl-6 border-slate-700/20">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to={['admin', 'superadmin'].includes(user.role) ? '/admin' : '/dashboard'}
                                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${scrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/5 text-white'
                                            }`}
                                    >
                                        <div className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center">
                                            <User className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className={`text-sm font-bold ${scrolled ? 'text-slate-600 hover:text-primary-600' : 'text-slate-300 hover:text-white'}`}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary-600/20"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-lg ${scrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-2xl absolute w-full overflow-hidden"
                    >
                        <div className="px-4 py-8 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3.5 rounded-xl text-lg font-bold transition-all ${location.pathname === link.path ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                                {user ? (
                                    <>
                                        <Link
                                            to={['admin', 'superadmin'].includes(user.role) ? '/admin' : '/dashboard'}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-4 bg-slate-50 rounded-lg font-bold text-slate-900"
                                        >
                                            Dashboard <User className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-4 text-red-600 font-bold flex items-center justify-between"
                                        >
                                            Logout <LogOut className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 font-bold">Sign In</Link>
                                        <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 bg-primary-600 text-white rounded-lg font-bold">Sign Up Free</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
