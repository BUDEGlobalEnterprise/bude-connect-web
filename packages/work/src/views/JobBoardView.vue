<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getJobs, getSkills } from "@bude/shared/api";
import type { JobOpening, Skill } from "@bude/shared/types";
import { Badge, Button, ListingSkeleton } from "@bude/shared/components";

const router = useRouter();

// State
const jobs = ref<JobOpening[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);
const isFetchingMore = ref(false);
const hasMore = ref(false);
const lastId = ref<string | null>(null);
const selectedJob = ref<JobOpening | null>(null);

// Filters
const search = ref("");
const statusFilter = ref("Open");
const experienceFilter = ref("all");
const remoteFilter = ref("all");
const minBudget = ref("");
const maxBudget = ref("");
const sortBy = ref("newest");

const loadMoreSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Computed
const activeFilterCount = computed(() => {
  let count = 0;
  if (statusFilter.value !== "Open") count++;
  if (experienceFilter.value !== "all") count++;
  if (remoteFilter.value !== "all") count++;
  if (minBudget.value) count++;
  if (maxBudget.value) count++;
  return count;
});

const popularSkills = ["React", "Python", "Node.js", "UI/UX", "ERPNext", "DevOps"];

function getTimeAgo(date: string): string {
  const now = new Date();
  const posted = new Date(date);
  const hours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function getMatchScore(job: JobOpening): number {
  let score = 80;
  if (job.status === "Open") score += 10;
  if (job.totalBids < 10) score += 5;
  if (job.isRemote) score += 5;
  return Math.min(score, 100);
}

function selectJob(job: JobOpening) {
  selectedJob.value = job;
}

function clearFilters() {
  search.value = "";
  statusFilter.value = "Open";
  experienceFilter.value = "all";
  remoteFilter.value = "all";
  minBudget.value = "";
  maxBudget.value = "";
  loadData(true);
}

async function loadData(isInitial = true) {
  if (isInitial) {
    isLoading.value = true;
    jobs.value = [];
    lastId.value = null;
  } else {
    isFetchingMore.value = true;
  }

  try {
    const result = await getJobs({ 
      skill: search.value || undefined,
      search: search.value || undefined,
      lastId: lastId.value || undefined,
      pageSize: 15
    });
    
    const newJobs = result.data || result;
    if (isInitial) {
      jobs.value = newJobs;
      if (jobs.value.length > 0 && !selectedJob.value) {
        selectedJob.value = jobs.value[0];
      }
    } else {
      jobs.value = [...jobs.value, ...newJobs];
    }
    
    hasMore.value = result.has_more;
    lastId.value = result.last_id;
  } catch (e) {
    console.error("Failed to load jobs:", e);
  } finally {
    isLoading.value = false;
    isFetchingMore.value = false;
  }
}

async function loadSkills() {
    try {
        skills.value = await getSkills();
    } catch (e) {
        console.error("Failed to load skills:", e);
    }
}

function setupIntersectionObserver() {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isFetchingMore.value && !isLoading.value) {
      loadData(false);
    }
  }, { threshold: 0.1, rootMargin: '200px' });

  if (loadMoreSentinel.value) {
    observer.observe(loadMoreSentinel.value);
  }
}

watch([search, statusFilter, experienceFilter, remoteFilter, sortBy], () => {
    loadData(true);
});

onMounted(() => {
    loadData();
    loadSkills();
    setTimeout(setupIntersectionObserver, 1000);
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Compact Hero -->
    <div class="bg-gradient-to-br from-gray-50 via-blue-50/50 to-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <!-- Brand + Title -->
        <div class="text-center mb-5">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border shadow-sm mb-3">
            <span class="text-primary-600 font-bold">Bude</span>
            <span class="text-xs font-medium text-gray-600">Work Board</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream <span class="text-primary-600">Freelance</span> Opportunity
          </h1>
          <p class="text-sm text-gray-600 max-w-xl mx-auto">
            Verified jobs from top companies globally
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row items-stretch gap-2 border">
            <div class="flex-1 flex items-center px-3">
              <span class="text-gray-400 mr-2">🔍</span>
              <input
                v-model="search"
                type="text"
                placeholder="Job title, skills, or keywords..."
                class="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <Button class="px-6 rounded-lg text-sm" @click="loadData(true)">
              Search Jobs
            </Button>
          </div>
          
          <!-- Quick Skills -->
          <div class="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span class="text-xs text-gray-500">Popular:</span>
            <button
              v-for="skill in popularSkills"
              :key="skill"
              @click="search = skill"
              class="text-xs px-2.5 py-1 bg-white hover:bg-primary-50 rounded-full border hover:border-primary-300 hover:text-primary-600 transition-colors"
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
            <p class="text-xl md:text-2xl font-bold text-gray-900">500+</p>
            <p class="text-xs text-gray-500">Active Jobs</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">2,000+</p>
            <p class="text-xs text-gray-500">Freelancers</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">100+</p>
            <p class="text-xs text-gray-500">Companies</p>
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

          <!-- Status -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">STATUS</label>
            <select v-model="statusFilter" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <!-- Experience -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">EXPERIENCE</label>
            <select v-model="experienceFilter" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
              <option value="all">Any Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <!-- Remote -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">REMOTE</label>
            <select v-model="remoteFilter" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
              <option value="all">All Options</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <!-- Budget -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">BUDGET (₹)</label>
            <div class="space-y-2">
              <input v-model="minBudget" type="number" placeholder="Min" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2" />
              <input v-model="maxBudget" type="number" placeholder="Max" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2" />
            </div>
          </div>

          <button @click="clearFilters" class="w-full text-xs text-gray-600 hover:text-primary-600 py-2 border rounded-lg hover:bg-gray-50">
            ✕ Clear Filters
          </button>
        </div>

        <!-- Middle: Job Cards -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Listings</span>
            <select v-model="sortBy" class="bg-transparent outline-none">
              <option value="newest">Newest</option>
              <option value="budget-high">High Budget</option>
              <option value="proposals-low">Few Proposals</option>
            </select>
          </div>

          <!-- Loading (Skeletons) -->
          <div v-if="isLoading" class="space-y-3">
            <ListingSkeleton v-for="i in 5" :key="i" />
          </div>

          <!-- Empty State -->
          <EmptyState
            v-else-if="jobs.length === 0"
            title="No jobs found"
            description="Try adjusting your filters or search terms."
            icon="🔍"
          />

          <!-- Job Cards -->
          <div v-else class="space-y-3">
            <div
              v-for="job in jobs"
              :key="job.name"
              @click="selectJob(job)"
              class="p-4 rounded-xl cursor-pointer transition-all border bude-hover-lift"
              :class="selectedJob?.name === job.name 
                ? 'bg-primary-50 border-primary-500 shadow-md ring-1 ring-primary-500' 
                : 'bg-white hover:border-gray-300 border-gray-100 shadow-sm'"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ job.title }}</h4>
                  <p class="text-xs text-gray-500">{{ job.clientName }}</p>
                </div>
                <Badge :variant="getMatchScore(job) >= 90 ? 'success' : 'info'" class="text-[10px] shrink-0">
                  {{ getMatchScore(job) }}% Match
                </Badge>
              </div>

              <!-- Skills -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span 
                  v-for="skill in (job.skills || []).slice(0, 3)" 
                  :key="skill.skill_name"
                  class="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium"
                >
                  {{ skill.skill_name }}
                </span>
                <span v-if="(job.skills || []).length > 3" class="text-[10px] text-gray-400">
                  +{{ job.skills.length - 3 }}
                </span>
              </div>

              <!-- Meta -->
              <div class="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <div class="flex items-center gap-3">
                  <span class="text-gray-900">₹{{ job.budgetMin?.toLocaleString() }}-{{ job.budgetMax?.toLocaleString() }}</span>
                  <span>{{ job.totalBids || 0 }} bids</span>
                </div>
                <span>{{ getTimeAgo(job.created) }}</span>
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

        <!-- Right: Job Detail -->
        <div class="hidden lg:block lg:col-span-3">
          <div v-if="selectedJob" class="bg-white border bude-glass rounded-2xl p-6 sticky top-24 shadow-sm">
            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-1">{{ selectedJob.title }}</h2>
                <p class="text-sm text-gray-500">Posted by {{ selectedJob.clientName }}</p>
              </div>
              <Badge :variant="selectedJob.status === 'Open' ? 'success' : 'secondary'" class="rounded-full">
                {{ selectedJob.status }}
              </Badge>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p class="text-sm font-bold text-gray-900">₹{{ selectedJob.budgetMax?.toLocaleString() }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Max Budget</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p class="text-sm font-bold text-gray-900">{{ selectedJob.totalBids || 0 }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Bids</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p class="text-sm font-bold text-gray-900">{{ selectedJob.duration || 'Flexible' }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Duration</p>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Job Description</h3>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {{ selectedJob.description || 'No description provided.' }}
              </p>
            </div>

            <!-- Skills -->
            <div class="mb-6">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Required Skills</h3>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="skill in selectedJob.skills || []" :key="skill.skill_name" variant="secondary" class="bg-primary-50 text-primary-700 hover:bg-primary-100">
                  {{ skill.skill_name }}
                </Badge>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-8">
              <RouterLink 
                :to="`/jobs/${selectedJob.name}`"
                class="flex-1 text-center py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Apply for this Job
              </RouterLink>
              <button class="px-5 py-3.5 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                🔖
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-gray-50/50 border border-dashed rounded-2xl p-12 text-center">
            <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <span class="text-2xl">👈</span>
            </div>
            <p class="text-gray-500 font-medium">Select a job from the list to view details</p>
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
</style>
