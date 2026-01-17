<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getOpenJobs, getSkills } from "@bude/shared/api";
import type { JobOpening, Skill } from "@bude/shared/types";
import JobCard from "../components/JobCard.vue";

const jobs = ref<JobOpening[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);

const filters = ref({
  skill: "",
  search: "",
});

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

function handleSearch() {
  loadJobs();
}

onMounted(() => {
  loadSkills();
  loadJobs();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Job Board</h1>
      <RouterLink to="/post-job" class="btn btn-primary">
        Post a Job
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search jobs..."
            class="input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div>
          <select v-model="filters.skill" class="input" @change="handleSearch">
            <option value="">All Skills</option>
            <option
              v-for="skill in skills"
              :key="skill.skill_name"
              :value="skill.skill_name"
            >
              {{ skill.skill_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="card p-6 animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-16 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Jobs -->
    <div v-else-if="jobs.length > 0" class="space-y-4">
      <JobCard v-for="job in jobs" :key="job.name" :job="job" />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div
        class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
      <p class="text-gray-500">Be the first to post a job!</p>
    </div>
  </div>
</template>
