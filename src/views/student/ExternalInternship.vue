<!-- Cập nhật <template> -->
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
              <option
                v-for="period in periods"
                :key="period.id"
                :value="period.id"
                :disabled="isPeriodRegistered(period.id)"
              >
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
                <span v-if="isPeriodRegistered(period.id)"> - Đã đăng ký</span>
              </option>
            </select>
            <small class="form-text text-muted">Chọn kỳ thực tập bạn muốn đăng ký</small>
            <div v-if="isPeriodRegistered(formData.periodId)" class="text-danger mt-1">
              Bạn đã đăng ký kỳ thực tập này rồi
            </div>
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
              :disabled="loading || isPeriodRegistered(formData.periodId)"
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
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !formIsValid || isPeriodRegistered(formData.periodId)"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Gửi đơn đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Phần còn lại không thay đổi -->
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Cập nhật <script setup> -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import {
  getUpcomingPeriod,
  getExternalInternships,
  createExternalInternship,
} from '@/services/registerService.js'

// State variables
const error = ref('')
const loading = ref(false)
const loadingList = ref(false)
const periods = ref([])
const applications = ref([])
const selectedFile = ref(null)
const selectedApplication = ref(null)

// Form data
const formData = ref({
  periodId: '',
})

// Computed property to check if form is valid
const formIsValid = computed(() => {
  return (
    formData.value.periodId && selectedFile.value && !isPeriodRegistered(formData.value.periodId)
  )
})

// Kiểm tra xem kỳ thực tập đã được đăng ký chưa
const isPeriodRegistered = (periodId) => {
  if (!periodId) return false

  // Kiểm tra trong các đơn đăng ký đã có
  return applications.value.some(
    (app) => app.periodId === periodId && (app.status === 'PENDING' || app.status === 'APPROVED'),
  )
}

// Fetch data when component mounts
onMounted(async () => {
  try {
    // Lấy danh sách đơn đăng ký trước để kiểm tra các kỳ đã đăng ký
    await fetchExternalInternships()
    await fetchCurrentPeriod()
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
  }
})

// Fetch current period information
const fetchCurrentPeriod = async () => {
  try {
    const response = await getUpcomingPeriod()
    if (response && response.data) {
      // Assume the response includes an active period
      periods.value = [response.data]

      // Set the current period as default only if chưa đăng ký
      if (!isPeriodRegistered(response.data.id)) {
        formData.value.periodId = response.data.id
      } else {
        formData.value.periodId = ''
      }
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

  // Kiểm tra lại xem kỳ này đã đăng ký chưa
  if (isPeriodRegistered(formData.value.periodId)) {
    toast.error('Bạn đã đăng ký kỳ thực tập này rồi')
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
/* Giữ nguyên phần CSS */
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
