<template>
  <div class="progress-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải thông tin thực tập...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <!-- No progress found state -->
    <div v-else-if="!progressData" class="no-data-container">
      <i class="bi bi-folder2-open display-1 text-muted"></i>
      <h4 class="mt-3">Không tìm thấy thông tin thực tập</h4>
      <p class="text-muted">
        Bạn chưa được đăng ký thực tập cho kỳ hiện tại hoặc thông tin chưa sẵn sàng.
      </p>
    </div>

    <!-- Progress data display -->
    <div v-else class="progress-data">
      <div class="card mb-4">
        <div
          class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">Thông tin thực tập</h5>
          <span
            :class="{
              'badge rounded-pill': true,
              'bg-warning': progressData.progress.status === 'IN_PROGRESS',
              'bg-success': progressData.progress.status === 'COMPLETED',
              'bg-danger': progressData.progress.status === 'CANCELLED',
            }"
          >
            {{ getStatusText(progressData.progress.status) }}
          </span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6 class="mb-3">Thông tin chung</h6>
              <p>
                <strong>Kỳ thực tập:</strong>
                {{ progressData.progress.periodId }}
              </p>
              <p>
                <strong>Bắt đầu:</strong>
                {{ formatDate(progressData.progress.startDate) }}
              </p>
              <p>
                <strong>Kết thúc:</strong>
                {{ formatDate(progressData.progress.endDate) }}
              </p>
              <p>
                <strong>Loại thực tập:</strong>
                {{
                  progressData.progress.isExternal
                    ? 'Thực tập ngoài trường'
                    : 'Thực tập theo chương trình'
                }}
              </p>
              <p>
                <strong>Xác nhận của giảng viên:</strong>
                <span
                  :class="{
                    badge: true,
                    'bg-success': progressData.progress.teacherConfirmed,
                    'bg-warning': !progressData.progress.teacherConfirmed,
                  }"
                >
                  {{ progressData.progress.teacherConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận' }}
                </span>
              </p>
            </div>
            <div class="col-md-6">
              <h6 class="mb-3">Thông tin doanh nghiệp</h6>
              <p v-if="progressData.progress.isExternal">
                <strong>Công ty:</strong>
                {{ progressData.progress.companyName || 'Chưa cập nhật' }}
              </p>
              <p v-else-if="progressData.company">
                <strong>Công ty:</strong>
                {{ progressData.company.name }}
              </p>

              <p v-if="progressData.progress.isExternal">
                <strong>Vị trí:</strong>
                {{ progressData.progress.positionTitle || 'Chưa cập nhật' }}
              </p>
              <p v-else-if="progressData.position">
                <strong>Vị trí:</strong>
                {{ progressData.position.title }}
              </p>
            </div>
          </div>

          <hr />

          <!-- Supervisor Information Section -->
          <h6 class="mb-3">Thông tin người hướng dẫn</h6>
          <div class="row mb-4">
            <div class="col-md-6">
              <p>
                <strong>Họ tên:</strong>
                {{ progressData.progress.supervisorName || 'Chưa cập nhật' }}
              </p>
              <p>
                <strong>Chức vụ:</strong>
                {{ progressData.progress.supervisorPosition || 'Chưa cập nhật' }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Email:</strong>
                {{ progressData.progress.supervisorEmail || 'Chưa cập nhật' }}
              </p>
              <p>
                <strong>Số điện thoại:</strong>
                {{ progressData.progress.supervisorPhone || 'Chưa cập nhật' }}
              </p>
            </div>
          </div>

          <!-- Update Form -->
          <div class="update-form">
            <div class="d-grid mb-3">
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="showUpdateForm = !showUpdateForm"
              >
                <i class="bi" :class="showUpdateForm ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                {{ showUpdateForm ? 'Ẩn form cập nhật' : 'Cập nhật thông tin' }}
              </button>
            </div>

            <div v-if="showUpdateForm" class="card border-primary mb-3">
              <div class="card-header bg-primary bg-opacity-10">
                <h6 class="mb-0">Cập nhật thông tin thực tập</h6>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitUpdate">
                  <!-- External Internship Fields -->
                  <div v-if="progressData.progress.isExternal" class="row mb-3">
                    <div class="col-md-6">
                      <label for="companyName" class="form-label"
                        >Tên công ty <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        id="companyName"
                        v-model="updateForm.companyName"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="positionTitle" class="form-label"
                        >Vị trí thực tập <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        id="positionTitle"
                        v-model="updateForm.positionTitle"
                        class="form-control"
                        required
                      />
                    </div>
                  </div>

                  <!-- Supervisor Information Fields -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="supervisorName" class="form-label"
                        >Họ tên người hướng dẫn <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        id="supervisorName"
                        v-model="updateForm.supervisorName"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="supervisorPosition" class="form-label"
                        >Chức vụ <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        id="supervisorPosition"
                        v-model="updateForm.supervisorPosition"
                        class="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="supervisorEmail" class="form-label"
                        >Email người hướng dẫn <span class="text-danger">*</span></label
                      >
                      <input
                        type="email"
                        id="supervisorEmail"
                        v-model="updateForm.supervisorEmail"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="supervisorPhone" class="form-label"
                        >Số điện thoại <span class="text-danger">*</span></label
                      >
                      <input
                        type="tel"
                        id="supervisorPhone"
                        v-model="updateForm.supervisorPhone"
                        class="form-control"
                        required
                        pattern="[0-9]{10,11}"
                        title="Số điện thoại phải gồm 10-11 chữ số"
                      />
                      <small class="form-text text-muted"
                        >Số điện thoại phải gồm 10-11 chữ số</small
                      >
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                      Hủy
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="updating">
                      <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                      Cập nhật thông tin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { updateProgress } from '@/services/studentProgressService'

// Props and emits
const props = defineProps({
  progressData: Object,
  loading: Boolean,
  error: String,
})

const emit = defineEmits(['refresh'])

// Component state
const showUpdateForm = ref(false)
const updating = ref(false)
const updateForm = ref({
  supervisorName: '',
  supervisorPosition: '',
  supervisorEmail: '',
  supervisorPhone: '',
  companyName: '',
  positionTitle: '',
})

// Watch for prop changes to update the form
watch(
  () => props.progressData,
  (newVal) => {
    if (newVal) {
      // Populate form with current data
      updateForm.value = {
        supervisorName: newVal.progress.supervisorName || '',
        supervisorPosition: newVal.progress.supervisorPosition || '',
        supervisorEmail: newVal.progress.supervisorEmail || '',
        supervisorPhone: newVal.progress.supervisorPhone || '',
        companyName: newVal.progress.companyName || '',
        positionTitle: newVal.progress.positionTitle || '',
      }
    }
  },
  { immediate: true, deep: true },
)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Chưa xác định'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Get readable status text
const getStatusText = (status) => {
  const statusMap = {
    IN_PROGRESS: 'Đang thực tập',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  }
  return statusMap[status] || status
}

// Reset form to initial values from props
const resetForm = () => {
  if (props.progressData) {
    updateForm.value = {
      supervisorName: props.progressData.progress.supervisorName || '',
      supervisorPosition: props.progressData.progress.supervisorPosition || '',
      supervisorEmail: props.progressData.progress.supervisorEmail || '',
      supervisorPhone: props.progressData.progress.supervisorPhone || '',
      companyName: props.progressData.progress.companyName || '',
      positionTitle: props.progressData.progress.positionTitle || '',
    }
  }
  showUpdateForm.value = false
}

// Submit form data
const submitUpdate = async () => {
  if (updating.value) return

  updating.value = true
  try {
    // Prepare data based on internship type
    const data = {
      supervisorName: updateForm.value.supervisorName,
      supervisorPosition: updateForm.value.supervisorPosition,
      supervisorEmail: updateForm.value.supervisorEmail,
      supervisorPhone: updateForm.value.supervisorPhone,
    }

    // Add company and position for external internships
    if (props.progressData?.progress.isExternal) {
      data.companyName = updateForm.value.companyName
      data.positionTitle = updateForm.value.positionTitle
    }

    // Send update request
    await updateProgress(data)

    // Show success message
    toast.success('Cập nhật thông tin thực tập thành công')

    // Hide form and refresh data
    showUpdateForm.value = false
    emit('refresh')
  } catch (err) {
    // Show error message
    let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin'
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    }
    toast.error(errorMessage)
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
.progress-detail-container {
  width: 100%;
}

.loading-container,
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.btn-primary,
.bg-primary {
  background-color: #c02135 !important;
  border-color: #c02135 !important;
}

.btn-outline-primary {
  color: #c02135 !important;
  border-color: #c02135 !important;
}

.btn-outline-primary:hover {
  background-color: #c02135 !important;
  color: white !important;
}

.border-primary {
  border-color: #c02135 !important;
}

.text-primary {
  color: #c02135 !important;
}

.form-control:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
}
</style>
