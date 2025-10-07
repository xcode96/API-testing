import React, { useRef, useState } from 'react';
import { Quiz, Question } from '../../types';
import EditQuestionModal from './EditQuestionModal';

interface DataManagementProps {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-lg bg-white/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-100/80 transition-colors">
                <span className="font-semibold text-slate-700">{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && <div className="p-4 border-t border-slate-200">{children}</div>}
        </div>
    );
}


const DataManagement: React.FC<DataManagementProps> = ({ quizzes, setQuizzes }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(quizzes, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "quizzes.json";
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const importedQuizzes = JSON.parse(text);
                        if (Array.isArray(importedQuizzes)) {
                            setQuizzes(importedQuizzes);
                            alert("Quizzes imported successfully!");
                        } else {
                            throw new Error("Invalid JSON format");
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse JSON file:", error);
                    alert("Failed to import quizzes. Please check the file format.");
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleDelete = (questionId: number) => {
      if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
          setQuizzes(prevQuizzes => 
              prevQuizzes.map(quiz => ({
                  ...quiz,
                  questions: quiz.questions.filter(q => q.id !== questionId)
              }))
          );
      }
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
        setEditingQuestion(null);
    };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Export to JSON
          </button>
          <button
            onClick={handleImportClick}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Import from JSON
          </button>
          <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
          />
        </div>
        <div className="bg-indigo-100/60 border border-indigo-200/80 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-700 mb-2">How to Update the Live Quiz</h3>
          <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
              <li>Export to JSON after adding your new questions.</li>
              <li>Replace the content of the `quizzes.ts` file with data from the exported file.</li>
              <li>Deploy the updated code to the live server.</li>
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">All Questions</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {quizzes.map(quiz => (
              <Accordion key={quiz.id} title={`${quiz.name} (${quiz.questions.length} questions)`}>
                  <div className="space-y-4">
                      {quiz.questions.map(question => (
                          <div key={question.id} className="p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                              <p className="font-semibold text-slate-700 mb-2">{question.question}</p>
                              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-3">
                                  {question.options.map((opt, i) => (
                                      <li key={i} className={opt === question.correctAnswer ? 'font-bold text-emerald-600' : ''}>
                                          {opt}
                                          {opt === question.correctAnswer && <span className="ml-2 text-xs">(Correct)</span>}
                                      </li>
                                  ))}
                              </ul>
                              <div className="flex justify-end gap-2">
                                  <button onClick={() => setEditingQuestion(question)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors p-1">Edit</button>
                                  <button onClick={() => handleDelete(question.id)} className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors p-1">Delete</button>
                              </div>
                          </div>
                      ))}
                      {quiz.questions.length === 0 && <p className="text-slate-500 text-sm">No questions in this module yet.</p>}
                  </div>
              </Accordion>
            ))}
            </div>
        </div>
      </div>
      
      {editingQuestion && (
        <EditQuestionModal 
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          question={editingQuestion}
          onUpdate={handleUpdateQuestion}
        />
      )}
    </>
  );
};

export default DataManagement;