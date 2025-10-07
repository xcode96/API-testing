
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ModuleList from './components/ModuleList';
import QuizView from './components/QuizView';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/admin/AdminPanel';
import UserLoginPage from './components/UserLoginPage';
import FinalReport from './components/FinalReport';
import CompletionScreen from './components/CompletionScreen';
import { INITIAL_MODULES } from './constants';
import { PASSING_PERCENTAGE } from './quizzes';
import { Module, ModuleStatus, Quiz, User, UserAnswer, Email, AppSettings } from './types';
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

  const saveTimeoutRef = useRef<number | null>(null);
  
  // Fetch initial data from the server
  useEffect(() => {
    fetchData()
      .then(data => {
        setQuizzes(data.quizzes);
        setUsers(data.users);
        setEmailLog(data.emailLog || []);
        setSettings(data.settings);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load application data. Please try again later.");
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


  const modules = useMemo<Module[]>(() => {
    const currentProgress = currentUser?.moduleProgress || {};
    return INITIAL_MODULES.map(staticModule => {
      const quiz = quizzes.find(q => q.id === staticModule.id);
      return {
        ...staticModule,
        status: currentProgress[staticModule.id] || ModuleStatus.NotStarted,
        questions: quiz ? quiz.questions.length : 0,
      };
    });
  }, [quizzes, currentUser]);

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
    const moduleToStart = modules.find(m => m.id === moduleId);

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

  const { completedCount, progressPercentage } = useMemo(() => {
    const completed = modules.filter(m => m.status === ModuleStatus.Completed).length;
    const total = modules.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedCount: completed, progressPercentage: percentage };
  }, [modules]);
  
  useEffect(() => {
    if (!currentUser) return;

    // 1. If training is completed, calculate score, set status, and transition to completion view
    if (
        progressPercentage === 100 &&
        view === 'dashboard' &&
        currentUser.trainingStatus === 'in-progress'
    ) {
        const answers = currentUser.answers || [];
        const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
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

        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        setView('completion');
        return; // Transitioned, so stop here.
    }

    // 2. If user logs in and has already passed/failed, show them the completion screen
    if (view === 'dashboard' && ['passed', 'failed'].includes(currentUser.trainingStatus)) {
        setView('completion');
    }
  }, [progressPercentage, view, currentUser, setUsers, quizzes]);


  const activeQuiz = useMemo(() => {
    if (!activeModuleId) return null;
    return quizzes.find(q => q.id === activeModuleId);
  }, [activeModuleId, quizzes]);

  const activeModuleTheme = useMemo(() => {
     if (!activeModuleId) return undefined;
     return modules.find(m => m.id === activeModuleId)?.theme;
  }, [activeModuleId, modules]);
  
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
            setQuizzes={setQuizzes} 
            users={users}
            setUsers={setUsers}
            onLogout={handleLogout} 
            activeView={activeAdminView}
            setActiveView={setActiveAdminView}
            emailLog={emailLog}
            onSendNotification={handleSendNotification}
            settings={settings!}
            onSettingsChange={setSettings}
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
                totalCount={modules.length}
                progress={progressPercentage}
                onReset={resetProgress}
                onAdminClick={() => setView('login')}
                onLogout={handleUserLogout}
              />
            </div>
            <div className="lg:col-span-9">
              <ModuleList
                modules={modules}
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
