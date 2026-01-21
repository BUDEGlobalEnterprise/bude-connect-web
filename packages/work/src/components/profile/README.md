# Freelancer Profile Form Components

## Overview

Vue 3 components for comprehensive freelancer profile management, matching the 5 UI screenshots provided. Built with Composition API, TypeScript, and Tailwind CSS.

## Components

### Main Component

**`CompleteProfileForm.vue`** - Main wrapper component
- 5-tab interface matching UI screenshots
- Sticky header with back button and save button
- Success/error message handling
- Aggregates data from all tab components

Location: `packages/work/src/components/profile/CompleteProfileForm.vue`

### Tab Components

#### 1. BasicInfoTab.vue - User Details (Screenshot 1)
**Fields:**
- Email*, Language, Full Name, Time Zone
- First Name*, Country, Username, User Category
- Middle Name, Open to, Last Name
- Cover Image upload
- Enabled checkbox, Terms Accepted checkbox

#### 2. MoreInformationTab.vue - More Information (Screenshot 2)
**Fields:**
- Gender, Phone, Mobile No, Birth Date
- Location, LinkedIn ID, Github ID, Twitter ID, Medium ID
- Profession
- Interests (textarea), Bio (textarea)
- Hide Private Info checkbox

#### 3. EducationExperienceTab.vue - Education & Experience (Screenshot 3)
**Features:**
- **Education Details** (dynamic table)
  - Institution Name*, Location*, Degree Type*, Field of Study*
  - Add/Remove functionality
- **Work Experience Details** (dynamic table)
  - Title*, Company*, Location*, Is Current, From Date*, To Date
  - Add/Remove functionality
- **Volunteering/Internship** (dynamic table)
  - Title*, Company*, Location*, Is Current, From Date*, To Date
  - Add/Remove functionality

#### 4. CertificationSkillsTab.vue - Certification & Skills (Screenshot 4)
**Features:**
- **Certification Details** (dynamic table)
  - Certification Name*, Organization*, Issue Date*
  - Add/Remove functionality
- **Skill Details** (large textarea)
  - Free-form skill list entry
  - Character counter

#### 5. CareerPreferencesTab.vue - Career Preferences (Screenshot 5)
**Career Preference Fields:**
- Preferred Functions, Preferred Industries
- Preferred Location, Dream Companies

**Work Environment Fields:**
- Attire Preference (dropdown)
- Location Preference (dropdown)
- Collaboration Preference (dropdown)
- Time Preference (dropdown)
- Role Preference (dropdown)
- Company Type (dropdown)

## Usage

```vue
<script setup>
import CompleteProfileForm from '@/components/profile/CompleteProfileForm.vue';
</script>

<template>
  <CompleteProfileForm />
</template>
```

Or in router:
```typescript
// router/index.ts
{
  path: '/profile/complete',
  name: 'CompleteProfile',
  component: () => import('@/components/profile/CompleteProfileForm.vue')
}
```

## Data Flow

Each tab component uses `v-model` for two-way binding:
```vue
<BasicInfoTab v-model="userDetails" />
```

Data emits up to `CompleteProfileForm` which aggregates all sections on save.

## API Integration (TODO)

The `handleSave` function in `CompleteProfileForm.vue` needs to be connected to backend API endpoints:

```typescript
// Example integration
import { 
  updateUserCoreFields,
  updateAdditionalInfo,
  updateVolunteerExperience,
  updateCareerPreferences
} from '@bude/shared/api';

const handleSave = async () => {
  // 1. Save User core fields (gender, birthDate, middleName)
  await updateUserCoreFields({
    middle_name: moreInfo.value.middleName,
    gender: moreInfo.value.gender,
    birth_date: moreInfo.value.birthDate
  });

  // 2. Save Bude Profile custom fields
  await updateAdditionalInfo({
    profession: moreInfo.value.profession,
    open_to: userDetails.value.openTo,
    user_category: userDetails.value.userCategory,
    hide_private_info: moreInfo.value.hidePrivateInfo,
    terms_accepted: userDetails.value.termsAccepted
  });

  // 3. Save volunteer experience
  await updateVolunteerExperience({
    volunteer_experience: eduExp.value.volunteerExperience
  });

  // 4. Save career preferences as JSON
  await updateCareerPreferences({
    preferences: {
      preferredFunctions: careerPrefs.value.preferredFunctions?.split(',') || [],
      preferredIndustries: careerPrefs.value.preferredIndustries?.split(',') || [],
      preferredLocation: careerPrefs.value.preferredLocation,
      dreamCompanies: careerPrefs.value.dreamCompanies?.split(',') || [],
      workEnvironment: {
        attirePreference: careerPrefs.value.attirePreference,
        locationPreference: careerPrefs.value.locationPreference,
        collaborationPreference: careerPrefs.value.collaborationPreference,
        timePreference: careerPrefs.value.timePreference,
        rolePreference: careerPrefs.value.rolePreference,
        companyType: careerPrefs.value.companyType
      }
    }
  });

  // Similarly for education, work experience, certifications, etc.
};
```

## Styling

Components use shadcn/ui components and Tailwind CSS classes. All styling is consistent with the existing work app design system.

## Validation

Form validation should be added:
- Required fields are marked with `*`
- Email format validation
- Date range validation (start date < end date)
- Phone number format
- URL format for social links

## Next Steps

1. Add API integration in `handleSave()`
2. Add `onMounted()` to load existing profile data
3. Add form validation
4. Add loading skeletons
5. Add confirmation dialogs before discarding changes
6. Add autosave functionality
7. Add profile completion percentage indicator

## Files Created

- `packages/work/src/components/profile/BasicInfoTab.vue`
- `packages/work/src/components/profile/MoreInformationTab.vue`
- `packages/work/src/components/profile/EducationExperienceTab.vue`
- `packages/work/src/components/profile/CertificationSkillsTab.vue`
- `packages/work/src/components/profile/CareerPreferencesTab.vue`
- `packages/work/src/components/profile/CompleteProfileForm.vue`
