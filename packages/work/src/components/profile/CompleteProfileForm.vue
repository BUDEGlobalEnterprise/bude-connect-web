<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@bude/shared/components/ui';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-vue-next';

// Import tab components
import BasicInfoTab from './BasicInfoTab.vue';
import MoreInformationTab from './MoreInformationTab.vue';
import EducationExperienceTab from './EducationExperienceTab.vue';
import CertificationSkillsTab from './CertificationSkillsTab.vue';
import CareerPreferencesTab from './CareerPreferencesTab.vue';

const router = useRouter();
const activeTab = ref('user-details');
const isSaving = ref(false);
const error = ref('');
const success = ref('');

// Form data sections
const userDetails = ref({});
const moreInfo = ref({});
const eduExp = ref({});
const certSkills = ref({});
const careerPrefs = ref({});

// Load existing profile data
onMounted(async () => {
  // TODO: Load from backend API
  console.log('Loading profile data...');
});

// Save profile
const handleSave = async () => {
  isSaving.value = true;
  error.value = '';
  success.value = '';

  try {
    // Aggregate all form data
    const profileData = {
      ...userDetails.value,
      ...moreInfo.value,
      ...eduExp.value,
      ...certSkills.value,
      ...careerPrefs.value
    };

    console.log('Saving profile:', profileData);
    
    // TODO: Call backend API endpoints
    // await updateAdditionalInfo()
    // await updateUserCoreFields()
    // await updateEducation()
    // await updateVolunteerExperience()
    // await updateCertifications()
    // await updateCareerPreferences()

    success.value = 'Profile saved successfully!';
    
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e: any) {
    error.value = e.message || 'Failed to save profile';
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card sticky top-0 z-10">
      <div class="container flex h-14 items-center px-4 justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="rounded-md p-2 hover:bg-accent">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold">Complete Freelancer Profile</h1>
        </div>
        
        <Button @click="handleSave" :disabled="isSaving">
          <Save v-if="!isSaving" class="h-4 w-4 mr-2" />
          <svg v-else class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ isSaving ? 'Saving...' : 'Save Profile' }}
        </Button>
      </div>
    </header>

    <main class="container max-w-5xl px-4 py-6">
      <!-- Success/Error Messages -->
      <div v-if="error" class="mb-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
        <AlertCircle class="h-5 w-5" />
        <span>{{ error }}</span>
      </div>

      <div v-if="success" class="mb-4 p-4 rounded-md bg-green-50 text-green-700 flex items-center gap-2">
        <CheckCircle2 class="h-5 w-5" />
        <span>{{ success }}</span>
      </div>

      <!-- Profile Form -->
      <Card>
        <CardHeader>
          <CardTitle>Professional Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs v-model="activeTab" class="w-full">
            <TabsList class="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="user-details" class="text-xs sm:text-sm">
                User Details
              </TabsTrigger>
              <TabsTrigger value="more-info" class="text-xs sm:text-sm">
                More Information
              </TabsTrigger>
              <TabsTrigger value="edu-exp" class="text-xs sm:text-sm">
                Education & Experience
              </TabsTrigger>
              <TabsTrigger value="cert-skills" class="text-xs sm:text-sm">
                Certification & Skills
              </TabsTrigger>
              <TabsTrigger value="career-prefs" class="text-xs sm:text-sm">
                Career Preferences
              </TabsTrigger>
            </TabsList>

            <!-- Tab 1: User Details -->
            <TabsContent value="user-details" class="mt-6">
              <BasicInfoTab v-model="userDetails" />
            </TabsContent>

            <!-- Tab 2: More Information -->
            <TabsContent value="more-info" class="mt-6">
              <MoreInformationTab v-model="moreInfo" />
            </TabsContent>

            <!-- Tab 3: Education & Experience -->
            <TabsContent value="edu-exp" class="mt-6">
              <EducationExperienceTab v-model="eduExp" />
            </TabsContent>

            <!-- Tab 4: Certification & Skills -->
            <TabsContent value="cert-skills" class="mt-6">
              <CertificationSkillsTab v-model="certSkills" />
            </TabsContent>

            <!-- Tab 5: Career Preferences -->
            <TabsContent value="career-prefs" class="mt-6">
              <CareerPreferencesTab v-model="careerPrefs" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <!-- Bottom Save Button -->
      <div class="mt-6 flex justify-end">
        <Button @click="handleSave" :disabled="isSaving" size="lg">
          <Save v-if="!isSaving" class="h-5 w-5 mr-2" />
          <svg v-else class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ isSaving ? 'Saving Profile...' : 'Save All Changes' }}
        </Button>
      </div>
    </main>
  </div>
</template>
