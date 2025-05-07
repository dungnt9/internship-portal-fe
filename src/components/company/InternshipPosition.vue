<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  companyId: {
    type: Number,
    required: true,
  },
})

const positions = ref([])
const loading = ref(true)
const error = ref(null)

// This would be replaced with an actual API call in a real implementation
onMounted(async () => {
  try {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data - in a real implementation, you would fetch from an API
    positions.value = [
      {
        id: 1,
        title: 'Phát triển ứng dụng web với Vue.js',
        description:
          'Tham gia vào dự án phát triển ứng dụng web sử dụng Vue.js, làm việc với REST API.',
        requirements: 'Kiến thức về HTML, CSS, JavaScript, Vue.js',
        positions: 3,
        department: 'Phát triển Frontend',
      },
      {
        id: 2,
        title: 'Phát triển Backend với Spring Boot',
        description: 'Tham gia vào việc phát triển các API RESTful sử dụng Spring Boot và Java.',
        requirements: 'Kiến thức về Java, Spring Framework, SQL',
        positions: 2,
        department: 'Phát triển Backend',
      },
    ]
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
            <p class="position-department"><strong>Bộ phận:</strong> {{ position.department }}</p>
            <p class="position-count">
              <strong>Số lượng:</strong> {{ position.positions }} sinh viên
            </p>
          </div>
          <div class="position-description">
            <p>{{ position.description }}</p>
          </div>
          <div class="position-requirements">
            <p><strong>Yêu cầu:</strong> {{ position.requirements }}</p>
          </div>
          <div class="position-actions">
            <button class="apply-button">Đăng ký</button>
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

.position-requirements {
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #555;
}

.position-actions {
  text-align: right;
}

.apply-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.apply-button:hover {
  background-color: #a01c2d;
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
  .position-details {
    flex-direction: column;
    gap: 5px;
  }

  .position-actions {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
