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
    emoji: "✅",
  },
  {
    title: "Pay Per Contact",
    description: "Only pay when you want to connect. No subscriptions, no hidden fees.",
    icon: "payment",
    color: "accent",
    emoji: "💰",
  },
  {
    title: "India-Wide Network",
    description: "Access talent from across the country, all in one platform",
    icon: "network",
    color: "green",
    emoji: "🌐",
  },
];

const stats = [
  { value: "10K+", label: "Freelancers", emoji: "👨‍💻" },
  { value: "5K+", label: "Jobs Posted", emoji: "📋" },
  { value: "95%", label: "Satisfaction", emoji: "⭐" },
];
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-white/90 text-sm font-medium">Join 10,000+ professionals</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find the Perfect Talent<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">Or Get Hired Today</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
            Connect with verified freelancers and businesses across India.
            LMS-certified experts at your fingertips.
          </p>
          
          <div class="flex flex-wrap gap-4 mb-12">
            <RouterLink to="/talent">
              <Button variant="secondary" size="lg" class="shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105 transition-all">
                🔍 Find Talent
              </Button>
            </RouterLink>
            <RouterLink to="/jobs">
              <Button
                variant="ghost"
                size="lg"
                class="text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
              >
                💼 Browse Jobs
              </Button>
            </RouterLink>
          </div>
          
          <!-- Stats -->
          <div class="flex flex-wrap gap-8">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white mb-1">{{ stat.value }}</div>
              <div class="text-white/70 text-sm">{{ stat.emoji }} {{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why BudeGlobal Work?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto text-lg">
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
    <section class="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
            <span class="text-3xl">🚀</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p class="text-gray-600 mb-8 text-lg">
            Join thousands of professionals and businesses on BudeGlobal Work
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <RouterLink :to="userStore.isLoggedIn ? '/post-job' : '/login'">
              <Button size="lg" class="shadow-lg shadow-primary-500/25 hover:shadow-xl">
                📝 Post a Job
              </Button>
            </RouterLink>
            <RouterLink :to="userStore.isLoggedIn ? '/profile' : '/login'">
              <Button variant="outline" size="lg">
                👤 Become a Freelancer
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
