<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@bude/shared";
import {
  Button,
  Input,
  LoadingSkeleton,
  BottomNav,
} from "@bude/shared/components";
import * as authApi from "@bude/shared/api/auth";

const router = useRouter();
const userStore = useUserStore();

// State
const idType = ref("");
const idNumber = ref("");
const idImage = ref<File | null>(null);
const previewUrl = ref("");
const agreedToTerms = ref(false);
const isSubmitting = ref(false);
const error = ref("");
const kycStatus = ref<{
  status: string;
  verified: boolean;
  can_submit: boolean;
  details?: {
    id_type: string;
    status: string;
    rejection_reason?: string;
    creation: string;
  };
} | null>(null);
const isLoading = ref(true);

const idTypes = [
  { value: "aadhaar", label: "Aadhaar Card", placeholder: "123456789012" },
  { value: "pan", label: "PAN Card", placeholder: "ABCDE1234F" },
  { value: "passport", label: "Passport", placeholder: "A1234567" },
  { value: "driving_license", label: "Driving License", placeholder: "DL-1234567890" },
  { value: "voter_id", label: "Voter ID", placeholder: "ABC1234567" },
];

const selectedIdType = computed(() => {
  return idTypes.find((t) => t.value === idType.value);
});

const canSubmit = computed(() => {
  return (
    idType.value &&
    idNumber.value &&
    idImage.value &&
    agreedToTerms.value &&
    !isSubmitting.value
  );
});

async function loadKycStatus() {
  isLoading.value = true;
  try {
    const response = await authApi.getKycStatus();
    kycStatus.value = response;
  } catch (e) {
    console.error("Failed to load KYC status:", e);
  } finally {
    isLoading.value = false;
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Image must be less than 5MB";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      error.value = "Please upload an image file";
      return;
    }

    idImage.value = file;
    previewUrl.value = URL.createObjectURL(file);
    error.value = "";
  }
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("is_private", "1");
  formData.append("folder", "Home/KYC");

  const response = await fetch("/api/method/upload_file", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return data.message.file_url;
}

async function handleSubmit() {
  if (!canSubmit.value || !idImage.value) return;

  isSubmitting.value = true;
  error.value = "";

  try {
    // Upload image first
    const imageUrl = await uploadFile(idImage.value);

    // Submit KYC
    await authApi.requestKyc({
      id_type: idType.value,
      id_number: idNumber.value,
      id_image: imageUrl,
    });

    // Reload status
    await loadKycStatus();

    // Refresh user data
    await userStore.fetchCurrentUser();
  } catch (e: any) {
    error.value = e.message || "Failed to submit KYC";
  } finally {
    isSubmitting.value = false;
  }
}

async function cancelKyc() {
  if (!confirm("Are you sure you want to cancel your KYC request?")) return;

  isSubmitting.value = true;
  try {
    await authApi.cancelKyc();
    await loadKycStatus();
  } catch (e: any) {
    error.value = e.message || "Failed to cancel KYC";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadKycStatus();
});
</script>

<template>
  <div class="kyc-view">
    <div class="max-w-lg mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
        <p class="text-gray-500 mt-1">
          Get a verified badge to build trust with buyers
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-4">
        <LoadingSkeleton height="6rem" />
        <LoadingSkeleton height="20rem" />
      </div>

      <!-- Verified State -->
      <div v-else-if="kycStatus?.verified" class="card p-6 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Account Verified!</h2>
        <p class="text-gray-600 mb-4">
          Your identity has been verified. You now have a verified badge on your profile.
        </p>
        <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Verified
        </div>
      </div>

      <!-- Pending State -->
      <div v-else-if="kycStatus?.status === 'Pending'" class="card p-6 text-center">
        <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Verification in Progress</h2>
        <p class="text-gray-600 mb-4">
          We're reviewing your documents. This usually takes 24-48 hours.
        </p>
        <p class="text-sm text-gray-500 mb-4">
          Submitted: {{ kycStatus.details?.creation ? new Date(kycStatus.details.creation).toLocaleDateString() : '' }}
        </p>
        <Button variant="ghost" @click="cancelKyc" :loading="isSubmitting">
          Cancel Request
        </Button>
      </div>

      <!-- Rejected State -->
      <div v-else-if="kycStatus?.status === 'Rejected'" class="space-y-4">
        <div class="card p-6 bg-red-50 border-red-200">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-red-900">Verification Rejected</h3>
              <p class="text-red-700 text-sm mt-1">
                {{ kycStatus.details?.rejection_reason || 'Your verification was rejected. Please try again with valid documents.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Show form for resubmission -->
        <div class="card p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Submit Again</h3>
          <KycForm />
        </div>
      </div>

      <!-- Form State -->
      <div v-else class="space-y-6">
        <!-- Benefits -->
        <div class="grid grid-cols-3 gap-3">
          <div class="card p-4 text-center">
            <div class="text-2xl mb-2">&#10004;</div>
            <h3 class="font-semibold text-sm">Verified Badge</h3>
            <p class="text-xs text-gray-500">Stand out from others</p>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl mb-2">&#128200;</div>
            <h3 class="font-semibold text-sm">Higher Trust</h3>
            <p class="text-xs text-gray-500">More buyer confidence</p>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl mb-2">&#128274;</div>
            <h3 class="font-semibold text-sm">Secure</h3>
            <p class="text-xs text-gray-500">Data encrypted</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="card p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ID Type
            </label>
            <select
              v-model="idType"
              class="input w-full"
              required
            >
              <option value="">Select ID Type</option>
              <option v-for="type in idTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <Input
              v-model="idNumber"
              :placeholder="selectedIdType?.placeholder || 'Enter ID number'"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Upload ID Photo
            </label>
            <p class="text-sm text-gray-500 mb-2">
              Clear photo showing all details
            </p>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              required
            />
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="ID Preview"
              class="mt-3 max-w-full rounded-lg border"
            />
          </div>

          <div class="flex items-start">
            <input
              type="checkbox"
              v-model="agreedToTerms"
              id="terms"
              class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              I agree to share this information for verification purposes. My data will be handled according to the
              <router-link to="/privacy" class="text-primary-600 hover:underline">Privacy Policy</router-link>.
            </label>
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <Button
            type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
            full-width
          >
            Submit for Verification
          </Button>
        </form>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.kyc-view {
  min-height: 100vh;
  background: #f9fafb;
  padding-bottom: 5rem;
}
</style>
