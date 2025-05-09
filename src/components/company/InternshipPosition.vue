<script setup>
import { ref, onMounted } from 'vue'
import { getPositionOfCompany } from '@/services/registerService.js'

const props = defineProps({
  companyId: {
    type: Number,
    required: true,
  },
})

const positions = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await getPositionOfCompany(props.companyId)
    positions.value = response.data || []
    loading.value = false
  } catch (err) {
    error.value = 'Không thể tải danh sách đề tài. Vui lòng thử lại sau.'
    loading.value = false
    console.error('Lỗi tải danh sách đề tài:', err)
  }
})
</script>

<template>
  <div class="position-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải danh sách đề tài...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <h3 class="section-title">Danh sách đề tài thực tập</h3>

      <div v-if="positions.length === 0" class="no-positions">
        <p>Hiện tại chưa có đề tài thực tập nào.</p>
      </div>

      <div v-else class="position-list">
        <div v-for="position in positions" :key="position.id" class="position-card">
          <h4 class="position-title">{{ position.title }}</h4>
          <div class="position-details">
            <p class="position-department"><strong>Công ty:</strong> {{ position.companyName }}</p>
            <p class="position-count">
              <strong>Số lượng:</strong> {{ position.availableSlots }} sinh viên (Đã đăng ký:
              {{ position.registeredCount }})
            </p>
          </div>
          <div class="position-description">
            <p>{{ position.description }}</p>
          </div>
          <div class="position-requirements">
            <p><strong>Yêu cầu:</strong> {{ position.requirements }}</p>
          </div>
          <div class="position-benefits" v-if="position.benefits">
            <p><strong>Quyền lợi:</strong> {{ position.benefits }}</p>
          </div>
          <div class="position-info">
            <p><strong>Hình thức:</strong> {{ position.workType }}</p>
            <p>
              <strong>Hạn đăng ký:</strong>
              {{ new Date(position.dueDate).toLocaleDateString('vi-VN') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.position-container {
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 20px;
}

.section-title {
  color: #c02135;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.position-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.position-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.position-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.position-title {
  color: #c02135;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.position-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.position-description {
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #333;
}

.position-requirements,
.position-benefits,
.position-info {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555;
}

.position-info {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

.loading-container {
  text-align: center;
  padding: 30px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c02135;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 30px 0;
  color: #c02135;
}

.no-positions {
  text-align: center;
  padding: 30px 0;
  color: #666;
}

@media (max-width: 768px) {
  .position-details,
  .position-info {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
