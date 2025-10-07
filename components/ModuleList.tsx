import React from 'react';
import ModuleItem from './ModuleItem';
import { Module } from '../types';

interface ModuleListProps {
  modules: Module[];
  onStartQuiz: (moduleId: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, onStartQuiz }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/80">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Training Modules</h2>
      <div className="space-y-4">
        {modules.map(module => (
          <ModuleItem
            key={module.id}
            module={module}
            onStartQuiz={() => onStartQuiz(module.id)}
          />
        ))}
      </div>
      <p className="text-center text-slate-500 mt-8 text-sm">
        Complete all modules to unlock your final report.
      </p>
    </div>
  );
};

export default ModuleList;
