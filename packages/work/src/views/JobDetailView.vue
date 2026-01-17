<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJob, submitProposal } from "@bude/shared/api";
import { useUserStore } from "@bude/shared";
import type { JobOpening, Bid } from "@bude/shared/types";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const job = ref<(JobOpening & { bids?: Bid[] }) | null>(null);
const isLoading = ref(true);
const showProposalForm = ref(false);
const isSubmitting = ref(false);

const proposal = ref({
  bid_amount: 0,
  proposal_text: "",
});

const isOwner = computed(() => job.value?.posted_by === userStore.user?.name);
const isFreelancer = computed(() => userStore.isServiceProvider);

async function loadJob() {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    job.value = await getJob(id);
  } catch (error) {
    console.error("Failed to load job:", error);
    router.push("/jobs");
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmitProposal() {
  if (!job.value) return;

  isSubmitting.value = true;
  try {
    await submitProposal({
      job_id: job.value.name,
      bid_amount: proposal.value.bid_amount,
      proposal_text: proposal.value.proposal_text,
    });
    showProposalForm.value = false;
    loadJob(); // Refresh to show new proposal
  } catch (error) {
    console.error("Failed to submit proposal:", error);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(loadJob);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div class="h-32 bg-gray-200 rounded"></div>
    </div>

    <!-- Content -->
    <div v-else-if="job">
      <div class="card p-6 mb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ job.title }}
            </h1>
            <p class="text-gray-500">
              Posted by {{ job.poster_name || "Anonymous" }} •
              {{ job.bids_count }} proposals
            </p>
          </div>
          <span class="text-2xl font-bold text-primary-600">{{
            job.budget_range
          }}</span>
        </div>

        <div class="prose prose-gray max-w-none mb-6">
          <p class="whitespace-pre-wrap">{{ job.description }}</p>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="skill in job.skills_required"
            :key="skill"
            class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {{ skill }}
          </span>
        </div>

        <!-- Actions -->
        <div v-if="!isOwner && isFreelancer && job.status === 'Open'">
          <button
            v-if="!showProposalForm"
            @click="showProposalForm = true"
            class="btn btn-primary"
          >
            Submit Proposal
          </button>

          <!-- Proposal Form -->
          <div v-else class="border-t pt-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Your Proposal
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount (₹)
                </label>
                <input
                  v-model.number="proposal.bid_amount"
                  type="number"
                  min="0"
                  class="input"
                  placeholder="Your price for this job"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  v-model="proposal.proposal_text"
                  rows="5"
                  class="input"
                  placeholder="Why are you the best fit for this job?"
                ></textarea>
              </div>
              <div class="flex gap-4">
                <button
                  @click="handleSubmitProposal"
                  :disabled="
                    isSubmitting ||
                    !proposal.bid_amount ||
                    !proposal.proposal_text
                  "
                  class="btn btn-primary"
                >
                  {{ isSubmitting ? "Submitting..." : "Submit Proposal" }}
                </button>
                <button
                  @click="showProposalForm = false"
                  class="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isOwner" class="text-gray-500 italic">
          This is your job posting
        </div>
      </div>

      <!-- Proposals (visible to job owner) -->
      <div v-if="isOwner && job.bids?.length" class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Proposals ({{ job.bids.length }})
        </h2>
        <div class="space-y-4">
          <div
            v-for="bid in job.bids"
            :key="bid.name"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-900">{{
                bid.supplier_name
              }}</span>
              <span class="font-bold text-primary-600"
                >₹{{ bid.bid_amount }}</span
              >
            </div>
            <p class="text-gray-600">{{ bid.proposal_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
