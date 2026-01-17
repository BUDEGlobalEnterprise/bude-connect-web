<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useUserStore } from "@bude/shared";

const userStore = useUserStore();
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden"
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Find the Perfect Talent<br />
            <span class="text-primary-200">Or Get Hired</span>
          </h1>
          <p class="text-xl text-white/90 mb-8">
            Connect with verified freelancers and businesses across India.
            LMS-certified experts at your fingertips.
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink
              to="/talent"
              class="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Talent
            </RouterLink>
            <RouterLink
              to="/jobs"
              class="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Browse Jobs
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Why BudeGlobal Work?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            A trusted platform connecting skilled professionals with businesses
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Verified Experts
            </h3>
            <p class="text-gray-600">
              LMS-certified professionals with proven skills and expertise
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Pay Per Contact
            </h3>
            <p class="text-gray-600">
              Only pay when you want to connect. No subscriptions, no hidden
              fees.
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              India-Wide Network
            </h3>
            <p class="text-gray-600">
              Access talent from across the country, all in one platform
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-gray-600 mb-8">
          Join thousands of professionals and businesses on BudeGlobal Work
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <RouterLink
            :to="userStore.isLoggedIn ? '/post-job' : '/login'"
            class="btn btn-primary px-8 py-3 text-lg"
          >
            Post a Job
          </RouterLink>
          <RouterLink
            :to="userStore.isLoggedIn ? '/profile' : '/login'"
            class="btn btn-outline px-8 py-3 text-lg"
          >
            Become a Freelancer
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
