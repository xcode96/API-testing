
import React, { useRef } from 'react';
import { AppSettings } from '../../types';

interface SettingsPanelProps {
    settings: AppSettings;
    onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
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


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {

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
                        <h3 className="font-semibold text-lg text-slate-700 mb-4">GitHub Synchronization</h3>
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>This application automatically backs up all user and quiz data to a GitHub repository. For this to work, a secure token must be configured on the server.</p>
                            <div className="bg-rose-100/60 border border-rose-200/80 rounded-lg p-4">
                                <h4 className="font-semibold text-rose-700 mb-2">Action Required: Configure Environment Variable</h4>
                                <p className="mb-3">If you are seeing sync errors, it is because the Personal Access Token (PAT) is not set up correctly on your Vercel hosting environment.</p>
                                <p className="font-bold mb-2">Follow these steps to fix the issue:</p>
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Go to your project's dashboard on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline">Vercel</a>.</li>
                                    <li>Navigate to the <span className="font-semibold">Settings</span> tab, then click on <span className="font-semibold">Environment Variables</span>.</li>
                                    <li>
                                        Add a new variable with the following details:
                                        <ul className="list-disc list-inside ml-4 my-2 bg-slate-200/50 p-3 rounded">
                                            <li><strong>Key:</strong> <code className="bg-slate-300 px-1 rounded">GITHUB_PAT</code></li>
                                            <li><strong>Value:</strong> Paste your Personal Access Token here.</li>
                                            <li>Ensure your token has <code className="bg-slate-300 px-1 rounded">'repo'</code> scope permissions.</li>
                                            <li>Ensure all environments (Production, Preview, Development) are checked.</li>
                                        </ul>
                                    </li>
                                    <li>Save the variable.</li>
                                    <li>Go to the <span className="font-semibold">Deployments</span> tab and <span className="font-semibold">re-deploy</span> your latest production build to apply the new variable.</li>
                                </ol>
                            </div>
                            <div className="bg-indigo-100/60 border border-indigo-200/80 rounded-lg p-4">
                                <h4 className="font-semibold text-indigo-700 mb-2">Repository Details</h4>
                                <p>The application is configured to sync to the following GitHub repository:</p>
                                <ul className="list-disc list-inside ml-4 mt-2">
                                    <li><strong>Owner:</strong> <code className="bg-slate-300 px-1 rounded">xcode96</code></li>
                                    <li><strong>Repository:</strong> <code className="bg-slate-300 px-1 rounded">API-testing</code></li>
                                    <li><strong>File:</strong> <code className="bg-slate-300 px-1 rounded">training-data.json</code></li>
                                </ul>
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
