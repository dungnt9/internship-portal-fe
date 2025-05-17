<!-- views/CompanyApplications.vue -->
<template>
  <div class="company-applications container py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-1">Đơn đăng ký thực tập đang chờ duyệt</h2>
        <p class="text-muted">
          Các đơn đăng ký đang chờ duyệt của sinh viên dành cho công ty của bạn
        </p>
      </div>
      <div class="col-auto d-flex align-items-center">
        <button class="btn btn-primary" @click="fetchPendingApplications" :disabled="loading">
          <i class="bi bi-arrow-clockwise me-1"></i>
          <span v-if="!loading">Làm mới</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
    </div>

    <div class="alert alert-info" role="alert">
      <i class="bi bi-info-circle-fill me-2"></i>
      <strong>Lưu ý:</strong> Bạn chỉ thấy được đơn đăng ký của sinh viên khi đơn đó đang ở nguyện
      vọng cao nhất mà sinh viên đang chờ duyệt.
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải danh sách đơn đăng ký...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="pendingApplications.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-clipboard-check" style="font-size: 3rem"></i>
      <h5 class="mt-3">Không có đơn đăng ký nào đang chờ duyệt</h5>
      <p class="text-muted">
        Tất cả đơn đăng ký đã được xử lý hoặc chưa có sinh viên đăng ký vào công ty của bạn
      </p>
      <router-link :to="{ name: 'lich-su-duyet' }" class="btn btn-outline-primary mt-2">
        <i class="bi bi-clock-history me-2"></i>Xem lịch sử đơn đăng ký
      </router-link>
    </div>

    <!-- Applications list -->
    <div v-else>
      <div class="mb-4">
        <p>
          <strong>{{ pendingApplications.length }}</strong> đơn đăng ký đang chờ duyệt
        </p>
      </div>

      <div v-for="application in pendingApplications" :key="application.applicationDetailId">
        <student-application-card
          :application="application"
          @approve="handleApprove"
          @reject="handleReject"
        />
      </div>

      <div class="mt-4 text-center">
        <router-link :to="{ name: 'lich-su-duyet' }" class="btn btn-outline-primary">
          <i class="bi bi-clock-history me-2"></i>Xem lịch sử đơn đăng ký
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import StudentApplicationCard from '@/components/company/StudentApplicationCard.vue'
import {
  getPendingApplications,
  takeActionOnApplication,
} from '@/services/companyApplicationService'

const pendingApplications = ref([])
const loading = ref(false)

// Fetch pending applications
const fetchPendingApplications = async () => {
  loading.value = true
  try {
    const response = await getPendingApplications()
    if (response && response.data) {
      pendingApplications.value = response.data
    } else {
      pendingApplications.value = []
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn đăng ký:', error)
    toast.error('Không thể tải danh sách đơn đăng ký. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

// Handle approve application
const handleApprove = async (applicationDetailId) => {
  try {
    await takeActionOnApplication(applicationDetailId, 'APPROVE')
    toast.success('Đã duyệt đơn đăng ký thành công')
    // Remove approved application from the list
    pendingApplications.value = pendingApplications.value.filter(
      (app) => app.applicationDetailId !== applicationDetailId,
    )
  } catch (error) {
    console.error('Lỗi khi duyệt đơn đăng ký:', error)
    toast.error('Không thể duyệt đơn đăng ký. Vui lòng thử lại sau.')
  }
}

// Handle reject application
const handleReject = async (applicationDetailId) => {
  try {
    await takeActionOnApplication(applicationDetailId, 'REJECT')
    toast.success('Đã từ chối đơn đăng ký thành công')
    // Remove rejected application from the list
    pendingApplications.value = pendingApplications.value.filter(
      (app) => app.applicationDetailId !== applicationDetailId,
    )
  } catch (error) {
    console.error('Lỗi khi từ chối đơn đăng ký:', error)
    toast.error('Không thể từ chối đơn đăng ký. Vui lòng thử lại sau.')
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchPendingApplications()
})
</script>

<style scoped>
.company-applications {
  max-width: 1000px;
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
</style>
