// src/pages/LandingPage.jsx (or use this code in src/pages/PublicDashboard.jsx)
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // Ensure this is available

// --- Feature Card Component ---
const FeatureCard = ({ icon, title, description, color }) => (
    <div className="bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700 transition duration-300 hover:border-accent-blue hover:shadow-accent-blue/30">
        <div className={`text-4xl ${color} mb-4`}>{icon}</div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

export default function LandingPage() {
    return (
        // Layout component provides the Nav bar and main background
        <Layout role="public">
            
            {/* --- 1. Hero Section --- */}
            <section className="text-center py-20 md:py-32">
                <h1 className="text-5xl md:text-6xl font-extrabold text-dark-text mb-4 leading-tight">
                    Saarthi: <span className="text-accent-blue">Smart Monitoring</span> for Adarsh Gram
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                    Transforming PM-AJAY execution through **real-time geospatial data**, transparency, and **evidence-based prioritization**.
                </p>
                
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/public" // Link to the read-only public map view (if you create a specific route for it)
                        className="bg-accent-green hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md shadow-accent-green/50"
                    >
                        View Live Public Map 🌍
                    </Link>
                    <Link
                        to="/login"
                        className="bg-gray-700 hover:bg-gray-600 text-dark-text font-bold py-3 px-8 rounded-full text-lg transition duration-300 border border-gray-600"
                    >
                        Officer / Admin Login 🔑
                    </Link>
                </div>
            </section>
            
            {/* --- 2. Features/Value Proposition Section --- */}
            <section className="py-16">
                <h2 className="text-3xl font-bold text-dark-text text-center mb-12">
                    Why Saarthi is the <span className="text-accent-blue">Engine</span> for Development
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon="📍" 
                        title="Geospatial Proof" 
                        description="Mandatory GPS tagging for every project ensures accurate location recording and prevents resource leakage."
                        color="text-accent-blue"
                    />
                    <FeatureCard 
                        icon="✅" 
                        title="Real-time Status" 
                        description="Field Officers update project progress immediately upon completion, visible instantly to district and ministry level administrators."
                        color="text-accent-green"
                    />
                    <FeatureCard 
                        icon="📊" 
                        title="Data-Driven Prioritization" 
                        description="KPI dashboards and sector-wise charts allow administrators to allocate funds where the developmental gap is highest."
                        color="text-accent-yellow"
                    />
                </div>
            </section>
            
            {/* --- 3. Call to Action for Field Staff --- */}
            <section className="py-16 bg-dark-card rounded-xl shadow-xl border border-gray-700 mb-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-dark-text mb-4">
                        Are You a Field Officer?
                    </h2>
                    <p className="text-lg text-gray-400 mb-6">
                        Submit and track your projects instantly using your mobile GPS. Your work, verified.
                    </p>
                    <Link
                        to="/field"
                        className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md shadow-accent-blue/50"
                    >
                        Go to Project Submission Panel →
                    </Link>
                </div>
            </section>

        </Layout>
    );
}