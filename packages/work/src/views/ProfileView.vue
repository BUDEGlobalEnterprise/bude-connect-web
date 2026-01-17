<script setup lang="ts">
import { ref, onMounted } from "vue";
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
  } catch (e: any) {
    error.value = e.message || "Failed to update profile";
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Freelancer Profile</h1>

    <div v-if="isLoading" class="card p-6">
      <LoadingSkeleton variant="text" />
      <LoadingSkeleton variant="text" />
    </div>

    <div v-else class="card p-6">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="flex items-center gap-4 mb-6">
          <Avatar
            :name="userStore.displayName"
            size="xl"
            :verified="profile?.is_verified_expert"
          />
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ userStore.displayName }}
            </h2>
            <Badge v-if="profile?.is_verified_expert" variant="success"
              >Verified Expert</Badge
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Hourly Rate (₹)</label
          >
          <input
            v-model.number="form.hourly_rate"
            type="number"
            min="0"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Bio</label
          >
          <textarea
            v-model="form.bio"
            rows="4"
            class="input"
            placeholder="Tell clients about yourself..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Skills</label
          >
          <div class="flex gap-2 mb-2">
            <select v-model="newSkill" class="input flex-1">
              <option value="">Select a skill</option>
              <option
                v-for="skill in allSkills"
                :key="skill.skill_name"
                :value="skill.skill_name"
              >
                {{ skill.skill_name }}
              </option>
            </select>
            <Button type="button" variant="secondary" @click="addSkill"
              >Add</Button
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="skill in form.skills"
              :key="skill"
              variant="info"
              class="flex items-center gap-1"
            >
              {{ skill }}
              <button
                type="button"
                @click="removeSkill(skill)"
                class="text-primary-400 hover:text-primary-600 ml-1"
              >
                ×
              </button>
            </Badge>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Portfolio Links</label
          >
          <div class="flex gap-2 mb-2">
            <input
              v-model="newPortfolio.title"
              type="text"
              placeholder="Title"
              class="input flex-1"
            />
            <input
              v-model="newPortfolio.url"
              type="url"
              placeholder="URL"
              class="input flex-1"
            />
            <Button type="button" variant="secondary" @click="addPortfolio"
              >Add</Button
            >
          </div>
          <ul class="space-y-2">
            <li
              v-for="(link, index) in form.portfolio_links"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <a
                :href="link.url"
                target="_blank"
                class="text-primary-600 hover:underline"
                >{{ link.title }}</a
              >
              <button
                type="button"
                @click="removePortfolio(index)"
                class="text-red-600 text-sm"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>

        <Button type="submit" :loading="isSaving" full-width
          >Save Profile</Button
        >
      </form>
    </div>
  </div>
</template>
