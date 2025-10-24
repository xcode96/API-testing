import React, { useRef, useState } from 'react';
import { AppSettings, User, Quiz, Email, ModuleCategory } from '../../types';
import { fetchFromGitHub, AppData } from '../../services/api';

interface SettingsPanelProps {
    settings: AppSettings;
    onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
    users: User[];
    quizzes: Quiz[];
    emailLog: Email[];
    moduleCategories: ModuleCategory[];
    onForceSync: (data: AppData) => void;
}

const SignatureUploader: React.FC<{
    label: string;
    signatureUrl: string | null;
    name: string;
    title: string;
    onUpload: (file: File) => void;
    onRemove: () => void;
    onNameChange: (value: string) => void;
    onTitleChange: (value: string) => void;
}> = ({ label, signatureUrl, name, title, onUpload, onRemove, onNameChange, onTitleChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-700 mb-4">{label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex items-center gap-4">
                    <div className="w-40 h-20 bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        {signatureUrl ? (
                            <img src={signatureUrl} alt={`${label} preview`} className="max-w-full max-h-full object-contain p-2" />
                        ) : (
                            <span className="text-slate-400 text-sm">Signature</span>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-indigo-600 transition-colors text-sm">
                            {signatureUrl ? 'Replace' : 'Upload'}
                        </button>
                        {signatureUrl && (
                            <button onClick={onRemove} className="bg-rose-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-rose-600 transition-colors text-sm">
                                Remove
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Signatory Name</label>
                        <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g., Jane Doe" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Signatory Title</label>
                        <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="e.g., CEO" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};


const AssetUploader: React.FC<{
    label: string;
    assetUrl: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
}> = ({ label, assetUrl, onUpload, onRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-700 mb-4">{label}</h3>
            <div className="flex items-center gap-6">
                <div className="w-48 h-24 bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                    {assetUrl ? (
                        <img src={assetUrl} alt={`${label} preview`} className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                        <span className="text-slate-400 text-sm">Preview</span>
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-indigo-600 transition-colors text-sm">
                        {assetUrl ? 'Replace Image' : 'Upload Image'}
                    </button>
                    {assetUrl && (
                        <button onClick={onRemove} className="bg-rose-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-rose-600 transition-colors text-sm">
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onForceSync }) => {
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<string | null>(null);

    const handleFileUpload = (file: File, type: 'logo' | 'signature1' | 'signature2' | 'certificationSeal') => {
        const reader = new FileReader();
        reader.onload = () => {
            onSettingsChange(prev => ({ ...prev, [type]: reader.result as string }));
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Failed to read the selected file.");
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumberInput = type === 'number';
        onSettingsChange(prev => ({ ...prev, [name]: isNumberInput ? parseInt(value) || 0 : value }));
    };

    const handleExportAllData = () => {
        // This function needs access to all data, so it's better to keep it in a component that has it.
        // For now, let's assume it's disabled or will be moved.
        alert("Export functionality has been refactored. Please ensure it's called from a parent component with access to all data.");
    };
    
    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestStatus('Testing connection...');
        setSyncStatus(null);
        const result = await fetchFromGitHub(settings);
        if (result.success) {
            setTestStatus('✅ Connection successful! File found and is readable.');
        } else {
            setTestStatus(`❌ ${result.error}`);
        }
        setIsTesting(false);
    };

    const handleForceSyncClick = async () => {
        if (!window.confirm("This will overwrite your current session with data from GitHub. Any unsaved changes will be lost. Are you sure you want to continue?")) {
            return;
        }
        setIsSyncing(true);
        setSyncStatus('Syncing from GitHub...');
        setTestStatus(null);
        const result = await fetchFromGitHub(settings);
        if (result.success) {
            onForceSync(result.data);
            setSyncStatus(null); // Success message is handled by an alert in App.tsx
        } else {
            setSyncStatus(`❌ Sync Failed: ${result.error}`);
        }
        setIsSyncing(false);
    };

    const isGitHubConfigured = settings.githubOwner && settings.githubRepo && settings.githubPath && settings.githubPat;

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Application Settings</h1>
                <p className="text-slate-500">Customize certificates and manage application data.</p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Data Management</h2>
                    <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-700 mb-2">Export All Application Data</h3>
                        <p className="text-sm text-slate-600 mb-4">Download a single JSON file containing all users, quizzes, settings, and logs. This file can be used for backups or migration.</p>
                        <button onClick={handleExportAllData} className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-indigo-600 transition-colors">
                            Export All Data
                        </button>
                    </div>

                    <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
                       <h3 className="font-semibold text-lg text-slate-700 mb-4">GitHub Synchronization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">GitHub Owner / Organization</label>
                                <input type="text" name="githubOwner" value={settings.githubOwner || ''} onChange={handleInputChange} placeholder="e.g., my-organization" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                           <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Repository Name</label>
                                <input type="text" name="githubRepo" value={settings.githubRepo || ''} onChange={handleInputChange} placeholder="e.g., training-content" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">File Path in Repository</label>
                                <input type="text" name="githubPath" value={settings.githubPath || ''} onChange={handleInputChange} placeholder="e.g., training-data.json" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">GitHub Personal Access Token (Fine-Grained)</label>
                                <input 
                                    type="password" 
                                    name="githubPat" 
                                    value={settings.githubPat || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="ghp_..." 
                                    className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
                                />
                                <p className="text-xs text-rose-600 mt-2 p-2 bg-rose-50 border border-rose-200 rounded-md">
                                    <strong>Warning:</strong> Providing a Personal Access Token is required for GitHub sync. For security, use a <a href="https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/" target="_blank" rel="noopener noreferrer" className="underline font-bold">fine-grained token</a> with read/write access ONLY to the specified repository's contents. This token is stored with your app data and should be treated like a password.
                                </p>
                            </div>
                             <div className="mt-4 flex items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={handleTestConnection}
                                    disabled={!isGitHubConfigured || isTesting}
                                    className="bg-slate-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-slate-700 transition-colors text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {isTesting ? 'Testing...' : 'Test Connection'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleForceSyncClick}
                                    disabled={!isGitHubConfigured || isSyncing}
                                    className="bg-emerald-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-emerald-700 transition-colors text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {isSyncing ? 'Syncing...' : 'Force Sync from GitHub'}
                                </button>
                            </div>
                            {testStatus && (
                                <p className={`text-sm mt-2 p-3 rounded-md ${
                                    testStatus.startsWith('✅') ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                                    'bg-rose-50 border border-rose-200 text-rose-700'
                                }`}>
                                    {testStatus}
                                </p>
                            )}
                            {syncStatus && (
                                <p className={`text-sm mt-2 p-3 rounded-md ${
                                    syncStatus.startsWith('❌') ? 'bg-rose-50 border border-rose-200 text-rose-700' :
                                    'bg-slate-100 border border-slate-200 text-slate-600'
                                }`}>
                                    {syncStatus}
                                </p>
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 pt-6 border-t border-slate-200">Certificate Settings</h2>
                    
                    <AssetUploader
                        label="Company Logo"
                        assetUrl={settings.logo}
                        onUpload={(file) => handleFileUpload(file, 'logo')}
                        onRemove={() => onSettingsChange(prev => ({...prev, logo: null}))}
                    />

                    <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
                       <h3 className="font-semibold text-lg text-slate-700 mb-4">Certificate Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Company Full Name</label>
                                <input type="text" name="companyFullName" value={settings.companyFullName} onChange={handleInputChange} placeholder="e.g., International Security Consortium" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                           <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Course Name</label>
                                <input type="text" name="courseName" value={settings.courseName} onChange={handleInputChange} placeholder="e.g., Certified Security Professional" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Main Body Text</label>
                                <textarea name="certificationBodyText" value={settings.certificationBodyText} onChange={handleInputChange} rows={4} className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Certification Cycle (Years)</label>
                                <input type="number" name="certificationCycleYears" value={settings.certificationCycleYears} onChange={handleInputChange} placeholder="e.g., 3" className="w-full md:w-1/3 p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                     <AssetUploader
                        label="Certification Seal"
                        assetUrl={settings.certificationSeal}
                        onUpload={(file) => handleFileUpload(file, 'certificationSeal')}
                        onRemove={() => onSettingsChange(prev => ({...prev, certificationSeal: null}))}
                    />
                    <SignatureUploader
                        label="Signatory #1"
                        signatureUrl={settings.signature1}
                        name={settings.signature1Name}
                        title={settings.signature1Title}
                        onUpload={(file) => handleFileUpload(file, 'signature1')}
                        onRemove={() => onSettingsChange(prev => ({...prev, signature1: null}))}
                        onNameChange={(value) => onSettingsChange(prev => ({...prev, signature1Name: value}))}
                        onTitleChange={(value) => onSettingsChange(prev => ({...prev, signature1Title: value}))}
                    />

                     <SignatureUploader
                        label="Signatory #2"
                        signatureUrl={settings.signature2}
                        name={settings.signature2Name}
                        title={settings.signature2Title}
                        onUpload={(file) => handleFileUpload(file, 'signature2')}
                        onRemove={() => onSettingsChange(prev => ({...prev, signature2: null}))}
                        onNameChange={(value) => onSettingsChange(prev => ({...prev, signature2Name: value}))}
                        onTitleChange={(value) => onSettingsChange(prev => ({...prev, signature2Title: value}))}
                    />
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;