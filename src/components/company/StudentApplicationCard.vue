<!-- components/StudentApplicationCard.vue -->
<template>
  <div class="student-application-card">
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">
            {{ application.name }}
            <span class="badge bg-primary ms-2">{{ application.studentCode }}</span>
          </h5>
          <div class="text-muted small">
            <span>Ngày đăng ký: {{ formatDate(application.appliedAt) }}</span>
            <span class="mx-2">|</span>
            <span>Nguyện vọng: {{ application.preferenceOrder }}</span>
          </div>
        </div>
        <div class="badge bg-warning">Đang chờ duyệt</div>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <div class="mb-3">
              <h6>Thông tin sinh viên</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-2"><strong>Email:</strong> {{ application.email }}</div>
                  <div class="mb-2"><strong>Số điện thoại:</strong> {{ application.phone }}</div>
                  <div class="mb-2"><strong>Lớp:</strong> {{ application.className }}</div>
                  <div class="mb-2"><strong>Chuyên ngành:</strong> {{ application.major }}</div>
                </div>
                <div class="col-md-6">
                  <div class="mb-2"><strong>CPA:</strong> {{ application.cpa }}</div>
                  <div class="mb-2">
                    <strong>Trình độ tiếng Anh:</strong> {{ application.englishLevel }}
                  </div>
                  <div class="mb-2"><strong>Kỹ năng:</strong> {{ application.skills }}</div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <h6>Vị trí đăng ký</h6>
              <div class="p-3 bg-light rounded">
                <div class="mb-2"><strong>Vị trí:</strong> {{ application.positionTitle }}</div>
                <div><strong>Ghi chú:</strong> {{ application.note || 'Không có' }}</div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="mb-3">
              <h6>CV của sinh viên</h6>
              <a
                :href="application.cvFilePath"
                target="_blank"
                class="btn btn-outline-primary btn-sm w-100"
              >
                <i class="bi bi-file-earmark-text me-2"></i>Xem CV
              </a>
            </div>

            <div class="mt-4">
              <approval-action-buttons
                :application-detail-id="application.applicationDetailId"
                @approve="$emit('approve', application.applicationDetailId)"
                @reject="$emit('reject', application.applicationDetailId)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ApprovalActionButtons from './ApprovalActionButtons.vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['approve', 'reject'])

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
</script>

<style scoped>
.student-application-card {
  transition: all 0.2s ease;
}
.student-application-card:hover {
  transform: translateY(-3px);
}
.card {
  border-radius: 8px;
}
.card-header {
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.bg-primary {
  background-color: #c02135 !important;
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
</style>
