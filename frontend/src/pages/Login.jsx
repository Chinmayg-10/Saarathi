// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setToken } from '../api';
import Layout from '../components/Layout'; // Use a minimal layout wrapper

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'officer' // Default signup role for easy testing
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuccess = (user, token) => {
        // 1. Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        
        // 2. Redirect based on role
        if (user.role === 'admin') {
            navigate('/admin');
        } else if (user.role === 'officer') {
            navigate('/field');
        } else {
            // Public role technically doesn't need login, but redirect for consistency
            navigate('/'); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        const data = isLogin ? { email: formData.email, password: formData.password } : formData;

        try {
            const response = await API.post(endpoint, data);
            
            if (response.data.token && response.data.user) {
                handleSuccess(response.data.user, response.data.token);
            } else {
                setError('Authentication failed. Invalid response.');
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Network error or invalid credentials.';
            setError(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const FormTitle = isLogin ? 'Sign In to Saarthi Portal' : 'Create New Account';

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
            <div className="w-full max-w-md bg-dark-card p-8 rounded-xl shadow-2xl border border-gray-700">
                
                <h2 className="text-3xl font-bold text-accent-blue text-center mb-2">
                    {FormTitle}
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                    PM-AJAY Project Monitoring
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* --- Name (Signup Only) --- */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-1" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:ring-accent-blue focus:border-accent-blue"
                            />
                        </div>
                    )}

                    {/* --- Email --- */}
                    <div>
                        <label className="block text-sm font-medium text-dark-text mb-1" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:ring-accent-blue focus:border-accent-blue"
                        />
                    </div>

                    {/* --- Password --- */}
                    <div>
                        <label className="block text-sm font-medium text-dark-text mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:ring-accent-blue focus:border-accent-blue"
                        />
                    </div>

                    {/* --- Role Selection (Signup Only) --- */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-1" htmlFor="role">Account Type</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:ring-accent-blue focus:border-accent-blue"
                            >
                                <option value="officer">Field Officer (Project Submission)</option>
                                <option value="admin">Admin (Oversight/Approvals)</option>
                                {/* Public role is typically read-only, thus no signup needed */}
                            </select>
                        </div>
                    )}
                    
                    {/* --- Error Message --- */}
                    {error && (
                        <p className="text-sm font-medium text-red-400 bg-red-900/30 p-2 rounded-lg">{error}</p>
                    )}

                    {/* --- Submit Button --- */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg text-lg font-semibold transition duration-200 
                            ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-accent-blue hover:bg-blue-600 text-white'}`}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium text-accent-blue hover:text-blue-400"
                    >
                        {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
}