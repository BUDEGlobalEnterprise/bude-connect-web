<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ month }}</h3>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="previousMonth">
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" @click="nextMonth">
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-2">
      <!-- Day headers -->
      <div
        v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
        :key="day"
        class="text-center text-sm font-medium text-muted-foreground"
      >
        {{ day }}
      </div>
      
      <!-- Calendar days -->
      <button
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'aspect-square rounded-md text-sm transition-colors',
          day.isCurrentMonth ? 'hover:bg-accent' : 'text-muted-foreground',
          day.isToday && 'bg-primary/10 font-semibold',
          day.isAvailable ? 'bg-green-100 text-green-900' : '',
          day.isBooked && 'bg-red-100 text-red-900 line-through',
          !day.isCurrentMonth && 'opacity-50'
        ]"
        :disabled="!day.isCurrentMonth || day.isBooked"
        @click="selectDate(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
    
    <div class="flex items-center gap-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="h-3 w-3 rounded bg-green-100" />
        <span>Available</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="h-3 w-3 rounded bg-red-100" />
        <span>Booked</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isAvailable: boolean;
  isBooked: boolean;
}

interface Props {
  availableDates?: Date[];
  bookedDates?: Date[];
}

const props = withDefaults(defineProps<Props>(), {
  availableDates: () => [],
  bookedDates: () => []
});

const emit = defineEmits<{
  select: [date: Date];
}>();

const currentDate = ref(new Date());

const month = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const startingDayOfWeek = firstDay.getDay();
  const days: CalendarDay[] = [];
  
  // Previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
      isBooked: false
    });
  }
  
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      isAvailable: props.availableDates.some(d => d.toDateString() === date.toDateString()),
      isBooked: props.bookedDates.some(d => d.toDateString() === date.toDateString())
    });
  }
  
  // Next month days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
      isBooked: false
    });
  }
  
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1);
};

const selectDate = (day: CalendarDay) => {
  if (day.isCurrentMonth && !day.isBooked) {
    emit('select', day.date);
  }
};
</script>
