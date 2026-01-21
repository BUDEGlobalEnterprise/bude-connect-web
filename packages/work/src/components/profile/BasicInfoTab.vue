<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@bude/shared/components/ui';
import { User, Upload } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
});

// Language options
const languageOptions = [
  'English (United Kingdom)',
  'English (United States)',
  'Hindi',
  'Tamil',
  'Spanish',
  'French',
  'German',
];

// Country options
const countryOptions = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];

// Timezone options
const timezoneOptions = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Asia/Singapore',
  'Australia/Sydney',
];

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- User Details Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <!-- Language -->
      <div class="space-y-2">
        <Label for="language">Language</Label>
        <Select
          :model-value="formData.language"
          @update:model-value="updateField('language', $event)"
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="lang in languageOptions" :key="lang" :value="lang">
              {{ lang }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Full Name -->
      <div class="space-y-2">
        <Label for="fullName">Full Name</Label>
        <Input
          id="fullName"
          :model-value="formData.fullName"
          @update:model-value="updateField('fullName', $event)"
          placeholder="John Doe"
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

      <!-- User Category -->
      <div class="space-y-2">
        <Label for="userCategory">User Category</Label>
        <Input
          id="userCategory"
          :model-value="formData.userCategory"
          @update:model-value="updateField('userCategory', $event)"
          placeholder="Developer, Designer, etc."
        />
      </div>

      <!-- Middle Name -->
      <div class="space-y-2">
        <Label for="middleName">Middle Name</Label>
        <Input
          id="middleName"
          :model-value="formData.middleName"
          @update:model-value="updateField('middleName', $event)"
          placeholder="Michael"
        />
      </div>

      <!-- Open to -->
      <div class="space-y-2">
        <Label for="openTo">Open to</Label>
        <Input
          id="openTo"
          :model-value="formData.openTo"
          @update:model-value="updateField('openTo', $event)"
          placeholder="new projects, collaborations"
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
    </div>

    <!-- Cover Image Upload -->
    <div class="space-y-2">
      <Label for="coverImage">Cover Image</Label>
      <div class="flex items-center gap-3">
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          @change="(e: any) => updateField('coverImageFile', e.target.files[0])"
          class="flex-1"
        />
        <button
          type="button"
          class="px-4 py-2 border rounded-md hover:bg-accent flex items-center gap-2"
        >
          <Upload class="h-4 w-4" />
          Attach
        </button>
      </div>
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
        <Label for="enabled" class="cursor-pointer">Enabled</Label>
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
          Acceptance for Terms and/or Policies
        </Label>
      </div>
    </div>
  </div>
</template>
