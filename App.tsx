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
import { fetchData, saveData, AppData, fetchFromGitHub, savePartialData } from './services/api';

type View = 'user_login' | 'dashboard' | 'login' | 'admin' | 'report' | 'completion';
export type AdminView = 'users' | 'questions' | 'notifications' | 'settings';

const reconcileModuleCategories = (quizzes: Quiz[], moduleCategories?: ModuleCategory[]): ModuleCategory[] => {
    if (moduleCategories && moduleCategories.length > 0) {
        return moduleCategories;
    }
    
    const quizMap = new Map(quizzes.map(q => [q.id, q]));
    let syncedModuleCategories = INITIAL_MODULE_CATEGORIES.map(category => ({
        ...category,
        modules: category.modules
            .map(module => ({
                ...module,
                questions: quizMap.get(module.id)?.questions.length ?? 0
            }))
            .filter(module => quizMap.has(module.id))
    })).filter(category => category.modules.length > 0);

    const knownModuleIds = new Set(syncedModuleCategories.flatMap(c => c.modules).map(m => m.id));
    let newModulesAdded = 0;

    quizzes.forEach((quiz) => {
        if (!knownModuleIds.has(quiz.id)) {
            const totalModules = knownModuleIds.size + newModulesAdded;
            const iconKeys = Object.keys(ICONS);
            const newIconKey = iconKeys[totalModules % iconKeys.length];
            const newTheme = THEMES[totalModules % THEMES.length];
            
            const newModule: Module = { id: quiz.id, title: quiz.name, questions: quiz.questions.length, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: newTheme };
            const newCategory: ModuleCategory = { id: quiz.id, title: quiz.name, modules: [newModule] };
            syncedModuleCategories.push(newCategory);
            newModulesAdded++;
        }
    });
    return syncedModuleCategories;
};


function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [emailLog, setEmailLog] = useState<Email[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [moduleCategoriesState, setModuleCategoriesState] = useState<ModuleCategory[]>([]);
  
  const saveTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    fetchData()
      .then(data => {
        setQuizzes(data.quizzes);
        setUsers(data.users);
        setEmailLog(data.emailLog || []);
        setSettings(data.settings);
        setModuleCategoriesState(reconcileModuleCategories(data.quizzes, data.moduleCategories));
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
        .catch(err => console.error("Failed to auto-save data:", err));
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
    
    let newCategory: ModuleCategory | null = null;

    setModuleCategoriesState(prev => {
        const totalModules = prev.flatMap(c => c.modules).length;
        const iconKeys = Object.keys(ICONS);
        const newIconKey = iconKeys[totalModules % iconKeys.length];
        
        const newModule: Module = {
            id: newId,
            title: title,
            questions: 0,
            iconKey: newIconKey,
            status: ModuleStatus.NotStarted,
            theme: THEMES[totalModules % THEMES.length],
        };

        newCategory = { id: newId, title: title, modules: [newModule] };
        return [...prev, newCategory];
    });

    setQuizzes(prev => [...prev, newQuiz]);

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
    let updatedQuestionCount = 0;

    // Use a functional update for quizzes to ensure we're working with the latest state.
    setQuizzes(prevQuizzes => {
        const newQuizzes = prevQuizzes.map(quiz => {
            if (quiz.id === quizId) {
                const newQuestion: Question = {
                    id: Date.now(),
                    category: quiz.name,
                    ...question,
                };
                const updatedQuiz = { ...quiz, questions: [...quiz.questions, newQuestion] };
                updatedQuestionCount = updatedQuiz.questions.length; // Capture the new count
                return updatedQuiz;
            }
            return quiz;
        });

        // Now that we have the accurate new count, queue the update for module categories.
        // React's batching will ensure these updates happen in the same render cycle.
        if (updatedQuestionCount > 0) {
            setModuleCategoriesState(prevCategories =>
                prevCategories.map(category => ({
                    ...category,
                    modules: category.modules.map(module =>
                        module.id === quizId
                            ? { ...module, questions: updatedQuestionCount }
                            : module
                    ),
                }))
            );
        }
        
        return newQuizzes;
    });
};


  const handleAddQuestionToNewCategory = (question: Omit<Question, 'id'>, categoryTitle: string): string | undefined => {
    const newId = categoryTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
    if (quizzes.some(q => q.name.toLowerCase() === categoryTitle.toLowerCase()) || moduleCategoriesState.some(c => c.id === newId)) {
        alert("An exam category with a similar name already exists.");
        return undefined;
    }

    const newQuestionWithId: Question = { ...question, id: Date.now(), category: categoryTitle };
    const newQuiz: Quiz = { id: newId, name: categoryTitle, questions: [newQuestionWithId] };

    // Atomically create the new category and module, calculating theme/icon based on the *next* state.
    setModuleCategoriesState(prevCategories => {
        const totalModules = prevCategories.flatMap(c => c.modules).length;
        const iconKeys = Object.keys(ICONS);
        const newIconKey = iconKeys[totalModules % iconKeys.length];
        const newModule: Module = {
            id: newId,
            title: categoryTitle,
            questions: 1, // It starts with one question
            iconKey: newIconKey,
            status: ModuleStatus.NotStarted,
            theme: THEMES[totalModules % THEMES.length],
        };
        const newCategory: ModuleCategory = { id: newId, title: categoryTitle, modules: [newModule] };
        return [...prevCategories, newCategory];
    });
    
    // Add the quiz with its question.
    setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
    
    // Assign the new exam to all users.
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
          setModuleCategoriesState(prev => {
              const totalModules = prev.flatMap(c => c.modules).length;
              const newTheme = THEMES[totalModules % THEMES.length];
              const iconKeys = Object.keys(ICONS);
              const newIconKey = iconKeys[totalModules % iconKeys.length];
              const newModule: Module = { id: newSubTopicId, title: subTopicTitle, questions: 1, iconKey: newIconKey, status: ModuleStatus.NotStarted, theme: newTheme, subCategory: subTopicTitle };
              
              return prev.map(cat => 
                  cat.id === parentCategoryId 
                      ? { ...cat, modules: [...cat.modules, newModule] } 
                      : cat
              );
          });
      }
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuizzes(prev => prev.map(quiz => {
        const questionIndex = quiz.questions.findIndex(q => q.id === updatedQuestion.id);
        if (questionIndex > -1) {
            const newQuestions = [...quiz.questions];
            newQuestions[questionIndex] = updatedQuestion;
            return { ...quiz, questions: newQuestions };
        }
        return quiz;
    }));
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setQuizzes(prev => prev.map(quiz => ({
        ...quiz,
        questions: quiz.questions.filter(q => q.id !== questionId)
    })));
  };
  
  const handleStartQuiz = (moduleId: string) => {
    if (!currentUser) return;
    const assignedExams = currentUser.assignedExams || [];
    const moduleCategory = moduleCategoriesState.find(cat => cat.modules.some(m => m.id === moduleId));
    if (moduleCategory && !assignedExams.includes(moduleCategory.id)) {
        alert("You are not assigned to this exam. Please contact your administrator.");
        return;
    }
    setActiveQuizId(moduleId);
  };
  
  const handleQuizComplete = (score: number, answers: UserAnswer[]) => {
    if (!currentUser || !activeQuizId) return;

    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        const newModuleProgress = {
          ...(user.moduleProgress || {}),
          [activeQuizId]: ModuleStatus.Completed,
        };

        const allUserModules = moduleCategoriesState
            .filter(cat => user.assignedExams?.includes(cat.id))
            .flatMap(cat => cat.modules);
        
        const completedModules = Object.keys(newModuleProgress).filter(
            key => newModuleProgress[key] === ModuleStatus.Completed
        );
        
        const allModulesCompleted = allUserModules.every(
            mod => completedModules.includes(mod.id)
        );

        const newAnswers = [...(user.answers || []).filter(a => !answers.some(na => na.questionId === a.questionId)), ...answers];

        const totalCorrect = newAnswers.filter(a => a.isCorrect).length;
        const totalAttempted = newAnswers.length;
        const finalScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        
        let newTrainingStatus = user.trainingStatus;
        if (allModulesCompleted) {
          newTrainingStatus = finalScore >= PASSING_PERCENTAGE ? 'passed' : 'failed';
        }

        const updatedUser: User = {
          ...user,
          moduleProgress: newModuleProgress,
          answers: newAnswers,
          lastScore: allModulesCompleted ? finalScore : user.lastScore,
          trainingStatus: newTrainingStatus,
          submissionDate: allModulesCompleted ? new Date().toISOString() : user.submissionDate,
        };
        setCurrentUser(updatedUser);

        if (allModulesCompleted) {
            handleSendNotification({
              to: user.username,
              subject: `Training Assessment ${newTrainingStatus === 'passed' ? 'Passed' : 'Failed'}`,
              body: `Hi ${user.fullName},\n\nYou have completed your assigned training modules with a final score of ${finalScore}%.\n\nYour status is now: ${newTrainingStatus}.\n\nPlease log in to view your report.`,
            });
        }
        
        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    setActiveQuizId(null);
    const reloadedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
    if (reloadedCurrentUser && (reloadedCurrentUser.trainingStatus === 'passed' || reloadedCurrentUser.trainingStatus === 'failed')) {
      setView('completion');
    }
  };
  
  const handleResetProgress = () => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      const updatedUsers = users.map(user =>
        user.id === currentUser.id
          // FIX: Explicitly cast 'not-started' to its literal type to prevent type widening to 'string'.
          ? { ...user, moduleProgress: {}, answers: [], lastScore: null, trainingStatus: 'not-started' as const }
          : user
      );
      setUsers(updatedUsers);
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
    }
  };
  
  const handleGenerateReport = () => {
      setView('report');
  };
  
  const handleImportFolderStructure = (folderStructure: Record<string, any[]>, targetCategoryId: string) => {
    let parentCategory = moduleCategoriesState.find(c => c.id === targetCategoryId);
    if (!parentCategory) {
      console.error("Target category not found for import");
      return;
    }
    
    const newQuizzes: Quiz[] = [];
    const newModules: Module[] = [];
    let allModulesCount = moduleCategoriesState.flatMap(c => c.modules).length;
    const existingQuizNames = new Set(quizzes.map(q => q.name.toLowerCase()));

    for (const subTopicTitle of Object.keys(folderStructure)) {
        if (existingQuizNames.has(subTopicTitle.toLowerCase())) {
            alert(`A sub-topic named "${subTopicTitle}" already exists. Skipping this sub-topic.`);
            continue;
        }

        const questionsData = folderStructure[subTopicTitle];
        if (!Array.isArray(questionsData)) {
            console.warn(`Skipping "${subTopicTitle}" due to invalid question format.`);
            continue;
        }

        const newSubTopicId = subTopicTitle.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
        
        const newQuestions: Question[] = questionsData.map((q, index) => ({
            id: Date.now() + index,
            category: subTopicTitle,
            question: q.question || '',
            options: q.options || [],
            correctAnswer: q.correctAnswer || '',
        }));

        newQuizzes.push({ id: newSubTopicId, name: subTopicTitle, questions: newQuestions });
        
        const newTheme = THEMES[allModulesCount % THEMES.length];
        const iconKeys = Object.keys(ICONS);
        const newIconKey = iconKeys[allModulesCount % iconKeys.length];
        allModulesCount++;

        newModules.push({ 
            id: newSubTopicId, 
            title: subTopicTitle, 
            questions: newQuestions.length, 
            iconKey: newIconKey, 
            status: ModuleStatus.NotStarted, 
            theme: newTheme, 
            subCategory: subTopicTitle 
        });
    }

    setQuizzes(prev => [...prev, ...newQuizzes]);
    setModuleCategoriesState(prev => prev.map(cat => 
        cat.id === targetCategoryId 
            ? { ...cat, modules: [...cat.modules, ...newModules] } 
            : cat
    ));
    alert(`${newModules.length} new sub-topics imported successfully into "${parentCategory.title}".`);
  };
  
  const handleSendNotification = (emailData: Omit<Email, 'id' | 'timestamp'>) => {
    const newEmail: Email = {
      ...emailData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    sendEmail(newEmail);
    setEmailLog(prev => [newEmail, ...prev]);
  };
  
  const handleAddNewUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };
  
  const handleSyncFromGitHub = async (): Promise<{ success: boolean; error?: string }> => {
    if (!settings?.githubPat || !settings.githubOwner || !settings.githubRepo || !settings.githubPath) {
        return { success: false, error: "Please configure all GitHub Synchronization settings first." };
    }

    setIsSyncing(true);
    setError(null);

    try {
        const data = await fetchFromGitHub({
            owner: settings.githubOwner,
            repo: settings.githubRepo,
            path: settings.githubPath,
            pat: settings.githubPat,
        });
        
        const reconciledData: AppData = {
            users: data.users,
            quizzes: data.quizzes,
            emailLog: data.emailLog || [],
            settings: { ...data.settings, ...settings }, // Preserve current GitHub settings
            moduleCategories: reconcileModuleCategories(data.quizzes, data.moduleCategories),
        };

        await saveData(reconciledData);
        
        setQuizzes(reconciledData.quizzes);
        setUsers(reconciledData.users);
        setEmailLog(reconciledData.emailLog);
        setSettings(reconciledData.settings);
        if (reconciledData.moduleCategories) {
            setModuleCategoriesState(reconciledData.moduleCategories);
        }
        
        setIsSyncing(false);
        return { success: true };
    } catch (err: any) {
        console.error("Failed to sync from GitHub:", err);
        setIsSyncing(false);
        return { success: false, error: err.message };
    }
  };

  const handleImportAllData = async (file: File): Promise<boolean> => {
    if (!window.confirm("Are you sure you want to import this file? This will overwrite ALL current data and cannot be undone.")) {
      return false;
    }
    
    setIsSyncing(true); // Reuse syncing state for loading indicator
    setError(null);

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent) as AppData;

      if (!data.users || !data.quizzes || !data.settings) {
        throw new Error('Imported file is missing required fields (users, quizzes, settings).');
      }

      const reconciledData: AppData = {
        ...data,
        moduleCategories: reconcileModuleCategories(data.quizzes, data.moduleCategories),
      };

      // Save data in chunks to avoid server payload size limits
      const dataParts = {
          users: reconciledData.users,
          quizzes: reconciledData.quizzes,
          emailLog: reconciledData.emailLog || [],
          settings: reconciledData.settings,
          moduleCategories: reconciledData.moduleCategories || [],
      };

      const savePromises = Object.entries(dataParts).map(([key, value]) => 
          savePartialData(key, value)
      );
      await Promise.all(savePromises);

      // After successful save, update the local state
      setQuizzes(reconciledData.quizzes);
      setUsers(reconciledData.users);
      setEmailLog(reconciledData.emailLog || []);
      setSettings(reconciledData.settings);
      if (reconciledData.moduleCategories) {
        setModuleCategoriesState(reconciledData.moduleCategories);
      }

      setIsSyncing(false);
      return true;
    } catch (err: any) {
      console.error("Failed to import and save data:", err);
      setError(`Import Failed: ${err.message}. Data was not imported.`);
      setIsSyncing(false);
      alert(`Import Failed: ${err.message}. Please check the file and try again.`);
      return false;
    }
  };

  const handleManualSave = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        if (loading || !settings) {
             return { success: false, error: "Data is not ready to be saved." };
        }
        const dataToSave = { users, quizzes, emailLog, settings, moduleCategories: moduleCategoriesState };
        await saveData(dataToSave);
        return { success: true };
    } catch (err: any) {
        console.error("Failed to manually save data:", err);
        return { success: false, error: err.message || "An unknown error occurred." };
    }
  };
  
  // Memos for dashboard
  const userModuleCategories = useMemo(() => {
    if (!currentUser || currentUser.role === 'admin') return moduleCategoriesState;
    
    const assignedExamIds = new Set(currentUser.assignedExams || []);
    
    return moduleCategoriesState
        .filter(category => assignedExamIds.has(category.id))
        .map(category => ({
            ...category,
            modules: category.modules.map(module => ({
                ...module,
                status: currentUser?.moduleProgress?.[module.id] || ModuleStatus.NotStarted,
            }))
        }));
    }, [currentUser, moduleCategoriesState]);
    
  const totalModules = useMemo(() => userModuleCategories.flatMap(c => c.modules).length, [userModuleCategories]);
  const completedModules = useMemo(() => {
    if (!currentUser) return 0;
    return Object.values(currentUser.moduleProgress || {}).filter(s => s === ModuleStatus.Completed).length;
  }, [currentUser]);
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  const activeQuiz = useMemo(() => {
    if (!activeQuizId) return null;
    return quizzes.find(q => q.id === activeQuizId) || null;
  }, [activeQuizId, quizzes]);
  
  const activeModuleTheme = useMemo(() => {
    if (!activeQuizId) return undefined;
    for (const category of moduleCategoriesState) {
        const module = category.modules.find(m => m.id === activeQuizId);
        if (module) return module.theme;
    }
    return undefined;
  }, [activeQuizId, moduleCategoriesState]);

  // Main render logic
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const renderContent = () => {
    switch (view) {
      case 'user_login':
        return <UserLoginPage users={users} onLogin={handleUserLogin} />;
      case 'login':
        return <LoginPage users={users} onLogin={handleAdminLogin} />;
      case 'admin':
        if (!settings) return <div>Loading settings...</div>;
        return <AdminPanel 
                    quizzes={quizzes}
                    users={users}
                    onUpdateUsers={setUsers}
                    onAddNewUser={handleAddNewUser}
                    onLogout={() => setView('user_login')}
                    activeView={adminView}
                    setActiveView={setAdminView}
                    emailLog={emailLog}
                    onSendNotification={handleSendNotification}
                    settings={settings}
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
                    onSyncFromGitHub={handleSyncFromGitHub}
                    onImportAllData={handleImportAllData}
                    onManualSave={handleManualSave}
                    isSyncing={isSyncing}
                />;
      case 'report':
        return <FinalReport answers={currentUser?.answers || []} onBack={() => setView('dashboard')} />;
      case 'completion':
        return <CompletionScreen currentUser={currentUser} onGenerateReport={handleGenerateReport} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        if (!currentUser) return <UserLoginPage users={users} onLogin={handleUserLogin} />;

        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeQuiz ? (
                <div className="flex justify-center">
                  <QuizView 
                    quiz={activeQuiz} 
                    theme={activeModuleTheme}
                    onComplete={handleQuizComplete}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-4">
                    <Sidebar 
                      userName={currentUser.fullName}
                      completedCount={completedModules}
                      totalCount={totalModules}
                      progress={progress}
                      onReset={handleResetProgress}
                      onAdminClick={() => setView('login')}
                      onLogout={handleLogout}
                      currentUser={currentUser}
                    />
                  </div>
                  <div className="lg:col-span-8">
                    <ModuleList 
                      moduleCategories={userModuleCategories}
                      onStartQuiz={handleStartQuiz} 
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        );
    }
  };
  
  return renderContent();
}

export default App;
