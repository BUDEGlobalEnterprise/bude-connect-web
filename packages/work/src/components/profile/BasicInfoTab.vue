<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  FileUploadZone,
  ColorPicker
} from '@bude/shared';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@bude/shared/components/ui';
import { 
  seniorityLevels
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

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
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
        <!-- Primary Role (Syncs to HR) -->
        <div class="space-y-2">
          <Label>Primary Role (Syncs to HR Portal)</Label>
          <Input
            id="primaryRole"
            :model-value="formData.primaryRole"
            @update:model-value="updateField('primaryRole', $event)"
            placeholder="e.g. Software Engineer"
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
            <SelectItem v-for="tz in timezoneOptions" :key="tz" :value="tz">
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
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
          </SelectContent>
        </Select>
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
