<template>
  <div class="evaluation-detail">
    <!-- Overall Information -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h6 class="mb-0"><i class="bi bi-star-fill me-2"></i>Thông tin đánh giá tổng quan</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label fw-bold">Điểm tổng kết:</label>
              <div class="d-flex align-items-center">
                <span class="badge bg-primary fs-5 me-2">{{
                  evaluationDetail.score || 'Chưa có'
                }}</span>
                <span v-if="evaluationDetail.score" class="text-muted">/10</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Ngày đánh giá:</label>
              <p class="mb-0">
                {{
                  evaluationDetail.evaluationDate
                    ? formatDateTime(evaluationDetail.evaluationDate)
                    : 'Chưa đánh giá'
                }}
              </p>
            </div>
          </div>

          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label fw-bold">Trạng thái:</label>
              <p class="mb-0">
                <span v-if="evaluationDetail.evaluationDate" class="badge bg-success">
                  <i class="bi bi-check-circle me-1"></i>Đã hoàn thành
                </span>
                <span v-else class="badge bg-warning">
                  <i class="bi bi-clock me-1"></i>Chưa hoàn thành
                </span>
              </p>
            </div>
          </div>
        </div>

        <div v-if="evaluationDetail.comments" class="mt-3">
          <label class="form-label fw-bold">Nhận xét chung:</label>
          <div class="border rounded p-3 bg-light">
            <p class="mb-0" style="white-space: pre-wrap">{{ evaluationDetail.comments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Criteria Details -->
    <div class="card">
      <div class="card-header bg-info text-white">
        <h6 class="mb-0"><i class="bi bi-list-check me-2"></i>Đánh giá chi tiết theo tiêu chí</h6>
      </div>
      <div class="card-body p-0">
        <div v-if="evaluationDetail.criteriaDetails && evaluationDetail.criteriaDetails.length > 0">
          <div
            v-for="(criteria, index) in evaluationDetail.criteriaDetails"
            :key="criteria.criteriaId"
            class="border-bottom"
            :class="{ 'border-bottom-0': index === evaluationDetail.criteriaDetails.length - 1 }"
          >
            <div class="p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="mb-1 text-primary">{{ criteria.criteriaName }}</h6>
                  <small class="text-muted">{{ criteria.criteriaDescription }}</small>
                </div>
                <span class="badge bg-light text-dark"
                  >{{ index + 1 }}/{{ evaluationDetail.criteriaDetails.length }}</span
                >
              </div>

              <div v-if="criteria.comments" class="mt-3">
                <label class="form-label fw-bold small">Nhận xét:</label>
                <div class="border rounded p-3 bg-light">
                  <p class="mb-0 small" style="white-space: pre-wrap">{{ criteria.comments }}</p>
                </div>
              </div>
              <div v-else class="mt-3">
                <p class="text-muted fst-italic small mb-0">Chưa có nhận xét cho tiêu chí này</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <i class="bi bi-info-circle text-muted" style="font-size: 2rem"></i>
          <p class="text-muted mt-2 mb-0">Chưa có thông tin đánh giá chi tiết</p>
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div class="row mt-4">
      <div class="col-md-6">
        <small class="text-muted">
          <i class="bi bi-calendar-plus me-1"></i>
          Tạo lúc: {{ formatDateTime(evaluationDetail.createdAt) }}
        </small>
      </div>
      <div class="col-md-6 text-end">
        <small class="text-muted">
          <i class="bi bi-calendar-check me-1"></i>
          Cập nhật: {{ formatDateTime(evaluationDetail.updatedAt) }}
        </small>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button type="button" class="btn btn-secondary" @click="$emit('close')">
        <i class="bi bi-x-lg me-1"></i>Đóng
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  evaluationDetail: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

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
</script>

<style scoped>
.evaluation-detail {
  max-width: 100%;
}

.card {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.card-header {
  border-bottom: 1px solid #dee2e6;
}

.bg-primary {
  background-color: #c02135 !important;
}

.text-primary {
  color: #c02135 !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
}

.badge.bg-primary {
  background-color: #c02135 !important;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}

.border-bottom-0 {
  border-bottom: 0 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.fs-5 {
  font-size: 1.25rem !important;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.small {
  font-size: 0.875em;
}

.fst-italic {
  font-style: italic !important;
}
</style>
