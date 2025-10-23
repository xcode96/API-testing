import React from 'react';
import { Module, ModuleCategory, ModuleStatus } from './types';

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
    Users: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a9 9 0 00-9-5.197" /></svg>,
    DocumentText: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Server: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
    Cog: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Scale: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 20.25c.621 0 1.125-.504 1.125-1.125V6.125c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v13.5c0 .621.504 1.125 1.125 1.125h1.5zm-12 0c.621 0 1.125-.504 1.125-1.125V6.125c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v13.5c0 .621.504 1.125 1.125 1.125h1.5zM12 3c-1.472 0-2.882.265-4.185.75M12 3c1.472 0 2.882.265 4.185.75m0 0c-2.653.94-5.716.94-8.37 0z" /></svg>,
    ChartBar: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    Briefcase: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 0 1-2.25 2.25h-13.5a2.25 2.25 0 0 1-2.25-2.25V14.15M16.5 18.25h-9a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 7.5 5.25h9A2.25 2.25 0 0 1 18.75 7.5v8.5a2.25 2.25 0 0 1-2.25 2.25Z" /></svg>,
    ShieldCheck: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" /></svg>,
    GlobeAlt: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    BuildingOffice2: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M11.25 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>,
};

export const THEMES = [
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
    { iconBg: 'bg-red-100', iconColor: 'text-red-500' },
    { iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
    { iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
    { iconBg: 'bg-pink-100', iconColor: 'text-pink-500' },
    { iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
    { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
    { iconBg: 'bg-stone-100', iconColor: 'text-stone-500' },
    { iconBg: 'bg-zinc-100', iconColor: 'text-zinc-500' },
    { iconBg: 'bg-neutral-100', iconColor: 'text-neutral-500' },
];

export const INITIAL_MODULE_CATEGORIES: ModuleCategory[] = [
    {
        id: 'it_security_policy',
        title: 'IT Security Policy',
        modules: [
            { id: 'password_security', title: 'Password & Account Security', subCategory: 'Password & Account Security', questions: 2, iconKey: 'Key', status: ModuleStatus.NotStarted, theme: THEMES[0] },
            { id: 'data_protection_handling', title: 'Data Protection & Handling', subCategory: 'Data Protection & Handling', questions: 2, iconKey: 'Download', status: ModuleStatus.NotStarted, theme: THEMES[1] },
            { id: 'email_communication_security', title: 'Email & Communication Security', subCategory: 'Email & Communication Security', questions: 1, iconKey: 'AtSymbol', status: ModuleStatus.NotStarted, theme: THEMES[2] },
            { id: 'device_internet_usage', title: 'Device & Internet Usage', subCategory: 'Device & Internet Usage', questions: 1, iconKey: 'Device', status: ModuleStatus.NotStarted, theme: THEMES[3] },
            { id: 'physical_security', title: 'Physical Security', subCategory: 'Physical Security', questions: 1, iconKey: 'Lock', status: ModuleStatus.NotStarted, theme: THEMES[4] },
            { id: 'incident_reporting', title: 'Incident Reporting', subCategory: 'Incident Reporting', questions: 1, iconKey: 'Warning', status: ModuleStatus.NotStarted, theme: THEMES[5] },
            { id: 'social_engineering_awareness', title: 'Social Engineering Awareness', subCategory: 'Social Engineering Awareness', questions: 1, iconKey: 'ChatBubble', status: ModuleStatus.NotStarted, theme: THEMES[6] },
            { id: 'acceptable_use_compliance', title: 'Acceptable Use & Compliance', subCategory: 'Acceptable Use & Compliance', questions: 1, iconKey: 'Check', status: ModuleStatus.NotStarted, theme: THEMES[7] },
            { id: 'remote_work_byod', title: 'Remote Work & BYOD', subCategory: 'Remote Work & BYOD', questions: 1, iconKey: 'Home', status: ModuleStatus.NotStarted, theme: THEMES[8] },
            { id: 'backup_recovery_awareness', title: 'Backup & Recovery Awareness', subCategory: 'Backup & Recovery Awareness', questions: 1, iconKey: 'Clock', status: ModuleStatus.NotStarted, theme: THEMES[9] },
        ]
    },
    {
        id: 'hr_exam',
        title: 'HR Exam',
        modules: [
            { id: 'hr_recruitment_onboarding', title: 'Recruitment & Onboarding', questions: 2, iconKey: 'Briefcase', status: ModuleStatus.NotStarted, theme: THEMES[11] },
            { id: 'hr_attendance_leave', title: 'Attendance & Leave Policy', questions: 2, iconKey: 'Clock', status: ModuleStatus.NotStarted, theme: THEMES[8] },
            { id: 'hr_workplace_conduct', title: 'Workplace Conduct & Ethics', questions: 2, iconKey: 'Scale', status: ModuleStatus.NotStarted, theme: THEMES[14] },
            { id: 'hr_benefits_payroll', title: 'Employee Benefits & Payroll', questions: 2, iconKey: 'DocumentText', status: ModuleStatus.NotStarted, theme: THEMES[12] },
            { id: 'hr_performance_appraisal', title: 'Performance & Appraisal', questions: 2, iconKey: 'ChartBar', status: ModuleStatus.NotStarted, theme: THEMES[15] },
            { id: 'hr_grievance_resolution', title: 'Grievance & Conflict Resolution', questions: 2, iconKey: 'Warning', status: ModuleStatus.NotStarted, theme: THEMES[5] },
            { id: 'hr_exit_clearance', title: 'Exit & Clearance Policy', questions: 2, iconKey: 'Lock', status: ModuleStatus.NotStarted, theme: THEMES[4] },
        ]
    },
    {
        id: 'it_policy_exam',
        title: 'IT Department Policy',
        modules: [
            { id: 'it_software_installation', title: 'Software Installation & Configuration Management', questions: 4, iconKey: 'Download', status: ModuleStatus.NotStarted, theme: THEMES[4] },
            { id: 'it_app_testing', title: 'Application Testing & Release Management', questions: 4, iconKey: 'Check', status: ModuleStatus.NotStarted, theme: THEMES[7] },
            { id: 'it_ticketing_change_control', title: 'Ticketing & Change Control', questions: 4, iconKey: 'DocumentText', status: ModuleStatus.NotStarted, theme: THEMES[12] },
            { id: 'it_security_compliance_dev', title: 'Security & Compliance in Development', questions: 4, iconKey: 'ShieldCheck', status: ModuleStatus.NotStarted, theme: THEMES[16] },
            { id: 'it_env_access_control', title: 'Environment & Access Control', questions: 4, iconKey: 'Key', status: ModuleStatus.NotStarted, theme: THEMES[0] },
            { id: 'it_dos_donts', title: 'Do’s and Don’ts of Enterprise Development', questions: 5, iconKey: 'Warning', status: ModuleStatus.NotStarted, theme: THEMES[5] },
        ]
    },
    {
        id: 'server_exam',
        title: 'Server Policy',
        modules: [
             { id: 'server_exam', title: 'Server Exam', questions: 1, iconKey: 'Server', status: ModuleStatus.NotStarted, theme: THEMES[12] },
        ]
    },
    {
        id: 'operation_exam',
        title: 'Operations Policy',
        modules: [
            { id: 'op_bcp', title: 'Business Continuity Planning', questions: 1, iconKey: 'Briefcase', status: ModuleStatus.NotStarted, theme: THEMES[0] },
            { id: 'op_dr', title: 'Disaster Recovery', questions: 1, iconKey: 'Server', status: ModuleStatus.NotStarted, theme: THEMES[1] },
            { id: 'op_incident_mgmt', title: 'Incident Management', questions: 1, iconKey: 'Warning', status: ModuleStatus.NotStarted, theme: THEMES[2] },
            { id: 'op_physical_security_ops', title: 'Physical Security Policy', questions: 1, iconKey: 'Lock', status: ModuleStatus.NotStarted, theme: THEMES[3] },
            { id: 'op_vendor_mgmt', title: 'Vendor Management', questions: 1, iconKey: 'Users', status: ModuleStatus.NotStarted, theme: THEMES[4] },
            { id: 'op_supply_chain', title: 'Supply Chain Security', questions: 1, iconKey: 'GlobeAlt', status: ModuleStatus.NotStarted, theme: THEMES[5] },
            { id: 'op_health_safety', title: 'Health and Safety Policy', questions: 1, iconKey: 'ShieldCheck', status: ModuleStatus.NotStarted, theme: THEMES[6] },
            { id: 'op_qa', title: 'Quality Assurance', questions: 1, iconKey: 'Check', status: ModuleStatus.NotStarted, theme: THEMES[7] },
            { id: 'op_resource_mgmt', title: 'Resource Management', questions: 1, iconKey: 'Cog', status: ModuleStatus.NotStarted, theme: THEMES[8] },
            { id: 'op_logistics', title: 'Logistics and Distribution', questions: 1, iconKey: 'BuildingOffice2', status: ModuleStatus.NotStarted, theme: THEMES[9] },
        ]
    },
    {
        id: 'legal_exam',
        title: 'Legal Policy',
        modules: [
             { id: 'legal_exam', title: 'Legal Exam', questions: 10, iconKey: 'Scale', status: ModuleStatus.NotStarted, theme: THEMES[14] },
        ]
    },
    {
        id: 'data_analyst_exam',
        title: 'Data Analyst Policy',
        modules: [
            { id: 'data_analyst_governance', title: 'Data Governance & Compliance', questions: 2, iconKey: 'ShieldCheck', status: ModuleStatus.NotStarted, theme: THEMES[16] },
            { id: 'data_analyst_handling', title: 'Secure Data Handling & Storage', questions: 2, iconKey: 'Lock', status: ModuleStatus.NotStarted, theme: THEMES[4] },
            { id: 'data_analyst_integrity', title: 'Data Quality & Integrity', questions: 2, iconKey: 'Check', status: ModuleStatus.NotStarted, theme: THEMES[7] },
            { id: 'data_analyst_ethics', title: 'Ethical Data Usage & Reporting', questions: 2, iconKey: 'Scale', status: ModuleStatus.NotStarted, theme: THEMES[14] },
        ]
    },
    {
        id: 'it_developer_policy',
        title: 'IT Developer Policy',
        modules: [
            { id: 'it_dev_secure_coding', title: 'Secure Coding Practices', questions: 2, iconKey: 'ShieldCheck', status: ModuleStatus.NotStarted, theme: THEMES[16] },
            { id: 'it_dev_api_security', title: 'API Security', questions: 2, iconKey: 'Key', status: ModuleStatus.NotStarted, theme: THEMES[0] },
            { id: 'it_dev_dependency_mgmt', title: 'Dependency Management', questions: 2, iconKey: 'GlobeAlt', status: ModuleStatus.NotStarted, theme: THEMES[9] },
            { id: 'it_dev_data_handling', title: 'Data Handling & Privacy', questions: 2, iconKey: 'Download', status: ModuleStatus.NotStarted, theme: THEMES[1] },
        ]
    }
];