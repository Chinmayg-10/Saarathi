import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const getIcon = (status) => {
    const isCompleted = status === 'Completed';
    const colorClass = isCompleted ? 'bg-accent-green' : 'bg-accent-yellow';
    
    const htmlContent = `
        <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 rounded-full ${colorClass} shadow-xl ring-2 ring-dark-bg/80"></div>
            <div class="absolute -top-4 text-xs font-bold text-dark-text">${status.slice(0, 3)}</div>
        </div>
    `;

    return new L.DivIcon({
        className: 'custom-marker',
        html: htmlContent,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20]
    });
};

export default function MapView({ projects = [], center = [21.1458, 79.0882], zoom = 6 }) {
    
    if (projects.length === 0) {
        return <div className="h-[400px] bg-dark-card flex items-center justify-center rounded-lg text-gray-400">No Geo-tagged projects available.</div>;
    }
    const initialCenter = projects.length > 0 && projects[0].latitude && projects[0].longitude 
        ? [projects[0].latitude, projects[0].longitude] 
        : center;

    return (
        <MapContainer 
            center={initialCenter} 
            zoom={zoom} 
            scrollWheelZoom={true}
            className="h-[60vh] w-full rounded-xl z-0 border border-gray-700"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            
            {projects.map(p => {
                if (!p.latitude || !p.longitude) return null;
                const position = [p.latitude, p.longitude];
                
                return (
                    <Marker 
                        key={p.id} 
                        position={position} 
                        icon={getIcon(p.status)}
                    >
                        <Popup>
                            <div className="text-sm font-sans text-gray-800 p-1">
                                <h4 className="font-bold text-base mb-1">{p.project_name}</h4>
                                <p><strong>Village:</strong> {p.village_name}</p>
                                <p><strong>Sector:</strong> {p.sector}</p>
                                <p><strong>Status:</strong> <span className={`font-semibold ${p.status === 'Completed' ? 'text-accent-green' : 'text-accent-yellow'}`}>{p.status}</span></p>
                                {p.image_url && (
                                    <img src={p.image_url} alt="Proof" className="mt-2 w-full h-20 object-cover rounded" />
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}