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
    id: 'op_bcp',
    name: 'Business Continuity Planning',
    questions: [{
      id: 301,
      category: 'Business Continuity Planning',
      question: "What is the primary goal of a Business Continuity Plan (BCP)?",
      options: [
        'To ensure the company makes more profit',
        'To give everyone extra vacation days after a disaster',
        'To ensure critical business functions can continue during and after a disruption',
        'To document all company hardware',
      ],
      correctAnswer: 'To ensure critical business functions can continue during and after a disruption',
    }]
  },
  {
    id: 'op_dr',
    name: 'Disaster Recovery',
    questions: [{
      id: 302,
      category: 'Disaster Recovery',
      question: "What is a key objective of a Disaster Recovery (DR) test?",
      options: [
        'To cause a real disaster to see what happens',
        'To validate the DR plan and identify gaps in procedures',
        'To give the IT team a day off from regular duties',
        'To check if the internet is working at the recovery site',
      ],
      correctAnswer: 'To validate the DR plan and identify gaps in procedures',
    }]
  },
  {
    id: 'op_incident_mgmt',
    name: 'Incident Management',
    questions: [{
      id: 303,
      category: 'Incident Management',
      question: "What is the first step in the incident management lifecycle after detection?",
      options: [
        'Resolution and recovery',
        'Post-incident analysis',
        'Containment, eradication, and recovery',
        'Logging and categorization',
      ],
      correctAnswer: 'Logging and categorization',
    }]
  },
  {
    id: 'op_physical_security_ops',
    name: 'Physical Security Policy',
    questions: [{
      id: 304,
      category: 'Physical Security Policy',
      question: "Which of the following helps prevent 'tailgating' into a secure office area?",
      options: [
        'Holding the door open for others',
        'Ensuring each individual uses their own access card to enter',
        'Disabling the access card reader',
        'Leaving secure doors propped open for convenience',
      ],
      correctAnswer: 'Ensuring each individual uses their own access card to enter',
    }]
  },
  {
    id: 'op_vendor_mgmt',
    name: 'Vendor Management',
    questions: [{
      id: 305,
      category: 'Vendor Management',
      question: "What is the purpose of a Service Level Agreement (SLA) with a vendor?",
      options: [
        "It's just a formality for the legal team.",
        'It lists the names of the vendor employees.',
        'It defines the expected level of service, responsibilities, and performance metrics.',
        'It is a one-time invoice for services.',
      ],
      correctAnswer: 'It defines the expected level of service, responsibilities, and performance metrics.',
    }]
  },
  {
    id: 'op_supply_chain',
    name: 'Supply Chain Security',
    questions: [{
      id: 306,
      category: 'Supply Chain Security',
      question: "A primary security risk in the supply chain is:",
      options: [
        'Late deliveries affecting production schedules',
        'Counterfeit components or malicious software being introduced into products',
        'Increased shipping costs',
        'Damage to goods during transit',
      ],
      correctAnswer: 'Counterfeit components or malicious software being introduced into products',
    }]
  },
  {
    id: 'op_health_safety',
    name: 'Health and Safety Policy',
    questions: [{
      id: 307,
      category: 'Health and Safety Policy',
      question: "Who is responsible for following health and safety guidelines in the workplace?",
      options: [
        'Only the Health and Safety officer',
        'Only management',
        'Every employee',
        'Only new hires',
      ],
      correctAnswer: 'Every employee',
    }]
  },
  {
    id: 'op_qa',
    name: 'Quality Assurance',
    questions: [{
      id: 308,
      category: 'Quality Assurance',
      question: "What is the main purpose of Quality Assurance (QA) in operations?",
      options: [
        'To find someone to blame when things go wrong',
        'To slow down the production process',
        'To proactively ensure that products or services meet specified quality standards',
        'To check the work only after it is completed',
      ],
      correctAnswer: 'To proactively ensure that products or services meet specified quality standards',
    }]
  },
  {
    id: 'op_resource_mgmt',
    name: 'Resource Management',
    questions: [{
      id: 309,
      category: 'Resource Management',
      question: "Effective resource management in operations primarily aims to:",
      options: [
        'Purchase the most expensive equipment available',
        'Hire as many people as possible',
        'Allocate and utilize resources efficiently to achieve organizational goals',
        'Reduce the number of coffee breaks',
      ],
      correctAnswer: 'Allocate and utilize resources efficiently to achieve organizational goals',
    }]
  },
  {
    id: 'op_logistics',
    name: 'Logistics and Distribution',
    questions: [{
      id: 310,
      category: 'Logistics and Distribution',
      question: "A key performance indicator (KPI) for logistics is 'On-Time Delivery Rate'. Why is this important?",
      options: [
        "It's not important, as long as the package arrives eventually.",
        'It directly impacts customer satisfaction and operational efficiency.',
        'It helps in calculating fuel costs.',
        'It is only used for employee performance reviews.',
      ],
      correctAnswer: 'It directly impacts customer satisfaction and operational efficiency.',
    }]
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
  },
  {
    id: 'it_dev_secure_coding',
    name: 'Secure Coding Practices',
    questions: [
      {
        id: 401,
        category: 'Secure Coding Practices',
        question: 'What is the primary purpose of input validation in secure coding?',
        options: [
          'To make the application run faster.',
          'To ensure data fits into the database correctly.',
          'To prevent malicious data (e.g., SQL injection, XSS) from being processed.',
          'To format user input for display.',
        ],
        correctAnswer: 'To prevent malicious data (e.g., SQL injection, XSS) from being processed.',
      },
      {
        id: 402,
        category: 'Secure Coding Practices',
        question: 'Which of the following is a best practice for handling errors and exceptions securely?',
        options: [
          'Display detailed error messages with stack traces to the user for easy debugging.',
          'Write all errors to a public log file.',
          'Use a generic error message for the user and log detailed information on the server-side.',
          'Ignore all exceptions to prevent the application from crashing.',
        ],
        correctAnswer: 'Use a generic error message for the user and log detailed information on the server-side.',
      },
    ],
  },
  {
    id: 'it_dev_api_security',
    name: 'API Security',
    questions: [
      {
        id: 403,
        category: 'API Security',
        question: 'What is a common method for authenticating API requests to ensure they come from a legitimate source?',
        options: [
          "Using the client's IP address.",
          'Using API keys or OAuth 2.0 tokens.',
          'Allowing all requests from any origin.',
          'Checking the User-Agent string.',
        ],
        correctAnswer: 'Using API keys or OAuth 2.0 tokens.',
      },
      {
        id: 404,
        category: 'API Security',
        question: 'To prevent unauthorized users from accessing sensitive data, what security control should be implemented at the API endpoint level?',
        options: [
          'Rate limiting to prevent too many requests.',
          'Caching responses to improve performance.',
          'Authorization checks to ensure the user has the correct permissions for the requested resource.',
          'Logging the request payload.',
        ],
        correctAnswer: 'Authorization checks to ensure the user has the correct permissions for the requested resource.',
      },
    ],
  },
  {
    id: 'it_dev_dependency_mgmt',
    name: 'Dependency Management',
    questions: [
      {
        id: 405,
        category: 'Dependency Management',
        question: 'What is a primary risk of using outdated third-party libraries in an application?',
        options: [
          'The library might be slower than newer versions.',
          'The documentation might be hard to find.',
          'The library may contain known security vulnerabilities that can be exploited.',
          'The library might not be compatible with the latest operating systems.',
        ],
        correctAnswer: 'The library may contain known security vulnerabilities that can be exploited.',
      },
      {
        id: 406,
        category: 'Dependency Management',
        question: 'What is the purpose of a software composition analysis (SCA) tool?',
        options: [
          'To compile the source code into an executable.',
          'To automatically identify open-source components in a codebase and their known vulnerabilities.',
          'To test the user interface of an application.',
          'To format the source code according to style guides.',
        ],
        correctAnswer: 'To automatically identify open-source components in a codebase and their known vulnerabilities.',
      },
    ],
  },
  {
    id: 'it_dev_data_handling',
    name: 'Data Handling & Privacy',
    questions: [
      {
        id: 407,
        category: 'Data Handling & Privacy',
        question: 'When storing sensitive user data, such as passwords, what is the most secure method?',
        options: [
          'Storing them in plaintext for easy retrieval.',
          'Encrypting them with a reversible encryption algorithm.',
          'Hashing them with a strong, salted hashing algorithm (e.g., bcrypt, Argon2).',
          'Base64 encoding them.',
        ],
        correctAnswer: 'Hashing them with a strong, salted hashing algorithm (e.g., bcrypt, Argon2).',
      },
      {
        id: 408,
        category: 'Data Handling & Privacy',
        question: 'What does the principle of "data minimization" mean in the context of privacy?',
        options: [
          'Collecting as much user data as possible for future use.',
          'Storing data in the smallest possible file format.',
          'Only collecting and retaining the absolute minimum amount of user data necessary for a specific purpose.',
          'Deleting all user data after one day.',
        ],
        correctAnswer: 'Only collecting and retaining the absolute minimum amount of user data necessary for a specific purpose.',
      },
    ],
  },
  {
    id: 'it_software_installation',
    name: 'Software Installation & Configuration Management',
    questions: [
      {
        id: 601, category: 'Software Installation & Configuration Management',
        question: 'During enterprise software installation, which step ensures the integrity of the installer package before execution?',
        options: ['Running antivirus only', 'Verifying digital signatures or checksum hashes (SHA256/MD5)', 'Checking file size', 'Installing directly from email'],
        correctAnswer: 'Verifying digital signatures or checksum hashes (SHA256/MD5)',
      },
      {
        id: 602, category: 'Software Installation & Configuration Management',
        question: 'When deploying an internal application update, what’s the first mandatory pre-deployment step?',
        options: ['Notify users', 'Backup existing system and verify rollback plan', 'Restart production server', 'Send approval email'],
        correctAnswer: 'Backup existing system and verify rollback plan',
      },
      {
        id: 603, category: 'Software Installation & Configuration Management',
        question: 'Which environment is specifically used for final pre-production testing under real conditions?',
        options: ['Development', 'Staging / UAT', 'Local machine', 'Sandbox only'],
        correctAnswer: 'Staging / UAT',
      },
      {
        id: 604, category: 'Software Installation & Configuration Management',
        question: 'A developer receives an installation request for a licensed IDE. What should they do first?',
        options: ['Download from a free source', 'Raise a request through the IT Asset Management system for license allocation', 'Install a trial version', 'Ask a colleague for setup'],
        correctAnswer: 'Raise a request through the IT Asset Management system for license allocation',
      },
    ]
  },
  {
    id: 'it_app_testing',
    name: 'Application Testing & Release Management',
    questions: [
      {
        id: 605, category: 'Application Testing & Release Management',
        question: 'What’s the purpose of a smoke test after deployment?',
        options: ['Full performance validation', 'Quick check that the core functions run after release', 'Security scan', 'Regression test'],
        correctAnswer: 'Quick check that the core functions run after release',
      },
      {
        id: 606, category: 'Application Testing & Release Management',
        question: 'What is a UAT (User Acceptance Test) primarily focused on?',
        options: ['Security vulnerabilities', 'Code efficiency', 'Business requirements validation', 'Developer preferences'],
        correctAnswer: 'Business requirements validation',
      },
      {
        id: 607, category: 'Application Testing & Release Management',
        question: 'In CI/CD, which step ensures automatic rollback on deployment failure?',
        options: ['Canary deployment', 'Static code analysis', 'Smoke testing', 'Manual patching'],
        correctAnswer: 'Canary deployment',
      },
      {
        id: 608, category: 'Application Testing & Release Management',
        question: 'Before pushing a major release, what must the developer confirm?',
        options: ['Approval from QA + Change Advisory Board (CAB)', 'Only QA testing done', 'Code committed to GitHub', 'Email sent to manager'],
        correctAnswer: 'Approval from QA + Change Advisory Board (CAB)',
      },
    ]
  },
  {
    id: 'it_ticketing_change_control',
    name: 'Ticketing & Change Control',
    questions: [
      {
        id: 609, category: 'Ticketing & Change Control',
        question: 'A developer finds a bug in production. What’s the correct escalation process?',
        options: ['Fix immediately on live system', 'Log an incident ticket → assign severity → wait for CAB approval for patch', 'Ignore if minor', 'Raise a personal Jira note'],
        correctAnswer: 'Log an incident ticket → assign severity → wait for CAB approval for patch',
      },
      {
        id: 610, category: 'Ticketing & Change Control',
        question: 'What’s the main difference between a Change Request (CR) and an Incident Ticket?',
        options: ['CR = planned improvement, Incident = unplanned issue', 'Both are same', 'CR only for hardware', 'Incident needs CAB approval'],
        correctAnswer: 'CR = planned improvement, Incident = unplanned issue',
      },
      {
        id: 611, category: 'Ticketing & Change Control',
        question: 'Which role has authority to approve production deployment?',
        options: ['Developer', 'QA Tester', 'Change Manager / CAB', 'Any senior staff'],
        correctAnswer: 'Change Manager / CAB',
      },
      {
        id: 612, category: 'Ticketing & Change Control',
        question: 'What’s the first detail required in a service ticket for issue tracking?',
        options: ['Issue summary, category, environment, and severity level', 'Only screenshot', 'Email CC list', 'Log file size'],
        correctAnswer: 'Issue summary, category, environment, and severity level',
      },
    ]
  },
  {
    id: 'it_security_compliance_dev',
    name: 'Security & Compliance in Development',
    questions: [
      {
        id: 613, category: 'Security & Compliance in Development',
        question: 'If a developer needs to use third-party open-source libraries, what must they verify first?',
        options: ['License compatibility and vulnerability assessment', 'File size and version number', 'Code readability', 'Whether it runs locally'],
        correctAnswer: 'License compatibility and vulnerability assessment',
      },
      {
        id: 614, category: 'Security & Compliance in Development',
        question: 'Which tool can detect hardcoded secrets in source code before commit?',
        options: ['SonarQube', 'GitGuardian / TruffleHog', 'Jenkins', 'Visual Studio'],
        correctAnswer: 'GitGuardian / TruffleHog',
      },
      {
        id: 615, category: 'Security & Compliance in Development',
        question: 'What should developers never include in source code repositories?',
        options: ['Configuration templates', 'API keys, passwords, certificates', 'Unit test files', 'README.md'],
        correctAnswer: 'API keys, passwords, certificates',
      },
      {
        id: 616, category: 'Security & Compliance in Development',
        question: 'What’s the purpose of a Static Application Security Test (SAST)?',
        options: ['To test UI layout', 'To detect code-level vulnerabilities before runtime', 'To measure CPU usage', 'To test network speed'],
        correctAnswer: 'To detect code-level vulnerabilities before runtime',
      },
    ]
  },
  {
    id: 'it_env_access_control',
    name: 'Environment & Access Control',
    questions: [
      {
        id: 617, category: 'Environment & Access Control',
        question: 'Which practice ensures minimal risk when granting developer access to production systems?',
        options: ['Role-based access control with temporary privilege escalation', 'Full admin access for all devs', 'Sharing root credentials', 'One shared account'],
        correctAnswer: 'Role-based access control with temporary privilege escalation',
      },
      {
        id: 618, category: 'Environment & Access Control',
        question: 'When testing in an office environment, developers must:',
        options: ['Use isolated staging servers, never live databases', 'Test directly on production', 'Copy data manually from prod', 'Use real customer credentials'],
        correctAnswer: 'Use isolated staging servers, never live databases',
      },
      {
        id: 619, category: 'Environment & Access Control',
        question: 'For remote deployment, what’s the secure way to access production servers?',
        options: ['Via approved VPN + MFA', 'Using any open SSH', 'RDP without password', 'Shared public Wi-Fi'],
        correctAnswer: 'Via approved VPN + MFA',
      },
      {
        id: 620, category: 'Environment & Access Control',
        question: 'What is the most critical log type to verify after any deployment?',
        options: ['Application and system logs', 'Browser history', 'Temporary files', 'Cache reports'],
        correctAnswer: 'Application and system logs',
      },
    ]
  },
  {
    id: 'it_dos_donts',
    name: 'Do’s and Don’ts of Enterprise Development',
    questions: [
      {
        id: 621, category: 'Do’s and Don’ts of Enterprise Development',
        question: 'Developers must document changes in:',
        options: ['Change logs or Git commit messages', 'Personal notes', 'Chat history', 'Email drafts'],
        correctAnswer: 'Change logs or Git commit messages',
      },
      {
        id: 622, category: 'Do’s and Don’ts of Enterprise Development',
        question: 'If a developer identifies a vulnerability in their code, the best action is:',
        options: ['Immediately report and patch through secure pipeline', 'Hide it until next sprint', 'Fix locally without audit', 'Ignore low risk'],
        correctAnswer: 'Immediately report and patch through secure pipeline',
      },
      {
        id: 623, category: 'Do’s and Don’ts of Enterprise Development',
        question: 'What’s a common violation of software deployment policy?',
        options: ['Deploying without QA sign-off or CAB approval', 'Tagging release in Git', 'Writing release notes', 'Verifying hash'],
        correctAnswer: 'Deploying without QA sign-off or CAB approval',
      },
      {
        id: 624, category: 'Do’s and Don’ts of Enterprise Development',
        question: 'Why should test environments never contain live customer data?',
        options: ['It violates data protection and privacy laws (GDPR, etc.)', 'It increases system speed', 'It helps debugging faster', 'It reduces QA work'],
        correctAnswer: 'It violates data protection and privacy laws (GDPR, etc.)',
      },
      {
        id: 625, category: 'Do’s and Don’ts of Enterprise Development',
        question: 'Which practice ensures smooth handover between development and operations teams?',
        options: ['Proper documentation + version control + change record updates', 'Sending a verbal summary', 'Keeping code locally', 'Skipping handover'],
        correctAnswer: 'Proper documentation + version control + change record updates',
      },
    ]
  },
  {
    id: 'data_analyst_governance',
    name: 'Data Governance & Compliance',
    questions: [
      {
        id: 701,
        category: 'Data Governance & Compliance',
        question: "What is considered Personally Identifiable Information (PII) under most data protection laws?",
        options: [
          "Anonymous survey results",
          "A person's name combined with their email address",
          "Publicly available company addresses",
          "The number of employees in a company",
        ],
        correctAnswer: "A person's name combined with their email address",
      },
      {
        id: 702,
        category: 'Data Governance & Compliance',
        question: "Under GDPR, what is a valid legal basis for processing personal data?",
        options: [
          "The data seems useful for future marketing.",
          "The individual has given clear consent for a specific purpose.",
          "The data was found on a public website.",
          "A manager requested the data analysis.",
        ],
        correctAnswer: "The individual has given clear consent for a specific purpose.",
      },
    ],
  },
  {
    id: 'data_analyst_handling',
    name: 'Secure Data Handling & Storage',
    questions: [
      {
        id: 703,
        category: 'Secure Data Handling & Storage',
        question: "When a dataset containing sensitive information is not in use, how should it be stored?",
        options: [
          "On an unencrypted USB drive for easy access.",
          "In a password-protected spreadsheet on a shared network drive.",
          "In an encrypted format on a secure, access-controlled server.",
          "In a personal cloud storage account.",
        ],
        correctAnswer: "In an encrypted format on a secure, access-controlled server.",
      },
      {
        id: 704,
        category: 'Secure Data Handling & Storage',
        question: "Before sharing aggregated data with another department, what is a crucial step?",
        options: [
          "Ensure no individual's data can be re-identified from the aggregated results.",
          "Send the raw data first for them to check.",
          "Password protect the file with '12345'.",
          "Make sure the chart colors are on-brand.",
        ],
        correctAnswer: "Ensure no individual's data can be re-identified from the aggregated results.",
      },
    ],
  },
  {
    id: 'data_analyst_integrity',
    name: 'Data Quality & Integrity',
    questions: [
      {
        id: 705,
        category: 'Data Quality & Integrity',
        question: "What is the purpose of data validation during the data ingestion process?",
        options: [
          "To make the dataset larger.",
          "To check for and reject or correct inaccurate or improperly formatted data.",
          "To automatically delete any null values.",
          "To convert all text to uppercase.",
        ],
        correctAnswer: "To check for and reject or correct inaccurate or improperly formatted data.",
      },
      {
        id: 706,
        category: 'Data Quality & Integrity',
        question: "Why is it important to document data transformations and cleaning steps?",
        options: [
          "It's not important if the final report looks correct.",
          "To make the process seem more complex.",
          "To ensure the analysis is reproducible, transparent, and auditable.",
          "To create more files to store.",
        ],
        correctAnswer: "To ensure the analysis is reproducible, transparent, and auditable.",
      },
    ],
  },
  {
    id: 'data_analyst_ethics',
    name: 'Ethical Data Usage & Reporting',
    questions: [
      {
        id: 707,
        category: 'Ethical Data Usage & Reporting',
        question: "If an analysis reveals a strong correlation that could lead to a biased business decision (e.g., against a protected group), what should a data analyst do?",
        options: [
          "Present the finding without context, as 'the data doesn't lie.'",
          "Remove the finding from the report to avoid controversy.",
          "Highlight the correlation but also point out the potential for bias and recommend further investigation.",
          "Only show the data to managers who will agree with the biased outcome.",
        ],
        correctAnswer: "Highlight the correlation but also point out the potential for bias and recommend further investigation.",
      },
      {
        id: 708,
        category: 'Ethical Data Usage & Reporting',
        question: "What is a primary ethical concern when visualizing data for a general audience?",
        options: [
          "Using colors that are not visually appealing.",
          "The visualization could mislead or manipulate the audience's interpretation of the data.",
          "The chart takes too long to load.",
          "The title of the chart is too long.",
        ],
        correctAnswer: "The visualization could mislead or manipulate the audience's interpretation of the data.",
      },
    ],
  },
];