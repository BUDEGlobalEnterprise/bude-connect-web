<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import { getFeed, getCategories } from "@bude/shared/api";
import type { MarketItem } from "@bude/shared/types";
import { LoadingSkeleton, EmptyState } from "@bude/shared/components";
import ItemCard from "../components/ItemCard.vue";
import CategoryNav from "../components/CategoryNav.vue";

const items = ref<MarketItem[]>([]);
const categories = ref<{ name: string; count: number }[]>([]);
const isLoading = ref(true);
const selectedCategory = ref<string | null>(null);
const selectedListingType = ref<string | null>(null);

// Hero Carousel
const currentSlide = ref(0);
const isTransitioning = ref(false);
let slideInterval: ReturnType<typeof setInterval>;

const heroSlides = [
  {
    image: "/hero-1.png",
    title: "Trade Globally",
    subtitle: "B2B Marketplace",
    description: "Connect with verified suppliers and buyers. Buy, sell, and trade surplus goods across India.",
    cta: "Browse Products",
    ctaLink: "#products",
  },
  {
    image: "/hero-2.png",
    title: "Trusted Partners",
    subtitle: "Secure Transactions",
    description: "Join 500+ verified businesses on India's growing B2B platform. Safe, secure, reliable.",
    cta: "Post Your Ad",
    ctaLink: "/post",
  },
  {
    image: "/hero-3.png",
    title: "Grow Your Business",
    subtitle: "Empower Local Sellers",
    description: "Whether you're selling surplus, renting equipment, or trading scrap — we've got you covered.",
    cta: "Start Selling",
    ctaLink: "/post",
  },
];

const trustStats = [
  { value: "500+", label: "Verified Businesses", pulse: "green" },
  { value: "₹10Cr+", label: "Trade Volume", pulse: "blue" },
  { value: "50+", label: "Categories", pulse: "purple" },
  { value: "24/7", label: "Support", pulse: "orange" },
];

const listingTypes = [
  { value: "Sell", label: "Buy", icon: "🛒", color: "from-blue-500 to-blue-600" },
  { value: "Rent", label: "Rent", icon: "🔄", color: "from-green-500 to-green-600" },
  { value: "Surplus", label: "Surplus", icon: "📦", color: "from-amber-500 to-amber-600" },
  { value: "Scrap", label: "Scrap", icon: "♻️", color: "from-emerald-500 to-emerald-600" },
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

async function loadFeed() {
  isLoading.value = true;
  try {
    const result = await getFeed({
      category: selectedCategory.value || undefined,
      listing_type: (selectedListingType.value as any) || undefined,
    });
    items.value = result.data;
  } catch (error) {
    console.error("Failed to load feed:", error);
  } finally {
    isLoading.value = false;
  }
}

async function loadCategories() {
  try {
    categories.value = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

function handleCategorySelect(category: string | null) {
  selectedCategory.value = category;
  loadFeed();
}

function handleListingTypeSelect(type: string | null) {
  selectedListingType.value = selectedListingType.value === type ? null : type;
  loadFeed();
}

onMounted(() => {
  loadFeed();
  loadCategories();
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
                  Join Free
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
            <span class="w-2 h-2 rounded-full animate-pulse" :class="`bg-${stat.pulse}-400`"></span>
            <span class="font-bold text-white">{{ stat.value }}</span>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Listing Type Pills -->
    <section class="py-8 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <button
            v-for="type in listingTypes"
            :key="type.value"
            @click="handleListingTypeSelect(type.value)"
            class="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            :class="selectedListingType === type.value 
              ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105` 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            <span class="text-xl">{{ type.icon }}</span>
            <span>{{ type.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-6 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <CategoryNav
          :categories="categories"
          :selected-category="selectedCategory"
          @select="handleCategorySelect"
        />
      </div>
    </section>

    <!-- Products Grid -->
    <section id="products" class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
              {{ selectedCategory || 'All Products' }}
            </h2>
            <p class="text-gray-500 mt-1">{{ items.length }} items found</p>
          </div>
          <RouterLink to="/post" class="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            <span>+</span> Post Your Ad
          </RouterLink>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-xl mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Products -->
        <div v-else-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ItemCard
            v-for="(item, index) in items"
            :key="item.name"
            :item="item"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${index * 50}ms` }"
          />
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          title="No products found"
          description="Try adjusting your filters or be the first to post!"
          icon="📦"
        >
          <RouterLink to="/post" class="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            Post Your Ad
          </RouterLink>
        </EmptyState>
      </div>
    </section>

    <!-- Why BudeGlobal Market Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-4">
            ✨ Why Choose Us
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">India's Trusted B2B Marketplace</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Connect with verified businesses, secure transactions, and grow your trade network.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all group">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Verified Sellers</h3>
            <p class="text-gray-600">All sellers are KYC verified for secure transactions</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all group">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
              💰
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
            <p class="text-gray-600">Direct from sellers — no middlemen, best deals</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all group">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Fast & Easy</h3>
            <p class="text-gray-600">List in minutes, connect instantly</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-500">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
        <p class="text-white/90 text-lg mb-8">Join thousands of businesses already on BudeGlobal Market</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/post" class="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            Post Your First Ad →
          </RouterLink>
          <RouterLink to="/login" class="px-8 py-4 bg-white/20 backdrop-blur text-white border-2 border-white/30 font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all">
            Create Account
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
</style>
