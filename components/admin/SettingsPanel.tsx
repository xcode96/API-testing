import React, { useRef } from 'react';
import { AppSettings, GithubSyncStatus } from '../../types';

interface SettingsPanelProps {
    settings: AppSettings;
    onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
    githubSyncStatus: GithubSyncStatus;
}

const SyncStatusIndicator: React.FC<{ status: GithubSyncStatus }> = ({ status }) => {
    switch (status.status) {
        case 'idle':
            return (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 112 0v2a1 1 0 11-2 0V5zm1 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    <span>Status: Idle. Sync is triggered by changes.</span>
                </div>
            );
        case 'syncing':
            return (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Syncing changes...</span>
                </div>
            );
        case 'success':
            return (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>Last synced: {new Date(status.timestamp).toLocaleString()}</span>
                </div>
            );
        case 'error':
             const isConfigError = status.message.includes('not configured');
            const colorClass = isConfigError ? 'text-amber-700' : 'text-rose-700';
            const icon = isConfigError ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l5.362 10.243c.64 1.22-.245 2.658-1.503 2.658H4.398c-1.258 0-2.143-1.438-1.503-2.658L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            );
            return (
                <div className={`flex items-start gap-2 text-sm ${colorClass}`}>
                    <div className="flex-shrink-0 mt-0.5">{icon}</div>
                    <span>Error: {status.message}</span>
                </div>
            );
    }
};

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


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, githubSyncStatus }) => {

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

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Application Settings</h1>
                <p className="text-slate-500">Customize certificates and manage integrations.</p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                <div className="space-y-6">
                     <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-700 mb-2">GitHub Synchronization</h3>
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 text-sm text-blue-800">
                            <h4 className="font-bold mb-2">How to get a Personal Access Token (PAT):</h4>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>
                                    Click here to go to the 
                                    <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600"> GitHub Token Creation Page</a>.
                                </li>
                                <li>Give your token a descriptive name (e.g., "CyberTrainingAppSync").</li>
                                <li>Set an expiration date for security.</li>
                                <li>Under "Scopes", make sure to check the entire <strong className="font-semibold">"repo"</strong> scope.</li>
                                <li>Click "Generate token" and copy the token.</li>
                                <li>Paste the token in the input field below.</li>
                            </ol>
                        </div>
                         <div className="my-4">
                            <SyncStatusIndicator status={githubSyncStatus} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Repository Owner</label>
                                <input 
                                    type="text" 
                                    name="githubOwner" 
                                    value={settings.githubOwner || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., your-github-username" 
                                    className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Repository Name</label>
                                <input 
                                    type="text" 
                                    name="githubRepo" 
                                    value={settings.githubRepo || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., your-repo-name" 
                                    className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">File Path in Repo</label>
                                <input 
                                    type="text" 
                                    name="githubPath" 
                                    value={settings.githubPath || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., data/training-data.json" 
                                    className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Paste your Personal Access Token (PAT)</label>
                                <input 
                                    type="password" 
                                    name="githubPat" 
                                    value={settings.githubPat || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="Requires 'repo' scope" 
                                    className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                                 <p className="text-xs text-rose-600 mt-2 p-2 bg-rose-50 border border-rose-200 rounded-md">
                                    <strong>Security Warning:</strong> Your PAT is saved with your application data. Ensure your data storage and repository are secure.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-800 pt-4 border-t border-slate-200">Certificate Settings</h2>

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
