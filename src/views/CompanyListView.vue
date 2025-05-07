<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCompany } from '@/services/userService'

const companies = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

onMounted(async () => {
  try {
    const response = await getAllCompany()
    companies.value = response.data
    loading.value = false
  } catch (err) {
    error.value = 'Không thể tải danh sách công ty. Vui lòng thử lại sau.'
    loading.value = false
    console.error('Lỗi tải danh sách công ty:', err)
  }
})

const navigateToCompanyDetail = (companyId) => {
  router.push({
    name: 'thong-tin-doanh-nghiep',
    query: { id: companyId },
  })
}

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="company-list-container">
    <h1 class="title">Danh sách doanh nghiệp thực tập</h1>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải danh sách doanh nghiệp...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchCompanies" class="retry-button">Thử lại</button>
    </div>

    <div v-else class="company-grid">
      <div
        v-for="company in companies"
        :key="company.id"
        class="company-card"
        @click="navigateToCompanyDetail(company.id)"
      >
        <div class="company-logo">
          <img
            :src="company.logoPath || '../../assets/default-logo.png'"
            :alt="company.name"
            @error="$event.target.src = '../../assets/default-logo.png'"
          />
        </div>
        <div class="company-info">
          <h3 class="company-name">{{ company.name }}</h3>
          <p class="company-short-name">{{ company.shortName }}</p>
          <div class="company-details">
            <p><strong>Loại:</strong> {{ company.businessType }}</p>
            <p><strong>Nhân viên:</strong> {{ company.employeeCount }}</p>
            <p><strong>Vốn:</strong> {{ formatCurrency(company.capital) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error && companies.length === 0" class="no-companies">
      <p>Không có doanh nghiệp nào.</p>
    </div>
  </div>
</template>

<style scoped>
.company-list-container {
  padding: 20px;
}

.title {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.company-card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  background-color: #fff;
  height: 100%;
}

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.company-logo {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.company-logo img {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
}

.company-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.company-name {
  margin: 0 0 5px 0;
  color: #c02135;
  font-size: 18px;
}

.company-short-name {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.company-details {
  margin-top: auto;
}

.company-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c02135;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
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
  padding: 50px 0;
  color: #c02135;
}

.retry-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.no-companies {
  text-align: center;
  padding: 50px 0;
  color: #666;
}
</style>
