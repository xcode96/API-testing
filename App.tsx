
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Quiz, ModuleCategory, ModuleStatus, UserAnswer, AppSettings, Question, Theme, Module } from './types';
import { INITIAL_QUIZZES, PASSING_PERCENTAGE } from './quizzes';
import { INITIAL_MODULE_CATEGORIES } from './constants';
import { AppData, fetchData, saveData } from './services/api';

import UserLoginPage from './components/UserLoginPage';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import ModuleList from './components/ModuleList';
import QuizView from './components/QuizView';
import CompletionScreen from './components/CompletionScreen';
import FinalReport from './components/FinalReport';
import AdminPanel from './components/admin/AdminPanel';

export type AdminView = 'users' | 'questions' | 'settings';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [moduleCategories, setModuleCategories] = useState<ModuleCategory[]>([]);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [view, setView] = useLocalStorage<string>('view', 'userLogin');
    const [activeQuizId, setActiveQuizId] = useLocalStorage<string | null>('activeQuizId', null);
    const [adminView, setAdminView] = useLocalStorage<AdminView>('adminView', 'users');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchData();
            setUsers(data.users || []);
            setQuizzes(data.quizzes || INITIAL_QUIZZES);
            setModuleCategories(data.moduleCategories || INITIAL_MODULE_CATEGORIES);
            setSettings(data.settings || null);
            setIsLoading(false);
        };
        loadData();
    }, []);
    
    const handleDataSave = useCallback(() => {
        if (!settings) return;
        saveData({ users, quizzes, moduleCategories, settings });
    }, [users, quizzes, moduleCategories, settings]);

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
    
    const handleAdminLogin = (success: boolean) => {
        if (success) {
            setView('admin');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('userLogin');
        setActiveQuizId(null);
    };

    const handleAdminLogout = () => {
        setView('adminLogin');
    };

    const handleStartQuiz = (moduleId: string) => {
        setActiveQuizId(moduleId);
        setView('quiz');
    };

    const handleQuizComplete = (score: number, answers: UserAnswer[]) => {
        if (!currentUser || !activeQuizId || !settings) return;

        const updatedModuleProgress = {
            ...currentUser.moduleProgress,
            [activeQuizId]: { score, answers },
        };

        const updatedUser = {
            ...currentUser,
            moduleProgress: updatedModuleProgress,
        };

        const assignedExams = currentUser.assignedExams || [];
        const assignedModules = moduleCategories
            .filter(cat => assignedExams.includes(cat.id))
            .flatMap(cat => cat.modules);

        const allModulesCompleted = assignedModules.every(mod => updatedModuleProgress[mod.id]);

        if (allModulesCompleted) {
            const allAnswers = assignedModules.flatMap(mod => updatedModuleProgress[mod.id]?.answers || []);
            const correctCount = allAnswers.filter(a => a.isCorrect).length;
            const totalScore = allAnswers.length > 0 ? Math.round((correctCount / allAnswers.length) * 100) : 0;
            
            updatedUser.trainingStatus = totalScore >= PASSING_PERCENTAGE ? 'passed' : 'failed';
            updatedUser.lastScore = totalScore;
            updatedUser.answers = allAnswers;
        }

        setCurrentUser(updatedUser);
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        saveData({ users: updatedUsers, quizzes, moduleCategories, settings });

        if (allModulesCompleted) {
            setView('completion');
        } else {
            setView('dashboard');
        }
        setActiveQuizId(null);
    };
    
    const userModuleCategories = useMemo(() => {
        if (!currentUser) return [];
        const assignedExams = currentUser.assignedExams || [];
        return moduleCategories
            .filter(cat => assignedExams.includes(cat.id))
            .map(category => ({
                ...category,
                modules: category.modules.map(module => ({
                    ...module,
                    status: currentUser.moduleProgress[module.id]
                        ? ModuleStatus.Completed
                        : ModuleStatus.NotStarted,
                })),
            }));
    }, [currentUser, moduleCategories]);

    const dashboardContent = (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 xl:col-span-9">
            <ModuleList
              moduleCategories={userModuleCategories}
              onStartQuiz={handleStartQuiz}
            />
          </div>
          <div className="lg:col-span-4 xl:col-span-3">
             {currentUser && <Sidebar
                userName={currentUser.fullName}
                completedCount={Object.keys(currentUser.moduleProgress).length}
                totalCount={userModuleCategories.flatMap(c => c.modules).length}
                progress={userModuleCategories.flatMap(c => c.modules).length > 0 ? Math.round((Object.keys(currentUser.moduleProgress).length / userModuleCategories.flatMap(c => c.modules).length) * 100) : 0}
                onReset={() => {
                    if(window.confirm('Are you sure you want to reset your progress?')) {
                        const resetUser = {...currentUser, moduleProgress: {}, answers: [], lastScore: null, trainingStatus: 'not-started' as const};
                        setCurrentUser(resetUser);
                        const updatedUsers = users.map(u => u.id === currentUser.id ? resetUser : u);
                        setUsers(updatedUsers);
                        if (settings) {
                            saveData({ users: updatedUsers, quizzes, moduleCategories, settings });
                        }
                    }
                }}
                onAdminClick={() => setView('adminLogin')}
                onLogout={handleLogout}
                currentUser={currentUser}
              />}
          </div>
        </main>
      </div>
    );
    
    if (isLoading || !settings) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (view === 'userLogin') {
        return <UserLoginPage users={users} onLogin={handleUserLogin} />;
    }

    if (view === 'adminLogin') {
        return <LoginPage users={users} onLogin={handleAdminLogin} />;
    }
    
    if (view === 'admin') {
        return <AdminPanel
            quizzes={quizzes}
            users={users}
            settings={settings}
            onUpdateUsers={(updatedUsers) => {
                setUsers(updatedUsers);
                handleDataSave();
            }}
            onAddNewUser={(newUser) => {
                const updatedUsers = [...users, newUser];
                setUsers(updatedUsers);
                handleDataSave();
            }}
            onUpdateSettings={(newSettings) => {
                setSettings(newSettings);
                saveData({ users, quizzes, moduleCategories, settings: newSettings });
            }}
            onLogout={handleAdminLogout}
            activeView={adminView}
            setActiveView={setAdminView}
            moduleCategories={moduleCategories}
            onCreateExamCategory={(title) => {
                const newId = title.toLowerCase().replace(/\s+/g, '_');
                if(moduleCategories.some(c => c.id === newId)) {
                    alert('An exam folder with this name already exists.');
                    return;
                }
                const newCategory: ModuleCategory = { id: newId, title, modules: [] };
                setModuleCategories(prev => [...prev, newCategory]);
                handleDataSave();
                return newId;
            }}
            onEditExamCategory={(categoryId, newTitle) => {
                setModuleCategories(prev => prev.map(c => c.id === categoryId ? {...c, title: newTitle} : c));
                handleDataSave();
            }}
            onDeleteExamCategory={(categoryId) => {
                if(window.confirm('Are you sure you want to delete this folder and all its questions?')) {
                    const category = moduleCategories.find(c => c.id === categoryId);
                    const moduleIdsToDelete = category?.modules.map(m => m.id) || [];
                    setModuleCategories(prev => prev.filter(c => c.id !== categoryId));
                    setQuizzes(prev => prev.filter(q => !moduleIdsToDelete.includes(q.id)));
                    handleDataSave();
                }
            }}
            onAddNewQuestion={(question, quizId) => {
                setQuizzes(prev => prev.map(q => q.id === quizId ? {...q, questions: [...q.questions, {...question, id: Date.now(), category: q.name}]} : q));
                handleDataSave();
            }}
            onAddQuestionToNewCategory={(question, categoryTitle) => {
                const newId = categoryTitle.toLowerCase().replace(/\s+/g, '_');
                 if(moduleCategories.some(c => c.id === newId)) {
                    alert('An exam folder with this name already exists.');
                    return;
                }
                const newModule: Module = { id: newId, title: categoryTitle, questions: 1, iconKey: 'DocumentText', status: ModuleStatus.NotStarted, theme: { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' } };
                const newCategory: ModuleCategory = { id: newId, title: categoryTitle, modules: [newModule] };
                const newQuiz: Quiz = { id: newId, name: categoryTitle, questions: [{...question, id: Date.now(), category: categoryTitle }] };

                setModuleCategories(prev => [...prev, newCategory]);
                setQuizzes(prev => [...prev, newQuiz]);
                handleDataSave();
                return newId;
            }}
            onAddQuestionToNewSubTopic={(question, subTopicTitle, parentCategoryId) => {
                const newId = `${parentCategoryId}_${subTopicTitle.toLowerCase().replace(/\s+/g, '_')}`;
                const newModule: Module = { id: newId, title: subTopicTitle, questions: 1, iconKey: 'DocumentText', status: ModuleStatus.NotStarted, theme: { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' } };
                const newQuiz: Quiz = { id: newId, name: subTopicTitle, questions: [{...question, id: Date.now(), category: subTopicTitle }] };

                setModuleCategories(prev => prev.map(cat => cat.id === parentCategoryId ? {...cat, modules: [...cat.modules, newModule]} : cat));
                setQuizzes(prev => [...prev, newQuiz]);
                handleDataSave();
            }}
            onUpdateQuestion={(updatedQuestion) => {
                setQuizzes(prev => prev.map(q => ({
                    ...q,
                    questions: q.questions.map(qu => qu.id === updatedQuestion.id ? updatedQuestion : qu)
                })));
                handleDataSave();
            }}
            onDeleteQuestion={(questionId) => {
                if (window.confirm('Are you sure you want to delete this question?')) {
                   setQuizzes(prev => prev.map(q => ({
                       ...q,
                       questions: q.questions.filter(qu => qu.id !== questionId)
                   })));
                   handleDataSave();
                }
            }}
        />
    }

    if (!currentUser) {
        return <UserLoginPage users={users} onLogin={handleUserLogin} />;
    }

    if (view === 'quiz' && activeQuizId) {
        const quiz = quizzes.find(q => q.id === activeQuizId);
        if (!quiz) {
            setView('dashboard');
            return dashboardContent;
        }
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center p-4">
                <QuizView quiz={quiz} onComplete={handleQuizComplete} />
            </div>
        );
    }
    
    if(view === 'completion') {
        return <CompletionScreen currentUser={currentUser} onGenerateReport={() => setView('report')} onLogout={handleLogout} />
    }
    
    if(view === 'report') {
        return <FinalReport answers={currentUser.answers} onBack={() => setView('dashboard')} />
    }

    return dashboardContent;
}

export default App;