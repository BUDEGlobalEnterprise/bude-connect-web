/**
 * Work/Talent API
 * Handles talent marketplace operations
 */

import { frappe } from './client';
import type { Freelancer, JobOpening, Bid, Skill, PaginatedResponse } from '../types';

// ============ Talent Search ============

export interface TalentSearchParams {
  skill?: string;
  max_rate?: number;
  verified_only?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * Search for freelancers
 */
export async function searchTalent(params: TalentSearchParams = {}): Promise<PaginatedResponse<Freelancer>> {
  return frappe.call<PaginatedResponse<Freelancer>>('bude_core.work.search_talent', params);
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
  return frappe.call<Skill[]>('bude_core.work.get_skills');
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
  skill?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get open job listings
 */
export async function getOpenJobs(params: JobSearchParams = {}): Promise<PaginatedResponse<JobOpening>> {
  return frappe.call<PaginatedResponse<JobOpening>>('bude_core.work.get_open_jobs', params);
}

/**
 * Get single job with details
 */
export async function getJob(jobId: string): Promise<JobOpening & { bids?: Bid[] }> {
  return frappe.call<JobOpening & { bids?: Bid[] }>('bude_core.work.get_job', { job_id: jobId });
}

/**
 * Post a new job
 */
export async function postJob(data: {
  title: string;
  description: string;
  budget_range: string;
  skills_required?: string[];
  deadline?: string;
}): Promise<JobOpening> {
  return frappe.call<JobOpening>('bude_core.work.post_job', data);
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
  job_id: string;
  bid_amount: number;
  proposal_text: string;
}): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.submit_proposal', data);
}

/**
 * Update proposal
 */
export async function updateProposal(bidId: string, data: Partial<Bid>): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.update_proposal', { bid_id: bidId, ...data });
}

/**
 * Withdraw proposal
 */
export async function withdrawProposal(bidId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.withdraw_proposal', { bid_id: bidId });
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
 * Award job to freelancer
 */
export async function awardJob(jobId: string, supplierId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.award_job', { job_id: jobId, supplier_id: supplierId });
}
