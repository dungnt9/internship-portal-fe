<!--
  File path: D:\code\datn\internship-portal-fe\src\components\company\EditPosition.vue
-->
<template>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Chỉnh sửa vị trí thực tập</h2>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="loading" class="loading-spinner">
          <div class="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
          <button class="retry-button" @click="fetchPositionDetails">Thử lại</button>
        </div>

        <div v-else class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="title">Tên vị trí <span class="required">*</span></label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="Nhập tên vị trí thực tập"
              />
            </div>

            <div class="form-group">
              <label for="description">Mô tả <span class="required">*</span></label>
              <textarea
                id="description"
                v-model="formData.description"
                required
                placeholder="Mô tả về vị trí thực tập"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="requirements">Yêu cầu <span class="required">*</span></label>
              <textarea
                id="requirements"
                v-model="formData.requirements"
                required
                placeholder="Yêu cầu đối với sinh viên thực tập"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="benefits">Quyền lợi <span class="required">*</span></label>
              <textarea
                id="benefits"
                v-model="formData.benefits"
                required
                placeholder="Quyền lợi dành cho sinh viên thực tập"
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group half-width">
                <label for="availableSlots">Số lượng <span class="required">*</span></label>
                <input
                  id="availableSlots"
                  v-model.number="formData.availableSlots"
                  type="number"
                  required
                  min="1"
                  placeholder="Số lượng sinh viên cần tuyển"
                />
              </div>

              <div class="form-group half-width">
                <label for="workType">Hình thức làm việc <span class="required">*</span></label>
                <select id="workType" v-model="formData.workType" required>
                  <option value="">-- Chọn hình thức --</option>
                  <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
                  <option value="PART_TIME">Bán thời gian (Part-time)</option>
                  <option value="REMOTE">Từ xa (Remote)</option>
                  <option value="HYBRID">Kết hợp (Hybrid)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half-width">
                <label for="status">Trạng thái <span class="required">*</span></label>
                <select id="status" v-model="formData.status" required>
                  <option value="OPEN">Đang mở</option>
                  <option value="CLOSED">Đã đóng</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" @click="closeModal">Hủy</button>
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Đang xử lý...
                </span>
                <span v-else>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { getListPosition, updatePosition } from '@/services/registerService'

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  positionId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['close', 'position-updated'])

const loading = ref(false)
const error = ref(null)
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  availableSlots: 1,
  workType: '',
  status: 'OPEN',
})

watch(
  () => props.positionId,
  (newVal) => {
    if (newVal && props.showModal) {
      fetchPositionDetails()
    }
  },
)

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal && props.positionId) {
      fetchPositionDetails()
    }
  },
)

const fetchPositionDetails = async () => {
  if (!props.positionId) return

  loading.value = true
  error.value = null

  try {
    const response = await getListPosition()

    if (response && response.data) {
      const position = response.data.find((pos) => pos.id === parseInt(props.positionId))

      if (position) {
        // Map API data to form data
        formData.title = position.title || ''
        formData.description = position.description || ''
        formData.requirements = position.requirements || ''
        formData.benefits = position.benefits || ''
        formData.availableSlots = position.availableSlots || 1
        formData.workType = mapWorkTypeToForm(position.workType)
        formData.status = position.status || 'OPEN'
      } else {
        error.value = 'Não foi possível encontrar a posição solicitada.'
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin vị trí:', err)
    error.value = 'Không thể tải thông tin vị trí. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  } catch (e) {
    console.error('Lỗi chuyển đổi ngày tháng:', e)
    return ''
  }
}

const mapWorkTypeToForm = (workType) => {
  if (!workType) return ''

  const workTypeMap = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    Remote: 'REMOTE',
    Hybrid: 'HYBRID',
  }

  return workTypeMap[workType] || workType
}

const closeModal = () => {
  emit('close')
}

const submitForm = async () => {
  isSubmitting.value = true

  try {
    const response = await updatePosition(props.positionId, {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits,
      availableSlots: formData.availableSlots,
      workType: formData.workType,
      status: formData.status,
    })

    if (response && response.data) {
      emit('position-updated', response.data)
      closeModal()
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật vị trí:', error)
    alert('Có lỗi xảy ra khi cập nhật vị trí. Vui lòng thử lại sau.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #c02135;
}

.modal-body {
  padding: 20px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c02135;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 30px 20px;
  color: #c02135;
}

.retry-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.half-width {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #c02135;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.registered-info {
  background-color: #f8f9fa;
  border-left: 4px solid #4a90e2;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 0 4px 4px 0;
}

.registered-info p {
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-button {
  background-color: #f3f3f3;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button:hover {
  background-color: #e5e5e5;
}

.submit-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.submit-button:hover {
  background-color: #a01c2d;
}

.submit-button:disabled {
  background-color: #d4667a;
  cursor: not-allowed;
}

/* For small screens */
@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>
