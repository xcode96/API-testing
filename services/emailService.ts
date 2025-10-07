import { Email } from '../types';

/**
 * Mocks sending an email by logging it to the console.
 * In a real application, this would use an email API (e.g., SendGrid, Nodemailer).
 */
export const sendEmail = (email: Omit<Email, 'id' | 'timestamp'>): void => {
    console.log('--- MOCK EMAIL SENT ---');
    console.log(`To: ${email.to}`);
    console.log(`Subject: ${email.subject}`);
    console.log('-----------------------');
    console.log(email.body);
    console.log('-----------------------');
};
