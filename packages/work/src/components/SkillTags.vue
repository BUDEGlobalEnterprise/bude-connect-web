<script setup lang="ts">
defineProps<{
  skills: { skill_name: string; proficiency?: string }[];
}>();
</script>

<template>
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in skills"
        :key="skill.skill_name"
        class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
      >
        {{ skill.skill_name }}
        <span v-if="skill.proficiency" class="text-primary-400 ml-1"
          >({{ skill.proficiency }})</span
        >
      </span>
    </div>
  </div>
</template>
