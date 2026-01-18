<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import FeatureCard from "../components/FeatureCard.vue";

// Hero Carousel
const currentSlide = ref(0);
const isTransitioning = ref(false);
let slideInterval: ReturnType<typeof setInterval>;

const heroSlides = [
  {
    image: "/hero-1.png",
    title: "Find Expert Talent",
    subtitle: "Global Freelance Network",
    description: "Connect with LMS-verified professionals. Developers, designers, marketers — all vetted and ready.",
    cta: "Browse Talent",
    ctaLink: "/talent",
  },
  {
    image: "/hero-2.png",
    title: "Build Your Team",
    subtitle: "Hire with Confidence",
    description: "From quick gigs to long-term projects. Find the right skills at the right price.",
    cta: "Post a Job",
    ctaLink: "/post-job",
  },
  {
    image: "/hero-3.png",
    title: "Grow Your Career",
    subtitle: "For Freelancers",
    description: "Showcase your skills, get certified, and find clients who value quality work.",
    cta: "Join as Freelancer",
    ctaLink: "/onboarding",
  },
];

const trustStats = [
  { value: "1,000+", label: "Verified Freelancers", pulse: "green" },
  { value: "500+", label: "Jobs Posted", pulse: "blue" },
  { value: "₹5Cr+", label: "Paid to Freelancers", pulse: "purple" },
  { value: "4.9★", label: "Avg Rating", pulse: "orange" },
];

const features = [
  {
    icon: "🎓",
    title: "LMS Verified",
    description: "All freelancers complete our Learning Management System certification",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    description: "Escrow-protected transactions with milestone-based releases",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: "⚡",
    title: "Quick Matching",
    description: "AI-powered matching finds the perfect freelancer in minutes",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: "💬",
    title: "Built-in Chat",
    description: "Communicate seamlessly with integrated messaging",
    gradient: "from-amber-500 to-amber-600",
  },
];

const skillCategories = [
  { name: "Web Development", icon: "💻", count: 250 },
  { name: "Mobile Apps", icon: "📱", count: 120 },
  { name: "UI/UX Design", icon: "🎨", count: 180 },
  { name: "ERPNext", icon: "📊", count: 95 },
  { name: "IoT & Embedded", icon: "🔌", count: 65 },
  { name: "Data Science", icon: "📈", count: 85 },
];

const topFreelancers = [
  { name: "Priya S.", skill: "React Developer", rate: "₹800/hr", rating: 5.0, jobs: 48, verified: true },
  { name: "Rahul M.", skill: "ERPNext Expert", rate: "₹1200/hr", rating: 4.9, jobs: 35, verified: true },
  { name: "Anjali K.", skill: "UI/UX Designer", rate: "₹600/hr", rating: 4.8, jobs: 62, verified: true },
];

function nextSlide() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
  setTimeout(() => isTransitioning.value = false, 700);
}

function prevSlide() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length;
  setTimeout(() => isTransitioning.value = false, 700);
}

function goToSlide(index: number) {
  if (isTransitioning.value || index === currentSlide.value) return;
  isTransitioning.value = true;
  currentSlide.value = index;
  setTimeout(() => isTransitioning.value = false, 700);
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 6000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Carousel Section -->
    <section class="relative h-[60vh] min-h-[500px] overflow-hidden">
      <!-- Background Images -->
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-opacity duration-700 ease-in-out"
        :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
      >
        <img 
          :src="slide.image" 
          :alt="slide.title"
          class="w-full h-full object-cover scale-105"
        />
      </div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/70 to-primary-700/40" />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="w-full h-full" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex items-center h-full">
        <div class="max-w-7xl mx-auto px-6 w-full">
          <div class="max-w-2xl">
            <div :key="currentSlide" class="space-y-5 animate-fade-in-up">
              <!-- Badge -->
              <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {{ heroSlides[currentSlide].subtitle }}
              </span>
              
              <!-- Title -->
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
                {{ heroSlides[currentSlide].title }}
              </h1>
              
              <!-- Description -->
              <p class="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                {{ heroSlides[currentSlide].description }}
              </p>
              
              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <RouterLink 
                  :to="heroSlides[currentSlide].ctaLink"
                  class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {{ heroSlides[currentSlide].cta }}
                  <span class="transition-transform group-hover:translate-x-1">→</span>
                </RouterLink>
                <RouterLink 
                  to="/login"
                  class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  Get Started Free
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        @click="prevSlide"
        class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/15 backdrop-blur-md hover:bg-white/30 rounded-full transition-all z-20 group"
      >
        <span class="text-white text-xl group-hover:-translate-x-0.5 transition-transform">‹</span>
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/15 backdrop-blur-md hover:bg-white/30 rounded-full transition-all z-20 group"
      >
        <span class="text-white text-xl group-hover:translate-x-0.5 transition-transform">›</span>
      </button>

      <!-- Slide Indicators -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button
          v-for="(_, index) in heroSlides"
          :key="index"
          @click="goToSlide(index)"
          class="transition-all duration-300 rounded-full"
          :class="index === currentSlide ? 'w-10 h-3 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/60'"
        />
      </div>

      <!-- Trust Stats Ticker -->
      <div class="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 z-20 py-3 hidden lg:block">
        <div class="max-w-7xl mx-auto px-6 flex justify-center gap-12 text-white/80 text-sm font-medium">
          <div v-for="stat in trustStats" :key="stat.label" class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="font-bold text-white">{{ stat.value }}</span>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Skill Categories -->
    <section class="py-10 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <RouterLink
            v-for="category in skillCategories"
            :key="category.name"
            :to="`/talent?skill=${category.name}`"
            class="flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-50 hover:bg-primary-50 hover:shadow-md transition-all group"
          >
            <span class="text-2xl">{{ category.icon }}</span>
            <div>
              <p class="font-semibold text-gray-900 group-hover:text-primary-600">{{ category.name }}</p>
              <p class="text-xs text-gray-500">{{ category.count }}+ experts</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Why BudeGlobal Work -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-4">
            ✨ Why Choose BudeGlobal Work
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Smarter Way to Hire</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Built for Indian businesses, designed for global standards.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(feature, index) in features" 
            :key="feature.title"
            class="p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all group"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform"
              :class="`bg-gradient-to-br ${feature.gradient}`"
            >
              {{ feature.icon }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Freelancers -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Top Rated Freelancers</h2>
            <p class="text-gray-500 mt-1">Hand-picked talent ready to work</p>
          </div>
          <RouterLink to="/talent" class="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            View All →
          </RouterLink>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="freelancer in topFreelancers" 
            :key="freelancer.name"
            class="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {{ freelancer.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900">{{ freelancer.name }}</h3>
                  <span v-if="freelancer.verified" class="text-green-500 text-sm">✓</span>
                </div>
                <p class="text-gray-500 text-sm">{{ freelancer.skill }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-sm mb-4">
              <span class="font-bold text-primary-600">{{ freelancer.rate }}</span>
              <span class="text-gray-500">{{ freelancer.jobs }} jobs done</span>
              <span class="flex items-center gap-1 text-amber-500">⭐ {{ freelancer.rating }}</span>
            </div>

            <RouterLink 
              to="/talent"
              class="block w-full text-center py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
            >
              View Profile
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- For Freelancers Section -->
    <section class="py-16 bg-gradient-to-br from-primary-50 to-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-4">
              🚀 For Freelancers
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Take Your Career to New Heights</h2>
            <p class="text-gray-600 mb-6">Join BudeGlobal's growing community of verified freelancers. Get matched with clients who value quality work.</p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-gray-700">Free to join — no hidden fees</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-gray-700">Get LMS certified for more visibility</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-gray-700">Weekly payouts to your bank</span>
              </li>
            </ul>

            <RouterLink 
              to="/onboarding"
              class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all"
            >
              Join as Freelancer →
            </RouterLink>
          </div>
          
          <div class="relative">
            <img src="/hero-1.png" alt="Freelancers" class="rounded-2xl shadow-2xl" />
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">💰</div>
                <div>
                  <p class="font-bold text-gray-900">₹5Cr+</p>
                  <p class="text-xs text-gray-500">Paid to Freelancers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-500">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-white/90 text-lg mb-8">Whether you're hiring or looking for work — BudeGlobal Work has you covered.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/post-job" class="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            Post a Job →
          </RouterLink>
          <RouterLink to="/talent" class="px-8 py-4 bg-white/20 backdrop-blur text-white border-2 border-white/30 font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all">
            Find Talent
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
