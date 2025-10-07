import React from 'react';

interface RestoreBackupPromptProps {
    backupTimestamp: number;
    onRestore: () => void;
    onDismiss: () => void;
}

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

const RestoreBackupPrompt: React.FC<RestoreBackupPromptProps> = ({ backupTimestamp, onRestore, onDismiss }) => {
    const backupDate = new Date(backupTimestamp).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl text-center flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                    <HistoryIcon />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Restore Session?</h2>
                <p className="text-slate-500 my-4">
                    It looks like the application may have closed unexpectedly. We have an automatic backup saved from <strong className="text-slate-700">{backupDate}</strong>.
                </p>
                <p className="text-slate-500 mb-6">
                    Would you like to restore this session?
                </p>
                <div className="flex justify-center gap-4 w-full sm:w-auto">
                    <button onClick={onDismiss} className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold rounded-lg py-3 px-8 hover:bg-slate-300 transition-colors">
                        Dismiss
                    </button>
                    <button onClick={onRestore} className="w-full sm:w-auto bg-indigo-500 text-white font-semibold rounded-lg py-3 px-8 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30">
                        Restore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestoreBackupPrompt;
