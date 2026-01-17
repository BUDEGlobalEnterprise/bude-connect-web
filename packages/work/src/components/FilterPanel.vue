<script setup lang="ts">
import type { Skill } from "@bude/shared/types";

defineProps<{
  search: string;
  skill: string;
  maxRate?: number;
  verifiedOnly: boolean;
  skills: Skill[];
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  "update:skill": [value: string];
  "update:maxRate": [value: number | undefined];
  "update:verifiedOnly": [value: boolean];
  filter: [];
}>();
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="grid md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Search</label
        >
        <input
          :value="search"
          @input="
            emit('update:search', ($event.target as HTMLInputElement).value);
            emit('filter');
          "
          type="text"
          placeholder="Name or keyword..."
          class="input"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Skill</label
        >
        <select
          :value="skill"
          @change="
            emit('update:skill', ($event.target as HTMLSelectElement).value);
            emit('filter');
          "
          class="input"
        >
          <option value="">All Skills</option>
          <option v-for="s in skills" :key="s.skill_name" :value="s.skill_name">
            {{ s.skill_name }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Max Hourly Rate</label
        >
        <input
          :value="maxRate"
          @input="
            emit(
              'update:maxRate',
              Number(($event.target as HTMLInputElement).value) || undefined,
            );
            emit('filter');
          "
          type="number"
          placeholder="₹/hour"
          class="input"
        />
      </div>
      <div class="flex items-end">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="verifiedOnly"
            @change="
              emit(
                'update:verifiedOnly',
                ($event.target as HTMLInputElement).checked,
              );
              emit('filter');
            "
            class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="font-medium text-gray-700">Verified Only</span>
        </label>
      </div>
    </div>
  </div>
</template>
