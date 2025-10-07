

import React from 'react';
import { Quiz, Question, User, Email, AppSettings } from '../../types';
import { AdminView } from '../../App';
import AdminSidebar from './AdminSidebar';
import QuestionForm from './QuestionForm';
import DataManagement from './DataManagement';
import UserManagement from './UserManagement';
import NotificationLog from './NotificationLog';
import SettingsPanel from './SettingsPanel';


interface AdminPanelProps {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onLogout: () => void;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  emailLog: Email[];
  onSendNotification: (emailData: Omit<Email, 'id' | 'timestamp'>) => void;
  settings: AppSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const QuestionManagement: React.FC<{
  quizzes: Quiz[]; 
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>
}> = ({ quizzes, setQuizzes }) => {
  
  const addQuestion = (newQuestion: Question) => {
    setQuizzes(prevQuizzes => {
      return prevQuizzes.map(quiz => {
        if (quiz.name === newQuestion.category) {
          const updatedQuestions = [...quiz.questions, { ...newQuestion, id: Date.now() }];
          return { ...quiz, questions: updatedQuestions };
        }
        return quiz;
      });
    });
  };

  return (
    <>
       <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Question Management</h1>
        <p className="text-slate-500">Manage quiz content and data workflow.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Question</h2>
          <QuestionForm categories={quizzes.map(q => q.name)} onAddQuestion={addQuestion} />
        </div>
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Management</h2>
          <DataManagement quizzes={quizzes} setQuizzes={setQuizzes} />
        </div>
      </div>
    </>
  )
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { onLogout, activeView, setActiveView, quizzes, setQuizzes, users, setUsers, emailLog, onSendNotification, settings, onSettingsChange } = props;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex">
      <AdminSidebar onLogout={onLogout} activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-auto">
        
        {activeView === 'questions' && <QuestionManagement quizzes={quizzes} setQuizzes={setQuizzes} />}
        {activeView === 'users' && <UserManagement users={users} setUsers={setUsers} onSendNotification={onSendNotification} settings={settings} />}
        {activeView === 'notifications' && <NotificationLog emailLog={emailLog} />}
        {activeView === 'settings' && <SettingsPanel settings={settings} onSettingsChange={onSettingsChange} />}
      </main>
    </div>
  );
};

export default AdminPanel;