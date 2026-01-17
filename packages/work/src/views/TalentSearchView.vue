<script setup lang="ts">
import { ref, onMounted } from "vue";
import { searchTalent, getSkills } from "@bude/shared/api";
import type { Freelancer, Skill } from "@bude/shared/types";
import FreelancerCard from "../components/FreelancerCard.vue";

const freelancers = ref<Freelancer[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);

const filters = ref({
  skill: "",
  max_rate: undefined as number | undefined,
  verified_only: false,
  search: "",
});

async function loadTalent() {
  isLoading.value = true;
  try {
    const result = await searchTalent({
      skill: filters.value.skill || undefined,
      max_rate: filters.value.max_rate,
      verified_only: filters.value.verified_only || undefined,
      search: filters.value.search || undefined,
    });
    freelancers.value = result.data;
  } catch (error) {
    console.error("Failed to load talent:", error);
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
  loadTalent();
}

onMounted(() => {
  loadSkills();
  loadTalent();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Find Talent</h1>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Name or keyword..."
            class="input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Skill</label
          >
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Max Hourly Rate</label
          >
          <input
            v-model.number="filters.max_rate"
            type="number"
            placeholder="₹/hour"
            class="input"
            @change="handleSearch"
          />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="filters.verified_only"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              @change="handleSearch"
            />
            <span class="font-medium text-gray-700">Verified Only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6 animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class="h-6 bg-gray-200 rounded-full w-16"></div>
          <div class="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div
      v-else-if="freelancers.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <FreelancerCard
        v-for="freelancer in freelancers"
        :key="freelancer.name"
        :freelancer="freelancer"
      />
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        No freelancers found
      </h3>
      <p class="text-gray-500">Try adjusting your filters</p>
    </div>
  </div>
</template>
