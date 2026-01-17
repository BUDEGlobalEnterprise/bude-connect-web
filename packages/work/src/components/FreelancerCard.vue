<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Freelancer } from "@bude/shared/types";
import { formatPrice } from "@bude/shared/utils";
import { Avatar, Badge } from "@bude/shared/components";

const props = defineProps<{
  freelancer: Freelancer;
}>();

const formattedRate = computed(() => {
  return formatPrice(props.freelancer.hourly_rate || 0);
});

const skillColors = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700"];
</script>

<template>
  <RouterLink
    :to="`/freelancer/${freelancer.name}`"
    class="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
  >
    <!-- Header with Avatar -->
    <div class="flex items-start gap-4 mb-4">
      <!-- Avatar with verification badge -->
      <div class="relative shrink-0">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <span class="text-white font-bold text-2xl">
            {{ (freelancer.supplier_name || 'F').charAt(0).toUpperCase() }}
          </span>
        </div>
        <!-- Verified Badge -->
        <div
          v-if="freelancer.is_verified_expert"
          class="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate text-lg">
            {{ freelancer.supplier_name }}
          </h3>
          <span v-if="freelancer.is_verified_expert" class="text-emerald-500 text-xs font-semibold">
            ✓ Verified
          </span>
        </div>
        
        <!-- Rate -->
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-gradient">{{ formattedRate }}</span>
          <span class="text-gray-500 text-sm">/hour</span>
        </div>
      </div>
    </div>

    <!-- Bio -->
    <p v-if="freelancer.bio" class="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
      {{ freelancer.bio }}
    </p>

    <!-- Skills -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="(skill, index) in (freelancer.skills || []).slice(0, 4)"
        :key="skill.skill_name"
        :class="[skillColors[index % skillColors.length], 'px-3 py-1 rounded-full text-xs font-semibold transition-transform hover:scale-105']"
      >
        {{ skill.skill_name }}
      </span>
      <span
        v-if="(freelancer.skills || []).length > 4"
        class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
      >
        +{{ (freelancer.skills || []).length - 4 }}
      </span>
    </div>

    <!-- Stats -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <!-- Jobs Completed -->
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ freelancer.completed_jobs || 0 }} jobs done
        </span>
        
        <!-- Rating if exists -->
        <span v-if="freelancer.rating" class="flex items-center gap-1">
          <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ freelancer.rating }}
        </span>
      </div>
      
      <!-- View CTA -->
      <span class="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
        View Profile
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </RouterLink>
</template>
