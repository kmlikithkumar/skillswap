import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { MOCK_NOTIFICATIONS } from '../constants';
import type { Notification } from '../types';

const Logo: React.FC = () => (
    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.293 9.293a1 1 0 00-1.414 1.414L14.586 14H5.414l1.707-1.707a1 1 0 00-1.414-1.414L4 12.586V16h12v-3.414l-1.707-1.707zM6 8a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
        </svg>
        <span className="hidden md:block">SkillSwap</span>
    </Link>
);


const NotificationIcon: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                        <div className="px-4 py-2 font-bold text-gray-800">Notifications</div>
                        <ul className="divide-y">
                            {MOCK_NOTIFICATIONS.map((notif) => (
                                <li key={notif.id} className={`px-4 py-3 hover:bg-gray-100 ${!notif.read ? 'bg-indigo-50' : ''}`}>
                                    <p className="text-sm text-gray-600">{notif.content}</p>
                                    <p className="text-xs text-gray-400">{notif.timestamp}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserMenu: React.FC = () => {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!currentUser) return null;

    return (
        <div className="flex items-center space-x-4">
            <NotificationIcon />
            <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full" />
                    <span className="hidden sm:inline font-medium text-gray-700">{currentUser.name}</span>
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                        <Link to={`/profile/${currentUser.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Navbar: React.FC = () => {
    const { isLoggedIn } = useApp();

    return (
        <header className="bg-white/75 backdrop-blur-lg shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Logo />
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/skills" className="text-gray-500 hover:text-primary font-medium">Explore Skills</Link>
                        <Link to="/dashboard" className="text-gray-500 hover:text-primary font-medium">Dashboard</Link>
                         <Link to="/chat" className="text-gray-500 hover:text-primary font-medium">Messages</Link>
                        <Link to="/schedule" className="text-gray-500 hover:text-primary font-medium">Scheduler</Link>
                    </div>
                    <div>
                        {isLoggedIn ? (
                            <UserMenu />
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-500 hover:text-primary font-medium px-3 py-2 rounded-md">Login</Link>
                                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
