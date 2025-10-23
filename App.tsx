import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ModuleList from './components/ModuleList';
import QuizView from './components/QuizView';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/admin/AdminPanel';
import UserLoginPage from './components/UserLoginPage';
import FinalReport from './components/FinalReport';
import CompletionScreen from './components/CompletionScreen';
import { ICONS, INITIAL_MODULE_CATEGORIES, THEMES } from './constants';
import { PASSING_PERCENTAGE } from './quizzes';
import { Module, ModuleStatus, Quiz, User, UserAnswer, Email, AppSettings, ModuleCategory, Question, GithubSyncStatus } from './types';
import { sendEmail } from './services/emailService';
import { fetchData, saveData, triggerGithubSync } from './services/api';

type View = 'user_login' | 'dashboard' | 'login' | 'admin' | 'report' | 'completion';
export type AdminView = 'users' | 'questions' | 'notifications' | 'settings';

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [emailLog, setEmailLog] = useState<Email[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [moduleCategoriesState, setModuleCategoriesState] = useState<ModuleCategory[]>([]);
  const [githubSyncStatus, setGithubSyncStatus] = useState<GithubSyncStatus>({ status: 'idle' });

  const saveTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    fetchData()
      .then(data => {
        setQuizzes(data.quizzes);
        setUsers(data.users);
        setEmailLog(data.emailLog || []);
        setSettings(data.settings);
        
        if (data.moduleCategories && data.moduleCategories.length > 0) {
            setModuleCategoriesState(data.moduleCategories);
        } else {
            const existingQuizIds = new Set(data.quizzes.map(q => q.id));
            let syncedModuleCategories = INITIAL_MODULE_CATEGORIES.map(category => ({
                ...category,
                modules: category.modules.filter(module => existingQuizIds.has(module.id))
            }));
            const knownModuleIds = new Set(syncedModuleCategories.flatMap(c => c.modules).map(m => m.id));
            data.quizzes.forEach((quiz, index) => {
              if (!knownModuleIds.has(quiz.id)) {
                const totalModules = syncedModuleCategories.flatMap(c => c.modules).length + index;
                const iconKeys = Object.keys(ICONS);
                const newIconKey = iconKeys[totalModules % iconKeys.length];
                const newTheme = THEMES[totalModules % THEMES.length];
                const newModule: Module = {
                  id: quiz.id,
                  title: quiz.name,
                  questions: quiz.questions.length,
                  iconKey: newIconKey,
                  status: ModuleStatus.NotStarted,
                  theme: newTheme,
                };
                const newCategory: ModuleCategory = {
                  id: quiz.id,
                  title: quiz.name,
                  modules: [newModule],
                };
                syncedModuleCategories.push(newCategory);
              }
            });
            setModuleCategoriesState(syncedModuleCategories);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load application data. Please try again later.");
        setModuleCategoriesState(INITIAL_MODULE_CATEGORIES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || !settings) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      setGithubSyncStatus({ status: 'syncing' });
      const dataToSync = { users, quizzes, emailLog, settings, moduleCategories: moduleCategoriesState };
      saveData(dataToSync)
        .catch(err => console.error("Failed to save data:", err));
      triggerGithubSync(dataToSync)
        .then(result => {
            if (result.success) {
                setGithubSyncStatus({ status: 'success', timestamp: new Date().toISOString() });
            } else {
                setGithubSyncStatus({ status: 'error', message: result.error || 'Unknown sync error' });
            }
        })
        .catch(err => {
            setGithubSyncStatus({ status: 'error', message: (err as Error).message });
            console.error("Failed to sync data to GitHub:", err);
        });
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [users, quizzes, emailLog, settings, loading, moduleCategoriesState]);

  const [view, setView] = useState<View>('user_login');
  const [adminView, setAdminView] = useState<AdminView>('users');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const handleAdminLogin = (success: boolean) => {
    if (success) setView('admin');
  };

  const handleUserLogin = (user: User | null) => {
    if (user) {
      setCurrentUser(user);
      if (user.trainingStatus === 'passed' || user.trainingStatus === 'failed') {
          setView('completion');
      } else {
          setView('dashboard');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('user_login');
    setActiveQuizId(null);
  };
  
  const handleCreateExamCategory = (title: string): string | undefined => {
    const newId = title.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
    if (quizzes.some(q => q.name.toLowerCase() === title.toLowerCase()) || moduleCategoriesState.some(c => c.id === newId)) {
      alert("An exam category with a similar name already exists.");
      return undefined;
    }
    const newQuiz: Quiz = { id: newId, name: title, questions: [] };
    const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
    const iconKeys = Object.keys(ICONS);
    const newIconKey = iconKeys[totalModules % iconKeys.length];
    const newModule: Module = { id: newId, title: title, questions: 0, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: THEMES[totalModules % THEMES.length] };
    const newCategory: ModuleCategory = { id: newId, title: title, modules: [newModule] };
    setQuizzes(prev => [...prev, newQuiz]);
    setModuleCategoriesState(prev => [...prev, newCategory]);
    setUsers(prevUsers => prevUsers.map(user => {
        if (user.role === 'user') {
            const assignedExams = new Set(user.assignedExams || []);
            assignedExams.add(newId);
            return { ...user, assignedExams: Array.from(assignedExams) };
        }
        return user;
    }));
    return newId;
  };

  const handleEditExamCategory = (categoryId: string, newTitle: string) => {
      if (!newTitle || newTitle.trim() === "") {
          alert("Category name cannot be empty.");
          return;
      }
      setModuleCategoriesState(prev => prev.map(c => c.id === categoryId ? { ...c, title: newTitle, modules: c.modules.map(m => m.id === categoryId ? { ...m, title: newTitle } : m) } : c ));
      setQuizzes(prev => prev.map(q => q.id === categoryId ? { ...q, name: newTitle } : q ));
  };

  const handleDeleteExamCategory = (categoryId: string) => {
    const categoryToDelete = moduleCategoriesState.find(c => c.id === categoryId);
    if (!categoryToDelete) return;
    if (window.confirm(`Are you sure you want to delete the entire exam folder "${categoryToDelete.title}" and all its questions? This action cannot be undone.`)) {
        const moduleIdsToDelete = new Set(categoryToDelete.modules.map(m => m.id));
        setModuleCategoriesState(prev => prev.filter(c => c.id !== categoryId));
        setQuizzes(prev => prev.filter(q => !moduleIdsToDelete.has(q.id)));
        setUsers(prevUsers => prevUsers.map(user => ({ ...user, assignedExams: user.assignedExams?.filter(id => id !== categoryId) })));
    }
  };
  
    const handleAddNewQuestion = (newQuestionData: Omit<Question, 'id' | 'category'>, quizId: string) => {
        const quizToUpdate = quizzes.find(q => q.id === quizId);
        if (!quizToUpdate) {
            alert("Error: Could not find the selected quiz to add the question to.");
            return;
        }
        const newQuestion: Question = { ...newQuestionData, id: Date.now(), category: quizToUpdate.name };
        const newQuizzes = quizzes.map(q => q.id === quizId ? { ...q, questions: [...q.questions, newQuestion] } : q);
        setQuizzes(newQuizzes);
        const newQuestionCount = (newQuizzes.find(q => q.id === quizId))?.questions.length || 0;
        setModuleCategoriesState(prev => prev.map(c => ({ ...c, modules: c.modules.map(m => m.id === quizId ? { ...m, questions: newQuestionCount } : m) })));
        alert(`Question added to "${quizToUpdate.name}"!`);
    };

    const handleAddQuestionToNewCategory = (newQuestionData: Omit<Question, 'id'>, categoryTitle: string) => {
      if (quizzes.some(q => q.name.toLowerCase() === categoryTitle.toLowerCase())) {
        alert("An exam category with this name already exists.");
        return;
      }
      const newId = categoryTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
      const newQuestion: Question = { ...newQuestionData, id: Date.now() };
      const newQuiz: Quiz = { id: newId, name: categoryTitle, questions: [newQuestion] };
      const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
      const iconKeys = Object.keys(ICONS);
      const newIconKey = iconKeys[totalModules % iconKeys.length];
      const newModule: Module = { id: newId, title: categoryTitle, questions: 1, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: THEMES[totalModules % THEMES.length] };
      const newCategory: ModuleCategory = { id: newId, title: categoryTitle, modules: [newModule] };
      setQuizzes(prev => [...prev, newQuiz]);
      setModuleCategoriesState(prev => [...prev, newCategory]);
      setUsers(prevUsers => prevUsers.map(user => {
          if (user.role === 'user') {
              const assignedExams = new Set(user.assignedExams || []);
              assignedExams.add(newId);
              return { ...user, assignedExams: Array.from(assignedExams) };
          }
          return user;
      }));
      alert(`Category "${categoryTitle}" created and question added!`);
    };

    const handleAddQuestionToNewSubTopic = (newQuestionData: Omit<Question, 'id'>, subTopicTitle: string, parentCategoryId: string) => {
        if (quizzes.some(q => q.name.toLowerCase() === subTopicTitle.toLowerCase())) {
            alert("A quiz with this sub-topic name already exists.");
            return;
        }
        const newQuizId = subTopicTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
        const newQuestion: Question = { ...newQuestionData, id: Date.now(), category: subTopicTitle };
        const newQuiz: Quiz = { id: newQuizId, name: subTopicTitle, questions: [newQuestion] };
        const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
        const iconKeys = Object.keys(ICONS);
        const newIconKey = iconKeys[totalModules % iconKeys.length];
        const newModule: Module = { id: newQuizId, title: subTopicTitle, questions: 1, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: THEMES[totalModules % THEMES.length] };
        setQuizzes(prev => [...prev, newQuiz]);
        setModuleCategoriesState(prev => prev.map(c => c.id === parentCategoryId ? { ...c, modules: [...c.modules, newModule] } : c));
        const parentCategory = moduleCategoriesState.find(c => c.id === parentCategoryId);
        alert(`Sub-topic "${subTopicTitle}" created in "${parentCategory?.title}" and question added!`);
    };

    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuizzes(prevQuizzes => prevQuizzes.map(quiz => ({ ...quiz, questions: quiz.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q) })));
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        let quizIdOfDeletedQuestion: string | null = null;
        const newQuizzes = quizzes.map(quiz => {
            const updatedQuestions = quiz.questions.filter(q => q.id !== questionId);
            if (updatedQuestions.length < quiz.questions.length) quizIdOfDeletedQuestion = quiz.id;
            return { ...quiz, questions: updatedQuestions };
        });
        setQuizzes(newQuizzes);
        if (quizIdOfDeletedQuestion) {
            const finalQuizId = quizIdOfDeletedQuestion;
            setModuleCategoriesState(prev => prev.map(c => ({...c, modules: c.modules.map(m => m.id === finalQuizId ? { ...m, questions: newQuizzes.find(q => q.id === finalQuizId)?.questions.length || 0 } : m)})));
        }
    };

    const handleImportFolderStructure = (folderStructure: Record<string, Omit<Question, 'id'|'category'>[]>, targetCategoryId: string) => {
        const newQuizzes: Quiz[] = [];
        const newModules: Module[] = [];
        const existingQuizNames = new Set(quizzes.map(q => q.name.toLowerCase()));
        for (const subTopicTitle in folderStructure) {
            if (Object.prototype.hasOwnProperty.call(folderStructure, subTopicTitle)) {
                if (existingQuizNames.has(subTopicTitle.toLowerCase())) continue;
                const questionsData = folderStructure[subTopicTitle];
                const newQuizId = subTopicTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
                const newQuestions: Question[] = questionsData.map((q, i) => ({ ...q, id: Date.now() + i, category: subTopicTitle }));
                newQuizzes.push({ id: newQuizId, name: subTopicTitle, questions: newQuestions });
                const totalModules = moduleCategoriesState.flatMap(c => c.modules).length + newModules.length;
                const iconKeys = Object.keys(ICONS);
                const newIconKey = iconKeys[totalModules % iconKeys.length];
                newModules.push({ id: newQuizId, title: subTopicTitle, questions: newQuestions.length, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: THEMES[totalModules % THEMES.length] });
            }
        }
        if (newQuizzes.length > 0) {
            setQuizzes(prev => [...prev, ...newQuizzes]);
            setModuleCategoriesState(prev => prev.map(c => c.id === targetCategoryId ? { ...c, modules: [...c.modules, ...newModules] } : c));
            alert(`Successfully imported ${newModules.length} new sub-topic(s).`);
        } else {
            alert("No new sub-topics imported; they may already exist.");
        }
    };

    const handleUpdateUsers = (updatedUsers: User[]) => setUsers(updatedUsers);
    const handleAddNewUser = (user: User) => setUsers(prev => [...prev, user]);

    const handleSendNotification = (emailData: Omit<Email, 'id' | 'timestamp'>) => {
        const newEmail: Email = { ...emailData, id: Date.now(), timestamp: new Date().toISOString() };
        sendEmail(emailData);
        setEmailLog(prev => [newEmail, ...prev]);
    };

    const handleCompletion = (score: number, answers: UserAnswer[], quizId: string) => {
        if (!currentUser) return;
        const newModuleProgress = { ...(currentUser.moduleProgress || {}), [quizId]: ModuleStatus.Completed };
        const allUserAnswers = [...(currentUser.answers || []).filter(a => !answers.map(qa => qa.questionId).includes(a.questionId)), ...answers];
        let updatedUser: User = { ...currentUser, moduleProgress: newModuleProgress, answers: allUserAnswers };
        const allModulesForUser = moduleCategoriesState.filter(c => currentUser.assignedExams?.includes(c.id)).flatMap(c => c.modules);
        const completedModulesCount = Object.values(newModuleProgress).filter(s => s === ModuleStatus.Completed).length;
        if (completedModulesCount === allModulesForUser.length) {
            const totalCorrect = allUserAnswers.filter(a => a.isCorrect).length;
            const totalQuestions = allUserAnswers.length;
            const finalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
            updatedUser = { ...updatedUser, lastScore: finalScore, trainingStatus: finalScore >= PASSING_PERCENTAGE ? 'passed' : 'failed', submissionDate: new Date().toISOString() };
            setView('completion');
        } else {
            setActiveQuizId(null);
        }
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    };

    const handleResetProgress = () => {
        if (!currentUser || !window.confirm("Are you sure?")) return;
        const resetUser = { ...currentUser, moduleProgress: {}, answers: [], lastScore: null, trainingStatus: 'not-started' as const };
        setCurrentUser(resetUser);
        setUsers(users.map(u => u.id === currentUser.id ? resetUser : u));
    };

    const userModules = useMemo(() => {
        if (!currentUser) return [];
        return moduleCategoriesState
          .filter(c => currentUser.assignedExams?.includes(c.id))
          .map(category => ({
              ...category,
              modules: category.modules.map(module => ({
                  ...module,
                  status: currentUser.moduleProgress?.[module.id] || ModuleStatus.NotStarted,
              }))
          }));
    }, [currentUser, moduleCategoriesState]);

    const { completedCount, totalCount, progress } = useMemo(() => {
        if (!currentUser) return { completedCount: 0, totalCount: 0, progress: 0 };
        const modules = userModules.flatMap(c => c.modules);
        const completed = modules.filter(m => m.status === ModuleStatus.Completed).length;
        const total = modules.length;
        return { completedCount: completed, totalCount: total, progress: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [userModules, currentUser]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    const activeQuiz = activeQuizId ? quizzes.find(q => q.id === activeQuizId) : null;
    const activeModule = activeQuizId ? userModules.flatMap(c => c.modules).find(m => m.id === activeQuizId) : null;

    switch (view) {
        case 'login': return <LoginPage onLogin={handleAdminLogin} users={users} />;
        case 'user_login': return <UserLoginPage users={users} onLogin={handleUserLogin} />;
        case 'admin': return settings ? <AdminPanel quizzes={quizzes} users={users} onUpdateUsers={handleUpdateUsers} onAddNewUser={handleAddNewUser} onLogout={handleLogout} activeView={adminView} setActiveView={setAdminView} emailLog={emailLog} onSendNotification={handleSendNotification} settings={settings} onSettingsChange={setSettings} moduleCategories={moduleCategoriesState} onCreateExamCategory={handleCreateExamCategory} onEditExamCategory={handleEditExamCategory} onDeleteExamCategory={handleDeleteExamCategory} onAddNewQuestion={handleAddNewQuestion} onAddQuestionToNewCategory={handleAddQuestionToNewCategory} onAddQuestionToNewSubTopic={handleAddQuestionToNewSubTopic} onUpdateQuestion={handleUpdateQuestion} onDeleteQuestion={handleDeleteQuestion} onImportFolderStructure={handleImportFolderStructure} githubSyncStatus={githubSyncStatus} /> : null;
        case 'completion': return <CompletionScreen currentUser={currentUser} onGenerateReport={() => setView('report')} onLogout={handleLogout} />;
        case 'report': return currentUser?.answers ? <FinalReport answers={currentUser.answers} onBack={() => setView('dashboard')} /> : null;
        case 'dashboard':
        default:
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans">
                    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-4 xl:col-span-3">
                                {currentUser && <Sidebar userName={currentUser.fullName} completedCount={completedCount} totalCount={totalCount} progress={progress} onReset={handleResetProgress} onAdminClick={() => setView('login')} onLogout={handleLogout} currentUser={currentUser} />}
                            </div>
                            <div className="lg:col-span-8 xl:col-span-9">
                                {activeQuiz && activeModule ? (
                                    <div className="flex justify-center">
                                        <QuizView quiz={activeQuiz} theme={activeModule.theme} onComplete={(score, answers) => handleCompletion(score, answers, activeQuiz.id)} />
                                    </div>
                                ) : (
                                    <ModuleList moduleCategories={userModules} onStartQuiz={setActiveQuizId} />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            );
    }
}

export default App;
