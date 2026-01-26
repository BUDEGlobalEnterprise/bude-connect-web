<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  FileUploadZone,
  ColorPicker,
  SearchInput,
  type SearchResult,
} from "@bude/shared";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bude/shared/components/ui";
import { MapPin, Building2 } from "lucide-vue-next";
import {
  seniorityLevels,
  timezones,
  countries,
  roles,
  departments,
} from "@bude/shared/data/profile-presets";

// ... (existing imports and code)

// Helper to create simple search handler for presets
const createSimpleSearchHandler = (
  options: { label: string; value: string }[],
  icon: any,
) => {
  return (query: string): SearchResult[] => {
    return options
      .filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50)
      .map((opt) => ({
        title: opt.label,
        data: opt.value,
        icon: icon,
      }));
  };
};

import { Briefcase } from "lucide-vue-next";
const searchRoles = computed(() => createSimpleSearchHandler(roles, Briefcase));
const searchDepartments = computed(() =>
  createSimpleSearchHandler(departments, Building2),
);

import {
  getLocationData,
  stateAccesor,
  type LocationHierarchy,
} from "@bude/shared/data/locations";

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit("update:modelValue", val),
});

const profilePhoto = ref<File[]>([]);
const coverImage = ref<File[]>([]);

// Location Data for two addresses
const permanentLocationData = ref<LocationHierarchy | null>(null);
const currentLocationData = ref<LocationHierarchy | null>(null);
const isLoadingPermanent = ref(false);
const isLoadingCurrent = ref(false);

const updateField = (field: string, value: any) => {
  emit("update:modelValue", {
    ...formData.value,
    [field]: value,
  });
};

const updateAddressField = (
  type: "permanent" | "current",
  field: string,
  value: any,
) => {
  const currentAddr = formData.value[`${type}Address`] || {};
  const updatedAddr = { ...currentAddr, [field]: value };

  const updates: any = { [`${type}Address`]: updatedAddr };

  // "Same as Permanent" logic
  if (type === "permanent" && formData.value.currentSameAsPermanent) {
    updates.currentAddress = updatedAddr;
  }

  emit("update:modelValue", {
    ...formData.value,
    ...updates,
  });
};

// State options
const stateOptions = computed(() => {
  return Object.keys(stateAccesor).sort();
});

// Generic helper to get options for any address object
const getDistrictOptions = (locData: LocationHierarchy | null) => {
  if (!locData) return [];
  return locData.districts.map((d) => d.name).sort();
};

const getTalukaOptions = (
  locData: LocationHierarchy | null,
  districtName: string,
) => {
  if (!locData || !districtName || districtName === "Other") return [];
  const district = locData.districts.find((d) => d.name === districtName);
  return district ? district.talukas.map((t) => t.name).sort() : [];
};

const getVillageOptions = (
  locData: LocationHierarchy | null,
  districtName: string,
  talukaName: string,
) => {
  if (!locData || !districtName || !talukaName || talukaName === "Other")
    return [];
  const district = locData.districts.find((d) => d.name === districtName);
  if (!district) return [];
  const taluka = district.talukas.find((t) => t.name === talukaName);
  return taluka ? taluka.villages.sort() : [];
};

// Search Handlers Factory
const createAddressSearchHandler = (options: string[]) => {
  return (query: string): SearchResult[] => {
    const filtered = options
      .filter((opt) => opt.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50);

    const results = filtered.map((opt) => ({
      title: opt,
      icon: MapPin,
      data: opt,
    }));

    if (!results.some((r) => r.title === "Other")) {
      results.push({
        title: "Other",
        icon: MapPin,
        data: "Other",
      });
    }

    return results;
  };
};

const searchStates = computed(() =>
  createAddressSearchHandler(stateOptions.value),
);

// Watch for Permanent Address changes
watch(
  () => formData.value.permanentAddress?.state,
  async (newState) => {
    if (newState && newState !== "Other") {
      isLoadingPermanent.value = true;
      permanentLocationData.value = await getLocationData(newState);
      isLoadingPermanent.value = false;
    } else {
      permanentLocationData.value = null;
    }
  },
);

// Watch for Current Address changes
watch(
  () => formData.value.currentAddress?.state,
  async (newState) => {
    if (newState && newState !== "Other") {
      isLoadingCurrent.value = true;
      currentLocationData.value = await getLocationData(newState);
      isLoadingCurrent.value = false;
    } else {
      currentLocationData.value = null;
    }
  },
);

// Reset dependent fields helper
const resetFields = (type: "permanent" | "current", fields: string[]) => {
  const addr = { ...(formData.value[`${type}Address`] || {}) };
  fields.forEach((f) => {
    delete addr[f];
    delete addr[`${f}Other`];
  });
  updateField(`${type}Address`, addr);
};

// Permanent Address field resets
watch(
  () => formData.value.permanentAddress?.state,
  (val, old) => {
    if (val !== old)
      resetFields("permanent", ["district", "taluka", "village"]);
  },
);
watch(
  () => formData.value.permanentAddress?.district,
  (val, old) => {
    if (val !== old) resetFields("permanent", ["taluka", "village"]);
  },
);
watch(
  () => formData.value.permanentAddress?.taluka,
  (val, old) => {
    if (val !== old) resetFields("permanent", ["village"]);
  },
);

// Current Address field resets
watch(
  () => formData.value.currentAddress?.state,
  (val, old) => {
    if (val !== old) resetFields("current", ["district", "taluka", "village"]);
  },
);
watch(
  () => formData.value.currentAddress?.district,
  (val, old) => {
    if (val !== old) resetFields("current", ["taluka", "village"]);
  },
);
watch(
  () => formData.value.currentAddress?.taluka,
  (val, old) => {
    if (val !== old) resetFields("current", ["village"]);
  },
);

// Same as Permanent sync
watch(
  () => formData.value.currentSameAsPermanent,
  (newVal) => {
    if (newVal) {
      updateField("currentAddress", { ...formData.value.permanentAddress });
    }
  },
);

onMounted(async () => {
  if (
    formData.value.permanentAddress?.state &&
    formData.value.permanentAddress.state !== "Other"
  ) {
    isLoadingPermanent.value = true;
    permanentLocationData.value = await getLocationData(
      formData.value.permanentAddress.state,
    );
    isLoadingPermanent.value = false;
  }
  if (
    !formData.value.currentSameAsPermanent &&
    formData.value.currentAddress?.state &&
    formData.value.currentAddress.state !== "Other"
  ) {
    isLoadingCurrent.value = true;
    currentLocationData.value = await getLocationData(
      formData.value.currentAddress.state,
    );
    isLoadingCurrent.value = false;
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
    </div>

    <!-- Professional Information -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Professional Information</h3>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>Primary Role (Syncs to HR Portal)</Label>
          <SearchInput
            :placeholder="
              formData.primaryRole || 'Search Roles (e.g. Software Engineer)'
            "
            :on-search="searchRoles"
            @select="(result) => updateField('primaryRole', result.title)"
          />
        </div>

        <div class="space-y-2">
          <Label>Department (Syncs to HR Portal)</Label>
          <SearchInput
            :placeholder="formData.department || 'Search Departments...'"
            :on-search="searchDepartments"
            @select="(result) => updateField('department', result.title)"
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
              <SelectItem
                v-for="level in seniorityLevels"
                :key="level.value"
                :value="level.value"
              >
                {{ level.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Address Information -->
    <div class="space-y-6">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <MapPin class="h-5 w-5 text-primary" />
          Permanent Address
        </h3>

        <div class="grid grid-cols-1 gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Address Line 1</Label>
              <Input
                :model-value="formData.permanentAddress?.addressLine1"
                @update:model-value="
                  updateAddressField('permanent', 'addressLine1', $event)
                "
                placeholder="House No, Building Name"
              />
            </div>
            <div class="space-y-2">
              <Label>Address Line 2</Label>
              <Input
                :model-value="formData.permanentAddress?.addressLine2"
                @update:model-value="
                  updateAddressField('permanent', 'addressLine2', $event)
                "
                placeholder="Street, Area, Landmark"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Pincode</Label>
              <Input
                :model-value="formData.permanentAddress?.pincode"
                @update:model-value="
                  updateAddressField(
                    'permanent',
                    'pincode',
                    $event.replace(/\D/g, ''),
                  )
                "
                placeholder="400001"
                maxlength="6"
              />
            </div>
            <div class="space-y-2">
              <Label>State</Label>
              <SearchInput
                :placeholder="
                  formData.permanentAddress?.state || 'Search State...'
                "
                :on-search="searchStates"
                @select="
                  (result) =>
                    updateAddressField('permanent', 'state', result.title)
                "
              />
              <Input
                v-if="formData.permanentAddress?.state === 'Other'"
                placeholder="Enter State Name"
                :model-value="formData.permanentAddress?.stateOther"
                @update:model-value="
                  updateAddressField('permanent', 'stateOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>

          <div
            v-if="
              formData.permanentAddress?.state &&
              formData.permanentAddress.state !== 'Other'
            "
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div class="space-y-2">
              <Label>District</Label>
              <SearchInput
                :placeholder="
                  isLoadingPermanent
                    ? 'Loading...'
                    : formData.permanentAddress?.district ||
                      'Search District...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getDistrictOptions(permanentLocationData),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('permanent', 'district', result.title)
                "
              />
              <Input
                v-if="formData.permanentAddress?.district === 'Other'"
                placeholder="Enter District Name"
                :model-value="formData.permanentAddress?.districtOther"
                @update:model-value="
                  updateAddressField('permanent', 'districtOther', $event)
                "
                class="mt-2"
              />
            </div>

            <div
              v-if="
                formData.permanentAddress?.district &&
                formData.permanentAddress.district !== 'Other'
              "
              class="space-y-2"
            >
              <Label>Taluka</Label>
              <SearchInput
                :placeholder="
                  formData.permanentAddress?.taluka || 'Search Taluka...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getTalukaOptions(
                      permanentLocationData,
                      formData.permanentAddress.district,
                    ),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('permanent', 'taluka', result.title)
                "
              />
              <Input
                v-if="formData.permanentAddress?.taluka === 'Other'"
                placeholder="Enter Taluka Name"
                :model-value="formData.permanentAddress?.talukaOther"
                @update:model-value="
                  updateAddressField('permanent', 'talukaOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>

          <div
            v-if="
              formData.permanentAddress?.taluka &&
              formData.permanentAddress.taluka !== 'Other'
            "
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div class="space-y-2">
              <Label>Village/City</Label>
              <SearchInput
                :placeholder="
                  formData.permanentAddress?.village || 'Search Village...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getVillageOptions(
                      permanentLocationData,
                      formData.permanentAddress.district,
                      formData.permanentAddress.taluka,
                    ),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('permanent', 'village', result.title)
                "
              />
              <Input
                v-if="formData.permanentAddress?.village === 'Other'"
                placeholder="Enter Village Name"
                :model-value="formData.permanentAddress?.villageOther"
                @update:model-value="
                  updateAddressField('permanent', 'villageOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 pt-4 border-t">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <MapPin class="h-5 w-5 text-primary" />
            Current Address
          </h3>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="currentSameAsPermanent"
              :checked="formData.currentSameAsPermanent"
              @change="
                updateField(
                  'currentSameAsPermanent',
                  ($event.target as HTMLInputElement).checked,
                )
              "
              class="h-4 w-4 rounded border-gray-300"
            />
            <Label
              for="currentSameAsPermanent"
              class="text-sm font-normal cursor-pointer text-muted-foreground"
            >
              Same as Permanent Address
            </Label>
          </div>
        </div>

        <div
          v-if="!formData.currentSameAsPermanent"
          class="grid grid-cols-1 gap-4"
        >
          <!-- Same fields as above but for 'currentAddress' -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Address Line 1</Label>
              <Input
                :model-value="formData.currentAddress?.addressLine1"
                @update:model-value="
                  updateAddressField('current', 'addressLine1', $event)
                "
                placeholder="House No, Building Name"
              />
            </div>
            <div class="space-y-2">
              <Label>Address Line 2</Label>
              <Input
                :model-value="formData.currentAddress?.addressLine2"
                @update:model-value="
                  updateAddressField('current', 'addressLine2', $event)
                "
                placeholder="Street, Area, Landmark"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Pincode</Label>
              <Input
                :model-value="formData.currentAddress?.pincode"
                @update:model-value="
                  updateAddressField(
                    'current',
                    'pincode',
                    $event.replace(/\D/g, ''),
                  )
                "
                placeholder="400001"
                maxlength="6"
              />
            </div>
            <div class="space-y-2">
              <Label>State</Label>
              <SearchInput
                :placeholder="
                  formData.currentAddress?.state || 'Search State...'
                "
                :on-search="searchStates"
                @select="
                  (result) =>
                    updateAddressField('current', 'state', result.title)
                "
              />
              <Input
                v-if="formData.currentAddress?.state === 'Other'"
                placeholder="Enter State Name"
                :model-value="formData.currentAddress?.stateOther"
                @update:model-value="
                  updateAddressField('current', 'stateOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>

          <div
            v-if="
              formData.currentAddress?.state &&
              formData.currentAddress.state !== 'Other'
            "
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div class="space-y-2">
              <Label>District</Label>
              <SearchInput
                :placeholder="
                  isLoadingCurrent
                    ? 'Loading...'
                    : formData.currentAddress?.district || 'Search District...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getDistrictOptions(currentLocationData),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('current', 'district', result.title)
                "
              />
              <Input
                v-if="formData.currentAddress?.district === 'Other'"
                placeholder="Enter District Name"
                :model-value="formData.currentAddress?.districtOther"
                @update:model-value="
                  updateAddressField('current', 'districtOther', $event)
                "
                class="mt-2"
              />
            </div>

            <div
              v-if="
                formData.currentAddress?.district &&
                formData.currentAddress.district !== 'Other'
              "
              class="space-y-2"
            >
              <Label>Taluka</Label>
              <SearchInput
                :placeholder="
                  formData.currentAddress?.taluka || 'Search Taluka...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getTalukaOptions(
                      currentLocationData,
                      formData.currentAddress.district,
                    ),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('current', 'taluka', result.title)
                "
              />
              <Input
                v-if="formData.currentAddress?.taluka === 'Other'"
                placeholder="Enter Taluka Name"
                :model-value="formData.currentAddress?.talukaOther"
                @update:model-value="
                  updateAddressField('current', 'talukaOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>

          <div
            v-if="
              formData.currentAddress?.taluka &&
              formData.currentAddress.taluka !== 'Other'
            "
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div class="space-y-2">
              <Label>Village/City</Label>
              <SearchInput
                :placeholder="
                  formData.currentAddress?.village || 'Search Village...'
                "
                :on-search="
                  createAddressSearchHandler(
                    getVillageOptions(
                      currentLocationData,
                      formData.currentAddress.district,
                      formData.currentAddress.taluka,
                    ),
                  )
                "
                @select="
                  (result) =>
                    updateAddressField('current', 'village', result.title)
                "
              />
              <Input
                v-if="formData.currentAddress?.village === 'Other'"
                placeholder="Enter Village Name"
                :model-value="formData.currentAddress?.villageOther"
                @update:model-value="
                  updateAddressField('current', 'villageOther', $event)
                "
                class="mt-2"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground italic"
        >
          Using your permanent address as the current address.
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
          @change="
            updateField('enabled', ($event.target as HTMLInputElement).checked)
          "
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="enabled" class="cursor-pointer">Profile Enabled</Label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="termsAccepted"
          :checked="formData.termsAccepted"
          @change="
            updateField(
              'termsAccepted',
              ($event.target as HTMLInputElement).checked,
            )
          "
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="termsAccepted" class="cursor-pointer">
          I accept the Terms and Conditions *
        </Label>
      </div>
    </div>
  </div>
</template>
