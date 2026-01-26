<script setup lang="ts">
import { computed } from 'vue';
import { 
  ComboboxMultiSelect,
  SearchInput,
  type SearchResult 
} from '@bude/shared';
import { Button, Input, Label, Textarea } from '@bude/shared/components/ui';
import { Plus, Trash2, Briefcase, GraduationCap } from 'lucide-vue-next';
import { 
  degreeTypes, 
  fieldsOfStudy, 
  universities, 
  companies,
  roles,
  jobTypes,
  workModes
} from '@bude/shared/data/profile-presets';

// ... (existing imports)

const searchRoles = (query: string): SearchResult[] => {
  return roles
    .filter(role => role.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)
    .map(role => ({
      title: role.label,
      icon: Briefcase,
      data: role.value
    }));
};



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
            Add your educational background (Syncs to HR)
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
          @click="removeEducation(Number(index))"
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
              @select="(result) => updateEducation(Number(index), 'institution', result.title)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Degree Type -->
            <div class="space-y-2">
              <Label>Degree Type *</Label>
              <ComboboxMultiSelect
                :options="degreeTypes"
                :model-value="edu.degree ? [edu.degree] : []"
                @update:model-value="(val) => updateEducation(Number(index), 'degree', val[0])"
                placeholder="Select degree..."
              />
            </div>

            <!-- Field of Study -->
            <div class="space-y-2">
              <Label>Field of Study *</Label>
              <ComboboxMultiSelect
                :options="fieldsOfStudy"
                :model-value="edu.fieldOfStudy ? [edu.fieldOfStudy] : []"
                @update:model-value="(val) => updateEducation(Number(index), 'fieldOfStudy', val[0])"
                placeholder="Select field..."
              />
            </div>

            <!-- Start Date -->
            <div class="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                :model-value="edu.startDate"
                @update:model-value="updateEducation(Number(index), 'startDate', $event)"
              />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
              <Label>End Date / Year of Passing</Label>
              <Input
                type="month"
                :model-value="edu.endDate"
                @update:model-value="updateEducation(Number(index), 'endDate', $event)"
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
            Add your professional experience (Syncs to HR)
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
          @click="removeWorkExperience(Number(index))"
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
              @select="(result) => updateWorkExperience(Number(index), 'company', result.title)"
            />
          </div>

          <!-- Job Title -->
          <div class="space-y-2">
            <Label>Job Title *</Label>
            <SearchInput
              :placeholder="work.title || 'Search job titles...'"
              :on-search="searchRoles"
              @select="(result) => updateWorkExperience(Number(index), 'title', result.title)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Employment Type -->
            <div class="space-y-2">
              <Label>Employment Type</Label>
              <ComboboxMultiSelect
                :options="jobTypes"
                :model-value="work.employmentType ? [work.employmentType] : []"
                @update:model-value="(val) => updateWorkExperience(Number(index), 'employmentType', val[0])"
                placeholder="Select type..."
              />
            </div>

            <!-- Work Mode -->
            <div class="space-y-2">
              <Label>Location Type</Label>
              <ComboboxMultiSelect
                :options="workModes"
                :model-value="work.workMode ? [work.workMode] : []"
                @update:model-value="(val) => updateWorkExperience(Number(index), 'workMode', val[0])"
                placeholder="Select mode..."
              />
            </div>

            <!-- Start Date -->
            <div class="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="month"
                :model-value="work.startDate"
                @update:model-value="updateWorkExperience(Number(index), 'startDate', $event)"
              />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label>End Date</Label>
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    :id="`current-${index}`"
                    :checked="work.current"
                    @change="updateWorkExperience(Number(index), 'current', ($event.target as HTMLInputElement).checked)"
                    class="h-3 w-3 rounded border-gray-300"
                  />
                  <Label :for="`current-${index}`" class="text-xs font-normal cursor-pointer">
                    I currently work here
                  </Label>
                </div>
              </div>
              <Input
                v-if="!work.current"
                type="month"
                :model-value="work.endDate"
                @update:model-value="updateWorkExperience(Number(index), 'endDate', $event)"
              />
              <div v-else class="h-10 flex items-center px-3 border rounded-md bg-muted text-muted-foreground text-sm">
                Present
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              :model-value="work.description"
              @update:model-value="updateWorkExperience(Number(index), 'description', $event)"
              :rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
