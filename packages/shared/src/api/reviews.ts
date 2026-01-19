/**
 * Reviews API using Bude Review doctype
 */

import { frappe } from './client';

export interface Review {
  name: string;
  reviewer: string;
  reviewer_name: string;
  reviewer_image?: string;
  rating: number;
  comment: string;
  reference_doctype?: string;
  reference_name?: string;
  creation: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
  rating_breakdown: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface UserRating {
  average_rating: number;
  total_reviews: number;
}

/**
 * Submit a review
 */
export async function submitReview(data: {
  reviewee: string;
  rating: number;
  comment?: string;
  referenceDoctype?: string;
  referenceName?: string;
}): Promise<{ success: boolean; review_id: string }> {
  return frappe.call(
    'bude_core.reviews.review_handler.submit_review',
    {
      reviewee: data.reviewee,
      rating: data.rating,
      comment: data.comment || '',
      reference_doctype: data.referenceDoctype,
      reference_name: data.referenceName
    }
  );
}

/**
 * Get reviews for a user
 */
export async function getReviews(
  user: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ReviewsResponse> {
  return frappe.call<ReviewsResponse>(
    'bude_core.reviews.review_handler.get_reviews',
    {
      user,
      page,
      page_size: pageSize
    }
  );
}

/**
 * Get user's rating summary
 */
export async function getUserRating(user: string): Promise<UserRating> {
  return frappe.call<UserRating>(
    'bude_core.reviews.review_handler.get_user_rating',
    { user }
  );
}

/**
 * Check if current user can review
 */
export async function checkCanReview(
  reviewee: string,
  referenceDoctype?: string,
  referenceName?: string
): Promise<{ can_review: boolean; reason?: string }> {
  return frappe.call(
    'bude_core.reviews.review_handler.check_can_review',
    {
      reviewee,
      reference_doctype: referenceDoctype,
      reference_name: referenceName
    }
  );
}
