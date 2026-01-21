<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, Label } from '@bude/shared/components/ui';
import { Plus, Trash2 } from 'lucide-vue-next';

interface EducationEntry {
  institution: string;
  location: string;
  degreeType: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface WorkEntry {
  title: string;
  company: string;
  location: string;
  isCurrent: boolean;
  fromDate: string;
  toDate: string;
}

interface VolunteerEntry {
  title: string;
  company: string;
  location: string;
  isCurrent: boolean;
  fromDate: string;
  toDate: string;
}

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || { education: [], workExperience: [], volunteerExperience: [] },
  set: (val) => emit('update:modelValue', val)
});

const addEducation = () => {
  const education = [...(formData.value.education || [])];
  education.push({
    institution: '',
    location: '',
    degreeType: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });
  emit('update:modelValue', { ...formData.value, education });
};

const removeEducation = (index: number) => {
  const education = [...(formData.value.education || [])];
  education.splice(index, 1);
  emit('update:modelValue', { ...formData.value, education });
};

const addWork = () => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience.push({
    title: '',
    company: '',
    location: '',
    isCurrent: false,
    fromDate: '',
    toDate: ''
  });
  emit('update:modelValue', { ...formData.value, workExperience });
};

const removeWork = (index: number) => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience.splice(index, 1);
  emit('update:modelValue', { ...formData.value, workExperience });
};

const addVolunteer = () => {
  const volunteerExperience = [...(formData.value.volunteerExperience || [])];
  volunteerExperience.push({
    title: '',
    company: '',
    location: '',
    isCurrent: false,
    fromDate: '',
    toDate: ''
  });
  emit('update:modelValue', { ...formData.value, volunteerExperience });
};

const removeVolunteer = (index: number) => {
  const volunteerExperience = [...(formData.value.volunteerExperience || [])];
  volunteerExperience.splice(index, 1);
  emit('update:modelValue', { ...formData.value, volunteerExperience });
};

const updateEducation = (index: number, field: string, value: any) => {
  const education = [...(formData.value.education || [])];
  education[index] = { ...education[index], [field]: value };
  emit('update:modelValue', { ...formData.value, education });
};

const updateWork = (index: number, field: string, value: any) => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience[index] = { ...workExperience[index], [field]: value };
  emit('update:modelValue', { ...formData.value, workExperience });
};

const updateVolunteer = (index: number, field: string, value: any) => {
  const volunteerExperience = [...(formData.value.volunteerExperience || [])];
  volunteerExperience[index] = { ...volunteerExperience[index], [field]: value };
  emit('update:modelValue', { ...formData.value, volunteerExperience });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Education Details -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Education Details</h3>
        <Button type="button" @click="addEducation" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div v-if="!formData.education?.length" class="text-sm text-muted-foreground italic">
        No education entries yet. Click "Add Education" to get started.
      </div>

      <div v-for="(edu, index) in formData.education" :key="index" class="border rounded-lg p-4 space-y-3 relative">
        <button
          type="button"
          @click="removeEducation(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive"
        >
          <Trash2 class="h-4 w-4" />
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label :for="`edu-institution-${index}`">Institution Name *</Label>
            <Input
              :id="`edu-institution-${index}`"
              :model-value="edu.institution"
              @update:model-value="updateEducation(index, 'institution', $event)"
              placeholder="University Name"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`edu-location-${index}`">Location *</Label>
            <Input
              :id="`edu-location-${index}`"
              :model-value="edu.location"
              @update:model-value="updateEducation(index, 'location', $event)"
              placeholder="City, Country"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`edu-degree-${index}`">Degree Type *</Label>
            <Input
              :id="`edu-degree-${index}`"
              :model-value="edu.degreeType"
              @update:model-value="updateEducation(index, 'degreeType', $event)"
              placeholder="Bachelor's, Master's, etc."
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`edu-field-${index}`">Field of Major/Study*</Label>
            <Input
              :id="`edu-field-${index}`"
              :model-value="edu.fieldOfStudy"
              @update:model-value="updateEducation(index, 'fieldOfStudy', $event)"
              placeholder="Computer Science"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Work Experience Details -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Work Experience Details</h3>
        <Button type="button" @click="addWork" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      </div>

      <div v-if="!formData.workExperience?.length" class="text-sm text-muted-foreground italic">
        No work experience entries yet.
      </div>

      <div v-for="(work, index) in formData.workExperience" :key="index" class="border rounded-lg p-4 space-y-3 relative">
        <button
          type="button"
          @click="removeWork(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive"
        >
          <Trash2 class="h-4 w-4"  />
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label :for="`work-title-${index}`">Title *</Label>
            <Input
              :id="`work-title-${index}`"
              :model-value="work.title"
              @update:model-value="updateWork(index, 'title', $event)"
              placeholder="Software Engineer"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`work-company-${index}`">Company *</Label>
            <Input
              :id="`work-company-${index}`"
              :model-value="work.company"
              @update:model-value="updateWork(index, 'company', $event)"
              placeholder="Company Name"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`work-location-${index}`">Location *</Label>
            <Input
              :id="`work-location-${index}`"
              :model-value="work.location"
              @update:model-value="updateWork(index, 'location', $event)"
              placeholder="City, Country"
            />
          </div>

          <div class="flex items-center space-x-2 pt-7">
            <input
              type="checkbox"
              :id="`work-current-${index}`"
              :checked="work.isCurrent"
              @change="updateWork(index, 'isCurrent', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300"
            />
            <Label :for="`work-current-${index}`" class="cursor-pointer">I am currently working here</Label>
          </div>

          <div class="space-y-2">
            <Label :for="`work-from-${index}`">From Date *</Label>
            <Input
              :id="`work-from-${index}`"
              type="month"
              :model-value="work.fromDate"
              @update:model-value="updateWork(index, 'fromDate', $event)"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`work-to-${index}`">To Date</Label>
            <Input
              :id="`work-to-${index}`"
              type="month"
              :model-value="work.toDate"
              @update:model-value="updateWork(index, 'toDate', $event)"
              :disabled="work.isCurrent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Volunteering or Internship -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Volunteering or Internship</h3>
        <Button type="button" @click="addVolunteer" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Volunteer Experience
        </Button>
      </div>

      <div v-if="!formData.volunteerExperience?.length" class="text-sm text-muted-foreground italic">
        No volunteer experience entries yet.
      </div>

      <div v-for="(vol, index) in formData.volunteerExperience" :key="index" class="border rounded-lg p-4 space-y-3 relative">
        <button
          type="button"
          @click="removeVolunteer(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive"
        >
          <Trash2 class="h-4 w-4" />
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label :for="`vol-title-${index}`">Title *</Label>
            <Input
              :id="`vol-title-${index}`"
              :model-value="vol.title"
              @update:model-value="updateVolunteer(index, 'title', $event)"
              placeholder="Volunteer Role"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`vol-company-${index}`">Company *</Label>
            <Input
              :id="`vol-company-${index}`"
              :model-value="vol.company"
              @update:model-value="updateVolunteer(index, 'company', $event)"
              placeholder="Organization Name"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`vol-location-${index}`">Location *</Label>
            <Input
              :id="`vol-location-${index}`"
              :model-value="vol.location"
              @update:model-value="updateVolunteer(index, 'location', $event)"
              placeholder="City, Country"
            />
          </div>

          <div class="flex items-center space-x-2 pt-7">
            <input
              type="checkbox"
              :id="`vol-current-${index}`"
              :checked="vol.isCurrent"
              @change="updateVolunteer(index, 'isCurrent', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300"
            />
            <Label :for="`vol-current-${index}`" class="cursor-pointer">I am currently volunteering</Label>
          </div>

          <div class="space-y-2">
            <Label :for="`vol-from-${index}`">From Date *</Label>
            <Input
              :id="`vol-from-${index}`"
              type="month"
              :model-value="vol.fromDate"
              @update:model-value="updateVolunteer(index, 'fromDate', $event)"
              required
            />
          </div>

          <div class="space-y-2">
            <Label :for="`vol-to-${index}`">To Date</Label>
            <Input
              :id="`vol-to-${index}`"
              type="month"
              :model-value="vol.toDate"
              @update:model-value="updateVolunteer(index, 'toDate', $event)"
              :disabled="vol.isCurrent"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
