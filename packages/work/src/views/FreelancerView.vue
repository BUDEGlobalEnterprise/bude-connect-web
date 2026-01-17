<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getFreelancer } from "@bude/shared/api";
import { useUserStore, useWalletStore } from "@bude/shared";
import type { Freelancer } from "@bude/shared/types";
import UnlockButton from "../components/UnlockButton.vue";

const route = useRoute();
const userStore = useUserStore();
const walletStore = useWalletStore();

const freelancer = ref<Freelancer | null>(null);
const isLoading = ref(true);

const formattedRate = computed(() => {
  if (!freelancer.value) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(freelancer.value.hourly_rate);
});

const contactUnlocked = computed(() => {
  if (!freelancer.value) return false;
  return walletStore.isUnlocked("Supplier", freelancer.value.name);
});

const cachedContact = computed(() => {
  if (!freelancer.value) return null;
  return walletStore.getCachedContact("Supplier", freelancer.value.name);
});

async function loadFreelancer() {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    freelancer.value = await getFreelancer(id);
  } catch (error) {
    console.error("Failed to load freelancer:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadFreelancer);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="flex items-center gap-6 mb-8">
        <div class="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div class="space-y-2">
          <div class="h-6 bg-gray-200 rounded w-48"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="freelancer">
      <!-- Header -->
      <div class="card p-6 mb-6">
        <div class="flex items-start gap-6">
          <div class="relative">
            <div
              class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <span class="text-primary-700 font-bold text-3xl">
                {{ freelancer.supplier_name.charAt(0) }}
              </span>
            </div>
            <div
              v-if="freelancer.is_verified_expert"
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ freelancer.supplier_name }}
              </h1>
              <span
                v-if="freelancer.is_verified_expert"
                class="badge badge-verified"
              >
                Verified Expert
              </span>
            </div>
            <p class="text-2xl font-bold text-primary-600 mb-2">
              {{ formattedRate }}/hr
            </p>
            <p class="text-gray-500">
              {{ freelancer.completed_jobs }} jobs completed • Member since
              {{ freelancer.member_since }}
            </p>
          </div>
        </div>

        <p v-if="freelancer.bio" class="text-gray-700 mt-6">
          {{ freelancer.bio }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <!-- Skills -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in freelancer.skills"
                :key="skill.skill_name"
                class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
              >
                {{ skill.skill_name }}
                <span v-if="skill.proficiency" class="text-primary-400 ml-1">
                  ({{ skill.proficiency }})
                </span>
              </span>
            </div>
          </div>

          <!-- Portfolio -->
          <div v-if="freelancer.portfolio_links?.length" class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
            <ul class="space-y-3">
              <li v-for="link in freelancer.portfolio_links" :key="link.url">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-primary-600 hover:underline"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  {{ link.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact Card -->
        <div class="card p-6 h-fit sticky top-24">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact</h2>

          <div v-if="contactUnlocked && cachedContact" class="space-y-3">
            <a
              :href="`tel:${cachedContact.phone}`"
              class="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {{ cachedContact.phone }}
            </a>
            <a
              :href="`mailto:${cachedContact.email}`"
              class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ cachedContact.email }}
            </a>
          </div>

          <UnlockButton v-else doctype="Supplier" :docname="freelancer.name" />
        </div>
      </div>
    </div>
  </div>
</template>
