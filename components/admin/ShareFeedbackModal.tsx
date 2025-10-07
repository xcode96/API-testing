import React, { useMemo, useState } from 'react';
import { User } from '../../types';
import { INITIAL_QUIZZES, PASSING_PERCENTAGE } from '../../quizzes';

interface ShareFeedbackModalProps {
    user: User;
    onClose: () => void;
}

const ShareFeedbackModal: React.FC<ShareFeedbackModalProps> = ({ user, onClose }) => {
    const [copied, setCopied] = useState(false);

    const failedModules = useMemo(() => {
        if (!user || !user.answers) return [];

        return INITIAL_QUIZZES.map(quiz => {
            const moduleQuestionIds = quiz.questions.map(q => q.id);
            const moduleAnswers = user.answers.filter(a => moduleQuestionIds.includes(a.questionId));
            
            if (moduleAnswers.length === 0) return null;

            const correctCount = moduleAnswers.filter(a => a.isCorrect).length;
            const score = Math.round((correctCount / moduleAnswers.length) * 100);

            if (score < PASSING_PERCENTAGE) {
                return quiz.name;
            }
            return null;
        }).filter((name): name is string => name !== null);

    }, [user]);

    const feedbackText = `Hi ${user.fullName},\n\nFollowing your recent Cyber Security assessment, please review the following topics to improve your understanding:\n\n${failedModules.length > 0 ? failedModules.map(name => `- ${name}`).join('\n') : '- General review of all topics.'}\n\nThank you.`;

    const handleCopy = () => {
        navigator.clipboard.writeText(feedbackText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-xl relative transform" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Share Feedback</h2>
                        <p className="text-slate-500">Copy this message to share with {user.fullName}.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="bg-slate-100/80 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-200">
                    {feedbackText}
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-slate-200">
                    <button onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold rounded-lg py-2 px-5 hover:bg-slate-300 transition-colors">
                        Close
                    </button>
                    <button onClick={handleCopy} className={`font-semibold rounded-lg py-2 px-5 transition-colors shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/30'}`}>
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareFeedbackModal;
