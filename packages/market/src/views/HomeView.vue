<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { getFeed, getTaxonomyVerticals } from "@bude/shared/api";
import type { MarketItem } from "@bude/shared/types";
import type { TaxonomyVertical } from "@bude/shared/api";
import { EmptyState, ListingSkeleton } from "@bude/shared/components";
import ItemCard from "../components/ItemCard.vue";
import CategoryNav from "../components/CategoryNav.vue";

const route = useRoute();
const router = useRouter();

const items = ref<MarketItem[]>([]);
const verticals = ref<TaxonomyVertical[]>([]);
const isLoading = ref(true);
const isFetchingMore = ref(false);
const hasMore = ref(false);
const lastId = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const selectedListingType = ref<string | null>(null);
const searchQuery = ref<string>((route.query.search as string) || "");

const loadMoreSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const selectedCategoryName = computed(() => {
  if (searchQuery.value) return `Results for "${searchQuery.value}"`;
  if (!selectedCategory.value) return "Premium Recommendations";
  const v = verticals.value.find((v) => v.id === selectedCategory.value);
  return v?.name || selectedCategory.value;
});

// Hero Carousel
const currentSlide = ref(0);
const isTransitioning = ref(false);
let slideInterval: ReturnType<typeof setInterval>;

const heroSlides = [
  {
    image: "/hero-1.png",
    title: "India's Smartest B2B Marketplace",
    subtitle: "Verified & Secure",
    description: "Connect directly with trusted suppliers, liquidators, and businesses. Skip the middlemen and trade with confidence.",
    cta: "Explore Market",
    ctaLink: "#products",
    accent: "from-blue-600 to-indigo-600"
  },
  {
    image: "/hero-2.png",
    title: "Turn Your Surplus Into Capital",
    subtitle: "Liquidate Faster",
    description: "Got slow-moving inventory or scrap? List it on BudeGlobal and reach thousands of verified professional buyers instantly.",
    cta: "List Your Surplus",
    ctaLink: "/post",
    accent: "from-emerald-500 to-teal-600"
  },
  {
    image: "/hero-3.png",
    title: "Equipment Rentals Simplified",
    subtitle: "Asset Optimization",
    description: "Rent heavy machinery, office equipment, or tools from local businesses. Minimize overhead, maximize output.",
    cta: "Find Equipment",
    ctaLink: "#products",
    accent: "from-amber-500 to-orange-600"
  },
];

const listingTypes = [
  { value: "Sell", label: "Buy & Sell", icon: "🤝", color: "from-blue-500 to-blue-600", desc: "Premium Goods" },
  { value: "Surplus", label: "Surplus", icon: "📦", color: "from-emerald-500 to-emerald-600", desc: "Bulk Savings" },
  { value: "Rent", label: "Rentals", icon: "🔄", color: "from-amber-500 to-amber-600", desc: "Flexible Usage" },
  { value: "Scrap", label: "Scrap/Recycle", icon: "♻️", color: "from-purple-500 to-purple-600", desc: "Resource Recovery" },
];

const trustStats = [
  { value: "5,000+", label: "Wholesalers", icon: "🏢" },
  { value: "₹25Cr+", label: "Trade Flow", icon: "📈" },
  { value: "Verified", label: "KYC Only", icon: "🛡️" },
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

async function loadFeed(isInitial = true) {
  if (isInitial) {
    isLoading.value = true;
    items.value = [];
    lastId.value = null;
  } else {
    isFetchingMore.value = true;
  }

  try {
    const result = await getFeed({
      category: selectedCategory.value || undefined,
      listingType: (selectedListingType.value as any) || undefined,
      search: searchQuery.value || undefined,
      lastId: lastId.value || undefined,
      pageSize: 24
    });
    
    if (isInitial) {
      items.value = result.data;
    } else {
      items.value = [...items.value, ...result.data];
    }
    
    hasMore.value = result.has_more;
    lastId.value = result.last_id;
  } catch (error) {
    console.error("Failed to load feed:", error);
  } finally {
    isLoading.value = false;
    isFetchingMore.value = false;
  }
}

function clearSearch() {
  searchQuery.value = "";
  router.replace({ query: {} });
  loadFeed();
}

async function loadCategories() {
  try {
    verticals.value = await getTaxonomyVerticals();
  } catch (error) {
    console.error("Failed to load taxonomy verticals:", error);
  }
}

function handleCategorySelect(category: string | null) {
  selectedCategory.value = category;
  const el = document.getElementById('products');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadFeed();
}

function handleListingTypeSelect(type: string | null) {
  selectedListingType.value = selectedListingType.value === type ? null : type;
  loadFeed();
}

function setupIntersectionObserver() {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isFetchingMore.value && !isLoading.value) {
      loadFeed(false);
    }
  }, { threshold: 0.1, rootMargin: '400px' });

  if (loadMoreSentinel.value) {
    observer.observe(loadMoreSentinel.value);
  }
}

watch(() => route.query.search, (newSearch) => {
  searchQuery.value = (newSearch as string) || "";
  loadFeed();
});

onMounted(() => {
  loadFeed();
  loadCategories();
  setTimeout(setupIntersectionObserver, 1000);
  slideInterval = setInterval(nextSlide, 8000);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen bg-background transition-colors duration-500">
    <!-- Immersive Hero Area -->
    <section class="relative h-[70vh] min-h-[550px] overflow-hidden bg-slate-950 dark:bg-black">
      <!-- Animated Background Blobs -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>

      <!-- Hero Slides -->
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-in-out"
        :class="currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'"
      >
        <div class="absolute inset-0 bg-slate-950/40 z-10"></div>
        <img 
          :src="slide.image" 
          class="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        
        <!-- Content Overlay -->
        <div class="absolute inset-0 flex items-center z-20">
          <div class="max-w-7xl mx-auto px-6 w-full">
            <div class="max-w-3xl space-y-6">
              <div 
                v-if="currentSlide === index"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold animate-fade-in"
              >
                <span class="w-2 h-2 rounded-full bg-primary-400"></span>
                {{ slide.subtitle }}
              </div>
              
              <h1 
                v-if="currentSlide === index"
                class="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter animate-slide-up"
              >
                {{ slide.title }}
              </h1>
              
              <p 
                v-if="currentSlide === index"
                class="text-xl md:text-2xl text-slate-100 max-w-2xl leading-relaxed animate-slide-up"
                style="animation-delay: 100ms"
              >
                {{ slide.description }}
              </p>
              
              <div 
                v-if="currentSlide === index"
                class="flex flex-wrap gap-5 pt-8 animate-slide-up"
                style="animation-delay: 200ms"
              >
                <RouterLink 
                  :to="slide.ctaLink"
                  class="group relative px-10 py-5 bg-primary text-primary-foreground font-black rounded-[2rem] overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(var(--bude-primary-500),0.4)]"
                >
                  <span class="relative z-10 flex items-center gap-2">
                    {{ slide.cta }}
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </RouterLink>
                <RouterLink 
                  to="/login"
                  class="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-[2rem] hover:bg-white hover:text-primary-950 transition-all duration-300"
                >
                  Join the Network
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Stats Bar (Glassmorphism) -->
      <div class="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-30 hidden lg:block">
        <div class="bg-card/20 dark:bg-card/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 grid grid-cols-3 gap-12 shadow-2xl">
          <div v-for="stat in trustStats" :key="stat.label" class="flex items-center gap-6 group">
            <div class="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-500">
              {{ stat.icon }}
            </div>
            <div>
              <p class="text-white font-black text-3xl tracking-tighter">{{ stat.value }}</p>
              <p class="text-white/60 text-xs font-black uppercase tracking-[0.2em] mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Nav -->
      <div class="absolute bottom-16 right-16 flex gap-4 z-30">
        <button @click="prevSlide" class="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all text-2xl">‹</button>
        <button @click="nextSlide" class="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all text-2xl">›</button>
      </div>
    </section>

    <!-- Interactive Quick Hub -->
    <section class="relative z-40 -mt-20 pb-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <button
            v-for="type in listingTypes"
            :key="type.value"
            @click="handleListingTypeSelect(type.value)"
            class="group relative h-40 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl transition-all hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]"
          >
            <div 
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br"
              :class="type.color"
            ></div>
            <div class="relative z-10 p-8 flex flex-col justify-between h-full text-left">
              <span class="text-4xl filter group-hover:grayscale-0 group-hover:brightness-200 transition-all">{{ type.icon }}</span>
              <div>
                <p class="font-black text-slate-900 group-hover:text-white transition-colors text-xl tracking-tight">{{ type.label }}</p>
                <p class="text-xs font-bold text-slate-400 group-hover:text-white/70 uppercase tracking-widest">{{ type.desc }}</p>
              </div>
            </div>
            <!-- Active Indicator -->
            <div v-if="selectedListingType === type.value" class="absolute top-6 right-6 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-primary-100 animate-pulse"></div>
          </button>
        </div>
      </div>
    </section>

    <!-- Premium Category Ribbon -->
    <section class="bg-white border-y border-slate-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <CategoryNav
          :categories="verticals"
          :selected="selectedCategory"
          @select="handleCategorySelect"
        />
      </div>
    </section>

    <!-- Product Discovery Engine -->
    <main id="products" class="py-24">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Explorer Header -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div class="space-y-4">
            <h2 class="text-5xl font-black text-slate-950 tracking-tighter">
              {{ selectedCategoryName }}
            </h2>
            <div class="flex items-center gap-6">
              <div v-if="!isLoading" class="flex -space-x-4">
                <div v-for="i in 5" :key="i" class="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img :src="`https://i.pravatar.cc/40?img=${i+20}`" />
                </div>
                <div class="pl-6 flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                  <span class="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Active Browsers
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button class="px-8 py-4 rounded-2xl bg-slate-100 text-slate-900 font-black hover:bg-slate-200 transition-all flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              Sort
            </button>
            <RouterLink to="/post" class="px-10 py-4 bg-primary-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(37,99,235,0.5)]">
              Create My Ad
            </RouterLink>
          </div>
        </div>

        <!-- Professional Result Grid -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <ListingSkeleton v-for="i in 12" :key="i" />
        </div>

        <div v-else-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
          <ItemCard
            v-for="(item, index) in items"
            :key="item.name"
            :item="item"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${(index % 8) * 40}ms` }"
          />
        </div>

        <EmptyState
          v-else
          title="No Match Found"
          description="We couldn't find items in this category. Be the first to list and gain maximum visibility!"
          icon="✨"
        >
          <button @click="selectedCategory = null; selectedListingType = null; loadFeed()" class="mt-8 px-10 py-4 bg-slate-950 text-white font-black rounded-2xl hover:scale-105 transition-all">
            Show All Listings
          </button>
        </EmptyState>

        <div v-if="isFetchingMore" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16">
          <ListingSkeleton v-for="i in 4" :key="i" />
        </div>

        <div ref="loadMoreSentinel" class="py-32 flex flex-col items-center justify-center gap-6 opacity-30">
            <div v-if="hasMore" class="w-10 h-10 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            <div v-else class="text-slate-400 font-black tracking-[0.3em] text-xs uppercase">Curated End of Results</div>
        </div>
      </div>
    </main>

    <!-- Social Proof Section -->
    <section class="bg-card dark:bg-slate-950 py-32 overflow-hidden relative border-y border-border/50">
      <div class="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-2 gap-20 items-center">
          <div class="space-y-8">
            <span class="px-5 py-2 rounded-full bg-primary/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary/20">Why BudeGlobal?</span>
            <h2 class="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">Built for Secure High-Stakes Trade</h2>
            <p class="text-muted-foreground text-xl leading-relaxed">The only platform in India that bridges the gap between surplus inventory and professional liquidators with full KYC transparency.</p>
            <div class="grid grid-cols-2 gap-8 pt-4">
              <div v-for="f in ['Instant Liquidity', 'KYC Verified Network', 'Seamless Escrow', 'Bulk Trade Ready']" :key="f" class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">✓</span>
                <span class="text-foreground font-bold">{{ f }}</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6 rotate-3">
            <div v-for="i in 4" :key="i" class="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl backdrop-blur-sm animate-float" :style="{ animationDelay: `${i * 0.5}s` }">
              <div class="text-4xl mb-6">{{ ['🏗️', '💼', '📦', '🏢'][i-1] }}</div>
              <p class="text-foreground font-black text-xl mb-2">{{ ['Industrial', 'Corporate', 'Surplus', 'Wholesale'][i-1] }}</p>
              <p class="text-muted-foreground text-sm font-bold uppercase tracking-widest">Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 bg-primary dark:bg-primary-700 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]"></div>
      <div class="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-10">
          <h2 class="text-5xl md:text-7xl font-black text-primary-foreground tracking-tighter">Ready to Scale Your Trade?</h2>
          <p class="text-primary-foreground/80 text-xl md:text-2xl font-medium max-w-2xl mx-auto">Join 5,000+ businesses liquidating surplus and finding bulk deals today.</p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <RouterLink to="/post" class="px-12 py-6 bg-background text-primary-600 font-black rounded-3xl shadow-2xl hover:scale-105 transition-all text-xl">
              Start Listing Now
            </RouterLink>
            <RouterLink to="/login" class="px-12 py-6 bg-primary-900/20 text-primary-foreground border-2 border-primary-foreground/20 font-black rounded-3xl hover:bg-background hover:text-primary-600 transition-all text-xl">
              Create Free Account
            </RouterLink>
          </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
