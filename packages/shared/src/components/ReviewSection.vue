<template>
  <div class="review-section">
    <!-- Rating Summary -->
    <div class="rating-summary">
      <div class="average-rating">
        <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= Math.round(averageRating) }"
          >
            ★
          </span>
        </div>
        <span class="review-count">{{ totalReviews }} reviews</span>
      </div>

      <div class="rating-bars">
        <div v-for="n in 5" :key="n" class="rating-bar-row">
          <span class="star-label">{{ 6 - n }}</span>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{ width: `${getPercentage(6 - n)}%` }"
            ></div>
          </div>
          <span class="bar-count">{{ ratingBreakdown[6 - n] || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Write Review Button -->
    <div v-if="canReview && !hasReviewed" class="write-review-section">
      <Button @click="showReviewModal = true">Write a Review</Button>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div v-for="review in reviews" :key="review.name" class="review-item">
        <div class="review-header">
          <Avatar :src="review.reviewer_image" :alt="review.reviewer_name" size="sm" />
          <div class="reviewer-info">
            <h4>{{ review.reviewer_name }}</h4>
            <div class="review-meta">
              <div class="stars small">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= review.rating }"
                >
                  ★
                </span>
              </div>
              <span class="review-date">{{ formatDate(review.creation) }}</span>
            </div>
          </div>
        </div>
        <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
      </div>

      <div v-if="reviews.length === 0" class="empty-reviews">
        <p>No reviews yet</p>
      </div>
    </div>

    <!-- Review Modal -->
    <Modal v-model="showReviewModal" title="Write a Review">
      <div class="review-form">
        <div class="rating-input">
          <label>Your Rating</label>
          <div class="star-selector">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="star-button"
              :class="{ active: star <= newRating }"
              @click="newRating = star"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              ★
            </button>
          </div>
          <span class="rating-label">{{ ratingLabels[newRating - 1] || 'Select rating' }}</span>
        </div>

        <div class="form-group">
          <label>Your Review (Optional)</label>
          <textarea
            v-model="newComment"
            placeholder="Share your experience..."
            rows="4"
          ></textarea>
        </div>

        <div class="modal-actions">
          <Button variant="ghost" @click="showReviewModal = false">Cancel</Button>
          <Button
            @click="submitReviewHandler"
            :loading="isSubmitting"
            :disabled="!newRating"
          >
            Submit Review
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Review, ReviewsResponse } from '../api/reviews';
import * as reviewsApi from '../api/reviews';
import Avatar from './Avatar.vue';
import Button from './Button.vue';
import Modal from './Modal.vue';

const props = defineProps<{
  userId: string;
  referenceDoctype?: string;
  referenceName?: string;
}>();

const emit = defineEmits<{
  (e: 'review-submitted'): void;
}>();

// State
const reviews = ref<Review[]>([]);
const totalReviews = ref(0);
const averageRating = ref(0);
const ratingBreakdown = ref<Record<string, number>>({});
const canReview = ref(false);
const hasReviewed = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const showReviewModal = ref(false);
const newRating = ref(0);
const newComment = ref('');
const hoverRating = ref(0);

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

// Computed
const displayRating = computed(() => hoverRating.value || newRating.value);

// Methods
function getPercentage(rating: number): number {
  if (totalReviews.value === 0) return 0;
  return ((ratingBreakdown.value[rating] || 0) / totalReviews.value) * 100;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

async function loadReviews() {
  isLoading.value = true;
  try {
    const response = await reviewsApi.getReviews(props.userId);
    reviews.value = response.reviews;
    totalReviews.value = response.total;
    averageRating.value = response.average_rating;
    ratingBreakdown.value = response.rating_breakdown;
  } catch (error) {
    console.error('Failed to load reviews:', error);
  } finally {
    isLoading.value = false;
  }
}

async function checkCanReview() {
  try {
    const result = await reviewsApi.checkCanReview(
      props.userId,
      props.referenceDoctype,
      props.referenceName
    );
    canReview.value = result.can_review;
    hasReviewed.value = result.reason === 'already_reviewed';
  } catch (error) {
    console.error('Failed to check review eligibility:', error);
  }
}

async function submitReviewHandler() {
  if (!newRating.value) return;

  isSubmitting.value = true;
  try {
    await reviewsApi.submitReview({
      reviewee: props.userId,
      rating: newRating.value,
      comment: newComment.value,
      referenceDoctype: props.referenceDoctype,
      referenceName: props.referenceName
    });

    showReviewModal.value = false;
    newRating.value = 0;
    newComment.value = '';
    hasReviewed.value = true;

    // Reload reviews
    await loadReviews();

    emit('review-submitted');
  } catch (error: any) {
    console.error('Failed to submit review:', error);
    alert(error.message || 'Failed to submit review');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadReviews();
  checkCanReview();
});
</script>

<style scoped>
.review-section {
  padding: 1rem;
}

.rating-summary {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.average-rating {
  text-align: center;
}

.rating-number {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
}

.stars {
  display: flex;
  gap: 0.125rem;
  justify-content: center;
}

.stars.small {
  gap: 0;
}

.star {
  color: #d1d5db;
  font-size: 1.25rem;
}

.star.filled {
  color: #fbbf24;
}

.review-count {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.rating-bars {
  flex: 1;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.star-label {
  width: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.bar-container {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fbbf24;
  transition: width 0.3s;
}

.bar-count {
  width: 1.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

.write-review-section {
  margin-bottom: 1.5rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.review-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.reviewer-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.review-comment {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

.empty-reviews {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.review-form {
  padding: 1rem;
}

.rating-input {
  margin-bottom: 1.5rem;
}

.rating-input label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.star-selector {
  display: flex;
  gap: 0.25rem;
}

.star-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
}

.star-button:hover,
.star-button.active {
  color: #fbbf24;
  transform: scale(1.1);
}

.rating-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
}

.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .rating-summary {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
