import React, { useMemo } from 'react';
import { UserAnswer } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

interface FinalReportProps {
  answers: UserAnswer[];
  onBack: () => void;
}

const FinalReport: React.FC<FinalReportProps> = ({ answers, onBack }) => {
  const { totalScore, totalCorrect, totalQuestions } = useMemo(() => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    return {
      totalScore: total > 0 ? Math.round((correct / total) * 100) : 0,
      totalCorrect: correct,
      totalQuestions: total,
    };
  }, [answers]);

  const moduleScores = useMemo(() => {
    return INITIAL_QUIZZES.map(quiz => {
      const moduleQuestionIds = quiz.questions.map(q => q.id);
      const moduleAnswers = answers.filter(a => moduleQuestionIds.includes(a.questionId));
      const correctCount = moduleAnswers.filter(a => a.isCorrect).length;
      const totalCount = moduleAnswers.length;
      const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
      return { name: quiz.name, score, correctCount, totalCount };
    });
  }, [answers]);

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans p-4 sm:p-6 md:p-8">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            color: black;
          }
          .no-print {
            display: none;
          }
          .print-bg-white {
            background-color: white !important;
          }
           .print-text-black {
            color: black !important;
          }
        }
      `}</style>
      <div id="print-section" className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-200/80 print-bg-white">
        <header className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 print-text-black">Final Training Report</h1>
            <p className="text-slate-500 print-text-black">Congratulations on completing your security training!</p>
          </div>
          <div className="text-right">
             <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 print-text-black">{totalScore}%</div>
             <p className="text-slate-500 print-text-black">Overall Score ({totalCorrect}/{totalQuestions})</p>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 print-text-black">Module Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moduleScores.map(m => (
              <div key={m.name} className="bg-slate-100/80 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-700">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.correctCount} / {m.totalCount} Correct</p>
                </div>
                <p className={`text-2xl font-bold ${m.score >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>{m.score}%</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 print-text-black">Detailed Question Review</h2>
          <div className="space-y-4">
            {answers.map(answer => (
              <div key={answer.questionId} className={`p-4 rounded-lg border-l-4 ${answer.isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                <p className="font-semibold text-slate-700 mb-2">{answer.questionText}</p>
                <p className={`text-sm ${answer.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
                   {!answer.isCorrect && (
                     <span className="ml-2 text-slate-500">(Correct: {answer.correctAnswer})</span>
                   )}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        <div className="no-print mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
           <button onClick={onBack} className="bg-slate-200 text-slate-600 rounded-lg py-2 px-6 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300">
             Back to Dashboard
           </button>
           <button onClick={handlePrint} className="bg-indigo-500 text-white font-semibold rounded-lg py-2 px-6 hover:bg-indigo-600 transition-colors duration-300">
             Print Report
           </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;
