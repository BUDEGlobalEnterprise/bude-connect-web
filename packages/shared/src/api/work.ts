/**
 * Work/Talent API
 * Handles talent marketplace operations
 */

import { frappe } from './client';
import type { Freelancer, JobOpening, Bid, Skill, PaginatedResponse } from '../types';

// ============ Talent Search ============

export interface TalentSearchParams {
  [key: string]: any;
  skill?: string;
  max_rate?: number;
  verified_only?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  lastId?: string;
}

/**
 * Search for freelancers
 */
export async function searchTalent(params: TalentSearchParams = {}): Promise<PaginatedResponse<Freelancer>> {
  return frappe.call<PaginatedResponse<Freelancer>>('bude_core.work.search_talent', {
    ...params,
    last_id: params.lastId
  }, true);
}

/**
 * Get freelancer details
 */
export async function getFreelancer(supplierId: string): Promise<Freelancer> {
  return frappe.call<Freelancer>('bude_core.work.get_freelancer', { supplier_id: supplierId });
}

/**
 * Get available skills
 */
export async function getSkills(): Promise<Skill[]> {
  return frappe.call<Skill[]>('bude_core.work.get_skills', {}, true);
}

/**
 * Get freelancer's own profile
 */
export async function getMyFreelancerProfile(): Promise<Freelancer | null> {
  return frappe.call<Freelancer | null>('bude_core.work.get_my_profile');
}

/**
 * Update freelancer profile
 */
export async function updateFreelancerProfile(data: Partial<Freelancer>): Promise<Freelancer> {
  return frappe.call<Freelancer>('bude_core.work.update_profile', data);
}

// ============ Job Board ============

export interface JobSearchParams {
  [key: string]: any;
  skill?: string;
  search?: string;
  page?: number;
  page_size?: number;
  lastId?: string;
}

/**
 * Get open job listings
 */
export async function getOpenJobs(params: JobSearchParams = {}): Promise<PaginatedResponse<JobOpening>> {
  return frappe.call<PaginatedResponse<JobOpening>>('bude_core.work.get_open_jobs', {
    ...params,
    last_id: params.lastId
  }, true);
}

// Alias for convenience
export const getJobs = getOpenJobs;

/**
 * Get single job with details
 */
export async function getJob(jobId: string): Promise<JobOpening & { bids?: Bid[] }> {
  return frappe.call<JobOpening & { bids?: Bid[] }>('bude_core.work.get_job', { job_id: jobId }, true);
}

/**
 * Post a new job
 */
export async function postJob(data: {
  title: string;
  description: string;
  budgetRange: string;
  skillsRequired?: string[];
  deadline?: string;
  isRemote?: boolean;
}): Promise<JobOpening> {
  return frappe.call<JobOpening>('bude_core.work.post_job', {
    title: data.title,
    description: data.description,
    budgetRange: data.budgetRange,
    skillsRequired: data.skillsRequired,
    deadline: data.deadline,
    isRemote: data.isRemote
  });
}

/**
 * Update job posting
 */
export async function updateJob(jobId: string, data: Partial<JobOpening>): Promise<JobOpening> {
  return frappe.call<JobOpening>('bude_core.work.update_job', { job_id: jobId, ...data });
}

/**
 * Close a job
 */
export async function closeJob(jobId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.close_job', { job_id: jobId });
}

/**
 * Get my posted jobs
 */
export async function getMyPostedJobs(params: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<JobOpening>> {
  return frappe.call<PaginatedResponse<JobOpening>>('bude_core.work.get_my_posted_jobs', params);
}

// ============ Proposals/Bids ============

/**
 * Submit a proposal for a job
 */
export async function submitProposal(data: {
  jobId: string;
  bidAmount: number;
  proposalText: string;
}): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.submit_proposal', {
    job_id: data.jobId,
    bid_amount: data.bidAmount,
    proposal_text: data.proposalText
  });
}

/**
 * Update proposal
 */
export async function updateProposal(proposalId: string, data: Partial<Bid>): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.update_proposal', { proposal_id: proposalId, ...data });
}

/**
 * Withdraw proposal
 */
export async function withdrawProposal(proposalId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.withdraw_proposal', { proposal_id: proposalId });
}

/**
 * Get my bids/proposals
 */
export async function getMyBids(params: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<Bid & { job: JobOpening }>> {
  return frappe.call<PaginatedResponse<Bid & { job: JobOpening }>>('bude_core.work.get_my_bids', params);
}

/**
 * Award job to an applicant
 */
export async function awardJob(jobId: string, applicantId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.award_job', { job_id: jobId, applicant_id: applicantId });
}
