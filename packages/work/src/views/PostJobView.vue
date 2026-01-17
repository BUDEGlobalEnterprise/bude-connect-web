<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postJob, getSkills } from "@bude/shared/api";
import type { Skill } from "@bude/shared/types";

const router = useRouter();
const skills = ref<Skill[]>([]);
const isLoading = ref(false);
const error = ref("");

const form = ref({
  title: "",
  description: "",
  budget_range: "",
  skills_required: [] as string[],
  deadline: "",
});

const skillInput = ref("");

async function loadSkills() {
  try {
    skills.value = await getSkills();
  } catch (e) {
    console.error("Failed to load skills:", e);
  }
}

function addSkill() {
  if (
    skillInput.value &&
    !form.value.skills_required.includes(skillInput.value)
  ) {
    form.value.skills_required.push(skillInput.value);
    skillInput.value = "";
  }
}

function removeSkill(skill: string) {
  form.value.skills_required = form.value.skills_required.filter(
    (s) => s !== skill,
  );
}

async function handleSubmit() {
  if (
    !form.value.title ||
    !form.value.description ||
    !form.value.budget_range
  ) {
    error.value = "Please fill in all required fields";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    await postJob({
      title: form.value.title,
      description: form.value.description,
      budget_range: form.value.budget_range,
      skills_required: form.value.skills_required,
      deadline: form.value.deadline || undefined,
    });
    router.push("/my-jobs");
  } catch (e: any) {
    error.value = e.message || "Failed to post job";
  } finally {
    isLoading.value = false;
  }
}

loadSkills();
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>

    <div class="card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="e.g., Build a React Dashboard"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Describe the project in detail..."
            class="input"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Budget Range *
          </label>
          <input
            v-model="form.budget_range"
            type="text"
            placeholder="e.g., ₹10,000 - ₹20,000"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          <div class="flex gap-2 mb-2">
            <select v-model="skillInput" class="input flex-1">
              <option value="">Select a skill</option>
              <option
                v-for="skill in skills"
                :key="skill.skill_name"
                :value="skill.skill_name"
              >
                {{ skill.skill_name }}
              </option>
            </select>
            <button type="button" @click="addSkill" class="btn btn-secondary">
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in form.skills_required"
              :key="skill"
              class="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
            >
              {{ skill }}
              <button
                type="button"
                @click="removeSkill(skill)"
                class="text-primary-400 hover:text-primary-600"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Deadline (optional)
          </label>
          <input v-model="form.deadline" type="date" class="input" />
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full btn btn-primary py-3"
        >
          {{ isLoading ? "Posting..." : "Post Job" }}
        </button>
      </form>
    </div>
  </div>
</template>
