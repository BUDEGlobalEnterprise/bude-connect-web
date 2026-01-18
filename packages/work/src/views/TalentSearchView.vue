<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { searchTalent, getSkills } from "@bude/shared/api";
import { debounce } from "@bude/shared/utils";
import { Button, Badge, EmptyState, LoadingSkeleton } from "@bude/shared/components";
import type { Freelancer, Skill } from "@bude/shared/types";

const freelancers = ref<Freelancer[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);
const selectedFreelancer = ref<Freelancer | null>(null);

const filters = ref({
  skill: "",
  max_rate: undefined as number | undefined,
  verified_only: false,
  search: "",
});

const sortBy = ref("rating");
const currentPage = ref(1);
const itemsPerPage = 10;

const popularSkills = ["React", "Python", "Node.js", "UI/UX", "ERPNext", "DevOps", "Flutter", "AWS"];

// Computed
const filteredFreelancers = computed(() => {
  let result = [...freelancers.value];
  
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    result = result.filter(f => 
      f.supplier_name.toLowerCase().includes(q) ||
      f.bio?.toLowerCase().includes(q) ||
      f.skills?.some(s => s.skill_name.toLowerCase().includes(q))
    );
  }
  
  if (filters.value.skill) {
    result = result.filter(f => 
      f.skills?.some(s => s.skill_name === filters.value.skill)
    );
  }
  
  if (filters.value.max_rate) {
    result = result.filter(f => f.hourly_rate <= filters.value.max_rate!);
  }
  
  if (filters.value.verified_only) {
    result = result.filter(f => f.is_verified_expert);
  }
  
  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case "rating": return b.boost_score - a.boost_score;
      case "rate-low": return a.hourly_rate - b.hourly_rate;
      case "rate-high": return b.hourly_rate - a.hourly_rate;
      case "jobs": return b.completed_jobs - a.completed_jobs;
      default: return 0;
    }
  });
  
  return result;
});

const paginatedFreelancers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredFreelancers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredFreelancers.value.length / itemsPerPage));

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.value.skill) count++;
  if (filters.value.max_rate) count++;
  if (filters.value.verified_only) count++;
  return count;
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
    freelancers.value = result.data || result;
    if (freelancers.value.length > 0) {
      selectedFreelancer.value = freelancers.value[0];
    }
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

function selectFreelancer(f: Freelancer) {
  selectedFreelancer.value = f;
}

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
  <div class="min-h-screen bg-white">
    <!-- Compact Hero -->
    <div class="bg-gradient-to-br from-gray-50 via-purple-50/50 to-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <!-- Brand + Title -->
        <div class="text-center mb-5">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border shadow-sm mb-3">
            <img src="/logo.png" alt="BudeGlobal" class="h-6" />
            <span class="text-xs font-medium text-gray-600">Talent Hub</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find <span class="text-primary-600">Expert</span> Freelancers
          </h1>
          <p class="text-sm text-gray-600 max-w-xl mx-auto">
            {{ filteredFreelancers.length }}+ verified professionals ready for your projects
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row items-stretch gap-2 border">
            <div class="flex-1 flex items-center px-3">
              <span class="text-gray-400 mr-2">🔍</span>
              <input
                v-model="filters.search"
                @input="handleSearch"
                type="text"
                placeholder="Search by name, skill, or keyword..."
                class="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <Button class="px-6 rounded-lg text-sm" @click="loadTalent">
              Find Talent
            </Button>
          </div>
          
          <!-- Quick Skills -->
          <div class="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span class="text-xs text-gray-500">Popular:</span>
            <button
              v-for="skill in popularSkills"
              :key="skill"
              @click="filters.skill = skill; loadTalent()"
              class="text-xs px-2.5 py-1 bg-white hover:bg-primary-50 rounded-full border hover:border-primary-300 hover:text-primary-600 transition-colors"
              :class="filters.skill === skill ? 'bg-primary-100 border-primary-300 text-primary-600' : ''"
            >
              {{ skill }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="bg-white border-b py-4">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">{{ freelancers.length }}+</p>
            <p class="text-xs text-gray-500">Freelancers</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">50+</p>
            <p class="text-xs text-gray-500">Skills</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">₹5Cr+</p>
            <p class="text-xs text-gray-500">Paid Out</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">4.9★</p>
            <p class="text-xs text-gray-500">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-Column Layout -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <!-- Left: Filters (hidden on mobile) -->
        <div class="hidden lg:block lg:col-span-1 space-y-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900">Filters</h3>
            <Badge v-if="activeFilterCount > 0" variant="info" class="text-xs">{{ activeFilterCount }}</Badge>
          </div>

          <!-- Skill -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">SKILL</label>
            <select v-model="filters.skill" @change="loadTalent" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
              <option value="">All Skills</option>
              <option v-for="skill in skills" :key="skill.skill_name" :value="skill.skill_name">
                {{ skill.skill_name }}
              </option>
            </select>
          </div>

          <!-- Max Rate -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">MAX RATE (₹/hr)</label>
            <input v-model.number="filters.max_rate" @input="handleSearch" type="number" placeholder="e.g. 1000" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2" />
          </div>

          <!-- Verified Only -->
          <div class="flex items-center gap-2">
            <input v-model="filters.verified_only" @change="loadTalent" type="checkbox" id="verified" class="rounded text-primary-600" />
            <label for="verified" class="text-sm text-gray-700">Verified Only</label>
          </div>

          <button @click="clearFilters" class="w-full text-xs text-gray-600 hover:text-primary-600 py-2 border rounded-lg hover:bg-gray-50">
            ✕ Clear Filters
          </button>
        </div>

        <!-- Middle: Freelancer Cards -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-600">{{ filteredFreelancers.length }} freelancers found</p>
            <select v-model="sortBy" class="text-sm bg-gray-50 border rounded-lg px-3 py-1.5">
              <option value="rating">Top Rated</option>
              <option value="rate-low">Rate: Low to High</option>
              <option value="rate-high">Rate: High to Low</option>
              <option value="jobs">Most Jobs Done</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 5" :key="i" class="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div class="flex gap-3">
                <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Freelancer Cards -->
          <div v-else class="space-y-2">
            <div
              v-for="freelancer in paginatedFreelancers"
              :key="freelancer.name"
              @click="selectFreelancer(freelancer)"
              class="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
              :class="selectedFreelancer?.name === freelancer.name 
                ? 'bg-primary-50 border-2 border-primary-500 shadow-sm' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold">{{ freelancer.supplier_name?.charAt(0) || 'F' }}</span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="text-sm font-semibold text-gray-900 truncate">{{ freelancer.supplier_name }}</h4>
                    <span v-if="freelancer.is_verified_expert" class="text-green-500 text-xs">✓</span>
                  </div>
                  
                  <!-- Skills -->
                  <div class="flex flex-wrap gap-1 mb-2">
                    <span 
                      v-for="skill in (freelancer.skills || []).slice(0, 3)" 
                      :key="skill.skill_name"
                      class="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-600"
                    >
                      {{ skill.skill_name }}
                    </span>
                    <span v-if="(freelancer.skills || []).length > 3" class="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-400">
                      +{{ freelancer.skills.length - 3 }}
                    </span>
                  </div>
                  
                  <!-- Stats -->
                  <div class="flex items-center gap-3 text-xs text-gray-600">
                    <span class="font-medium text-primary-600">₹{{ freelancer.hourly_rate }}/hr</span>
                    <span>{{ freelancer.completed_jobs || 0 }} jobs</span>
                    <span class="text-amber-500">⭐ {{ (freelancer.boost_score / 20).toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <EmptyState v-if="!isLoading && paginatedFreelancers.length === 0" title="No freelancers found" description="Try adjusting your filters" icon="🔍" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50">
              ‹ Prev
            </button>
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50">
              Next ›
            </button>
          </div>
        </div>

        <!-- Right: Freelancer Detail -->
        <div class="hidden lg:block lg:col-span-3">
          <div v-if="selectedFreelancer" class="bg-white border rounded-xl p-5 sticky top-20">
            <!-- Header -->
            <div class="flex items-start gap-4 mb-5">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span class="text-white text-2xl font-bold">{{ selectedFreelancer.supplier_name?.charAt(0) || 'F' }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h2 class="text-lg font-bold text-gray-900">{{ selectedFreelancer.supplier_name }}</h2>
                  <Badge v-if="selectedFreelancer.is_verified_expert" variant="success" class="text-[10px]">✓ Verified</Badge>
                </div>
                <p class="text-sm text-gray-500">Member since {{ selectedFreelancer.member_since }}</p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-primary-600">₹{{ selectedFreelancer.hourly_rate }}</p>
                <p class="text-xs text-gray-500">Per Hour</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">{{ selectedFreelancer.completed_jobs || 0 }}</p>
                <p class="text-xs text-gray-500">Jobs Done</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-amber-500">⭐ {{ (selectedFreelancer.boost_score / 20).toFixed(1) }}</p>
                <p class="text-xs text-gray-500">Rating</p>
              </div>
            </div>

            <!-- Bio -->
            <div class="mb-5" v-if="selectedFreelancer.bio">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">About</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ selectedFreelancer.bio }}</p>
            </div>

            <!-- Skills -->
            <div class="mb-5">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="skill in selectedFreelancer.skills || []" :key="skill.skill_name" variant="secondary">
                  {{ skill.skill_name }}
                </Badge>
              </div>
            </div>

            <!-- Portfolio -->
            <div class="mb-5" v-if="selectedFreelancer.portfolio_links?.length">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Portfolio</h3>
              <div class="space-y-2">
                <a 
                  v-for="link in selectedFreelancer.portfolio_links" 
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  class="block text-sm text-primary-600 hover:underline"
                >
                  🔗 {{ link.title }}
                </a>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <RouterLink 
                :to="`/talent/${selectedFreelancer.name}`"
                class="flex-1 text-center py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                View Full Profile
              </RouterLink>
              <button class="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
                💬 Message
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-gray-50 rounded-xl p-10 text-center">
            <span class="text-4xl mb-3 block">👈</span>
            <p class="text-gray-500">Select a freelancer to see their profile</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Button -->
    <div class="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
      <button class="px-6 py-3 bg-primary-600 text-white font-medium rounded-full shadow-xl flex items-center gap-2">
        <span>Filters</span>
        <Badge v-if="activeFilterCount > 0" variant="secondary" class="bg-white text-primary-600 text-xs">{{ activeFilterCount }}</Badge>
      </button>
    </div>
  </div>
</template>
