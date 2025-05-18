<!-- views/InternshipProgress.vue -->
<template>
  <div class="internship-progress container py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-1">Quá trình thực tập của sinh viên</h2>
        <p class="text-muted">Thông tin tiến độ thực tập của sinh viên tại công ty</p>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-10">
            <label class="form-label">Kỳ thực tập</label>
            <select
              v-model="selectedPeriodId"
              class="form-select"
              @change="fetchInternshipProgress"
            >
              <option value="">Tất cả kỳ thực tập</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
          </div>

          <div class="col-md-2 d-flex align-items-end">
            <button
              class="btn btn-primary w-100"
              @click="fetchInternshipProgress"
              :disabled="loading"
            >
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
      <p class="text-muted">Không tìm thấy sinh viên thực tập nào phù hợp với kỳ đã chọn</p>
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
                <th>GV hướng dẫn</th>
                <th>Điểm CPA</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="progress in progressList" :key="progress.id">
                <td>{{ progress.studentCode }}</td>
                <td>{{ progress.studentName }}</td>
                <td>{{ progress.positionTitle }}</td>
                <td>{{ formatDateRange(progress.startDate, progress.endDate) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(progress.status)">
                    {{ getStatusText(progress.status) }}
                  </span>
                </td>
                <td>{{ progress.teacherName || 'Chưa phân công' }}</td>
                <td>{{ progress.cpa }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="showDetails(progress)">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Details Modal using Teleport -->
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
                Thông tin sinh viên thực tập - {{ selectedStudent.studentName }}
              </h5>
              <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Thông tin sinh viên</h6>
                  <div class="mb-2">
                    <strong>Mã sinh viên:</strong> {{ selectedStudent.studentCode }}
                  </div>
                  <div class="mb-2">
                    <strong>Tên sinh viên:</strong> {{ selectedStudent.studentName }}
                  </div>
                  <div class="mb-2"><strong>Email:</strong> {{ selectedStudent.email }}</div>
                  <div class="mb-2">
                    <strong>Số điện thoại:</strong> {{ selectedStudent.phone }}
                  </div>
                  <div class="mb-2"><strong>Lớp:</strong> {{ selectedStudent.className }}</div>
                  <div class="mb-2"><strong>Chuyên ngành:</strong> {{ selectedStudent.major }}</div>
                  <div class="mb-2"><strong>Giới tính:</strong> {{ selectedStudent.gender }}</div>
                  <div class="mb-2">
                    <strong>Ngày sinh:</strong> {{ formatDate(selectedStudent.birthday) }}
                  </div>
                  <div class="mb-2"><strong>CPA:</strong> {{ selectedStudent.cpa }}</div>
                  <div class="mb-2">
                    <strong>Trình độ tiếng Anh:</strong> {{ selectedStudent.englishLevel }}
                  </div>
                  <div class="mb-2"><strong>Kỹ năng:</strong> {{ selectedStudent.skills }}</div>
                </div>
                <div class="col-md-6">
                  <h6>Thông tin thực tập</h6>
                  <div class="mb-2">
                    <strong>Vị trí thực tập:</strong> {{ selectedStudent.positionTitle }}
                  </div>
                  <div class="mb-2">
                    <strong>Trạng thái:</strong>
                    <span :class="getStatusBadgeClass(selectedStudent.status)">
                      {{ getStatusText(selectedStudent.status) }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <strong>Thời gian bắt đầu:</strong> {{ formatDate(selectedStudent.startDate) }}
                  </div>
                  <div class="mb-2">
                    <strong>Thời gian kết thúc:</strong> {{ formatDate(selectedStudent.endDate) }}
                  </div>
                  <div class="mb-2">
                    <strong>Kỳ thực tập:</strong> {{ selectedStudent.periodId }}
                  </div>
                  <div class="mb-2">
                    <strong>Người hướng dẫn:</strong>
                    {{ selectedStudent.supervisorName || 'Chưa phân công' }}
                  </div>
                  <div class="mb-2">
                    <strong>Chức vụ người hướng dẫn:</strong>
                    {{ selectedStudent.supervisorPosition || 'N/A' }}
                  </div>
                  <div class="mb-2">
                    <strong>Email người hướng dẫn:</strong>
                    {{ selectedStudent.supervisorEmail || 'N/A' }}
                  </div>
                  <div class="mb-2">
                    <strong>SĐT người hướng dẫn:</strong>
                    {{ selectedStudent.supervisorPhone || 'N/A' }}
                  </div>
                  <div class="mb-2">
                    <strong>Xác nhận GV:</strong>
                    <span
                      :class="
                        selectedStudent.teacherConfirmed ? 'badge bg-success' : 'badge bg-warning'
                      "
                    >
                      {{ selectedStudent.teacherConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">
                Đóng
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
import { getAllPeriods } from '@/services/companyApplicationService'
import { getCompanyProgress } from '@/services/registerService.js'

const progressList = ref([])
const periods = ref([])
const loading = ref(false)
const selectedStudent = ref(null)
const showDetailsModal = ref(false)
const selectedPeriodId = ref('')

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

// Show student details
const showDetails = (student) => {
  selectedStudent.value = student
  showDetailsModal.value = true
}

// Fetch internship progress
const fetchInternshipProgress = async () => {
  loading.value = true
  try {
    const response = await getCompanyProgress(selectedPeriodId.value)
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
onMounted(() => {
  fetchPeriods()
  fetchInternshipProgress()
})
</script>

<style scoped>
.internship-progress {
  max-width: 1200px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  color: white;
}

.text-primary {
  color: #c02135 !important;
}

.bg-primary {
  background-color: #c02135 !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
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
  max-width: 800px;
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
