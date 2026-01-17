/**
 * Work/Talent API
 * Uses standard ERPNext doctypes (Supplier, Job Opening, etc.)
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
 * Search for freelancers - uses Supplier doctype
 */
export async function searchTalent(params: TalentSearchParams = {}): Promise<PaginatedResponse<Freelancer>> {
  const filters: any = { disabled: 0, supplier_type: 'Individual' };
  
  if (params.search) filters.supplier_name = ['like', `%${params.search}%`];
  
  const suppliers = await frappe.getList<any>('Supplier', {
    fields: ['name', 'supplier_name', 'supplier_type', 'country'],
    filters,
    limit_start: (params.page || 0) * (params.page_size || 20),
    limit_page_length: params.page_size || 20,
  });

  return {
    data: suppliers.map(s => ({
      name: s.name,
      supplier_name: s.supplier_name,
      hourly_rate: 0,
      skills: [],
      is_verified_expert: false,
    })) as Freelancer[],
    has_next: suppliers.length === (params.page_size || 20),
    total_count: suppliers.length,
  };
}

/**
 * Get freelancer details
 */
export async function getFreelancer(supplierId: string): Promise<Freelancer> {
  const supplier = await frappe.getDoc<any>('Supplier', supplierId);
  return {
    name: supplier.name,
    supplier_name: supplier.supplier_name,
    hourly_rate: 0,
    skills: [],
    is_verified_expert: false,
    bio: supplier.supplier_details || '',
    completed_jobs: 0,
    member_since: supplier.creation,
  } as Freelancer;
}

/**
 * Get available skills - placeholder
 */
export async function getSkills(): Promise<Skill[]> {
  // Could use a custom doctype or hardcoded list
  return [
    { skill_name: 'JavaScript' },
    { skill_name: 'Python' },
    { skill_name: 'Vue.js' },
    { skill_name: 'React' },
    { skill_name: 'Node.js' },
    { skill_name: 'ERPNext' },
    { skill_name: 'Frappe' },
  ];
}

/**
 * Get freelancer's own profile
 */
export async function getMyFreelancerProfile(): Promise<Freelancer | null> {
  // Would need to link User to Supplier
  return null;
}

/**
 * Update freelancer profile
 */
export async function updateFreelancerProfile(data: Partial<Freelancer>): Promise<Freelancer> {
  console.warn('Update profile requires linking User to Supplier');
  return data as Freelancer;
}

// ============ Job Board ============

export interface JobSearchParams {
  skill?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get open jobs - uses Job Opening doctype (part of HR module)
 */
export async function getOpenJobs(params: JobSearchParams = {}): Promise<PaginatedResponse<JobOpening>> {
  const filters: any = { status: 'Open' };
  
  if (params.search) filters.job_title = ['like', `%${params.search}%`];
  
  const jobs = await frappe.getList<any>('Job Opening', {
    fields: ['name', 'job_title', 'description', 'status', 'creation'],
    filters,
    limit_start: (params.page || 0) * (params.page_size || 20),
    limit_page_length: params.page_size || 20,
  });

  return {
    data: jobs.map(j => ({
      name: j.name,
      title: j.job_title,
      description: j.description,
      status: j.status,
      budget_range: 'Contact for pricing',
      bids_count: 0,
    })) as JobOpening[],
    has_next: jobs.length === (params.page_size || 20),
    total_count: jobs.length,
  };
}

/**
 * Get single job
 */
export async function getJob(jobId: string): Promise<JobOpening & { bids?: Bid[] }> {
  const job = await frappe.getDoc<any>('Job Opening', jobId);
  return {
    name: job.name,
    title: job.job_title,
    description: job.description,
    status: job.status,
    budget_range: 'Contact for pricing',
    bids_count: 0,
    bids: [],
    skills_required: [],
    posted_by: job.owner,
    poster_name: job.owner,
  } as JobOpening & { bids?: Bid[] };
}

/**
 * Post a job
 */
export async function postJob(data: {
  title: string;
  description: string;
  budget_range: string;
  skills_required?: string[];
  deadline?: string;
}): Promise<JobOpening> {
  const job = await frappe.createDoc<any>('Job Opening', {
    job_title: data.title,
    description: data.description,
    status: 'Open',
  });
  
  return {
    name: job.name,
    title: job.job_title,
    status: 'Open',
  } as JobOpening;
}

/**
 * Update job
 */
export async function updateJob(jobId: string, data: Partial<JobOpening>): Promise<JobOpening> {
  const updateData: any = {};
  if (data.title) updateData.job_title = data.title;
  if (data.description) updateData.description = data.description;
  
  const job = await frappe.updateDoc<any>('Job Opening', jobId, updateData);
  return job as JobOpening;
}

/**
 * Close job
 */
export async function closeJob(jobId: string): Promise<{ success: boolean }> {
  await frappe.updateDoc('Job Opening', jobId, { status: 'Closed' });
  return { success: true };
}

/**
 * Get my posted jobs
 */
export async function getMyPostedJobs(params: { status?: string } = {}): Promise<PaginatedResponse<JobOpening>> {
  const filters: any = {};
  if (params.status) filters.status = params.status;
  
  const jobs = await frappe.getList<any>('Job Opening', {
    fields: ['name', 'job_title', 'status'],
    filters,
    limit_page_length: 50,
  });

  return {
    data: jobs.map(j => ({
      name: j.name,
      title: j.job_title,
      status: j.status,
      bids_count: 0,
    })) as JobOpening[],
    has_next: false,
    total_count: jobs.length,
  };
}

// ============ Proposals/Bids (placeholder - needs custom doctype) ============

export async function submitProposal(data: { job_id: string; bid_amount: number; proposal_text: string }): Promise<Bid> {
  console.warn('Proposals require custom Bid doctype');
  return {} as Bid;
}

export async function updateProposal(bidId: string, data: Partial<Bid>): Promise<Bid> {
  console.warn('Proposals require custom Bid doctype');
  return {} as Bid;
}

export async function withdrawProposal(bidId: string): Promise<{ success: boolean }> {
  console.warn('Proposals require custom Bid doctype');
  return { success: false };
}

export async function getMyBids(params: { status?: string } = {}): Promise<PaginatedResponse<Bid & { job: JobOpening }>> {
  console.warn('Bids require custom Bid doctype');
  return { data: [], has_next: false, total_count: 0 };
}

export async function awardJob(jobId: string, supplierId: string): Promise<{ success: boolean }> {
  console.warn('Award job requires custom implementation');
  return { success: false };
}
