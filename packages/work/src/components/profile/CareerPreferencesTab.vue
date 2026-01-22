<script setup lang="ts">
import { ref, computed } from 'vue';
import { ComboboxMultiSelect } from '@bude/shared';
import { Input, Label, Textarea } from '@bude/shared/components/ui';
import { jobTypes, workModes } from '@bude/shared/data/profile-presets';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
});

const selectedJobTypes = ref<string[]>(
  Array.isArray(formData.value.preferredJobTypes) 
    ? formData.value.preferredJobTypes 
    : []
);

const selectedWorkModes = ref<string[]>(
  Array.isArray(formData.value.preferredWorkModes)
    ? formData.value.preferredWorkModes
    : []
);

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...formData.value,
    [field]: value
  });
};

const updateJobTypes = (values: string[]) => {
  selectedJobTypes.value = values;
  updateField('preferredJobTypes', values);
};

const updateWorkModes = (values: string[]) => {
  selectedWorkModes.value = values;
  updateField('preferredWorkModes', values);
};
</script>

<template>
  <div class="space-y-8">
    <!-- Job Preferences -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Job Preferences</h3>
        <p class="text-sm text-muted-foreground">
          Select your preferred job types and work arrangements
        </p>
      </div>

      <!-- Preferred Job Types -->
      <div class="space-y-2">
        <Label>Preferred Job Types</Label>
        <ComboboxMultiSelect
          :options="jobTypes"
          v-model="selectedJobTypes"
          @update:model-value="updateJobTypes"
          placeholder="Select job types..."
        />
        <p class="text-xs text-muted-foreground">
          Select all types you're interested in
        </p>
      </div>

      <!-- Preferred Work Mode -->
      <div class="space-y-2">
        <Label>Preferred Work Mode</Label>
        <ComboboxMultiSelect
          :options="workModes"
          v-model="selectedWorkModes"
          @update:model-value="updateWorkModes"
          placeholder="Select work modes..."
        />
      </div>

      <!-- Remote Only Toggle -->
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remoteOnly"
          :checked="formData.remoteOnly"
          @change="updateField('remoteOnly', ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="remoteOnly" class="cursor-pointer">
          Only interested in remote opportunities
        </Label>
      </div>
    </div>

    <!-- Rate & Availability -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Rate & Availability</h3>
        <p class="text-sm text-muted-foreground">
          Set your expected compensation and availability
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Hourly Rate Range -->
        <div class="space-y-2">
          <Label for="minRate">Minimum Hourly Rate (USD)</Label>
          <div class="flex items-center gap-2">
            <span class="text-sm">$</span>
            <Input
              id="minRate"
              type="number"
              :model-value="formData.minHourlyRate"
              @update:model-value="updateField('minHourlyRate', $event)"
              placeholder="50"
              min="0"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="maxRate">Maximum Hourly Rate (USD)</Label>
          <div class="flex items-center gap-2">
            <span class="text-sm">$</span>
            <Input
              id="maxRate"
              type="number"
              :model-value="formData.maxHourlyRate"
              @update:model-value="updateField('maxHourlyRate', $event)"
              placeholder="150"
              min="0"
            />
          </div>
        </div>

        <!-- Hours per Week -->
        <div class="space-y-2">
          <Label for="hoursPerWeek">Available Hours per Week</Label>
          <Input
            id="hoursPerWeek"
            type="number"
            :model-value="formData.hoursPerWeek"
            @update:model-value="updateField('hoursPerWeek', $event)"
            placeholder="40"
            min="1"
            max="168"
          />
        </div>

        <!-- Notice Period -->
        <div class="space-y-2">
          <Label for="noticePeriod">Notice Period (days)</Label>
          <Input
            id="noticePeriod"
            type="number"
            :model-value="formData.noticePeriod"
            @update:model-value="updateField('noticePeriod', $event)"
            placeholder="14"
            min="0"
          />
        </div>
      </div>
    </div>

    <!-- Preferred Locations -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Preferred Locations</h3>
        <p class="text-sm text-muted-foreground">
          For on-site or hybrid roles, specify your preferred locations
        </p>
      </div>

      <div class="space-y-2">
        <Label for="preferredLocations">Preferred Cities/Countries</Label>
        <Textarea
          id="preferredLocations"
          :model-value="formData.preferredLocations"
          @update:model-value="updateField('preferredLocations', $event)"
          :rows="3"
          placeholder="e.g., New York, London, Remote from India"
        />
        <p class="text-xs text-muted-foreground">
          Enter locations separated by commas
        </p>
      </div>
    </div>

    <!-- Additional Preferences -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Additional Preferences</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Start Date -->
        <div class="space-y-2">
          <Label for="availableFrom">Available From</Label>
          <Input
            id="availableFrom"
            type="date"
            :model-value="formData.availableFrom"
            @update:model-value="updateField('availableFrom', $event)"
          />
        </div>

        <!-- Contract Duration -->
        <div class="space-y-2">
          <Label for="preferredDuration">Preferred Contract Duration (months)</Label>
          <Input
            id="preferredDuration"
            type="number"
            :model-value="formData.preferredDuration"
            @update:model-value="updateField('preferredDuration', $event)"
            placeholder="6"
            min="1"
          />
        </div>
      </div>

      <!-- Additional Notes -->
      <div class="space-y-2">
        <Label for="careerNotes">Additional Notes</Label>
        <Textarea
          id="careerNotes"
          :model-value="formData.careerNotes"
          @update:model-value="updateField('careerNotes', $event)"
          :rows="4"
          placeholder="Any other preferences or requirements..."
        />
      </div>
    </div>

    <!-- Checkboxes -->
    <div class="space-y-3">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="openToRelocate"
          :checked="formData.openToRelocate"
          @change="updateField('openToRelocate', ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="openToRelocate" class="cursor-pointer">
          Open to relocation
        </Label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="openToTravel"
          :checked="formData.openToTravel"
          @change="updateField('openToTravel', ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="openToTravel" class="cursor-pointer">
          Willing to travel for work
        </Label>
      </div>
    </div>
  </div>
</template>
