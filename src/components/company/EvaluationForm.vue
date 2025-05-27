<template>
  <div class="evaluation-form">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải dữ liệu đánh giá...</p>
    </div>

    <!-- Form content -->
    <div v-else>
      <form @submit.prevent="submitEvaluation">
        <!-- Overall Score and Comments -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label fw-bold"
              >Điểm tổng kết <span class="text-danger">*</span></label
            >
            <div class="input-group">
              <input
                v-model.number="evaluation.score"
                type="number"
                class="form-control"
                min="0"
                max="10"
                step="0.1"
                required
                :class="{ 'is-invalid': errors.score }"
              />
              <span class="input-group-text">/10</span>
            </div>
            <div v-if="errors.score" class="invalid-feedback">{{ errors.score }}</div>
            <div class="form-text">Điểm từ 0 đến 10, có thể có 1 chữ số thập phân</div>
          </div>
        </div>

        <!-- Overall Comments -->
        <div class="mb-4">
          <label class="form-label fw-bold">Nhận xét chung</label>
          <textarea
            v-model="evaluation.comments"
            class="form-control"
            rows="4"
            placeholder="Nhận xét tổng quan về quá trình thực tập của sinh viên..."
            :class="{ 'is-invalid': errors.comments }"
          ></textarea>
          <div v-if="errors.comments" class="invalid-feedback">{{ errors.comments }}</div>
        </div>

        <!-- Criteria Details -->
        <div class="mb-4">
          <h6 class="fw-bold mb-3">Đánh giá chi tiết theo tiêu chí</h6>

          <div
            v-for="criteria in evaluation.criteriaDetails"
            :key="criteria.criteriaId"
            class="card mb-3"
          >
            <div class="card-header bg-light">
              <h6 class="mb-1">{{ criteria.criteriaName }}</h6>
              <small class="text-muted">{{ criteria.criteriaDescription }}</small>
            </div>
            <div class="card-body">
              <textarea
                v-model="criteria.comments"
                class="form-control"
                rows="3"
                :placeholder="`Nhận xét về ${criteria.criteriaName.toLowerCase()}...`"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Hủy</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            {{ submitting ? 'Đang lưu...' : 'Lưu đánh giá' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { toast } from 'vue3-toastify'
import { getEvaluationDetail, updateEvaluation } from '@/services/evaluationService.js'

const props = defineProps({
  progressId: {
    type: Number,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['evaluation-saved', 'close'])

const loading = ref(false)
const submitting = ref(false)
const errors = reactive({})

const evaluation = reactive({
  score: null,
  comments: '',
  criteriaDetails: [],
})

// Fetch evaluation detail
const fetchEvaluationDetail = async () => {
  loading.value = true
  try {
    const response = await getEvaluationDetail(props.progressId)
    if (response && response.data) {
      const data = response.data
      evaluation.score = data.score
      evaluation.comments = data.comments || ''
      evaluation.criteriaDetails = data.criteriaDetails.map((criteria) => ({
        criteriaId: criteria.criteriaId,
        criteriaName: criteria.criteriaName,
        criteriaDescription: criteria.criteriaDescription,
        comments: criteria.comments || '',
      }))
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đánh giá:', error)
    toast.error('Không thể tải dữ liệu đánh giá. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

// Validate form
const validateForm = () => {
  errors.score = ''
  errors.comments = ''

  let isValid = true

  // Validate score
  if (!evaluation.score || evaluation.score < 0 || evaluation.score > 10) {
    errors.score = 'Điểm phải từ 0 đến 10'
    isValid = false
  }

  return isValid
}

// Submit evaluation
const submitEvaluation = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    const updateData = {
      score: evaluation.score,
      comments: evaluation.comments,
      criteriaDetails: evaluation.criteriaDetails.map((criteria) => ({
        criteriaId: criteria.criteriaId,
        comments: criteria.comments,
      })),
    }

    await updateEvaluation(props.progressId, updateData)
    emit('evaluation-saved')
  } catch (error) {
    console.error('Lỗi khi lưu đánh giá:', error)

    // Handle specific error messages
    if (error.response?.status === 400) {
      toast.error('Dữ liệu đánh giá không hợp lệ. Vui lòng kiểm tra lại.')
    } else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền đánh giá sinh viên này.')
    } else {
      toast.error('Không thể lưu đánh giá. Vui lòng thử lại sau.')
    }
  } finally {
    submitting.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchEvaluationDetail()
})
</script>

<style scoped>
.evaluation-form {
  max-width: 100%;
}

.card {
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.card-header {
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
}

.form-control:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
}

.btn-primary {
  background-color: #c02135;
  border-color: #c02135;
}

.btn-primary:hover:not(:disabled) {
  background-color: #a61b2d;
  border-color: #a61b2d;
}

.btn-primary:disabled {
  background-color: #c02135;
  border-color: #c02135;
  opacity: 0.65;
}

.text-primary {
  color: #c02135 !important;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.input-group-text {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #6c757d;
}
</style>
