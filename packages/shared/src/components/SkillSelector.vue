<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label :for="id">{{ label }}</Label>
      <span class="text-sm text-muted-foreground">{{ categorySkills.length }} selected</span>
    </div>
    
    <div class="space-y-4">
      <div
        v-for="(category, catIndex) in categories"
        :key="catIndex"
        class="space-y-2"
      >
        <h4 class="text-sm font-medium flex items-center gap-2">
          <component v-if="category.icon" :is="category.icon" class="h-4 w-4" />
          {{ category.name }}
        </h4>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <label
            v-for="skill in category.skills"
            :key="skill"
            class="flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors hover:bg-accent"
            :class="isSelected(skill) && 'bg-primary/10 border-primary'"
          >
            <input
              type="checkbox"
              :checked="isSelected(skill)"
              @change="toggleSkill(skill, category.name)"
              class="rounded"
            />
            <span class="text-sm">{{ skill }}</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Selected Skills Summary -->
    <div v-if="categorySkills.length > 0" class="flex flex-wrap gap-2 pt-2 border-t">
      <Badge
        v-for="(skill, index) in categorySkills"
        :key="index"
        variant="secondary"
        class="gap-1"
      >
        {{ skill.name }}
        <button
          @click="removeSkill(skill)"
          class="hover:bg-destructive/20 rounded-full p-0.5"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface SkillCategory {
  name: string;
  skills: string[];
  icon?: Component;
}

export interface SelectedSkill {
  name: string;
  category: string;
}

interface Props {
  categories: SkillCategory[];
  modelValue?: SelectedSkill[];
  label?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: 'Select Skills',
  id: 'skill-selector'
});

const emit = defineEmits<{
  'update:modelValue': [skills: SelectedSkill[]];
}>();

const categorySkills = ref<SelectedSkill[]>([...props.modelValue]);

const isSelected = (skillName: string) => {
  return categorySkills.value.some(s => s.name === skillName);
};

const toggleSkill = (skillName: string, categoryName: string) => {
  const index = categorySkills.value.findIndex(s => s.name === skillName);
  
  if (index > -1) {
    categorySkills.value.splice(index, 1);
  } else {
    categorySkills.value.push({ name: skillName, category: categoryName });
  }
  
  emit('update:modelValue', categorySkills.value);
};

const removeSkill = (skill: SelectedSkill) => {
  const index = categorySkills.value.findIndex(s => s.name === skill.name);
  if (index > -1) {
    categorySkills.value.splice(index, 1);
    emit('update:modelValue', categorySkills.value);
  }
};
</script>
