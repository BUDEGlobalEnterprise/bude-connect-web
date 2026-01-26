<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  FileUploadZone,
  ColorPicker
} from '@bude/shared';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@bude/shared/components/ui';
import { 
  seniorityLevels,
  userCategories,
  openToOptions
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

const selectedIndustries = ref<string[]>(Array.isArray(formData.value.industries) ? formData.value.industries : []);
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

const updateIndustries = (values: string[]) => {
  selectedIndustries.value = values;
  updateField('industries', values);
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
</script>

<template>
  <div class="space-y-8">
    <!-- Profile Photo Upload -->
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
      <!-- First Name -->
      <div class="space-y-2">
        <Label for="firstName">First Name *</Label>
        <Input
          id="firstName"
          :model-value="formData.firstName"
          @update:model-value="updateField('firstName', $event)"
          placeholder="First Name"
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
          placeholder="Last Name"
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
          placeholder="Email"
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
          placeholder="Username"
        />
      </div>
    </div>

    <!-- Professional Information -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Professional Information</h3>
      
      <div class="space-y-4">
        <!-- Primary Role (Read-only from HRMS) -->
        <div class="space-y-2">
          <Label>Primary Role (Managed in HR Portal)</Label>
          <Input
            :model-value="formData.primaryRole"
            disabled
            placeholder="Managed in HR Portal"
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

        <!-- Industries (Read-only or limited) -->
        <div class="space-y-2">
          <Label>Industries</Label>
          <div class="text-sm border rounded-md p-2 bg-muted/20 min-h-[40px]">
             {{ Array.isArray(formData.industries) ? formData.industries.join(', ') : 'None' }}
          </div>
        </div>

        <!-- User Category -->
        <div class="space-y-2">
          <Label>User Category</Label>
          <div class="text-sm border rounded-md p-2 bg-muted/20">
             {{ formData.userCategory || 'None' }}
          </div>
        </div>

        <!-- Open To -->
        <div class="space-y-2">
          <Label>Open To</Label>
          <div class="text-sm border rounded-md p-2 bg-muted/20">
             {{ formData.openTo || 'None' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Location & Timezone -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <!-- Country (Read-only) -->
      <div class="space-y-2">
        <Label for="country">Country (Managed in HR Portal)</Label>
        <Input
          id="country"
          :model-value="formData.country"
          disabled
          placeholder="India"
        />
      </div>
    </div>

    <!-- Theme Color -->
    <div class="space-y-4">
      <ColorPicker
        label="Theme Color"
        :model-value="formData.themeColor || '#3b82f6'"
        @update:model-value="updateField('themeColor', $event)"
      />
    </div>

    <!-- Cover Image -->
    <div class="space-y-4">
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
