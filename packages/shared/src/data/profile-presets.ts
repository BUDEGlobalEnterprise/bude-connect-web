import type { ComboboxOption } from '../components/ComboboxMultiSelect.vue';
import type { SkillCategory } from '../components/SkillSelector.vue';

export const roles: ComboboxOption[] = [
  // --- TECHNOLOGY & ENGINEERING ---
  { value: 'frontend-dev', label: 'Frontend Developer' },
  { value: 'backend-dev', label: 'Backend Developer' },
  { value: 'fullstack-dev', label: 'Full-Stack Developer' },
  { value: 'mobile-dev', label: 'Mobile Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'sre', label: 'Site Reliability Engineer (SRE)' },
  { value: 'cloud-architect', label: 'Cloud Architect' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'data-engineer', label: 'Data Engineer' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'ai-researcher', label: 'AI Researcher' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'security-engineer', label: 'Security Engineer' },
  { value: 'blockchain-dev', label: 'Blockchain Developer' },
  { value: 'game-dev', label: 'Game Developer' },
  { value: 'embedded-dev', label: 'Embedded Systems Engineer' },
  { value: 'network-engineer', label: 'Network Engineer' },
  { value: 'systems-admin', label: 'Systems Administrator' },
  { value: 'db-admin', label: 'Database Administrator' },
  { value: 'tech-support', label: 'Technical Support Specialist' },

  // --- DESIGN & CREATIVE ---
  { value: 'ui-designer', label: 'UI Designer' },
  { value: 'ux-designer', label: 'UX Designer' },
  { value: 'product-designer', label: 'Product Designer' },
  { value: 'graphic-designer', label: 'Graphic Designer' },
  { value: 'web-designer', label: 'Web Designer' },
  { value: 'motion-designer', label: 'Motion Designer' },
  { value: '3d-artist', label: '3D Artist' },
  { value: 'art-director', label: 'Art Director' },
  { value: 'creative-director', label: 'Creative Director' },
  { value: 'animator', label: 'Animator' },
  { value: 'video-editor', label: 'Video Editor' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'copywriter', label: 'Copywriter' },
  { value: 'content-writer', label: 'Content Writer' },
  { value: 'ux-writer', label: 'UX Writer' },
  { value: 'technical-writer', label: 'Technical Writer' },
  { value: 'journalist', label: 'Journalist' },
  { value: 'editor', label: 'Editor' },
  { value: 'musician', label: 'Musician' },
  { value: 'sound-engineer', label: 'Sound Engineer' },

  // --- PRODUCT & MANAGEMENT ---
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'program-manager', label: 'Program Manager' },
  { value: 'product-owner', label: 'Product Owner' },
  { value: 'scrum-master', label: 'Scrum Master' },
  { value: 'engineering-manager', label: 'Engineering Manager' },
  { value: 'tech-lead', label: 'Tech Lead' },
  { value: 'cto', label: 'Chief Technology Officer (CTO)' },
  { value: 'ceo', label: 'Chief Executive Officer (CEO)' },
  { value: 'coo', label: 'Chief Operating Officer (COO)' },
  { value: 'cmo', label: 'Chief Marketing Officer (CMO)' },
  { value: 'cfo', label: 'Chief Financial Officer (CFO)' },
  { value: 'founder', label: 'Founder' },
  
  // --- MARKETING & SALES ---
  { value: 'marketing-manager', label: 'Marketing Manager' },
  { value: 'digital-marketer', label: 'Digital Marketer' },
  { value: 'seo-specialist', label: 'SEO Specialist' },
  { value: 'social-media-manager', label: 'Social Media Manager' },
  { value: 'brand-manager', label: 'Brand Manager' },
  { value: 'pr-specialist', label: 'Public Relations Specialist' },
  { value: 'sales-rep', label: 'Sales Representative' },
  { value: 'account-executive', label: 'Account Executive' },
  { value: 'account-manager', label: 'Account Manager' },
  { value: 'sales-manager', label: 'Sales Manager' },
  { value: 'growth-hacker', label: 'Growth Hacker' },
  { value: 'customer-success', label: 'Customer Success Manager' },

  // --- BUSINESS & FINANCE ---
  { value: 'business-analyst', label: 'Business Analyst' },
  { value: 'financial-analyst', label: 'Financial Analyst' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'controller', label: 'Financial Controller' },
  { value: 'investment-banker', label: 'Investment Banker' },
  { value: 'consultant', label: 'Management Consultant' },
  { value: 'strategy-consultant', label: 'Strategy Consultant' },
  { value: 'hr-manager', label: 'HR Manager' },
  { value: 'recruiter', label: 'Recruiter / Talent Acquisition' },
  
  // --- LEGAL ---
  { value: 'lawyer', label: 'Lawyer / Legal Counsel' },
  { value: 'corporate-lawyer', label: 'Corporate Lawyer' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'legal-assistant', label: 'Legal Assistant' },
  { value: 'compliance-officer', label: 'Compliance Officer' },

  // --- HEALTHCARE ---
  { value: 'doctor', label: 'Physician / Doctor' },
  { value: 'nurse', label: 'Nurse / Nurse Practitioner' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'psychologist', label: 'Psychologist' },
  { value: 'therapist', label: 'Therapist / Counselor' },
  { value: 'medical-researcher', label: 'Medical Researcher' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  
  // --- ENGINEERING (TRADITIONAL) ---
  { value: 'civil-engineer', label: 'Civil Engineer' },
  { value: 'mechanical-engineer', label: 'Mechanical Engineer' },
  { value: 'electrical-engineer', label: 'Electrical Engineer' },
  { value: 'chemical-engineer', label: 'Chemical Engineer' },
  { value: 'industrial-engineer', label: 'Industrial Engineer' },
  { value: 'aerospace-engineer', label: 'Aerospace Engineer' },
  { value: 'biomedical-engineer', label: 'Biomedical Engineer' },
  { value: 'architect', label: 'Architect' },

  // --- EDUCATION ---
  { value: 'teacher', label: 'Teacher / K-12 Educator' },
  { value: 'professor', label: 'Professor / Lecturer' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'researcher', label: 'Academic Researcher' },
  { value: 'librarian', label: 'Librarian' },

  // --- SERVICE & OTHER ---
  { value: 'virtual-assistant', label: 'Virtual Assistant' },
  { value: 'customer-support', label: 'Customer Support Specialist' },
  { value: 'translator', label: 'Translator / Interpreter' },
  { value: 'event-planner', label: 'Event Planner' },
  { value: 'real-estate-agent', label: 'Real Estate Agent' },
  { value: 'other', label: 'Other (specify)' }
];

export const industries: ComboboxOption[] = [
  // --- TECHNOLOGY ---
  { value: 'software', label: 'Software & Technology' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ai-ml', label: 'Artificial Intelligence (AI)' },
  { value: 'blockchain', label: 'Blockchain & Web3' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'semiconductors', label: 'Semiconductors' },
  
  // --- FINANCIAL SERVICES ---
  { value: 'banking', label: 'Banking' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'investment', label: 'Investment Management' },
  { value: 'venture-capital', label: 'Venture Capital & Private Equity' },
  { value: 'accounting', label: 'Accounting & Auditing' },
  
  // --- HEALTHCARE & SCIENCE ---
  { value: 'healthcare', label: 'Healthcare & Hospitals' },
  { value: 'pharma', label: 'Pharmaceuticals' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'medical-devices', label: 'Medical Devices' },
  { value: 'research', label: 'Research & Science' },
  
  // --- CONSUMER & RETAIL ---
  { value: 'retail', label: 'Retail' },
  { value: 'cpg', label: 'Consumer Packaged Goods (CPG)' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'luxury', label: 'Luxury Goods & Jewelry' },
  { value: 'food-bev', label: 'Food & Beverages' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'restaurants', label: 'Restaurants' },
  { value: 'sports', label: 'Sports & Fitness' },
  
  // --- INDUSTRIAL & ENERGY ---
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace-defense', label: 'Aerospace & Defense' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'oil-gas', label: 'Oil, Gas & Mining' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'construction', label: 'Construction & Materials' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'maritime', label: 'Maritime & Shipping' },
  { value: 'agriculture', label: 'Agriculture & Farming' },
  { value: 'cleantech', label: 'Environmental Services & CleanTech' },
  
  // --- PROFESSIONAL SERVICES ---
  { value: 'consulting', label: 'Management Consulting' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'marketing', label: 'Advertising & Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'education', label: 'Education' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'publishing', label: 'Publishing' },
  { value: 'non-profit', label: 'Non-profit & Philanthropy' },
  { value: 'government', label: 'Government Administration' },
  { value: 'other', label: 'Other Industry' }
];

export const seniorityLevels: ComboboxOption[] = [
  { value: 'intern', label: 'Intern' },
  { value: 'trainee', label: 'Trainee' },
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8+ years)' },
  { value: 'manager', label: 'Manager' },
  { value: 'senior-manager', label: 'Senior Manager' },
  { value: 'staff', label: 'Staff / Principal' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'Vice President (VP)' },
  { value: 'svp', label: 'Senior VP / EVP' },
  { value: 'c-level', label: 'C-Level (CEO, CTO, CFO, etc.)' },
  { value: 'founder', label: 'Founder / Co-Founder' },
  { value: 'partner', label: 'Partner' },
  { value: 'owner', label: 'Owner' },
  { value: 'board', label: 'Board Member' },
  { value: 'other', label: 'Other' }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      'React', 'Vue.js', 'Angular', 'Svelte', 'SolidJS', 'Qwik',
      'Next.js', 'Nuxt.js', 'Remix', 'Astro',
      'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 
      'Tailwind CSS', 'SASS/SCSS', 'Styled Components', 'Emotion',
      'Redux', 'Pinia', 'Zustand', 'React Query', 'SWR',
      'Webpack', 'Vite', 'Turbopack', 'Rollup', 'Esbuild'
    ]
  },
  {
    name: 'Backend',
    skills: [
      'Node.js', 'Deno', 'Bun', 'Python', 'Java', 'Go', 'Rust', 'Ruby', 'PHP', 'C#',
      'Django', 'Flask', 'FastAPI', 'Express.js', 'NestJS', 'AdonisJS',
      'Spring Boot', 'Ruby on Rails', 'Laravel', 'ASP.NET Core',
      'GraphQL', 'gRPC', 'tRPC', 'WebSockets', 'REST API', 'Microservices'
    ]
  },
  {
    name: 'Mobile',
    skills: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Objective-C', 'Java (Android)',
      'iOS Development', 'Android Development', 'Expo', 'Ionic', 'Capacitor', 'Xamarin', '.NET MAUI'
    ]
  },
  {
    name: 'Database',
    skills: [
      'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'Microsoft SQL Server',
      'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'CouchDB',
      'Elasticsearch', 'Solr', 'Neo4j', 'ArangoDB',
      'Firebase', 'Supabase', 'PlanetScale', 'Neon'
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      'AWS', 'Azure', 'Google Cloud Platform (GCP)', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify',
      'Docker', 'Kubernetes', 'Podman', 'Helm',
      'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI', 'ArgoCD',
      'Terraform', 'Ansible', 'Pulumi', 'CloudFormation', 'Chef', 'Puppet',
      'Linux', 'Bash', 'Shell Scripting', 'Nginx', 'Apache', 'Caddy'
    ]
  },
  {
    name: 'Design & Creative',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
      'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro',
      'Blender', 'Cinema 4D', 'Maya', '3ds Max', 'Unity', 'Unreal Engine',
      'InVision', 'Framer', 'Principle', 'Zeplin', 'ProtoPie',
      'User Research', 'Wireframing', 'Prototyping', 'Typography', 'Color Theory'
    ]
  },
  {
    name: 'Data & AI',
    skills: [
      'Python', 'R', 'SQL', 'Scala', 'Julia', 'MATLAB',
      'TensorFlow', 'PyTorch', 'Keras', 'JAX', 'Scikit-learn',
      'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly',
      'OpenCV', 'NLTK', 'Spacy', 'Hugging Face Transformers', 'LLMs', 'Generative AI',
      'Spark', 'Hadoop', 'Kafka', 'Airflow', 'dbt', 'Snowflake',
      'Power BI', 'Tableau', 'Looker', 'Qlik'
    ]
  },
  {
    name: 'Blockchain & Web3',
    skills: [
      'Solidity', 'Rust', 'Vyper', 'Motoko', 'Move',
      'Ethereum', 'Solana', 'Polkadot', 'Polygon', 'Avalanche', 'Cosmos',
      'Hardhat', 'Truffle', 'Foundry', 'Web3.js', 'Ethers.js', 'Viem',
      'Smart Contracts', 'Defi', 'NFTs', 'DAOs', 'IPFS'
    ]
  },
  {
    name: 'Digital Marketing',
    skills: [
      'SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'TikTok Ads',
      'Content Marketing', 'Copywriting', 'Blogging', 'Email Marketing', 'Newsletter',
      'Google Analytics', 'GA4', 'Mixpanel', 'Amplitude',
      'Social Media Marketing', 'Community Management', 'Influencer Marketing',
      'HubSpot', 'Salesforce Marketing Cloud', 'Mailchimp'
    ]
  },
  {
    name: 'Business & Finance',
    skills: [
      'Project Management', 'Product Management', 'Market Research', 'Competitive Analysis',
      'Business Strategy', 'Financial Modeling', 'Valuation', 'Forecasting',
      'Accounting', 'Bookkeeping', 'Taxation', 'Auditing',
      'Excel', 'VBA', 'Tableau', 'Power BI', 'QuickBooks', 'Xero', 'SAP', 'Oracle ERP',
      'Sales', 'Negotiation', 'CRM', 'Salesforce', 'HubSpot'
    ]
  },
  {
    name: 'Legal & HR',
    skills: [
      'Contract Law', 'Corporate Law', 'IP Law', 'Employment Law', 'Compliance',
      'Legal Research', 'Drafting', 'Litigation',
      'Recruiting', 'Sourcing', 'Talent Acquisition', 'Employee Relations',
      'Payroll', 'Benefits Administration', 'HRIS', 'Workday', 'BambooHR'
    ]
  },
   {
    name: 'Healthcare',
    skills: [
      'Patient Care', 'Clinical Research', 'Electronic Health Records (EHR)', 'Epic', 'Cerner',
      'Medical Terminology', 'Diagnosis', 'Treatment Planning', 'Surgery',
      'Pharmacology', 'Public Health', 'First Aid', 'CPR'
    ]
  },
  {
    name: 'Office & Productivity',
    skills: [
      'Microsoft Office', 'Excel', 'PowerPoint', 'Word', 'Outlook',
      'Google Workspace', 'Docs', 'Sheets', 'Slides',
      'Notion', 'Asana', 'Trello', 'Jira', 'Monday.com', 'Slack', 'Teams',
      'Typing', 'Data Entry', 'Transcription', 'Virtual Assistance'
    ]
  },
  {
    name: 'Soft Skills',
    skills: [
      'Leadership', 'Communication', 'Teamwork', 'Collaboration', 'Problem Solving',
      'Critical Thinking', 'Adaptability', 'Emotional Intelligence', 'Empathy',
      'Time Management', 'Organization', 'Prioritization',
      'Mentoring', 'Coaching', 'Training',
      'Public Speaking', 'Presentation', 'Storytelling',
      'Conflict Resolution', 'Negotiation', 'Persuasion'
    ]
  }
];

export const languages: ComboboxOption[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese (Mandarin)' },
  { value: 'es', label: 'Spanish' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'bn', label: 'Bengali' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'de', label: 'German' },
  { value: 'jv', label: 'Javanese' },
  { value: 'wu', label: 'Chinese (Wu)' },
  { value: 'ms', label: 'Malay' },
  { value: 'te', label: 'Telugu' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'ko', label: 'Korean' },
  { value: 'fr', label: 'French' },
  { value: 'mr', label: 'Marathi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'ur', label: 'Urdu' },
  { value: 'tr', label: 'Turkish' },
  { value: 'it', label: 'Italian' },
  { value: 'yue', label: 'Chinese (Cantonese)' },
  { value: 'th', label: 'Thai' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'kn', label: 'Kannada' },
  { value: 'fa', label: 'Persian' },
  { value: 'pl', label: 'Polish' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'su', label: 'Sundanese' },
  { value: 'ha', label: 'Hausa' },
  { value: 'my', label: 'Burmese' },
  { value: 'or', label: 'Odia' },
  { value: 'az', label: 'Azerbaijani' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'nl', label: 'Dutch' },
  { value: 'ro', label: 'Romanian' },
  { value: 'sw', label: 'Swahili' },
  { value: 'el', label: 'Greek' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'sv', label: 'Swedish' },
  { value: 'cs', label: 'Czech' },
  { value: 'he', label: 'Hebrew' },
  { value: 'da', label: 'Danish' },
  { value: 'fi', label: 'Finnish' },
  { value: 'no', label: 'Norwegian' },
  { value: 'other', label: 'Other Language' }
];

export const universities: ComboboxOption[] = [
  // --- NORTH AMERICA ---
  { value: 'mit', label: 'Massachusetts Institute of Technology (MIT) - USA' },
  { value: 'stanford', label: 'Stanford University - USA' },
  { value: 'harvard', label: 'Harvard University - USA' },
  { value: 'caltech', label: 'California Institute of Technology - USA' },
  { value: 'uchicago', label: 'University of Chicago - USA' },
  { value: 'upenn', label: 'University of Pennsylvania - USA' },
  { value: 'princeton', label: 'Princeton University - USA' },
  { value: 'yale', label: 'Yale University - USA' },
  { value: 'cornell', label: 'Cornell University - USA' },
  { value: 'columbia', label: 'Columbia University - USA' },
  { value: 'jhu', label: 'Johns Hopkins University - USA' },
  { value: 'umich', label: 'University of Michigan-Ann Arbor - USA' },
  { value: 'berkeley', label: 'University of California, Berkeley - USA' },
  { value: 'ucla', label: 'University of California, Los Angeles - USA' },
  { value: 'ucsd', label: 'University of California, San Diego - USA' },
  { value: 'nyu', label: 'New York University (NYU) - USA' },
  { value: 'duke', label: 'Duke University - USA' },
  { value: 'cmu', label: 'Carnegie Mellon University - USA' },
  { value: 'gatech', label: 'Georgia Institute of Technology - USA' },
  { value: 'ut-austin', label: 'University of Texas at Austin - USA' },
  { value: 'uiuc', label: 'University of Illinois Urbana-Champaign - USA' },
  { value: 'utoronto', label: 'University of Toronto - Canada' },
  { value: 'ubc', label: 'University of British Columbia - Canada' },
  { value: 'mcgill', label: 'McGill University - Canada' },
  { value: 'waterloo', label: 'University of Waterloo - Canada' },
  { value: 'unam', label: 'UNAM - Mexico' },
  
  // --- EUROPE ---
  { value: 'oxford', label: 'University of Oxford - UK' },
  { value: 'cambridge', label: 'University of Cambridge - UK' },
  { value: 'imperial', label: 'Imperial College London - UK' },
  { value: 'ucl', label: 'University College London - UK' },
  { value: 'edinburgh', label: 'University of Edinburgh - UK' },
  { value: 'kcl', label: 'King\'s College London - UK' },
  { value: 'manchester', label: 'University of Manchester - UK' },
  { value: 'lse', label: 'London School of Economics - UK' },
  { value: 'eth', label: 'ETH Zurich - Switzerland' },
  { value: 'epfl', label: 'EPFL - Switzerland' },
  { value: 'tum', label: 'Technical University of Munich - Germany' },
  { value: 'lmu', label: 'LMU Munich - Germany' },
  { value: 'heidelberg', label: 'Heidelberg University - Germany' },
  { value: 'psl', label: 'PSL Research University - France' },
  { value: 'polytechnique', label: 'École Polytechnique - France' },
  { value: 'sorbonne', label: 'Sorbonne University - France' },
  { value: 'delft', label: 'Delft University of Technology - Netherlands' },
  { value: 'uva', label: 'University of Amsterdam - Netherlands' },
  { value: 'ku-leuven', label: 'KU Leuven - Belgium' },
  { value: 'karolinska', label: 'Karolinska Institute - Sweden' },
  { value: 'kth', label: 'KTH Royal Institute of Technology - Sweden' },
  { value: 'ku-copenhagen', label: 'University of Copenhagen - Denmark' },
  { value: 'trinity', label: 'Trinity College Dublin - Ireland' },
  { value: 'bologna', label: 'University of Bologna - Italy' },
  { value: 'polimi', label: 'Politecnico di Milano - Italy' },
  { value: 'mv-lomonosov', label: 'Lomonosov Moscow State University - Russia' },

  // --- ASIA ---
  { value: 'nus', label: 'National University of Singapore - Singapore' },
  { value: 'ntu', label: 'Nanyang Technological University - Singapore' },
  { value: 'tsinghua', label: 'Tsinghua University - China' },
  { value: 'peking', label: 'Peking University - China' },
  { value: 'fudan', label: 'Fudan University - China' },
  { value: 'zhejiang', label: 'Zhejiang University - China' },
  { value: 'shanghai-jiao-tong', label: 'Shanghai Jiao Tong University - China' },
  { value: 'hku', label: 'University of Hong Kong - Hong Kong' },
  { value: 'hkust', label: 'HKUST - Hong Kong' },
  { value: 'cuhk', label: 'Chinese University of Hong Kong - Hong Kong' },
  { value: 'tokyo', label: 'University of Tokyo - Japan' },
  { value: 'kyoto', label: 'Kyoto University - Japan' },
  { value: 'titech', label: 'Tokyo Institute of Technology - Japan' },
  { value: 'snu', label: 'Seoul National University - South Korea' },
  { value: 'kaist', label: 'KAIST - South Korea' },
  { value: 'yonsei', label: 'Yonsei University - South Korea' },
  { value: 'korea-uni', label: 'Korea University - South Korea' },
  { value: 'taiwan-uni', label: 'National Taiwan University - Taiwan' },
  { value: 'um-malaysia', label: 'Universiti Malaya - Malaysia' },

  // --- INDIA ---
  { value: 'iit-bombay', label: 'IIT Bombay - India' },
  { value: 'iit-delhi', label: 'IIT Delhi - India' },
  { value: 'iit-madras', label: 'IIT Madras - India' },
  { value: 'iit-kanpur', label: 'IIT Kanpur - India' },
  { value: 'iit-kharagpur', label: 'IIT Kharagpur - India' },
  { value: 'iit-roorkee', label: 'IIT Roorkee - India' },
  { value: 'iit-guwahati', label: 'IIT Guwahati - India' },
  { value: 'iisc', label: 'Indian Institute of Science (IISc) - India' },
  { value: 'bits-pilani', label: 'BITS Pilani - India' },
  { value: 'nit-trichy', label: 'NIT Trichy - India' },
  { value: 'du', label: 'University of Delhi - India' },
  { value: 'jnu', label: 'Jawaharlal Nehru University - India' },
  { value: 'anna', label: 'Anna University - India' },
  { value: 'vit', label: 'VIT University - India' },
  { value: 'manipal', label: 'Manipal Academy of Higher Education - India' },
  { value: 'iim-ahmedabad', label: 'IIM Ahmedabad - India' },
  { value: 'iim-bangalore', label: 'IIM Bangalore - India' },
  { value: 'iim-calcutta', label: 'IIM Calcutta - India' },

  // --- OCEANIA ---
  { value: 'unimelb', label: 'University of Melbourne - Australia' },
  { value: 'usyd', label: 'University of Sydney - Australia' },
  { value: 'unsw', label: 'UNSW Sydney - Australia' },
  { value: 'anu', label: 'Australian National University - Australia' },
  { value: 'uq', label: 'University of Queensland - Australia' },
  { value: 'monash', label: 'Monash University - Australia' },
  { value: 'auckland', label: 'University of Auckland - New Zealand' },

  // --- SOUTH AMERICA ---
  { value: 'usp', label: 'University of São Paulo - Brazil' },
  { value: 'unicamp', label: 'University of Campinas - Brazil' },
  { value: 'puc-chile', label: 'Pontificia Universidad Católica de Chile - Chile' },
  { value: 'uchile', label: 'University of Chile - Chile' },
  { value: 'tec-monterrey', label: 'Tecnológico de Monterrey - Mexico' },
  { value: 'uba', label: 'University of Buenos Aires - Argentina' },

  // --- AFRICA & MIDDLE EAST ---
  { value: 'uct', label: 'University of Cape Town - South Africa' },
  { value: 'wits', label: 'University of the Witwatersrand - South Africa' },
  { value: 'auc', label: 'American University in Cairo - Egypt' },
  { value: 'kaust', label: 'KAUST - Saudi Arabia' },
  { value: 'kfupm', label: 'KFUPM - Saudi Arabia' },
  { value: 'uaeu', label: 'United Arab Emirates University - UAE' },
  { value: 'tel-aviv', label: 'Tel Aviv University - Israel' },
  { value: 'huji', label: 'Hebrew University of Jerusalem - Israel' },
  { value: 'technion', label: 'Technion - Israel Institute of Technology - Israel' },
  { value: 'other', label: 'Other University' }
];

export const companies: ComboboxOption[] = [
  // --- TECH GIANTS (MAMAA) ---
  { value: 'google', label: 'Google / Alphabet' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'apple', label: 'Apple' },
  { value: 'meta', label: 'Meta (Facebook)' },

  // --- BIG TECH / HARDWARE / SEMI ---
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'tsmc', label: 'TSMC' },
  { value: 'samsung', label: 'Samsung Electronics' },
  { value: 'intel', label: 'Intel' },
  { value: 'amd', label: 'AMD' },
  { value: 'qualcomm', label: 'Qualcomm' },
  { value: 'broadcom', label: 'Broadcom' },
  { value: 'cisco', label: 'Cisco' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'adobe', label: 'Adobe' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'sap', label: 'SAP' },
  { value: 'ibm', label: 'IBM' },
  { value: 'sony', label: 'Sony' },
  { value: 'dell', label: 'Dell Technologies' },
  { value: 'hp', label: 'HP' },
  { value: 'lenovo', label: 'Lenovo' },
  { value: 'asus', label: 'ASUS' },

  // --- HIGH GROWTH / INTERNET ---
  { value: 'netflix', label: 'Netflix' },
  { value: 'uber', label: 'Uber' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'bytedance', label: 'ByteDance (TikTok)' },
  { value: 'tencent', label: 'Tencent' },
  { value: 'alibaba', label: 'Alibaba Group' },
  { value: 'booking', label: 'Booking Holdings' },
  { value: 'mercadolibre', label: 'MercadoLibre' },
  { value: 'grab', label: 'Grab' },
  { value: 'sea', label: 'Sea Limited (Shopee)' },

  // --- FINANCE & CONSULTING ---
  { value: 'jpmorgan', label: 'JPMorgan Chase' },
  { value: 'bank-of-america', label: 'Bank of America' },
  { value: 'wellsfargo', label: 'Wells Fargo' },
  { value: 'citigroup', label: 'Citigroup' },
  { value: 'goldman-sachs', label: 'Goldman Sachs' },
  { value: 'morgan-stanley', label: 'Morgan Stanley' },
  { value: 'blackrock', label: 'BlackRock' },
  { value: 'hsbc', label: 'HSBC' },
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'berkshire', label: 'Berkshire Hathaway' },
  { value: 'mckinsey', label: 'McKinsey & Company' },
  { value: 'bcg', label: 'Boston Consulting Group (BCG)' },
  { value: 'bain', label: 'Bain & Company' },
  { value: 'deloitte', label: 'Deloitte' },
  { value: 'pwc', label: 'PwC' },
  { value: 'ey', label: 'EY' },
  { value: 'kpmg', label: 'KPMG' },
  { value: 'accenture', label: 'Accenture' },

  // --- INDUSTRIAL / AUTO / ENERGY ---
  { value: 'toyota', label: 'Toyota' },
  { value: 'vw', label: 'Volkswagen Group' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'bmw', label: 'BMW Group' },
  { value: 'ford', label: 'Ford' },
  { value: 'gm', label: 'General Motors' },
  { value: 'ge', label: 'General Electric' },
  { value: 'siemens', label: 'Siemens' },
  { value: 'honeywell', label: 'Honeywell' },
  { value: 'boeing', label: 'Boeing' },
  { value: 'airbus', label: 'Airbus' },
  { value: 'lockheed', label: 'Lockheed Martin' },
  { value: 'caterpillar', label: 'Caterpillar' },
  { value: 'deere', label: 'John Deere' },
  { value: 'exxon', label: 'ExxonMobil' },
  { value: 'chevron', label: 'Chevron' },
  { value: 'shell', label: 'Shell' },
  { value: 'bp', label: 'BP' },
  { value: 'aramco', label: 'Saudi Aramco' },

  // --- CONSUMER & RETAIL ---
  { value: 'walmart', label: 'Walmart' },
  { value: 'costco', label: 'Costco' },
  { value: 'target', label: 'Target' },
  { value: 'homedepot', label: 'Home Depot' },
  { value: 'cvs', label: 'CVS Health' },
  { value: 'unitedhealth', label: 'UnitedHealth Group' },
  { value: 'jnj', label: 'Johnson & Johnson' },
  { value: 'pfizer', label: 'Pfizer' },
  { value: 'merck', label: 'Merck & Co.' },
  { value: 'novartis', label: 'Novartis' },
  { value: 'roche', label: 'Roche' },
  { value: 'pg', label: 'Procter & Gamble (P&G)' },
  { value: 'unilever', label: 'Unilever' },
  { value: 'nestle', label: 'Nestlé' },
  { value: 'pepsico', label: 'PepsiCo' },
  { value: 'cocacola', label: 'The Coca-Cola Company' },
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'lvmh', label: 'LVMH' },
  { value: 'disney', label: 'The Walt Disney Company' },
  { value: 'mcdonalds', label: 'McDonald\'s' },
  { value: 'starbucks', label: 'Starbucks' },

  // --- INDIA TOP 20 ---
  { value: 'reliance', label: 'Reliance Industries' },
  { value: 'tcs', label: 'Tata Consultancy Services (TCS)' },
  { value: 'hdfc', label: 'HDFC Bank' },
  { value: 'icici', label: 'ICICI Bank' },
  { value: 'infosys', label: 'Infosys' },
  { value: 'hul', label: 'Hindustan Unilever' },
  { value: 'itc', label: 'ITC Limited' },
  { value: 'sbi', label: 'State Bank of India' },
  { value: 'bharti-airtel', label: 'Bharti Airtel' },
  { value: 'lic', label: 'LIC India' },
  { value: 'larsen-toubro', label: 'Larsen & Toubro (L&T)' },
  { value: 'hcl', label: 'HCL Technologies' },
  { value: 'wipro', label: 'Wipro' },
  { value: 'mahindra', label: 'Mahindra & Mahindra' },
  { value: 'tata-steel', label: 'Tata Steel' },
  { value: 'tata-motors', label: 'Tata Motors' },
  { value: 'adani', label: 'Adani Group' },
  { value: 'sun-pharma', label: 'Sun Pharma' },
  { value: 'asian-paints', label: 'Asian Paints' },
  { value: 'bajaj-finance', label: 'Bajaj Finance' },
  
  // --- INDIAN STARTUPS ---
  { value: 'flipkart', label: 'Flipkart' },
  { value: 'paytm', label: 'Paytm' },
  { value: 'zomato', label: 'Zomato' },
  { value: 'swiggy', label: 'Swiggy' },
  { value: 'byjus', label: 'BYJU\'S' },
  { value: 'ola', label: 'Ola' },
  { value: 'oyo', label: 'OYO Rooms' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'cred', label: 'CRED' },
  { value: 'zerodha', label: 'Zerodha' },
  { value: 'groww', label: 'Groww' },
  { value: 'phonepe', label: 'PhonePe' },
  { value: 'dream11', label: 'Dream11' },
  { value: 'udaan', label: 'Udaan' },
  { value: 'freshworks', label: 'Freshworks' },
  { value: 'postman', label: 'Postman' },
  { value: 'browserstack', label: 'BrowserStack' },
  { value: 'lenskart', label: 'Lenskart' },
  { value: 'nykaa', label: 'Nykaa' },
  { value: 'meesho', label: 'Meesho' },
  { value: 'zepto', label: 'Zepto' },
  { value: 'other', label: 'Other Company' }
];

export const certifications: ComboboxOption[] = [
  // --- CLOUD & DEVOPS ---
  { value: 'aws-sa-assoc', label: 'AWS Certified Solutions Architect - Associate' },
  { value: 'aws-sa-pro', label: 'AWS Certified Solutions Architect - Professional' },
  { value: 'aws-dev', label: 'AWS Certified Developer - Associate' },
  { value: 'aws-sysops', label: 'AWS Certified SysOps Administrator' },
  { value: 'gcp-ace', label: 'Google Cloud Associate Cloud Engineer' },
  { value: 'gcp-pca', label: 'Google Cloud Professional Cloud Architect' },
  { value: 'gcp-pde', label: 'Google Cloud Professional Data Engineer' },
  { value: 'azure-fund', label: 'Microsoft Certified: Azure Fundamentals (AZ-900)' },
  { value: 'azure-admin', label: 'Microsoft Certified: Azure Administrator (AZ-104)' },
  { value: 'azure-sol-arch', label: 'Microsoft Certified: Azure Solutions Architect' },
  { value: 'cka', label: 'Certified Kubernetes Administrator (CKA)' },
  { value: 'ckad', label: 'Certified Kubernetes Application Developer (CKAD)' },
  { value: 'terraform-assoc', label: 'HashiCorp Certified: Terraform Associate' },
  
  // --- SECURITY ---
  { value: 'cissp', label: 'CISSP - Certified Information Systems Security Professional' },
  { value: 'cism', label: 'CISM - Certified Information Security Manager' },
  { value: 'ceh', label: 'CEH - Certified Ethical Hacker' },
  { value: 'comptia-sec', label: 'CompTIA Security+' },
  { value: 'oscp', label: 'OSCP - Offensive Security Certified Professional' },
  
  // --- IT & NETWORKING ---
  { value: 'ccna', label: 'CCNA - Cisco Certified Network Associate' },
  { value: 'ccnp', label: 'CCNP - Cisco Certified Network Professional' },
  { value: 'ccie', label: 'CCIE - Cisco Certified Internetwork Expert' },
  { value: 'comptia-a', label: 'CompTIA A+' },
  { value: 'comptia-net', label: 'CompTIA Network+' },
  { value: 'itil', label: 'ITIL Foundation' },
  
  // --- PROJECT MANAGEMENT ---
  { value: 'pmp', label: 'PMP - Project Management Professional' },
  { value: 'capm', label: 'CAPM - Certified Associate in Project Management' },
  { value: 'csm', label: 'CSM - Certified ScrumMaster' },
  { value: 'cspo', label: 'CSPO - Certified Scrum Product Owner' },
  { value: 'psm', label: 'PSM - Professional Scrum Master' },
  { value: 'safe', label: 'SAFe Agilist' },
  { value: 'prince2', label: 'PRINCE2' },
  
  // --- DATA & AI ---
  { value: 'tensorflow-dev', label: 'TensorFlow Developer Certificate' },
  { value: 'azure-ai', label: 'Microsoft Certified: Azure AI Engineer Associate' },
  { value: 'tableau-ds', label: 'Tableau Desktop Specialist' },
  { value: 'powerbi-da', label: 'Microsoft Certified: Power BI Data Analyst' },
  
  // --- FINANCE & ACCOUNTING ---
  { value: 'cpa', label: 'CPA - Certified Public Accountant' },
  { value: 'cfa', label: 'CFA - Chartered Financial Analyst' },
  { value: 'ca', label: 'CA - Chartered Accountant' },
  { value: 'cma', label: 'CMA - Certified Management Accountant' },
  { value: 'frm', label: 'FRM - Financial Risk Manager' },
  { value: 'acca', label: 'ACCA' },
  
  // --- MARKETING & SALES ---
  { value: 'google-ads', label: 'Google Ads Certification' },
  { value: 'google-analytics', label: 'Google Analytics IQ' },
  { value: 'hubspot-inbound', label: 'HubSpot Inbound Certification' },
  { value: 'salesforce-admin', label: 'Salesforce Certified Administrator' },
  { value: 'meta-marketing', label: 'Meta Certified Digital Marketing Associate' },
  
  // --- OTHER ---
  { value: 'shrm', label: 'SHRM-CP / SHRM-SCP' },
  { value: 'phr', label: 'PHR / SPHR (HR)' },
  { value: 'six-sigma-green', label: 'Lean Six Sigma Green Belt' },
  { value: 'six-sigma-black', label: 'Lean Six Sigma Black Belt' },
  { value: 'leed', label: 'LEED Accredited Professional (Architecture)' },
  { value: 'other', label: 'Other Certification' }
];

export const degreeTypes: ComboboxOption[] = [
  { value: 'high-school', label: 'High School Diploma / GED' },
  { value: 'associate', label: 'Associate Degree (AA, AS, AAS)' },
  { value: 'bachelor', label: "Bachelor's Degree (BA, BS, BTech, BE, BArch)" },
  { value: 'master', label: "Master's Degree (MA, MS, MTech, MBA, MCA, MArch)" },
  { value: 'doctorate', label: 'Doctorate (PhD, EdD, DPhil, DBA)' },
  { value: 'medical', label: 'Medical Degree (MD, MBBS, DO, DDS, DVM)' },
  { value: 'law', label: 'Law Degree (JD, LLB, LLM)' },
  { value: 'bootcamp', label: 'Bootcamp Certificate' },
  { value: 'postgrad-diploma', label: 'Postgraduate Diploma / Certificate' },
  { value: 'professional', label: 'Professional Degree' },
  { value: 'certification', label: 'Professional Certification' },
  { value: 'self-taught', label: 'Self-Taught / Portfolio' },
  { value: 'honorary', label: 'Honorary Degree' },
  { value: 'other', label: 'Other Degree' }
];

export const fieldsOfStudy: ComboboxOption[] = [
  // --- TECH & ENGINEERING ---
  { value: 'cs', label: 'Computer Science' },
  { value: 'se', label: 'Software Engineering' },
  { value: 'it', label: 'Information Technology' },
  { value: 'cis', label: 'Computer Information Systems' },
  { value: 'data-science', label: 'Data Science / Analytics' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'ee', label: 'Electrical / Electronics Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'ce', label: 'Civil Engineering' },
  { value: 'che', label: 'Chemical Engineering' },
  { value: 'industrial-eng', label: 'Industrial Engineering' },
  { value: 'aerospace', label: 'Aerospace Engineering' },
  
  // --- SCIENCE ---
  { value: 'mathematics', label: 'Mathematics / Statistics' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology / Life Sciences' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'environmental', label: 'Environmental Science' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'neuroscience', label: 'Neuroscience' },
  
  // --- BUSINESS ---
  { value: 'business', label: 'Business Administration / Management' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'economics', label: 'Economics' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'supply-chain', label: 'Supply Chain Management' },
  
  // --- HUMANITIES & ARTS ---
  { value: 'english', label: 'English Literature' },
  { value: 'history', label: 'History' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'polisci', label: 'Political Science' },
  { value: 'sociology', label: 'Sociology' },
  { value: 'design', label: 'Design (Graphic, UI/UX, Product)' },
  { value: 'fine-arts', label: 'Fine Arts' },
  { value: 'music', label: 'Music' },
  { value: 'film', label: 'Film & Media Studies' },
  { value: 'journalism', label: 'Journalism / Communications' },
  
  // --- PROFESSIONS ---
  { value: 'law', label: 'Law' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'public-health', label: 'Public Health' },
  { value: 'education', label: 'Education' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'other', label: 'Other' }
];

export const jobTypes: ComboboxOption[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance / Self-employed' },
  { value: 'internship', label: 'Internship' },
  { value: 'co-op', label: 'Co-op' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'consultant', label: 'Consultancy' },
  { value: 'other', label: 'Other' }
];

export const workModes: ComboboxOption[] = [
  { value: 'remote', label: 'Remote / Work from Home' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site / Office' },
  { value: 'flexible', label: 'Flexible / Asynchronous' },
  { value: 'travel', label: 'Travel Required' },
  { value: 'other', label: 'Other' }
];

export const userCategories: ComboboxOption[] = [
  { value: 'developer', label: 'Developer / Engineer' },
  { value: 'designer', label: 'Designer / Creative' },
  { value: 'product', label: 'Product Manager / Owner' },
  { value: 'manager', label: 'Manager / Executive' },
  { value: 'data', label: 'Data Scientist / Analyst' },
  { value: 'marketing', label: 'Marketing / Sales' },
  { value: 'hr', label: 'HR / Recruiter' },
  { value: 'finance', label: 'Finance / Accounting' },
  { value: 'legal', label: 'Legal Professional' },
  { value: 'healthcare', label: 'Healthcare Professional' },
  { value: 'education', label: 'Educator / Researcher' },
  { value: 'student', label: 'Student' },
  { value: 'entrepreneur', label: 'Entrepreneur / Founder' },
  { value: 'investor', label: 'Investor (Angel/VC)' },
  { value: 'consultant', label: 'Consultant / Advisor' },
  { value: 'creator', label: 'Content Creator / Influencer' },
  { value: 'other', label: 'Other' }
];

export const openToOptions: ComboboxOption[] = [
  { value: 'full-time', label: 'Full-time Opportunities' },
  { value: 'contract', label: 'Contract Work' },
  { value: 'freelance', label: 'Freelance Projects' },
  { value: 'part-time', label: 'Part-time Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'cofounder', label: 'Co-founder Roles' },
  { value: 'advisory', label: 'Advisory Roles' },
  { value: 'board', label: 'Board Seats' },
  { value: 'hiring', label: 'Hiring / Recruiting' },
  { value: 'investing', label: 'Investing Opportunities' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'networking', label: 'Networking' },
  { value: 'speaking', label: 'Speaking Opportunities' },
  { value: 'other', label: 'Other' }
];

export const genders: ComboboxOption[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Other', label: 'Other' }
];

export const idTypes: (ComboboxOption & { placeholder?: string })[] = [
  { value: 'aadhaar', label: 'Aadhaar Card', placeholder: '123456789012' },
  { value: 'pan', label: 'PAN Card', placeholder: 'ABCDE1234F' },
  { value: 'passport', label: 'Passport', placeholder: 'A1234567' },
  { value: 'driving_license', label: 'Driving License', placeholder: 'DL-1234567890' },
  { value: 'voter_id', label: 'Voter ID', placeholder: 'ABC1234567' },
  { value: 'national_id', label: 'National ID', placeholder: 'ID Number' },
  { value: 'other', label: 'Other', placeholder: 'ID Number' }
];

export const timezones: string[] = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'UTC'
];

export const countries: ComboboxOption[] = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Japan', label: 'Japan' },
  { value: 'China', label: 'China' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Other', label: 'Other' }
];

export const salutations: ComboboxOption[] = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Prof', label: 'Prof' },
  { value: 'Mx', label: 'Mx' },
];

export const bloodGroups: ComboboxOption[] = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const maritalStatuses: ComboboxOption[] = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Other', label: 'Other' },
];

export const departments: ComboboxOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Legal', label: 'Legal' },
  { value: 'IT', label: 'IT / Support' },
  { value: 'Customer Success', label: 'Customer Success' },
  { value: 'R&D', label: 'Research & Development' },
  { value: 'Administration', label: 'Administration' },
];
