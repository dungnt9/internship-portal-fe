<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop fade show"></div>
    <div
      v-if="show"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block"
      aria-modal="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
            <p v-if="warning" class="text-danger mt-2"><strong>Lưu ý:</strong> {{ warning }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              {{ cancelText }}
            </button>
            <button type="button" class="btn btn-danger" @click="confirmAction" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Xác nhận',
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
  },
  warning: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Xác nhận',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'close'])

const confirmAction = () => {
  emit('confirm')
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 1040;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal-dialog {
  margin: 1.75rem auto;
  max-width: 500px;
}

.modal-content {
  border-radius: 0.5rem;
}

.btn-danger {
  background-color: #c02135;
  border-color: #c02135;
}

.btn-danger:hover {
  background-color: #a61b2d;
  border-color: #a61b2d;
}
</style>
