

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
import { Module, ModuleStatus, Quiz, User, UserAnswer, Email, AppSettings, ModuleCategory, Question } from './types';
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

  // Make module categories stateful to allow dynamic creation
  const [moduleCategoriesState, setModuleCategoriesState] = useState<ModuleCategory[]>([]);


  const saveTimeoutRef = useRef<number | null>(null);
  
  // Fetch initial data from the server
  useEffect(() => {
    fetchData()
      .then(data => {
        setQuizzes(data.quizzes);
        setUsers(data.users);
        setEmailLog(data.emailLog || []);
        setSettings(data.settings);
        
        // After fetching quizzes, build the initial module categories state
        const existingQuizIds = new Set(data.quizzes.map(q => q.id));
        let syncedModuleCategories = INITIAL_MODULE_CATEGORIES.map(category => ({
            ...category,
            modules: category.modules.filter(module => existingQuizIds.has(module.id))
        }));

        // Dynamically add categories for quizzes that don't have a hardcoded category
        const knownModuleIds = new Set(syncedModuleCategories.flatMap(c => c.modules).map(m => m.id));

        data.quizzes.forEach((quiz, index) => {
          if (!knownModuleIds.has(quiz.id)) {
            const totalModules = syncedModuleCategories.flatMap(c => c.modules).length + index;
            const iconKeys = Object.keys(ICONS);
            const newIconKey = iconKeys[totalModules % iconKeys.length];
            const newIcon = ICONS[newIconKey as keyof typeof ICONS];
            const newTheme = THEMES[totalModules % THEMES.length];
            
            const newModule: Module = {
              id: quiz.id,
              title: quiz.name,
              questions: quiz.questions.length,
              icon: newIcon,
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
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load application data. Please try again later.");
        setModuleCategoriesState(INITIAL_MODULE_CATEGORIES); // Fallback on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Save state to backend with debounce
  useEffect(() => {
    if (loading || !settings) return; // Don't save while loading or if settings are not loaded

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      saveData({ users, quizzes, emailLog, settings })
        .catch(err => console.error("Failed to save data:", err));
    }, 1000); // Debounce for 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [users, quizzes, emailLog, settings, loading]);

  const handleCreateExamCategory = (title: string): string | undefined => {
    const newId = title.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
    
    // Check for duplicates
    if (quizzes.some(q => q.name.toLowerCase() === title.toLowerCase()) || moduleCategoriesState.some(c => c.id === newId)) {
      alert("An exam category with a similar name already exists.");
      return undefined;
    }

    // Create new empty quiz
    const newQuiz: Quiz = {
      id: newId,
      name: title,
      questions: [],
    };
    setQuizzes(prev => [...prev, newQuiz]);

    // Create new module category "folder"
    const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
    const iconKeys = Object.keys(ICONS);
    const newIconKey = iconKeys[totalModules % iconKeys.length];
    
    const newModule: Module = {
      id: newId,
      title: title,
      questions: 0,
      icon: ICONS[newIconKey as keyof typeof ICONS],
      status: ModuleStatus.NotStarted,
      theme: THEMES[totalModules % THEMES.length],
    };

    const newCategory: ModuleCategory = {
      id: newId,
      title: title,
      modules: [newModule],
    };
    setModuleCategoriesState(prev => [...prev, newCategory]);
    return newId;
  };

  const handleEditExamCategory = (categoryId: string, newTitle: string) => {
      if (!newTitle || newTitle.trim() === "") {
          alert("Category name cannot be empty.");
          return;
      }
      // Update module category title and its inner module's title
      setModuleCategoriesState(prev => prev.map(c =>
          c.id === categoryId
              ? { ...c, title: newTitle, modules: c.modules.map(m => m.id === categoryId ? { ...m, title: newTitle } : m) }
              : c
      ));
      // Update quiz name
      setQuizzes(prev => prev.map(q =>
          q.id === categoryId
              ? { ...q, name: newTitle }
              : q
      ));
  };

  const handleDeleteExamCategory = (categoryId: string) => {
    const categoryToDelete = moduleCategoriesState.find(c => c.id === categoryId);
    if (!categoryToDelete) {
        console.error("Category to delete not found:", categoryId);
        return;
    }

    if (window.confirm(`Are you sure you want to delete the entire exam folder "${categoryToDelete.title}" and all its questions? This action cannot be undone.`)) {
        // Get all module IDs within this category
        const moduleIdsToDelete = new Set(categoryToDelete.modules.map(m => m.id));

        // Remove the module category itself
        setModuleCategoriesState(prev => prev.filter(c => c.id !== categoryId));
        
        // Remove all quizzes that were part of this category
        setQuizzes(prev => prev.filter(q => !moduleIdsToDelete.has(q.id)));
        
        // Un-assign the main exam category from all users
        setUsers(prevUsers => prevUsers.map(user => ({
            ...user,
            assignedExams: user.assignedExams?.filter(id => id !== categoryId)
        })));
    }
  };
  
    const handleAddNewQuestion = (newQuestionData: Omit<Question, 'id'>) => {
        setQuizzes(prevQuizzes => {
            const newQuizzes = prevQuizzes.map(q => ({ ...q, questions: [...q.questions] }));
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

    const handleAddQuestionToNewCategory = (newQuestionData: Omit<Question, 'id'>, categoryTitle: string) => {
      if (quizzes.some(q => q.name.toLowerCase() === categoryTitle.toLowerCase())) {
        alert("An exam category with this name already exists. Please add the question to the existing category from the dropdown.");
        return;
      }
      
      const newId = categoryTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;

      const newQuestion: Question = {
        ...newQuestionData,
        id: Date.now(),
      };

      const newQuiz: Quiz = {
        id: newId,
        name: categoryTitle,
        questions: [newQuestion],
      };
      
      const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
      const iconKeys = Object.keys(ICONS);
      const newIconKey = iconKeys[totalModules % iconKeys.length];
      
      const newModule: Module = {
        id: newId,
        title: categoryTitle,
        questions: 1,
        icon: ICONS[newIconKey as keyof typeof ICONS],
        status: ModuleStatus.NotStarted,
        theme: THEMES[totalModules % THEMES.length],
      };

      const newCategory: ModuleCategory = {
        id: newId,
        title: categoryTitle,
        modules: [newModule],
      };

      setQuizzes(prev => [...prev, newQuiz]);
      setModuleCategoriesState(prev => [...prev, newCategory]);
      alert(`Category "${categoryTitle}" created and question added!`);
    };

    const handleAddQuestionToNewSubTopic = (newQuestionData: Omit<Question, 'id'>, subTopicTitle: string, parentCategoryId: string) => {
        if (quizzes.some(q => q.name.toLowerCase() === subTopicTitle.toLowerCase())) {
            alert("A quiz with this sub-topic name already exists. Please choose a different name.");
            return;
        }

        const newQuizId = subTopicTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
        const newQuestion: Question = {
            ...newQuestionData,
            id: Date.now(),
            category: subTopicTitle,
        };
        const newQuiz: Quiz = {
            id: newQuizId,
            name: subTopicTitle,
            questions: [newQuestion],
        };

        const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
        const iconKeys = Object.keys(ICONS);
        const newIconKey = iconKeys[totalModules % iconKeys.length];
        
        const newModule: Module = {
            id: newQuizId,
            title: subTopicTitle,
            questions: 1,
            icon: ICONS[newIconKey as keyof typeof ICONS],
            status: ModuleStatus.NotStarted,
            theme: THEMES[totalModules % THEMES.length],
        };

        setQuizzes(prev => [...prev, newQuiz]);
        setModuleCategoriesState(prev => prev.map(category => {
            if (category.id === parentCategoryId) {
                return {
                    ...category,
                    modules: [...category.modules, newModule]
                };
            }
            return category;
        }));

        const parentCategory = moduleCategoriesState.find(c => c.id === parentCategoryId);
        alert(`Sub-topic "${subTopicTitle}" created in folder "${parentCategory?.title}" and question added!`);
    };

    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuizzes(prevQuizzes =>
            prevQuizzes.map(quiz => {
                if (quiz.name === updatedQuestion.category) {
                    return {
                        ...quiz,
                        questions: quiz.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
                    };
                }
                return quiz;
            })
        );
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
            setQuizzes(prevQuizzes =>
                prevQuizzes.map(quiz => ({
                    ...quiz,
                    questions: quiz.questions.filter(q => q.id !== questionId)
                }))
            );
        }
    };

    const handleAddNewUser = (newUser: User) => {
        const userExists = users.some(u => u.username === newUser.username);
        if (userExists) {
            alert("Username already exists.");
            return;
        }
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // Automatically sync to GitHub for ANY new user
        triggerGithubSync({
            users: updatedUsers,
            quizzes,
            emailLog,
            settings: settings!,
        });
    };

    const handleUpdateUsers = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
    };

  const handleSendNotification = (emailData: Omit<Email, 'id' | 'timestamp'>) => {
    sendEmail(emailData); // The mock service call
    const newEmail: Email = {
        ...emailData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    setEmailLog(prevLog => [newEmail, ...prevLog]);
  };

  const [view, setView] = useState<View>('user_login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('users');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') {
      setView('login');
    }
  }, []);


  const moduleCategories = useMemo<ModuleCategory[]>(() => {
    if (!currentUser) return [];
    
    const currentProgress = currentUser?.moduleProgress || {};
    const assignedExamIds = new Set(currentUser?.assignedExams || []);

    return moduleCategoriesState
      .filter(category => assignedExamIds.has(category.id))
      .map(category => ({
        ...category,
        modules: category.modules.map(staticModule => {
          const quiz = quizzes.find(q => q.id === staticModule.id);
          return {
            ...staticModule,
            status: currentProgress[staticModule.id] || ModuleStatus.NotStarted,
            questions: quiz ? quiz.questions.length : 0,
          };
        }),
      }))
      .filter(category => category.modules.length > 0);
  }, [quizzes, currentUser, moduleCategoriesState]);

  const handleModuleStatusChange = (moduleId: string, status: ModuleStatus) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      // Only set to in-progress if they are not-started
      trainingStatus: currentUser.trainingStatus === 'not-started' ? 'in-progress' as const : currentUser.trainingStatus,
      moduleProgress: {
        ...(currentUser.moduleProgress || {}),
        [moduleId]: status,
      }
    };
    
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };
  
  const resetProgress = () => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      trainingStatus: 'not-started' as const,
      moduleProgress: {},
      answers: [],
      lastScore: null,
      submissionDate: undefined,
    };
    
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    setView('dashboard');
  }

  const handleUserLogout = () => {
    setCurrentUser(null);
    setView('user_login');
  };

  const handleStartQuiz = (moduleId: string) => {
    const moduleToStart = moduleCategories.flatMap(c => c.modules).find(m => m.id === moduleId);

    if (moduleToStart && moduleToStart.questions > 0) {
      handleModuleStatusChange(moduleId, ModuleStatus.InProgress);
      setActiveModuleId(moduleId);
    } else {
      handleModuleStatusChange(moduleId, ModuleStatus.Completed);
    }
  };

  const handleQuizComplete = (score: number, answers: UserAnswer[]) => {
    if (activeModuleId && currentUser) {
      const newModuleProgress = {
        ...(currentUser.moduleProgress || {}),
        [activeModuleId]: ModuleStatus.Completed
      };
      
      const questionIdsFromThisModule = answers.map(a => a.questionId);
      const otherAnswers = (currentUser.answers || []).filter(a => !questionIdsFromThisModule.includes(a.questionId));
      const newAnswers = [...otherAnswers, ...answers];

      const updatedUser = {
        ...currentUser,
        answers: newAnswers,
        moduleProgress: newModuleProgress,
      };

      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
      setActiveModuleId(null);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      setView('admin');
    }
  };
  
  const handleUserLogin = (user: User | null) => {
    if (user) {
      // All statuses are now valid for login. The app will direct them to the right view.
      setCurrentUser(user);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
      setIsAdmin(false);
      setView('user_login');
      setActiveAdminView('users');
  }

  const { allModules, completedCount, progressPercentage } = useMemo(() => {
    const flatModules = moduleCategories.flatMap(c => c.modules);
    const completed = flatModules.filter(m => m.status === ModuleStatus.Completed).length;
    const total = flatModules.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { allModules: flatModules, completedCount: completed, progressPercentage: percentage };
  }, [moduleCategories]);
  
  useEffect(() => {
    const handleCompletion = async () => {
        if (!currentUser || !settings) return;

        // 1. If training is completed, calculate score, set status, and transition to completion view
        if (
            progressPercentage === 100 &&
            view === 'dashboard' &&
            currentUser.trainingStatus === 'in-progress'
        ) {
            const answers = currentUser.answers || [];
            
            // Correctly calculate total questions based on assigned modules for the current user
            const assignedQuizIds = new Set(moduleCategories.flatMap(c => c.modules.map(m => m.id)));
            const assignedQuizzes = quizzes.filter(q => assignedQuizIds.has(q.id));
            const totalQuestions = assignedQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

            const correctAnswers = answers.filter(a => a.isCorrect).length;
            const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
            const didPass = score >= PASSING_PERCENTAGE;

            const updatedUser: User = {
                ...currentUser,
                trainingStatus: didPass ? 'passed' : 'failed',
                lastScore: score,
                submissionDate: new Date().toISOString(),
            };

            if (didPass) {
              handleSendNotification({
                  to: updatedUser.username,
                  subject: "Congratulations on Passing Your Training!",
                  body: `Hi ${updatedUser.fullName},\n\nYou have successfully passed the Cyber Security training with a score of ${score}%.\n\nWell done!`,
              });
            }

            // Create a temporary updated users array for the sync
            const updatedUsersForSync = users.map(u => u.id === currentUser.id ? updatedUser : u);
            
            // Perform the GitHub sync with the latest data
            await triggerGithubSync({
                users: updatedUsersForSync,
                quizzes,
                emailLog,
                settings,
            });

            // Now update the state locally
            setCurrentUser(updatedUser);
            setUsers(updatedUsersForSync);
            setView('completion');
            return; // Transitioned, so stop here.
        }

        // 2. If user logs in and has already passed/failed, show them the completion screen
        if (view === 'dashboard' && ['passed', 'failed'].includes(currentUser.trainingStatus)) {
            setView('completion');
        }
    };

    handleCompletion();
  }, [progressPercentage, view, currentUser, quizzes, moduleCategories, users, emailLog, settings]);


  const activeQuiz = useMemo(() => {
    if (!activeModuleId) return null;
    return quizzes.find(q => q.id === activeModuleId);
  }, [activeModuleId, quizzes]);

  const activeModuleTheme = useMemo(() => {
     if (!activeModuleId) return undefined;
     return allModules.find(m => m.id === activeModuleId)?.theme;
  }, [activeModuleId, allModules]);

  const renderContent = () => {
      if (view === 'user_login') {
        const regularUsers = users.filter(u => u.role === 'user');
        return <UserLoginPage users={regularUsers} onLogin={handleUserLogin} />;
      }

      if (view === 'login') {
        return <LoginPage onLogin={handleAdminLogin} users={users} />;
      }

      if (view === 'admin' && isAdmin) {
        return (
          <AdminPanel 
            quizzes={quizzes} 
            users={users}
            onUpdateUsers={handleUpdateUsers}
            onAddNewUser={handleAddNewUser}
            onLogout={handleLogout} 
            activeView={activeAdminView}
            setActiveView={setActiveAdminView}
            emailLog={emailLog}
            onSendNotification={handleSendNotification}
            settings={settings!}
            onSettingsChange={setSettings}
            moduleCategories={moduleCategoriesState} // Pass the full state for management
            onCreateExamCategory={handleCreateExamCategory}
            onEditExamCategory={handleEditExamCategory}
            onDeleteExamCategory={handleDeleteExamCategory}
            onAddNewQuestion={handleAddNewQuestion}
            onAddQuestionToNewCategory={handleAddQuestionToNewCategory}
            onAddQuestionToNewSubTopic={handleAddQuestionToNewSubTopic}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        );
      }
      
      if (view === 'report') {
        return <FinalReport answers={currentUser?.answers || []} onBack={() => setView('completion')} />;
      }
      
      if (view === 'completion') {
        return (
          <CompletionScreen
            currentUser={currentUser}
            onGenerateReport={() => setView('report')}
            onLogout={handleUserLogout}
          />
        );
      }

      if (activeQuiz) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex items-center justify-center p-4 sm:p-6 md:p-8">
            <QuizView quiz={activeQuiz} theme={activeModuleTheme} onComplete={handleQuizComplete} />
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans p-4 sm:p-6 md:p-8">
          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <Sidebar
                currentUser={currentUser}
                userName={currentUser?.fullName || 'User'}
                completedCount={completedCount}
                totalCount={allModules.length}
                progress={progressPercentage}
                onReset={resetProgress}
                onAdminClick={() => setView('login')}
                onLogout={handleUserLogout}
              />
            </div>
            <div className="lg:col-span-9">
              <ModuleList
                moduleCategories={moduleCategories}
                onStartQuiz={handleStartQuiz}
              />
            </div>
          </main>
        </div>
      );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600">Loading Training Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white/70 rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-rose-500 mb-2">An Error Occurred</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null; // Or some other fallback UI if settings are essential before rendering
  }

  return <>{renderContent()}</>;
}

export default App;
