/**
 * Freelancer Profile API
 * Methods for managing freelancer profiles
 */

import { frappe } from './client';

export interface UserCoreFields extends Record<string, unknown> {
  middle_name?: string;
  gender?: string;
  birth_date?: string;
}

export interface AdditionalInfo extends Record<string, unknown> {
  profession?: string;
  open_to?: string;
  user_category?: string;
  hide_private_info?: boolean;
  terms_accepted?: boolean;
}

export interface EducationEntry {
  institution: string;
  location: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  gpa?: string;
  description?: string;
  achievements?: string[];
}

export interface WorkExperienceEntry {
  company: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
}

export interface VolunteerExperienceEntry {
  title: string;
  organization: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface CertificationEntry {
  certification_name: string;
  organization: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface CareerPreferences {
  preferredFunctions?: string[];
  preferredIndustries?: string[];
  preferredLocation?: string;
  dreamCompanies?: string[];
  workEnvironment?: {
    attirePreference?: string;
    locationPreference?: string;
    collaborationPreference?: string;
    timePreference?: string;
    rolePreference?: string;
    companyType?: string;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
}

/**
 * Get current user's complete freelancer profile with all sections
 * This includes all fields for editing in the complete profile form
 */
export async function getFullFreelancerProfile(): Promise<any> {
  return frappe.call('bude_core.profile.freelancer_profile.get_full_profile');
}

/**
 * Update User core fields (gender, birth_date, middle_name)
 */
export async function updateUserCoreFields(data: UserCoreFields): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_user_core_fields', data);
}

/**
 * Update additional profile info (custom Bude Profile fields)
 */
export async function updateAdditionalInfo(data: AdditionalInfo): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_additional_info', data);
}

/**
 * Update basic profile info
 */
export async function updateBasicInfo(data: {
  bio?: string;
  location?: string;
  interests?: string;
  website?: string;
  phone_alternate?: string;
}): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_basic_info', data);
}

/**
 * Update education entries
 */
export async function updateEducation(education: EducationEntry[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_education', {
    education: JSON.stringify(education)
  });
}

/**
 * Update work experience entries
 */
export async function updateWorkExperience(work_experience: WorkExperienceEntry[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_work_experience', {
    work_experience: JSON.stringify(work_experience)
  });
}

/**
 * Update volunteer experience entries
 */
export async function updateVolunteerExperience(volunteer_experience: VolunteerExperienceEntry[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_volunteer_experience', {
    volunteer_experience: JSON.stringify(volunteer_experience)
  });
}

/**
 * Update certifications
 */
export async function updateCertifications(certifications: CertificationEntry[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_certifications', {
    certifications: JSON.stringify(certifications)
  });
}

/**
 * Update skills
 */
export async function updateSkills(skills: string[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_skills', {
    skills: JSON.stringify(skills)
  });
}

/**
 * Update career preferences (stored as JSON)
 */
export async function updateCareerPreferences(preferences: CareerPreferences): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_career_preferences', {
    preferences: JSON.stringify(preferences)
  });
}

/**
 * Update social links
 */
export async function updateSocialLinks(social_links: SocialLink[]): Promise<void> {
  return frappe.call('bude_core.profile.freelancer_profile.update_social_links', {
    social_links: JSON.stringify(social_links)
  });
}

/**
 * Upload and update cover image
 */
export async function updateCoverImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('is_private', '0');
  formData.append('folder', 'Home/Attachments');
  
  const response = await fetch('/api/method/upload_file', {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-Frappe-CSRF-Token': document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload cover image');
  }
  
  const data = await response.json();
  
  // Update profile with new cover image URL
  await frappe.call('bude_core.profile.freelancer_profile.update_basic_info', {
    cover_image: data.message.file_url
  });
  
  return data.message.file_url;
}

/**
 * Get all available skills (for autocomplete)
 */
export async function getAvailableSkills(): Promise<string[]> {
  return frappe.call('bude_core.profile.freelancer_profile.get_available_skills');
}
