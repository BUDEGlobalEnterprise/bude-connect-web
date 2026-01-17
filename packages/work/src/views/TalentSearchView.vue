<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { searchTalent, getSkills } from "@bude/shared/api";
import { debounce } from "@bude/shared/utils";
import {
  Button,
  EmptyState,
  LoadingSkeleton,
} from "@bude/shared/components";
import type { Freelancer, Skill } from "@bude/shared/types";
import FreelancerCard from "../components/FreelancerCard.vue";
import FilterPanel from "../components/FilterPanel.vue";

const freelancers = ref<Freelancer[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);

const filters = ref({
  skill: "",
  max_rate: undefined as number | undefined,
  verified_only: false,
  search: "",
});

const talentCount = computed(() => freelancers.value.length);

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

const handleSearch = debounce(loadTalent, 300);

function clearFilters() {
  filters.value = { skill: "", max_rate: undefined, verified_only: false, search: "" };
  loadTalent();
}

onMounted(() => {
  loadSkills();
  loadTalent();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-accent-600 to-accent-500 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">👨‍💻 Find Talent</h1>
            <p class="text-accent-100 text-lg">Discover verified experts for your projects</p>
          </div>
          <div class="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
            <div class="text-center">
              <p class="text-2xl font-bold">10K+</p>
              <p class="text-xs text-accent-200">Freelancers</p>
            </div>
            <div class="w-px h-10 bg-white/20"></div>
            <div class="text-center">
              <p class="text-2xl font-bold">95%</p>
              <p class="text-xs text-accent-200">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              placeholder="Search by name, skill, or bio..."
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
          
          <!-- Verified Only Toggle -->
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="filters.verified_only"
                @change="handleSearch"
                class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm font-medium text-gray-700">✅ Verified Only</span>
            </label>
          </div>
        </div>
        
        <!-- Results count -->
        <div v-if="!isLoading" class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p class="text-gray-600">
            <span class="font-semibold text-gray-900">{{ talentCount }}</span> 
            {{ talentCount === 1 ? 'freelancer' : 'freelancers' }} found
          </p>
          <button
            v-if="filters.search || filters.skill || filters.verified_only"
            @click="clearFilters"
            class="text-sm text-primary-600 hover:underline"
          >
            ✕ Clear filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="flex gap-4 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gray-200 skeleton"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
              <div class="h-6 bg-gray-200 rounded w-1/3 skeleton"></div>
            </div>
          </div>
          <div class="flex gap-2">
            <div class="h-6 w-16 bg-gray-200 rounded-full skeleton"></div>
            <div class="h-6 w-20 bg-gray-200 rounded-full skeleton"></div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div
        v-else-if="freelancers.length > 0"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up"
      >
        <FreelancerCard
          v-for="freelancer in freelancers"
          :key="freelancer.name"
          :freelancer="freelancer"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">👥</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No freelancers found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
        <Button @click="clearFilters">Clear Filters</Button>
      </div>
    </div>
  </div>
</template>
