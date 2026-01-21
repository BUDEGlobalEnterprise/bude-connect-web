<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@bude/shared/components/ui';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
});

const attireOptions = ['Casual Wear', 'Business Casual', 'Business Formal', 'No Preference'];
const locationOptions = ['Remote', 'Onsite', 'Hybrid', 'Travel', 'No Preference'];
const collaborationOptions = ['Individual Work', 'Team Work', 'Mixed', 'No Preference'];
const timeOptions = ['Flexible Time', 'Fixed Hours', 'Shift Work', 'No Preference'];
const roleOptions = ['Clearly Defined Role', 'Flexible Role', 'Evolving Role', 'No Preference'];
const companyOptions = ['Startup', 'Corporate Organization', 'Non-profit', 'Government', 'No Preference'];

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Career Preference Details -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Career Preference Details</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Preferred Functions -->
        <div class="space-y-2">
          <Label for="preferredFunctions">Preferred Functions</Label>
          <Textarea
            id="preferredFunctions"
            :model-value="formData.preferredFunctions"
            @update:model-value="updateField('preferredFunctions', $event)"
            :rows="2"
            placeholder="Engineering, Product, Design..."
          />
        </div>

        <!-- Preferred Industries -->
        <div class="space-y-2">
          <Label for="preferredIndustries">Preferred Industries</Label>
          <Textarea
            id="preferredIndustries"
            :model-value="formData.preferredIndustries"
            @update:model-value="updateField('preferredIndustries', $event)"
            :rows="2"
            placeholder="Tech, Finance, Healthcare..."
          />
        </div>

        <!-- Preferred Location -->
        <div class="space-y-2">
          <Label for="preferredLocation">Preferred Location</Label>
          <Input
            id="preferredLocation"
            :model-value="formData.preferredLocation"
            @update:model-value="updateField('preferredLocation', $event)"
            placeholder="San Francisco, Remote, etc."
          />
        </div>

        <!-- Dream Companies -->
        <div class="space-y-2">
          <Label for="dreamCompanies">Dream Companies</Label>
          <Input
            id="dreamCompanies"
            :model-value="formData.dreamCompanies"
            @update:model-value="updateField('dreamCompanies', $event)"
            placeholder="Google, Microsoft, Apple..."
          />
        </div>
      </div>
    </div>

    <!-- Work Environment Preferences -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Work Environment</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Attire Preference -->
        <div class="space-y-2">
          <Label for="attirePreference">Attire Preference</Label>
          <Select
            :model-value="formData.attirePreference"
            @update:model-value="updateField('attirePreference', $event)"
          >
            <SelectTrigger id="attirePreference">
              <SelectValue placeholder="Select attire preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in attireOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Location Preference -->
        <div class="space-y-2">
          <Label for="locationPreference">Location Preference</Label>
          <Select
            :model-value="formData.locationPreference"
            @update:model-value="updateField('locationPreference', $event)"
          >
            <SelectTrigger id="locationPreference">
              <SelectValue placeholder="Select location preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in locationOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Collaboration Preference -->
        <div class="space-y-2">
          <Label for="collaborationPreference">Collaboration Preference</Label>
          <Select
            :model-value="formData.collaborationPreference"
            @update:model-value="updateField('collaborationPreference', $event)"
          >
            <SelectTrigger id="collaborationPreference">
              <SelectValue placeholder="Select collaboration preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in collaborationOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Time Preference -->
        <div class="space-y-2">
          <Label for="timePreference">Time Preference</Label>
          <Select
            :model-value="formData.timePreference"
            @update:model-value="updateField('timePreference', $event)"
          >
            <SelectTrigger id="timePreference">
              <SelectValue placeholder="Select time preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in timeOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Role Preference -->
        <div class="space-y-2">
          <Label for="rolePreference">Role Preference</Label>
          <Select
            :model-value="formData.rolePreference"
            @update:model-value="updateField('rolePreference', $event)"
          >
            <SelectTrigger id="rolePreference">
              <SelectValue placeholder="Select role preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in roleOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Company Type -->
        <div class="space-y-2">
          <Label for="companyType">Company Type</Label>
          <Select
            :model-value="formData.companyType"
            @update:model-value="updateField('companyType', $event)"
          >
            <SelectTrigger id="companyType">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in companyOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>
