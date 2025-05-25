<template>
  <div class="container my-4">
    <div class="mb-4">
      <h2 class="text-center">Thông tin thực tập của tôi</h2>
      <p class="text-center text-muted">Xem và cập nhật thông tin về quá trình thực tập của bạn</p>
    </div>

    <!-- Alert messages -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
      <button type="button" class="btn-close float-end" @click="error = ''"></button>
    </div>

    <!-- Refresh Button -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-primary" @click="fetchProgressData" :disabled="loading">
        <i class="bi bi-arrow-clockwise me-1"></i>
        <span v-if="!loading">Làm mới</span>
        <span v-else class="spinner-border spinner-border-sm"></span>
      </button>
    </div>

    <!-- Progress Detail Component -->
    <StudentProgressDetail
      :progressData="progressData"
      :loading="loading"
      :error="error"
      @refresh="fetchProgressData"
    />

    <!-- Report and Evaluation Section - Only show if progress data exists -->
    <div v-if="progressData && !loading">
      <!-- Internship Report Component -->
      <StudentInternshipReport :progressData="progressData" />

      <!-- Company Evaluation Component -->
      <StudentCompanyEvaluation :progressData="progressData" />
    </div>

    <!-- Information Box -->
    <div class="card bg-light mt-4">
      <div class="card-body">
        <h5 class="card-title">
          <i class="bi bi-info-circle me-2"></i>
          Lưu ý quan trọng
        </h5>
        <p class="card-text">
          Thông tin về người hướng dẫn thực tập cần được cập nhật chính xác để giảng viên quản lý có
          thể liên hệ khi cần thiết. Vui lòng đảm bảo điền đầy đủ và chính xác các thông tin bắt
          buộc.
        </p>
        <p class="card-text">
          Báo cáo thực tập và đánh giá từ công ty là những tài liệu quan trọng trong quá trình đánh
          giá kết quả thực tập của bạn. Hãy hoàn thành báo cáo một cách chi tiết và cẩn thận.
        </p>
        <p class="card-text">
          Nếu bạn gặp vấn đề trong quá trình thực tập hoặc có thắc mắc, vui lòng liên hệ với giảng
          viên hướng dẫn để được hỗ trợ.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import StudentProgressDetail from '@/components/student/StudentProgressDetail.vue'
import StudentInternshipReport from '@/components/student/StudentInternshipReport.vue'
import StudentCompanyEvaluation from '@/components/student/StudentCompanyEvaluation.vue'
import { getCurrentProgress } from '@/services/studentProgressService'

// Component state
const loading = ref(false)
const error = ref('')
const progressData = ref(null)

// Fetch data when component mounts
onMounted(() => {
  fetchProgressData()
})

// Fetch progress data from API
const fetchProgressData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getCurrentProgress()
    if (response && response.data) {
      progressData.value = response.data
    } else {
      progressData.value = null
      error.value = 'Không thể tải thông tin thực tập. Dữ liệu không hợp lệ.'
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin thực tập:', err)
    progressData.value = null

    if (err.response?.status === 404) {
      error.value = 'Không tìm thấy thông tin thực tập cho kỳ hiện tại.'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi tải thông tin thực tập. Vui lòng thử lại sau.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
}

.btn-primary,
.bg-primary {
  background-color: #c02135 !important;
  border-color: #c02135 !important;
}

.btn-outline-primary {
  color: #c02135 !important;
  border-color: #c02135 !important;
}

.btn-outline-primary:hover {
  background-color: #c02135 !important;
  color: white !important;
}

.text-primary {
  color: #c02135 !important;
}
</style>
