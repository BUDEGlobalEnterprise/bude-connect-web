<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  SkillSelector, 
  FileUploadZone
} from '@bude/shared';
import { Input, Label, Button } from '@bude/shared/components/ui';
import { Plus, Trash2 } from 'lucide-vue-next';
import { skillCategories } from '@bude/shared/data/profile-presets';

interface SelectedSkill {
  name: string;
  category: string;
}

// Certification interface was unused, removed to clear lints

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
    name: typeof skill === 'string' ? skill : (skill.name || skill.skill_name), 
    category: skill.category || 'Technical' 
  }));
};

const selectedSkills = ref<SelectedSkill[]>(getSkillsFromData(formData.value.skills));

watch(() => formData.value.skills, (newSkills: any) => {
  const currentSkillNames = selectedSkills.value.map((s: SelectedSkill) => s.name);
  const newSkillNames = Array.isArray(newSkills) 
    ? newSkills.map(s => typeof s === 'string' ? s : (s.name || s.skill_name))
    : [];
  
  if (JSON.stringify(currentSkillNames) !== JSON.stringify(newSkillNames)) {
    selectedSkills.value = getSkillsFromData(newSkills);
  }
}, { deep: true });

const certificateFiles = ref<File[]>([]);

const addCertification = () => {
  const certifs = [...(formData.value.certifications || [])];
  certifs.push({
    certificationName: '',
    organization: '',
    issueDate: ''
  });
  updateField('certifications', certifs);
};

const removeCertification = (index: number) => {
  const certifs = [...(formData.value.certifications || [])];
  certifs.splice(index, 1);
  updateField('certifications', certifs);
};

const updateCertification = (index: number, field: string, value: any) => {
  const certifs = [...(formData.value.certifications || [])];
  certifs[index] = { ...certifs[index], [field]: value };
  updateField('certifications', certifs);
};

const updateSkills = (skills: SelectedSkill[]) => {
  selectedSkills.value = skills;
  updateField('skills', skills);
};

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Skills -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Skills</h3>
        <p class="text-sm text-muted-foreground">
          Select your technical skills (Syncs to HR Portal)
        </p>
      </div>

      <SkillSelector
        :categories="skillCategories"
        v-model="selectedSkills"
        @update:model-value="updateSkills"
      />
    </div>

    <!-- Certifications -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">Certifications</h3>
          <p class="text-sm text-muted-foreground">
            Add certifications (Syncs to Academy)
          </p>
        </div>
        <Button type="button" @click="addCertification" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <div v-if="formData.certifications?.length" class="space-y-3">
        <div 
          v-for="(cert, index) in formData.certifications" 
          :key="index" 
          class="border rounded-lg p-4 space-y-3 relative bg-card"
        >
          <button
            type="button"
            @click="removeCertification(index as number)"
            class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
          >
            <Trash2 class="h-4 w-4" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
            <div class="space-y-2">
              <Label>Certification</Label>
              <Input
                :model-value="cert.certificationName"
                @update:model-value="(val) => updateCertification(index as number, 'certificationName', val)"
                placeholder="Certification Name"
              />
            </div>

            <div class="space-y-2">
              <Label>Issuing Organization</Label>
              <Input
                :model-value="cert.organization"
                @update:model-value="(val) => updateCertification(index as number, 'organization', val)"
                placeholder="e.g., AWS, Google"
              />
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
          Upload certificates for verification.
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
