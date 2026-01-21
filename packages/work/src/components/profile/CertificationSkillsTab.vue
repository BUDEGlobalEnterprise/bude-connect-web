<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, Label, Textarea } from '@bude/shared/components/ui';
import { Plus, Trash2 } from 'lucide-vue-next';

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
  get: () => props.modelValue || { certifications: [], skills: '' },
  set: (val) => emit('update:modelValue', val)
});

const addCertification = () => {
  const certifications = [...(formData.value.certifications || [])];
  certifications.push({
    certificationName: '',
    organization: '',
    issueDate: ''
  });
  emit('update:modelValue', { ...formData.value, certifications });
};

const removeCertification = (index: number) => {
  const certifications = [...(formData.value.certifications || [])];
  certifications.splice(index, 1);
  emit('update:modelValue', { ...formData.value, certifications });
};

const updateCertification = (index: number, field: string, value: any) => {
  const certifications = [...(formData.value.certifications || [])];
  certifications[index] = { ...certifications[index], [field]: value };
  emit('update:modelValue', { ...formData.value, certifications });
};

const updateSkills = (value: string) => {
  emit('update:modelValue', { ...formData.value, skills: value });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Certification Details -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Certification Details</h3>
        <Button type="button" @click="addCertification" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <div v-if="!formData.certifications?.length" class="text-sm text-muted-foreground italic">
        No certifications yet. Click "Add Certification" to get started.
      </div>

      <div v-for="(cert, index) in formData.certifications" :key="index" class="border rounded-lg p-4 space-y-3 relative">
        <button
          type="button"
          @click="removeCertification(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive"
        >
          <Trash2 class="h-4 w-4" />
        </button>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="space-y-2">
            <Label :for="`cert-name-${index}`">Certification Name *</Label>
            <Input
              :id="`cert-name-${index}`"
              :model-value="cert.certificationName"
              @update:model-value="updateCertification(index, 'certificationName', $event)"
              placeholder="AWS Certified Solutions Architect"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`cert-org-${index}`">Organization *</Label>
            <Input
              :id="`cert-org-${index}`"
              :model-value="cert.organization"
              @update:model-value="updateCertification(index, 'organization', $event)"
              placeholder="Amazon Web Services"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`cert-date-${index}`">Issue Date *</Label>
            <Input
              :id="`cert-date-${index}`"
              type="month"
              :model-value="cert.issueDate"
              @update:model-value="updateCertification(index, 'issueDate', $event)"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Details -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Skill Details</h3>
        <p class="text-sm text-muted-foreground">List your skills, separated by commas or newlines</p>
      </div>

      <div class="space-y-2">
        <Label for="skills">Skills</Label>
        <Textarea
          id="skills"
          :model-value="formData.skills"
          @update:model-value="updateSkills"
          :rows="8"
          placeholder="JavaScript, TypeScript, React, Vue.js, Node.js, Python, Django, SQL, MongoDB, AWS, Docker, Git..."
          class="font-mono text-sm"
        />
        <p class="text-xs text-muted-foreground">
          {{ formData.skills?.length || 0 }} characters
        </p>
      </div>
    </div>
  </div>
</template>
