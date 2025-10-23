import React, { useState, useMemo } from 'react';
import { Quiz, Module, UserAnswer } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  theme?: Module['theme'];
  onComplete: (score: number, answers: UserAnswer[]) => void;
}

const TAGS = [
    { name: '#ITSecurityPolicy', color: 'bg-sky-100 text-sky-600 border-sky-200' },
    { name: '#DataProtection', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { name: '#SecurityCompliance', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { name: '#ThinkBeforeYouClick', color: 'bg-rose-100 text-rose-600 border-rose-200' },
    { name: '#HumanFirewall', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
];

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: string }>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const scoreData = useMemo(() => {
    if (!showResult) return { score: 0, correctAnswersCount: 0 };
    const correctAnswersCount = quiz.questions.reduce((count, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const score = quiz.questions.length > 0 ? Math.round((correctAnswersCount / quiz.questions.length) * 100) : 0;
    return { score, correctAnswersCount };
  }, [showResult, quiz.questions, selectedAnswers]);
  
  const handleBackToDashboard = () => {
      const userAnswers: UserAnswer[] = quiz.questions.map(question => {
          const selected = selectedAnswers[question.id] || "Not Answered";
          return {
              questionId: question.id,
              questionText: question.question,
              selectedAnswer: selected,
              correctAnswer: question.correctAnswer,
              isCorrect: selected === question.correctAnswer,
          };
      });
      onComplete(scoreData.score, userAnswers);
  };

  if (showResult) {
    const { score, correctAnswersCount } = scoreData;
    const totalQuestions = quiz.questions.length;
    return (
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center shadow-lg shadow-slate-200/80">
            <div className="bg-emerald-100 p-4 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Module Complete!</h2>
             <div className="bg-slate-100 rounded-lg p-4 w-full max-w-sm mb-6">
                <p className="text-lg font-semibold text-slate-700">Your Score: <span className="text-indigo-500">{score}%</span></p>
                <p className="text-sm text-slate-500">({correctAnswersCount} out of {totalQuestions} correct)</p>
            </div>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                You have successfully finished the <strong>{quiz.name}</strong> module. Your progress has been saved.
            </p>
            <button
                onClick={handleBackToDashboard}
                className="bg-indigo-500 text-white font-semibold rounded-lg py-3 px-8 hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-indigo-500/30"
            >
                Submit & Return to Dashboard
            </button>
        </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold tracking-widest text-indigo-500 uppercase">{quiz.name}</h2>
        <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} / {quiz.questions.length}</p>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-rose-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TAGS.map(tag => (
          <span key={tag.name} className={`text-xs font-medium px-3 py-1 rounded-full border ${tag.color}`}>
            {tag.name}
          </span>
        ))}
      </div>
      <div className="border-t border-slate-200 my-6"></div>
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">{currentQuestion.question}</h3>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOption === option
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 font-semibold'
                : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="border-t border-slate-200 mt-8 pt-6">
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className="w-full bg-indigo-500 text-white font-semibold rounded-lg py-3 hover:bg-indigo-600 transition-colors duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Module'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
