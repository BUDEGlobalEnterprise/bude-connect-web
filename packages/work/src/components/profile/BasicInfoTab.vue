<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { 
  FileUploadZone,
  ColorPicker,
  SearchInput,
  type SearchResult 
} from '@bude/shared';
import { 
  Input, 
  Label, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@bude/shared/components/ui';
import { MapPin } from 'lucide-vue-next';
import { 
  seniorityLevels,
  timezones,
  countries,
  roles 
} from '@bude/shared/data/profile-presets';

// ... (existing imports and code)

// Helper to create simple search handler for presets
const createSimpleSearchHandler = (options: { label: string, value: string }[], icon: any) => {
  return (query: string): SearchResult[] => {
    return options
      .filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50)
      .map(opt => ({
        title: opt.label,
        data: opt.value,
        icon: icon
      }));
  };
};

import { Briefcase } from 'lucide-vue-next';
const searchRoles = computed(() => createSimpleSearchHandler(roles, Briefcase));


import { 
  getLocationData, 
  stateAccesor, 
  type LocationHierarchy 
} from '@bude/shared/data/locations';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
});

const profilePhoto = ref<File[]>([]);
const coverImage = ref<File[]>([]);
const locationData = ref<LocationHierarchy | null>(null);
const isLoadingLocation = ref(false);

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};

// State options
const stateOptions = computed(() => {
  if (formData.value.country === 'India') {
    return Object.keys(stateAccesor).sort();
  }
  return [];
});

// District options
const districtOptions = computed(() => {
  if (!locationData.value) return [];
  return locationData.value.districts.map(d => d.name).sort();
});

// Taluka options
const talukaOptions = computed(() => {
  if (!locationData.value || !formData.value.district || formData.value.district === 'Other') return [];
  const district = locationData.value.districts.find(d => d.name === formData.value.district);
  return district ? district.talukas.map(t => t.name).sort() : [];
});

// Village options
const villageOptions = computed(() => {
  if (!locationData.value || !formData.value.district || !formData.value.taluka || formData.value.taluka === 'Other') return [];
  const district = locationData.value.districts.find(d => d.name === formData.value.district);
  if (!district) return [];
  const taluka = district.talukas.find(t => t.name === formData.value.taluka);
  return taluka ? taluka.villages.sort() : [];
});

// Search Handlers
const createSearchHandler = (options: string[]) => {
  return (query: string): SearchResult[] => {
    const filtered = options
      .filter(opt => opt.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50); // Limit results for performance
    
    // Always add Other option
    const results = filtered.map(opt => ({
      title: opt,
      icon: MapPin,
      data: opt
    }));

    // Add Other if not exact match (or always?) 
    // User wants "Other" option always available
    if (!results.some(r => r.title === 'Other')) {
       results.push({
        title: 'Other',
        icon: MapPin,
        data: 'Other'
      });
    }

    return results;
  };
};

const searchStates = computed(() => createSearchHandler(stateOptions.value));
const searchDistricts = computed(() => createSearchHandler(districtOptions.value));
const searchTalukas = computed(() => createSearchHandler(talukaOptions.value));
const searchVillages = computed(() => createSearchHandler(villageOptions.value));

// Load location data when state changes
watch(() => formData.value.state, async (newState) => {
  if (formData.value.country === 'India' && newState && newState !== 'Other') {
    isLoadingLocation.value = true;
    locationData.value = await getLocationData(newState);
    isLoadingLocation.value = false;
  } else {
    locationData.value = null;
  }
});

// Clear dependent fields
watch(() => formData.value.country, (newVal) => {
  if (newVal !== 'India') {
    updateField('state', '');
    updateField('district', '');
    updateField('taluka', '');
    updateField('village', '');
    updateField('stateOther', '');
    updateField('districtOther', '');
    updateField('talukaOther', '');
    updateField('villageOther', '');
  }
});

watch(() => formData.value.state, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateField('district', '');
    updateField('taluka', '');
    updateField('village', '');
    if (newVal !== 'Other') updateField('stateOther', '');
    updateField('districtOther', '');
    updateField('talukaOther', '');
    updateField('villageOther', '');
  }
});

watch(() => formData.value.district, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateField('taluka', '');
    updateField('village', '');
    if (newVal !== 'Other') updateField('districtOther', '');
    updateField('talukaOther', '');
    updateField('villageOther', '');
  }
});

watch(() => formData.value.taluka, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateField('village', '');
    if (newVal !== 'Other') updateField('talukaOther', '');
    updateField('villageOther', '');
  }
});

watch(() => formData.value.village, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== 'Other') {
    updateField('villageOther', '');
  }
});

// Initial load if state is already selected
onMounted(async () => {
  if (formData.value.country === 'India' && formData.value.state && formData.value.state !== 'Other') {
    isLoadingLocation.value = true;
    locationData.value = await getLocationData(formData.value.state);
    isLoadingLocation.value = false;
  }
});

</script>

<template>
  <div class="space-y-8">
    <!-- Profile Photo -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Profile Photo</h3>
        <p class="text-sm text-muted-foreground">
          Upload a professional photo.
        </p>
      </div>
      
      <FileUploadZone
        v-model="profilePhoto"
        accept="image/*"
        :max-size="5 * 1024 * 1024"
        :multiple="false"
        @update:model-value="updateField('profilePhotoFile', profilePhoto[0])"
      />
    </div>

    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="firstName">First Name *</Label>
        <Input
          id="firstName"
          :model-value="formData.firstName"
          @update:model-value="updateField('firstName', $event)"
          required
        />
      </div>

      <div class="space-y-2">
        <Label for="lastName">Last Name</Label>
        <Input
          id="lastName"
          :model-value="formData.lastName"
          @update:model-value="updateField('lastName', $event)"
        />
      </div>

      <div class="space-y-2">
        <Label for="email">Email *</Label>
        <Input
          id="email"
          type="email"
          :model-value="formData.email"
          @update:model-value="updateField('email', $event)"
          required
        />
      </div>

      <div class="space-y-2">
        <Label for="username">Username</Label>
        <Input
          id="username"
          :model-value="formData.username"
          @update:model-value="updateField('username', $event)"
        />
      </div>
    </div>

    <!-- Professional Information -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Professional Information</h3>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <Label>Primary Role (Syncs to HR Portal)</Label>
          <SearchInput
            :placeholder="formData.primaryRole || 'Search Roles (e.g. Software Engineer)'"
            :on-search="searchRoles"
            @select="(result) => updateField('primaryRole', result.title)"
          />
        </div>

        <!-- Seniority Level -->
        <div class="space-y-2">
          <Label for="seniorityLevel">Seniority Level</Label>
          <Select
            :model-value="formData.seniorityLevel"
            @update:model-value="updateField('seniorityLevel', $event)"
          >
            <SelectTrigger id="seniorityLevel">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="level in seniorityLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Location & Timezone -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="timezone">Time Zone</Label>
          <Select
            :model-value="formData.timezone"
            @update:model-value="updateField('timezone', $event)"
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="tz in timezones" :key="tz" :value="tz">
                {{ tz }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Country (Syncs to HR) -->
        <div class="space-y-2">
          <Label for="country">Country (Syncs to HR Portal)</Label>
          <Select
            :model-value="formData.country"
            @update:model-value="updateField('country', $event)"
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="c in countries" :key="c.value" :value="c.value">
                {{ c.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Indian Location Hierarchy -->
      <div v-if="formData.country === 'India'" class="space-y-4 border-l-2 border-primary-100 pl-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- State -->
          <div class="space-y-2">
            <Label for="state">State</Label>
            <SearchInput
              :placeholder="formData.state || 'Search State...'"
              :on-search="searchStates"
              @select="(result) => updateField('state', result.title)"
            />
            <Input 
              v-if="formData.state === 'Other'"
              placeholder="Enter State Name"
              :model-value="formData.stateOther"
              @update:model-value="updateField('stateOther', $event)"
              class="mt-2"
            />
          </div>

        <!-- District -->
          <div class="space-y-2">
            <Label for="district">District</Label>
            <SearchInput
              :placeholder="isLoadingLocation ? 'Loading...' : (formData.district || 'Search District...')"
              :on-search="searchDistricts"
              @select="(result) => updateField('district', result.title)"
            />
            <Input 
              v-if="formData.district === 'Other'"
              placeholder="Enter District Name"
              :model-value="formData.districtOther"
              @update:model-value="updateField('districtOther', $event)"
              class="mt-2"
            />
          </div>
        </div>

        <!-- Taluka & Village -->
        <div v-if="formData.district && formData.district !== 'Other'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="taluka">Taluka</Label>
            <SearchInput
              :placeholder="formData.taluka || 'Search Taluka...'"
              :on-search="searchTalukas"
              @select="(result) => updateField('taluka', result.title)"
            />
            <Input 
              v-if="formData.taluka === 'Other'"
              placeholder="Enter Taluka Name"
              :model-value="formData.talukaOther"
              @update:model-value="updateField('talukaOther', $event)"
              class="mt-2"
            />
          </div>

          <div class="space-y-2">
            <Label for="village">Village</Label>
             <SearchInput
              :placeholder="formData.village || 'Search Village...'"
              :on-search="searchVillages"
              @select="(result) => updateField('village', result.title)"
            />
            <Input 
              v-if="formData.village === 'Other'"
              placeholder="Enter Village Name"
              :model-value="formData.villageOther"
              @update:model-value="updateField('villageOther', $event)"
              class="mt-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Branding -->
    <div class="space-y-4">
      <ColorPicker
        label="Theme Color"
        :model-value="formData.themeColor || '#3b82f6'"
        @update:model-value="updateField('themeColor', $event)"
      />
      
      <FileUploadZone
        label="Cover Image"
        v-model="coverImage"
        accept="image/*"
        :max-size="10 * 1024 * 1024"
        :multiple="false"
        @update:model-value="updateField('coverImageFile', coverImage[0])"
      />
    </div>

    <!-- Checkboxes -->
    <div class="space-y-3">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enabled"
          :checked="formData.enabled"
          @change="updateField('enabled', ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="enabled" class="cursor-pointer">Profile Enabled</Label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="termsAccepted"
          :checked="formData.termsAccepted"
          @change="updateField('termsAccepted', ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="termsAccepted" class="cursor-pointer">
          I accept the Terms and Conditions *
        </Label>
      </div>
    </div>
  </div>
</template>
