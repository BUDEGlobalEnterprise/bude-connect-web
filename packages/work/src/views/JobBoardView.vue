<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getJobs, getSkills } from "@bude/shared/api";
import type { JobOpening, Skill } from "@bude/shared/types";
import { Badge, Button, LoadingSkeleton } from "@bude/shared/components";

const router = useRouter();

// State
const jobs = ref<JobOpening[]>([]);
const skills = ref<Skill[]>([]);
const isLoading = ref(true);
const selectedJob = ref<JobOpening | null>(null);

// Filters
const search = ref("");
const statusFilter = ref("open");
const experienceFilter = ref("all");
const remoteFilter = ref("all");
const minBudget = ref("");
const maxBudget = ref("");
const sortBy = ref("newest");

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed
const filteredJobs = computed(() => {
  let result = [...jobs.value];
  
  // Search filter
  if (search.value) {
    const q = search.value.toLowerCase();
    result = result.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q) ||
      j.skills?.some(s => s.skill_name.toLowerCase().includes(q))
    );
  }
  
  // Status filter
  if (statusFilter.value !== "all") {
    result = result.filter(j => j.status === statusFilter.value);
  }
  
  // Experience filter
  if (experienceFilter.value !== "all") {
    result = result.filter(j => j.experience_level === experienceFilter.value);
  }
  
  // Remote filter
  if (remoteFilter.value !== "all") {
    result = result.filter(j => j.is_remote === (remoteFilter.value === "remote"));
  }
  
  // Budget filter
  if (minBudget.value) {
    result = result.filter(j => j.budget_max >= parseInt(minBudget.value));
  }
  if (maxBudget.value) {
    result = result.filter(j => j.budget_min <= parseInt(maxBudget.value));
  }
  
  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case "newest": return new Date(b.creation).getTime() - new Date(a.creation).getTime();
      case "budget-high": return b.budget_max - a.budget_max;
      case "budget-low": return a.budget_min - b.budget_min;
      case "proposals-low": return a.total_bids - b.total_bids;
      default: return 0;
    }
  });
  
  return result;
});

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredJobs.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));

const activeFilterCount = computed(() => {
  let count = 0;
  if (statusFilter.value !== "open") count++;
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

function getMatchScore(job: Job): number {
  let score = 80;
  if (job.status === "Open") score += 10;
  if (job.total_bids < 10) score += 5;
  if (job.is_remote) score += 5;
  return Math.min(score, 100);
}

function selectJob(job: Job) {
  selectedJob.value = job;
}

function clearFilters() {
  search.value = "";
  statusFilter.value = "open";
  experienceFilter.value = "all";
  remoteFilter.value = "all";
  minBudget.value = "";
  maxBudget.value = "";
}

async function loadData() {
  isLoading.value = true;
  try {
    const [jobsData, skillsData] = await Promise.all([
      getJobs({ status: "Open" }),
      getSkills(),
    ]);
    jobs.value = jobsData.data || jobsData;
    skills.value = skillsData;
    if (jobs.value.length > 0) {
      selectedJob.value = jobs.value[0];
    }
  } catch (e) {
    console.error("Failed to load jobs:", e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Compact Hero -->
    <div class="bg-gradient-to-br from-gray-50 via-blue-50/50 to-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <!-- Brand + Title -->
        <div class="text-center mb-5">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border shadow-sm mb-3">
            <img src="/logo.png" alt="BudeGlobal" class="h-6" />
            <span class="text-xs font-medium text-gray-600">Job Board</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream <span class="text-primary-600">Freelance</span> Opportunity
          </h1>
          <p class="text-sm text-gray-600 max-w-xl mx-auto">
            {{ filteredJobs.length }}+ active jobs from verified clients
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
            <Button class="px-6 rounded-lg text-sm">
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
            <p class="text-xl md:text-2xl font-bold text-gray-900">{{ jobs.length }}+</p>
            <p class="text-xs text-gray-500">Active Jobs</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">1,000+</p>
            <p class="text-xs text-gray-500">Freelancers</p>
          </div>
          <div>
            <p class="text-xl md:text-2xl font-bold text-gray-900">500+</p>
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
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Experience -->
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1.5 block">EXPERIENCE</label>
            <select v-model="experienceFilter" class="w-full text-sm bg-gray-50 border rounded-lg px-3 py-2">
              <option value="all">Any Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
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
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-600">{{ filteredJobs.length }} jobs found</p>
            <select v-model="sortBy" class="text-sm bg-gray-50 border rounded-lg px-3 py-1.5">
              <option value="newest">Newest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="proposals-low">Least Proposals</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 5" :key="i" class="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Job Cards -->
          <div v-else class="space-y-2">
            <div
              v-for="job in paginatedJobs"
              :key="job.name"
              @click="selectJob(job)"
              class="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
              :class="selectedJob?.name === job.name 
                ? 'bg-primary-50 border-2 border-primary-500 shadow-sm' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">{{ job.client_name?.charAt(0) || 'C' }}</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 truncate">{{ job.title }}</h4>
                    <p class="text-xs text-gray-500 truncate">{{ job.client_name }}</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge :variant="getMatchScore(job) >= 90 ? 'success' : 'info'" class="text-[10px] px-1.5 py-0">
                    {{ getMatchScore(job) }}% Match
                  </Badge>
                  <span class="text-[10px] text-gray-400">{{ getTimeAgo(job.creation) }}</span>
                </div>
              </div>

              <!-- Skills -->
              <div class="flex flex-wrap gap-1 mb-2">
                <span 
                  v-for="skill in (job.skills || []).slice(0, 3)" 
                  :key="skill.skill_name"
                  class="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-600"
                >
                  {{ skill.skill_name }}
                </span>
                <span v-if="(job.skills || []).length > 3" class="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-400">
                  +{{ job.skills.length - 3 }}
                </span>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-3 text-gray-600">
                  <span class="font-medium">₹{{ job.budget_min?.toLocaleString() }}-{{ job.budget_max?.toLocaleString() }}</span>
                  <span>{{ job.total_bids || 0 }} bids</span>
                </div>
                <button class="text-gray-400 hover:text-primary-600" @click.stop>🔖</button>
              </div>

              <!-- Urgent -->
              <div v-if="job.total_bids < 5" class="mt-2 pt-2 border-t border-gray-200">
                <span class="text-[10px] text-orange-600 font-medium">🔥 Low competition — apply now!</span>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        </div>

        <!-- Right: Job Detail -->
        <div class="hidden lg:block lg:col-span-3">
          <div v-if="selectedJob" class="bg-white border rounded-xl p-5 sticky top-20">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-lg font-bold text-gray-900 mb-1">{{ selectedJob.title }}</h2>
                <p class="text-sm text-gray-500">{{ selectedJob.client_name }}</p>
              </div>
              <Badge :variant="selectedJob.status === 'Open' ? 'success' : 'secondary'">
                {{ selectedJob.status }}
              </Badge>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">₹{{ selectedJob.budget_max?.toLocaleString() }}</p>
                <p class="text-xs text-gray-500">Budget</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">{{ selectedJob.total_bids || 0 }}</p>
                <p class="text-xs text-gray-500">Proposals</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">{{ selectedJob.duration || 'Flexible' }}</p>
                <p class="text-xs text-gray-500">Duration</p>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-5">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p class="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {{ selectedJob.description || 'No description provided.' }}
              </p>
            </div>

            <!-- Skills -->
            <div class="mb-5">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="skill in selectedJob.skills || []" :key="skill.skill_name" variant="secondary">
                  {{ skill.skill_name }}
                </Badge>
              </div>
            </div>

            <!-- Client Info -->
            <div class="p-3 bg-gray-50 rounded-lg mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary-600 font-bold">{{ selectedJob.client_name?.charAt(0) || 'C' }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedJob.client_name }}</p>
                  <p class="text-xs text-gray-500">Verified Client</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <RouterLink 
                :to="`/jobs/${selectedJob.name}`"
                class="flex-1 text-center py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                Apply Now
              </RouterLink>
              <button class="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
                🔖 Save
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-gray-50 rounded-xl p-10 text-center">
            <span class="text-4xl mb-3 block">👈</span>
            <p class="text-gray-500">Select a job to see details</p>
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
