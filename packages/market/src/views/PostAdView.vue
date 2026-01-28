<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  createDraftItem,
  publishItem,
  uploadItemImage,
} from "@bude/shared/api";
import { CascadingCategoryPicker } from "@bude/shared/components";
import type { TaxonomySelection } from "@bude/shared/composables/useTaxonomy";
import ItemCard from "../components/ItemCard.vue";

const router = useRouter();

const step = ref(1);
const isLoading = ref(false);
const error = ref("");

// Taxonomy selection
const taxonomyId = ref("");
const taxonomySelection = ref<TaxonomySelection | null>(null);

function onCategorySelect(selection: TaxonomySelection | null) {
  taxonomySelection.value = selection;
  if (selection) {
    form.value.itemGroup = selection.verticalName;
  } else {
    form.value.itemGroup = "";
  }
}

// Form data
const form = ref({
  itemName: "",
  itemGroup: "",
  description: "",
  condition: "New",
  listingType: "Sell" as any,
  standardRate: 0,
  images: [] as string[],
});

// Mock item for preview
const previewItem = computed(() => ({
  name: "PREVIEW",
  itemCode: "PREVIEW",
  itemName: form.value.itemName || "Your Item Title",
  itemGroup: form.value.itemGroup || "Category",
  description: form.value.description || "Your item description will appear here...",
  condition: form.value.condition,
  listingType: form.value.listingType,
  standardRate: form.value.standardRate,
  image: form.value.images[0] || "",
  creation: new Date().toISOString(),
  owner: "You",
}));

const conditions = ["New", "Open Box", "Refurbished", "Used"];
const listingTypes = [
  { value: "Sell", label: "Sell", icon: "🤝" },
  { value: "Rent", label: "Rent", icon: "🔄" },
  { value: "Surplus", label: "Surplus", icon: "📦" },
  { value: "Scrap", label: "Scrap", icon: "♻️" },
];

const isStep1Valid = computed(() => {
  return form.value.itemName && taxonomyId.value && form.value.condition;
});

const isStep2Valid = computed(() => {
  return form.value.standardRate > 0;
});

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  isLoading.value = true;
  try {
    const result = await uploadItemImage(file);
    form.value.images.push(result.file_url);
  } catch (e) {
    error.value = "Failed to upload image";
  } finally {
    isLoading.value = false;
  }
}

function removeImage(index: number) {
  form.value.images.splice(index, 1);
}

async function handleSubmit() {
  if (step.value === 1) {
    step.value = 2;
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const draft = await createDraftItem({
      itemName: form.value.itemName,
      itemGroup: form.value.itemGroup,
      description: form.value.description,
      images: form.value.images,
      condition: form.value.condition,
      taxonomyId: taxonomyId.value,
      taxonomyPath: taxonomySelection.value?.path || '',
    });

    await publishItem({
      itemCode: draft.itemCode,
      standardRate: form.value.standardRate,
      listingType: form.value.listingType,
    });

    router.push("/my-ads");
  } catch (e: any) {
    error.value = e.message || "Failed to publish listing";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Top Progress Bar -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-1 bg-slate-100">
         <div 
           class="h-full bg-primary-600 transition-all duration-500"
           :style="{ width: step === 1 ? '50%' : '100%' }"
         ></div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-black text-slate-900 tracking-tight">Create Listing</h1>
        <div class="flex items-center gap-4">
          <span class="text-xs font-black uppercase tracking-widest text-slate-400">Step {{ step }} / 2</span>
          <button @click="router.back()" class="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase tracking-widest">Cancel</button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row gap-12">
        
        <!-- Left: Form Wizard -->
        <div class="flex-1 max-w-2xl">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
            
            <!-- Step 1: Details -->
            <div v-if="step === 1" class="space-y-10 animate-fade-in">
              <div class="space-y-1">
                <h2 class="text-3xl font-black text-slate-900 tracking-tight text-center lg:text-left">Item Intelligence</h2>
                <p class="text-slate-500 text-center lg:text-left">Provide precise details to attract verified buyers.</p>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Listing Title *</label>
                  <input
                    v-model="form.itemName"
                    type="text"
                    placeholder="e.g. Caterpillar Diesel Generator 500kVA"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary-500 focus:outline-none transition-all"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Taxonomy Category *</label>
                  <CascadingCategoryPicker
                    v-model="taxonomyId"
                    @update:selection="onCategorySelect"
                    placeholder="Search or browse categories..."
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Condition Standard *</label>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      v-for="c in conditions"
                      :key="c"
                      @click="form.condition = c"
                      :class="[
                        'py-3 rounded-xl border-2 font-black text-xs uppercase tracking-tighter transition-all',
                        form.condition === c
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200',
                      ]"
                    >
                      {{ c }}
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description / Specs</label>
                  <textarea
                    v-model="form.description"
                    rows="5"
                    placeholder="Detailed specifications, usage history, and key features..."
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-primary-500 focus:outline-none transition-all"
                  ></textarea>
                </div>

                <div class="space-y-4">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Visual Assets</label>
                  <div class="grid grid-cols-4 gap-4">
                    <div
                      v-for="(img, index) in form.images"
                      :key="index"
                      class="relative aspect-square rounded-2xl overflow-hidden shadow-lg group"
                    >
                      <img :src="img" class="w-full h-full object-cover" />
                      <button
                        @click="removeImage(index)"
                        class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                    <label
                      v-if="form.images.length < 8"
                      class="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/30 transition-all group"
                    >
                      <span class="text-3xl filter group-hover:scale-110 transition-transform">📸</span>
                      <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Add Asset</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                    </label>
                  </div>
                  <p class="text-[10px] text-slate-400 text-center">Upload up to 8 high-resolution JPEG/PNG files.</p>
                </div>
              </div>
            </div>

            <!-- Step 2: Commercial Logics -->
            <div v-else-if="step === 2" class="space-y-10 animate-fade-in">
              <div class="space-y-1">
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Commercial Logics</h2>
                <p class="text-slate-500">Define how the market will interact with your listing.</p>
              </div>

              <div class="space-y-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Trade Mechanism</label>
                  <div class="grid grid-cols-2 gap-4">
                    <button
                      v-for="type in listingTypes"
                      :key="type.value"
                      @click="form.listingType = type.value as any"
                      class="group relative h-24 rounded-2xl overflow-hidden border-2 transition-all text-left p-4"
                      :class="[
                        form.listingType === type.value
                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                          : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                      ]"
                    >
                      <div class="flex flex-col justify-between h-full">
                         <span class="text-2xl">{{ type.icon }}</span>
                         <span class="font-black text-sm uppercase tracking-widest" :class="form.listingType === type.value ? 'text-primary-700' : 'text-slate-400'">{{ type.label }}</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Market Price (₹) *</label>
                  <div class="relative">
                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                    <input
                      v-model.number="form.standardRate"
                      type="number"
                      min="0"
                      class="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-12 pr-6 py-6 text-3xl font-black text-slate-950 focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-200"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="text-[10px] text-slate-400 ml-2">Set a competitive price based on BudeGlobal market trends.</p>
                </div>
              </div>
            </div>

            <!-- Global Error -->
            <p v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 mt-8">{{ error }}</p>

            <!-- Actions -->
            <div class="flex gap-4 mt-12 bg-white pt-8 sticky bottom-0">
              <button
                v-if="step > 1"
                @click="step--"
                class="flex-1 px-8 py-5 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                @click="handleSubmit"
                :disabled="
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isStep2Valid) ||
                  isLoading
                "
                class="flex-1 px-8 py-5 bg-slate-950 text-white font-black rounded-2xl shadow-2xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-widest"
              >
                <template v-if="isLoading">Processing Listing...</template>
                <template v-else-if="step === 1">Continue to Pricing</template>
                <template v-else>Publish Master Listing 🚀</template>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Live Preview -->
        <div class="hidden lg:block w-96 relative">
          <div class="sticky top-28">
            <div class="mb-6 flex justify-between items-center px-4">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Live Preview</h3>
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            
            <!-- Real Card Component -->
            <div class="scale-105 origin-top transform-gpu">
                <ItemCard :item="previewItem as any" class="shadow-[0_20px_50px_rgba(0,0,0,0.1)] !pointer-events-none" />
                
                <!-- Helpful Tip -->
                <div class="mt-12 bg-primary-600 text-white p-6 rounded-3xl shadow-xl space-y-2 animate-bounce-slow">
                   <p class="font-black text-sm">💡 Pro Tip</p>
                   <p class="text-xs text-white/80 leading-relaxed">High-quality images and specific technical details can increase inquiries by up to 85%.</p>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
