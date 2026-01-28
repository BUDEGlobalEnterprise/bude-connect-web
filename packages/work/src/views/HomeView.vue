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
    title: "Hire India's Elite Freelance Talent",
    subtitle: "LMS Certified Experts",
    description: "Connect with professionals who have cleared rigorous BudeGlobal certifications. Quality work, guaranteed.",
    cta: "Find Talent",
    ctaLink: "/talent",
    accent: "bg-blue-600"
  },
  {
    image: "/hero-2.png",
    title: "The Project Hub for Modern Business",
    subtitle: "Fast Matching",
    description: "Post your job in minutes and get matched with verified developers, designers, and consultants who deliver results.",
    cta: "Post a Job",
    ctaLink: "/post-job",
    accent: "bg-indigo-600"
  },
  {
    image: "/hero-3.png",
    title: "Turn Your Skills into a Global Career",
    subtitle: "For Professionals",
    description: "Join as a freelancer, get Bude-certified, and work with top companies seeking verified expertise.",
    cta: "Start Freelancing",
    ctaLink: "/onboarding",
    accent: "bg-emerald-600"
  },
];

const trustStats = [
  { value: "15,000+", label: "Tasks Done", icon: "📋" },
  { value: "4.95", label: "Avg Rating", icon: "⭐" },
  { value: "Verified", label: "LMS Passed", icon: "🛡️" },
];

const features = [
  {
    icon: "🎓",
    title: "LMS Certified",
    description: "Our proprietary Learning Management System ensures every freelancer is truly an expert.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: "🛡️",
    title: "Safe Escrow",
    description: "Payment is held securely and only released when you're 100% satisfied with the work.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: "⚡",
    title: "AI Matching",
    description: "Our algorithms find the perfect match for your job requirements within minutes.",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    icon: "📈",
    title: "Career Growth",
    description: "Dynamic profiles that showcase real project impact and verified skill badges.",
    gradient: "from-orange-500 to-amber-600",
  },
];

const skillCategories = [
  { name: "ERPNext", icon: "📈", count: 120 },
  { name: "Full Stack", icon: "💻", count: 450 },
  { name: "UI/UX", icon: "🎨", count: 280 },
  { name: "AI/ML", icon: "🤖", count: 95 },
  { name: "DevOps", icon: "🚀", count: 150 },
  { name: "IoT", icon: "🔌", count: 85 },
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
  slideInterval = setInterval(nextSlide, 8000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen bg-background transition-colors duration-500">
    <!-- Immersive Hero Area -->
    <section class="relative h-[75vh] min-h-[600px] overflow-hidden bg-slate-950 dark:bg-black">
      <!-- High-tech Background effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_hsl(var(--bude-primary-500)/0.15)_0%,_transparent_50%)]"></div>
        <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_hsl(var(--bude-secondary-500)/0.15)_0%,_transparent_50%)]"></div>
      </div>

      <!-- Hero Slides -->
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-in-out z-10"
        :class="currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'"
      >
        <div class="absolute inset-0 bg-slate-950/50 z-20"></div>
        <img 
          :src="slide.image" 
          class="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        
        <!-- Content Overlay -->
        <div class="absolute inset-0 flex items-center z-30">
          <div class="max-w-7xl mx-auto px-6 w-full">
            <div class="max-w-4xl space-y-8">
              <div 
                v-if="currentSlide === index"
                class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white text-sm font-black uppercase tracking-[0.2em] animate-fade-in"
              >
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                {{ slide.subtitle }}
              </div>
              
              <h1 
                v-if="currentSlide === index"
                class="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter animate-slide-up"
              >
                {{ slide.title }}
              </h1>
              
              <p 
                v-if="currentSlide === index"
                class="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium animate-slide-up"
                style="animation-delay: 100ms"
              >
                {{ slide.description }}
              </p>
              
              <div 
                v-if="currentSlide === index"
                class="flex flex-wrap gap-6 pt-6 animate-slide-up"
                style="animation-delay: 200ms"
              >
                <RouterLink 
                  :to="slide.ctaLink"
                  class="group relative px-12 py-6 bg-primary text-primary-foreground font-black rounded-3xl overflow-hidden transition-all hover:scale-105 shadow-xl"
                >
                  <span class="relative z-10 flex items-center gap-3 text-xl">
                    {{ slide.cta }}
                    <span class="group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                </RouterLink>
                <RouterLink 
                  to="/login"
                  class="px-12 py-6 bg-white/5 backdrop-blur-md text-white border-2 border-white/10 font-black rounded-3xl hover:bg-white/10 transition-all text-xl"
                >
                  Watch Demo
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Professional Signal Bar -->
      <div class="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 z-40 hidden lg:block">
        <div class="bg-card/20 dark:bg-card/10 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 grid grid-cols-3 gap-16 shadow-2xl">
          <div v-for="stat in trustStats" :key="stat.label" class="flex items-center gap-8 group">
            <div class="w-20 h-20 rounded-[2rem] bg-primary/20 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-700">
              {{ stat.icon }}
            </div>
            <div>
              <p class="text-white font-black text-4xl tracking-tighter">{{ stat.value }}</p>
              <p class="text-white/50 text-xs font-black uppercase tracking-[0.3em] mt-2">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Controls -->
      <div class="absolute bottom-16 right-16 flex gap-6 z-40">
        <button @click="prevSlide" class="w-16 h-16 rounded-3xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all text-3xl">‹</button>
        <button @click="nextSlide" class="w-16 h-16 rounded-3xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all text-3xl">›</button>
      </div>
    </section>

    <!-- Hot Skill Hub -->
    <section class="relative z-50 -mt-16 pb-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center gap-6 overflow-x-auto pb-8 scrollbar-hide pt-4">
          <RouterLink
            v-for="category in skillCategories"
            :key="category.name"
            :to="`/talent?skill=${category.name}`"
            class="flex-shrink-0 flex items-center gap-6 px-10 py-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl hover:-translate-y-2 hover:shadow-primary/10 transition-all group"
          >
            <span class="text-4xl filter group-hover:scale-125 transition-transform duration-500">{{ category.icon }}</span>
            <div>
              <p class="font-black text-foreground text-xl tracking-tight group-hover:text-primary transition-colors">{{ category.name }}</p>
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{{ category.count }}+ Available</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Why BudeGlobal Work Section -->
    <section class="py-32 bg-background">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-20 items-center">
            <div class="flex-1 space-y-10">
                <span class="px-5 py-2.5 rounded-full bg-primary/10 text-primary-600 text-sm font-black uppercase tracking-widest">The Work Revolution</span>
                <h2 class="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.95]">Experience the Best-in-Class Talent Network</h2>
                <p class="text-xl text-muted-foreground leading-relaxed font-medium">BudeGlobal Work isn't just a job board. It's a high-performance ecosystem where verified skill meets enterprise enterprise-level demand.</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 pt-4">
                    <div v-for="f in features" :key="f.title" class="space-y-4 group">
                        <div class="w-16 h-16 rounded-[1.5rem] bg-card border border-border/50 shadow-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                          {{ f.icon }}
                        </div>
                        <h3 class="text-2xl font-black text-foreground tracking-tight">{{ f.title }}</h3>
                        <p class="text-muted-foreground font-medium">{{ f.description }}</p>
                    </div>
                </div>
            </div>

            <div class="flex-1 relative">
                <div class="absolute inset-0 bg-blue-600/20 rounded-[4rem] rotate-6 scale-95 blur-2xl"></div>
                <div class="relative bg-white p-4 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
                    <img src="/hero-1.png" class="rounded-[3rem] w-full" />
                    <!-- Floating Badge -->
                    <div class="absolute top-10 right-10 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white space-y-2 animate-float">
                        <div class="flex gap-1 text-amber-400">
                            <span v-for="i in 5" :key="i">★</span>
                        </div>
                        <p class="font-black text-slate-950">Top Choice 2024</p>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise Badge</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Talent Showcase Carousel -->
    <section class="py-32 bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div class="space-y-4">
                <h2 class="text-5xl font-black text-slate-950 tracking-tighter">Verified Star Talent</h2>
                <p class="text-xl text-slate-400 font-bold uppercase tracking-[0.2em]">Recently Certified Experts</p>
            </div>
            <RouterLink to="/talent" class="px-10 py-5 bg-slate-100 text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-3">
                See All Talent Networks
                <span>→</span>
            </RouterLink>
        </div>

        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div 
                v-for="(t, i) in [
                    { name: 'Arjun V.', role: 'Senior ERPNext Architect', tags: ['Gold Certified', '150+ Jobs'] },
                    { name: 'Saira K.', role: 'Lead UI/UX Strategist', tags: ['Award Winner', 'Design Expert'] },
                    { name: 'Vikram R.', role: 'AI Integration Master', tags: ['Fast Response', 'Top Rated'] }
                ]" 
                :key="t.name"
                class="group p-10 rounded-[3rem] bg-[#F8FAFC] border-2 border-transparent hover:border-primary-500/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
                <div class="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-500 to-indigo-600 mb-8 flex items-center justify-center text-white text-4xl font-black shadow-xl group-hover:rotate-6 transition-transform">
                    {{ t.name[0] }}
                </div>
                <h3 class="text-3xl font-black text-slate-950 mb-2 tracking-tight">{{ t.name }}</h3>
                <p class="text-lg font-bold text-slate-400 mb-8">{{ t.role }}</p>
                <div class="flex flex-wrap gap-2 mb-10">
                    <span v-for="tag in t.tags" :key="tag" class="px-4 py-1.5 rounded-full bg-white text-slate-600 text-xs font-black uppercase tracking-widest border border-slate-200">{{ tag }}</span>
                </div>
                <RouterLink to="/talent" class="block text-center py-5 bg-slate-950 text-white font-black rounded-2xl group-hover:bg-primary-600 transition-colors tracking-tight">
                    Hire {{ t.name.split(' ')[0] }}
                </RouterLink>
            </div>
        </div>
    </section>

    <!-- Impact Counter -->
    <section class="py-40 bg-slate-950 dark:bg-black relative overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-20">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--bude-primary-500))_0%,_transparent_70%)]"></div>
        </div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-16">
            <h2 class="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">Transforming the Digital Gig Economy</h2>
            <div class="grid md:grid-cols-3 gap-20">
                <div v-for="c in [
                    { val: '₹12Cr+', label: 'Volume' },
                    { val: '2,500', label: 'Certified' },
                    { val: '98%', label: 'Retention' }
                ]" :key="c.label" class="space-y-4 p-10 border-l border-white/10 text-left transition-all hover:bg-white/5">
                    <p class="text-6xl md:text-8xl font-black text-white tracking-widest">{{ c.val }}</p>
                    <p class="text-white/40 font-black uppercase tracking-[0.5em] text-sm">{{ c.label }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Ultimate CTA -->
    <section class="py-32 bg-background border-t border-border/50">
        <div class="max-w-5xl mx-auto px-6">
            <div class="p-16 rounded-[4rem] bg-primary text-primary-foreground shadow-2xl text-center space-y-10 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div class="relative z-10">
                    <h2 class="text-5xl md:text-7xl font-black text-primary-foreground tracking-tighter mb-8">Ready to Elevate Your Work?</h2>
                    <p class="text-primary-foreground/80 text-2xl font-medium max-w-2xl mx-auto mb-12">Whether you're looking for the best talent or your next big project — BudeGlobal Work is your destination.</p>
                    <div class="flex flex-col sm:flex-row gap-6 justify-center">
                        <RouterLink to="/post-job" class="px-12 py-6 bg-background text-primary-600 font-black rounded-[2rem] shadow-2xl hover:scale-105 transition-all text-xl">
                            Hire Top Talent Now
                        </RouterLink>
                        <RouterLink to="/onboarding" class="px-12 py-6 bg-primary-800/20 text-primary-foreground border-2 border-primary-foreground/20 font-black rounded-[2rem] hover:bg-background hover:text-primary-600 transition-all text-xl">
                            Join as Freelancer
                        </RouterLink>
                    </div>
                </div>
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
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-30px) rotate(2deg); }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
