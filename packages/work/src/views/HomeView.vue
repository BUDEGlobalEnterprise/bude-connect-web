<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useUserStore } from "@bude/shared";
import { Button } from "@bude/shared/components";
import FeatureCard from "../components/FeatureCard.vue";

const userStore = useUserStore();

const features = [
  {
    title: "Verified Experts",
    description: "LMS-certified professionals with proven skills and expertise",
    icon: "verified",
    color: "primary",
  },
  {
    title: "Pay Per Contact",
    description:
      "Only pay when you want to connect. No subscriptions, no hidden fees.",
    icon: "payment",
    color: "accent",
  },
  {
    title: "India-Wide Network",
    description: "Access talent from across the country, all in one platform",
    icon: "network",
    color: "green",
  },
];
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
            <RouterLink to="/talent">
              <Button variant="secondary" size="lg">Find Talent</Button>
            </RouterLink>
            <RouterLink to="/jobs">
              <Button
                variant="ghost"
                size="lg"
                class="text-white border-white/30 hover:bg-white/20"
                >Browse Jobs</Button
              >
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
          <FeatureCard
            v-for="feature in features"
            :key="feature.title"
            v-bind="feature"
          />
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
          <RouterLink :to="userStore.isLoggedIn ? '/post-job' : '/login'">
            <Button size="lg">Post a Job</Button>
          </RouterLink>
          <RouterLink :to="userStore.isLoggedIn ? '/profile' : '/login'">
            <Button variant="outline" size="lg">Become a Freelancer</Button>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
