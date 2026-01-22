import type { ComboboxOption } from '../components/ComboboxMultiSelect.vue';
import type { SkillCategory } from '../components/SkillSelector.vue';

export const roles: ComboboxOption[] = [
  { value: 'frontend-dev', label: 'Frontend Developer' },
  { value: 'backend-dev', label: 'Backend Developer' },
  { value: 'fullstack-dev', label: 'Full-Stack Developer' },
  { value: 'mobile-dev', label: 'Mobile Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'ml-engineer', label: 'ML Engineer' },
  { value: 'ui-designer', label: 'UI/UX Designer' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'tech-lead', label: 'Tech Lead' },
  { value: 'architect', label: 'Solution Architect' },
  { value: 'other', label: 'Other (specify)' }
];

export const industries: ComboboxOption[] = [
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'enterprise', label: 'Enterprise Software' },
  { value: 'social', label: 'Social Media' },
  { value: 'iot', label: 'IoT' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'other', label: 'Other Industry' }
];

export const seniorityLevels: ComboboxOption[] = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8+ years)' },
  { value: 'principal', label: 'Principal/Staff' },
  { value: 'architect', label: 'Architect' },
  { value: 'other', label: 'Other' }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
      'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
      'SASS/SCSS', 'Redux', 'Pinia', 'Webpack', 'Vite'
    ]
  },
  {
    name: 'Backend',
    skills: [
      'Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP',
      'C#', '.NET', 'Django', 'Flask', 'FastAPI', 'Express.js',
      'Spring Boot', 'Rails', 'Laravel'
    ]
  },
  {
    name: 'Mobile',
    skills: [
      'React Native', 'Flutter', 'Swift', 'Kotlin',
      'iOS Development', 'Android Development', 'Ionic', 'Xamarin'
    ]
  },
  {
    name: 'Database',
    skills: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'SQLite', 'Oracle', 'Cassandra', 'DynamoDB', 'Firebase'
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
      'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible',
      'Linux', 'Nginx', 'Apache'
    ]
  },
  {
    name: 'Design',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
      'InVision', 'Framer', 'Principle', 'Zeplin'
    ]
  },
  {
    name: 'Data & AI',
    skills: [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'Pandas', 'NumPy', 'Scikit-learn', 'Data Analysis', 'SQL',
      'Power BI', 'Tableau'
    ]
  },
  {
    name: 'Other',
    skills: [
      'Git', 'GraphQL', 'REST API', 'Microservices', 'Agile/Scrum',
      'Testing', 'Jest', 'Cypress', 'Selenium', 'Postman'
    ]
  }
];

export const languages: ComboboxOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Mandarin Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ru', label: 'Russian' },
  { value: 'it', label: 'Italian' },
  { value: 'nl', label: 'Dutch' },
  { value: 'sv', label: 'Swedish' },
  { value: 'other', label: 'Other Language' }
];

export const universities: ComboboxOption[] = [
  { value: 'mit', label: 'Massachusetts Institute of Technology (MIT)' },
  { value: 'stanford', label: 'Stanford University' },
  { value: 'harvard', label: 'Harvard University' },
  { value: 'berkeley', label: 'UC Berkeley' },
  { value: 'cmu', label: 'Carnegie Mellon University' },
  { value: 'oxford', label: 'University of Oxford' },
  { value: 'cambridge', label: 'University of Cambridge' },
  { value: 'eth', label: 'ETH Zurich' },
  { value: 'iit-bombay', label: 'IIT Bombay' },
  { value: 'iit-delhi', label: 'IIT Delhi' },
  { value: 'ntu', label: 'Nanyang Technological University' },
  { value: 'nus', label: 'National University of Singapore' },
  { value: 'tsinghua', label: 'Tsinghua University' },
  { value: 'tokyo', label: 'University of Tokyo' }
];

export const companies: ComboboxOption[] = [
  { value: 'google', label: 'Google' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'meta', label: 'Meta (Facebook)' },
  { value: 'apple', label: 'Apple' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'uber', label: 'Uber' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'salesforce', label: 'Salesforce' }
];

export const certifications: ComboboxOption[] = [
  { value: 'aws-sa', label: 'AWS Certified Solutions Architect' },
  { value: 'aws-dev', label: 'AWS Certified Developer' },
  { value: 'gcp-ace', label: 'Google Cloud Professional Cloud Engineer' },
  { value: 'azure-admin', label: 'Microsoft Azure Administrator' },
  { value: 'cka', label: 'Certified Kubernetes Administrator (CKA)' },
  { value: 'ckad', label: 'Certified Kubernetes Application Developer' },
  { value: 'pmp', label: 'Project Management Professional (PMP)' },
  { value: 'csm', label: 'Certified Scrum Master' },
  { value: 'psm', label: 'Professional Scrum Master' },
  { value: 'cissp', label: 'Certified Information Systems Security Professional' },
  { value: 'other', label: 'Other Certification' }
];

export const degreeTypes: ComboboxOption[] = [
  { value: 'high-school', label: 'High School Diploma' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD/Doctorate' },
  { value: 'bootcamp', label: 'Bootcamp Certificate' },
  { value: 'certification', label: 'Professional Certification' }
];

export const fieldsOfStudy: ComboboxOption[] = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'se', label: 'Software Engineering' },
  { value: 'it', label: 'Information Technology' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'business', label: 'Business Administration' },
  { value: 'design', label: 'Design' }
];

export const jobTypes: ComboboxOption[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'other', label: 'Other' }
];

export const workModes: ComboboxOption[] = [
  { value: 'remote', label: 'Remote Only' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'other', label: 'Other' }
];

export const userCategories: ComboboxOption[] = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'other', label: 'Other' }
];

export const openToOptions: ComboboxOption[] = [
  { value: 'new-projects', label: 'New Projects' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'full-time', label: 'Full-time Opportunities' },
  { value: 'freelance', label: 'Freelance Work' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'speaking', label: 'Speaking Engagements' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other Opportunities' }
];
