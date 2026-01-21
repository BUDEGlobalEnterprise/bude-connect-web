<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@bude/shared/components/ui';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-vue-next';
import {
  getFullFreelancerProfile,
  updateUserCoreFields,
  updateAdditionalInfo,
  updateBasicInfo,
  updateEducation,
  updateWorkExperience,
  updateVolunteerExperience,
  updateCertifications,
  updateSkills,
  updateCareerPreferences,
  updateSocialLinks,
  updateCoverImage,
  type CareerPreferences
} from '@bude/shared/api';

// Import tab components
import BasicInfoTab from './BasicInfoTab.vue';
import MoreInformationTab from './MoreInformationTab.vue';
import EducationExperienceTab from './EducationExperienceTab.vue';
import CertificationSkillsTab from './CertificationSkillsTab.vue';
import CareerPreferencesTab from './CareerPreferencesTab.vue';

const router = useRouter();
const activeTab = ref('user-details');
const isSaving = ref(false);
const isLoading = ref(true);
const error = ref('');
const success = ref('');

// Form data sections
const userDetails = ref<any>({});
const moreInfo = ref<any>({});
const eduExp = ref<any>({ education: [], workExperience: [], volunteerExperience: [] });
const certSkills = ref<any>({ certifications: [], skills: '' });
const careerPrefs = ref<any>({});

// Validation errors
const validationErrors = ref<Record<string, string[]>>({
  'user-details': [],
  'more-info': [],
  'edu-exp': [],
  'cert-skills': [],
  'career-prefs': []
});

// Track if form has been modified
const hasUnsavedChanges = ref(false);

// Validation function
const validateForm = (): boolean => {
  // Reset errors
  validationErrors.value = {
    'user-details': [],
    'more-info': [],
    'edu-exp': [],
    'cert-skills': [],
    'career-prefs': []
  };

  let isValid = true;

  // Validate user details
  if (!userDetails.value.email) {
    validationErrors.value['user-details'].push('Email is required');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.value.email)) {
    validationErrors.value['user-details'].push('Invalid email format');
    isValid = false;
  }

  if (!userDetails.value.firstName) {
    validationErrors.value['user-details'].push('First name is required');
    isValid = false;
  }

  // Validate education entries
  eduExp.value.education?.forEach((edu: any, index: number) => {
    if (!edu.institution) {
      validationErrors.value['edu-exp'].push(`Education ${index + 1}: Institution is required`);
      isValid = false;
    }
    if (!edu.location) {
      validationErrors.value['edu-exp'].push(`Education ${index + 1}: Location is required`);
      isValid = false;
    }
    if (!edu.degreeType) {
      validationErrors.value['edu-exp'].push(`Education ${index + 1}: Degree type is required`);
      isValid = false;
    }
  });

  // Validate work experience
  eduExp.value.workExperience?.forEach((work: any, index: number) => {
    if (!work.title) {
      validationErrors.value['edu-exp'].push(`Work ${index + 1}: Title is required`);
      isValid = false;
    }
    if (!work.company) {
      validationErrors.value['edu-exp'].push(`Work ${index + 1}: Company is required`);
      isValid = false;
    }
  });

  // Validate volunteer experience
  eduExp.value.volunteerExperience?.forEach((vol: any, index: number) => {
    if (!vol.title) {
      validationErrors.value['edu-exp'].push(`Volunteer ${index + 1}: Title is required`);
      isValid = false;
    }
    if (!vol.company) {
      validationErrors.value['edu-exp'].push(`Volunteer ${index + 1}: Organization is required`);
      isValid = false;
    }
  });

  return isValid;
};

// Handle back navigation with unsaved changes warning
const handleBack = () => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.back();
    }
  } else {
    router.back();
  }
};

// Watch for changes
const watchForChanges = () => {
  hasUnsavedChanges.value = true;
};

// Load existing profile data
onMounted(async () => {
  try {
    isLoading.value = true;
    const profile = await getFullFreelancerProfile();
    
    if (profile) {
      // Populate userDetails tab
      userDetails.value = {
        email: profile.email || '',
        language: profile.language || '',
        fullName: profile.full_name || '',
        timezone: profile.time_zone || '',
        firstName: profile.first_name || '',
        country: profile.country || '',
        username: profile.username || '',
        userCategory: profile.user_category || '',
        middleName: profile.middle_name || '',
        openTo: profile.open_to || '',
        lastName: profile.last_name || '',
        coverImage: profile.cover_image || '',
        enabled: !!profile.enabled,
        termsAccepted: !!profile.terms_accepted
      };

      // Populate moreInfo tab
      moreInfo.value = {
        gender: profile.gender || '',
        phone: profile.phone || '',
        mobileNo: profile.mobile_no || '',
        birthDate: profile.birth_date || '',
        location: profile.location || '',
        linkedinId: profile.linkedin_id || '',
        githubId: profile.github_id || '',
        twitterId: profile.twitter_id || '',
        mediumId: profile.medium_id || '',
        profession: profile.profession || '',
        interests: profile.interests || '',
        bio: profile.bio || '',
        hidePrivateInfo: !!profile.hide_private_info
      };

      // Populate eduExp tab
      eduExp.value = {
        education: profile.education || [],
        workExperience: profile.work_experience || [],
        volunteerExperience: profile.volunteer_experience || []
      };

      // Populate certSkills tab
      certSkills.value = {
        certifications: profile.certifications || [],
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '')
      };

      // Populate careerPrefs tab
      const cp = profile.career_preferences || {};
      careerPrefs.value = {
        preferredFunctions: Array.isArray(cp.preferredFunctions) ? cp.preferredFunctions.join(', ') : '',
        preferredIndustries: Array.isArray(cp.preferredIndustries) ? cp.preferredIndustries.join(', ') : '',
        preferredLocation: cp.preferredLocation || '',
        dreamCompanies: Array.isArray(cp.dreamCompanies) ? cp.dreamCompanies.join(', ') : '',
        attirePreference: cp.workEnvironment?.attirePreference || '',
        locationPreference: cp.workEnvironment?.locationPreference || '',
        collaborationPreference: cp.workEnvironment?.collaborationPreference || '',
        timePreference: cp.workEnvironment?.timePreference || '',
        rolePreference: cp.workEnvironment?.rolePreference || '',
        companyType: cp.workEnvironment?.companyType || ''
      };
    }
  } catch (e: any) {
    console.error('Failed to load profile:', e);
    error.value = e.message || 'Failed to load profile data';
  } finally {
    isLoading.value = false;
  }
});

// Save profile
const handleSave = async () => {
  // Validate form first
  if (!validateForm()) {
    error.value = 'Please fix validation errors before saving';
    // Switch to first tab with errors
    const tabsWithErrors = Object.keys(validationErrors.value).filter(
      tab => validationErrors.value[tab].length > 0
    );
    if (tabsWithErrors.length) {
      activeTab.value = tabsWithErrors[0];
    }
    return;
  }

  isSaving.value = true;
  error.value = '';
  success.value = '';

  try {
    // 1. Update User core fields (gender, birthDate, middleName)
    if (moreInfo.value.gender || moreInfo.value.birthDate || moreInfo.value.middleName) {
      await updateUserCoreFields({
        middle_name: moreInfo.value.middleName,
        gender: moreInfo.value.gender,
        birth_date: moreInfo.value.birthDate
      });
    }

    // 2. Update Bude Profile additional info
    await updateAdditionalInfo({
      profession: moreInfo.value.profession,
      open_to: userDetails.value.openTo,
      user_category: userDetails.value.userCategory,
      hide_private_info: moreInfo.value.hidePrivateInfo,
      terms_accepted: userDetails.value.termsAccepted
    });

    // 3. Update basic info
    await updateBasicInfo({
      bio: moreInfo.value.bio,
      location: moreInfo.value.location,
      interests: moreInfo.value.interests,
      phone_alternate: moreInfo.value.phone
    });

    // 4. Update education
    if (eduExp.value.education?.length) {
      await updateEducation(eduExp.value.education.map((edu: any) => ({
        institution: edu.institution,
        location: edu.location,
        degree: edu.degreeType,
        field_of_study: edu.fieldOfStudy,
        start_date: edu.startDate,
        end_date: edu.endDate,
        is_current: edu.isCurrent
      })));
    }

    // 5. Update work experience
    if (eduExp.value.workExperience?.length) {
      await updateWorkExperience(eduExp.value.workExperience.map((work: any) => ({
        company: work.company,
        position: work.title,
        location: work.location,
        start_date: work.fromDate,
        end_date: work.toDate,
        is_current: work.isCurrent
      })));
    }

    // 6. Update volunteer experience
    if (eduExp.value.volunteerExperience?.length) {
      await updateVolunteerExperience(eduExp.value.volunteerExperience.map((vol: any) => ({
        title: vol.title,
        organization: vol.company,
        location: vol.location,
        start_date: vol.fromDate,
        end_date: vol.toDate,
        is_current: vol.isCurrent
      })));
    }

    // 7. Update certifications
    if (certSkills.value.certifications?.length) {
      await updateCertifications(certSkills.value.certifications.map((cert: any) => ({
        certification_name: cert.certificationName,
        organization: cert.organization,
        issue_date: cert.issueDate
      })));
    }

    // 8. Update skills
    if (certSkills.value.skills) {
      const skillsArray = certSkills.value.skills
        .split(/[,\n]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s);
      await updateSkills(skillsArray);
    }

    // 9. Update career preferences
    const careerPreferences: CareerPreferences = {
      preferredFunctions: careerPrefs.value.preferredFunctions?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
      preferredIndustries: careerPrefs.value.preferredIndustries?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
      preferredLocation: careerPrefs.value.preferredLocation || '',
      dreamCompanies: careerPrefs.value.dreamCompanies?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
      workEnvironment: {
        attirePreference: careerPrefs.value.attirePreference,
        locationPreference: careerPrefs.value.locationPreference,
        collaborationPreference: careerPrefs.value.collaborationPreference,
        timePreference: careerPrefs.value.timePreference,
        rolePreference: careerPrefs.value.rolePreference,
        companyType: careerPrefs.value.companyType
      }
    };
    await updateCareerPreferences(careerPreferences);

    // 10. Upload cover image if changed
    if (userDetails.value.coverImageFile) {
      await updateCoverImage(userDetails.value.coverImageFile);
    }

    success.value = 'Profile saved successfully!';
    hasUnsavedChanges.value = false;
    
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e: any) {
    console.error('Save error:', e);
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
          <button @click="handleBack" class="rounded-md p-2 hover:bg-accent">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold">Complete Freelancer Profile</h1>
        </div>
        
        <Button @click="handleSave" :disabled="isSaving || isLoading">
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
      <div v-if="error" class="mb-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-start gap-2">
        <AlertCircle class="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-medium">Error saving profile</p>
          <p class="text-sm mt-1">{{ error }}</p>
        </div>
        <button @click="error = ''" class="ml-2 hover:opacity-70">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="success" class="mb-4 p-4 rounded-md bg-green-50 text-green-700 flex items-center gap-2">
        <CheckCircle2 class="h-5 w-5 flex-shrink-0" />
        <span>{{ success }}</span>
      </div>

      <!-- Loading Skeleton -->
      <Card v-if="isLoading">
        <CardHeader>
          <div class="h-6 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="h-10 w-full bg-muted animate-pulse rounded" />
          <div class="grid grid-cols-2 gap-4">
            <div class="h-32 bg-muted animate-pulse rounded" />
            <div class="h-32 bg-muted animate-pulse rounded" />
          </div>
          <div class="h-10 w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>

      <!-- Profile Form -->
      <Card v-else>
        <CardHeader>
          <CardTitle>Professional Profile Information</CardTitle>
          <p class="text-sm text-muted-foreground mt-1">
            Complete all sections to maximize your profile visibility
          </p>
        </CardHeader>
        <CardContent>
          <Tabs v-model="activeTab" class="w-full">
            <TabsList class="grid w-full grid-cols-5 h-auto">
              <TabsTrigger 
                value="user-details" 
                class="text-xs sm:text-sm"
                :class="validationErrors.userDetails?.length ? 'text-destructive' : ''"
              >
                User Details
                <span v-if="validationErrors.userDetails?.length" class="ml-1 text-destructive">*</span>
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

            <!-- Validation Errors Summary -->
            <div v-if="validationErrors[activeTab]?.length" class="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200">
              <p class="text-sm font-medium text-amber-900">Please fix the following errors:</p>
              <ul class="mt-2 text-sm text-amber-800 list-disc list-inside">
                <li v-for="(err, idx) in validationErrors[activeTab]" :key="idx">{{ err }}</li>
              </ul>
            </div>

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
      <div v-if="!isLoading" class="mt-6 flex justify-end">
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
