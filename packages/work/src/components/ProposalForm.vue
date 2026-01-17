<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@bude/shared/components";

const emit = defineEmits<{
  submit: [data: { bid_amount: number; proposal_text: string }];
  cancel: [];
}>();

const proposal = ref({ bid_amount: 0, proposal_text: "" });
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!proposal.value.bid_amount || !proposal.value.proposal_text) return;
  isSubmitting.value = true;
  try {
    emit("submit", proposal.value);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="border-t pt-6 mt-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Proposal</h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Bid Amount (₹)</label
        >
        <input
          v-model.number="proposal.bid_amount"
          type="number"
          min="0"
          class="input"
          placeholder="Your price for this job"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Cover Letter</label
        >
        <textarea
          v-model="proposal.proposal_text"
          rows="5"
          class="input"
          placeholder="Why are you the best fit for this job?"
        ></textarea>
      </div>
      <div class="flex gap-4">
        <Button
          :loading="isSubmitting"
          :disabled="!proposal.bid_amount || !proposal.proposal_text"
          @click="handleSubmit"
        >
          Submit Proposal
        </Button>
        <Button variant="secondary" @click="emit('cancel')">Cancel</Button>
      </div>
    </div>
  </div>
</template>
