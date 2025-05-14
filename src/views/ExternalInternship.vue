<template>
  <div class="container mt-4">
    <!-- Tiêu đề và mô tả -->
    <div class="mb-4">
      <h2 class="text-center">Đăng ký thực tập ngoài trường</h2>
      <p class="text-center text-muted">
        Dành cho sinh viên thực tập tại công ty tự liên hệ ngoài danh sách của trường
      </p>
    </div>

    <!-- Hiển thị thông báo lỗi -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Phần tạo đơn đăng ký mới -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Tạo đơn đăng ký mới</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="periodSelect" class="form-label"
              >Kỳ thực tập <span class="text-danger">*</span></label
            >
            <select
              id="periodSelect"
              v-model="formData.periodId"
              class="form-select"
              :disabled="loading"
              required
            >
              <option value="" disabled selected>-- Chọn kỳ thực tập --</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
            <small class="form-text text-muted">Chọn kỳ thực tập bạn muốn đăng ký</small>
          </div>

          <div class="mb-3">
            <label for="confirmationFile" class="form-label">
              Tệp xác nhận/CV <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              id="confirmationFile"
              ref="fileInput"
              class="form-control"
              @change="handleFileChange"
              :disabled="loading"
              required
            />
            <small class="form-text text-muted">
              Tải lên giấy xác nhận từ công ty hoặc CV (định dạng PDF, DOC, DOCX)
            </small>
          </div>

          <div v-if="selectedFile" class="mb-3">
            <div class="d-flex align-items-center">
              <i class="bi bi-file-earmark-text me-2"></i>
              <span>{{ selectedFile.name }}</span>
              <button
                type="button"
                class="btn btn-sm text-danger ms-2"
                @click="removeSelectedFile"
                :disabled="loading"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>

          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary" :disabled="loading || !formIsValid">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Gửi đơn đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Danh sách đơn đăng ký -->
    <div class="card">
      <div
        class="card-header bg-secondary text-white d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Danh sách đơn đăng ký của bạn</h5>
        <button
          class="btn btn-sm btn-light"
          @click="fetchExternalInternships"
          :disabled="loadingList"
        >
          <i class="bi bi-arrow-clockwise me-1"></i>
          <span v-if="!loadingList">Làm mới</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
      <div class="card-body">
        <div v-if="loadingList" class="text-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải danh sách đơn đăng ký...</p>
        </div>

        <div v-else-if="applications.length === 0" class="text-center py-4">
          <i class="bi bi-folder text-muted" style="font-size: 3rem"></i>
          <p class="mt-3">Bạn chưa có đơn đăng ký thực tập ngoài trường nào</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Kỳ thực tập</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Tệp đính kèm</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(app, index) in applications" :key="app.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ app.periodId }}</td>
                <td>{{ formatDate(app.createdAt) }}</td>
                <td>
                  <span
                    :class="{
                      'badge rounded-pill': true,
                      'bg-warning': app.status === 'PENDING',
                      'bg-success': app.status === 'APPROVED',
                      'bg-danger': app.status === 'REJECTED',
                      'bg-secondary': app.status === 'CANCELLED',
                    }"
                  >
                    {{ getStatusText(app.status) }}
                  </span>
                </td>
                <td>
                  <a
                    href="#"
                    class="btn btn-sm btn-outline-primary"
                    @click.prevent="downloadFile(app)"
                  >
                    <i class="bi bi-download me-1"></i>Tải xuống
                  </a>
                </td>
                <td>
                  <button
                    v-if="app.status === 'PENDING'"
                    class="btn btn-sm btn-outline-danger"
                    @click="showCancelConfirmation(app)"
                    :disabled="cancellingId === app.id"
                  >
                    <span
                      v-if="cancellingId === app.id"
                      class="spinner-border spinner-border-sm me-1"
                    ></span>
                    <i v-else class="bi bi-x-circle me-1"></i>
                    Hủy đơn
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận hủy đơn sử dụng component Teleport -->
    <ConfirmCancel
      :show="showCancelModal"
      title="Xác nhận hủy đơn"
      message="Bạn có chắc chắn muốn hủy đơn đăng ký thực tập ngoài trường này không?"
      warning="Bạn không thể hoàn tác hành động này sau khi đã xác nhận."
      confirm-text="Xác nhận hủy"
      cancel-text="Đóng"
      :loading="cancelling"
      @confirm="cancelApplication"
      @close="showCancelModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import {
  getCurrentPeriod,
  getExternalInternships,
  createExternalInternship,
  cancelExternalInternship,
} from '@/services/registerService'
import ConfirmCancel from '@/components/registration/ConfirmCancel.vue'

// State variables
const error = ref('')
const loading = ref(false)
const loadingList = ref(false)
const periods = ref([])
const applications = ref([])
const selectedFile = ref(null)
const selectedApplication = ref(null)
const cancelling = ref(false)
const cancellingId = ref(null)
const showCancelModal = ref(false)

// Form data
const formData = ref({
  periodId: '',
})

// Computed property to check if form is valid
const formIsValid = computed(() => {
  return formData.value.periodId && selectedFile.value
})

// Fetch data when component mounts
onMounted(async () => {
  try {
    await Promise.all([fetchCurrentPeriod(), fetchExternalInternships()])
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
  }
})

// Fetch current period information
const fetchCurrentPeriod = async () => {
  try {
    const response = await getCurrentPeriod()
    if (response && response.data) {
      // Assume the response includes an active period
      periods.value = [response.data]

      // Set the current period as default
      formData.value.periodId = response.data.id
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin kỳ thực tập:', err)
    toast.error('Không thể tải thông tin kỳ thực tập hiện tại')
    throw err
  }
}

// Fetch external internship applications
const fetchExternalInternships = async () => {
  loadingList.value = true
  try {
    // Gọi API lấy danh sách đơn đăng ký
    const response = await getExternalInternships()
    if (response && response.data) {
      applications.value = response.data
    }
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn đăng ký:', err)
    toast.error('Không thể tải danh sách đơn đăng ký thực tập ngoài trường')
    throw err
  } finally {
    loadingList.value = false
  }
}

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Kiểm tra định dạng file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file định dạng PDF, DOC hoặc DOCX')
      event.target.value = '' // Reset input file
      selectedFile.value = null
      return
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      event.target.value = '' // Reset input file
      selectedFile.value = null
      return
    }

    selectedFile.value = file
  }
}

// Remove selected file
const removeSelectedFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('confirmationFile')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (loading.value) return
  if (!formIsValid.value) {
    toast.error('Vui lòng điền đầy đủ thông tin và tải lên file xác nhận')
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Tạo form data để gửi file
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('periodId', formData.value.periodId)
    formDataToSubmit.append('confirmationFile', selectedFile.value)

    // Gửi request tạo đơn đăng ký
    const response = await createExternalInternship(formDataToSubmit)

    if (response && response.data) {
      toast.success('Đăng ký thực tập ngoài trường thành công')

      // Reset form
      formData.value.periodId = ''
      selectedFile.value = null
      const fileInput = document.getElementById('confirmationFile')
      if (fileInput) {
        fileInput.value = ''
      }

      // Refresh list
      await fetchExternalInternships()
    }
  } catch (err) {
    console.error('Lỗi khi tạo đơn đăng ký:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.'
    }
    toast.error('Đăng ký thực tập không thành công')
  } finally {
    loading.value = false
  }
}

// Show cancel confirmation modal
const showCancelConfirmation = (application) => {
  selectedApplication.value = application
  showCancelModal.value = true
}

// Cancel application
const cancelApplication = async () => {
  if (!selectedApplication.value || cancelling.value) return

  cancelling.value = true
  cancellingId.value = selectedApplication.value.id

  try {
    const response = await cancelExternalInternship(selectedApplication.value.id)

    if (response && response.data) {
      toast.success('Hủy đơn đăng ký thực tập ngoài trường thành công')

      // Đóng modal
      showCancelModal.value = false

      // Cập nhật trạng thái trong danh sách
      const index = applications.value.findIndex((app) => app.id === selectedApplication.value.id)
      if (index !== -1) {
        applications.value[index].status = 'CANCELLED'
      }
    }
  } catch (err) {
    console.error('Lỗi khi hủy đơn đăng ký:', err)
    let errorMessage = 'Có lỗi xảy ra khi hủy đơn đăng ký'

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message
    }

    toast.error(errorMessage)
  } finally {
    cancelling.value = false
    cancellingId.value = null
  }
}

// Format date to display
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format date range
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  const start = new Date(startDate)
  const end = new Date(endDate)

  const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return `${new Intl.DateTimeFormat('vi-VN', formatOptions).format(start)} - ${new Intl.DateTimeFormat('vi-VN', formatOptions).format(end)}`
}

// Get readable status text
const getStatusText = (status) => {
  const statusMap = {
    PENDING: 'Đang chờ xét duyệt',
    APPROVED: 'Đã được chấp thuận',
    REJECTED: 'Đã bị từ chối',
    CANCELLED: 'Đã hủy',
  }
  return statusMap[status] || status
}

// Download file (placeholder - would need backend support)
const downloadFile = (application) => {
  if (!application.confirmationFilePath) {
    toast.error('Không tìm thấy đường dẫn tải tệp')
    return
  }

  // Thực hiện tải xuống file
  // Trong thực tế, cần API endpoint để tải file từ server
  toast.info('Tính năng tải xuống file đang được phát triển')

  // Mẫu code tải file (cần backend endpoint hỗ trợ)
  /*
  try {
    window.open(`${import.meta.env.VITE_API_URL}/registration/download${application.confirmationFilePath}`, '_blank')
  } catch (err) {
    console.error('Lỗi khi tải file:', err)
    toast.error('Không thể tải file. Vui lòng thử lại sau.')
  }
  */
}
</script>

<style scoped>
.container {
  max-width: 900px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-radius: 8px 8px 0 0;
}

.btn-primary {
  background-color: #c02135;
  border-color: #c02135;
}

.btn-primary:hover {
  background-color: #a61b2d;
  border-color: #a61b2d;
}

.bg-primary {
  background-color: #c02135 !important;
}

.text-primary {
  color: #c02135 !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
}
</style>
