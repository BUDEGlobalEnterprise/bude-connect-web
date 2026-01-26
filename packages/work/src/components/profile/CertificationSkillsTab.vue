<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  ComboboxMultiSelect,
  SkillSelector, 
  FileUploadZone
} from '@bude/shared';
import { Input, Label } from '@bude/shared/components/ui';
import { skillCategories, certifications } from '@bude/shared/data/profile-presets';

interface SelectedSkill {
  name: string;
  category: string;
}

interface Certification {
  certificationName: string;
  organization: string;
  issueDate: string;
}

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || { certifications: [], skills: [], certificateFiles: [] },
  set: (val) => emit('update:modelValue', val)
});

const getSkillsFromData = (skills: any): SelectedSkill[] => {
  if (!Array.isArray(skills)) return [];
  return skills.map((skill: any) => ({ 
    name: typeof skill === 'string' ? skill : skill.name, 
    category: skill.category || 'Technical' 
  }));
};

const selectedSkills = ref<SelectedSkill[]>(getSkillsFromData(formData.value.skills));

// Sync local state when external data changes
watch(() => formData.value.skills, (newSkills: any) => {
  const currentSkillNames = selectedSkills.value.map((s: SelectedSkill) => s.name);
  const newSkillNames = Array.isArray(newSkills) 
    ? newSkills.map(s => typeof s === 'string' ? s : s.name)
    : [];
  
  if (JSON.stringify(currentSkillNames) !== JSON.stringify(newSkillNames)) {
    selectedSkills.value = getSkillsFromData(newSkills);
  }
}, { deep: true });

const selectedCertifications = ref<string[]>(
  Array.isArray(formData.value.certifications)
    ? formData.value.certifications.map((c: Certification) => c.certificationName)
    : []
);

const certificateFiles = ref<File[]>([]);

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Skills Section (Read-only from HRMS) -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Skills</h3>
        <p class="text-sm text-muted-foreground">
          Managed in HR Portal (Read-only)
        </p>
      </div>

      <div class="relative opacity-90 pointer-events-none grayscale-[0.2]">
        <SkillSelector
          :categories="skillCategories"
          v-model="selectedSkills"
          readonly
        />
        <div class="absolute inset-0 bg-background/5 flex items-center justify-center">
            <div class="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-4 py-2 rounded-md shadow-sm pointer-events-auto">
                Skills are managed in HR Portal
            </div>
        </div>
      </div>
    </div>

    <!-- Certifications (Read-only from Academy) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">Certifications</h3>
          <p class="text-sm text-muted-foreground">
            Managed in Academy/LMS (Read-only)
          </p>
        </div>
        <div class="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-md">
          Internal Records Only
        </div>
      </div>

      <!-- Quick Select (Disabled) -->
      <div class="opacity-60 pointer-events-none">
        <ComboboxMultiSelect
          :options="certifications"
          v-model="selectedCertifications"
          placeholder="Managed in Academy"
          disabled
        />
      </div>

      <!-- Detailed Certification Entries -->
      <div v-if="formData.certifications?.length" class="space-y-3">
        <div 
          v-for="(cert, index) in formData.certifications" 
          :key="index" 
          class="border rounded-lg p-4 bg-muted/30"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <Label class="text-xs text-muted-foreground">Certification</Label>
              <div class="text-sm font-medium">{{ cert.certificationName }}</div>
            </div>

            <div class="space-y-1">
              <Label class="text-xs text-muted-foreground">Issuing Organization</Label>
              <div class="text-sm font-medium">{{ cert.organization }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Upload -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Certificate Documents</h3>
        <p class="text-sm text-muted-foreground">
          Upload certificates for manual verification (optional)
        </p>
      </div>

      <FileUploadZone
        v-model="certificateFiles"
        accept=".pdf,image/*"
        :max-size="10 * 1024 * 1024"
        :multiple="true"
        @update:model-value="updateField('certificateFiles', certificateFiles)"
      />
    </div>
  </div>
</template>
