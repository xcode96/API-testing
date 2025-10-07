import React from 'react';
import { Module, ModuleStatus } from './types';

export const ICONS = {
    Key: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
    Download: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
    AtSymbol: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" /></svg>,
    Device: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>,
    Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    Warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>,
    ChatBubble: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M3.375 7.5c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.698v.941c0 .621.504 1.125 1.125 1.125H5.25v-2.472a1.5 1.5 0 0 1 .879-1.353L8.25 15h7.5l1.821 1.012a1.5 1.5 0 0 1 .879 1.353v2.472h1.875c.621 0 1.125-.504 1.125-1.125v-.941a2.999 2.999 0 0 1 0-5.698V8.625c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>,
    Check: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Home: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
    Clock: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const THEMES = [
    { iconBg: 'bg-rose-100', iconColor: 'text-rose-500' },
    { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500' },
    { iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
    { iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
    { iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500' },
    { iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { iconBg: 'bg-teal-100', iconColor: 'text-teal-500' },
    { iconBg: 'bg-lime-100', iconColor: 'text-lime-500' },
    { iconBg: 'bg-fuchsia-100', iconColor: 'text-fuchsia-500' },
    { iconBg: 'bg-sky-100', iconColor: 'text-sky-500' },
];

export const INITIAL_MODULES: Module[] = [
    { id: 'password_security', title: 'Password & Account Security', questions: 2, icon: ICONS.Key, status: ModuleStatus.NotStarted, theme: THEMES[0] },
    { id: 'data_protection_handling', title: 'Data Protection & Handling', questions: 2, icon: ICONS.Download, status: ModuleStatus.NotStarted, theme: THEMES[1] },
    { id: 'email_communication_security', title: 'Email & Communication Security', questions: 1, icon: ICONS.AtSymbol, status: ModuleStatus.NotStarted, theme: THEMES[2] },
    { id: 'device_internet_usage', title: 'Device & Internet Usage', questions: 1, icon: ICONS.Device, status: ModuleStatus.NotStarted, theme: THEMES[3] },
    { id: 'physical_security', title: 'Physical Security', questions: 1, icon: ICONS.Lock, status: ModuleStatus.NotStarted, theme: THEMES[4] },
    { id: 'incident_reporting', title: 'Incident Reporting', questions: 1, icon: ICONS.Warning, status: ModuleStatus.NotStarted, theme: THEMES[5] },
    { id: 'social_engineering_awareness', title: 'Social Engineering Awareness', questions: 1, icon: ICONS.ChatBubble, status: ModuleStatus.NotStarted, theme: THEMES[6] },
    { id: 'acceptable_use_compliance', title: 'Acceptable Use & Compliance', questions: 1, icon: ICONS.Check, status: ModuleStatus.NotStarted, theme: THEMES[7] },
    { id: 'remote_work_byod', title: 'Remote Work & BYOD', questions: 1, icon: ICONS.Home, status: ModuleStatus.NotStarted, theme: THEMES[8] },
    { id: 'backup_recovery_awareness', title: 'Backup & Recovery Awareness', questions: 1, icon: ICONS.Clock, status: ModuleStatus.NotStarted, theme: THEMES[9] },
];