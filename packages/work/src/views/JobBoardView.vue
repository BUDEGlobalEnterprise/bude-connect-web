<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { getOpenJobs, getSkills } from "@bude/shared/api";
import { debounce } from "@bude/shared/utils";
import { Button, EmptyState, LoadingSkeleton } from "@bude/shared/components";
import type { JobOpening, Skill } from "@bude/shared/types";
import JobCard from "../components/JobCard.vue";

const jobs = ref<JobOpening[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);
const filters = ref({ skill: "", search: "" });

const jobCount = computed(() => jobs.value.length);

async function loadJobs() {
  isLoading.value = true;
  try {
    const result = await getOpenJobs({
      skill: filters.value.skill || undefined,
      search: filters.value.search || undefined,
    });
    jobs.value = result.data;
  } catch (error) {
    console.error("Failed to load jobs:", error);
  } finally {
    isLoading.value = false;
  }
}

async function loadSkills() {
  try {
    skills.value = await getSkills();
  } catch (error) {
    console.error("Failed to load skills:", error);
  }
}

const handleSearch = debounce(loadJobs, 300);

function clearFilters() {
  filters.value = { skill: "", search: "" };
  loadJobs();
}

onMounted(() => {
  loadSkills();
  loadJobs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div class="max-w-5xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">💼 Job Board</h1>
            <p class="text-primary-100 text-lg">Find your next opportunity from verified clients</p>
          </div>
          <RouterLink to="/post-job">
            <Button variant="secondary" size="lg" class="shadow-lg shadow-black/20">
              📝 Post a Job
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Search and Filters -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
        <div class="grid md:grid-cols-4 gap-4">
          <!-- Search Input -->
          <div class="md:col-span-2 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="filters.search"
              @input="handleSearch"
              type="text"
              placeholder="Search jobs by title or description..."
              class="input pl-12"
            />
          </div>
          
          <!-- Skill Filter -->
          <div>
            <select v-model="filters.skill" @change="handleSearch" class="input cursor-pointer">
              <option value="">🎯 All Skills</option>
              <option
                v-for="skill in skills"
                :key="skill.skill_name"
                :value="skill.skill_name"
              >
                {{ skill.skill_name }}
              </option>
            </select>
          </div>
          
          <!-- Clear Button -->
          <div>
            <Button
              v-if="filters.search || filters.skill"
              variant="ghost"
              full-width
              @click="clearFilters"
            >
              ✕ Clear Filters
            </Button>
          </div>
        </div>
        
        <!-- Results count -->
        <div v-if="!isLoading" class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p class="text-gray-600">
            <span class="font-semibold text-gray-900">{{ jobCount }}</span> 
            {{ jobCount === 1 ? 'job' : 'jobs' }} found
          </p>
          <p v-if="filters.search || filters.skill" class="text-sm text-gray-500">
            Filtered results
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4 animate-fade-in">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="flex gap-4">
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-1/4 skeleton"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 skeleton"></div>
              <div class="h-4 bg-gray-200 rounded w-full skeleton"></div>
            </div>
            <div class="h-8 w-24 bg-gray-200 rounded skeleton"></div>
          </div>
        </div>
      </div>

      <!-- Jobs List -->
      <div v-else-if="jobs.length > 0" class="space-y-4 animate-slide-up">
        <JobCard v-for="job in jobs" :key="job.name" :job="job" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">📋</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
        <p class="text-gray-600 mb-6">
          {{ filters.search || filters.skill ? 'Try adjusting your filters' : 'Be the first to post a job!' }}
        </p>
        <RouterLink to="/post-job">
          <Button>📝 Post a Job</Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
