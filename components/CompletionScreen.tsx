

import React from 'react';
import { User } from '../types';

interface CompletionScreenProps {
  currentUser: User | null;
  onGenerateReport: () => void;
  onLogout: () => void;
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


const CompletionScreen: React.FC<CompletionScreenProps> = ({ currentUser, onGenerateReport, onLogout }) => {
    const didPass = currentUser?.trainingStatus === 'passed';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center shadow-lg shadow-slate-200/80">
                {didPass ? (
                    <>
                        <CheckCircleIcon />
                        <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-2">Training Passed!</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Congratulations, <span className="font-bold">{currentUser?.fullName || 'User'}</span>! You have successfully passed the assessment. Your results have been submitted.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                            <button
                                onClick={onGenerateReport}
                                className="bg-slate-200 text-slate-600 font-semibold rounded-lg py-3 px-8 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300"
                            >
                                View My Report
                            </button>
                            <button
                                onClick={onLogout}
                                className="bg-indigo-500 text-white font-semibold rounded-lg py-3 px-8 hover:bg-indigo-600 transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircleIcon />
                        <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-2">Requirement Not Met.</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Unfortunately, you did not meet the passing criteria for this assessment. Please contact your administrator for next steps.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                            <button
                                onClick={onGenerateReport}
                                className="bg-slate-200 text-slate-600 font-semibold rounded-lg py-3 px-8 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300"
                            >
                                View My Report
                            </button>
                           <button
                                onClick={onLogout}
                                className="bg-rose-500 text-white font-semibold rounded-lg py-3 px-8 hover:bg-rose-600 transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompletionScreen;
