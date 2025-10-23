import React, { useState, useMemo } from 'react';
import { Quiz, User, Email, AppSettings, ModuleCategory, Question } from '../../types';
import { AdminView } from '../../App';
import AdminSidebar from './AdminSidebar';
import DataManagement from './DataManagement';
import UserManagement from './UserManagement';
import NotificationLog from './NotificationLog';
import SettingsPanel from './SettingsPanel';
import QuestionForm from './QuestionForm';


interface AdminPanelProps {
  quizzes: Quiz[];
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  onAddNewUser: (user: User) => void;
  onLogout: () => void;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  emailLog: Email[];
  onSendNotification: (emailData: Omit<Email, 'id' | 'timestamp'>) => void;
  settings: AppSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings | null>>;
  moduleCategories: ModuleCategory[];
  onCreateExamCategory: (title: string) => string | undefined;
  onEditExamCategory: (categoryId: string, newTitle: string) => void;
  onDeleteExamCategory: (categoryId: string) => void;
  onAddNewQuestion: (question: Omit<Question, 'id' | 'category'>, quizId: string) => void;
  onAddQuestionToNewCategory: (question: Omit<Question, 'id'>, categoryTitle: string) => void;
  onAddQuestionToNewSubTopic: (question: Omit<Question, 'id'>, subTopicTitle: string, parentCategoryId: string) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
  onImportFolderStructure: (folderStructure: Record<string, any[]>, targetCategoryId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  quizzes,
  users,
  onUpdateUsers,
  onAddNewUser,
  onLogout,
  activeView,
  setActiveView,
  emailLog,
  onSendNotification,
  settings,
  onSettingsChange,
  moduleCategories,
  onCreateExamCategory,
  onEditExamCategory,
  onDeleteExamCategory,
  onAddNewQuestion,
  onAddQuestionToNewCategory,
  onAddQuestionToNewSubTopic,
  onUpdateQuestion,
  onDeleteQuestion,
  onImportFolderStructure,
}) => {
  const [questionFilter, setQuestionFilter] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      const newId = onCreateExamCategory(newCategoryName.trim());
      if (newId) {
        setQuestionFilter(newId);
      }
      setNewCategoryName('');
    }
  };
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement 
                    users={users} 
                    onUpdateUsers={onUpdateUsers}
                    onAddNewUser={onAddNewUser}
                    onSendNotification={onSendNotification} 
                    settings={settings} 
                    moduleCategories={moduleCategories} 
                />;
      case 'notifications':
        return <NotificationLog emailLog={emailLog} />;
      case 'settings':
        return <SettingsPanel 
                    settings={settings} 
                    onSettingsChange={onSettingsChange as React.Dispatch<React.SetStateAction<AppSettings>>}
                    users={users}
                    quizzes={quizzes}
                    emailLog={emailLog}
                    moduleCategories={moduleCategories}
                />;
      case 'questions':
        return (
          <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Question Management</h1>
                <p className="text-slate-500">Create, edit, and delete exam folders and their questions.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80 h-full">
                  <DataManagement 
                    quizzes={quizzes} 
                    moduleCategories={moduleCategories} 
                    questionFilter={questionFilter}
                    onEditExamCategory={onEditExamCategory}
                    onDeleteExamCategory={onDeleteExamCategory}
                    onUpdateQuestion={onUpdateQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onImportFolderStructure={onImportFolderStructure}
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="space-y-6 sticky top-8">
                   <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Exam Folder</h2>
                    <form onSubmit={handleCreateCategory} className="flex items-center gap-4">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Marketing Compliance"
                          className="flex-grow p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/30"
                        >
                          Create
                        </button>
                    </form>
                  </div>
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Question</h2>
                     <QuestionForm
                        moduleCategories={moduleCategories}
                        quizzes={quizzes}
                        onAddQuestion={onAddNewQuestion}
                        onAddQuestionToNewCategory={onAddQuestionToNewCategory}
                        onAddQuestionToNewSubTopic={onAddQuestionToNewSubTopic}
                        activeFilterId={questionFilter}
                      />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex">
      <AdminSidebar 
        onLogout={onLogout} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        moduleCategories={moduleCategories}
        questionFilter={questionFilter}
        setQuestionFilter={setQuestionFilter} 
      />
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default AdminPanel;