<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { JobOpening } from "@bude/shared/types";
import { timeAgo } from "@bude/shared/utils";

const props = defineProps<{
  job: JobOpening;
}>();

const postedTime = computed(() => {
  return timeAgo(props.job.createdAt || props.job.created);
});

const statusConfig = computed(() => {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    Open: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "🟢" },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700", icon: "🔵" },
    Closed: { bg: "bg-gray-100", text: "text-gray-700", icon: "⚫" },
    Filled: { bg: "bg-purple-100", text: "text-purple-700", icon: "✅" },
  };
  return config[props.job.status] || config["Open"];
});

const skillColors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-indigo-100 text-indigo-700"];
</script>

<template>
  <RouterLink
    :to="`/jobs/${job.name}`"
    class="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <!-- Status Badge -->
        <div class="flex items-center gap-2 mb-2">
          <span :class="[statusConfig.bg, statusConfig.text, 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold']">
            <span class="text-[10px]">{{ statusConfig.icon }}</span>
            {{ job.status }}
          </span>
          <span class="text-xs text-gray-400">{{ postedTime }}</span>
        </div>
        
        <!-- Title -->
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {{ job.title }}
        </h3>
        
        <!-- Poster -->
        <p class="text-sm text-gray-500 mt-1">
          by {{ job.clientName || job.posterName || "Anonymous" }}
        </p>
      </div>
      
      <!-- Budget -->
      <div class="text-right shrink-0">
        <p class="text-xs text-gray-400 mb-1">Budget</p>
        <p class="text-lg font-bold text-gradient">{{ job.budgetRange || "Flexible" }}</p>
      </div>
    </div>

    <!-- Description -->
    <p class="text-gray-600 line-clamp-2 mb-4 leading-relaxed">{{ job.description }}</p>

    <!-- Skills -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="(skill, index) in (job.skillsRequired || []).slice(0, 4)"
        :key="skill"
        :class="[skillColors[index % skillColors.length], 'px-3 py-1 rounded-full text-xs font-semibold transition-transform hover:scale-105']"
      >
        {{ skill }}
      </span>
      <span
        v-if="(job.skillsRequired || []).length > 4"
        class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
      >
        +{{ (job.skillsRequired || []).length - 4 }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <!-- Proposals Count -->
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          {{ job.bidsCount || 0 }} proposals
        </span>
        
        <!-- Deadline if exists -->
        <span v-if="job.deadline" class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due {{ new Date(job.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) }}
        </span>
      </div>
      
      <!-- Apply CTA -->
      <span class="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
        View Details
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </RouterLink>
</template>
