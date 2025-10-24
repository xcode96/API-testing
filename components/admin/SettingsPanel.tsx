import React, { useRef, useState } from 'react';
import { AppSettings, User, Quiz, Email, ModuleCategory } from '../../types';
import { AppData } from '../../services/api';

interface SettingsPanelProps {
    settings: AppSettings;
    onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
    users: User[];
    quizzes: Quiz[];
    emailLog: Email[];
    moduleCategories: ModuleCategory[];
    onSyncFromUrl: () => Promise<boolean>;
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


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, users, quizzes, emailLog, moduleCategories, onSyncFromUrl, onImportAllData, isSyncing }) => {
    const [syncStatus, setSyncStatus] = useState<{ message: string; isError: boolean } | null>(null);
    const importAllDataInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);


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

    const handleSyncClick = async () => {
        setSyncStatus(null);
        const success = await onSyncFromUrl();
        if (success) {
            setSyncStatus({ message: 'Sync successful! Data has been updated and saved permanently.', isError: false });
        } else {
            setSyncStatus({ message: 'Sync failed. Check the URL and file format. Data was not saved.', isError: true });
        }
        setTimeout(() => setSyncStatus(null), 5000);
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
                          <h3 className="font-semibold text-lg text-slate-700 mb-2">External Data Source Sync</h3>
                          <p className="text-sm text-slate-600 mb-4">
                              Provide a URL to a raw JSON file (e.g., from GitHub). Clicking "Sync Now" will fetch the latest data from this URL, **permanently save it to the server**, and overwrite the current application data.
                          </p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <input 
                                  type="url" 
                                  name="dataSourceUrl" 
                                  value={settings.dataSourceUrl}
                                  onChange={handleInputChange}
                                  placeholder="https://raw.githubusercontent.com/user/repo/main/data.json" 
                                  className="flex-grow w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
                              />
                              <button onClick={handleSyncClick} disabled={isSyncing || !settings.dataSourceUrl} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0">
                                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                              </button>
                          </div>
                          {syncStatus && (
                              <p className={`mt-3 text-sm font-medium ${syncStatus.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {syncStatus.message}
                              </p>
                          )}
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
