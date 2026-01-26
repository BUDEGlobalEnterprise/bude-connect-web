<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJob, submitProposal } from "@bude/shared/api";
import { useUserStore } from "@bude/shared";
import { Button, Badge, LoadingSkeleton } from "@bude/shared/components";
import type { JobOpening, Bid } from "@bude/shared/types";
import ProposalForm from "../components/ProposalForm.vue";
import ProposalList from "../components/ProposalList.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const job = ref<(JobOpening & { bids?: Bid[] }) | null>(null);
const isLoading = ref(true);
const showProposalForm = ref(false);

const isOwner = computed(() => job.value?.postedBy === userStore.user?.name);
const isFreelancer = computed(() => userStore.isServiceProvider);

async function loadJob() {
  isLoading.value = true;
  try {
    job.value = await getJob(route.params.id as string);
  } catch (error) {
    console.error("Failed to load job:", error);
    router.push("/jobs");
  } finally {
    isLoading.value = false;
  }
}

async function handleProposalSubmit(proposal: {
  bidAmount: number;
  proposalText: string;
}) {
  if (!job.value) return;
  await submitProposal({ jobId: job.value.name, ...proposal });
  showProposalForm.value = false;
  loadJob();
}

onMounted(loadJob);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton variant="default" />
      <LoadingSkeleton variant="default" />
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
              Posted by {{ job.clientName || job.posterName || "Anonymous" }} •
              {{ job.bidsCount }} proposals
            </p>
          </div>
          <span class="text-2xl font-bold text-primary-600">{{
            job.budgetRange
          }}</span>
        </div>

        <div class="prose prose-gray max-w-none mb-6">
          <p class="whitespace-pre-wrap">{{ job.description }}</p>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <Badge
            v-for="skill in job.skillsRequired"
            :key="skill"
            variant="secondary"
            >{{ skill }}</Badge
          >
        </div>

        <!-- Actions -->
        <div v-if="!isOwner && isFreelancer && job.status === 'Open'">
          <Button v-if="!showProposalForm" @click="showProposalForm = true"
            >Submit Proposal</Button
          >
          <ProposalForm
            v-else
            @submit="handleProposalSubmit"
            @cancel="showProposalForm = false"
          />
        </div>

        <div v-if="isOwner" class="text-gray-500 italic">
          This is your job posting
        </div>
      </div>

      <!-- Proposals -->
      <ProposalList v-if="isOwner && job.bids?.length" :bids="job.bids" />
    </div>
  </div>
</template>
