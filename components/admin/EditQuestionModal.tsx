import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../../types';

interface EditQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: Question;
    onUpdate: (question: Question) => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ isOpen, onClose, question, onUpdate }) => {
    const [formData, setFormData] = useState(question);

    useEffect(() => {
        setFormData(question);
    }, [question]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.question && formData.options.every(o => o) && formData.correctAnswer) {
            onUpdate(formData);
        } else {
            alert("Please fill out all fields.");
        }
    };

    const validOptions = useMemo(() => formData.options.filter(o => o.trim() !== ''), [formData.options]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-xl relative transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Edit Question</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            disabled
                            className="w-full p-2 bg-slate-100 border-2 border-slate-300 rounded-lg focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Question Text</label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    {formData.options.map((option, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-slate-600 mb-1">{`Option ${index + 1}`}</label>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Correct Answer</label>
                        <select
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleInputChange}
                            disabled={validOptions.length === 0}
                            className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                        >
                            <option value="" disabled>Select the correct answer</option>
                            {validOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 mt-4">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold rounded-lg py-2 px-5 hover:bg-slate-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-5 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQuestionModal;
