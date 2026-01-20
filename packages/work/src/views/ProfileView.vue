<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getMyFreelancerProfile,
  updateFreelancerProfile,
  getSkills,
} from "@bude/shared/api";
import { useUserStore } from "@bude/shared";
import { LoadingSkeleton, ProfileCompletenessMeter } from "@bude/shared/components";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@bude/shared/components/ui";
import {
  Camera,
  Briefcase,
  Star,
  DollarSign,
  Plus,
  X,
  ExternalLink,
  Settings,
  Shield,
  User,
  LogOut,
  Bell,
  FileText,
  ChevronRight,
  CheckCircle,
  Mail,
} from "lucide-vue-next";
import type { Freelancer, Skill } from "@bude/shared/types";

const router = useRouter();
const userStore = useUserStore();
const profile = ref<Freelancer | null>(null);
const allSkills = ref<Skill[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref("");
const success = ref("");
const isEditDialogOpen = ref(false);

const form = ref({
  hourly_rate: 0,
  bio: "",
  skills: [] as string[],
  portfolio_links: [] as { title: string; url: string }[],
});

const newSkill = ref("");
const newPortfolio = ref({ title: "", url: "" });

const profileStats = computed(() => [
  { label: "Jobs Done", value: profile.value?.completed_jobs || 0, icon: Briefcase },
  { label: "Rating", value: profile.value?.rating?.toFixed(1) || "N/A", icon: Star },
  { label: "Hourly Rate", value: `₹${form.value.hourly_rate}`, icon: DollarSign },
]);

const initials = computed(() => {
  const name = userStore.displayName || "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

async function loadProfile() {
  isLoading.value = true;
  try {
    profile.value = await getMyFreelancerProfile();
    if (profile.value) {
      form.value = {
        hourly_rate: profile.value.hourly_rate,
        bio: profile.value.bio || "",
        skills: profile.value.skills.map((s) => s.skill_name),
        portfolio_links: profile.value.portfolio_links || [],
      };
    }
    allSkills.value = await getSkills();
  } catch (e) {
    console.error("Failed to load profile:", e);
  } finally {
    isLoading.value = false;
  }
}

function addSkill() {
  if (newSkill.value && !form.value.skills.includes(newSkill.value)) {
    form.value.skills.push(newSkill.value);
    newSkill.value = "";
  }
}

function removeSkill(skill: string) {
  form.value.skills = form.value.skills.filter((s) => s !== skill);
}

function addPortfolio() {
  if (newPortfolio.value.title && newPortfolio.value.url) {
    form.value.portfolio_links.push({ ...newPortfolio.value });
    newPortfolio.value = { title: "", url: "" };
  }
}

function removePortfolio(index: number) {
  form.value.portfolio_links.splice(index, 1);
}

async function handleSave() {
  isSaving.value = true;
  error.value = "";
  success.value = "";

  try {
    await updateFreelancerProfile({
      hourly_rate: form.value.hourly_rate,
      bio: form.value.bio,
      skills: form.value.skills.map((s) => ({ skill_name: s })),
      portfolio_links: form.value.portfolio_links,
    });
    success.value = "Profile updated successfully!";
    isEditDialogOpen.value = false;
    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (e: any) {
    error.value = e.message || "Failed to update profile";
  } finally {
    isSaving.value = false;
  }
}

async function handleLogout() {
  await userStore.logout();
  router.push("/login");
}

onMounted(loadProfile);
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container flex h-14 items-center px-4">
        <button @click="router.back()" class="mr-4 rounded-md p-2 hover:bg-accent">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Profile</h1>
      </div>
    </header>

    <main class="container max-w-4xl px-4 py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-start gap-4">
              <Skeleton class="h-20 w-20 rounded-full" />
              <div class="flex-1 space-y-2">
                <Skeleton class="h-6 w-40" />
                <Skeleton class="h-4 w-32" />
                <div class="flex gap-4 pt-2">
                  <Skeleton class="h-10 w-16" />
                  <Skeleton class="h-10 w-16" />
                  <Skeleton class="h-10 w-16" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <!-- Profile Content -->
      <div v-else class="space-y-6">
        <!-- Profile Header Card -->
        <Card>
          <CardHeader class="pb-4">
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <!-- Avatar -->
              <div class="relative">
                <Avatar class="h-20 w-20">
                  <AvatarImage :src="userStore.user?.userImage" :alt="userStore.displayName" />
                  <AvatarFallback class="bg-primary text-primary-foreground text-xl">
                    {{ initials }}
                  </AvatarFallback>
                </Avatar>
                <button
                  class="absolute -bottom-1 -right-1 rounded-full bg-background p-1.5 shadow-md border hover:bg-accent"
                >
                  <Camera class="h-3.5 w-3.5" />
                </button>
              </div>

              <!-- Info -->
              <div class="flex-1 space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl font-bold">{{ userStore.displayName }}</h2>
                  <Badge v-if="profile?.is_verified_expert" variant="success">
                    Verified Expert
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">{{ userStore.user?.email }}</p>

                <!-- Stats -->
                <div class="flex flex-wrap gap-4 pt-2">
                  <div v-for="stat in profileStats" :key="stat.label" class="flex items-center gap-2">
                    <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
                    <span class="font-semibold">{{ stat.value }}</span>
                    <span class="text-xs text-muted-foreground">{{ stat.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Edit Button -->
              <Dialog v-model:open="isEditDialogOpen">
                <DialogTrigger as-child>
                  <Button size="sm">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent class="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your freelancer profile information.
                    </DialogDescription>
                  </DialogHeader>

                  <form @submit.prevent="handleSave" class="space-y-4">
                    <!-- Hourly Rate -->
                    <div class="space-y-2">
                      <Label for="hourly_rate">Hourly Rate (₹)</Label>
                      <Input
                        id="hourly_rate"
                        v-model.number="form.hourly_rate"
                        type="number"
                        min="0"
                        step="50"
                        placeholder="500"
                      />
                    </div>

                    <!-- Bio -->
                    <div class="space-y-2">
                      <Label for="bio">Bio / About Me</Label>
                      <Textarea
                        id="bio"
                        v-model="form.bio"
                        :rows="3"
                        placeholder="Tell clients about yourself..."
                      />
                      <p class="text-xs text-muted-foreground">{{ form.bio.length }}/500</p>
                    </div>

                    <!-- Skills -->
                    <div class="space-y-2">
                      <Label>Skills</Label>
                      <div class="flex gap-2">
                        <Select v-model="newSkill">
                          <SelectTrigger class="flex-1">
                            <SelectValue placeholder="Select skill" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="skill in allSkills"
                              :key="skill.skill_name"
                              :value="skill.skill_name"
                              :disabled="form.skills.includes(skill.skill_name)"
                            >
                              {{ skill.skill_name }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" size="icon" @click="addSkill" :disabled="!newSkill">
                          <Plus class="h-4 w-4" />
                        </Button>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <Badge v-for="skill in form.skills" :key="skill" variant="secondary" class="gap-1 pr-1">
                          {{ skill }}
                          <button type="button" @click="removeSkill(skill)" class="ml-1 hover:text-destructive">
                            <X class="h-3 w-3" />
                          </button>
                        </Badge>
                      </div>
                    </div>

                    <!-- Portfolio -->
                    <div class="space-y-2">
                      <Label>Portfolio Links</Label>
                      <div class="flex gap-2">
                        <Input v-model="newPortfolio.title" placeholder="Title" class="flex-1" />
                        <Input v-model="newPortfolio.url" type="url" placeholder="URL" class="flex-1" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          @click="addPortfolio"
                          :disabled="!newPortfolio.title || !newPortfolio.url"
                        >
                          <Plus class="h-4 w-4" />
                        </Button>
                      </div>
                      <div v-if="form.portfolio_links.length" class="space-y-1.5">
                        <div
                          v-for="(link, index) in form.portfolio_links"
                          :key="index"
                          class="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                        >
                          <a :href="link.url" target="_blank" class="text-primary hover:underline flex items-center gap-1">
                            <ExternalLink class="h-3 w-3" />
                            {{ link.title }}
                          </a>
                          <button type="button" @click="removePortfolio(index)" class="text-muted-foreground hover:text-destructive">
                            <X class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Error/Success -->
                    <div v-if="error" class="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                      {{ error }}
                    </div>
                    <div v-if="success" class="p-3 rounded-md bg-green-50 text-green-700 text-sm">
                      {{ success }}
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" @click="isEditDialogOpen = false">Cancel</Button>
                      <Button type="submit" :disabled="isSaving">
                        <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        <!-- Tabs -->
        <Tabs default-value="overview" class="w-full">
          <TabsList class="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <!-- Overview -->
          <TabsContent value="overview" class="space-y-4 mt-4">
            <!-- Bio -->
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-base">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p v-if="form.bio" class="text-sm text-muted-foreground whitespace-pre-wrap">{{ form.bio }}</p>
                <p v-else class="text-sm text-muted-foreground italic">No bio added yet.</p>
              </CardContent>
            </Card>

            <!-- Skills -->
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div v-if="form.skills.length" class="flex flex-wrap gap-1.5">
                  <Badge v-for="skill in form.skills" :key="skill" variant="secondary">
                    {{ skill }}
                  </Badge>
                </div>
                <p v-else class="text-sm text-muted-foreground italic">No skills added.</p>
              </CardContent>
            </Card>

            <!-- Portfolio -->
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-base">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div v-if="form.portfolio_links.length" class="space-y-2">
                  <a
                    v-for="(link, index) in form.portfolio_links"
                    :key="index"
                    :href="link.url"
                    target="_blank"
                    class="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors text-sm"
                  >
                    <ExternalLink class="h-4 w-4 text-primary" />
                    <span>{{ link.title }}</span>
                  </a>
                </div>
                <p v-else class="text-sm text-muted-foreground italic">No portfolio links.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Settings -->
          <TabsContent value="settings" class="space-y-4 mt-4">
            <Card class="overflow-hidden">
              <button
                @click="isEditDialogOpen = true"
                class="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <User class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Edit Profile</p>
                  <p class="text-xs text-muted-foreground">Update your info</p>
                </div>
                <ChevronRight class="h-4 w-4 text-muted-foreground" />
              </button>
              <Separator />
              <button
                @click="router.push('/settings/notifications')"
                class="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <Bell class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Notifications</p>
                  <p class="text-xs text-muted-foreground">Manage alerts</p>
                </div>
                <ChevronRight class="h-4 w-4 text-muted-foreground" />
              </button>
            </Card>

            <Card class="overflow-hidden">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 p-4 hover:bg-destructive/5 transition-colors text-left text-destructive"
              >
                <div class="h-9 w-9 rounded-md bg-destructive/10 flex items-center justify-center">
                  <LogOut class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Log Out</p>
                  <p class="text-xs opacity-70">Sign out</p>
                </div>
              </button>
            </Card>
          </TabsContent>

          <!-- Security -->
          <TabsContent value="security" class="space-y-4 mt-4">
            <Card class="overflow-hidden">
              <div class="flex items-center gap-3 p-4">
                <div class="h-9 w-9 rounded-md bg-green-50 text-green-600 flex items-center justify-center">
                  <CheckCircle class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Phone Verified</p>
                  <p class="text-xs text-muted-foreground">Your phone is verified</p>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>
              <Separator />
              <button
                @click="router.push('/kyc')"
                class="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <Shield class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Account Verification</p>
                  <p class="text-xs text-muted-foreground">Complete KYC</p>
                </div>
                <Button variant="outline" size="sm">Verify</Button>
              </button>
              <Separator />
              <button
                @click="router.push('/verify-email')"
                class="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <Mail class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Email Verification</p>
                  <p class="text-xs text-muted-foreground">Verify your email</p>
                </div>
                <Button variant="outline" size="sm">Verify</Button>
              </button>
            </Card>

            <Card class="overflow-hidden">
              <a
                href="https://budeglobal.in/privacy"
                target="_blank"
                class="flex items-center gap-3 p-4 hover:bg-accent transition-colors"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <FileText class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Privacy Policy</p>
                </div>
                <ExternalLink class="h-4 w-4 text-muted-foreground" />
              </a>
              <Separator />
              <a
                href="https://budeglobal.in/terms"
                target="_blank"
                class="flex items-center gap-3 p-4 hover:bg-accent transition-colors"
              >
                <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <FileText class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Terms of Service</p>
                </div>
                <ExternalLink class="h-4 w-4 text-muted-foreground" />
              </a>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>
