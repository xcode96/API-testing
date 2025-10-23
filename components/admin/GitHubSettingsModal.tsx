

import React, { useState, useEffect } from 'react';

interface GitHubSettings {
    owner: string;
    repo: string;
    path: string;
    token: string;
}

const GITHUB_SETTINGS_KEY = 'github-publish-settings';

interface GitHubSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GitHubSettingsModal: React.FC<GitHubSettingsModalProps> = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState<GitHubSettings>({ owner: '', repo: '', path: '', token: '' });

    useEffect(() => {
        if (isOpen) {
            const savedSettings = localStorage.getItem(GITHUB_SETTINGS_KEY);
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            } else {
                // Set default path
                setSettings(s => ({...s, path: 'public/data.json'}));
            }
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Basic validation
        if (!settings.owner || !settings.repo || !settings.path || !settings.token) {
            alert('Please fill in all fields.');
            return;
        }
        localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(settings));
        alert('GitHub settings saved successfully!');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
            {/* FIX: Replaced inline style for opacity with a standard Tailwind CSS class to resolve TypeScript error and improve consistency. */}
            <div className="bg-slate-800/95 text-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl relative transform transition-all border border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">GitHub Publish Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Repository Owner</label>
                        <input
                            type="text"
                            name="owner"
                            value={settings.owner}
                            onChange={handleChange}
                            placeholder="e.g., xcode96"
                            className="w-full p-2 bg-slate-700 border-2 border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Repository Name</label>
                        <input
                            type="text"
                            name="repo"
                            value={settings.repo}
                            onChange={handleChange}
                            placeholder="e.g., testings"
                            className="w-full p-2 bg-slate-700 border-2 border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">File Path in Repo</label>
                        <input
                            type="text"
                            name="path"
                            value={settings.path}
                            onChange={handleChange}
                            placeholder="public/data.json"
                            className="w-full p-2 bg-yellow-100 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-black font-semibold"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Personal Access Token (PAT)</label>
                        <input
                            type="password"
                            name="token"
                            value={settings.token}
                            onChange={handleChange}
                            className="w-full p-2 bg-yellow-100 border-2 border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-black font-semibold"
                        />
                        <p className="text-xs text-slate-500 mt-1">Requires a Classic token with ‘repo’ scope. Stored in browser local storage.</p>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GitHubSettingsModal;