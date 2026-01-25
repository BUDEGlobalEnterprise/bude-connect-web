<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  ComboboxMultiSelect,
  FileUploadZone,
  ColorPicker
} from '@bude/shared';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@bude/shared/components/ui';
// Removed unused imports
import { 
  roles, 
  industries, 
  seniorityLevels,
  userCategories,
  openToOptions,
  languages as languagePresets
} from '@bude/shared/data/profile-presets';

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

const selectedRoles = ref<string[]>(
  formData.value.primaryRole ? [formData.value.primaryRole] : []
);
const selectedIndustries = ref<string[]>(Array.isArray(formData.value.industries) ? formData.value.industries : []);
const selectedLanguages = ref<string[]>(Array.isArray(formData.value.languages) ? formData.value.languages : []);
const selectedCategories = ref<string[]>(
  formData.value.userCategory ? [formData.value.userCategory] : []
);
const selectedOpenTo = ref<string[]>(
  typeof formData.value.openTo === 'string' 
    ? formData.value.openTo.split(',').map((s: string) => s.trim())
    : formData.value.openTo || []
);

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};

const updateRoles = (values: string[]) => {
  selectedRoles.value = values;
  // Take first role as primary
  updateField('primaryRole', values[0] || '');
  updateField('roles', values);
};

const updateIndustries = (values: string[]) => {
  selectedIndustries.value = values;
  updateField('industries', values);
};

const updateLanguages = (values: string[]) => {
  selectedLanguages.value = values;
  updateField('languages', values);
};

const updateCategories = (values: string[]) => {
  selectedCategories.value = values;
  updateField('userCategory', values[0] || '');
};

const updateOpenTo = (values: string[]) => {
  selectedOpenTo.value = values;
  updateField('openTo', values.join(', '));
};

// Timezone options
const timezoneOptions = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Asia/Singapore',
  'Australia/Sydney',
];

// Country options
const countryOptions = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
</script>

<template>
  <div class="space-y-8">
    <!-- Profile Photo Upload -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Profile Photo</h3>
        <p class="text-sm text-muted-foreground">
          Upload a professional photo. This will be visible on your profile.
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
      <!-- First Name -->
      <div class="space-y-2">
        <Label for="firstName">First Name *</Label>
        <Input
          id="firstName"
          :model-value="formData.firstName"
          @update:model-value="updateField('firstName', $event)"
          placeholder="John"
          required
        />
      </div>

      <!-- Last Name -->
      <div class="space-y-2">
        <Label for="lastName">Last Name</Label>
        <Input
          id="lastName"
          :model-value="formData.lastName"
          @update:model-value="updateField('lastName', $event)"
          placeholder="Doe"
        />
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <Label for="email">Email *</Label>
        <Input
          id="email"
          type="email"
          :model-value="formData.email"
          @update:model-value="updateField('email', $event)"
          placeholder="your.email@example.com"
          required
        />
      </div>

      <!-- Username -->
      <div class="space-y-2">
        <Label for="username">Username</Label>
        <Input
          id="username"
          :model-value="formData.username"
          @update:model-value="updateField('username', $event)"
          placeholder="johndoe"
        />
      </div>
    </div>

    <!-- Professional Information -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Professional Information</h3>
      
      <div class="space-y-4">
        <!-- Primary Role (Multi-select, but we'll use first as primary) -->
        <div class="space-y-2">
          <Label>Primary Role *</Label>
          <ComboboxMultiSelect
            :options="roles"
            v-model="selectedRoles"
            @update:model-value="updateRoles"
            placeholder="Select your role..."
          />
          <p class="text-xs text-muted-foreground">
            Select one or more roles that describe you
          </p>
        </div>

        <!-- Seniority Level -->
        <div class="space-y-2">
          <Label for="seniorityLevel">Seniority Level</Label>
          <Select
            :model-value="formData.seniorityLevel"
            @update:model-value="updateField('seniorityLevel', $event)"
          >
            <SelectTrigger id="seniorityLevel">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="level in seniorityLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Industries -->
        <div class="space-y-2">
          <Label>Industries</Label>
          <ComboboxMultiSelect
            :options="industries"
            v-model="selectedIndustries"
            @update:model-value="updateIndustries"
            placeholder="Select industries you work in..."
          />
        </div>

        <!-- User Category -->
        <div class="space-y-2">
          <Label>User Category</Label>
          <ComboboxMultiSelect
            :options="userCategories"
            v-model="selectedCategories"
            @update:model-value="updateCategories"
            placeholder="Select category..."
          />
        </div>

        <!-- Open To -->
        <div class="space-y-2">
          <Label>Open To</Label>
          <ComboboxMultiSelect
            :options="openToOptions"
            v-model="selectedOpenTo"
            @update:model-value="updateOpenTo"
            placeholder="What opportunities are you open to?"
          />
        </div>
      </div>
    </div>

    <!-- Location & Timezone -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Languages -->
      <div class="space-y-2">
        <Label>Languages</Label>
        <ComboboxMultiSelect
          :options="languagePresets"
          v-model="selectedLanguages"
          @update:model-value="updateLanguages"
          placeholder="Select languages..."
        />
      </div>

      <!-- Time Zone -->
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
            <SelectItem v-for="tz in timezoneOptions" :key="tz" :value="tz">
              {{ tz }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Country -->
      <div class="space-y-2">
        <Label for="country">Country</Label>
        <Select
          :model-value="formData.country"
          @update:model-value="updateField('country', $event)"
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="country in countryOptions" :key="country" :value="country">
              {{ country }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Theme Color (Branding) -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Profile Branding</h3>
        <p class="text-sm text-muted-foreground">
          Customize the color theme for your profile
        </p>
      </div>
      
      <ColorPicker
        label="Theme Color"
        :model-value="formData.themeColor || '#3b82f6'"
        @update:model-value="updateField('themeColor', $event)"
      />
    </div>

    <!-- Cover Image Upload -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Cover Image</h3>
        <p class="text-sm text-muted-foreground">
          Upload a cover image for your profile (optional)
        </p>
      </div>
      
      <FileUploadZone
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
