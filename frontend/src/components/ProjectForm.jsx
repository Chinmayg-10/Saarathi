import React, { useState } from 'react';
import API from '../api';

const SECTOR_OPTIONS = [
    'Health', 'Water', 'Education', 'Sanitation', 'Roads', 
    'Electricity', 'Skill Development'
];


const InputField = ({ label, name, children, ...rest }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text mb-1" htmlFor={name}>
            {label}
        </label>
        {children || (
            <input
                id={name}
                name={name}
                {...rest} 
                className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:ring-accent-blue focus:border-accent-blue"
            />
        )}
    </div>
);



export default function ProjectForm({ onSaved }) {
    const [formData, setFormData] = useState({
        project_name: '',
        sector: SECTOR_OPTIONS[0],
        status: 'Ongoing',
        village_name: '',
        latitude: '',
        longitude: '',
    });
    const [imageFile, setImageFile] = useState(null); 
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        } else {
            setImageFile(null);
        }
    };

    const getGps = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setMessage('Fetching GPS coordinates...');
        setLoading(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));
                setMessage('GPS coordinates fetched successfully!');
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError('Failed to get GPS. Ensure location services are enabled.');
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const formPayload = new FormData();
    
        for (const key in formData) {
            formPayload.append(key, formData[key]);
        }
    
        if (imageFile) {
            formPayload.append('image', imageFile); 
        }

        try {
            await API.post('/projects', formPayload);
            
            setMessage('Project submitted successfully! Data will appear in your list shortly.');
            setFormData({
                project_name: '',
                sector: SECTOR_OPTIONS[0],
                status: 'Ongoing',
                village_name: '',
                latitude: '',
                longitude: '',
            });
            setImageFile(null); 
            
            onSaved(); 
        } catch (err) {
            const msg = err.response?.data?.message || 'Submission failed. Check network or server configuration (Multer).';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            
            <InputField 
                label="Project Name" 
                name="project_name" 
                value={formData.project_name} 
                onChange={handleChange}
            />
            <InputField 
                label="Village Name" 
                name="village_name" 
                value={formData.village_name} 
                onChange={handleChange}
            />

            
            <InputField label="Sector" name="sector">
                <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:ring-accent-blue focus:border-accent-blue"
                    required
                >
                    {SECTOR_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </InputField>

            
            <InputField label="Status" name="status">
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:ring-accent-blue focus:border-accent-blue"
                    required
                >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                </select>
            </InputField>

            {/* --- FILE INPUT FIELD --- */}
            <div>
                <label className="block text-sm font-medium text-dark-text mb-1" htmlFor="project_image">
                    Project Image (Proof)
                </label>
                <input
                    id="project_image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange} // <--- Correct Handler
                    required={false} 
                    className="w-full text-sm text-dark-text bg-gray-700 border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-blue file:text-white hover:file:bg-blue-600"
                />
                 {/* Display selected file name */}
                 {imageFile && <p className="text-xs text-gray-400 mt-1">Ready to upload: {imageFile.name}</p>}
            </div>


            {/* --- GPS COORDINATES SECTION --- */}
            <div className="pt-2 border-t border-gray-700">
                <h3 className="text-base font-semibold text-dark-text mb-2">Geospatial Tagging (Proof of Location)</h3>
                
                <div className="flex space-x-2">
                    {/* Latitude Input */}
                    <InputField 
                        label="Latitude" 
                        name="latitude" 
                        type="number" 
                        step="any"
                        value={formData.latitude} 
                        onChange={handleChange}
                        required
                        disabled={!formData.latitude && loading}
                    />
                    {/* Longitude Input */}
                    <InputField 
                        label="Longitude" 
                        name="longitude" 
                        type="number" 
                        step="any"
                        value={formData.longitude} 
                        onChange={handleChange}
                        required
                        disabled={!formData.longitude && loading}
                    />
                </div>

                <button
                    type="button"
                    onClick={getGps}
                    disabled={loading && message.includes('Fetching')}
                    className={`w-full py-2 mt-2 rounded-lg text-sm font-semibold transition duration-200 
                        ${(loading && message.includes('Fetching')) ? 'bg-gray-500 cursor-not-allowed' : 'bg-accent-green hover:bg-emerald-600 text-white'}`}
                >
                    {(loading && message.includes('Fetching')) ? 'Fetching GPS...' : 'Capture Current GPS'}
                </button>
            </div>

            {/* --- Messages --- */}
            {message && !error && (
                <p className="text-sm font-medium text-accent-green bg-accent-green/30 p-2 rounded-lg">{message}</p>
            )}
            {error && (
                <p className="text-sm font-medium text-red-400 bg-red-900/30 p-2 rounded-lg">{error}</p>
            )}

            {/* --- Final Submit --- */}
            <button
                type="submit"
                disabled={loading || !formData.latitude || !formData.longitude} 
                className={`w-full py-3 mt-4 rounded-lg text-lg font-semibold transition duration-200 
                    ${(loading || !formData.latitude) ? 'bg-gray-500 cursor-not-allowed' : 'bg-accent-blue hover:bg-blue-600 text-white'}`}
            >
                {loading && !message.includes('Fetching') ? 'Submitting...' : 'Save Project Data'}
            </button>
        </form>
    );
}