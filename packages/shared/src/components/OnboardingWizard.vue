<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@bude/shared";

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
  businessName: "",
  businessType: "",
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
  { number: 1, title: "Identity", description: "Who are you?" },
  { number: 2, title: "Goal", description: "What's your mission?" },
  { number: 3, title: "Expertise", description: "Your unique value" },
  { number: 4, title: "Presence", description: "Where are you?" },
];

const availableSkills = [
  "JavaScript", "Python", "Vue.js", "React", "Node.js",
  "ERPNext", "Frappe", "Web Design", "Mobile App",
  "IoT", "RFID", "Embedded Systems", "Data Analysis",
  "Project Management", "UI/UX Design", "DevOps", "AWS",
];

const businessTypes = [
  "Individual Seller", "Small Business", "Manufacturer", "Wholesaler",
  "Retailer", "Service Provider",
];

const indianStates = [
  "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala",
  "Andhra Pradesh", "Punjab", "Haryana", "Bihar", "Odisha",
];

const roleOptions = [
  { value: 'buyer', icon: '🛒', title: 'Savvy Buyer', desc: 'Sourcing the best bulk deals', color: 'blue' },
  { value: 'seller', icon: '🏪', title: 'Premium Seller', desc: 'Moving inventory at scale', color: 'emerald' },
  { value: 'freelancer', icon: '🔧', title: 'Expert Talent', desc: 'Building the future with code', color: 'indigo' },
  { value: 'client', icon: '🚀', title: 'Visionary Client', desc: 'Hiring the best for my team', color: 'purple' },
] as const;

const progress = computed(() => (currentStep.value / totalSteps) * 100);

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return formData.value.fullName.trim().length >= 2;
    case 2: return formData.value.role !== "";
    case 3:
      if (formData.value.role === "seller") return formData.value.businessName.trim().length > 0;
      if (formData.value.role === "freelancer") return formData.value.headline.trim().length > 0 && formData.value.skills.length > 0;
      return true;
    case 4: return formData.value.city.trim().length > 0 && formData.value.state !== "";
    default: return true;
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
    await userStore.updateProfile({
      fullName: formData.value.fullName,
      city: formData.value.city,
      state: formData.value.state,
      // Generic phone can't go to UpdateProfileData directly as it's not in the interface, 
      // but mobile_no is in User. I'll stick to what the API supports.
      role: formData.value.role || undefined,
      businessName: formData.value.businessName,
      headline: formData.value.headline,
      bio: formData.value.bio,
      hourlyRate: formData.value.hourlyRate,
    });
    localStorage.setItem("onboarding_complete", "true");
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
  if (userStore.user) {
    formData.value.fullName = userStore.user.full_name || "";
    formData.value.phone = userStore.user.mobile_no || "";
  }
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary-500/30">
    <!-- Immersive Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 dark:bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-600/10 dark:bg-secondary-600/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 p-8 flex justify-between items-center">
      <img src="/logo.png" class="h-8 dark:brightness-0 dark:invert transition-all" alt="BudeGlobal" />
      <button @click="skipOnboarding" class="text-muted-foreground hover:text-foreground transition-all text-sm font-black uppercase tracking-widest">
        Skip Profile
      </button>
    </header>

    <!-- Main Content Area -->
    <main class="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
      <div class="w-full max-w-4xl">
        <!-- Progress Steps -->
        <div class="flex justify-between items-center mb-12 relative px-4">
          <!-- Connective Line -->
          <div class="absolute left-0 right-0 h-0.5 bg-muted top-1/2 -translate-y-1/2 z-0"></div>
          <div 
            class="absolute left-0 h-0.5 bg-primary top-1/2 -translate-y-1/2 z-0 transition-all duration-700"
            :style="{ width: `${progress - (100/totalSteps)/2}%` }"
          ></div>

          <div 
            v-for="step in steps" 
            :key="step.number"
            class="relative z-10 flex flex-col items-center"
          >
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500"
              :class="[
                currentStep === step.number ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--bude-primary-500),0.3)] scale-110' :
                currentStep > step.number ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              ]"
            >
              <span v-if="currentStep > step.number">✓</span>
              <span v-else>{{ step.number }}</span>
            </div>
            <p 
              class="absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-colors duration-500"
              :class="currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'"
            >
              {{ step.title }}
            </p>
          </div>
        </div>

        <!-- Step Container (Glassmorphism) -->
        <div class="bg-card/20 dark:bg-card/10 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col transition-all">
          
          <!-- Transition Wrapper -->
          <div class="flex-1 flex flex-col">
            
            <!-- Step 1: Identity -->
            <div v-if="currentStep === 1" class="animate-enter-right space-y-10">
              <div class="text-center space-y-4">
                <h2 class="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Welcome to the inner circle.</h2>
                <p class="text-muted-foreground text-lg">Let's start with the basics. Who are we talking to?</p>
              </div>

              <div class="flex flex-col items-center space-y-8">
                <!-- Advanced Avatar Upload -->
                <label class="group cursor-pointer relative">
                  <div class="w-40 h-40 rounded-[2.5rem] bg-muted/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary group-hover:bg-muted">
                    <img v-if="formData.avatarPreview" :src="formData.avatarPreview" class="w-full h-full object-cover" />
                    <div v-else class="text-center space-y-2">
                       <span class="text-5xl">👤</span>
                       <p class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">Add Photo</p>
                    </div>
                  </div>
                  <input type="file" @change="handleAvatarChange" class="hidden" accept="image/*" />
                  <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    +
                  </div>
                </label>

                <div class="w-full max-w-md">
                   <div class="relative group">
                      <input 
                        v-model="formData.fullName"
                        type="text" 
                        class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-5 text-foreground text-xl font-bold placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                        placeholder="Your full legal name"
                      />
                      <span class="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">✎</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Role Selection -->
            <div v-else-if="currentStep === 2" class="animate-enter-right space-y-10">
              <div class="text-center space-y-4">
                <h2 class="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Choose your path.</h2>
                <p class="text-muted-foreground text-lg">How will you contribute to the BudeGlobal ecosystem?</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Color-coded role options with correct mapping -->
                <button
                  v-for="opt in roleOptions"
                  :key="opt.value"
                  @click="formData.role = opt.value"
                  class="group relative p-8 rounded-[2.5rem] text-left transition-all duration-500 border-2"
                  :class="[
                    formData.role === opt.value ? (
                      opt.color === 'blue' ? 'bg-primary border-primary/50 text-primary-foreground' :
                      opt.color === 'emerald' ? 'bg-success border-success/50 text-success-foreground' :
                      opt.color === 'indigo' ? 'bg-indigo-600 border-indigo-500 text-white' :
                      'bg-purple-600 border-purple-500 text-white'
                    ) + ' shadow-xl' : 
                    'bg-muted/30 border-border hover:border-primary/50'
                  ]"
                >
                  <span class="text-4xl mb-6 block filter group-hover:scale-125 transition-transform duration-500">{{ opt.icon }}</span>
                  <h3 
                    class="text-2xl font-black tracking-tight transition-colors"
                  >
                    {{ opt.title }}
                  </h3>
                  <p 
                    class="text-sm font-medium mt-2 transition-colors opacity-90"
                  >
                    {{ opt.desc }}
                  </p>
                  
                  <!-- Checkmark -->
                  <div 
                    v-if="formData.role === opt.value" 
                    class="absolute top-8 right-8 w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md"
                  >
                    <span class="text-sm">✓</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 3: Expertise Details -->
            <div v-else-if="currentStep === 3" class="animate-enter-right space-y-10">
              <div class="text-center space-y-4">
                <h2 class="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Detail your strength.</h2>
                <p class="text-muted-foreground text-lg">Help us tailor your experience based on your {{ formData.role }} profile.</p>
              </div>

              <!-- Seller Path -->
              <div v-if="formData.role === 'seller'" class="max-w-xl mx-auto space-y-6 text-left">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Business Presence</label>
                  <input v-model="formData.businessName" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all" placeholder="Registered Business Name" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Industry Type</label>
                  <select v-model="formData.businessType" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer">
                    <option v-for="t in businessTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>

              <!-- Freelancer Path -->
              <div v-else-if="formData.role === 'freelancer'" class="space-y-8 text-left">
                <div class="grid md:grid-cols-2 gap-8 text-left">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">The Hook</label>
                    <input v-model="formData.headline" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all" placeholder="Principal Data Architect | AWS Certified" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Hourly Rate (₹)</label>
                    <input v-model.number="formData.hourlyRate" type="number" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 text-center block">Select your tech stack (Up to 8)</label>
                  <div class="flex flex-wrap gap-2 justify-center">
                    <button 
                      v-for="s in availableSkills" :key="s"
                      @click="toggleSkill(s)"
                      class="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all"
                      :class="formData.skills.includes(s) ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--bude-primary-500),0.3)]' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
                    >
                      {{ s }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Minimal Paths -->
              <div v-else class="flex flex-col items-center py-12 text-muted-foreground animate-pulse">
                <span class="text-6xl mb-6">🥂</span>
                <p class="text-xl font-bold">You're all set for the next phase.</p>
                <p class="text-sm font-medium mt-2 tracking-widest uppercase">No additional data required</p>
              </div>
            </div>

            <!-- Step 4: Presence -->
            <div v-else-if="currentStep === 4" class="animate-enter-right space-y-10">
               <div class="text-center space-y-4">
                <h2 class="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Locate your impact.</h2>
                <p class="text-muted-foreground text-lg">Local presence ensures faster trade and secure verification.</p>
              </div>

              <div class="max-w-2xl mx-auto space-y-8 text-left">
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2 group">
                      <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 group-focus-within:text-primary transition-colors">Primary City</label>
                      <input v-model="formData.city" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all" placeholder="e.g., Chennai" />
                    </div>
                    <div class="space-y-2 group">
                      <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 group-focus-within:text-primary transition-colors">Regional State</label>
                      <select v-model="formData.state" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer">
                        <option v-for="s in indianStates" :key="s" :value="s">{{ s }}</option>
                      </select>
                    </div>
                </div>

                <div class="space-y-2 group">
                  <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 group-focus-within:text-primary transition-colors">Secure Contact Link (Phone)</label>
                  <input v-model="formData.phone" class="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-5 text-foreground text-xl font-bold focus:border-primary focus:outline-none transition-all" placeholder="+91 XXXX XXX XXX" />
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Navigation Controls -->
          <div class="mt-12 flex items-center justify-between pt-8 border-t border-border/50">
            <button 
              v-if="currentStep > 1" 
              @click="prevStep" 
              class="px-8 py-4 text-muted-foreground hover:text-foreground transition-colors font-black uppercase tracking-widest text-xs"
            >
              ← Previous
            </button>
            <div v-else></div>

            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              :disabled="!canProceed"
              class="group px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              Continue Process
            </button>
            <button
              v-else
              @click="handleSubmit"
              :disabled="!canProceed || isSubmitting"
              class="group px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 hover:bg-primary/90 shadow-lg active:scale-95"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                 <div class="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                 Finalizing...
              </span>
              <span v-else>Initiate Membership 🚀</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Interactive Footer -->
    <footer class="relative z-10 p-8 flex justify-center">
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground text-center">
        Secured by <span class="text-foreground">BudeGlobal Encryption Standard</span>
      </p>
    </footer>
  </div>
</template>

<style scoped>
@keyframes enter-right {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-enter-right {
  animation: enter-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
