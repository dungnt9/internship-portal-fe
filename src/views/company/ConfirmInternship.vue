<!-- ConfirmInternship.vue - Dành cho giáo viên xác nhận thực tập -->
<template>
  <div class="confirm-internship container py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-1">Xác nhận thực tập sinh viên</h2>
        <p class="text-muted">Quản lý và xác nhận tiến trình thực tập của sinh viên</p>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-5">
            <label class="form-label">Kỳ thực tập</label>
            <select v-model="selectedPeriodId" class="form-select" @change="fetchTeacherProgress">
              <option value="">Tất cả kỳ thực tập</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
          </div>

          <div class="col-md-5">
            <label class="form-label">Trạng thái</label>
            <select v-model="selectedStatus" class="form-select" @change="fetchTeacherProgress">
              <option value="">Tất cả trạng thái</option>
              <option value="IN_PROGRESS">Đang thực tập</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="fetchTeacherProgress" :disabled="loading">
              <i class="bi bi-funnel-fill me-1"></i>Lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải dữ liệu...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="progressList.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-clipboard" style="font-size: 3rem"></i>
      <h5 class="mt-3">Không có sinh viên thực tập</h5>
      <p class="text-muted">Không tìm thấy sinh viên thực tập nào phù hợp với bộ lọc đã chọn</p>
    </div>

    <!-- Progress table -->
    <div v-else class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Mã sinh viên</th>
                <th>Tên sinh viên</th>
                <th>Vị trí thực tập</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Điểm CPA</th>
                <th>Xác nhận</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in progressList" :key="item.progress.id">
                <td>{{ item.student.studentCode }}</td>
                <td>{{ item.student.name }}</td>
                <td>{{ item.progress.positionTitle }}</td>
                <td>{{ formatDateRange(item.progress.startDate, item.progress.endDate) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(item.progress.status)">
                    {{ getStatusText(item.progress.status) }}
                  </span>
                </td>
                <td>{{ item.student.cpa }}</td>
                <td>
                  <span
                    :class="
                      item.progress.teacherConfirmed ? 'badge bg-success' : 'badge bg-warning'
                    "
                  >
                    {{ item.progress.teacherConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận' }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="showProgressDetails(item.progress.id)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      v-if="!item.progress.teacherConfirmed"
                      class="btn btn-sm btn-success"
                      @click="confirmInternship(item.progress.id)"
                      title="Xác nhận"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button
                      v-else
                      class="btn btn-sm btn-outline-danger"
                      @click="unconfirmInternship(item.progress.id)"
                      title="Hủy xác nhận"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Details Modal -->
    <Teleport to="body">
      <div
        v-if="showDetailsModal && selectedStudent"
        class="modal-backdrop"
        @click.self="showDetailsModal = false"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Chi tiết thực tập - {{ selectedStudent?.student?.name || 'Sinh viên' }}
              </h5>
              <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
            </div>
            <div v-if="loadingDetails" class="modal-body text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p class="mt-3">Đang tải thông tin chi tiết...</p>
            </div>
            <div v-else class="modal-body">
              <div class="row g-4">
                <!-- Thông tin sinh viên -->
                <div class="col-md-6">
                  <div class="card h-100">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">Thông tin sinh viên</h6>
                    </div>
                    <div class="card-body">
                      <div class="mb-2">
                        <strong>Mã sinh viên:</strong> {{ selectedStudent?.student?.studentCode }}
                      </div>
                      <div class="mb-2">
                        <strong>Họ tên:</strong> {{ selectedStudent?.student?.name }}
                      </div>
                      <div class="mb-2">
                        <strong>Email:</strong> {{ selectedStudent?.student?.email }}
                      </div>
                      <div class="mb-2">
                        <strong>Số điện thoại:</strong> {{ selectedStudent?.student?.phone }}
                      </div>
                      <div class="mb-2">
                        <strong>Lớp:</strong> {{ selectedStudent?.student?.className }}
                      </div>
                      <div class="mb-2">
                        <strong>Ngành học:</strong> {{ selectedStudent?.student?.major }}
                      </div>
                      <div class="mb-2">
                        <strong>Giới tính:</strong> {{ selectedStudent?.student?.gender }}
                      </div>
                      <div class="mb-2">
                        <strong>Ngày sinh:</strong>
                        {{ formatDate(selectedStudent?.student?.birthday) }}
                      </div>
                      <div class="mb-2">
                        <strong>CPA:</strong> {{ selectedStudent?.student?.cpa }}
                      </div>
                      <div class="mb-2">
                        <strong>Trình độ tiếng Anh:</strong>
                        {{ selectedStudent?.student?.englishLevel }}
                      </div>
                      <div class="mb-2">
                        <strong>Kỹ năng:</strong> {{ selectedStudent?.student?.skills }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Thông tin thực tập và công ty -->
                <div class="col-md-6">
                  <div class="card h-100">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">Thông tin thực tập</h6>
                    </div>
                    <div class="card-body">
                      <div class="mb-2">
                        <strong>Kỳ thực tập:</strong> {{ selectedStudent?.progress?.periodId }}
                      </div>
                      <div class="mb-2">
                        <strong>Vị trí thực tập:</strong>
                        {{ selectedStudent?.progress?.positionTitle }}
                      </div>
                      <div class="mb-2">
                        <strong>Trạng thái:</strong>
                        <span :class="getStatusBadgeClass(selectedStudent?.progress?.status)">
                          {{ getStatusText(selectedStudent?.progress?.status) }}
                        </span>
                      </div>
                      <div class="mb-2">
                        <strong>Công ty:</strong>
                        {{ selectedStudent?.company?.name || 'Thực tập ngoài' }}
                      </div>
                      <div class="mb-2">
                        <strong>Địa chỉ công ty:</strong>
                        {{ selectedStudent?.company?.address || 'N/A' }}
                      </div>
                      <div class="mb-2">
                        <strong>Website:</strong>
                        <a
                          v-if="selectedStudent?.company?.website"
                          :href="selectedStudent?.company?.website"
                          target="_blank"
                        >
                          {{ selectedStudent?.company?.website }}
                        </a>
                        <span v-else>N/A</span>
                      </div>
                      <div class="mb-2">
                        <strong>Loại hình kinh doanh:</strong>
                        {{ selectedStudent?.company?.businessType || 'N/A' }}
                      </div>
                      <div class="mb-2">
                        <strong>Người hướng dẫn:</strong>
                        {{ selectedStudent?.progress?.supervisorName || 'Chưa có' }}
                      </div>
                      <div class="mb-2">
                        <strong>Chức vụ người hướng dẫn:</strong>
                        {{ selectedStudent?.progress?.supervisorPosition || 'N/A' }}
                      </div>
                      <div class="mb-2">
                        <strong>Email người hướng dẫn:</strong>
                        {{ selectedStudent?.progress?.supervisorEmail || 'N/A' }}
                      </div>
                      <div class="mb-2">
                        <strong>SĐT người hướng dẫn:</strong>
                        {{ selectedStudent?.progress?.supervisorPhone || 'N/A' }}
                      </div>
                      <div class="mb-2">
                        <strong>Thời gian bắt đầu:</strong>
                        {{ formatDate(selectedStudent?.progress?.startDate) }}
                      </div>
                      <div class="mb-2">
                        <strong>Thời gian kết thúc:</strong>
                        {{ formatDate(selectedStudent?.progress?.endDate) }}
                      </div>
                      <div class="mb-2">
                        <strong>Xác nhận của giáo viên:</strong>
                        <span
                          :class="
                            selectedStudent?.progress?.teacherConfirmed
                              ? 'badge bg-success'
                              : 'badge bg-warning'
                          "
                        >
                          {{
                            selectedStudent?.progress?.teacherConfirmed
                              ? 'Đã xác nhận'
                              : 'Chưa xác nhận'
                          }}
                        </span>
                      </div>
                      <div v-if="selectedStudent?.progress?.teacherConfirmedAt" class="mb-2">
                        <strong>Ngày xác nhận:</strong>
                        {{ formatDateTime(selectedStudent?.progress?.teacherConfirmedAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                v-if="!selectedStudent?.progress?.teacherConfirmed"
                class="btn btn-success me-auto"
                @click="confirmInternship(selectedStudent?.progress?.id)"
              >
                <i class="bi bi-check-circle me-1"></i>Xác nhận thực tập
              </button>
              <button
                v-else
                class="btn btn-outline-danger me-auto"
                @click="unconfirmInternship(selectedStudent?.progress?.id)"
              >
                <i class="bi bi-x-circle me-1"></i>Hủy xác nhận
              </button>
              <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ confirmModalTitle }}</h5>
              <button type="button" class="btn-close" @click="closeConfirmModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ confirmModalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeConfirmModal">
                Hủy
              </button>
              <button
                type="button"
                :class="confirming ? 'btn btn-success' : 'btn btn-danger'"
                @click="processConfirmation"
              >
                {{ confirming ? 'Xác nhận' : 'Hủy xác nhận' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import {
  getTeacherProgress,
  getProgressDetail,
  confirmProgress,
  getAllPeriods,
} from '@/services/teacherService.js'

const progressList = ref([])
const periods = ref([])
const loading = ref(false)
const loadingDetails = ref(false)
const selectedStudent = ref(null)
const showDetailsModal = ref(false)
const selectedPeriodId = ref('')
const selectedStatus = ref('')

// Confirm modal
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmingProgressId = ref(null)
const confirming = ref(true)

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Format date time function
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
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
  if (!startDate || !endDate) return 'N/A'
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

// Get badge class for status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'badge bg-primary'
    case 'COMPLETED':
      return 'badge bg-success'
    case 'CANCELLED':
      return 'badge bg-danger'
    default:
      return 'badge bg-secondary'
  }
}

// Get readable status text
const getStatusText = (status) => {
  const statusMap = {
    IN_PROGRESS: 'Đang thực tập',
    COMPLETED: 'Đã hoàn thành',
    CANCELLED: 'Đã hủy',
  }
  return statusMap[status] || status
}

// Show student details with API call to get full details
const showProgressDetails = async (progressId) => {
  loadingDetails.value = true
  showDetailsModal.value = true

  try {
    const response = await getProgressDetail(progressId)
    if (response && response.data) {
      selectedStudent.value = response.data
    } else {
      toast.error('Không thể tải thông tin chi tiết')
      showDetailsModal.value = false
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thực tập:', error)
    toast.error('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.')
    showDetailsModal.value = false
  } finally {
    loadingDetails.value = false
  }
}

// Close confirm modal
const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmingProgressId.value = null
}

// Show confirm modal
const showConfirmInternshipModal = (progressId) => {
  confirmingProgressId.value = progressId
  confirming.value = true
  confirmModalTitle.value = 'Xác nhận thực tập'
  confirmModalMessage.value = 'Bạn có chắc muốn xác nhận thực tập cho sinh viên này?'
  showConfirmModal.value = true
}

// Show unconfirm modal
const showUnconfirmInternshipModal = (progressId) => {
  confirmingProgressId.value = progressId
  confirming.value = false
  confirmModalTitle.value = 'Hủy xác nhận thực tập'
  confirmModalMessage.value = 'Bạn có chắc muốn hủy xác nhận thực tập của sinh viên này?'
  showConfirmModal.value = true
}

// Process confirmation
const processConfirmation = async () => {
  if (!confirmingProgressId.value) return

  try {
    loading.value = true
    await confirmProgress(confirmingProgressId.value, confirming.value)

    // Update the UI after confirmation
    const progressIndex = progressList.value.findIndex(
      (p) => p.progress.id === confirmingProgressId.value,
    )

    if (progressIndex !== -1) {
      progressList.value[progressIndex].progress.teacherConfirmed = confirming.value
      progressList.value[progressIndex].progress.teacherConfirmedAt = confirming.value
        ? new Date().toISOString()
        : null
    }

    // If we're viewing details of this progress, update that too
    if (selectedStudent.value?.progress?.id === confirmingProgressId.value) {
      selectedStudent.value.progress.teacherConfirmed = confirming.value
      selectedStudent.value.progress.teacherConfirmedAt = confirming.value
        ? new Date().toISOString()
        : null
    }

    toast.success(
      confirming.value ? 'Xác nhận thực tập thành công' : 'Hủy xác nhận thực tập thành công',
    )
  } catch (error) {
    console.error('Lỗi khi xác nhận thực tập:', error)
    toast.error(
      confirming.value
        ? 'Không thể xác nhận thực tập. Vui lòng thử lại sau.'
        : 'Không thể hủy xác nhận thực tập. Vui lòng thử lại sau.',
    )
  } finally {
    loading.value = false
    closeConfirmModal()
  }
}

// Confirm internship
const confirmInternship = (progressId) => {
  showConfirmInternshipModal(progressId)
}

// Unconfirm internship
const unconfirmInternship = (progressId) => {
  showUnconfirmInternshipModal(progressId)
}

// Fetch teacher's assigned internship progress
const fetchTeacherProgress = async () => {
  loading.value = true
  try {
    const response = await getTeacherProgress(selectedPeriodId.value, selectedStatus.value)
    if (response && response.data) {
      progressList.value = response.data
    } else {
      progressList.value = []
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu quá trình thực tập:', error)
    toast.error('Không thể tải dữ liệu quá trình thực tập. Vui lòng thử lại sau.')
    progressList.value = []
  } finally {
    loading.value = false
  }
}

// Fetch periods for filter
const fetchPeriods = async () => {
  try {
    const response = await getAllPeriods()
    if (response && response.data) {
      periods.value = response.data
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kỳ thực tập:', error)
    toast.error('Không thể tải danh sách kỳ thực tập')
  }
}

// Fetch data on component mount
onMounted(async () => {
  await fetchPeriods()
  await fetchTeacherProgress()
})
</script>

<style scoped>
.confirm-internship {
  max-width: 1200px;
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  overflow: hidden;
}

.btn-primary {
  background-color: #c02135;
  border-color: #c02135;
}

.btn-primary:hover {
  background-color: #a61b2d;
  border-color: #a61b2d;
}

.btn-outline-primary {
  color: #c02135;
  border-color: #c02135;
}

.btn-outline-primary:hover {
  background-color: #c02135;
  border-color: #c02135;
}

.form-control:focus,
.form-select:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
}

/* Modal styling */
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
  max-width: 800px;
  width: 100%;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 0.5rem;
  pointer-events: auto;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.5rem - 1px);
  border-top-right-radius: calc(0.5rem - 1px);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.5rem - 1px);
  border-bottom-left-radius: calc(0.5rem - 1px);
}

.btn-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.25em;
  color: #000;
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
  border: 0;
  border-radius: 0.375rem;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 0.75;
}
</style>
