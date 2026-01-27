<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Badge, Button } from '@bude/shared/components';
import { adminApi } from '@bude/shared';

const pendingRequests = ref<any[]>([]);
const selectedUser = ref<any>(null);
const loading = ref(true);
const processing = ref(false);
const approvalReason = ref('');

const fetchPending = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getPendingKYC();
    if (res && res.data) {
      pendingRequests.value = res.data;
      if (pendingRequests.value.length > 0 && !selectedUser.value) {
        selectedUser.value = pendingRequests.value[0];
      }
    }
  } catch (error) {
    console.error('Failed to fetch KYC requests:', error);
  } finally {
    loading.value = false;
  }
};

const approve = async () => {
  if (!selectedUser.value || processing.value) return;
  processing.value = true;
  try {
    await adminApi.approveKYC(selectedUser.value.name);
    selectedUser.value = null;
    await fetchPending();
  } catch (error) {
    console.error('Approval failed:', error);
  } finally {
    processing.value = false;
  }
};

const reject = async () => {
  if (!selectedUser.value || !approvalReason.value || processing.value) return;
  processing.value = true;
  try {
    await adminApi.rejectKYC(selectedUser.value.name, approvalReason.value);
    selectedUser.value = null;
    approvalReason.value = '';
    await fetchPending();
  } catch (error) {
    console.error('Rejection failed:', error);
  } finally {
    processing.value = false;
  }
};

onMounted(fetchPending);
</script>

<template>
  <div class="h-full flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">KYC Auditor</h1>
        <p class="text-slate-500">Review and verify user identities.</p>
      </div>
      <div class="flex gap-2">
        <Badge variant="warning">12 Pending</Badge>
        <Badge variant="success">420 Verified</Badge>
      </div>
    </div>

    <!-- Multi-Pane Auditor -->
    <div class="flex-1 flex gap-8 min-h-0 overflow-hidden">
      <!-- Sidebar List -->
      <div class="w-80 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
        <div class="p-4 border-b">
          <input type="text" placeholder="Search pending..." class="w-full px-4 py-2 rounded-lg border text-sm" />
        </div>
        <div class="flex-1 overflow-y-auto divide-y">
          <div 
            v-for="req in pendingRequests" 
            :key="req.name" 
            @click="selectedUser = req"
            class="p-4 cursor-pointer transition-colors"
            :class="selectedUser?.name === req.name ? 'bg-primary-50 border-r-4 border-primary-500' : 'hover:bg-slate-50'"
          >
            <p class="font-bold text-slate-800">{{ req.full_name }}</p>
            <p class="text-xs text-slate-500">{{ req.name }}</p>
            <Badge variant="warning" class="mt-2">Pending</Badge>
          </div>
          
          <div v-if="!loading && pendingRequests.length === 0" class="p-8 text-center text-slate-400 italic">
            No pending KYC requests.
          </div>
        </div>
      </div>

      <div v-if="selectedUser" class="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
        <header class="p-6 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="font-bold text-slate-900">{{ selectedUser.full_name }}</h3>
            <p class="text-sm text-slate-500">{{ selectedUser.user }} • {{ selectedUser.kyc_id_type }}</p>
          </div>
          <div class="flex gap-3">
            <Button 
              variant="outline" 
              class="text-red-600 border-red-200"
              @click="reject"
              :disabled="processing || !approvalReason"
            >
              Reject
            </Button>
            <Button 
              variant="primary"
              @click="approve"
              :disabled="processing"
            >
              {{ processing ? 'Processing...' : 'Approve Identity' }}
            </Button>
          </div>
        </header>

        <div class="flex-1 flex overflow-hidden">
          <!-- Documents List -->
          <div class="w-64 border-r p-6 space-y-4 bg-slate-50/50 overflow-y-auto">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Submitted Docs</h4>
            <div 
              class="p-3 rounded-xl border bg-white shadow-sm cursor-pointer border-primary-500 ring-2 ring-primary-100"
            >
              <p class="text-sm font-semibold text-slate-800">Front Side</p>
              <p class="text-xs text-slate-500 uppercase">{{ selectedUser.kyc_id_type }}</p>
            </div>
            <div 
              v-if="selectedUser.kyc_id_back"
              class="p-3 rounded-xl border bg-white shadow-sm cursor-pointer hover:border-primary-500"
            >
              <p class="text-sm font-semibold text-slate-800">Back Side</p>
              <p class="text-xs text-slate-500 uppercase">{{ selectedUser.kyc_id_type }}</p>
            </div>
          </div>

          <!-- Document Viewer -->
          <div class="flex-1 p-8 overflow-y-auto bg-slate-100">
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="bg-white p-4 rounded-2xl shadow-lg border">
                <img :src="selectedUser.kyc_id_front" class="w-full rounded-lg" alt="Doc Preview" />
              </div>
              
              <div class="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <h4 class="font-bold text-slate-800">Auditor Notes</h4>
                <textarea 
                  v-model="approvalReason"
                  placeholder="Internal notes or rejection reason (required for rejection)..."
                  class="w-full h-32 p-4 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="flex-1 bg-white rounded-2xl border border-dashed flex items-center justify-center text-slate-400 italic">
        Select a request to start auditing.
      </div>
    </div>
  </div>
</template>
