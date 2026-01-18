<template>
  <div v-if="password" class="password-strength-meter">
    <div class="strength-bar-container">
      <div
        class="strength-bar"
        :class="strengthClass"
        :style="{ width: `${strength}%` }"
      ></div>
    </div>
    <p class="strength-text" :class="strengthClass">
      {{ strengthText }}
    </p>

    <ul class="requirements-list">
      <li :class="{ met: hasMinLength }">
        <span class="icon">{{ hasMinLength ? '✓' : '○' }}</span>
        At least 8 characters
      </li>
      <li :class="{ met: hasUppercase }">
        <span class="icon">{{ hasUppercase ? '✓' : '○' }}</span>
        One uppercase letter
      </li>
      <li :class="{ met: hasLowercase }">
        <span class="icon">{{ hasLowercase ? '✓' : '○' }}</span>
        One lowercase letter
      </li>
      <li :class="{ met: hasNumber }">
        <span class="icon">{{ hasNumber ? '✓' : '○' }}</span>
        One number
      </li>
      <li :class="{ met: hasSpecial }">
        <span class="icon">{{ hasSpecial ? '✓' : '○' }}</span>
        One special character (!@#$%^&*)
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  password: string;
}>();

const emit = defineEmits<{
  (e: 'strength-change', value: { strength: number; isValid: boolean }): void;
}>();

const strength = ref(0);
const strengthText = ref('');
const strengthClass = ref('');

const hasMinLength = computed(() => props.password.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(props.password));
const hasLowercase = computed(() => /[a-z]/.test(props.password));
const hasNumber = computed(() => /\d/.test(props.password));
const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(props.password));

const isValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasSpecial.value
  );
});

watch(
  () => props.password,
  (newPassword) => {
    if (!newPassword) {
      strength.value = 0;
      strengthText.value = '';
      strengthClass.value = '';
      emit('strength-change', { strength: 0, isValid: false });
      return;
    }

    // Calculate strength score (0-100)
    let score = 0;
    const checks = [
      hasMinLength.value,
      hasUppercase.value,
      hasLowercase.value,
      hasNumber.value,
      hasSpecial.value,
    ];

    score = checks.filter(Boolean).length * 20;

    // Additional length bonus
    if (newPassword.length >= 12) score += 10;
    if (newPassword.length >= 16) score += 10;

    strength.value = Math.min(score, 100);

    // Set strength text and class
    if (strength.value <= 40) {
      strengthText.value = 'Weak password';
      strengthClass.value = 'weak';
    } else if (strength.value <= 60) {
      strengthText.value = 'Fair password';
      strengthClass.value = 'fair';
    } else if (strength.value <= 80) {
      strengthText.value = 'Good password';
      strengthClass.value = 'good';
    } else {
      strengthText.value = 'Strong password';
      strengthClass.value = 'strong';
    }

    emit('strength-change', { strength: strength.value, isValid: isValid.value });
  },
  { immediate: true }
);
</script>

<style scoped>
.password-strength-meter {
  margin-top: 0.5rem;
}

.strength-bar-container {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-bar {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 2px;
}

.strength-bar.weak {
  background-color: #ef4444;
}

.strength-bar.fair {
  background-color: #f59e0b;
}

.strength-bar.good {
  background-color: #3b82f6;
}

.strength-bar.strong {
  background-color: #10b981;
}

.strength-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.fair {
  color: #f59e0b;
}

.strength-text.good {
  color: #3b82f6;
}

.strength-text.strong {
  color: #10b981;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.requirements-list li.met {
  color: #10b981;
}

.requirements-list li .icon {
  font-weight: bold;
  font-size: 0.875rem;
}
</style>
