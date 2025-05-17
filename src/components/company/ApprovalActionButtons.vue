<!-- components/ApprovalActionButtons.vue -->
<template>
  <div class="approval-buttons">
    <div class="d-grid gap-2">
      <button class="btn btn-success" @click="showApproveModal = true" :disabled="loading">
        <i class="bi bi-check-circle me-2"></i>
        Duyệt đơn
      </button>

      <button class="btn btn-danger" @click="showRejectModal = true" :disabled="loading">
        <i class="bi bi-x-circle me-2"></i>
        Từ chối
      </button>

      <div v-if="loading" class="text-center mt-2">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Đang xử lý...</span>
        </div>
        <span class="ms-2">Đang xử lý...</span>
      </div>
    </div>

    <!-- Confirm modals using Teleport -->
    <Teleport to="body">
      <!-- Reject modal -->
      <div v-if="showRejectModal" class="modal-backdrop" @click.self="showRejectModal = false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Xác nhận từ chối đơn</h5>
              <button type="button" class="btn-close" @click="showRejectModal = false"></button>
            </div>
            <div class="modal-body">
              <p>Bạn có chắc chắn muốn từ chối đơn đăng ký này?</p>
              <p class="text-danger">
                Nếu từ chối, hệ thống sẽ tự động kích hoạt đơn đăng ký ở nguyện vọng thấp hơn tiếp
                theo của sinh viên.
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showRejectModal = false">
                Hủy
              </button>
              <button type="button" class="btn btn-danger" @click="confirmReject">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Approve modal -->
      <div v-if="showApproveModal" class="modal-backdrop" @click.self="showApproveModal = false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Xác nhận duyệt đơn</h5>
              <button type="button" class="btn-close" @click="showApproveModal = false"></button>
            </div>
            <div class="modal-body">
              <p>Bạn có chắc chắn muốn duyệt đơn đăng ký này?</p>
              <p class="text-success">
                Khi duyệt đơn, sinh viên sẽ được thực tập tại vị trí này và các đơn đăng ký khác của
                sinh viên sẽ tự động bị hủy.
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showApproveModal = false">
                Hủy
              </button>
              <button type="button" class="btn btn-success" @click="confirmApprove">
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  applicationDetailId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['approve', 'reject'])
const loading = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)

const confirmApprove = () => {
  loading.value = true
  showApproveModal.value = false
  emit('approve', props.applicationDetailId)
}

const confirmReject = () => {
  loading.value = true
  showRejectModal.value = false
  emit('reject', props.applicationDetailId)
}
</script>

<style scoped>
.approval-buttons {
  border-radius: 8px;
}

/* Custom modal styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.modal-content {
  background-color: white;
  border-radius: 0.3rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
