<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getMyPostedJobs, closeJob } from "@bude/shared/api";
import {
  Button,
  EmptyState,
  LoadingSkeleton,
} from "@bude/shared/components";
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

function switchTab(tab: "open" | "awarded" | "closed") {
  activeTab.value = tab;
  loadJobs();
}

onMounted(loadJobs);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Jobs</h1>
      <RouterLink to="/post-job"><Button>Post New Job</Button></RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <Button
        v-for="tab in ['open', 'awarded', 'closed'] as const"
        :key="tab"
        :variant="activeTab === tab ? 'default' : 'secondary'"
        @click="switchTab(tab)"
        class="capitalize"
      >
        {{ tab }}
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton variant="default" v-for="i in 3" :key="i" />
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
            >{{ job.title }}</RouterLink
          >
          <p class="text-sm text-gray-500">
            {{ job.bidsCount }} proposals • {{ job.budgetRange }}
          </p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/jobs/${job.name}`"
            ><Button variant="secondary" size="sm">View</Button></RouterLink
          >
          <Button
            v-if="job.status === 'Open'"
            variant="outline"
            size="sm"
            @click="handleCloseJob(job.name)"
            >Close</Button
          >
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState v-else :title="`No ${activeTab} jobs`" icon="briefcase" />
  </div>
</template>
