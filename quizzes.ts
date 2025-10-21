import { Quiz } from './types';

export const PASSING_PERCENTAGE = 70;

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'password_security',
    name: "Password & Account Security",
    questions: [
      {
        id: 1,
        category: "Password & Account Security",
        question: "What is the primary purpose of Multi-Factor Authentication (MFA)?",
        options: [
          "To make passwords longer",
          "To add an extra layer of security beyond just a password",
          "To share your account with a colleague safely",
          "To automatically change your password every month",
        ],
        correctAnswer: "To add an extra layer of security beyond just a password",
      },
      {
        id: 2,
        category: "Password & Account Security",
        question: "Which of these is the strongest password?",
        options: [
          "Password123!",
          "MyDogFido2024",
          "R#8k&Zp@w!q2v$J9",
          "qwertyuiop",
        ],
        correctAnswer: "R#8k&Zp@w!q2v$J9",
      },
    ],
  },
  {
    id: 'data_protection_handling',
    name: "Data Protection & Handling",
    questions: [
       {
        id: 3,
        category: "Data Protection & Handling",
        question: "Where should you store confidential company files?",
        options: [
          "On your personal Google Drive",
          "In your email drafts folder",
          "In company-approved cloud storage or network drives",
          "On a USB stick you keep on your desk",
        ],
        correctAnswer: "In company-approved cloud storage or network drives",
      },
       {
        id: 4,
        category: "Data Protection & Handling",
        question: "What does 'data classification' help you do?",
        options: [
          "Delete old files automatically",
          "Understand the sensitivity of data and how to handle it",
          "Share files more quickly with anyone",
          "Encrypt your entire hard drive",
        ],
        correctAnswer: "Understand the sensitivity of data and how to handle it",
      },
    ]
  },
  {
    id: 'email_communication_security',
    name: "Email & Communication Security",
    questions: [
      {
        id: 5,
        category: "Email & Communication Security",
        question: "You receive an unexpected email with a link to reset your password. What should you do?",
        options: [
          "Click the link and reset your password immediately",
          "Forward the email to the IT department, then delete it",
          "Ignore and delete the email without clicking the link",
          "Reply to ask if the sender is legitimate",
        ],
        correctAnswer: "Ignore and delete the email without clicking the link",
      },
    ]
  },
  {
    id: 'device_internet_usage',
    name: "Device & Internet Usage",
    questions: [
      {
        id: 6,
        category: "Device & Internet Usage",
        question: "Why is it risky to use public Wi-Fi without a VPN for work?",
        options: [
          "It can be slow and unreliable",
          "Attackers on the same network can intercept your data",
          "It uses up your mobile data plan",
          "It is always safe if the Wi-Fi has a password",
        ],
        correctAnswer: "Attackers on the same network can intercept your data",
      },
    ]
  },
  {
    id: 'physical_security',
    name: "Physical Security",
    questions: [
      {
        id: 7,
        category: "Physical Security",
        question: "What does a 'clean desk policy' primarily help prevent?",
        options: [
          "Making the office look messy",
          "Losing your coffee mug",
          "Unauthorized access to sensitive information left on a desk",
          "Forgetting your tasks for the day",
        ],
        correctAnswer: "Unauthorized access to sensitive information left on a desk",
      },
    ]
  },
  {
    id: 'incident_reporting',
    name: "Incident Reporting",
    questions: [
      {
        id: 8,
        category: "Incident Reporting",
        question: "You accidentally click on a suspicious link in an email. What should be your immediate next step?",
        options: [
          "Disconnect your computer from the network and report it to IT immediately",
          "Run a virus scan and hope for the best",
          "Delete the email and don't tell anyone",
          "Restart your computer",
        ],
        correctAnswer: "Disconnect your computer from the network and report it to IT immediately",
      },
    ]
  },
  {
    id: 'social_engineering_awareness',
    name: "Social Engineering Awareness",
    questions: [
      {
        id: 9,
        category: "Social Engineering Awareness",
        question: "An individual calls you claiming to be from IT support and asks for your password to fix an issue. How should you respond?",
        options: [
          "Provide your password, as they are from IT",
          "Ask them for their name and employee ID first",
          "Refuse the request and report the call to the official IT department using a known number",
          "Give them a temporary password",
        ],
        correctAnswer: "Refuse the request and report the call to the official IT department using a known number",
      },
    ]
  },
  {
    id: 'acceptable_use_compliance',
    name: "Acceptable Use & Compliance",
    questions: [
      {
        id: 10,
        category: "Acceptable Use & Compliance",
        question: "Is it acceptable to use your company email for personal activities like online shopping?",
        options: [
          "Yes, as long as it's not excessive",
          "Only for emergencies",
          "No, company resources should be used for business purposes only",
          "Yes, it is more secure than a personal email",
        ],
        correctAnswer: "No, company resources should be used for business purposes only",
      },
    ]
  },
  {
    id: 'remote_work_byod',
    name: "Remote Work & BYOD",
    questions: [
      {
        id: 11,
        category: "Remote Work & BYOD",
        question: "When working from home, which of the following is most important for security?",
        options: [
          "Having a comfortable chair",
          "Using a secure Wi-Fi network with a strong password",
          "Taking breaks every hour",
          "Having a large monitor",
        ],
        correctAnswer: "Using a secure Wi-Fi network with a strong password",
      },
    ]
  },
  {
    id: 'backup_recovery_awareness',
    name: "Backup & Recovery Awareness",
    questions: [
      {
        id: 12,
        category: "Backup & Recovery Awareness",
        question: "What is the primary reason for regularly backing up company data?",
        options: [
          "To free up space on your computer",
          "To ensure data can be recovered in case of loss or corruption",
          "To comply with email retention policies",
          "To make files easier to search",
        ],
        correctAnswer: "To ensure data can be recovered in case of loss or corruption",
      },
    ]
  },
  {
    id: 'it_policy_exam',
    name: 'IT Policy Exam',
    questions: [
      {
        id: 14,
        category: 'IT Policy Exam',
        question: "According to a typical IT policy, what should you do before installing new software on your work computer?",
        options: [
          "Install it right away if it's free",
          "Ask a coworker if they have used it before",
          "Get approval from the IT department",
          "Use a personal credit card to buy it",
        ],
        correctAnswer: "Get approval from the IT department",
      },
    ]
  },
  {
    id: 'server_exam',
    name: 'Server Exam',
    questions: [
      {
        id: 15,
        category: 'Server Exam',
        question: "Who should be allowed access to the company's server room?",
        options: [
          'All employees',
          'Only authorized personnel with a specific need to be there',
          'The cleaning staff at any time',
          'Any manager who asks for the key',
        ],
        correctAnswer: 'Only authorized personnel with a specific need to be there',
      },
    ]
  },
  {
    id: 'operation_exam',
    name: 'Operation Exam',
    questions: [
      {
        id: 16,
        category: 'Operation Exam',
        question: "What is the primary goal of a Business Continuity Plan (BCP)?",
        options: [
          'To ensure the company makes more profit',
          'To give everyone extra vacation days after a disaster',
          'To ensure critical business functions can continue during and after a disruption',
          'To document all company hardware',
        ],
        correctAnswer: 'To ensure critical business functions can continue during and after a disruption',
      },
    ]
  },
  {
    id: 'legal_exam',
    name: 'Legal Exam',
    questions: [
      {
        id: 17,
        category: 'Legal Exam',
        question: "Under regulations like GDPR, what is a key responsibility of a company after a data breach involving personal information?",
        options: [
          'To wait a year to see if anyone notices',
          'To notify the affected individuals and relevant authorities without undue delay',
          'To offer discounts on future products',
          'To blame the IT department',
        ],
        correctAnswer: 'To notify the affected individuals and relevant authorities without undue delay',
      },
      {
        id: 22,
        category: 'Legal Exam',
        question: 'An employee creates a new software tool during work hours using company equipment. Who typically owns the intellectual property (IP) of this tool?',
        options: [
          'The employee, because they wrote the code.',
          'The company, as it was created within the scope of employment.',
          'It is open-source and owned by the public.',
          "The employee's direct manager."
        ],
        correctAnswer: 'The company, as it was created within the scope of employment.'
      },
      {
        id: 23,
        category: 'Legal Exam',
        question: 'What is the primary risk of using unlicensed software on a company computer?',
        options: [
          'The software might run slower than the licensed version.',
          'It can lead to legal action, fines, and security vulnerabilities.',
          'It takes up more hard drive space.',
          'The IT department cannot update it.'
        ],
        correctAnswer: 'It can lead to legal action, fines, and security vulnerabilities.'
      },
      {
        id: 24,
        category: 'Legal Exam',
        question: 'After signing an NDA with a client, you are having a casual conversation with a friend who works in the same industry. What information can you share about the client?',
        options: [
          'Only high-level project details that seem harmless.',
          'Specific technical challenges you are facing.',
          'No confidential information covered by the NDA should be discussed.',
          "The client's company name is okay to mention."
        ],
        correctAnswer: 'No confidential information covered by the NDA should be discussed.'
      },
      {
        id: 25,
        category: 'Legal Exam',
        question: "What is the main purpose of a company's records retention policy?",
        options: [
          'To ensure all documents are deleted after one year.',
          'To free up server storage space.',
          'To legally dictate how long documents must be kept for compliance and business needs.',
          'To make it harder to find old emails.'
        ],
        correctAnswer: 'To legally dictate how long documents must be kept for compliance and business needs.'
      },
      {
        id: 26,
        category: 'Legal Exam',
        question: 'If you report illegal or unethical activity within the company in good faith, what does a whistleblower policy protect you from?',
        options: [
          'Receiving a bonus for the report.',
          'Retaliation, such as being fired or demoted.',
          'Having to work overtime.',
          'Publicly speaking about the issue.'
        ],
        correctAnswer: 'Retaliation, such as being fired or demoted.'
      },
      {
        id: 27,
        category: 'Legal Exam',
        question: 'A potential vendor offers you expensive tickets to a major sports event to "thank you for considering their product." What is the safest course of action under a typical anti-bribery policy?',
        options: [
          "Accept the tickets as it's a normal part of business.",
          "Accept the tickets but don't let it influence your decision.",
          'Politely decline the gift and report the offer to your legal or compliance department.',
          'Ask if they can give you cash instead.'
        ],
        correctAnswer: 'Politely decline the gift and report the offer to your legal or compliance department.'
      },
      {
        id: 28,
        category: 'Legal Exam',
        question: 'You overhear a confidential conversation about an upcoming company merger that has not been publicly announced. What should you do with this information?',
        options: [
          'Buy stock in the company before the news is public to make a profit.',
          'Tell your friends and family so they can buy stock.',
          'Avoid trading the company\'s stock and keep the information confidential.',
          'Post about it on social media.'
        ],
        correctAnswer: 'Avoid trading the company\'s stock and keep the information confidential.'
      },
      {
        id: 29,
        category: 'Legal Exam',
        question: 'What is a key guideline in most corporate social media policies regarding discussing work-related matters?',
        options: [
          'You can post anything as long as your profile is private.',
          "It's okay to complain about clients if you don't use their names.",
          'Do not share confidential company information, and maintain a professional tone.',
          'Tag the company in all your posts to increase engagement.'
        ],
        correctAnswer: 'Do not share confidential company information, and maintain a professional tone.'
      },
      {
        id: 30,
        category: 'Legal Exam',
        question: 'What does the "right to be forgotten" under GDPR and similar privacy laws mean for a company?',
        options: [
          "The company must delete an individual's personal data upon request, under certain conditions.",
          'The company can choose to ignore requests from former customers.',
          'The company only has to anonymize the data, not delete it.',
          'It only applies to data that is less than a year old.'
        ],
        correctAnswer: "The company must delete an individual's personal data upon request, under certain conditions."
      }
    ]
  },
  {
    id: 'data_analyst_exam',
    name: 'Data Analyst Exam',
    questions: [
      {
        id: 18,
        category: 'Data Analyst Exam',
        question: "What is data anonymization?",
        options: [
          'Deleting all data older than one year',
          'Making copies of data for backup',
          'The process of encrypting data so it cannot be read',
          'The process of removing personally identifiable information from data sets',
        ],
        correctAnswer: 'The process of removing personally identifiable information from data sets',
      },
    ]
  },
  {
    id: 'dev_secure_coding',
    name: 'Secure Coding Practices',
    questions: [
      {
        id: 31,
        category: 'Secure Coding Practices',
        question: "What is the primary purpose of 'input sanitization' in a web application?",
        options: [
          'To make the user interface cleaner',
          'To prevent malicious code injection attacks like SQL Injection and XSS',
          'To automatically correct spelling errors in user input',
          'To ensure the database runs faster',
        ],
        correctAnswer: 'To prevent malicious code injection attacks like SQL Injection and XSS',
      },
      {
        id: 32,
        category: 'Secure Coding Practices',
        question: "What is a common vulnerability when you concatenate user input directly into a database query string?",
        options: [
          'Cross-Site Scripting (XSS)',
          'Denial of Service (DoS)',
          'SQL Injection (SQLi)',
          'Man-in-the-Middle (MITM)',
        ],
        correctAnswer: 'SQL Injection (SQLi)',
      },
    ]
  },
  {
    id: 'dev_api_security',
    name: 'API Security',
    questions: [
      {
        id: 33,
        category: 'API Security',
        question: "Which of the following is a common and secure method for authenticating API requests between services?",
        options: [
          'Sending username and password in the URL',
          'Using temporary OAuth tokens or API keys in headers',
          'Relying only on the client\'s IP address',
          'No authentication is needed for internal APIs',
        ],
        correctAnswer: 'Using temporary OAuth tokens or API keys in headers',
      },
    ]
  },
  {
    id: 'dev_dependency_management',
    name: 'Dependency Management',
    questions: [
      {
        id: 34,
        category: 'Dependency Management',
        question: "Why is it important to regularly scan and update third-party libraries used in your project?",
        options: [
          'To get the latest features and performance improvements',
          'To reduce the size of the final application bundle',
          'To patch known security vulnerabilities that could be exploited',
          'To ensure the library license has not changed',
        ],
        correctAnswer: 'To patch known security vulnerabilities that could be exploited',
      },
    ]
  },
  {
    id: 'dev_data_handling',
    name: 'Data Handling & Privacy',
    questions: [
      {
        id: 35,
        category: 'Data Handling & Privacy',
        question: "When storing user passwords in a database, what is the industry-standard best practice?",
        options: [
          'Store them in plain text for easy recovery',
          'Encrypt them using a single, static key',
          'Hash them using a strong, modern algorithm with a unique salt per user',
          'Base64 encode them',
        ],
        correctAnswer: 'Hash them using a strong, modern algorithm with a unique salt per user',
      },
    ]
  },
  {
    id: 'hr_recruitment_onboarding',
    name: 'Recruitment & Onboarding',
    questions: [
      {
        id: 50,
        category: 'Recruitment & Onboarding',
        question: "What is the HR team’s responsibility during recruitment?",
        options: [
          "Hire candidates without verification",
          "Conduct fair and transparent selection based on skill and merit",
          "Hire only referrals",
          "Skip interview process",
        ],
        correctAnswer: "Conduct fair and transparent selection based on skill and merit",
      },
      {
        id: 51,
        category: 'Recruitment & Onboarding',
        question: "During onboarding, new employees must:",
        options: [
          "Ignore policy training",
          "Submit required documents and complete induction",
          "Delay joining formalities",
          "Skip HR introduction",
        ],
        correctAnswer: "Submit required documents and complete induction",
      },
    ]
  },
  {
    id: 'hr_attendance_leave',
    name: 'Attendance & Leave Policy',
    questions: [
      {
        id: 52,
        category: 'Attendance & Leave Policy',
        question: "What is the standard procedure for applying for leave?",
        options: [
          "Inform verbally",
          "Apply through official HR portal or leave system",
          "Message colleagues",
          "Don’t apply if it’s short leave",
        ],
        correctAnswer: "Apply through official HR portal or leave system",
      },
      {
        id: 53,
        category: 'Attendance & Leave Policy',
        question: "Repeated late arrivals may lead to:",
        options: [
          "Bonus",
          "HR notice or disciplinary action",
          "Extra holidays",
          "No issue",
        ],
        correctAnswer: "HR notice or disciplinary action",
      },
    ]
  },
  {
    id: 'hr_workplace_conduct',
    name: 'Workplace Conduct & Ethics',
    questions: [
      {
        id: 54,
        category: 'Workplace Conduct & Ethics',
        question: "What defines professional workplace behavior?",
        options: [
          "Respect, punctuality, and teamwork",
          "Gossip and favoritism",
          "Ignoring deadlines",
          "Casual language with clients",
        ],
        correctAnswer: "Respect, punctuality, and teamwork",
      },
      {
        id: 55,
        category: 'Workplace Conduct & Ethics',
        question: "If you witness unethical behavior, what should you do?",
        options: [
          "Report it to HR or Compliance Officer",
          "Ignore to avoid trouble",
          "Spread it among coworkers",
          "Handle it personally",
        ],
        correctAnswer: "Report it to HR or Compliance Officer",
      },
    ]
  },
  {
    id: 'hr_benefits_payroll',
    name: 'Employee Benefits & Payroll',
    questions: [
      {
        id: 56,
        category: 'Employee Benefits & Payroll',
        question: "Who should employees contact for payroll or salary-related queries?",
        options: [
          "Their friends",
          "HR or Payroll Department",
          "IT Team",
          "Security guard",
        ],
        correctAnswer: "HR or Payroll Department",
      },
      {
        id: 57,
        category: 'Employee Benefits & Payroll',
        question: "Company-provided benefits (insurance, PF, etc.) are designed to:",
        options: [
          "Motivate and protect employees",
          "Increase deductions",
          "Reduce salary",
          "Be optional",
        ],
        correctAnswer: "Motivate and protect employees",
      },
    ]
  },
  {
    id: 'hr_performance_appraisal',
    name: 'Performance & Appraisal',
    questions: [
      {
        id: 58,
        category: 'Performance & Appraisal',
        question: "What is the purpose of an appraisal meeting?",
        options: [
          "To evaluate performance and discuss future goals",
          "To scold employees",
          "To compare salaries",
          "To check attendance",
        ],
        correctAnswer: "To evaluate performance and discuss future goals",
      },
      {
        id: 59,
        category: 'Performance & Appraisal',
        question: "Who provides feedback during appraisals?",
        options: [
          "Only HR",
          "Reporting Manager and HR jointly",
          "Security Team",
          "IT Department",
        ],
        correctAnswer: "Reporting Manager and HR jointly",
      },
    ]
  },
  {
    id: 'hr_grievance_resolution',
    name: 'Grievance & Conflict Resolution',
    questions: [
      {
        id: 60,
        category: 'Grievance & Conflict Resolution',
        question: "When facing a workplace issue, what’s the right approach?",
        options: [
          "Report to HR using the formal grievance procedure",
          "Post online",
          "Argue with colleagues",
          "Leave job immediately",
        ],
        correctAnswer: "Report to HR using the formal grievance procedure",
      },
      {
        id: 61,
        category: 'Grievance & Conflict Resolution',
        question: "Confidentiality in grievance handling ensures:",
        options: [
          "Bias in decisions",
          "Fair and private resolution",
          "Public awareness",
          "Faster promotions",
        ],
        correctAnswer: "Fair and private resolution",
      },
    ]
  },
  {
    id: 'hr_exit_clearance',
    name: 'Exit & Clearance Policy',
    questions: [
      {
        id: 62,
        category: 'Exit & Clearance Policy',
        question: "During resignation, employees must:",
        options: [
          "Serve notice period and follow clearance process",
          "Leave immediately",
          "Take all files home",
          "Ignore HR",
        ],
        correctAnswer: "Serve notice period and follow clearance process",
      },
      {
        id: 63,
        category: 'Exit & Clearance Policy',
        question: "Exit interviews help HR to:",
        options: [
          "Understand employee experience and improve policies",
          "Finalize pay cuts",
          "Remove employee data",
          "Skip feedback collection",
        ],
        correctAnswer: "Understand employee experience and improve policies",
      },
    ]
  }
];