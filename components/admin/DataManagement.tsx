
import React, { useRef, useState, useMemo } from 'react';
import { Quiz, Question, ModuleCategory } from '../../types';
import EditQuestionModal from './EditQuestionModal';

interface DataManagementProps {
  quizzes: Quiz[];
  moduleCategories: ModuleCategory[];
  questionFilter: string | null;
  onEditExamCategory: (categoryId: string, newTitle: string) => void;
  onDeleteExamCategory: (categoryId: string) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
  onImportFolderStructure: (folderStructure: Record<string, Omit<Question, 'id'|'category'>[]>, targetCategoryId: string) => void;
}

const Accordion: React.FC<{ title: React.ReactNode; children: React.ReactNode, startOpen?: boolean }> = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className="border border-slate-200 rounded-lg bg-white/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-100/80 transition-colors">
                <span className="font-semibold text-slate-700 flex-grow text-left">{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && <div className="p-4 border-t border-slate-200">{children}</div>}
        </div>
    );
}


const DataManagement: React.FC<DataManagementProps> = ({ quizzes, moduleCategories, questionFilter, onEditExamCategory, onDeleteExamCategory, onUpdateQuestion, onDeleteQuestion, onImportFolderStructure }) => {
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [importTargetCategory, setImportTargetCategory] = useState<string | null>(null);


    const filteredModuleCategories = useMemo(() => {
        if (!questionFilter) {
            return moduleCategories;
        }
        const category = moduleCategories.find(c => c.id === questionFilter);
        return category ? [category] : [];
    }, [moduleCategories, questionFilter]);
    
    const handleUpdateQuestion = (updatedQuestion: Question) => {
        onUpdateQuestion(updatedQuestion);
        setEditingQuestion(null);
    };

    const handleEditCategory = (categoryId: string, currentTitle: string) => {
        const newTitle = window.prompt("Enter the new name for this exam folder:", currentTitle);
        if (newTitle) {
            onEditExamCategory(categoryId, newTitle);
        }
    };

    const handleExportFolder = (categoryId: string) => {
        const category = moduleCategories.find(c => c.id === categoryId);
        if (!category) {
            alert("Could not find category to export.");
            return;
        }

        const moduleIds = new Set(category.modules.map(m => m.id));
        const quizzesToExport = quizzes.filter(quiz => moduleIds.has(quiz.id));

        if (quizzesToExport.length === 0 || quizzesToExport.every(q => q.questions.length === 0)) {
            alert("This exam folder has no questions to export.");
            return;
        }

        const structuredExport: Record<string, Omit<Question, 'id' | 'category'>[]> = {};

        quizzesToExport.forEach(quiz => {
            if (quiz.questions.length > 0) {
                structuredExport[quiz.name] = quiz.questions.map(({ id, category, ...rest }) => rest);
            }
        });
        
        if (Object.keys(structuredExport).length === 0) {
             alert("This exam folder has no questions to export.");
             return;
        }

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(structuredExport, null, 2)
        )}`;
        
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `folder-export-${category.title.toLowerCase().replace(/\s+/g, '-')}.json`;
        link.click();
    };

    const handleImportClick = (categoryId: string) => {
        setImportTargetCategory(categoryId);
        importFileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !importTargetCategory) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Could not read file content.");
                }
                const folderStructure = JSON.parse(text);
                if (typeof folderStructure !== 'object' || folderStructure === null || Array.isArray(folderStructure)) {
                    throw new Error("Invalid JSON format: The file should contain an object where keys are quiz names and values are arrays of questions.");
                }
                onImportFolderStructure(folderStructure, importTargetCategory);
            } catch (error: any) {
                alert(`Failed to import questions. Please check the file format. Error: ${error.message}`);
            } finally {
                if (importFileInputRef.current) {
                    importFileInputRef.current.value = ""; // Reset input
                }
                setImportTargetCategory(null);
            }
        };
        reader.onerror = () => {
            alert("An error occurred while reading the file.");
        };
        reader.readAsText(file);
    };

  return (
    <>
      <input type="file" ref={importFileInputRef} onChange={handleFileImport} accept=".json" className="hidden" />
      <div className="space-y-6">
        <div className="bg-emerald-100/60 border border-emerald-200/80 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-emerald-800 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Automatic Sync is Active
            </h3>
            <p className="text-sm text-slate-600 mt-1">
                All changes are automatically published to your GitHub repository.
            </p>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {questionFilter 
                ? `Editing Folder: ${moduleCategories.find(c => c.id === questionFilter)?.title}`
                : "All Exam Folders"
            }
          </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {filteredModuleCategories.map(category => {
                const modulesContent = (
                  <div className="space-y-3">
                    {category.modules.map(module => {
                      const quiz = quizzes.find(q => q.id === module.id);
                      if (!quiz) return null;
                      
                      const shouldModuleStartOpen = !!questionFilter;

                      return (
                        <Accordion key={module.id} title={`${module.title} (${quiz.questions.length} questions)`} startOpen={shouldModuleStartOpen}>
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
                                            <button onClick={() => onDeleteQuestion(question.id)} className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors p-1">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {quiz.questions.length === 0 && <p className="text-slate-500 text-sm">No questions in this module yet.</p>}
                            </div>
                        </Accordion>
                      );
                    })}
                  </div>
                );
                
                const editDeleteButtons = (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleExportFolder(category.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors p-1">Export Folder</button>
                        <button onClick={() => handleImportClick(category.id)} className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors p-1">Import Folder</button>
                        <button onClick={() => handleEditCategory(category.id, category.title)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors p-1">Edit Name</button>
                        <button onClick={() => onDeleteExamCategory(category.id)} className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors p-1">Delete Folder</button>
                    </div>
                );

                if (questionFilter) {
                    return (
                        <div key={category.id}>
                             <div className="flex justify-end items-center mb-2 px-1">
                                {editDeleteButtons}
                            </div>
                            {modulesContent}
                        </div>
                    );
                }

                // "All questions" view: Each category is a collapsible accordion
                const categoryTitleNode = (
                    <div className="flex justify-between items-center w-full">
                        <span>{category.title}</span>
                        {editDeleteButtons}
                    </div>
                );

                return (
                    <Accordion key={category.id} title={categoryTitleNode} startOpen={false}>
                        {modulesContent}
                    </Accordion>
                );

              })}
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
