


import React, { useState, useMemo, useEffect } from 'react';
import { Question, ModuleCategory, Quiz } from '../../types';

interface QuestionFormProps {
  moduleCategories: ModuleCategory[];
  quizzes: Quiz[];
  onAddQuestion: (question: Omit<Question, 'id' | 'category'>, quizId: string) => void;
  onAddQuestionToNewCategory: (question: Omit<Question, 'id'>, categoryTitle: string) => void;
  onAddQuestionToNewSubTopic: (question: Omit<Question, 'id'>, subTopicTitle: string, parentCategoryId: string) => void;
  activeFilterId: string | null;
}

const initialFormState = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
};

const CREATE_NEW_FOLDER_VALUE = '__CREATE_NEW_FOLDER__';
const CREATE_NEW_SUBTOPIC_VALUE = '__CREATE_NEW_SUBTOPIC__';

const QuestionForm: React.FC<QuestionFormProps> = ({
  moduleCategories,
  quizzes,
  onAddQuestion,
  onAddQuestionToNewCategory,
  onAddQuestionToNewSubTopic,
  activeFilterId,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [selectedSubTopicId, setSelectedSubTopicId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newSubTopicName, setNewSubTopicName] = useState('');

  useEffect(() => {
    if (activeFilterId) {
      setSelectedFolderId(activeFilterId);
      setSelectedSubTopicId('');
    } else {
      setSelectedFolderId('');
      setSelectedSubTopicId('');
    }
  }, [activeFilterId]);

  const isCreatingNewFolder = selectedFolderId === CREATE_NEW_FOLDER_VALUE;
  const isCreatingNewSubTopic = selectedSubTopicId === CREATE_NEW_SUBTOPIC_VALUE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    const oldOptionValue = newOptions[index];
    newOptions[index] = value;
    
    if (formData.correctAnswer === oldOptionValue) {
      setFormData(prev => ({ ...prev, options: newOptions, correctAnswer: '' }));
    } else {
      setFormData(prev => ({ ...prev, options: newOptions }));
    }
  };
  
  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedFolderId(e.target.value);
      setSelectedSubTopicId('');
  };

  const handleSubTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedSubTopicId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseQuestionPayload = {
        question: formData.question,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
    };
    
    if (!formData.question || !formData.options.every(o => o.trim()) || !formData.correctAnswer) {
        alert("Please fill out the question, all four options, and select a correct answer.");
        return;
    }

    if (isCreatingNewFolder) {
        if (!newFolderName.trim()) {
            alert("Please provide a name for the new exam folder.");
            return;
        }
        const questionPayload = { ...baseQuestionPayload, category: newFolderName.trim() };
        onAddQuestionToNewCategory(questionPayload, newFolderName.trim());
        setNewFolderName('');
        setSelectedFolderId('');
    } else if (isCreatingNewSubTopic) {
        if (!newSubTopicName.trim()) {
            alert("Please provide a name for the new sub-topic.");
            return;
        }
        if (!selectedFolderId) {
            alert("Please select an exam folder for the new sub-topic.");
            return;
        }
        const questionPayload = { ...baseQuestionPayload, category: newSubTopicName.trim() };
        onAddQuestionToNewSubTopic(questionPayload, newSubTopicName.trim(), selectedFolderId);
        setNewSubTopicName('');
        setSelectedSubTopicId('');
    } else {
        if (!selectedSubTopicId) {
            alert("Please select an exam folder and a sub-topic.");
            return;
        }
        onAddQuestion(baseQuestionPayload, selectedSubTopicId);
    }
    
    setFormData(initialFormState);
  };
  
  const subTopicsForSelectedFolder = useMemo(() => {
    if (!selectedFolderId || isCreatingNewFolder) return [];
    const category = moduleCategories.find(c => c.id === selectedFolderId);
    return category ? category.modules : [];
  }, [selectedFolderId, moduleCategories, isCreatingNewFolder]);
  
  const validOptions = useMemo(() => formData.options.filter(o => o.trim() !== ''), [formData.options]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Exam Folder</label>
        <select
          value={selectedFolderId}
          onChange={handleFolderChange}
          className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        >
            <option value="" disabled>-- Select a folder --</option>
            {moduleCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
            <option value={CREATE_NEW_FOLDER_VALUE}>+ Create new exam folder...</option>
        </select>
      </div>

      {isCreatingNewFolder && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Folder Name</label>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="e.g., Finance Department Policy"
            className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            required={isCreatingNewFolder}
          />
        </div>
      )}

      {!isCreatingNewFolder && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Sub-Topic / Quiz</label>
            <select
              value={selectedSubTopicId}
              onChange={handleSubTopicChange}
              className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={!selectedFolderId || isCreatingNewFolder}
            >
                <option value="" disabled>-- Select a sub-topic --</option>
                {subTopicsForSelectedFolder.map(mod => <option key={mod.id} value={mod.id}>{mod.title}</option>)}
                <option value={CREATE_NEW_SUBTOPIC_VALUE}>+ Create new sub-topic...</option>
            </select>
          </div>
      )}

      {isCreatingNewSubTopic && !isCreatingNewFolder && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Sub-Topic Name</label>
          <input
            type="text"
            value={newSubTopicName}
            onChange={(e) => setNewSubTopicName(e.target.value)}
            placeholder="e.g., Anti-Bribery Policy"
            className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            required={isCreatingNewSubTopic}
          />
        </div>
      )}

      <div className="border-t border-slate-200 pt-4 mt-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">Question Text</label>
        <textarea
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          required
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
            required
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Correct Answer</label>
        <select
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={(e) => setFormData(prev => ({...prev, correctAnswer: e.target.value}))}
          disabled={validOptions.length === 0}
          className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          required
        >
          <option value="" disabled>Select the correct answer</option>
          {validOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
       <button
        type="submit"
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/30"
      >
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
