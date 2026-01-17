<script setup lang="ts">
import { ref, onMounted } from "vue";
import { searchTalent, getSkills } from "@bude/shared/api";
import { debounce } from "@bude/shared/utils";
import {
  Button,
  Input,
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

onMounted(() => {
  loadSkills();
  loadTalent();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Find Talent</h1>

    <!-- Filters -->
    <FilterPanel
      v-model:search="filters.search"
      v-model:skill="filters.skill"
      v-model:maxRate="filters.max_rate"
      v-model:verifiedOnly="filters.verified_only"
      :skills="skills"
      @filter="handleSearch"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6">
        <LoadingSkeleton variant="list" />
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
    <EmptyState
      v-else
      title="No freelancers found"
      message="Try adjusting your filters"
      icon="users"
    />
  </div>
</template>
