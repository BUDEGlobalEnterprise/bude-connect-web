<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getMyPostedJobs, closeJob } from "@bude/shared/api";
import type { JobOpening } from "@bude/shared/types";

const jobs = ref<JobOpening[]>([]);
const isLoading = ref(true);
const activeTab = ref<"open" | "awarded" | "closed">("open");

async function loadJobs() {
  isLoading.value = true;
  try {
    const statusMap = { open: "Open", awarded: "Awarded", closed: "Closed" };
    const result = await getMyPostedJobs({
      status: statusMap[activeTab.value],
    });
    jobs.value = result.data;
  } catch (error) {
    console.error("Failed to load jobs:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleCloseJob(jobId: string) {
  try {
    await closeJob(jobId);
    loadJobs();
  } catch (error) {
    console.error("Failed to close job:", error);
  }
}

onMounted(loadJobs);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Jobs</h1>
      <RouterLink to="/post-job" class="btn btn-primary">
        Post New Job
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in ['open', 'awarded', 'closed'] as const"
        :key="tab"
        @click="
          activeTab = tab;
          loadJobs();
        "
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all capitalize',
          activeTab === tab
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-4 animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Jobs -->
    <div v-else-if="jobs.length > 0" class="space-y-4">
      <div
        v-for="job in jobs"
        :key="job.name"
        class="card p-4 flex items-center justify-between"
      >
        <div>
          <RouterLink
            :to="`/jobs/${job.name}`"
            class="font-medium text-gray-900 hover:text-primary-600"
          >
            {{ job.title }}
          </RouterLink>
          <p class="text-sm text-gray-500">
            {{ job.bids_count }} proposals • {{ job.budget_range }}
          </p>
        </div>
        <div class="flex gap-2">
          <RouterLink
            :to="`/jobs/${job.name}`"
            class="btn btn-secondary text-sm"
          >
            View
          </RouterLink>
          <button
            v-if="job.status === 'Open'"
            @click="handleCloseJob(job.name)"
            class="btn btn-outline text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16 text-gray-500">
      <p>No {{ activeTab }} jobs</p>
    </div>
  </div>
</template>
