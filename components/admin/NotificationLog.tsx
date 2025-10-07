import React from 'react';
import { Email } from '../../types';

interface NotificationLogProps {
    emailLog: Email[];
}

const NotificationLog: React.FC<NotificationLogProps> = ({ emailLog }) => {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Email Notification Log</h1>
                <p className="text-slate-500">This is a log of all simulated emails sent by the system.</p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/80">
                <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    {emailLog.length === 0 ? (
                        <p className="text-center text-slate-500 py-12">No notifications sent yet.</p>
                    ) : (
                        emailLog.map(email => (
                            <div key={email.id} className="p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-start text-sm">
                                    <div>
                                        <p><span className="font-semibold text-slate-600">To:</span> {email.to}</p>
                                        <p><span className="font-semibold text-slate-600">Subject:</span> {email.subject}</p>
                                    </div>
                                    <p className="text-slate-500 flex-shrink-0 ml-4">
                                        {new Date(email.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                                    {email.body}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationLog;