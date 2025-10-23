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
import { fetchData, saveData } from './services/api';

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
            // This logic runs if moduleCategories data is missing, to migrate from an older data structure.
            const quizMap = new Map(data.quizzes.map(q => [q.id, q]));
            
            // 1. Rebuild categories from the initial constant, but only include modules for quizzes that actually exist.
            let syncedModuleCategories = INITIAL_MODULE_CATEGORIES.map(category => ({
                ...category,
                modules: category.modules
                    // Update question count from live quiz data
                    .map(module => ({
                        ...module,
                        questions: quizMap.get(module.id)?.questions.length ?? 0
                    }))
                    // Filter out modules whose corresponding quiz has been deleted
                    .filter(module => quizMap.has(module.id))
            })).filter(category => category.modules.length > 0); // Remove any categories that became empty

            // 2. Identify quizzes that are not part of any category yet.
            const knownModuleIds = new Set(syncedModuleCategories.flatMap(c => c.modules).map(m => m.id));
            let newModulesAdded = 0;

            // 3. Create a new category for each "orphan" quiz.
            data.quizzes.forEach((quiz) => {
                if (!knownModuleIds.has(quiz.id)) {
                    const totalModules = knownModuleIds.size + newModulesAdded;
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
                        id: quiz.id, // Consistent with how new categories are created elsewhere
                        title: quiz.name,
                        modules: [newModule],
                    };
                    syncedModuleCategories.push(newCategory);
                    newModulesAdded++;
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
      const dataToSave = { users, quizzes, emailLog, settings, moduleCategories: moduleCategoriesState };
      saveData(dataToSave)
        .catch(err => console.error("Failed to save data:", err));
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
      if (!newTitle || newTitle.trim() === '') return;
      const trimmedTitle = newTitle.trim();

      setModuleCategoriesState(prev => prev.map(cat => 
          cat.id === categoryId ? { ...cat, title: trimmedTitle } : cat
      ));
      
      const category = moduleCategoriesState.find(c => c.id === categoryId);
      if (category && category.modules.length === 1 && category.modules[0].id === category.id) {
          setQuizzes(prev => prev.map(quiz => 
              quiz.id === categoryId ? { ...quiz, name: trimmedTitle } : quiz
          ));
      }
  };

  const handleDeleteExamCategory = (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this entire exam folder and all its questions? This cannot be undone.")) return;

    const categoryToDelete = moduleCategoriesState.find(c => c.id === categoryId);
    if (!categoryToDelete) return;

    const moduleIdsToDelete = new Set(categoryToDelete.modules.map(m => m.id));

    setModuleCategoriesState(prev => prev.filter(c => c.id !== categoryId));
    setQuizzes(prev => prev.filter(q => !moduleIdsToDelete.has(q.id)));
  };

  const handleAddNewQuestion = (question: Omit<Question, 'id' | 'category'>, quizId: string) => {
    const newQuestion: Question = {
        id: Date.now(),
        category: quizzes.find(q => q.id === quizId)?.name || 'Uncategorized',
        ...question,
    };
    
    let updatedQuizzes: Quiz[] = [];
    setQuizzes(prev => {
        updatedQuizzes = prev.map(quiz => 
            quiz.id === quizId 
                ? { ...quiz, questions: [...quiz.questions, newQuestion] } 
                : quiz
        );
        return updatedQuizzes;
    });

    setModuleCategoriesState(prev => prev.map(category => ({
        ...category,
        modules: category.modules.map(module => {
            if (module.id === quizId) {
                const updatedQuiz = updatedQuizzes.find(q => q.id === quizId);
                return { ...module, questions: updatedQuiz ? updatedQuiz.questions.length : module.questions };
            }
            return module;
        })
    })));
  };

  const handleAddQuestionToNewCategory = (question: Omit<Question, 'id'>, categoryTitle: string) => {
      const newId = handleCreateExamCategory(categoryTitle);
      if (newId) {
        const newQuestion: Question = {
            id: Date.now(),
            ...question,
        };
        setQuizzes(prev => prev.map(quiz => 
            quiz.id === newId 
              ? { ...quiz, questions: [newQuestion] }
              : quiz
        ));
         setModuleCategoriesState(prev => prev.map(category => ({
            ...category,
            modules: category.modules.map(module => {
                if (module.id === newId) {
                    return { ...module, questions: 1 };
                }
                return module;
            })
        })));
      }
  };
  
  const handleAddQuestionToNewSubTopic = (question: Omit<Question, 'id'>, subTopicTitle: string, parentCategoryId: string) => {
      const newSubTopicId = subTopicTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
      
      if (quizzes.some(q => q.name.toLowerCase() === subTopicTitle.toLowerCase())) {
          alert("A sub-topic with this name already exists in another folder. Please choose a unique name.");
          return;
      }

      const newQuestion: Question = { id: Date.now(), ...question };
      const newQuiz: Quiz = { id: newSubTopicId, name: subTopicTitle, questions: [newQuestion] };

      setQuizzes(prev => [...prev, newQuiz]);

      const parentCategory = moduleCategoriesState.find(c => c.id === parentCategoryId);
      if (parentCategory) {
          const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
          const newTheme = THEMES[totalModules % THEMES.length];
          const iconKeys = Object.keys(ICONS);
          const newIconKey = iconKeys[totalModules % iconKeys.length];

          const newModule: Module = {
              id: newSubTopicId,
              title: subTopicTitle,
              questions: 1,
              iconKey: newIconKey,
              status: ModuleStatus.NotStarted,
              theme: newTheme,
          };

          setModuleCategoriesState(prev => prev.map(cat => 
              cat.id === parentCategoryId
                  ? { ...cat, modules: [...cat.modules, newModule] }
                  : cat
          ));
      }
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuizzes(prev => prev.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    })));
  };
  
  const handleDeleteQuestion = (questionId: number) => {
    let quizIdContainingQuestion: string | null = null;
    let updatedQuizzes: Quiz[] = [];

    setQuizzes(prev => {
        updatedQuizzes = prev.map(quiz => {
            const initialLength = quiz.questions.length;
            const updatedQuestions = quiz.questions.filter(q => q.id !== questionId);
            if (updatedQuestions.length < initialLength) {
                quizIdContainingQuestion = quiz.id;
            }
            return { ...quiz, questions: updatedQuestions };
        });
        return updatedQuizzes;
    });

    if (quizIdContainingQuestion) {
        const finalQuizId = quizIdContainingQuestion;
        setModuleCategoriesState(prev => prev.map(category => ({
            ...category,
            modules: category.modules.map(module => {
                if (module.id === finalQuizId) {
                     const updatedQuiz = updatedQuizzes.find(q => q.id === finalQuizId);
                     return { ...module, questions: updatedQuiz ? updatedQuiz.questions.length : module.questions };
                }
                return module;
            })
        })));
    }
  };
  
  const handleImportFolderStructure = (folderStructure: Record<string, Omit<Question, 'id'|'category'>[]>, targetCategoryId: string) => {
    const targetCategory = moduleCategoriesState.find(c => c.id === targetCategoryId);
    if (!targetCategory) {
        alert("Target import folder not found.");
        return;
    }

    let newQuizzes: Quiz[] = [];
    let newModules: Module[] = [];
    const existingModuleNames = new Set(targetCategory.modules.map(m => m.title.toLowerCase()));
    const totalModules = moduleCategoriesState.flatMap(c => c.modules).length;
    let moduleCounter = 0;

    for (const subTopicName in folderStructure) {
        if (existingModuleNames.has(subTopicName.toLowerCase())) {
            console.warn(`Skipping import for sub-topic "${subTopicName}" as it already exists in the target folder.`);
            continue;
        }

        const questionsData = folderStructure[subTopicName];
        const newSubTopicId = subTopicName.toLowerCase().replace(/\s+/g, '_') + `_${Date.now() + Math.random()}`;
        
        const newQuestions: Question[] = questionsData.map((q, index) => ({
            id: Date.now() + Math.random() * 1000 + index,
            category: subTopicName,
            ...q,
        }));

        newQuizzes.push({ id: newSubTopicId, name: subTopicName, questions: newQuestions });
        
        const currentModuleIndex = totalModules + moduleCounter;
        const iconKeys = Object.keys(ICONS);
        
        newModules.push({
            id: newSubTopicId,
            title: subTopicName,
            questions: newQuestions.length,
            iconKey: iconKeys[currentModuleIndex % iconKeys.length],
            status: ModuleStatus.NotStarted,
            theme: THEMES[currentModuleIndex % THEMES.length],
        });
        moduleCounter++;
    }

    if (newQuizzes.length > 0) {
        setQuizzes(prev => [...prev, ...newQuizzes]);
        setModuleCategoriesState(prev => prev.map(cat => 
            cat.id === targetCategoryId
                ? { ...cat, modules: [...cat.modules, ...newModules] }
                : cat
        ));
        alert(`Successfully imported ${newModules.length} new sub-topics.`);
    } else {
        alert("No new sub-topics to import. All sub-topics in the file may already exist in the target folder.");
    }
  };

  const handleCompletion = (quizId: string, score: number, answers: UserAnswer[]) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        answers: [...(currentUser.answers || []), ...answers],
        moduleProgress: {
          ...(currentUser.moduleProgress || {}),
          [quizId]: ModuleStatus.Completed,
        },
      };
      
      const allModulesForUser = allUserModules.filter(m => currentUser.assignedExams?.includes(m.parentCategoryId));
      const completedModules = Object.values(updatedUser.moduleProgress || {}).filter(status => status === ModuleStatus.Completed).length;
      
      if (completedModules === allModulesForUser.length) {
          const finalScore = Math.round(
              (updatedUser.answers.filter(a => a.isCorrect).length / updatedUser.answers.length) * 100
          );
          updatedUser.lastScore = finalScore;
          updatedUser.trainingStatus = finalScore >= PASSING_PERCENTAGE ? 'passed' : 'failed';
          updatedUser.submissionDate = new Date().toISOString();
          setView('completion');
      }

      const updatedUsers = users.map(u => (u.id === currentUser.id ? updatedUser : u));
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      setActiveQuizId(null);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            moduleProgress: {
                ...(currentUser.moduleProgress || {}),
                [quizId]: ModuleStatus.InProgress,
            }
        };
        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        setCurrentUser(updatedUser);
    }
    setActiveQuizId(quizId);
  };
  
  const handleResetProgress = () => {
    if (currentUser && window.confirm("Are you sure you want to reset your progress? All completed modules will be marked as 'Not Started'.")) {
      const updatedUser = { 
        ...currentUser, 
        moduleProgress: {},
        answers: [],
        trainingStatus: 'not-started' as const,
        lastScore: null,
        submissionDate: undefined,
       };
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      setView('dashboard');
    }
  };
  
  const handleSendNotification = (emailData: Omit<Email, 'id' | 'timestamp'>) => {
    const newEmail: Email = {
      ...emailData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setEmailLog(prev => [newEmail, ...prev]);
    sendEmail(emailData);
  };
  
  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  const handleAddNewUser = (user: User) => {
      setUsers(prev => [...prev, user]);
  };
  
  const allUserModules = useMemo(() => {
    return moduleCategoriesState.flatMap(category => category.modules.map(module => ({ ...module, parentCategoryId: category.id })));
  }, [moduleCategoriesState]);

  const userModules = useMemo(() => {
    if (!currentUser) return [];
    
    const userAssignedCategories = new Set(currentUser.assignedExams || []);
    
    return moduleCategoriesState
      .filter(category => userAssignedCategories.has(category.id))
      .map(category => ({
        ...category,
        modules: category.modules.map(module => ({
          ...module,
          status: currentUser.moduleProgress?.[module.id] || ModuleStatus.NotStarted,
        })),
      }));
  }, [currentUser, moduleCategoriesState]);
  
  const { completedModulesCount, totalModulesCount, overallProgress } = useMemo(() => {
    if (!currentUser) return { completedModulesCount: 0, totalModulesCount: 0, overallProgress: 0 };
    const relevantModules = allUserModules.filter(m => currentUser.assignedExams?.includes(m.parentCategoryId));
    const completed = relevantModules.filter(module => currentUser.moduleProgress?.[module.id] === ModuleStatus.Completed).length;
    const total = relevantModules.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedModulesCount: completed, totalModulesCount: total, overallProgress: progress };
  }, [currentUser, allUserModules]);
  
  const activeQuiz = useMemo(() => {
    if (!activeQuizId) return null;
    return quizzes.find(q => q.id === activeQuizId) || null;
  }, [activeQuizId, quizzes]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (error) {
     return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const renderView = () => {
    switch (view) {
      case 'user_login':
        return <UserLoginPage users={users} onLogin={handleUserLogin} />;
      case 'login':
        return <LoginPage onLogin={handleAdminLogin} users={users} />;
      case 'admin':
        return (
          <AdminPanel
            quizzes={quizzes}
            users={users}
            onUpdateUsers={handleUpdateUsers}
            onAddNewUser={handleAddNewUser}
            onLogout={handleLogout}
            activeView={adminView}
            setActiveView={setAdminView}
            emailLog={emailLog}
            onSendNotification={handleSendNotification}
            settings={settings!}
            onSettingsChange={setSettings}
            moduleCategories={moduleCategoriesState}
            onCreateExamCategory={handleCreateExamCategory}
            onEditExamCategory={handleEditExamCategory}
            onDeleteExamCategory={handleDeleteExamCategory}
            onAddNewQuestion={handleAddNewQuestion}
            onAddQuestionToNewCategory={handleAddQuestionToNewCategory}
            onAddQuestionToNewSubTopic={handleAddQuestionToNewSubTopic}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onImportFolderStructure={handleImportFolderStructure}
          />
        );
      case 'report':
        return <FinalReport answers={currentUser?.answers || []} onBack={() => setView('dashboard')} />;
      case 'completion':
        return <CompletionScreen currentUser={currentUser} onGenerateReport={() => setView('report')} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans">
            <div className="container mx-auto p-4 sm:p-6 md:p-8">
              <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <Sidebar
                    userName={currentUser?.fullName || 'User'}
                    completedCount={completedModulesCount}
                    totalCount={totalModulesCount}
                    progress={overallProgress}
                    onReset={handleResetProgress}
                    onAdminClick={() => setView('login')}
                    onLogout={handleLogout}
                    currentUser={currentUser}
                  />
                </div>
                <div className="lg:col-span-8">
                  {activeQuiz ? (
                    <QuizView quiz={activeQuiz} onComplete={(score, answers) => handleCompletion(activeQuiz.id, score, answers)} />
                  ) : (
                    <ModuleList moduleCategories={userModules} onStartQuiz={handleStartQuiz} />
                  )}
                </div>
              </main>
            </div>
          </div>
        );
    }
  };

  return <>{renderView()}</>;
}

export default App;