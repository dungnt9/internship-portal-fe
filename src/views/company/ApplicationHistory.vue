<!-- views/ApplicationHistory.vue -->
<template>
  <div class="application-history container py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-1">Lịch sử đơn đăng ký thực tập</h2>
        <p class="text-muted">Danh sách đơn đăng ký thực tập đã được xử lý</p>
      </div>
      <div class="col-auto">
        <router-link :to="{ name: 'duyet-thuc-tap' }" class="btn btn-outline-primary">
          <i class="bi bi-list-check me-2"></i>Đơn đăng ký chờ duyệt
        </router-link>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-5">
            <label class="form-label">Kỳ thực tập</label>
            <select v-model="filters.periodId" class="form-select" @change="applyFilters">
              <option value="">Tất cả kỳ thực tập</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
          </div>

          <div class="col-md-5">
            <label class="form-label">Trạng thái</label>
            <select v-model="filters.status" class="form-select" @change="applyFilters">
              <option value="">Tất cả trạng thái</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="applyFilters" :disabled="loading">
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
    <div v-else-if="applications.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-clipboard" style="font-size: 3rem"></i>
      <h5 class="mt-3">Không có đơn đăng ký nào</h5>
      <p class="text-muted">Không tìm thấy đơn đăng ký nào phù hợp với bộ lọc đã chọn</p>
    </div>

    <!-- Applications table -->
    <div v-else class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Mã sinh viên</th>
                <th>Tên sinh viên</th>
                <th>Vị trí thực tập</th>
                <th>Nguyện vọng</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applications" :key="app.applicationDetailId">
                <td>{{ app.studentCode }}</td>
                <td>{{ app.name }}</td>
                <td>{{ app.positionTitle }}</td>
                <td>
                  <span :class="getPreferenceBadgeClass(app.preferenceOrder)">
                    Nguyện vọng {{ app.preferenceOrder }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(app.status)">
                    {{ getStatusText(app.status) }}
                  </span>
                </td>
                <td>{{ formatDate(app.appliedAt) }}</td>
                <td class="text-truncate" style="max-width: 200px">{{ app.note || 'Không có' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="showDetails(app)">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Application Details Modal using Teleport -->
    <Teleport to="body">
      <div
        v-if="showDetailsModal && selectedApplication"
        class="modal-backdrop"
        @click.self="showDetailsModal = false"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết đơn đăng ký - {{ selectedApplication.name }}</h5>
              <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Thông tin sinh viên</h6>
                  <div class="mb-2">
                    <strong>Mã sinh viên:</strong> {{ selectedApplication.studentCode }}
                  </div>
                  <div class="mb-2">
                    <strong>Tên sinh viên:</strong> {{ selectedApplication.name }}
                  </div>
                  <div class="mb-2"><strong>Email:</strong> {{ selectedApplication.email }}</div>
                  <div class="mb-2">
                    <strong>Số điện thoại:</strong> {{ selectedApplication.phone }}
                  </div>
                  <div class="mb-2"><strong>Lớp:</strong> {{ selectedApplication.className }}</div>
                  <div class="mb-2">
                    <strong>Chuyên ngành:</strong> {{ selectedApplication.major }}
                  </div>
                  <div class="mb-2"><strong>CPA:</strong> {{ selectedApplication.cpa }}</div>
                  <div class="mb-2">
                    <strong>Trình độ tiếng Anh:</strong> {{ selectedApplication.englishLevel }}
                  </div>
                  <div class="mb-2"><strong>Kỹ năng:</strong> {{ selectedApplication.skills }}</div>
                </div>
                <div class="col-md-6">
                  <h6>Thông tin đăng ký</h6>
                  <div class="mb-2">
                    <strong>Vị trí đăng ký:</strong> {{ selectedApplication.positionTitle }}
                  </div>
                  <div class="mb-2">
                    <strong>Nguyện vọng:</strong>
                    <span :class="getPreferenceBadgeClass(selectedApplication.preferenceOrder)">
                      Nguyện vọng {{ selectedApplication.preferenceOrder }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <strong>Trạng thái:</strong>
                    <span :class="getStatusBadgeClass(selectedApplication.status)">
                      {{ getStatusText(selectedApplication.status) }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <strong>Ngày đăng ký:</strong> {{ formatDate(selectedApplication.appliedAt) }}
                  </div>
                  <div class="mb-4">
                    <strong>Ghi chú:</strong> {{ selectedApplication.note || 'Không có' }}
                  </div>

                  <div class="mb-2">
                    <a
                      :href="getCvViewUrl(selectedApplication.cvFilePath)"
                      target="_blank"
                      class="btn btn-outline-primary btn-sm"
                      :class="{ disabled: !selectedApplication.cvFilePath }"
                    >
                      <i class="bi bi-file-earmark-text me-1"></i>Xem CV
                    </a>
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
import { getApplicationsHistory, getAllPeriods } from '@/services/companyApplicationService.js'
import { viewFile } from '@/services/fileService'

const applications = ref([])
const periods = ref([])
const loading = ref(false)
const selectedApplication = ref(null)
const showDetailsModal = ref(false)
const filters = ref({
  periodId: '',
  status: '',
})

const getCvViewUrl = (cvFilePath) => {
  if (!cvFilePath) return '#'
  return viewFile(cvFilePath)
}

// Format date function
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

// Get badge class for preference order
const getPreferenceBadgeClass = (preferenceOrder) => {
  switch (preferenceOrder) {
    case 1:
      return 'badge bg-primary'
    case 2:
      return 'badge bg-info'
    case 3:
      return 'badge bg-secondary'
    default:
      return 'badge bg-secondary'
  }
}

// Get badge class for application status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'badge bg-success'
    case 'REJECTED':
      return 'badge bg-danger'
    case 'CANCELLED':
      return 'badge bg-secondary'
    case 'PENDING':
      return 'badge bg-warning'
    default:
      return 'badge bg-secondary'
  }
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

// Show application details
const showDetails = (application) => {
  selectedApplication.value = application
  showDetailsModal.value = true
}

// Fetch applications history
const fetchApplicationsHistory = async () => {
  loading.value = true
  try {
    const response = await getApplicationsHistory(filters.value.periodId, filters.value.status)
    if (response && response.data) {
      applications.value = response.data
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đơn đăng ký:', error)
    toast.error('Không thể tải lịch sử đơn đăng ký. Vui lòng thử lại sau.')
    applications.value = []
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

// Apply filters
const applyFilters = () => {
  fetchApplicationsHistory()
}

// Fetch data on component mount
onMounted(() => {
  fetchPeriods()
  fetchApplicationsHistory()
})
</script>

<style scoped>
.application-history {
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
