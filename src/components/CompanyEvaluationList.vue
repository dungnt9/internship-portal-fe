<!-- CompanyEvaluationList.vue -->
<template>
  <div class="company-evaluation">
    <!-- Filter controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Kỳ thực tập</label>
            <select v-model="selectedPeriodId" class="form-select" @change="fetchInternships">
              <option value="">Tất cả kỳ thực tập</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Trạng thái đánh giá</label>
            <select
              v-model="selectedEvaluationStatus"
              class="form-select"
              @change="filterInternships"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chưa đánh giá</option>
              <option value="COMPLETED">Đã đánh giá</option>
            </select>
          </div>

          <div class="col-md-4 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="fetchInternships" :disabled="loading">
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
    <div v-else-if="filteredInternships.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-clipboard-check" style="font-size: 3rem"></i>
      <h5 class="mt-3">Không có sinh viên thực tập</h5>
      <p class="text-muted">Không tìm thấy sinh viên thực tập nào trong kỳ đã chọn</p>
    </div>

    <!-- Internships table -->
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
                <th>Đánh giá</th>
                <th>Điểm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="internship in filteredInternships" :key="internship.progressId">
                <td>{{ internship.studentCode }}</td>
                <td>{{ internship.studentName }}</td>
                <td>{{ internship.positionTitle }}</td>
                <td>{{ formatDateRange(internship.startDate, internship.endDate) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(internship.status)">
                    {{ getStatusText(internship.status) }}
                  </span>
                </td>
                <td>
                  <span :class="getEvaluationStatusBadgeClass(internship.evaluationStatus)">
                    {{ getEvaluationStatusText(internship.evaluationStatus) }}
                  </span>
                </td>
                <td>
                  <span v-if="internship.score" class="fw-bold text-primary">
                    {{ internship.score }}/10
                  </span>
                  <span v-else class="text-muted">--</span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openEvaluationModal(internship)"
                      :disabled="internship.status !== 'IN_PROGRESS'"
                      :title="
                        internship.status !== 'IN_PROGRESS'
                          ? 'Chỉ có thể đánh giá sinh viên đang thực tập'
                          : 'Đánh giá sinh viên'
                      "
                    >
                      <i class="bi bi-star"></i>
                    </button>
                    <button
                      v-if="internship.evaluationStatus === 'COMPLETED'"
                      class="btn btn-sm btn-outline-info"
                      @click="viewEvaluationDetail(internship)"
                      title="Xem chi tiết đánh giá"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Statistics Card -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Tổng sinh viên</h6>
                <h4 class="mb-0">{{ statistics.total }}</h4>
              </div>
              <div class="align-self-center">
                <i class="bi bi-people" style="font-size: 2rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Đã đánh giá</h6>
                <h4 class="mb-0">{{ statistics.evaluated }}</h4>
              </div>
              <div class="align-self-center">
                <i class="bi bi-check-circle" style="font-size: 2rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Chưa đánh giá</h6>
                <h4 class="mb-0">{{ statistics.pending }}</h4>
              </div>
              <div class="align-self-center">
                <i class="bi bi-clock" style="font-size: 2rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Điểm TB</h6>
                <h4 class="mb-0">{{ statistics.averageScore }}</h4>
              </div>
              <div class="align-self-center">
                <i class="bi bi-graph-up" style="font-size: 2rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evaluation Modal -->
    <Teleport to="body">
      <div
        v-if="showEvaluationModal && selectedInternship"
        class="modal-backdrop"
        @click.self="showEvaluationModal = false"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Đánh giá sinh viên - {{ selectedInternship?.studentName }}
              </h5>
              <button type="button" class="btn-close" @click="showEvaluationModal = false"></button>
            </div>
            <div class="modal-body">
              <EvaluationForm
                :progress-id="selectedInternship?.progressId"
                :student-name="selectedInternship?.studentName"
                @evaluation-saved="onEvaluationSaved"
                @close="showEvaluationModal = false"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Evaluation Detail Modal -->
    <Teleport to="body">
      <div
        v-if="showDetailModal && evaluationDetail"
        class="modal-backdrop"
        @click.self="showDetailModal = false"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết đánh giá - {{ selectedInternship?.studentName }}</h5>
              <button type="button" class="btn-close" @click="showDetailModal = false"></button>
            </div>
            <div class="modal-body">
              <EvaluationDetail
                :evaluation-detail="evaluationDetail"
                @close="showDetailModal = false"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { getAllPeriods } from '@/services/companyApplicationService.js'
import { getCompanyInternships, getEvaluationDetail } from '@/services/evaluationService.js'
import EvaluationForm from '@/components/EvaluationForm.vue'
import EvaluationDetail from '@/components/EvaluationDetail.vue'

const internships = ref([])
const periods = ref([])
const loading = ref(false)
const selectedInternship = ref(null)
const showEvaluationModal = ref(false)
const showDetailModal = ref(false)
const evaluationDetail = ref(null)
const selectedPeriodId = ref('')
const selectedEvaluationStatus = ref('')

// Computed filtered internships
const filteredInternships = computed(() => {
  let filtered = internships.value

  if (selectedEvaluationStatus.value) {
    filtered = filtered.filter(
      (internship) => internship.evaluationStatus === selectedEvaluationStatus.value,
    )
  }

  return filtered
})

// Computed statistics
const statistics = computed(() => {
  const total = filteredInternships.value.length
  const evaluated = filteredInternships.value.filter(
    (i) => i.evaluationStatus === 'COMPLETED',
  ).length
  const pending = total - evaluated

  const scores = filteredInternships.value.filter((i) => i.score).map((i) => parseFloat(i.score))

  const averageScore =
    scores.length > 0
      ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
      : '--'

  return {
    total,
    evaluated,
    pending,
    averageScore,
  }
})

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

// Get badge class for evaluation status
const getEvaluationStatusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'badge bg-success'
    case 'PENDING':
      return 'badge bg-warning'
    default:
      return 'badge bg-secondary'
  }
}

// Get readable evaluation status text
const getEvaluationStatusText = (status) => {
  const statusMap = {
    COMPLETED: 'Đã đánh giá',
    PENDING: 'Chưa đánh giá',
  }
  return statusMap[status] || status
}

// Open evaluation modal
const openEvaluationModal = (internship) => {
  selectedInternship.value = internship
  showEvaluationModal.value = true
}

// View evaluation detail
const viewEvaluationDetail = async (internship) => {
  try {
    selectedInternship.value = internship
    const response = await getEvaluationDetail(internship.progressId)
    if (response && response.data) {
      evaluationDetail.value = response.data
      showDetailModal.value = true
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đánh giá:', error)
    toast.error('Không thể tải chi tiết đánh giá. Vui lòng thử lại.')
  }
}

// Handle evaluation saved
const onEvaluationSaved = () => {
  showEvaluationModal.value = false
  fetchInternships() // Refresh the list
  toast.success('Đánh giá đã được lưu thành công!')
}

// Filter internships (for status filter)
const filterInternships = () => {
  // The filtering is handled by computed property filteredInternships
}

// Fetch internships
const fetchInternships = async () => {
  loading.value = true
  try {
    const response = await getCompanyInternships(selectedPeriodId.value)
    if (response && response.data) {
      internships.value = response.data
    } else {
      internships.value = []
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thực tập:', error)
    toast.error('Không thể tải danh sách thực tập. Vui lòng thử lại sau.')
    internships.value = []
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
  await fetchInternships()
})
</script>

<style scoped>
.company-evaluation {
  max-width: 100%;
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
  color: white;
}

.btn-outline-info {
  color: #0dcaf0;
  border-color: #0dcaf0;
}

.btn-outline-info:hover {
  background-color: #0dcaf0;
  border-color: #0dcaf0;
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
  max-width: 900px;
  width: 100%;
  margin: 1.75rem auto;
  max-height: 90vh;
  overflow-y: auto;
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

.btn-group .btn {
  margin-right: 0;
}

.card.bg-primary,
.card.bg-success,
.card.bg-warning,
.card.bg-info {
  border: none;
}

.card.bg-warning .card-title,
.card.bg-warning h4 {
  color: #000 !important;
}
</style>
