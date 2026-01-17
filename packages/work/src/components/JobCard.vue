<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { JobOpening } from "@bude/shared/types";

const props = defineProps<{
  job: JobOpening;
}>();

const timeAgo = computed(() => {
  const date = new Date(props.job.created);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
});
</script>

<template>
  <RouterLink :to="`/jobs/${job.name}`" class="card p-6 block group">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3
          class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
        >
          {{ job.title }}
        </h3>
        <p class="text-sm text-gray-500">
          Posted by {{ job.poster_name || "Anonymous" }} • {{ timeAgo }}
        </p>
      </div>
      <span class="font-bold text-primary-600">{{ job.budget_range }}</span>
    </div>

    <p class="text-gray-600 line-clamp-2 mb-4">{{ job.description }}</p>

    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in job.skills_required?.slice(0, 3)"
          :key="skill"
          class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
        >
          {{ skill }}
        </span>
      </div>
      <span class="text-sm text-gray-500">{{ job.bids_count }} proposals</span>
    </div>
  </RouterLink>
</template>
