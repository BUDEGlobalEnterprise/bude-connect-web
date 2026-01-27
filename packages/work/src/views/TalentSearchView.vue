<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { searchTalent, getSkills } from "@bude/shared/api";
import { debounce } from "@bude/shared/utils";
import { Button, Badge, EmptyState, ListingSkeleton } from "@bude/shared/components";
import type { Freelancer, Skill } from "@bude/shared/api";

const freelancers = ref<Freelancer[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);
const isFetchingMore = ref(false);
const hasMore = ref(false);
const lastId = ref<string | null>(null);
const selectedFreelancer = ref<Freelancer | null>(null);

const filters = ref({
  skill: "",
  max_rate: undefined as number | undefined,
  verified_only: false,
  search: "",
});

const sortBy = ref("rating");
const popularSkills = ["React", "Python", "Node.js", "UI/UX", "ERPNext", "DevOps", "Flutter", "AWS"];

const loadMoreSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Computed
const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.value.skill) count++;
  if (filters.value.max_rate) count++;
  if (filters.value.verified_only) count++;
  return count;
});

async function loadTalent(isInitial = true) {
  if (isInitial) {
    isLoading.value = true;
    freelancers.value = [];
    lastId.value = null;
  } else {
    isFetchingMore.value = true;
  }

  try {
    const result = await searchTalent({
      skill: filters.value.skill || undefined,
      max_rate: filters.value.max_rate,
      verified_only: filters.value.verified_only || undefined,
      search: filters.value.search || undefined,
      lastId: lastId.value || undefined,
      pageSize: 15
    });
    
    const newTalent = result.data || result;
    if (isInitial) {
      freelancers.value = newTalent;
      if (freelancers.value.length > 0 && !selectedFreelancer.value) {
        selectedFreelancer.value = freelancers.value[0];
      }
    } else {
      freelancers.value = [...freelancers.value, ...newTalent];
    }
    
    hasMore.value = result.has_more;
    lastId.value = result.last_id;
  } catch (error) {
    console.error("Failed to load talent:", error);
  } finally {
    isLoading.value = false;
    isFetchingMore.value = false;
  }
}

async function loadSkills() {
  try {
    skills.value = await getSkills();
  } catch (error) {
    console.error("Failed to load skills:", error);
  }
}

const handleSearch = debounce(() => loadTalent(true), 300);

function selectFreelancer(f: Freelancer) {
  selectedFreelancer.value = f;
}

function clearFilters() {
  filters.value = { skill: "", max_rate: undefined, verified_only: false, search: "" };
  loadTalent(true);
}

function setupIntersectionObserver() {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isFetchingMore.value && !isLoading.value) {
      loadTalent(false);
    }
  }, { threshold: 0.1, rootMargin: '200px' });

  if (loadMoreSentinel.value) {
    observer.observe(loadMoreSentinel.value);
  }
}

watch([() => filters.value.skill, () => filters.value.verified_only, sortBy], () => {
    loadTalent(true);
});

onMounted(() => {
  loadSkills();
  loadTalent();
  setTimeout(setupIntersectionObserver, 1000);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
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
             <span class="text-primary-600 font-bold">Bude</span>
            <span class="text-xs font-medium text-gray-600">Talent Hub</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find <span class="text-primary-600">Expert</span> Freelancers
          </h1>
          <p class="text-sm text-gray-600 max-w-xl mx-auto">
            World-class talent ready to build your vision
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
            <Button class="px-6 rounded-lg text-sm" @click="loadTalent(true)">
              Find Talent
            </Button>
          </div>
          
          <!-- Quick Skills -->
          <div class="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span class="text-xs text-gray-500">Popular:</span>
            <button
              v-for="skill in popularSkills"
              :key="skill"
              @click="filters.skill = skill; loadTalent(true)"
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
            <p class="text-xl md:text-2xl font-bold text-gray-900">2,000+</p>
            <p class="text-xs text-gray-500">Freelancers</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">50+</p>
            <p class="text-xs text-gray-500">Skills</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">₹5Cr+</p>
            <p class="text-xs text-gray-500">Trade Volume</p>
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
            <select v-model="filters.skill" @change="loadTalent(true)" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
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
            <input v-model="filters.verified_only" @change="loadTalent(true)" type="checkbox" id="verified" class="rounded text-primary-600 focus:ring-primary-500" />
            <label for="verified" class="text-sm text-gray-700 select-none">Verified Only</label>
          </div>

          <button @click="clearFilters" class="w-full text-xs text-gray-600 hover:text-primary-600 py-2 border rounded-lg hover:bg-white hover:border-primary-200 transition-all">
            ✕ Clear Filters
          </button>
        </div>

        <!-- Middle: Freelancer Cards -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Professionals</span>
            <select v-model="sortBy" class="bg-transparent outline-none">
              <option value="rating">Top Rated</option>
              <option value="rate-low">Lowest Rate</option>
              <option value="jobs">Most Active</option>
            </select>
          </div>

          <!-- Loading (Skeletons) -->
          <div v-if="isLoading" class="space-y-3">
             <ListingSkeleton v-for="i in 5" :key="i" />
          </div>

          <!-- Empty State -->
          <EmptyState v-else-if="freelancers.length === 0" title="No experts found" description="Try broadening your search" icon="🔍" />

          <!-- Freelancer Cards -->
          <div v-else class="space-y-3">
            <div
              v-for="freelancer in freelancers"
              :key="freelancer.name"
              @click="selectFreelancer(freelancer)"
              class="p-4 rounded-xl cursor-pointer transition-all border bude-hover-lift"
              :class="selectedFreelancer?.name === freelancer.name 
                ? 'bg-primary-50 border-primary-500 shadow-md ring-1 ring-primary-500' 
                : 'bg-white hover:border-gray-300 border-gray-100 shadow-sm'"
            >
              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span class="text-white text-lg font-bold">{{ freelancer.supplierName?.charAt(0) || 'F' }}</span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="text-sm font-bold text-gray-900 truncate">{{ freelancer.supplierName }}</h4>
                    <Badge v-if="freelancer.isVerifiedExpert" variant="success" class="text-[9px] px-1.5 py-0">EXPERT</Badge>
                  </div>
                  
                  <!-- Skills -->
                  <div class="flex flex-wrap gap-1 mb-3">
                    <span 
                      v-for="skill in (freelancer.skills || []).slice(0, 3)" 
                      :key="skill.skill_name"
                      class="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium"
                    >
                      {{ skill.skill_name }}
                    </span>
                    <span v-if="(freelancer.skills || []).length > 3" class="text-[10px] text-gray-400">
                      +{{ freelancer.skills.length - 3 }}
                    </span>
                  </div>
                  
                  <!-- Stats -->
                  <div class="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <div class="flex items-center gap-3">
                      <span class="text-primary-600">₹{{ freelancer.hourlyRate }}/hr</span>
                      <span>{{ freelancer.completedJobs || 0 }} jobs</span>
                    </div>
                    <span class="text-amber-500 flex items-center gap-0.5">⭐ {{ (freelancer.boostScore / 20).toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Infinite Scroll Skeletons -->
            <div v-if="isFetchingMore" class="space-y-3 mt-3">
              <ListingSkeleton v-for="i in 2" :key="i" />
            </div>

            <!-- Sentinel -->
            <div ref="loadMoreSentinel" class="h-10"></div>
          </div>
        </div>

        <!-- Right: Freelancer Detail -->
        <div class="hidden lg:block lg:col-span-3">
          <div v-if="selectedFreelancer" class="bg-white border bude-glass rounded-2xl p-6 sticky top-24 shadow-sm">
            <!-- Header -->
            <div class="flex items-start gap-5 mb-6">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span class="text-white text-3xl font-bold">{{ selectedFreelancer.supplierName?.charAt(0) || 'F' }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1 cursor-default">
                  <h2 class="text-xl font-bold text-gray-900">{{ selectedFreelancer.supplierName }}</h2>
                  <Badge v-if="selectedFreelancer.isVerifiedExpert" variant="success" class="rounded-full">VERIFIED</Badge>
                </div>
                <p class="text-sm text-gray-500">Member since {{ selectedFreelancer.memberSince }}</p>
                <div class="flex gap-4 mt-3">
                    <div class="text-center">
                        <p class="text-sm font-bold text-gray-900">{{ selectedFreelancer.completedJobs || 0 }}</p>
                        <p class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Jobs</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-bold text-gray-900">₹{{ selectedFreelancer.hourlyRate }}</p>
                        <p class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Rate</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-bold text-gray-900">{{ (selectedFreelancer.boostScore/20).toFixed(1) }}</p>
                        <p class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Rating</p>
                    </div>
                </div>
              </div>
            </div>

            <!-- Bio -->
            <div class="mb-6">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About the Expert</h3>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {{ selectedFreelancer.bio || 'This expert hasn\'t added a bio yet.' }}
              </p>
            </div>

            <!-- Skills -->
            <div class="mb-6">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Expertise</h3>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="skill in selectedFreelancer.skills || []" :key="skill.skill_name" variant="secondary" class="bg-primary-50 text-primary-700">
                  {{ skill.skill_name }}
                </Badge>
              </div>
            </div>

            <!-- Portfolio Hits -->
            <div class="mb-8" v-if="selectedFreelancer.portfolio_links?.length">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Projects</h3>
              <div class="grid grid-cols-2 gap-3">
                <a 
                  v-for="link in selectedFreelancer.portfolio_links.slice(0, 4)" 
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  class="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <p class="text-xs font-bold text-gray-700 truncate mb-1 group-hover:text-primary-600">{{ link.title }}</p>
                  <p class="text-[10px] text-gray-400 truncate">View Portfolio →</p>
                </a>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <RouterLink 
                :to="`/talent/${selectedFreelancer.name}`"
                class="flex-1 text-center py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 hover:-translate-y-0.5"
              >
                Hire this Expert
              </RouterLink>
              <button class="px-5 py-3.5 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                💬
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-gray-50/50 border border-dashed rounded-2xl p-12 text-center">
             <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <span class="text-2xl">⚡</span>
            </div>
            <p class="text-gray-500 font-medium">Select an expert to view their full credentials</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bude-hover-lift {
  @apply transition-all duration-200;
}
.bude-hover-lift:hover {
  @apply -translate-y-1 shadow-md;
}
.bude-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}
</style>
