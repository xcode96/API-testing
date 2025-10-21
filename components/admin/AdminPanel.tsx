





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
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onLogout: () => void;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  emailLog: Email[];
  onSendNotification: (emailData: Omit<Email, 'id' | 'timestamp'>) => void;
  settings: AppSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AppSettings | null>>;
  moduleCategories: ModuleCategory[];
  onCreateExamCategory: (title: string) => void;
  onEditExamCategory: (categoryId: string, newTitle: string) => void;
  onDeleteExamCategory: (categoryId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  quizzes,
  setQuizzes,
  users,
  setUsers,
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
}) => {
  const [questionFilter, setQuestionFilter] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onCreateExamCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };
  
  const handleAddQuestion = (newQuestionData: Omit<Question, 'id'>) => {
      setQuizzes(prevQuizzes => {
          const newQuizzes = prevQuizzes.map(q => ({...q, questions: [...q.questions]}));
          const quizIndex = newQuizzes.findIndex(q => q.name === newQuestionData.category);

          if (quizIndex > -1) {
              const newQuestion: Question = {
                  ...newQuestionData,
                  id: Date.now(),
              };
              newQuizzes[quizIndex].questions.push(newQuestion);
              alert(`Question added to "${newQuestionData.category}"!`);
          } else {
              console.error(`Quiz category "${newQuestionData.category}" not found.`);
              alert("Error: Could not find the selected quiz category to add the question to.");
          }
          return newQuizzes;
      });
  };
  
  const activeCategoryName = useMemo(() => {
      if (!questionFilter) return null;
      // The filter is a module ID, which corresponds to a quiz ID
      const quiz = quizzes.find(q => q.id === questionFilter);
      return quiz ? quiz.name : null;
  }, [questionFilter, quizzes]);


  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement users={users} setUsers={setUsers} onSendNotification={onSendNotification} settings={settings} moduleCategories={moduleCategories} />;
      case 'notifications':
        return <NotificationLog emailLog={emailLog} />;
      case 'settings':
        return <SettingsPanel settings={settings} onSettingsChange={onSettingsChange as React.Dispatch<React.SetStateAction<AppSettings>>} />;
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
                    setQuizzes={setQuizzes} 
                    moduleCategories={moduleCategories} 
                    questionFilter={questionFilter}
                    onEditExamCategory={onEditExamCategory}
                    onDeleteExamCategory={onDeleteExamCategory}
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
                        categories={quizzes.map(q => q.name)}
                        onAddQuestion={handleAddQuestion}
                        activeCategory={activeCategoryName}
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