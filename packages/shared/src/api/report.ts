/**
 * Content Reporting API
 * Handles flagging inappropriate content for moderation
 */

import { frappe } from './client';

export type ReportReason =
  | 'spam'
  | 'inappropriate'
  | 'fraud'
  | 'counterfeit'
  | 'prohibited'
  | 'harassment'
  | 'other';

export interface ReportData {
  referenceDoctype: string;
  referenceName: string;
  reason: ReportReason;
  details?: string;
}

export const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: 'spam', label: 'Spam', description: 'Misleading or repetitive content' },
  { value: 'inappropriate', label: 'Inappropriate Content', description: 'Offensive or vulgar material' },
  { value: 'fraud', label: 'Fraud / Scam', description: 'Deceptive or fraudulent listing' },
  { value: 'counterfeit', label: 'Counterfeit Product', description: 'Fake or replica goods' },
  { value: 'prohibited', label: 'Prohibited Item', description: 'Item not allowed on the platform' },
  { value: 'harassment', label: 'Harassment', description: 'Abusive or threatening behavior' },
  { value: 'other', label: 'Other', description: 'Something else not listed above' },
];

/**
 * Submit a report
 */
export async function submitReport(data: ReportData): Promise<{ success: boolean; report_id: string }> {
  return frappe.call(
    'bude_core.moderation.report_handler.submit_report',
    {
      reference_doctype: data.referenceDoctype,
      reference_name: data.referenceName,
      reason: data.reason,
      details: data.details || '',
    }
  );
}

/**
 * Check if the current user already reported this content
 */
export async function hasReported(
  referenceDoctype: string,
  referenceName: string
): Promise<{ has_reported: boolean }> {
  return frappe.call(
    'bude_core.moderation.report_handler.has_reported',
    {
      reference_doctype: referenceDoctype,
      reference_name: referenceName,
    }
  );
}
