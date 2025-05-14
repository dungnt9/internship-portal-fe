<!--
  File path: D:\code\datn\internship-portal-fe\src\components\company\AddPosition.vue
-->
<template>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Thêm vị trí thực tập mới</h2>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
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
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="dueDate">Hạn đăng ký <span class="required">*</span></label>
              <input
                id="dueDate"
                v-model="formData.dueDate"
                type="date"
                required
                :min="currentDate"
              />
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" @click="closeModal">Hủy</button>
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Đang xử lý...
                </span>
                <span v-else>Thêm vị trí</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getCurrentPeriod, createPosition } from '@/services/registerService'
import { useRouter } from 'vue-router'

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'position-added'])

const router = useRouter()
const currentPeriodId = ref('')
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  availableSlots: 1,
  workType: '',
  dueDate: '',
  periodId: '',
})

const currentDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

onMounted(async () => {
  try {
    const response = await getCurrentPeriod()
    if (response && response.data) {
      currentPeriodId.value = response.data.id
      formData.periodId = response.data.id
    } else {
      console.error('Không thể lấy kỳ thực tập hiện tại')
    }
  } catch (error) {
    console.error('Lỗi khi lấy kỳ thực tập hiện tại:', error)
  }
})

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.requirements = ''
  formData.benefits = ''
  formData.availableSlots = 1
  formData.workType = ''
  formData.dueDate = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const submitForm = async () => {
  if (!currentPeriodId.value) {
    alert('Không thể xác định kỳ thực tập hiện tại. Vui lòng thử lại sau.')
    return
  }

  isSubmitting.value = true

  try {
    const response = await createPosition(formData)
    if (response && response.status === 201) {
      emit('position-added', response.data)
      closeModal()
    }
  } catch (error) {
    console.error('Lỗi khi tạo vị trí mới:', error)
    alert('Có lỗi xảy ra khi tạo vị trí mới. Vui lòng thử lại sau.')
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
