<script setup lang="ts">
import { computed } from 'vue';
import { 
  ComboboxMultiSelect,
  SearchInput,
  type SearchResult 
} from '@bude/shared';
import { Button, Input, Label, Textarea } from '@bude/shared/components/ui';
import { Plus, Trash2, Briefcase, GraduationCap } from 'lucide-vue-next';
// Education and WorkExperience interfaces are used by types in this file
// SearchResult is imported from @bude/shared

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || { education: [], workExperience: [] },
  set: (val) => emit('update:modelValue', val)
});

// Education Methods
const addEducation = () => {
  const education = [...(formData.value.education || [])];
  education.push({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    location: ''
  });
  emit('update:modelValue', { ...formData.value, education });
};

const removeEducation = (index: number) => {
  const education = [...(formData.value.education || [])];
  education.splice(index, 1);
  emit('update:modelValue', { ...formData.value, education });
};

const updateEducation = (index: number, field: string, value: any) => {
  const education = [...(formData.value.education || [])];
  education[index] = { ...education[index], [field]: value };
  emit('update:modelValue', { ...formData.value, education });
};

// Work Experience Methods
const addWorkExperience = () => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience.push({
    company: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });
  emit('update:modelValue', { ...formData.value, workExperience });
};

const removeWorkExperience = (index: number) => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience.splice(index, 1);
  emit('update:modelValue', { ...formData.value, workExperience });
};

const updateWorkExperience = (index: number, field: string, value: any) => {
  const workExperience = [...(formData.value.workExperience || [])];
  workExperience[index] = { ...workExperience[index], [field]: value };
  emit('update:modelValue', { ...formData.value, workExperience });
};

// Search handlers for autocomplete
const searchUniversities = (query: string): SearchResult[] => {
  return universities
    .filter(uni => uni.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)
    .map(uni => ({
      title: uni.label,
      icon: GraduationCap,
      data: uni.value
    }));
};

const searchCompanies = (query: string): SearchResult[] => {
  const allCompanies = [
    ...companies,
    // Add more common tech companies
    { value: 'startups', label: 'Startup Company' },
    { value: 'agency', label: 'Digital Agency' },
    { value: 'freelance', label: 'Freelance/Self-Employed' }
  ];
  
  return allCompanies
    .filter(comp => comp.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)
    .map(comp => ({
      title: comp.label,
      icon: Briefcase,
      data: comp.value
    }));
};
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
            Add your educational background
          </p>
        </div>
        <Button type="button" @click="addEducation" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div v-if="!Array.isArray(formData.education) || !formData.education.length" class="text-sm text-muted-foreground italic border rounded-lg p-8 text-center">
        No education entries yet. Click "Add Education" to get started.
      </div>

      <div v-for="(edu, index) in (Array.isArray(formData.education) ? formData.education : [])" :key="index" class="border rounded-lg p-4 space-y-4 relative bg-card">
        <button
          type="button"
          @click="removeEducation(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
        >
          <Trash2 class="h-4 w-4" />
        </button>

        <div class="space-y-4 pr-8">
          <!-- Institution with Autocomplete -->
          <div class="space-y-2">
            <Label>Institution / University *</Label>
            <SearchInput
              :placeholder="edu.institution || 'Search universities...'"
              :on-search="searchUniversities"
              @select="(result) => updateEducation(index, 'institution', result.title)"
            />
            <Input
              v-if="!edu.institution"
              :model-value="edu.institution"
              @update:model-value="updateEducation(index, 'institution', $event)"
              placeholder="Or type institution name"
              class="mt-2"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Degree Type -->
            <div class="space-y-2">
              <Label>Degree Type *</Label>
              <ComboboxMultiSelect
                :options="degreeTypes"
                :model-value="edu.degree ? [edu.degree] : []"
                @update:model-value="(val) => updateEducation(index, 'degree', val[0])"
                placeholder="Select degree..."
              />
            </div>

            <!-- Field of Study -->
            <div class="space-y-2">
              <Label>Field of Study *</Label>
              <ComboboxMultiSelect
                :options="fieldsOfStudy"
                :model-value="edu.fieldOfStudy ? [edu.fieldOfStudy] : []"
                @update:model-value="(val) => updateEducation(index, 'fieldOfStudy', val[0])"
                placeholder="Select field..."
              />
            </div>

            <!-- Start Date -->
            <div class="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="month"
                :model-value="edu.startDate"
                @update:model-value="updateEducation(index, 'startDate', $event)"
              />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                :model-value="edu.endDate"
                @update:model-value="updateEducation(index, 'endDate', $event)"
                placeholder="Leave blank if ongoing"
              />
            </div>
          </div>

          <!-- Location -->
          <div class="space-y-2">
            <Label>Location</Label>
            <Input
              :model-value="edu.location"
              @update:model-value="updateEducation(index, 'location', $event)"
              placeholder="City, Country"
            />
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
            Add your professional experience
          </p>
        </div>
        <Button type="button" @click="addWorkExperience" size="sm" variant="outline">
          <Plus class="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div v-if="!Array.isArray(formData.workExperience) || !formData.workExperience.length" class="text-sm text-muted-foreground italic border rounded-lg p-8 text-center">
        No work experience yet. Click "Add Experience" to get started.
      </div>

      <div v-for="(work, index) in (Array.isArray(formData.workExperience) ? formData.workExperience : [])" :key="index" class="border rounded-lg p-4 space-y-4 relative bg-card">
        <button
          type="button"
          @click="removeWorkExperience(index)"
          class="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
        >
          <Trash2 class="h-4 w-4" />
        </button>

        <div class="space-y-4 pr-8">
          <!-- Company with Autocomplete -->
          <div class="space-y-2">
            <Label>Company *</Label>
            <SearchInput
              :placeholder="work.company || 'Search companies...'"
              :on-search="searchCompanies"
              @select="(result) => updateWorkExperience(index, 'company', result.title)"
            />
            <Input
              v-if="!work.company"
              :model-value="work.company"
              @update:model-value="updateWorkExperience(index, 'company', $event)"
              placeholder="Or type company name"
              class="mt-2"
            />
          </div>

          <!-- Job Title -->
          <div class="space-y-2">
            <Label>Job Title *</Label>
            <Input
              :model-value="work.title"
              @update:model-value="updateWorkExperience(index, 'title', $event)"
              placeholder="e.g., Senior Frontend Developer"
            />
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              :model-value="work.description"
              @update:model-value="updateWorkExperience(index, 'description', $event)"
              :rows="3"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Date -->
            <div class="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="month"
                :model-value="work.startDate"
                @update:model-value="updateWorkExperience(index, 'startDate', $event)"
              />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                :model-value="work.endDate"
                @update:model-value="updateWorkExperience(index, 'endDate', $event)"
                :disabled="work.current"
                placeholder="Leave blank if current"
              />
            </div>
          </div>

          <!-- Current Position Checkbox -->
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :id="`work-current-${index}`"
              :checked="work.current"
              @change="updateWorkExperience(Number(index), 'current', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300"
            />
            <Label :for="`work-current-${index}`" class="cursor-pointer">
              I currently work here
            </Label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
