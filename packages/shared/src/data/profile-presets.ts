import type { ComboboxOption } from '../components/ComboboxMultiSelect.vue';
import type { SkillCategory } from '../components/SkillSelector.vue';

export const roles: ComboboxOption[] = [
  // Engineering & Development
  { value: 'frontend-dev', label: 'Frontend Developer' },
  { value: 'backend-dev', label: 'Backend Developer' },
  { value: 'fullstack-dev', label: 'Full-Stack Developer' },
  { value: 'mobile-dev', label: 'Mobile Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'sre', label: 'Site Reliability Engineer (SRE)' },
  { value: 'cloud-architect', label: 'Cloud Architect' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'ai-researcher', label: 'AI Researcher' },
  { value: 'data-engineer', label: 'Data Engineer' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'security-engineer', label: 'Security Engineer' },
  { value: 'blockchain-dev', label: 'Blockchain Developer' },
  { value: 'game-dev', label: 'Game Developer' },
  { value: 'embedded-dev', label: 'Embedded Systems Engineer' },

  // Design & Creative
  { value: 'ui-designer', label: 'UI Designer' },
  { value: 'ux-designer', label: 'UX Designer' },
  { value: 'product-designer', label: 'Product Designer' },
  { value: 'graphic-designer', label: 'Graphic Designer' },
  { value: 'motion-designer', label: 'Motion Designer' },
  { value: '3d-artist', label: '3D Artist' },

  // Product & Management
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'product-owner', label: 'Product Owner' },
  { value: 'scrum-master', label: 'Scrum Master' },
  { value: 'engineering-manager', label: 'Engineering Manager' },
  { value: 'tech-lead', label: 'Tech Lead' },
  { value: 'cto', label: 'Chief Technology Officer (CTO)' },
  { value: 'founder', label: 'Founder' },

  // Other
  { value: 'technical-writer', label: 'Technical Writer' },
  { value: 'dev-advocate', label: 'Developer Advocate' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'other', label: 'Other (specify)' }
];

export const industries: ComboboxOption[] = [
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ai-ml', label: 'Artificial Intelligence (AI)' },
  { value: 'blockchain', label: 'Blockchain & Web3' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'enterprise', label: 'Enterprise Software' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'iot', label: 'Internet of Things (IoT)' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'cleantech', label: 'CleanTech' },
  { value: 'proptech', label: 'PropTech' },
  { value: 'adtech', label: 'AdTech' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'other', label: 'Other Industry' }
];

export const seniorityLevels: ComboboxOption[] = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8+ years)' },
  { value: 'staff', label: 'Staff Engineer' },
  { value: 'principal', label: 'Principal Engineer' },
  { value: 'distinguished', label: 'Distinguished Engineer' },
  { value: 'architect', label: 'Architect' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'VP / Executive' },
  { value: 'c-level', label: 'C-Level' },
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
      'GraphQL', 'gRPC', 'tRPC', 'WebSockets', 'REST API'
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
      'Docker', 'Kubernetes', 'Podman',
      'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI',
      'Terraform', 'Ansible', 'Pulumi', 'CloudFormation',
      'Linux', 'Bash', 'Nginx', 'Apache', 'Caddy'
    ]
  },
  {
    name: 'Design',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
      'After Effects', 'Premiere Pro', 'Blender', 'Cinema 4D',
      'InVision', 'Framer', 'Principle', 'Zeplin', 'ProtoPie'
    ]
  },
  {
    name: 'Data & AI',
    skills: [
      'Python', 'R', 'SQL', 'Scala', 'Julia',
      'TensorFlow', 'PyTorch', 'Keras', 'JAX',
      'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
      'OpenCV', 'NLTK', 'Spacy', 'Hugging Face Transformers',
      'Spark', 'Hadoop', 'Kafka', 'Airflow', 'dbt',
      'Power BI', 'Tableau', 'Looker'
    ]
  },
  {
    name: 'Blockchain & Web3',
    skills: [
      'Solidity', 'Rust', 'Vyper', 'Motoko',
      'Ethereum', 'Solana', 'Polkadot', 'Polygon', 'Avalanche',
      'Hardhat', 'Truffle', 'Foundry', 'Web3.js', 'Ethers.js',
      'Smart Contracts', 'Defi', 'NFTs', 'DAOs'
    ]
  },
  {
    name: 'Testing',
    skills: [
      'Jest', 'Vitest', 'Mocha', 'Chai', 'Jasmine',
      'Cypress', 'Playwright', 'Selenium', 'Puppeteer',
      'React Testing Library', 'Enzyme',
      'JUnit', 'TestNG', 'PyTest', 'RSpec'
    ]
  },
  {
    name: 'Soft Skills',
    skills: [
      'Leadership', 'Communication', 'Teamwork', 'Problem Solving',
      'Critical Thinking', 'Adaptability', 'Time Management', 'Mentoring',
      'Public Speaking', 'Technical Writing', 'Agile/Scrum', 'Kanban'
    ]
  }
];

export const languages: ComboboxOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese (Mandarin)' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'bn', label: 'Bengali' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ja', label: 'Javanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'it', label: 'Italian' },
  { value: 'tr', label: 'Turkish' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'pl', label: 'Polish' },
  { value: 'nl', label: 'Dutch' },
  { value: 'sv', label: 'Swedish' },
  { value: 'no', label: 'Norwegian' },
  { value: 'da', label: 'Danish' },
  { value: 'fi', label: 'Finnish' },
  { value: 'el', label: 'Greek' },
  { value: 'he', label: 'Hebrew' },
  { value: 'th', label: 'Thai' },
  { value: 'id', label: 'Indonesian' },
  { value: 'ms', label: 'Malay' }
];

export const universities: ComboboxOption[] = [
  // US
  { value: 'mit', label: 'Massachusetts Institute of Technology (MIT)' },
  { value: 'stanford', label: 'Stanford University' },
  { value: 'harvard', label: 'Harvard University' },
  { value: 'berkeley', label: 'University of California, Berkeley' },
  { value: 'cmu', label: 'Carnegie Mellon University' },
  { value: 'caltech', label: 'California Institute of Technology' },
  { value: 'princeton', label: 'Princeton University' },
  { value: 'yale', label: 'Yale University' },
  { value: 'columbia', label: 'Columbia University' },
  { value: 'cornell', label: 'Cornell University' },
  { value: 'ucla', label: 'University of California, Los Angeles' },
  { value: 'gatech', label: 'Georgia Institute of Technology' },
  { value: 'uiuc', label: 'University of Illinois Urbana-Champaign' },
  { value: 'umich', label: 'University of Michigan' },
  { value: 'ut-austin', label: 'University of Texas at Austin' },

  // UK
  { value: 'oxford', label: 'University of Oxford' },
  { value: 'cambridge', label: 'University of Cambridge' },
  { value: 'imperial', label: 'Imperial College London' },
  { value: 'ucl', label: 'University College London' },
  { value: 'edinburgh', label: 'University of Edinburgh' },

  // Europe
  { value: 'eth', label: 'ETH Zurich' },
  { value: 'epfl', label: 'EPFL' },
  { value: 'tum', label: 'Technical University of Munich' },
  { value: 'delft', label: 'Delft University of Technology' },

  // Asia
  { value: 'nus', label: 'National University of Singapore' },
  { value: 'ntu', label: 'Nanyang Technological University' },
  { value: 'tsinghua', label: 'Tsinghua University' },
  { value: 'peking', label: 'Peking University' },
  { value: 'tokyo', label: 'University of Tokyo' },
  { value: 'kaist', label: 'KAIST' },
  { value: 'snu', label: 'Seoul National University' },
  { value: 'hkust', label: 'HKUST' },

  // India
  { value: 'iit-bombay', label: 'IIT Bombay' },
  { value: 'iit-delhi', label: 'IIT Delhi' },
  { value: 'iit-madras', label: 'IIT Madras' },
  { value: 'iit-kanpur', label: 'IIT Kanpur' },
  { value: 'iit-kharagpur', label: 'IIT Kharagpur' },
  { value: 'iit-roorkee', label: 'IIT Roorkee' },
  { value: 'iit-guwahati', label: 'IIT Guwahati' },
  { value: 'iisc', label: 'Indian Institute of Science (IISc)' },
  { value: 'bits-pilani', label: 'BITS Pilani' },

  // Canada
  { value: 'utoronto', label: 'University of Toronto' },
  { value: 'ubc', label: 'University of British Columbia' },
  { value: 'waterloo', label: 'University of Waterloo' },
  { value: 'mcgill', label: 'McGill University' },

  // Australia
  { value: 'unimelb', label: 'University of Melbourne' },
  { value: 'usyd', label: 'University of Sydney' },
  { value: 'unsw', label: 'UNSW Sydney' }
];

export const companies: ComboboxOption[] = [
  // Big Tech
  { value: 'google', label: 'Google' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'apple', label: 'Apple' },
  { value: 'meta', label: 'Meta' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'nvidia', label: 'NVIDIA' },

  // Tech Giants / Major Players
  { value: 'adobe', label: 'Adobe' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'ibm', label: 'IBM' },
  { value: 'intel', label: 'Intel' },
  { value: 'amd', label: 'AMD' },
  { value: 'cisco', label: 'Cisco' },
  { value: 'qualcomm', label: 'Qualcomm' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'sony', label: 'Sony' },

  // Unicorns / High Growth
  { value: 'stripe', label: 'Stripe' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'uber', label: 'Uber' },
  { value: 'lyft', label: 'Lyft' },
  { value: 'doordash', label: 'DoorDash' },
  { value: 'instacart', label: 'Instacart' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'coinbase', label: 'Coinbase' },
  { value: 'robinhood', label: 'Robinhood' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'snap', label: 'Snap' },
  { value: 'tiktok', label: 'TikTok/ByteDance' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'slack', label: 'Slack' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'atlassian', label: 'Atlassian' },
  { value: 'notion', label: 'Notion' },
  { value: 'figma', label: 'Figma' },
  { value: 'canva', label: 'Canva' },
  { value: 'datadog', label: 'Datadog' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'palantir', label: 'Palantir' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'twilio', label: 'Twilio' },
  { value: 'cloudflare', label: 'Cloudflare' },

  // Consulting / Finance
  { value: 'mckinsey', label: 'McKinsey & Company' },
  { value: 'bcg', label: 'Boston Consulting Group (BCG)' },
  { value: 'bain', label: 'Bain & Company' },
  { value: 'goldman-sachs', label: 'Goldman Sachs' },
  { value: 'jpmorgan', label: 'JPMorgan Chase' },
  { value: 'morgan-stanley', label: 'Morgan Stanley' },

  // Indian Tech
  { value: 'tcs', label: 'Tata Consultancy Services (TCS)' },
  { value: 'infosys', label: 'Infosys' },
  { value: 'wipro', label: 'Wipro' },
  { value: 'hcl', label: 'HCL Technologies' },
  { value: 'flipkart', label: 'Flipkart' },
  { value: 'paytm', label: 'Paytm' },
  { value: 'zomato', label: 'Zomato' },
  { value: 'swiggy', label: 'Swiggy' },
  { value: 'ola', label: 'Ola' },
  { value: 'freshworks', label: 'Freshworks' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'zerodha', label: 'Zerodha' }
];

export const certifications: ComboboxOption[] = [
  // Cloud
  { value: 'aws-sa-assoc', label: 'AWS Certified Solutions Architect - Associate' },
  { value: 'aws-sa-pro', label: 'AWS Certified Solutions Architect - Professional' },
  { value: 'aws-dev', label: 'AWS Certified Developer - Associate' },
  { value: 'aws-sysops', label: 'AWS Certified SysOps Administrator' },
  { value: 'gcp-ace', label: 'Google Cloud Associate Cloud Engineer' },
  { value: 'gcp-pca', label: 'Google Cloud Professional Cloud Architect' },
  { value: 'azure-fund', label: 'Microsoft Certified: Azure Fundamentals (AZ-900)' },
  { value: 'azure-admin', label: 'Microsoft Certified: Azure Administrator (AZ-104)' },
  { value: 'azure-sol-arch', label: 'Microsoft Certified: Azure Solutions Architect' },

  // DevOps / Containerization
  { value: 'cka', label: 'Certified Kubernetes Administrator (CKA)' },
  { value: 'ckad', label: 'Certified Kubernetes Application Developer (CKAD)' },
  { value: 'cks', label: 'Certified Kubernetes Security Specialist (CKS)' },
  { value: 'terraform-assoc', label: 'HashiCorp Certified: Terraform Associate' },

  // Security
  { value: 'cissp', label: 'CISSP - Certified Information Systems Security Professional' },
  { value: 'cism', label: 'CISM - Certified Information Security Manager' },
  { value: 'ceh', label: 'CEH - Certified Ethical Hacker' },
  { value: 'comptia-sec', label: 'CompTIA Security+' },
  { value: 'oscp', label: 'OSCP - Offensive Security Certified Professional' },

  // Network / IT
  { value: 'ccna', label: 'CCNA - Cisco Certified Network Associate' },
  { value: 'ccnp', label: 'CCNP - Cisco Certified Network Professional' },
  { value: 'comptia-a', label: 'CompTIA A+' },
  { value: 'comptia-net', label: 'CompTIA Network+' },

  // Project Management / Agile
  { value: 'pmp', label: 'PMP - Project Management Professional' },
  { value: 'capm', label: 'CAPM - Certified Associate in Project Management' },
  { value: 'csm', label: 'CSM - Certified ScrumMaster' },
  { value: 'cspo', label: 'CSPO - Certified Scrum Product Owner' },
  { value: 'psm', label: 'PSM - Professional Scrum Master' },
  { value: 'safe', label: 'SAFe Agilist' },

  // Data / AI
  { value: 'tensorflow-dev', label: 'TensorFlow Developer Certificate' },
  { value: 'azure-ai', label: 'Microsoft Certified: Azure AI Engineer Associate' },
  { value: 'tableau-ds', label: 'Tableau Desktop Specialist' },

  // Other
  { value: 'oracle-java', label: 'Oracle Certified Professional: Java SE Programmer' },
  { value: 'cisa', label: 'CISA - Certified Information Systems Auditor' }
];

export const degreeTypes: ComboboxOption[] = [
  { value: 'high-school', label: 'High School Diploma / GED' },
  { value: 'associate', label: 'Associate Degree (AA, AS)' },
  { value: 'bachelor', label: "Bachelor's Degree (BA, BS, BTech, BE)" },
  { value: 'master', label: "Master's Degree (MA, MS, MTech, MBA, MCA)" },
  { value: 'phd', label: 'Doctorate (PhD, EdD, MD, JD)' },
  { value: 'bootcamp', label: 'Bootcamp Certificate' },
  { value: 'certification', label: 'Professional Certification / Diploma' },
  { value: 'self-taught', label: 'Self-Taught / Portfolio' }
];

export const fieldsOfStudy: ComboboxOption[] = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'se', label: 'Software Engineering' },
  { value: 'it', label: 'Information Technology' },
  { value: 'cis', label: 'Computer Information Systems' },
  { value: 'data-science', label: 'Data Science / Analytics' },
  { value: 'cybersecurity', label: 'Cybersecurity / Information Security' },
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'ee', label: 'Electrical / Electronics Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'ce', label: 'Civil Engineering' },
  { value: 'mathematics', label: 'Mathematics / Statistics' },
  { value: 'physics', label: 'Physics' },
  { value: 'business', label: 'Business Administration / Management' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'design', label: 'Design (Graphic, UI/UX, Product)' },
  { value: 'arts', label: 'Liberal Arts / Humanities' },
  { value: 'psychology', label: 'Psychology' }
];

export const jobTypes: ComboboxOption[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance / Self-employed' },
  { value: 'internship', label: 'Internship' },
  { value: 'co-op', label: 'Co-op' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'volunteer', label: 'Volunteer' }
];

export const workModes: ComboboxOption[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'flexible', label: 'Flexible' }
];

export const userCategories: ComboboxOption[] = [
  { value: 'developer', label: 'Developer / Engineer' },
  { value: 'designer', label: 'Designer / Creative' },
  { value: 'product', label: 'Product Manager / Owner' },
  { value: 'manager', label: 'Manager / Executive' },
  { value: 'data', label: 'Data Scientist / Analyst' },
  { value: 'marketing', label: 'Marketing / Sales' },
  { value: 'hr', label: 'HR / Recruiter' },
  { value: 'student', label: 'Student / Researcher' },
  { value: 'entrepreneur', label: 'Entrepreneur / Founder' },
  { value: 'investor', label: 'Investor' },
  { value: 'consultant', label: 'Consultant' }
];

export const openToOptions: ComboboxOption[] = [
  { value: 'full-time', label: 'Full-time Opportunities' },
  { value: 'contract', label: 'Contract Work' },
  { value: 'freelance', label: 'Freelance Projects' },
  { value: 'part-time', label: 'Part-time Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'hiring', label: 'Hiring / Recruiting' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'networking', label: 'Networking' },
  { value: 'speaking', label: 'Speaking Opportunities' }
];
