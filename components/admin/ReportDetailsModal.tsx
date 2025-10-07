
import React from 'react';
import { User } from '../../types';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const correctAnswers = user.answers?.filter(a => a.isCorrect).length ?? 0;
    const totalQuestions = user.answers?.length ?? 0;
    const incorrectAnswers = totalQuestions - correctAnswers;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-xl relative transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">User Details</h2>
                        <p className="text-slate-500">{user.fullName} ({user.username})</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm text-slate-500">Overall Score</p>
                        <p className={`text-3xl font-bold ${user.lastScore && user.lastScore >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>{user.lastScore}%</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm text-slate-500">Correct Answers</p>
                        <p className="text-3xl font-bold text-emerald-500">{correctAnswers}</p>
                    </div>
                     <div className="bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm text-slate-500">Incorrect Answers</p>
                        <p className="text-3xl font-bold text-rose-500">{incorrectAnswers}</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    <h3 className="text-xl font-semibold text-slate-800">Answer Breakdown</h3>
                    {user.answers?.map(answer => (
                        <div key={answer.questionId} className={`p-4 rounded-lg border-l-4 ${answer.isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                            <p className="font-semibold text-slate-700 mb-2">{answer.questionText}</p>
                            <p className={`text-sm ${answer.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
                            </p>
                            {!answer.isCorrect && (
                                <p className="text-sm text-slate-500 mt-1">
                                    Correct answer: <span className="font-medium">{answer.correctAnswer}</span>
                                </p>
                            )}
                        </div>
                    ))}
                    {!user.answers && <p className="text-slate-500">No answer details available.</p>}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
