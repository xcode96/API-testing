
import React from 'react';
import CircularProgress from './CircularProgress';
import { User } from '../types';

interface SidebarProps {
  userName: string;
  completedCount: number;
  totalCount: number;
  progress: number;
  onReset: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
  currentUser: User | null;
}

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
  <div className="bg-slate-100/80 rounded-lg p-4 text-center">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-semibold text-slate-700">{value}</p>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ userName, completedCount, totalCount, progress, onReset, onAdminClick, onLogout, currentUser }) => {
  const remainingCount = totalCount - completedCount;

  return (
    <aside className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-6 sticky top-8 shadow-lg shadow-slate-200/80">
      <div className="text-center">
        <h2 className="text-xl font-light text-slate-500">Welcome,</h2>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">{userName}</h1>
      </div>

      <CircularProgress progress={progress} />

      <div className="w-full grid grid-cols-2 gap-4">
        <StatCard label="Modules Done" value={`${completedCount} / ${totalCount}`} />
        <StatCard label="Modules Left" value={remainingCount} />
      </div>
      
      {progress === 100 && (
         <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg w-full">
            <p className="font-bold text-emerald-600">Great Job!</p>
            <p className="text-sm text-slate-500">You've completed all training.</p>
         </div>
      )}
      
      <div className="w-full border-t border-slate-200 mt-2 pt-4 flex flex-col gap-2">
        {currentUser?.role === 'admin' && (
          <button 
            onClick={onAdminClick}
            className="w-full bg-slate-700 text-white rounded-lg py-2 px-4 hover:bg-slate-800 transition-colors duration-300 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-1 4a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1z" />
              <path fillRule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4z" clipRule="evenodd" />
              </svg>
            Admin Panel
          </button>
        )}

        <button 
          onClick={onReset}
          className="w-full bg-slate-200 text-slate-600 rounded-lg py-2 px-4 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300">
          Reset Progress
        </button>

        <button 
          onClick={onLogout}
          className="w-full bg-rose-500 text-white rounded-lg py-2 px-4 hover:bg-rose-600 transition-colors duration-300 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;