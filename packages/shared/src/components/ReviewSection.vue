<template>
  <div class="space-y-6">
    <!-- Rating Summary Card -->
    <Card class="bg-muted/30">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div class="text-center md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-8 border-border">
            <span class="text-5xl font-extrabold tracking-tighter text-foreground">{{ averageRating.toFixed(1) }}</span>
            <div class="flex justify-center my-2">
              <RatingInput :model-value="averageRating" readonly size="md" />
            </div>
            <span class="text-sm font-medium text-muted-foreground">{{ totalReviews }} reviews</span>
          </div>

          <div class="flex-1 w-full space-y-2">
            <div v-for="n in 5" :key="n" class="flex items-center gap-4">
              <span class="text-sm font-semibold w-2">{{ 6 - n }}</span>
              <Star class="h-3 w-3 fill-primary text-primary" />
              <div class="flex-1">
                <Progress :model-value="getPercentage(6 - n)" class="h-2" />
              </div>
              <span class="text-xs font-medium text-muted-foreground w-8 text-right">{{ ratingBreakdown[6 - n] || 0 }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Write Review Entry Point -->
    <div v-if="canReview && !hasReviewed" class="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-background/50 border-border">
      <h3 class="text-lg font-semibold mb-2">Share your experience</h3>
      <p class="text-sm text-muted-foreground mb-4 text-center max-w-sm">
        Your feedback helps others make better decisions. It only takes a minute!
      </p>
      <Dialog v-model:open="showReviewModal">
        <DialogTrigger as-child>
          <Button size="lg" class="rounded-full px-8 shadow-lg shadow-primary/20">
            <PenLine class="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your honest feedback about your experience.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-6 py-4">
            <div class="flex flex-col items-center gap-4">
              <Label class="text-base">Your Rating</Label>
              <RatingInput v-model="newRating" size="lg" />
              <span class="text-sm font-semibold text-primary h-5">
                {{ ratingLabels[newRating - 1] || '' }}
              </span>
            </div>

            <div class="space-y-3">
              <Label for="review-comment">Review Details (Optional)</Label>
              <Textarea
                id="review-comment"
                v-model="newComment"
                placeholder="What did you like or dislike? How was the service?"
                class="min-h-[120px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" @click="showReviewModal = false">Cancel</Button>
            <Button
              @click="submitReviewHandler"
              :disabled="!newRating || isSubmitting"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Reviews List Header -->
    <div class="flex items-center justify-between border-b pb-4">
      <h3 class="text-xl font-bold tracking-tight">Recent Reviews</h3>
      <div v-if="reviews.length > 0" class="text-sm text-muted-foreground">
        Showing {{ reviews.length }} reviews
      </div>
    </div>

    <!-- Reviews List -->
    <div v-if="reviews.length > 0" class="space-y-4">
      <Card v-for="review in reviews" :key="review.name" class="overflow-hidden transition-all hover:shadow-md border-border/50">
        <CardContent class="p-5">
          <div class="flex gap-4 items-start">
            <Avatar class="h-10 w-10 border">
              <AvatarImage v-if="review.reviewer_image" :src="review.reviewer_image" />
              <AvatarFallback>{{ review.reviewer_name?.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 space-y-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-sm">{{ review.reviewer_name }}</h4>
                <span class="text-xs text-muted-foreground">{{ formatDate(review.creation) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <RatingInput :model-value="review.rating" readonly size="sm" />
                <Badge v-if="review.rating >= 4" variant="secondary" class="h-5 text-[10px] uppercase tracking-wider bg-primary/10 text-primary border-none">
                  Recommended
                </Badge>
              </div>
              <div class="mt-3 text-sm leading-relaxed text-muted-foreground italic">
                <Quote class="h-3 w-3 text-primary/30 inline-block -mt-2 mr-1" />
                {{ review.comment || 'No comment provided' }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="!isLoading" class="flex flex-col items-center justify-center py-20 text-center opacity-60">
      <div class="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <MessageSquareDashed class="h-8 w-8 text-muted-foreground" />
      </div>
      <p class="text-lg font-medium">No reviews yet</p>
      <p class="text-sm max-w-xs mt-1">Be the first one to share your feedback!</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="i in 2" :key="i" class="h-32 w-full rounded-xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Review } from '../api/reviews';
import * as reviewsApi from '../api/reviews';
import { RatingInput } from './';
import { 
  Button, 
  Card, CardContent,
  Progress,
  Avatar, AvatarImage, AvatarFallback,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
  Textarea,
  Label,
  Badge,
  Skeleton
} from './ui';
import { 
  Star, 
  PenLine, 
  Loader2, 
  Quote, 
  MessageSquareDashed 
} from 'lucide-vue-next';

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

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

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
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadReviews();
  checkCanReview();
});
</script>
