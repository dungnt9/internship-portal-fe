<template>
  <div class="card mb-4">
    <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-star-fill me-2"></i>
        Đánh giá từ công ty
      </h5>
      <button class="btn btn-outline-light btn-sm" @click="refreshEvaluation" :disabled="loading">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
    <div class="card-body">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải đánh giá...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </div>

      <!-- Evaluation data -->
      <div v-else-if="evaluationData">
        <!-- Overall evaluation -->
        <div class="row mb-4">
          <div class="col-md-8">
            <h6 class="mb-3">Đánh giá tổng quan</h6>
            <div class="d-flex align-items-center mb-3">
              <span class="me-3"><strong>Điểm số:</strong></span>
              <div class="d-flex align-items-center">
                <span class="h4 mb-0 me-2 text-info">{{ evaluationData.score || 'Chưa có' }}</span>
                <div
                  v-if="evaluationData.score"
                  class="progress"
                  style="width: 150px; height: 20px"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="{ width: (evaluationData.score / 10) * 100 + '%' }"
                  ></div>
                </div>
                <span class="ms-2 text-muted">/10</span>
              </div>
            </div>
            <p>
              <strong>Ngày đánh giá:</strong>
              <span v-if="evaluationData.evaluationDate">
                {{ formatDateTime(evaluationData.evaluationDate) }}
              </span>
              <span v-else class="text-muted fst-italic">Chưa có ngày đánh giá</span>
            </p>
          </div>
          <div class="col-md-4">
            <div class="card bg-light">
              <div class="card-body text-center">
                <div class="display-6 text-info mb-2">
                  <i class="bi" :class="getScoreIcon(evaluationData.score)"></i>
                </div>
                <h6 class="card-title">{{ getScoreText(evaluationData.score) }}</h6>
                <p class="card-text small text-muted">
                  {{ getScoreDescription(evaluationData.score) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- General comments -->
        <div v-if="evaluationData.comments" class="mb-4">
          <h6 class="mb-3">Nhận xét chung</h6>
          <div class="card bg-light">
            <div class="card-body">
              <p class="mb-0">{{ evaluationData.comments }}</p>
            </div>
          </div>
        </div>

        <!-- Detailed evaluation by criteria -->
        <div v-if="evaluationData.details && evaluationData.details.length > 0">
          <h6 class="mb-3">Đánh giá chi tiết theo tiêu chí</h6>
          <div class="row">
            <div
              v-for="(detail, index) in evaluationData.details"
              :key="detail.id"
              class="col-md-6 mb-3"
            >
              <div class="card h-100">
                <div class="card-header bg-info bg-opacity-10">
                  <h6 class="mb-0">
                    <i class="bi bi-check-circle me-2 text-info"></i>
                    {{ detail.criteriaName }}
                  </h6>
                </div>
                <div class="card-body">
                  <p class="text-muted small mb-2">{{ detail.criteriaDescription }}</p>
                  <div v-if="detail.comments" class="mt-3">
                    <strong class="small">Nhận xét:</strong>
                    <p class="mb-0 small">{{ detail.comments }}</p>
                  </div>
                  <div v-else class="text-muted fst-italic small">Chưa có nhận xét chi tiết</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Last updated info -->
        <div class="text-muted small mt-3">
          <i class="bi bi-clock me-1"></i>
          Cập nhật lần cuối: {{ formatDateTime(evaluationData.updatedAt) }}
        </div>
      </div>

      <!-- No evaluation state -->
      <div v-else class="text-center py-4">
        <i class="bi bi-star display-4 text-muted"></i>
        <h6 class="mt-3">Chưa có đánh giá từ công ty</h6>
        <p class="text-muted">Công ty chưa đánh giá quá trình thực tập của bạn.</p>
        <small class="text-muted">
          Đánh giá sẽ được cập nhật sau khi công ty hoàn thành việc đánh giá.
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getMyEvaluation } from '@/services/studentEvaluationService'

// Props
const props = defineProps({
  progressData: Object,
})

// Component state
const loading = ref(false)
const error = ref('')
const evaluationData = ref(null)

// Fetch evaluation data
const fetchEvaluation = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getMyEvaluation()
    if (response && response.data) {
      evaluationData.value = response.data
    } else {
      evaluationData.value = null
    }
  } catch (err) {
    console.error('Lỗi khi lấy đánh giá:', err)

    if (err.response?.status === 404) {
      evaluationData.value = null
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi tải đánh giá. Vui lòng thử lại sau.'
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
      fetchEvaluation()
    }
  },
  { immediate: true },
)

// Refresh evaluation
const refreshEvaluation = () => {
  fetchEvaluation()
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

// Get score icon
const getScoreIcon = (score) => {
  if (!score) return 'bi-question-circle'
  if (score >= 9) return 'bi-emoji-smile-fill'
  if (score >= 7) return 'bi-emoji-neutral-fill'
  if (score >= 5) return 'bi-emoji-frown-fill'
  return 'bi-emoji-angry-fill'
}

// Get score text
const getScoreText = (score) => {
  if (!score) return 'Chưa đánh giá'
  if (score >= 9) return 'Xuất sắc'
  if (score >= 8) return 'Tốt'
  if (score >= 7) return 'Khá'
  if (score >= 5) return 'Trung bình'
  return 'Cần cải thiện'
}

// Get score description
const getScoreDescription = (score) => {
  if (!score) return 'Chưa có điểm đánh giá'
  if (score >= 9) return 'Thể hiện rất xuất sắc'
  if (score >= 8) return 'Thể hiện tốt'
  if (score >= 7) return 'Thể hiện khá tốt'
  if (score >= 5) return 'Thể hiện ở mức trung bình'
  return 'Cần nỗ lực cải thiện'
}
</script>

<style scoped>
.btn-info,
.bg-info {
  background-color: #0dcaf0 !important;
  border-color: #0dcaf0 !important;
}

.btn-outline-info {
  color: #0dcaf0 !important;
  border-color: #0dcaf0 !important;
}

.btn-outline-info:hover {
  background-color: #0dcaf0 !important;
  color: white !important;
}

.text-info {
  color: #0dcaf0 !important;
}

.progress-bar {
  transition: width 0.3s ease;
}
</style>
