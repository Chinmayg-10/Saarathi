// src/pages/PublicDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import MapView from '../components/MapView';
import Layout from '../components/Layout';

const TopProjectCard = ({ project }) => (
    <div className="bg-dark-card p-4 rounded-lg shadow-md border border-gray-700 transition hover:bg-gray-700/70">
        <h5 className="font-bold text-accent-blue truncate">{project.project_name}</h5>
        <p className="text-xs text-gray-400">{project.village_name} ({project.sector})</p>
        <p className="text-xs mt-2 font-semibold text-accent-green">
            COMPLETED
        </p>
    </div>
);

export default function PublicDashboard() {
    const [allProjects, setAllProjects] = useState([]);
    const [topCompleted, setTopCompleted] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch all projects for the Map
                const projectsRes = await API.get('/projects'); 
                setAllProjects(projectsRes.data.projects || []);

                // Fetch top 3 completed by village
                const topRes = await API.get('/projects/top-completed'); 
                setTopCompleted(topRes.data.topProjects || []);
                
                setLoading(false);
            } catch (error) {
                console.error('Public data load failed:', error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <Layout role="public"><div className="text-dark-text">Loading Data...</div></Layout>;

    return (
        <Layout role="public">
            <h1 className="text-3xl font-bold text-accent-blue mb-6">Public Project Transparency Portal</h1>

            {/* --- Read-only Map View --- */}
            <div className="bg-dark-card p-6 rounded-xl shadow-xl border border-gray-700 mb-8">
                <h2 className="text-2xl font-semibold text-dark-text mb-4">Live Project Status Map</h2>
                <MapView projects={allProjects} zoom={5} />
            </div>

            {/* --- Top Completed Projects Grid --- */}
            <h2 className="text-2xl font-semibold text-dark-text mb-4 border-b border-gray-700 pb-2">
                Top Completed Projects Spotlight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topCompleted.length > 0 ? (
                    topCompleted.map(p => <TopProjectCard key={p.id} project={p} />)
                ) : (
                    <p className="text-gray-400 col-span-4 p-4 bg-dark-card rounded-lg">No recently completed projects to highlight.</p>
                )}
            </div>
        </Layout>
    );
}