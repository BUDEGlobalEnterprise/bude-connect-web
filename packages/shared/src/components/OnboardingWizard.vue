<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@bude/shared";
import { Button } from "@bude/shared/components";

const router = useRouter();
const userStore = useUserStore();

// Wizard state
const currentStep = ref(1);
const totalSteps = 4;
const isSubmitting = ref(false);

// Form data
const formData = ref({
  // Step 1: Basic Info
  fullName: "",
  avatar: null as File | null,
  avatarPreview: "",
  
  // Step 2: Role Selection
  role: "" as "buyer" | "seller" | "freelancer" | "client" | "",
  
  // Step 3: Role-specific details
  // For Seller
  businessName: "",
  businessType: "",
  
  // For Freelancer
  headline: "",
  bio: "",
  hourlyRate: 500,
  skills: [] as string[],
  
  // Step 4: Location
  city: "",
  state: "",
  phone: "",
});

const steps = [
  { number: 1, title: "Basic Info", description: "Tell us about yourself" },
  { number: 2, title: "Your Role", description: "How will you use BudeGlobal?" },
  { number: 3, title: "Details", description: "Role-specific information" },
  { number: 4, title: "Location", description: "Where are you based?" },
];

const availableSkills = [
  "JavaScript", "Python", "Vue.js", "React", "Node.js",
  "ERPNext", "Frappe", "Web Design", "Mobile App",
  "IoT", "RFID", "Embedded Systems", "Data Analysis",
  "Project Management", "UI/UX Design", "DevOps", "AWS",
];

const businessTypes = [
  "Individual Seller",
  "Small Business",
  "Manufacturer",
  "Wholesaler",
  "Retailer",
  "Service Provider",
];

const indianStates = [
  "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala",
  "Andhra Pradesh", "Punjab", "Haryana", "Bihar", "Odisha",
];

// Progress percentage
const progress = computed(() => ((currentStep.value - 1) / (totalSteps - 1)) * 100);

// Can proceed to next step
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.fullName.trim().length >= 2;
    case 2:
      return formData.value.role !== "";
    case 3:
      if (formData.value.role === "seller") {
        return formData.value.businessName.trim().length > 0;
      }
      if (formData.value.role === "freelancer") {
        return formData.value.headline.trim().length > 0 && formData.value.skills.length > 0;
      }
      return true;
    case 4:
      return formData.value.city.trim().length > 0 && formData.value.state !== "";
    default:
      return true;
  }
});

function nextStep() {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.avatar = target.files[0];
    formData.value.avatarPreview = URL.createObjectURL(target.files[0]);
  }
}

function toggleSkill(skill: string) {
  const index = formData.value.skills.indexOf(skill);
  if (index > -1) {
    formData.value.skills.splice(index, 1);
  } else if (formData.value.skills.length < 8) {
    formData.value.skills.push(skill);
  }
}

async function handleSubmit() {
  if (!canProceed.value) return;
  
  isSubmitting.value = true;
  
  try {
    // Update user profile via API
    await userStore.updateProfile({
      full_name: formData.value.fullName,
      city: formData.value.city,
      state: formData.value.state,
      phone: formData.value.phone,
      role: formData.value.role,
      // Role-specific
      business_name: formData.value.businessName,
      headline: formData.value.headline,
      bio: formData.value.bio,
      hourly_rate: formData.value.hourlyRate,
      skills: formData.value.skills,
    });
    
    // Mark onboarding complete
    localStorage.setItem("onboarding_complete", "true");
    
    // Redirect to home
    router.push("/");
  } catch (error) {
    console.error("Failed to save profile:", error);
  } finally {
    isSubmitting.value = false;
  }
}

function skipOnboarding() {
  localStorage.setItem("onboarding_skipped", "true");
  router.push("/");
}

onMounted(() => {
  // Pre-fill with existing user data
  if (userStore.user) {
    formData.value.fullName = userStore.user.full_name || "";
    formData.value.phone = userStore.user.mobile_no || "";
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="/logo.png" alt="BudeGlobal" class="h-12 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to BudeGlobal! 🎉</h1>
        <p class="text-gray-600">Let's set up your profile in a few quick steps</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-600">Step {{ currentStep }} of {{ totalSteps }}</span>
          <button @click="skipOnboarding" class="text-sm text-gray-500 hover:text-gray-700">
            Skip for now →
          </button>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Step Indicators -->
        <div class="flex items-center justify-center gap-4 mb-8">
          <div
            v-for="step in steps"
            :key="step.number"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300',
              currentStep === step.number
                ? 'bg-primary-100 text-primary-700'
                : currentStep > step.number
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            ]"
          >
            <span class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
              :class="currentStep > step.number ? 'bg-green-500 text-white' : 'bg-current/20'"
            >
              <span v-if="currentStep > step.number">✓</span>
              <span v-else>{{ step.number }}</span>
            </span>
            <span class="hidden sm:inline text-sm font-medium">{{ step.title }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="min-h-[300px]">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ steps[0].title }}</h2>
              <p class="text-gray-600">{{ steps[0].description }}</p>
            </div>

            <!-- Avatar Upload -->
            <div class="flex justify-center">
              <label class="cursor-pointer group">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <img v-if="formData.avatarPreview" :src="formData.avatarPreview" class="w-full h-full object-cover" />
                  <span v-else class="text-3xl text-primary-500">📷</span>
                </div>
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                <p class="text-xs text-gray-500 text-center mt-2">Click to upload</p>
              </label>
            </div>

            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="formData.fullName"
                type="text"
                placeholder="Enter your full name"
                class="input text-lg"
              />
            </div>
          </div>

          <!-- Step 2: Role Selection -->
          <div v-else-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ steps[1].title }}</h2>
              <p class="text-gray-600">{{ steps[1].description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="role in [
                  { value: 'buyer', icon: '🛒', title: 'Buyer', desc: 'Browse & purchase goods' },
                  { value: 'seller', icon: '🏪', title: 'Seller', desc: 'List & sell products' },
                  { value: 'freelancer', icon: '💼', title: 'Freelancer', desc: 'Offer your services' },
                  { value: 'client', icon: '🏢', title: 'Client', desc: 'Hire freelancers' },
                ]"
                :key="role.value"
                @click="formData.role = role.value as any"
                :class="[
                  'p-6 rounded-xl border-2 text-left transition-all duration-200',
                  formData.role === role.value
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                ]"
              >
                <span class="text-3xl mb-3 block">{{ role.icon }}</span>
                <h3 class="font-bold text-gray-900">{{ role.title }}</h3>
                <p class="text-sm text-gray-500">{{ role.desc }}</p>
              </button>
            </div>
          </div>

          <!-- Step 3: Role-Specific Details -->
          <div v-else-if="currentStep === 3" class="space-y-6 animate-fade-in">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ steps[2].title }}</h2>
              <p class="text-gray-600">Tell us more about your {{ formData.role }} profile</p>
            </div>

            <!-- Seller Details -->
            <template v-if="formData.role === 'seller'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input v-model="formData.businessName" type="text" placeholder="Your business name" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select v-model="formData.businessType" class="input">
                  <option value="">Select type</option>
                  <option v-for="type in businessTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
            </template>

            <!-- Freelancer Details -->
            <template v-else-if="formData.role === 'freelancer'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Professional Headline *</label>
                <input v-model="formData.headline" type="text" placeholder="e.g., Full Stack Developer | ERPNext Expert" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
                <input v-model.number="formData.hourlyRate" type="number" min="100" step="50" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Skills * (Select up to 8)</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="skill in availableSkills"
                    :key="skill"
                    @click="toggleSkill(skill)"
                    :class="[
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      formData.skills.includes(skill)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ skill }}
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ formData.skills.length }}/8 selected</p>
              </div>
            </template>

            <!-- Buyer/Client - Minimal -->
            <template v-else>
              <div class="text-center py-8 text-gray-500">
                <span class="text-6xl block mb-4">✅</span>
                <p>Great! No additional details needed for now.</p>
                <p class="text-sm">You can update your profile anytime.</p>
              </div>
            </template>
          </div>

          <!-- Step 4: Location -->
          <div v-else-if="currentStep === 4" class="space-y-6 animate-fade-in">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ steps[3].title }}</h2>
              <p class="text-gray-600">{{ steps[3].description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input v-model="formData.city" type="text" placeholder="Your city" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select v-model="formData.state" class="input">
                  <option value="">Select state</option>
                  <option v-for="state in indianStates" :key="state" :value="state">{{ state }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input v-model="formData.phone" type="tel" placeholder="+91 98765 43210" class="input" />
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            v-if="currentStep > 1"
            variant="ghost"
            @click="prevStep"
          >
            ← Back
          </Button>
          <div v-else />

          <Button
            v-if="currentStep < totalSteps"
            :disabled="!canProceed"
            @click="nextStep"
          >
            Continue →
          </Button>
          <Button
            v-else
            :loading="isSubmitting"
            :disabled="!canProceed"
            @click="handleSubmit"
          >
            🚀 Complete Setup
          </Button>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        By continuing, you agree to our 
        <a href="https://budeglobal.in/terms" target="_blank" class="text-primary-600 hover:underline">Terms</a>
        and 
        <a href="https://budeglobal.in/privacy" target="_blank" class="text-primary-600 hover:underline">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>
