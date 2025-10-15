// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
// Assume these components exist:
import { Pie } from 'react-chartjs-2'; // Example Chart.js import

// Mock data/component for Chart.js Pie Chart (requires Chart.js and react-chartjs-2 setup)
const SectorPieChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.sector),
        datasets: [{
            data: chartData.map(d => d.count),
            backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#f87171', '#a78bfa', '#f472b6', '#38bdf8'],
            hoverBackgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#e879f9', '#0ea5e9'],
        }],
    };
    const options = { responsive: true, plugins: { legend: { labels: { color: '#f1f5f9' } } } };
    return <Pie data={data} options={options} />;
};

export default function AdminDashboard() {
    const [allProjects, setAllProjects] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, chart: [] });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            // GET /api/projects should return ALL projects for the Admin
            const projectsRes = await API.get('/projects'); 
            const projects = projectsRes.data.projects || [];
            setAllProjects(projects);

            // Calculate KPIs and Chart Data
            const total = projects.length;
            const completed = projects.filter(p => p.status === 'Completed').length;
            const sectorCounts = projects.reduce((acc, p) => {
                acc[p.sector] = (acc[p.sector] || 0) + 1;
                return acc;
            }, {});
            const chartData = Object.keys(sectorCounts).map(sector => ({ sector, count: sectorCounts[sector] }));
            
            setStats({ total, completed, chart: chartData });
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const KPI_Card = ({ title, value, color }) => (
        <div className="bg-dark-card p-5 rounded-xl shadow-xl border border-gray-700">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className={`text-4xl font-extrabold ${color} mt-1`}>{value}</p>
        </div>
    );

    const completedPercent = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

    if (loading) return <Layout role="admin"><div className="text-dark-text">Loading Admin Data...</div></Layout>;

    return (
        <Layout role="admin">
            <h1 className="text-3xl font-bold text-accent-blue mb-8 border-b border-gray-700 pb-3">
                Admin Dashboard: Scheme Monitoring & Oversight
            </h1>

            {/* --- 1. Key Performance Indicators (KPIs) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPI_Card title="Total Projects" value={stats.total} color="text-accent-blue" />
                <KPI_Card title="Completed Projects" value={stats.completed} color="text-accent-green" />
                <KPI_Card title="% Completed Rate" value={`${completedPercent}%`} color="text-accent-yellow" />
            </div>

            <div className="grid md:grid-cols-5 gap-6 mb-8">
                
                {/* --- 2. Sector Distribution Chart --- */}
                <div className="md:col-span-2 bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700 h-96">
                    <h2 className="text-xl font-semibold text-dark-text mb-4">Projects by Sector</h2>
                    <div className="h-full max-w-sm mx-auto pb-10">
                        {stats.chart.length > 0 ? (
                            <SectorPieChart chartData={stats.chart} />
                        ) : (
                            <p className="text-gray-400 text-center pt-8">No data to display chart.</p>
                        )}
                    </div>
                </div>

                {/* --- 3. Map Summary --- */}
                <div className="md:col-span-3 bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-xl font-semibold text-dark-text mb-4">Geospatial Project Overview</h2>
                    <MapView projects={allProjects} zoom={5} />
                </div>
            </div>

            {/* --- 4. All Projects Table (Filterable/Sortable) --- */}
            <div className="bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-2xl font-semibold text-dark-text mb-4">All Project Records</h3>
                {/* Table implementation here (use state for filtering/sorting) */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-dark-text divide-y divide-gray-700">
                        <thead className="text-xs uppercase text-gray-400">
                            {/* ... Table Headers ... */}
                            <tr>
                                <th scope="col" className="py-3 px-4">Project</th>
                                <th scope="col" className="py-3 px-4">Village</th>
                                <th scope="col" className="py-3 px-4">Sector</th>
                                <th scope="col" className="py-3 px-4">Status</th>
                                <th scope="col" className="py-3 px-4">Created By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProjects.map(p => (
                                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                    <td className="py-4 px-4 font-medium">{p.project_name}</td>
                                    <td className="py-4 px-4">{p.village_name}</td>
                                    <td className="py-4 px-4">{p.sector}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'Completed' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-yellow/20 text-accent-yellow'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-400">{p.created_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination/Filtering controls would go here */}
            </div>
        </Layout>
    );
}