<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { postJob, getSkills } from "@bude/shared/api";
import { Button } from "@bude/shared/components";
import type { Skill } from "@bude/shared/types";
import JobCard from "../components/JobCard.vue";

const router = useRouter();
const skills = ref<Skill[]>([]);
const isLoading = ref(false);
const error = ref("");
const skillInput = ref("");

const form = ref({
  title: "",
  description: "",
  budgetRange: "",
  skillsRequired: [] as string[],
  deadline: "",
});

const step = ref(1);

// Mock job for preview
const previewJob = computed(() => ({
  name: "PREVIEW",
  title: form.value.title || "Job Title",
  description: form.value.description || "Project description will appear here as you type...",
  budgetRange: form.value.budgetRange || "₹ Negotiable",
  skillsRequired: form.value.skillsRequired,
  deadline: form.value.deadline,
  status: "Open",
  posterName: "You",
  clientName: "Your Company",
  bidsCount: 0,
  created: new Date().toISOString(),
}));

async function loadSkills() {
  try {
    skills.value = await getSkills();
  } catch (e) {
    console.error("Failed to load skills:", e);
  }
}

function addSkill() {
  if (
    skillInput.value &&
    !form.value.skillsRequired.includes(skillInput.value)
  ) {
    form.value.skillsRequired.push(skillInput.value);
    skillInput.value = "";
  }
}

function removeSkill(skill: string) {
  form.value.skillsRequired = form.value.skillsRequired.filter(
    (s) => s !== skill,
  );
}

const isStep1Valid = computed(() => {
  return form.value.title.length > 5 && form.value.description.length > 20;
});

const isStep2Valid = computed(() => {
  return form.value.budgetRange && form.value.skillsRequired.length > 0;
});

async function handleSubmit() {
  if (step.value === 1) {
    step.value = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    await postJob({
      title: form.value.title,
      description: form.value.description,
      budgetRange: form.value.budgetRange,
      skillsRequired: form.value.skillsRequired,
      deadline: form.value.deadline || undefined,
    });
    router.push("/my-jobs");
  } catch (e: any) {
    error.value = e.message || "Failed to post job";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadSkills);
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Progress & Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-1 bg-slate-100">
         <div 
           class="h-full bg-primary-600 transition-all duration-700"
           :style="{ width: step === 1 ? '50%' : '100%' }"
         ></div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Post a High-Impact Job</h1>
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-end">
             <span class="text-[10px] font-black uppercase tracking-[0.2rem] text-slate-400">Step {{ step }} / 2</span>
             <span class="text-xs font-bold text-slate-500">{{ step === 1 ? 'Core Scope' : 'Terms & Talent' }}</span>
          </div>
          <button @click="router.back()" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">×</button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row gap-16">
        
        <!-- Left: Intelligence Form -->
        <div class="flex-1 max-w-2xl">
          <div class="bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
            
            <!-- Step 1: Definition -->
            <div v-if="step === 1" class="space-y-10 animate-slide-up">
              <div class="space-y-2">
                <h2 class="text-3xl font-black text-slate-900 tracking-tighter">Define the Ambition.</h2>
                <p class="text-slate-500 font-medium">Clarity attracts the most elite professionals in our network.</p>
              </div>

              <div class="space-y-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Job Title *</label>
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="e.g. Lead ERPNext Architect for Global Supply Chain"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-300"
                  />
                  <p class="text-[9px] text-slate-400 ml-2 uppercase tracking-wide">Must be at least 5 characters.</p>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Vision & Requirements *</label>
                  <textarea
                    v-model="form.description"
                    rows="8"
                    placeholder="Provide a comprehensive breakdown of the project goals, tech stack, and expected deliverables..."
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-slate-900 font-medium focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-300 leading-relaxed"
                  ></textarea>
                  <p class="text-[9px] text-slate-400 ml-2 uppercase tracking-wide">Detailed descriptions receive 5x more qualified responses.</p>
                </div>
              </div>
            </div>

            <!-- Step 2: Logistics & Talent -->
            <div v-else-if="step === 2" class="space-y-10 animate-slide-up">
              <div class="space-y-2">
                <h2 class="text-3xl font-black text-slate-900 tracking-tighter">Talent & Logistics.</h2>
                <p class="text-slate-500 font-medium">Specify the expertise and commercial terms for the project.</p>
              </div>

              <div class="space-y-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Remuneration Framework *</label>
                  <div class="relative">
                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                    <input
                      v-model="form.budgetRange"
                      type="text"
                      placeholder="e.g. 50,000 - 80,000 / month"
                      class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-5 text-xl font-black text-slate-950 focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stack Intelligence (Required Skills) *</label>
                  <div class="flex gap-3">
                    <select v-model="skillInput" class="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Select an Expertise</option>
                      <option v-for="skill in skills" :key="skill.skill_name" :value="skill.skill_name">{{ skill.skill_name }}</option>
                    </select>
                    <button type="button" @click="addSkill" class="px-8 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-primary-600 transition-all text-xs uppercase tracking-widest">Add</button>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 pt-2">
                    <div
                      v-for="skill in form.skillsRequired"
                      :key="skill"
                      class="px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl text-primary-700 text-xs font-black uppercase tracking-tight flex items-center gap-2"
                    >
                      {{ skill }}
                      <button @click="removeSkill(skill)" class="hover:text-red-500 transition-colors">×</button>
                    </div>
                    <div v-if="form.skillsRequired.length === 0" class="w-full text-center py-8 rounded-2xl border-2 border-dashed border-slate-100 text-slate-300 font-black text-[10px] uppercase tracking-widest">
                      No Expertise Selected Yet
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Deadline (Dynamic)</label>
                  <input v-model="form.deadline" type="date" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary-500 focus:outline-none transition-all" />
                </div>
              </div>
            </div>

            <!-- Error Feedback -->
            <p v-if="error" class="bg-red-50 text-red-600 p-5 rounded-3xl text-xs font-black border border-red-100 mt-10 animate-shake">
              {{ error }}
            </p>

            <!-- Wizard Controls -->
            <div class="flex gap-6 mt-12 pt-10 border-t border-slate-50 bg-white sticky bottom-0">
              <button
                v-if="step > 1"
                @click="step--"
                class="flex-1 px-10 py-5 border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all"
              >
                ← Back
              </button>
              <button
                @click="handleSubmit"
                :disabled="
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isStep2Valid) ||
                  isLoading
                "
                class="flex-1 px-10 py-5 bg-slate-950 text-white font-black rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-primary-600 hover:shadow-primary-600/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-[0.2em]"
              >
                <template v-if="isLoading">Finalizing Post...</template>
                <template v-else-if="step === 1">Define Terms →</template>
                <template v-else>Broadcast Project 🚀</template>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Live Preview -->
        <div class="hidden lg:block w-96 relative">
          <div class="sticky top-32">
            <div class="flex items-center justify-between mb-8 px-2">
               <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Card Preview</span>
               <div class="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  Live
               </div>
            </div>

            <div class="scale-110 origin-top transform-gpu">
              <JobCard :job="previewJob as any" class="!shadow-2xl !pointer-events-none !border-2 !border-primary-500/10" />

              <!-- UX Education -->
              <div class="mt-16 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                 <div class="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-600/20 transition-all duration-700"></div>
                 <h4 class="text-white font-black text-sm mb-3">Professional Tip</h4>
                 <p class="text-slate-400 text-xs leading-relaxed font-medium">Bude-certified freelancers prioritize jobs with clear deliverables and a well-defined budget framework.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
}
</style>
