import React from 'react';
import { Module, ModuleStatus } from '../types';
import { ICONS } from '../constants';

interface ModuleItemProps {
  module: Module;
  onStartQuiz: () => void;
}

const statusStyles: { [key in ModuleStatus]: { text: string; bg: string; } } = {
  [ModuleStatus.NotStarted]: {
    text: 'text-slate-500',
    bg: 'bg-slate-100',
  },
  [ModuleStatus.InProgress]: {
    text: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  [ModuleStatus.Completed]: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
};

const ModuleItem: React.FC<ModuleItemProps> = ({ module, onStartQuiz }) => {
  const { title, questions, iconKey, status, theme } = module;
  const styles = statusStyles[status];

  return (
    <div className="flex items-center bg-white p-4 rounded-lg border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className={`mr-4 p-3 rounded-lg ${theme.iconBg} ${theme.iconColor}`}>
        {ICONS[iconKey as keyof typeof ICONS]}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{questions} Question{questions > 1 ? 's' : ''}</p>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <span className={`hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles.text} ${styles.bg}`}>
          {status}
        </span>
        <button 
          onClick={onStartQuiz}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform ${
            status === ModuleStatus.Completed 
              ? 'bg-transparent border border-slate-300 text-slate-500 hover:bg-slate-100' 
              : 'bg-indigo-500 text-white hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/30'
          }`}
        >
          {status === ModuleStatus.Completed ? 'Review' : 'Start'}
          {status !== ModuleStatus.Completed && <span className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity">»</span>}
        </button>
      </div>
    </div>
  );
};

export default ModuleItem;