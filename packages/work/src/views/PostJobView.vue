<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { postJob, getSkills } from "@bude/shared/api";
import { Button, Badge } from "@bude/shared/components";
import type { Skill } from "@bude/shared/types";

const router = useRouter();
const skills = ref<Skill[]>([]);
const isLoading = ref(false);
const error = ref("");
const skillInput = ref("");

const form = ref({
  title: "",
  description: "",
  budget_range: "",
  skills_required: [] as string[],
  deadline: "",
});

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

onMounted(loadSkills);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>

    <div class="card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Job Title *</label
          >
          <input
            v-model="form.title"
            type="text"
            placeholder="e.g., Build a React Dashboard"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description *</label
          >
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Describe the project in detail..."
            class="input"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Budget Range *</label
          >
          <input
            v-model="form.budget_range"
            type="text"
            placeholder="e.g., ₹10,000 - ₹20,000"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Required Skills</label
          >
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
            <Button type="button" variant="secondary" @click="addSkill"
              >Add</Button
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="skill in form.skills_required"
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
            >Deadline (optional)</label
          >
          <input v-model="form.deadline" type="date" class="input" />
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <Button type="submit" :loading="isLoading" full-width>Post Job</Button>
      </form>
    </div>
  </div>
</template>
