<script setup lang="ts">
import { ref, onMounted } from "vue";
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

onMounted(() => {
  loadSkills();
  loadJobs();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Job Board</h1>
      <RouterLink to="/post-job"><Button>Post a Job</Button></RouterLink>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <input
            v-model="filters.search"
            @input="handleSearch"
            type="text"
            placeholder="Search jobs..."
            class="input"
          />
        </div>
        <div>
          <select v-model="filters.skill" @change="handleSearch" class="input">
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
      <LoadingSkeleton variant="list" v-for="i in 5" :key="i" />
    </div>

    <!-- Jobs -->
    <div v-else-if="jobs.length > 0" class="space-y-4">
      <JobCard v-for="job in jobs" :key="job.name" :job="job" />
    </div>

    <!-- Empty -->
    <EmptyState
      v-else
      title="No jobs found"
      message="Be the first to post a job!"
      icon="briefcase"
    />
  </div>
</template>
