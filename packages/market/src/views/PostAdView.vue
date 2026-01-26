<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  createDraftItem,
  publishItem,
  uploadItemImage,
  getCategories,
} from "@bude/shared/api";

const router = useRouter();

const step = ref(1);
const isLoading = ref(false);
const error = ref("");
const categories = ref<{ name: string; count: number }[]>([]);

// Form data
const form = ref({
  itemName: "",
  itemGroup: "",
  description: "",
  condition: "",
  listingType: "Sell" as const,
  standardRate: 0,
  images: [] as string[],
});

const conditions = ["New", "Open Box", "Refurbished", "Used"];
const listingTypes = [
  { value: "Sell", label: "Sell", icon: "🛒" },
  { value: "Rent", label: "Rent", icon: "🔄" },
  { value: "Surplus", label: "Surplus", icon: "📦" },
  { value: "Scrap", label: "Scrap", icon: "♻️" },
];

const isStep1Valid = computed(() => {
  return form.value.itemName && form.value.itemGroup && form.value.condition;
});

const isStep2Valid = computed(() => {
  return form.value.standardRate > 0;
});

async function loadCategories() {
  try {
    categories.value = await getCategories();
  } catch (e) {
    console.error("Failed to load categories:", e);
  }
}

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
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    // Create draft
    const draft = await createDraftItem({
      itemName: form.value.itemName,
      itemGroup: form.value.itemGroup,
      description: form.value.description,
      images: form.value.images,
      condition: form.value.condition,
    });

    // Publish
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

// Load categories on mount
loadCategories();
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Post a New Ad</h1>

    <!-- Progress -->
    <div class="flex items-center gap-4 mb-8">
      <div
        v-for="s in 2"
        :key="s"
        :class="[
          'flex-1 h-2 rounded-full transition-colors',
          step >= s ? 'bg-primary-500' : 'bg-gray-200',
        ]"
      ></div>
    </div>

    <div class="card p-6">
      <!-- Step 1: Basic Info -->
      <div v-if="step === 1" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            v-model="form.itemName"
            type="text"
            placeholder="What are you selling?"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select v-model="form.itemGroup" class="input">
            <option value="">Select a category</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Condition *
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="c in conditions"
              :key="c"
              @click="form.condition = c"
              :class="[
                'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                form.condition === c
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Describe your item..."
            class="input"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(img, index) in form.images"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden"
            >
              <img :src="img" class="w-full h-full object-cover" />
              <button
                @click="removeImage(index)"
                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
            <label
              v-if="form.images.length < 8"
              class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span class="text-xs text-gray-500 mt-1">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Step 2: Price & Type -->
      <div v-if="step === 2" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Listing Type
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in listingTypes"
              :key="type.value"
              @click="form.listingType = type.value as any"
              :class="[
                'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                form.listingType === type.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              {{ type.icon }} {{ type.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) *
          </label>
          <input
            v-model.number="form.standardRate"
            type="number"
            min="0"
            placeholder="Enter price"
            class="input text-xl font-bold"
          />
        </div>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-600 text-sm mt-4">{{ error }}</p>

      <!-- Actions -->
      <div class="flex gap-4 mt-8">
        <button
          v-if="step > 1"
          @click="step--"
          class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
          class="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <template v-if="isLoading">Publishing...</template>
          <template v-else-if="step === 1">Continue</template>
          <template v-else>Publish Ad</template>
        </button>
      </div>
    </div>
  </div>
</template>
