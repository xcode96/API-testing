
import React, { useState } from 'react';
import { AppSettings, User, Quiz, ModuleCategory } from '../../types';
import { publishToGitHub } from '../../services/api';

interface SettingsPanelProps {
    settings: AppSettings;
    onUpdateSettings: (newSettings: AppSettings) => void;
    allData: {
        users: User[];
        quizzes: Quiz[];
        moduleCategories: ModuleCategory[];
    };
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, allData }) => {
    const [formState, setFormState] = useState<AppSettings>(settings);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState<{ message: string; isError: boolean } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = () => {
        onUpdateSettings(formState);
        alert("Settings saved!");
    };
    
    const handlePublish = async () => {
        if (!formState.githubPat || !formState.githubOwner || !formState.githubRepo || !formState.githubPath) {
            setPublishStatus({ message: "Please fill in all GitHub fields and save settings before publishing.", isError: true });
            return;
        }

        if (!window.confirm("This will overwrite the data file in your GitHub repository with the current application data. Are you sure you want to continue?")) {
            return;
        }

        setIsPublishing(true);
        setPublishStatus({ message: 'Publishing data to GitHub...', isError: false });

        try {
            const dataToPublish = {
                users: allData.users,
                quizzes: allData.quizzes,
                moduleCategories: allData.moduleCategories,
            };
            const result = await publishToGitHub({ settings: formState, data: dataToPublish });
            setPublishStatus({ message: result.message, isError: false });
        } catch (err: any) {
            setPublishStatus({ message: `Publish Failed: ${err.message}`, isError: true });
        } finally {
            setIsPublishing(false);
        }
    };
    
    const StatusDisplay: React.FC = () => {
        if (!publishStatus) return null;

        const { message, isError } = publishStatus;
        const baseStyle = 'p-3.5 mt-6 rounded-lg border flex items-center gap-3 text-sm font-medium';
        const successStyle = 'bg-emerald-100 border-emerald-200 text-emerald-800';
        const errorStyle = 'bg-rose-100 border-rose-200 text-rose-800';
        const pendingStyle = 'bg-blue-100 border-blue-200 text-blue-800';

        const style = isPublishing ? pendingStyle : isError ? errorStyle : successStyle;

        const Icon = () => {
            if (isPublishing) {
                return <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
            }
            if (isError) {
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
            }
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        };

        return (
            <div className={`${baseStyle} ${style}`}>
                <span className="flex-shrink-0"><Icon /></span>
                <p className="flex-grow break-words">{message}</p>
            </div>
        );
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500">Configure and publish your application data to GitHub.</p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80 max-w-3xl">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-xl text-slate-700 mb-2">GitHub Publish Settings</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Configure your repository details to publish the application's data. This includes all users, questions, and folder structures.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input name="githubOwner" value={formState.githubOwner} onChange={handleInputChange} placeholder="Repository Owner" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            <input name="githubRepo" value={formState.githubRepo} onChange={handleInputChange} placeholder="Repository Name" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            <input name="githubPath" value={formState.githubPath} onChange={handleInputChange} placeholder="File Path in Repo" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            <input type="password" name="githubPat" value={formState.githubPat} onChange={handleInputChange} placeholder="Personal Access Token (PAT)" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                        </div>
                        <p className="text-xs text-slate-500 mb-6">
                            Requires a <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Classic PAT</a> with the full `repo` scope. The token is stored securely in the database.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6">
                            <button onClick={handleSaveSettings} disabled={isPublishing} className="bg-indigo-500 text-white font-semibold rounded-lg py-2.5 px-6 hover:bg-indigo-600 transition-colors disabled:bg-slate-300">
                                Save Settings
                            </button>
                            <button onClick={handlePublish} disabled={isPublishing} className="bg-emerald-500 text-white font-semibold rounded-lg py-2.5 px-6 hover:bg-emerald-600 transition-colors disabled:bg-slate-300 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h10zm-3 2H8v2h4V5zm2 4H8v2h6V9zm-2 4H8v2h4v-2z" /></svg>
                                {isPublishing ? 'Publishing...' : 'Publish to GitHub'}
                            </button>
                        </div>
                        <StatusDisplay />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
