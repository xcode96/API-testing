
import React, { useState, useMemo, useEffect } from 'react';

import { Question } from '../../types';

interface QuestionFormProps {
  categories: string[];
  onAddQuestion: (question: Omit<Question, 'id'>) => void;
  activeCategory: string | null;
}

const initialFormState = {
  category: '',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
};

const QuestionForm: React.FC<QuestionFormProps> = ({ categories, onAddQuestion, activeCategory }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // This effect syncs the form's category with the active filter from the parent component.
    const categoryToSet = activeCategory || (categories.length > 0 ? categories[0] : '');
    if (categoryToSet && categories.includes(categoryToSet)) {
      setFormData(prev => ({ ...prev, category: categoryToSet }));
    } else if (categories.length > 0 && !categories.includes(formData.category)) {
      // If the current category is no longer valid (e.g., after an import), reset to the first available one.
      setFormData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [activeCategory, categories]);

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
    if (formData.category && formData.question && formData.options.every(o => o) && formData.correctAnswer) {
      const newQuestion: Omit<Question, 'id'> = {
          category: formData.category,
          question: formData.question,
          options: formData.options,
          correctAnswer: formData.correctAnswer,
      };
      onAddQuestion(newQuestion);
      setFormData({
          ...initialFormState,
          category: formData.category // keep category selected
      });
    } else {
        alert("Please fill out all fields.");
    }
  };
  
  const validOptions = useMemo(() => formData.options.filter(o => o.trim() !== ''), [formData.options]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          disabled={categories.length === 0}
        >
          {categories.length === 0 && <option>Create a category first</option>}
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
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
