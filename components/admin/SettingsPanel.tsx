import React, { useRef, useState } from 'react';
import { AppSettings, User, Quiz, Email, ModuleCategory } from '../../types';
import { AppData, fetchFromGitHub } from '../../services/api';

interface SettingsPanelProps {
    settings: AppSettings;
    onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
    users: User[];
    quizzes: Quiz[];
    emailLog: Email[];
    moduleCategories: ModuleCategory[];
    onSyncFromGitHub: () => Promise<{ success: boolean; error?: string }>;
    onImportAllData: (file: File) => Promise<boolean>;
    isSyncing: boolean;
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


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, users, quizzes, emailLog, moduleCategories, onSyncFromGitHub, onImportAllData, isSyncing }) => {
    const [syncStatus, setSyncStatus] = useState<{ message: string; isError: boolean } | null>(null);
    const [testStatus, setTestStatus] = useState<{ message: string; isError: boolean } | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const importAllDataInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

    const StatusDisplay = () => {
        const status = isSyncing ? { message: 'Syncing data from GitHub...', type: 'pending' as const }
            : isTesting ? { message: 'Testing connection to GitHub...', type: 'pending' as const }
            : syncStatus ? { message: syncStatus.message, type: syncStatus.isError ? 'error' as const : 'success' as const }
            : testStatus ? { message: testStatus.message, type: testStatus.isError ? 'error' as const : 'success' as const }
            : null;

        if (!status) return null;

        const config = {
            pending: {
                icon: (
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ),
                style: 'bg-blue-100 border-blue-200 text-blue-800',
            },
            success: {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ),
                style: 'bg-emerald-100 border-emerald-200 text-emerald-800',
            },
            error: {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                ),
                style: 'bg-rose-100 border-rose-200 text-rose-800',
            },
        };

        const currentConfig = config[status.type];

        return (
            <div className={`p-3.5 mt-4 rounded-lg border flex items-center gap-3 text-sm font-medium ${currentConfig.style}`}>
                <span className="flex-shrink-0">{currentConfig.icon}</span>
                <p className="flex-grow break-words">{status.message}</p>
            </div>
        );
    };

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
        const dataToExport: AppData = {
            users,
            quizzes,
            emailLog,
            settings,
            moduleCategories
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(dataToExport, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `data.json`;
        link.click();
    };
    
    const handleTestConnection = async () => {
        if (!settings.githubPat || !settings.githubOwner || !settings.githubRepo || !settings.githubPath) {
            setTestStatus({ message: "Please fill in all GitHub fields first.", isError: true });
            return;
        }
        setSyncStatus(null);
        setTestStatus(null);
        setIsTesting(true);
        try {
            await fetchFromGitHub({
                owner: settings.githubOwner,
                repo: settings.githubRepo,
                path: settings.githubPath,
                pat: settings.githubPat,
            });
            setTestStatus({ message: "Connection successful! Found the data file.", isError: false });
        } catch (err: any) {
            setTestStatus({ message: `Test Failed: ${err.message}`, isError: true });
        } finally {
            setIsTesting(false);
        }
    };


    const handleSyncClick = async () => {
        setSyncStatus(null);
        setTestStatus(null);
        const result = await onSyncFromGitHub();
        if (result.success) {
            setSyncStatus({ message: 'Sync successful! Data has been updated and saved permanently.', isError: false });
        } else {
            setSyncStatus({ message: `Sync Failed: ${result.error || 'An unknown error occurred.'}`, isError: true });
        }
    };
    
    const handleImportAllClick = () => {
        importAllDataInputRef.current?.click();
    };
    
    const handleImportAllFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportStatus(null);
        const success = await onImportAllData(file);

        if (success) {
            setImportStatus({ message: 'Import successful! The page will now reload to apply changes.', isError: false });
            setTimeout(() => window.location.reload(), 2000);
        } else {
            setImportStatus({ message: 'Import failed. Please check the console for errors.', isError: true });
        }

        if (importAllDataInputRef.current) {
            importAllDataInputRef.current.value = "";
        }
        setTimeout(() => setImportStatus(null), 5000);
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Application Settings</h1>
                <p className="text-slate-500">Customize certificates and manage application data.</p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Data Management</h2>

                    <div className="bg-slate-100/80 p-6 rounded-xl border border-slate-200 space-y-6">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-700 mb-2">GitHub Synchronization</h3>
                          <p className="text-sm text-slate-600 mb-4">
                              Securely sync your application data from a file in a GitHub repository. This will overwrite the current application data and save it permanently.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input name="githubOwner" value={settings.githubOwner} onChange={handleInputChange} placeholder="GitHub Owner (e.g., 'google')" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                              <input name="githubRepo" value={settings.githubRepo} onChange={handleInputChange} placeholder="Repository Name" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                              <input name="githubPath" value={settings.githubPath} onChange={handleInputChange} placeholder="Path to file (e.g., 'data.json')" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                              <input type="password" name="githubPat" value={settings.githubPat} onChange={handleInputChange} placeholder="Personal Access Token (PAT)" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                          </div>
                          <p className="text-xs text-slate-500 mb-4">
                              For security, we recommend using a <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">fine-grained PAT</a> with read-only access to your specific repository.
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <button onClick={handleTestConnection} disabled={isTesting || isSyncing} className="w-full sm:w-auto bg-slate-600 text-white font-semibold rounded-lg py-2 px-6 hover:bg-slate-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0">
                                {isTesting ? 'Testing...' : 'Test Connection'}
                            </button>
                            <button onClick={handleSyncClick} disabled={isSyncing || isTesting} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0">
                                {isSyncing ? 'Syncing...' : 'Sync from GitHub'}
                            </button>
                          </div>
                          <StatusDisplay />
                        </div>
                        <div className="border-t border-slate-200 pt-6">
                          <h3 className="font-semibold text-lg text-slate-700 mb-2">Export All Application Data</h3>
                          <p className="text-sm text-slate-600 mb-4">Download a single JSON file containing all users, quizzes, settings, and logs. This file can be used for backups or migration.</p>
                          <button onClick={handleExportAllData} className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-indigo-600 transition-colors">
                              Export All Data
                          </button>
                        </div>
                    </div>

                    <div className="bg-rose-100/60 p-6 rounded-xl border border-rose-200">
                        <input type="file" ref={importAllDataInputRef} onChange={handleImportAllFileSelect} accept=".json" className="hidden" />
                        <h3 className="font-semibold text-lg text-rose-800 mb-2">Import All Application Data</h3>
                        <p className="text-sm text-rose-700 mb-4">
                            <strong className="font-bold">Warning:</strong> This will overwrite all current users, questions, and settings with the content of the selected file. This action cannot be undone.
                        </p>
                        <button onClick={handleImportAllClick} disabled={isSyncing} className="bg-rose-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-rose-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                            {isSyncing ? 'Processing...' : 'Import from data.json'}
                        </button>
                        {importStatus && (
                            <p className={`mt-3 text-sm font-medium ${importStatus.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {importStatus.message}
                            </p>
                        )}
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
