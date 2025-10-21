import React, { useState } from 'react';
import ModuleItem from './ModuleItem';
import { ModuleCategory } from '../types';
import { INITIAL_MODULE_CATEGORIES } from '../constants';

interface ModuleListProps {
  moduleCategories: ModuleCategory[];
  onStartQuiz: (moduleId: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({ moduleCategories, onStartQuiz }) => {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(INITIAL_MODULE_CATEGORIES[0]?.id || null);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6 px-2">Training Modules</h2>
      <div className="space-y-4">
        {moduleCategories.map(category => (
          <div key={category.id} className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/80 transition-all duration-300">
            <button
              onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
              className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-expanded={openCategoryId === category.id}
              aria-controls={`category-content-${category.id}`}
            >
              <h3 className="text-xl font-bold text-slate-800">{category.title}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-500 transform transition-transform duration-300 ${openCategoryId === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openCategoryId === category.id && (
              <div id={`category-content-${category.id}`} className="p-4 sm:p-5 border-t border-slate-200 space-y-4">
                {category.modules.map(module => (
                  <ModuleItem
                    key={module.id}
                    module={module}
                    onStartQuiz={() => onStartQuiz(module.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-slate-500 mt-8 text-sm">
        Complete all modules to unlock your final report.
      </p>
    </div>
  );
};

export default ModuleList;
