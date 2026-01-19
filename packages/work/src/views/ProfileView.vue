<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getMyFreelancerProfile,
  updateFreelancerProfile,
  getSkills,
} from "@bude/shared/api";
import { useUserStore } from "@bude/shared";
import {
  Avatar,
  Badge,
  Button,
  LoadingSkeleton,
  ProfileCompletenessMeter,
} from "@bude/shared/components";
import type { Freelancer, Skill } from "@bude/shared/types";

const userStore = useUserStore();
const profile = ref<Freelancer | null>(null);
const allSkills = ref<Skill[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  hourly_rate: 0,
  bio: "",
  skills: [] as string[],
  portfolio_links: [] as { title: string; url: string }[],
});

const newSkill = ref("");
const newPortfolio = ref({ title: "", url: "" });

const profileStats = computed(() => [
  { label: "Jobs Done", value: profile.value?.completed_jobs || 0, icon: "✅" },
  { label: "Rating", value: profile.value?.rating?.toFixed(1) || "N/A", icon: "⭐" },
  { label: "Hourly Rate", value: `₹${form.value.hourly_rate}`, icon: "💰" },
]);

async function loadProfile() {
  isLoading.value = true;
  try {
    profile.value = await getMyFreelancerProfile();
    if (profile.value) {
      form.value = {
        hourly_rate: profile.value.hourly_rate,
        bio: profile.value.bio || "",
        skills: profile.value.skills.map((s) => s.skill_name),
        portfolio_links: profile.value.portfolio_links || [],
      };
    }
    allSkills.value = await getSkills();
  } catch (e) {
    console.error("Failed to load profile:", e);
  } finally {
    isLoading.value = false;
  }
}

function addSkill() {
  if (newSkill.value && !form.value.skills.includes(newSkill.value)) {
    form.value.skills.push(newSkill.value);
    newSkill.value = "";
  }
}

function removeSkill(skill: string) {
  form.value.skills = form.value.skills.filter((s) => s !== skill);
}

function addPortfolio() {
  if (newPortfolio.value.title && newPortfolio.value.url) {
    form.value.portfolio_links.push({ ...newPortfolio.value });
    newPortfolio.value = { title: "", url: "" };
  }
}

function removePortfolio(index: number) {
  form.value.portfolio_links.splice(index, 1);
}

async function handleSave() {
  isSaving.value = true;
  error.value = "";
  success.value = "";

  try {
    await updateFreelancerProfile({
      hourly_rate: form.value.hourly_rate,
      bio: form.value.bio,
      skills: form.value.skills.map((s) => ({ skill_name: s })),
      portfolio_links: form.value.portfolio_links,
    });
    success.value = "Profile updated successfully!";
    setTimeout(() => { success.value = ""; }, 3000);
  } catch (e: any) {
    error.value = e.message || "Failed to update profile";
  } finally {
    isSaving.value = false;
  }
}

const router = useRouter();

onMounted(loadProfile);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div class="max-w-4xl mx-auto px-4 py-10">
        <h1 class="text-3xl font-bold mb-2">👤 My Profile</h1>
        <p class="text-primary-100">Manage your freelancer profile and portfolio</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8 -mt-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="flex gap-6 mb-8">
          <div class="w-24 h-24 rounded-2xl bg-gray-200 skeleton"></div>
          <div class="flex-1 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-1/3 skeleton"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 skeleton"></div>
          </div>
        </div>
        <LoadingSkeleton variant="list" />
      </div>

      <!-- Profile Form -->
      <div v-else class="space-y-6">
        <!-- Profile Header Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {{ userStore.displayName.charAt(0).toUpperCase() }}
              </div>
              <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm">
                📷
              </button>
            </div>
            
            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ userStore.displayName }}</h2>
                <Badge v-if="profile?.is_verified_expert" variant="success" class="flex items-center gap-1">
                  ✓ Verified Expert
                </Badge>
              </div>
              <p class="text-gray-500 mb-4">{{ userStore.user?.email }}</p>
              
              <!-- Stats -->
              <div class="flex gap-6">
                <div v-for="stat in profileStats" :key="stat.label" class="text-center">
                  <p class="text-xl font-bold text-gray-900">{{ stat.icon }} {{ stat.value }}</p>
                  <p class="text-xs text-gray-500">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Completeness -->
        <ProfileCompletenessMeter :user="userStore.user" @navigate="router.push($event)" />

        <!-- Edit Form -->
        <form @submit.prevent="handleSave" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            ✏️ Edit Profile
          </h3>
          
          <!-- Hourly Rate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
            <input
              v-model.number="form.hourly_rate"
              type="number"
              min="0"
              step="50"
              class="input text-lg"
              placeholder="500"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio / About Me</label>
            <textarea
              v-model="form.bio"
              rows="4"
              class="input"
              placeholder="Tell clients about your experience, expertise, and what makes you unique..."
            ></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ form.bio.length }}/500 characters</p>
          </div>

          <!-- Skills -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div class="flex gap-2 mb-3">
              <select v-model="newSkill" class="input flex-1">
                <option value="">Select a skill to add</option>
                <option
                  v-for="skill in allSkills"
                  :key="skill.skill_name"
                  :value="skill.skill_name"
                  :disabled="form.skills.includes(skill.skill_name)"
                >
                  {{ skill.skill_name }}
                </option>
              </select>
              <Button type="button" variant="secondary" @click="addSkill" :disabled="!newSkill">
                + Add
              </Button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in form.skills"
                :key="skill"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(skill)"
                  class="w-4 h-4 rounded-full bg-primary-200 hover:bg-primary-300 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </span>
              <span v-if="form.skills.length === 0" class="text-gray-400 text-sm">No skills added yet</span>
            </div>
          </div>

          <!-- Portfolio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Portfolio Links</label>
            <div class="flex gap-2 mb-3">
              <input
                v-model="newPortfolio.title"
                type="text"
                placeholder="Project title"
                class="input flex-1"
              />
              <input
                v-model="newPortfolio.url"
                type="url"
                placeholder="https://..."
                class="input flex-1"
              />
              <Button type="button" variant="secondary" @click="addPortfolio" :disabled="!newPortfolio.title || !newPortfolio.url">
                + Add
              </Button>
            </div>
            <div v-if="form.portfolio_links.length" class="space-y-2">
              <div
                v-for="(link, index) in form.portfolio_links"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <a
                  :href="link.url"
                  target="_blank"
                  class="text-primary-600 hover:underline font-medium flex items-center gap-2"
                >
                  🔗 {{ link.title }}
                </a>
                <button
                  type="button"
                  @click="removePortfolio(index)"
                  class="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <p v-else class="text-gray-400 text-sm">No portfolio links added yet</p>
          </div>

          <!-- Messages -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {{ error }}
          </div>
          <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✅ {{ success }}
          </div>

          <!-- Submit -->
          <Button type="submit" :loading="isSaving" full-width size="lg">
            💾 Save Changes
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>
