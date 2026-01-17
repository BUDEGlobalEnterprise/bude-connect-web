<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Freelancer } from "@bude/shared/types";

const props = defineProps<{
  freelancer: Freelancer;
}>();

const formattedRate = computed(() => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(props.freelancer.hourly_rate);
});
</script>

<template>
  <RouterLink
    :to="`/freelancer/${freelancer.name}`"
    class="card p-6 block group"
  >
    <div class="flex items-start gap-4 mb-4">
      <div class="relative">
        <div
          class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center"
        >
          <span class="text-primary-700 font-bold text-xl">
            {{ freelancer.supplier_name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div
          v-if="freelancer.is_verified_expert"
          class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <h3
          class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate"
        >
          {{ freelancer.supplier_name }}
        </h3>
        <p class="text-primary-600 font-medium">{{ formattedRate }}/hr</p>
        <p
          v-if="freelancer.bio"
          class="text-sm text-gray-500 line-clamp-1 mt-1"
        >
          {{ freelancer.bio }}
        </p>
      </div>
    </div>

    <!-- Skills -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="skill in freelancer.skills.slice(0, 4)"
        :key="skill.skill_name"
        class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
      >
        {{ skill.skill_name }}
      </span>
      <span
        v-if="freelancer.skills.length > 4"
        class="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs"
      >
        +{{ freelancer.skills.length - 4 }} more
      </span>
    </div>

    <!-- Stats -->
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ freelancer.completed_jobs }} jobs completed</span>
      <span v-if="freelancer.is_verified_expert" class="badge badge-verified">
        Verified Expert
      </span>
    </div>
  </RouterLink>
</template>
