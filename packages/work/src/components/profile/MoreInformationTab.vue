<script setup lang="ts">
import { computed } from 'vue';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@bude/shared/components/ui';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
});

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Gender (Syncs to HR) -->
      <div class="space-y-2">
        <Label for="gender">Gender (Syncs to HR)</Label>
        <Select
          :model-value="formData.gender"
          @update:model-value="updateField('gender', $event)"
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="g in genderOptions" :key="g" :value="g">
              {{ g }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Phone -->
      <div class="space-y-2">
        <Label for="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          :model-value="formData.phone"
          @update:model-value="updateField('phone', $event)"
          placeholder="+91 98765 43210"
        />
      </div>

      <!-- Mobile No -->
      <div class="space-y-2">
        <Label for="mobileNo">Mobile No</Label>
        <Input
          id="mobileNo"
          type="tel"
          :model-value="formData.mobileNo"
          @update:model-value="updateField('mobileNo', $event)"
          placeholder="+91 98765 43210"
        />
      </div>

      <!-- Birth Date (Syncs to HR) -->
      <div class="space-y-2">
        <Label for="birthDate">Birth Date (Syncs to HR)</Label>
        <Input
          id="birthDate"
          type="date"
          :model-value="formData.birthDate"
          @update:model-value="updateField('birthDate', $event)"
        />
      </div>

      <!-- Location (Syncs to HR) -->
      <div class="space-y-2">
        <Label for="location">Location (Syncs to HR)</Label>
        <Input
          id="location"
          :model-value="formData.location"
          @update:model-value="updateField('location', $event)"
          placeholder="City, Country"
        />
      </div>

      <!-- LinkedIn ID -->
      <div class="space-y-2">
        <Label for="linkedinId">LinkedIn ID</Label>
        <Input
          id="linkedinId"
          :model-value="formData.linkedinId"
          @update:model-value="updateField('linkedinId', $event)"
          placeholder="linkedin.com/in/username"
        />
      </div>

      <!-- Github ID -->
      <div class="space-y-2">
        <Label for="githubId">Github ID</Label>
        <Input
          id="githubId"
          :model-value="formData.githubId"
          @update:model-value="updateField('githubId', $event)"
          placeholder="github.com/username"
        />
      </div>

      <!-- Twitter ID -->
      <div class="space-y-2">
        <Label for="twitterId">Twitter ID</Label>
        <Input
          id="twitterId"
          :model-value="formData.twitterId"
          @update:model-value="updateField('twitterId', $event)"
          placeholder="@username"
        />
      </div>

      <!-- Medium ID -->
      <div class="space-y-2">
        <Label for="mediumId">Medium ID</Label>
        <Input
          id="mediumId"
          :model-value="formData.mediumId"
          @update:model-value="updateField('mediumId', $event)"
          placeholder="medium.com/@username"
        />
      </div>

      <!-- Profession (Syncs to HR) -->
      <div class="space-y-2">
        <Label for="profession">Profession (Syncs to HR)</Label>
        <Input
          id="profession"
          :model-value="formData.profession"
          @update:model-value="updateField('profession', $event)"
          placeholder="e.g. Architect"
        />
      </div>
    </div>

    <!-- Interests -->
    <div class="space-y-2">
      <Label for="interests">Interests</Label>
      <Textarea
        id="interests"
        :model-value="formData.interests"
        @update:model-value="updateField('interests', $event)"
        :rows="3"
        placeholder="Your professional interests..."
      />
    </div>

    <!-- Bio (Syncs to HR/User) -->
    <div class="space-y-2">
      <Label for="bio">Bio (Syncs to HR Portal)</Label>
      <Textarea
        id="bio"
        :model-value="formData.bio"
        @update:model-value="updateField('bio', $event)"
        :rows="4"
        placeholder="Tell us about yourself..."
      />
    </div>

    <!-- Hide Private Info Checkbox -->
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        id="hidePrivateInfo"
        :checked="formData.hidePrivateInfo"
        @change="updateField('hidePrivateInfo', ($event.target as HTMLInputElement).checked)"
        class="h-4 w-4 rounded border-gray-300"
      />
      <Label for="hidePrivateInfo" class="cursor-pointer">
        Hide my Private Information from others
      </Label>
    </div>
  </div>
</template>
