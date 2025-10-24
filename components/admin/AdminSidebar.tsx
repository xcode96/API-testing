

import React, { useMemo } from 'react';
import { AdminView } from '../../App';
import { ModuleCategory } from '../../types';

interface AdminSidebarProps {
    onLogout: () => void;
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    moduleCategories: ModuleCategory[];
    questionFilter: string | null;
    setQuestionFilter: (id: string | null) => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${active ? 'bg-indigo-500/10 text-indigo-600' : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-700'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, activeView, setActiveView, moduleCategories, questionFilter, setQuestionFilter }) => {
    
    const handleQuestionViewChange = (filterId: string | null) => {
        setActiveView('questions');
        setQuestionFilter(filterId);
    };
    
    const handleViewChange = (view: AdminView) => {
        setActiveView(view);
        setQuestionFilter(null);
    };

    const icons = {
        users: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>,
        questions: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
        notifications: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>,
        settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
        logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>,
        doc: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
    }

    return (
        <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="bg-indigo-500 p-2 rounded-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                   </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-700">Admin Panel</h1>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
                 <NavItem icon={icons.users} label="Users" active={activeView === 'users'} onClick={() => handleViewChange('users')} />
                 <NavItem icon={icons.notifications} label="Notifications" active={activeView === 'notifications'} onClick={() => handleViewChange('notifications')} />
                 <NavItem icon={icons.settings} label="Settings" active={activeView === 'settings'} onClick={() => handleViewChange('settings')} />
                 
                 <div className="pt-4 mt-4 border-t border-slate-200">
                    <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Exam Management</h3>
                    <div className="space-y-1">
                        <NavItem 
                          icon={icons.questions} 
                          label="All Questions" 
                          active={activeView === 'questions' && questionFilter === null} 
                          onClick={() => handleQuestionViewChange(null)} 
                        />
                        {moduleCategories.map(category => (
                             <NavItem 
                                key={category.id} 
                                icon={icons.doc}
                                label={category.title}
                                active={activeView === 'questions' && questionFilter === category.id}
                                onClick={() => handleQuestionViewChange(category.id)}
                             />
                        ))}
                    </div>
                 </div>
            </nav>
            <div className="mt-auto pt-2">
                <NavItem icon={icons.logout} label="Logout" onClick={onLogout} />
            </div>
        </aside>
    );
};

export default AdminSidebar;