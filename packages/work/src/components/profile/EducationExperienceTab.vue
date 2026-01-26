<script setup lang="ts">
import { computed } from 'vue';
import { Label, Textarea, Input } from '@bude/shared/components/ui';
import { Briefcase, GraduationCap } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || { education: [], workExperience: [] },
  set: (val) => emit('update:modelValue', val)
});
</script>

<template>
  <div class="space-y-8">
    <!-- Education Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <GraduationCap class="h-5 w-5" />
            Education
          </h3>
          <p class="text-sm text-muted-foreground mt-1">
            Verified educational background
          </p>
        </div>
        <div class="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-md">
          Managed in HR Portal (Read-only)
        </div>
      </div>

      <div v-if="!Array.isArray(formData.education) || !formData.education.length" class="text-sm text-muted-foreground italic border rounded-lg p-8 text-center">
        No verified education entries found in HR records.
      </div>

      <div v-for="(edu, index) in (Array.isArray(formData.education) ? formData.education : [])" :key="index" class="border rounded-lg p-4 space-y-4 bg-muted/30">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Institution / University</Label>
            <div class="text-sm font-medium">{{ edu.institution }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Degree Type</Label>
              <div class="text-sm font-medium">{{ edu.degree }}</div>
            </div>

            <div class="space-y-2">
              <Label>Field of Study</Label>
              <div class="text-sm font-medium">{{ edu.fieldOfStudy || edu.field }}</div>
            </div>

            <div class="space-y-2">
              <Label>End Date / Year of Passing</Label>
              <div class="text-sm font-medium">{{ edu.endDate }}</div>
            </div>

            <div class="space-y-2">
              <Label>Location</Label>
              <Input
                :model-value="edu.location"
                disabled
                placeholder="N/A"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Work Experience Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <Briefcase class="h-5 w-5" />
            Work Experience
          </h3>
          <p class="text-sm text-muted-foreground mt-1">
            Verified professional experience
          </p>
        </div>
        <div class="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-md">
          Managed in HR Portal (Read-only)
        </div>
      </div>

      <div v-if="!Array.isArray(formData.workExperience) || !formData.workExperience.length" class="text-sm text-muted-foreground italic border rounded-lg p-8 text-center">
        No verified work experience found in HR records.
      </div>

      <div v-for="(work, index) in (Array.isArray(formData.workExperience) ? formData.workExperience : [])" :key="index" class="border rounded-lg p-4 space-y-4 bg-muted/30">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Company</Label>
            <div class="text-sm font-medium">{{ work.company }}</div>
          </div>

          <div class="space-y-2">
            <Label>Job Title</Label>
            <div class="text-sm font-medium">{{ work.title }}</div>
          </div>

          <div class="space-y-2">
            <Label>Description / Verification Note</Label>
            <Textarea
              :model-value="work.description"
              disabled
              :rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
