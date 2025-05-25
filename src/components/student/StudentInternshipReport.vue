<template>
  <div class="card mb-4">
    <div
      class="card-header bg-success text-white d-flex justify-content-between align-items-center"
    >
      <h5 class="mb-0">
        <i class="bi bi-file-earmark-text me-2"></i>
        Báo cáo thực tập
      </h5>
      <div class="d-flex align-items-center gap-2">
        <!-- Submission status badge -->
        <span v-if="reportData && reportData.submissionDate" :class="getSubmissionBadgeClass()">
          <i class="bi bi-check-circle-fill me-1"></i>
          {{ getSubmissionStatusText() }}
        </span>
        <button class="btn btn-outline-light btn-sm" @click="refreshReport" :disabled="loading">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
    <div class="card-body">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải báo cáo...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </div>

      <!-- Report data -->
      <div v-else-if="reportData">
        <!-- Submission lock notice -->
        <div v-if="!reportData.isEditable" class="alert alert-info border-info">
          <div class="d-flex align-items-start">
            <i class="bi bi-lock-fill text-info me-2 mt-1"></i>
            <div>
              <h6 class="alert-heading mb-2">Báo cáo đã được nộp</h6>
              <p class="mb-2">
                Báo cáo thực tập của bạn đã được nộp vào ngày
                <strong>{{ formatDateTime(reportData.submissionDate) }}</strong>
                và không thể chỉnh sửa.
              </p>
              <p class="mb-0 small">
                <i class="bi bi-info-circle me-1"></i>
                Nếu cần thay đổi nội dung báo cáo, vui lòng liên hệ với giảng viên hướng dẫn để được
                hỗ trợ.
              </p>
            </div>
          </div>
        </div>

        <!-- Current report info -->
        <div class="row mb-4">
          <div class="col-md-8">
            <h6 class="mb-3">Thông tin báo cáo hiện tại</h6>
            <p>
              <strong>Tiêu đề:</strong>
              <span v-if="reportData.title && reportData.title.trim()">
                {{ reportData.title }}
              </span>
              <span v-else class="text-muted fst-italic">Chưa có tiêu đề</span>
            </p>
            <p>
              <strong>Nội dung:</strong>
              <span v-if="reportData.content && reportData.content.trim()">
                <span class="badge bg-success"
                  >Đã có nội dung ({{ getContentLength() }} ký tự)</span
                >
              </span>
              <span v-else class="text-muted fst-italic">Chưa có nội dung</span>
            </p>
            <p>
              <strong>File đính kèm:</strong>
              <span v-if="reportData.filePath">
                <i class="bi bi-file-earmark-pdf text-danger me-1"></i>
                <a
                  :href="getFileUrl(reportData.filePath)"
                  target="_blank"
                  class="text-decoration-none"
                >
                  Xem file báo cáo
                </a>
              </span>
              <span v-else class="text-muted fst-italic">Chưa có file</span>
            </p>
          </div>
          <div class="col-md-4">
            <h6 class="mb-3">Trạng thái nộp</h6>
            <p>
              <strong>Ngày nộp:</strong>
              <span v-if="reportData.submissionDate">
                {{ formatDateTime(reportData.submissionDate) }}
                <span class="badge bg-success ms-2">
                  <i class="bi bi-check-circle-fill me-1"></i>
                  Đã nộp
                </span>
              </span>
              <span v-else>
                <span class="badge bg-warning">
                  <i class="bi bi-clock me-1"></i>
                  Chưa nộp
                </span>
              </span>
            </p>
            <p>
              <strong>Trạng thái:</strong>
              <span v-if="reportData.isEditable" class="badge bg-primary">
                <i class="bi bi-pencil me-1"></i>
                Có thể chỉnh sửa
              </span>
              <span v-else class="badge bg-secondary">
                <i class="bi bi-lock me-1"></i>
                Đã khóa
              </span>
            </p>
            <p>
              <strong>Cập nhật lần cuối:</strong>
              {{ formatDateTime(reportData.updatedAt) }}
            </p>
          </div>
        </div>

        <hr />

        <!-- Update form toggle - Only show if editable -->
        <div v-if="reportData.isEditable" class="d-grid mb-3">
          <button
            class="btn btn-outline-success"
            type="button"
            @click="showUpdateForm = !showUpdateForm"
          >
            <i class="bi" :class="showUpdateForm ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            {{ showUpdateForm ? 'Ẩn form cập nhật' : 'Cập nhật báo cáo' }}
          </button>
        </div>

        <!-- Update form - Only show if editable -->
        <div v-if="showUpdateForm && reportData.isEditable" class="card border-success">
          <div class="card-header bg-success bg-opacity-10">
            <h6 class="mb-0">Cập nhật báo cáo thực tập</h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitUpdate">
              <div class="mb-3">
                <label for="reportTitle" class="form-label">
                  Tiêu đề báo cáo <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="reportTitle"
                  v-model="updateForm.title"
                  class="form-control"
                  placeholder="Nhập tiêu đề báo cáo thực tập"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="reportContent" class="form-label">
                  Nội dung báo cáo <span class="text-danger">*</span>
                </label>
                <textarea
                  id="reportContent"
                  v-model="updateForm.content"
                  class="form-control"
                  rows="8"
                  placeholder="Nhập nội dung báo cáo thực tập..."
                  required
                ></textarea>
                <small class="form-text text-muted">
                  Mô tả chi tiết về quá trình thực tập, công việc đã làm, kiến thức học được... ({{
                    updateForm.content?.length || 0
                  }}
                  ký tự)
                </small>
              </div>

              <div class="mb-3">
                <label for="reportFile" class="form-label">File báo cáo (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  id="reportFile"
                  ref="fileInput"
                  @change="handleFileChange"
                  class="form-control"
                  accept=".pdf,.doc,.docx"
                />
                <small class="form-text text-muted">
                  Tùy chọn: Đính kèm file báo cáo chi tiết (tối đa 10MB)
                </small>
              </div>

              <!-- Warning about submission -->
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Lưu ý:</strong> Sau khi nộp báo cáo (có đầy đủ tiêu đề và nội dung), bạn sẽ
                không thể chỉnh sửa nữa. Hãy kiểm tra kỹ trước khi gửi.
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                  Hủy
                </button>
                <button type="submit" class="btn btn-success" :disabled="updating">
                  <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-send me-1"></i>
                  {{ updating ? 'Đang cập nhật...' : 'Cập nhật báo cáo' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Read-only view for submitted reports -->
        <div v-if="!reportData.isEditable && reportData.content" class="mt-4">
          <h6 class="mb-3">Nội dung báo cáo đã nộp</h6>
          <div class="card bg-light">
            <div class="card-body">
              <pre class="mb-0" style="white-space: pre-wrap; font-family: inherit">{{
                reportData.content
              }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- No data state -->
      <div v-else class="text-center py-4">
        <i class="bi bi-file-earmark-x display-4 text-muted"></i>
        <h6 class="mt-3">Chưa có báo cáo thực tập</h6>
        <p class="text-muted">Báo cáo thực tập chưa được tạo cho kỳ thực tập hiện tại.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { getMyReport, updateMyReport } from '@/services/studentEvaluationService'

// Props
const props = defineProps({
  progressData: Object,
})

// Component state
const loading = ref(false)
const error = ref('')
const reportData = ref(null)
const showUpdateForm = ref(false)
const updating = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const updateForm = ref({
  title: '',
  content: '',
})

// Fetch report data
const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getMyReport()
    if (response && response.data) {
      reportData.value = response.data
      // Populate form with current data
      updateForm.value = {
        title: response.data.title || '',
        content: response.data.content || '',
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy báo cáo:', err)

    if (err.response?.status === 404) {
      error.value = 'Chưa có báo cáo thực tập cho kỳ hiện tại.'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi tải báo cáo. Vui lòng thử lại sau.'
    }
  } finally {
    loading.value = false
  }
}

// Watch for progress data changes
watch(
  () => props.progressData,
  (newVal) => {
    if (newVal) {
      fetchReport()
    }
  },
  { immediate: true },
)

// Refresh report
const refreshReport = () => {
  fetchReport()
}

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File quá lớn. Vui lòng chọn file dưới 10MB.')
      event.target.value = ''
      selectedFile.value = null
      return
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, DOC hoặc DOCX.')
      event.target.value = ''
      selectedFile.value = null
      return
    }

    selectedFile.value = file
  } else {
    selectedFile.value = null
  }
}

// Submit update
const submitUpdate = async () => {
  if (updating.value) return

  // Check if report is still editable
  if (!reportData.value?.isEditable) {
    toast.error('Báo cáo đã được nộp và không thể chỉnh sửa.')
    return
  }

  // Validate at least one field is filled
  if (!updateForm.value.title.trim() && !updateForm.value.content.trim() && !selectedFile.value) {
    toast.error('Vui lòng điền ít nhất một trường hoặc chọn file để cập nhật.')
    return
  }

  // Show confirmation for submission
  const willBeSubmitted = updateForm.value.title.trim() && updateForm.value.content.trim()
  if (willBeSubmitted) {
    const confirmed = confirm(
      'Bạn đang nộp báo cáo với đầy đủ tiêu đề và nội dung. ' +
        'Sau khi nộp, báo cáo sẽ không thể chỉnh sửa nữa. ' +
        'Bạn có chắc chắn muốn tiếp tục?',
    )
    if (!confirmed) {
      return
    }
  }

  updating.value = true
  try {
    const data = {}

    if (updateForm.value.title.trim()) {
      data.title = updateForm.value.title.trim()
    }

    if (updateForm.value.content.trim()) {
      data.content = updateForm.value.content.trim()
    }

    await updateMyReport(data, selectedFile.value)

    if (willBeSubmitted) {
      toast.success('Nộp báo cáo thành công! Báo cáo đã được khóa và không thể chỉnh sửa.')
    } else {
      toast.success('Cập nhật báo cáo thành công!')
    }

    showUpdateForm.value = false
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    // Refresh report data
    await fetchReport()
  } catch (err) {
    let errorMessage = 'Có lỗi xảy ra khi cập nhật báo cáo'

    if (err.response?.status === 409) {
      // Handle conflict (already submitted)
      errorMessage = err.response.data.message || 'Báo cáo đã được nộp và không thể chỉnh sửa.'
      // Refresh data to get latest state
      await fetchReport()
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    }

    toast.error(errorMessage)
  } finally {
    updating.value = false
  }
}

// Reset form
const resetForm = () => {
  if (reportData.value) {
    updateForm.value = {
      title: reportData.value.title || '',
      content: reportData.value.content || '',
    }
  }
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  showUpdateForm.value = false
}

// Format date time
const formatDateTime = (dateString) => {
  if (!dateString) return 'Chưa xác định'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Get file URL
const getFileUrl = (filePath) => {
  return `${import.meta.env.VITE_API_BASE_URL}/files/${filePath}`
}

// Get content length
const getContentLength = () => {
  return reportData.value?.content?.length || 0
}

// Get submission badge class
const getSubmissionBadgeClass = () => {
  if (!reportData.value?.submissionDate) return 'badge bg-warning'
  return reportData.value.isEditable ? 'badge bg-warning' : 'badge bg-success'
}

// Get submission status text
const getSubmissionStatusText = () => {
  if (!reportData.value?.submissionDate) return 'Chưa nộp'
  return reportData.value.isEditable ? 'Bản nháp' : 'Đã nộp'
}
</script>

<style scoped>
.btn-success,
.bg-success {
  background-color: #198754 !important;
  border-color: #198754 !important;
}

.btn-outline-success {
  color: #198754 !important;
  border-color: #198754 !important;
}

.btn-outline-success:hover {
  background-color: #198754 !important;
  color: white !important;
}

.border-success {
  border-color: #198754 !important;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

pre {
  font-size: 0.95rem;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

.alert-warning {
  border-left: 4px solid #ffc107;
}

.alert-info {
  border-left: 4px solid #0dcaf0;
}
</style>
