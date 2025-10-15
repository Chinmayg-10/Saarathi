import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../api';

const NavLink = ({ to, children }) => (
    <Link to={to} className="text-dark-text hover:text-accent-blue transition duration-200 px-3 py-1 rounded">
        {children}
    </Link>
);

export default function Layout({ children, role }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            <nav className="bg-dark-card shadow-lg p-4 border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-extrabold text-accent-blue">
                        Saarthi
                    </Link>

                    <div className="flex items-center space-x-4">
                        {role === 'public' && <NavLink to="/public">Public Dashboard</NavLink>}
                        {role === 'officer' && <NavLink to="/field">My Dashboard</NavLink>}
                        {role === 'admin' && <NavLink to="/admin">Admin Tools</NavLink>}
                        
                        {(role === 'officer' || role === 'admin') ? (
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-full transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <NavLink to="/login">Login</NavLink>
                        )}
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}