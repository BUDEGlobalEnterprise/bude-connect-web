/**
 * Talent Platform API
 * Handles freelancer search, jobs, and proposals
 */

import { frappe } from './client';
import type { Freelancer, JobOpening, Bid, PaginatedResponse, Skill } from '../types';

export interface TalentSearchParams {
  skill?: string;
  min_rate?: number;
  max_rate?: number;
  verified_only?: boolean;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface JobSearchParams {
  skill?: string;
  min_budget?: number;
  max_budget?: number;
  status?: 'Open' | 'Awarded' | 'Closed';
  page?: number;
  page_size?: number;
  search?: string;
}

/**
 * Search freelancers
 * Priority: is_verified_expert > boost_score > hourly_rate
 */
export async function searchTalent(params: TalentSearchParams = {}): Promise<PaginatedResponse<Freelancer>> {
  return frappe.call<PaginatedResponse<Freelancer>>('bude_core.work.search_talent', params);
}

/**
 * Get freelancer profile
 */
export async function getFreelancer(supplierId: string): Promise<Freelancer> {
  return frappe.call<Freelancer>('bude_core.work.get_freelancer', { supplier_id: supplierId });
}

/**
 * Get all available skills for filtering
 */
export async function getSkills(): Promise<Skill[]> {
  return frappe.call<Skill[]>('bude_core.work.get_skills');
}

// ============ Freelancer Profile Management ============

/**
 * Get or create freelancer profile for current user
 */
export async function getMyFreelancerProfile(): Promise<Freelancer | null> {
  return frappe.call<Freelancer | null>('bude_core.work.get_my_profile');
}

/**
 * Update freelancer profile
 */
export async function updateFreelancerProfile(data: {
  skills?: Skill[];
  hourly_rate?: number;
  portfolio_links?: { title: string; url: string }[];
  bio?: string;
}): Promise<Freelancer> {
  return frappe.call<Freelancer>('bude_core.work.update_profile', data);
}

// ============ Job Operations ============

/**
 * Get open jobs
 */
export async function getOpenJobs(params: JobSearchParams = {}): Promise<PaginatedResponse<JobOpening>> {
  return frappe.call<PaginatedResponse<JobOpening>>('bude_core.work.get_open_jobs', params);
}

/**
 * Get job detail
 */
export async function getJob(jobId: string): Promise<JobOpening & { bids?: Bid[] }> {
  return frappe.call<JobOpening & { bids?: Bid[] }>('bude_core.work.get_job', { job_id: jobId });
}

/**
 * Post new job
 */
export async function postJob(data: {
  title: string;
  description: string;
  budget_range: string;
  skills_required: string[];
  deadline?: string;
}): Promise<JobOpening> {
  return frappe.call<JobOpening>('bude_core.work.post_job', data);
}

/**
 * Update job
 */
export async function updateJob(jobId: string, data: Partial<JobOpening>): Promise<JobOpening> {
  return frappe.call<JobOpening>('bude_core.work.update_job', { job_id: jobId, ...data });
}

/**
 * Close job
 */
export async function closeJob(jobId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.close_job', { job_id: jobId });
}

/**
 * Get jobs I've posted
 */
export async function getMyPostedJobs(params: {
  status?: string;
  page?: number;
} = {}): Promise<PaginatedResponse<JobOpening>> {
  return frappe.call<PaginatedResponse<JobOpening>>('bude_core.work.get_my_posted_jobs', params);
}

// ============ Proposal/Bid Operations ============

/**
 * Submit proposal/bid for a job
 */
export async function submitProposal(data: {
  job_id: string;
  bid_amount: number;
  proposal_text: string;
  estimated_duration?: string;
}): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.submit_proposal', data);
}

/**
 * Update my proposal
 */
export async function updateProposal(bidId: string, data: {
  bid_amount?: number;
  proposal_text?: string;
}): Promise<Bid> {
  return frappe.call<Bid>('bude_core.work.update_proposal', { bid_id: bidId, ...data });
}

/**
 * Withdraw proposal
 */
export async function withdrawProposal(bidId: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.work.withdraw_proposal', { bid_id: bidId });
}

/**
 * Get my submitted bids
 */
export async function getMyBids(params: {
  status?: string;
  page?: number;
} = {}): Promise<PaginatedResponse<Bid & { job: JobOpening }>> {
  return frappe.call<PaginatedResponse<Bid & { job: JobOpening }>>('bude_core.work.get_my_bids', params);
}

/**
 * Award job to freelancer (job poster only)
 */
export async function awardJob(jobId: string, supplierId: string): Promise<{
  success: boolean;
  message: string;
}> {
  return frappe.call('bude_core.work.award_job', { job_id: jobId, supplier_id: supplierId });
}
