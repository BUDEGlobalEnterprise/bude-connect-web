<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  ComboboxMultiSelect,
  SkillSelector, 
  FileUploadZone,
  type SelectedSkill 
} from '@bude/shared';
import { Button, Label } from '@bude/shared/components/ui';
import { Plus, Trash2 } from 'lucide-vue-next';
import { skillCategories, certifications } from '@bude/shared/data/profile-presets';

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

const selectedSkills = ref<SelectedSkill[]>(
  formData.value.skills?.map((skill: string) => ({ 
    name: skill, 
    category: 'Other' 
  })) || []
);

const selectedCertifications = ref<string[]>(
  formData.value.certifications?.map((c: Certification) => c.certificationName) || []
);

const certificateFiles = ref<File[]>([]);

const addCertification = () => {
  const certifs = [...(formData.value.certifications || [])];
  certifs.push({
    certificationName: '',
    organization: '',
    issueDate: ''
  });
  emit('update:modelValue', { ...formData.value, certifications: certifs });
};

const removeCertification = (index: number) => {
  const certifs = [...(formData.value.certifications || [])];
  certifs.splice(index, 1);
  emit('update:modelValue', { ...formData.value, certifications: certifs });
};

const updateCertification = (index: number, field: string, value: any) => {
  const certifs = [...(formData.value.certifications || [])];
  certifs[index] = { ...certifs[index], [field]: value };
  emit('update:modelValue', { ...formData.value, certifications: certifs });
};

const updateSkills = (skills: SelectedSkill[]) => {
  selectedSkills.value = skills;
  // Convert to array of skill names for backend
  const skillNames = skills.map(s => s.name);
  emit('update:modelValue', { 
    ...formData.value, 
    skills: skillNames,
    skillsWithCategory: skills 
  });
};

const updateCertificationList = (certNames: string[]) => {
  selectedCertifications.value = certNames;
  // If user selects from preset list, auto-fill organization
  const certifs = certNames.map(name => {
    const existing = formData.value.certifications?.find((c: Certification) => c.certificationName === name);
    if (existing) return existing;
    
    // Auto-fill organization based on cert name
    let org = '';
    if (name.includes('AWS')) org = 'Amazon Web Services';
    else if (name.includes('Google')) org = 'Google Cloud';
    else if (name.includes('Azure')) org = 'Microsoft';
    else if (name.includes('Kubernetes')) org = 'Cloud Native Computing Foundation';
    
    return {
      certificationName: name,
      organization: org,
      issueDate: ''
    };
  });
  
  emit('update:modelValue', { ...formData.value, certifications: certifs });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Skills Section with Visual Selector -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Skills</h3>
        <p class="text-sm text-muted-foreground">
          Select your technical skills from categories below. You can select multiple skills from each category.
        </p>
      </div>

      <SkillSelector
        :categories="skillCategories"
        v-model="selectedSkills"
        @update:model-value="updateSkills"
      />
      
      <div v-if="selectedSkills.length > 0" class="pt-4 border-t">
        <p class="text-sm font-medium mb-2">Selected Skills ({{ selectedSkills.length }})</p>
        <div class="text-xs text-muted-foreground">
          Skills will be visible on your profile and help match you with relevant projects.
        </div>
      </div>
    </div>

    <!-- Certifications with Quick Select -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Certifications</h3>
        <p class="text-sm text-muted-foreground">
          Select from common certifications or add your own
        </p>
      </div>

      <!-- Quick Select from Common Certifications -->
      <ComboboxMultiSelect
        :options="certifications"
        v-model="selectedCertifications"
        @update:model-value="updateCertificationList"
        placeholder="Select certifications..."
      />

      <!-- Detailed Certification Entries -->
      <div v-if="formData.certifications?.length" class="space-y-3">
        <div class="flex items-center justify-between">
          <Label class="font-medium">Certification Details</Label>
          <Button type="button" @click="addCertification" size="sm" variant="outline">
            <Plus class="h-4 w-4 mr-2" />
            Add Custom
          </Button>
        </div>

        <div 
          v-for="(cert, index) in formData.certifications" 
          :key="index" 
          class="border rounded-lg p-4 space-y-3 relative bg-card"
        >
          <button
            type="button"
            @click="removeCertification(index)"
            class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
          >
            <Trash2 class="h-4 w-4" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
            <div class="space-y-2">
              <Label :for="`cert-name-${index}`">Certification *</Label>
              <ComboboxMultiSelect
                :options="certifications"
                :model-value="[cert.certificationName]"
                @update:model-value="(val) => updateCertification(index, 'certificationName', val[0])"
                placeholder="Select or type..."
              />
            </div>

            <div class="space-y-2">
              <Label :for="`cert-org-${index}`">Issuing Organization *</Label>
              <input
                :id="`cert-org-${index}`"
                type="text"
                :value="cert.organization"
                @input="updateCertification(index, 'organization', ($event.target as HTMLInputElement).value)"
                placeholder="e.g., Amazon Web Services"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div class="space-y-2">
              <Label :for="`cert-date-${index}`">Issue Date *</Label>
              <input
                :id="`cert-date-${index}`"
                type="month"
                :value="cert.issueDate"
                @input="updateCertification(index, 'issueDate', ($event.target as HTMLInputElement).value)"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          Upload scanned copies or PDFs of your certificates (optional)
        </p>
      </div>

      <FileUploadZone
        v-model="certificateFiles"
        accept=".pdf,image/*"
        :max-size="10 * 1024 * 1024"
        :multiple="true"
      />
    </div>
  </div>
</template>
