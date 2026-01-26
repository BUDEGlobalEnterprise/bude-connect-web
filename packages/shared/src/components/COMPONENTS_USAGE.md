# New Components - Usage Examples

## 1. FileUploadZone

Perfect for portfolio images, certificates, and resumes.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FileUploadZone } from '@bude/shared';

const files = ref<File[]>([]);
</script>

<template>
  <FileUploadZone
    v-model="files"
    accept="image/*,.pdf"
    :max-size="5 * 1024 * 1024"
    :multiple="true"
    @error="(msg) => console.error(msg)"
  />
</template>
```

## 2. ComboboxMultiSelect

For skills, industries, tech stack selection.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ComboboxMultiSelect } from '@bude/shared';

const skills = ref<string[]>([]);
const options = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'python', label: 'Python' }
];
</script>

<template>
  <ComboboxMultiSelect
    v-model="skills"
    :options="options"
    placeholder="Select your skills..."
  />
</template>
```

## 3. TimelineView

Display work history or education timeline.

```vue
<script setup lang="ts">
import { TimelineView } from '@bude/shared';
import { Briefcase, GraduationCap } from 'lucide-vue-next';

const workHistory = [
  {
    title: 'Senior Developer',
    subtitle: 'BUDE Global',
    description: 'Led development of marketplace platform',
    details: ['Built microservices', 'Managed team of 5'],
    date: '2021 - Present',
    location: 'Remote',
    badge: 'Current',
    icon: Briefcase,
    variant: 'primary'
  }
];
</script>

<template>
  <TimelineView :items="workHistory" orientation="vertical" />
</template>
```

## 4. RatingInput

For reviews and skill proficiency levels.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RatingInput } from '@bude/shared';

const rating = ref(4.5);
</script>

<template>
  <RatingInput
    v-model="rating"
    :max-rating="5"
    :precision="0.5"
    show-value
    size="md"
  />
</template>
```

## 5. NotificationDropdown

Real-time notification center.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { NotificationDropdown } from '@bude/shared';

const notifications = ref([
  {
    id: '1',
    title: 'New proposal received',
    message: 'John Doe submitted a proposal for your project',
    type: 'proposal',
    category: 'Work',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    actions: [
      {
        label: 'View',
        variant: 'default',
        handler: () => console.log('View proposal')
      }
    ]
  }
]);

const markAsRead = (id: string) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) notif.read = true;
};
</script>

<template>
  <NotificationDropdown
    :notifications="notifications"
    @mark-read="markAsRead"
    @mark-all-read="() => notifications.forEach(n => n.read = true)"
    @click="(n) => console.log('Clicked:', n)"
    @view-all="() => $router.push('/notifications')"
  />
</template>
```

## Integration Tips

1. **Import from shared package**:
   ```ts
   import { FileUploadZone, TimelineView, RatingInput } from '@bude/shared';
   ```

2. **All components use shadcn/ui** internally, maintaining design consistency

3. **Fully typed** - Get autocomplete for all props and events

4. **Accessible** - Built with ARIA attributes and keyboard navigation

5. **Responsive** - Mobile-first design approach
