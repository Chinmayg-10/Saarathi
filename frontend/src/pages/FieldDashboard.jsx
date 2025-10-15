// src/pages/FieldDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; 
import Layout from '../components/Layout'; 
import MapView from '../components/MapView';
import ProjectForm from '../components/ProjectForm'; // Assume this component exists

export default function FieldDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to load projects added by the current officer (assumes API handles filtering)
    const loadProjects = async () => {
        setLoading(true);
        try {
            // GET /api/projects should return projects created by the authenticated officer
            const response = await API.get('/projects'); 
            setProjects(response.data.projects || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
            // Optional: Show a toast notification for error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm deletion? This action cannot be undone.')) return;
        try {
            await API.delete(`/projects/${id}`);
            alert('Project deleted successfully!');
            loadProjects();
        } catch (error) {
            alert('Deletion failed. Check permissions.');
        }
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === 'Completed' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-yellow/20 text-accent-yellow'
        }`}>
            {status}
        </span>
    );

    return (
        <Layout role="officer">
            <h1 className="text-3xl font-bold text-dark-text mb-8 border-b border-gray-700 pb-3">
                Field Officer Dashboard: Project Submissions
            </h1>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                
                {/* --- 1. Project Input Form --- */}
                <div className="md:col-span-1 bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-xl font-semibold text-accent-blue mb-4">New Project Submission</h2>
                    {/* ProjectForm should include the GPS coordinate capture logic */}
                    <ProjectForm onSaved={loadProjects} />
                </div>
                
                {/* --- 2. Map View --- */}
                <div className="md:col-span-2 bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-xl font-semibold text-dark-text mb-4">My Geo-Tagged Projects</h2>
                    {/* MapView component showing this officer's projects */}
                    <MapView projects={projects} zoom={7} /> 
                </div>
            </div>

            {/* --- 3. Officer's Project List --- */}
            <div className="bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-2xl font-semibold text-dark-text mb-4">Recent Submissions ({projects.length})</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-dark-text divide-y divide-gray-700">
                        <thead className="text-xs uppercase text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-4">Project</th>
                                <th scope="col" className="py-3 px-4">Village</th>
                                <th scope="col" className="py-3 px-4">Sector</th>
                                <th scope="col" className="py-3 px-4">Status</th>
                                <th scope="col" className="py-3 px-4">Coordinates</th>
                                <th scope="col" className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="py-4 text-center text-gray-400">Loading your project history...</td></tr>
                            ) : (
                                projects.map(p => (
                                    <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                        <td className="py-4 px-4 font-medium">{p.project_name}</td>
                                        <td className="py-4 px-4">{p.village_name}</td>
                                        <td className="py-4 px-4">{p.sector}</td>
                                        <td className="py-4 px-4"><StatusBadge status={p.status} /></td>
                                        <td className="py-4 px-4 text-xs">{p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}</td>
                                        <td className="py-4 px-4 space-x-2">
                                            <button className="text-accent-blue hover:text-blue-400">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}