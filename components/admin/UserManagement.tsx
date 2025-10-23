

import React, { useState, useMemo, useRef } from 'react';
import { User, Email, AppSettings, ModuleCategory } from '../../types';
import UserDetailsModal from './ReportDetailsModal';
import ShareFeedbackModal from './ShareFeedbackModal';
import CertificateModal from './CertificateModal';

interface UserManagementProps {
    users: User[];
    onUpdateUsers: (users: User[]) => void;
    onAddNewUser: (user: User) => void;
    onSendNotification: (emailData: Omit<Email, 'id' | 'timestamp'>) => void;
    settings: AppSettings;
    moduleCategories: ModuleCategory[];
}

const StatCard: React.FC<{ label: string; value: string | number; valueColor?: string }> = ({ label, value, valueColor = 'text-slate-800' }) => (
    <div className="bg-slate-100/80 rounded-xl p-5 text-center">
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
);


const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers, onAddNewUser, onSendNotification, settings, moduleCategories }) => {
    const [newUser, setNewUser] = useState({ fullName: '', username: '', password: '', role: 'user' as 'user' | 'admin', assignedExams: [] as string[] });
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [feedbackUser, setFeedbackUser] = useState<User | null>(null);
    const [certificateUser, setCertificateUser] = useState<User | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const importFileInputRef = useRef<HTMLInputElement>(null);

    const assignableCategories = useMemo(() => {
        return moduleCategories;
    }, [moduleCategories]);
    
    const handleOpenDetails = (user: User) => {
        setSelectedUser(user);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsModalOpen(false);
        setSelectedUser(null);
    };

    const handleGrantRetake = (userId: number) => {
         const user = users.find(u => u.id === userId);
         if (user) {
            // FIX: Explicitly cast 'not-started' to its literal type to prevent type widening to 'string'.
            const updatedUsers = users.map(u => u.id === userId ? { ...u, trainingStatus: 'not-started' as const, lastScore: null, submissionDate: undefined, answers: [], moduleProgress: {} } : u);
            onUpdateUsers(updatedUsers);
            onSendNotification({
                to: user.username,
                subject: "Training Retake Granted",
                body: `Hi ${user.fullName},\n\nYou have been granted a retake for the Cyber Security training. You can now log in and attempt the assessment again.\n\nGood luck!`,
            });
         }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            setNewUser(prev => ({ ...prev, role: value as 'user' | 'admin' }));
        } else {
            setNewUser(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleExamAssignmentChange = (categoryId: string) => {
        setNewUser(prev => {
            const newAssignedExams = prev.assignedExams.includes(categoryId)
                ? prev.assignedExams.filter(id => id !== categoryId)
                : [...prev.assignedExams, categoryId];
            return { ...prev, assignedExams: newAssignedExams };
        });
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.fullName && newUser.username && newUser.password) {
            const userToAdd: User = {
                id: Date.now(),
                fullName: newUser.fullName,
                username: newUser.username,
                password: newUser.password,
                trainingStatus: 'not-started',
                lastScore: null,
                role: newUser.role,
                assignedExams: newUser.assignedExams,
                answers: [],
                moduleProgress: {},
            };
            onAddNewUser(userToAdd); // Use the centralized handler
            onSendNotification({
                to: 'admin@example.com',
                subject: 'New User Registered',
                body: `A new user has been registered:\n\nName: ${newUser.fullName}\nUsername: ${newUser.username}\nRole: ${newUser.role}\nAssigned Exams: ${newUser.assignedExams.join(', ') || 'None'}`,
            });
            setNewUser({ fullName: '', username: '', password: '', role: 'user', assignedExams: [] });
        } else {
            alert("Please fill out all fields.");
        }
    };
    
    const filteredUsers = useMemo(() => {
        return users
            .filter(user => user.role !== 'admin')
            .filter(user => {
                switch (filter) {
                    case 'Active':
                        return ['not-started', 'in-progress'].includes(user.trainingStatus);
                    case 'Passed':
                        return user.trainingStatus === 'passed';
                    case 'Failed':
                        return user.trainingStatus === 'failed';
                    case 'All':
                    default:
                        return true;
                }
            })
            .filter(user =>
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [users, filter, searchTerm]);

    const handleExport = () => {
        const usersToExport = filteredUsers.map(({ password, ...rest }) => rest); // Don't export passwords
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(usersToExport, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `users-${filter.toLowerCase()}.json`;
        link.click();
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Could not read file content.");
                }
                
                const importedUsers: Partial<User>[] = JSON.parse(text);
                if (!Array.isArray(importedUsers)) {
                    throw new Error("Invalid JSON format: must be an array of users.");
                }

                const newUsersToAdd: User[] = [];
                let addedCount = 0;
                let skippedCount = 0;
                
                const existingUsernames = new Set(users.map(u => u.username));

                importedUsers.forEach(importedUser => {
                    if (importedUser.username && !existingUsernames.has(importedUser.username)) {
                        const newUser: User = {
                            id: Date.now() + Math.random(),
                            fullName: importedUser.fullName || 'Imported User',
                            username: importedUser.username,
                            password: importedUser.password || `temp-${Math.random().toString(36).substr(2, 9)}`,
                            trainingStatus: importedUser.trainingStatus || 'not-started',
                            lastScore: importedUser.lastScore || null,
                            role: importedUser.role === 'admin' ? 'admin' : 'user',
                            assignedExams: Array.isArray(importedUser.assignedExams) ? importedUser.assignedExams : [],
                            answers: Array.isArray(importedUser.answers) ? importedUser.answers : [],
                            moduleProgress: importedUser.moduleProgress || {},
                        };
                        newUsersToAdd.push(newUser);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                });

                if (newUsersToAdd.length > 0) {
                    onUpdateUsers([...users, ...newUsersToAdd]);
                }

                alert(`Import complete!\n${addedCount} users added.\n${skippedCount} users skipped (already exist).`);

                if (addedCount > 0 || skippedCount > 0) {
                    let body = `User import completed.\n\n- New Users Added: ${addedCount}\n- Users Skipped (Duplicates): ${skippedCount}`;
                    if (addedCount > 0) {
                        const newUsersSummary = newUsersToAdd.map(u => `- ${u.fullName} (${u.username})`).join('\n');
                        body += `\n\nDetails of Added Users:\n${newUsersSummary}`;
                    }
                    onSendNotification({
                        to: 'admin@example.com',
                        subject: 'User Import Summary',
                        body: body
                    });
                }

            } catch (error: any) {
                console.error("Failed to parse or process JSON file:", error);
                alert(`Failed to import users. Please check the file format or console for details. Error: ${error.message}`);
            } finally {
                if (importFileInputRef.current) {
                    importFileInputRef.current.value = "";
                }
            }
        };
        reader.onerror = () => {
            alert("An error occurred while reading the file.");
            if (importFileInputRef.current) {
                importFileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };


    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all submitted reports? This action will reset the status for all passed/failed users and cannot be undone.")) {
            const updatedUsers = users.map(u => {
                if (u.trainingStatus === 'passed' || u.trainingStatus === 'failed') {
                    // FIX: Explicitly cast 'not-started' to its literal type to prevent type widening to 'string'.
                    return { ...u, trainingStatus: 'not-started' as const, lastScore: null, submissionDate: undefined, answers: [], moduleProgress: {} };
                }
                return u;
            });
            onUpdateUsers(updatedUsers);
        }
    };
    

    const { passedCount, failedCount, totalSubmissions, passRate } = useMemo(() => {
        const submittedUsers = users.filter(u => u.trainingStatus === 'passed' || u.trainingStatus === 'failed');
        const passed = submittedUsers.filter(u => u.trainingStatus === 'passed').length;
        const total = submittedUsers.length;
        return {
            passedCount: passed,
            failedCount: total - passed,
            totalSubmissions: total,
            passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
        };
    }, [users]);


    const getStatusBadgeStyle = (status: User['trainingStatus']) => {
        switch (status) {
            case 'passed': return 'bg-emerald-100 text-emerald-600';
            case 'failed': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-200 text-slate-600';
        }
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500">Add, manage, and review user accounts and training progress.</p>
            </header>
            
            <section className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 mb-8 shadow-lg shadow-slate-200/80">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Training Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Submissions" value={totalSubmissions} />
                    <StatCard label="Pass Rate" value={`${passRate}%`} valueColor="text-indigo-500" />
                    <StatCard label="Passed" value={passedCount} valueColor="text-emerald-500" />
                    <StatCard label="Failed" value={failedCount} valueColor="text-rose-500" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Add User Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80 h-full">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                <input type="text" name="fullName" value={newUser.fullName} onChange={handleInputChange} placeholder="e.g., Jane Doe" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                                <input type="text" name="username" value={newUser.username} onChange={handleInputChange} placeholder="e.g., jdoe99" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                                <input type="password" name="password" value={newUser.password} onChange={handleInputChange} placeholder="Set a temporary password" className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Assign Exam Policies</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 bg-slate-100/50 p-2 rounded-md border">
                                {assignableCategories.length > 0 ? assignableCategories.map(cat => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-200/60">
                                        <input
                                            type="checkbox"
                                            checked={newUser.assignedExams.includes(cat.id)}
                                            onChange={() => handleExamAssignmentChange(cat.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-slate-700">{cat.title}</span>
                                    </label>
                                )) : <p className="text-sm text-slate-500 p-1">No assignable exams found.</p>}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                                <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/30">
                                Add User & Sync
                            </button>
                        </form>
                    </div>
                </div>

                {/* Existing Users List */}
                <div className="lg:col-span-8">
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">All Users ({filteredUsers.length})</h2>
                             <div className="flex items-center gap-2">
                                <input type="file" ref={importFileInputRef} onChange={handleImportFileChange} accept=".json" className="hidden" />
                                <button onClick={handleImportClick} className="flex items-center gap-2 bg-slate-200 text-slate-600 rounded-lg py-1.5 px-3 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300 text-sm font-semibold">
                                    Import
                                </button>
                                <button onClick={handleExport} className="flex items-center gap-2 bg-slate-200 text-slate-600 rounded-lg py-1.5 px-3 hover:bg-slate-300 hover:text-slate-800 transition-colors duration-300 text-sm font-semibold">
                                    Export {filter}
                                </button>
                                 <button onClick={handleClearAll} className="flex items-center gap-2 bg-rose-500/80 text-white rounded-lg py-1.5 px-3 hover:bg-rose-600 transition-colors duration-300 text-sm font-semibold">
                                   Clear Reports
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                           <div className="flex items-center">
                                <label htmlFor="user-filter-status" className="text-sm font-medium text-slate-600 mr-2">Filter by:</label>
                                <select
                                    id="user-filter-status"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="All">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Passed">Passed</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                             <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-auto p-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" />
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-32rem)] overflow-y-auto pr-2">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="bg-slate-100/80 p-3 rounded-lg text-sm">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-700 text-base">{user.fullName}</p>
                                            <p className="text-slate-500">@{user.username} &bull; <span className="font-medium">
                                              Assigned: {user.assignedExams?.map(id => moduleCategories.find(c => c.id === id)?.title).join(', ') || 'None'}
                                            </span></p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                                            {user.lastScore !== null && (
                                                <div className={`font-bold py-1 px-2 rounded-md ${user.lastScore >= 70 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-500'}`}>
                                                    {user.lastScore}%
                                                </div>
                                            )}
                                            <span className={`font-semibold capitalize px-2.5 py-1 rounded-full ${getStatusBadgeStyle(user.trainingStatus)}`}>
                                                {user.trainingStatus.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap justify-end items-center gap-2">
                                         {user.trainingStatus === 'passed' && (
                                            <>
                                               <button onClick={() => setCertificateUser(user)} className="text-xs font-semibold bg-slate-600 text-white rounded-md py-1.5 px-3 hover:bg-slate-700 transition-colors">Certificate</button>
                                               <button onClick={() => handleOpenDetails(user)} className="text-xs font-semibold bg-blue-500 text-white rounded-md py-1.5 px-3 hover:bg-blue-600 transition-colors">Details</button>
                                            </>
                                        )}
                                         {user.trainingStatus === 'failed' && (
                                            <>
                                               <button onClick={() => handleOpenDetails(user)} className="text-xs font-semibold bg-blue-500 text-white rounded-md py-1.5 px-3 hover:bg-blue-600 transition-colors">Details</button>
                                                <button onClick={() => setFeedbackUser(user)} className="text-xs font-semibold bg-gray-500 text-white rounded-md py-1.5 px-3 hover:bg-gray-600 transition-colors">Share Feedback</button>
                                                <button onClick={() => handleGrantRetake(user.id)} className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-md px-3 py-1.5 transition-colors">Grant Retake</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                              {filteredUsers.length === 0 && <p className="text-slate-500 text-center py-8">No users found.</p>}
                        </div>
                    </div>
                </div>
            </div>
            
            <UserDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseDetails} user={selectedUser} />
            
            {feedbackUser && (
                <ShareFeedbackModal user={feedbackUser} onClose={() => setFeedbackUser(null)} />
            )}

            {certificateUser && (
                 <CertificateModal 
                    isOpen={!!certificateUser} 
                    onClose={() => setCertificateUser(null)} 
                    user={certificateUser} 
                    settings={settings}
                 />
            )}
        </>
    );
};

export default UserManagement;
