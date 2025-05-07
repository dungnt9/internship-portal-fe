<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CompanyInfo from '@/components/company/CompanyInfo.vue'
import InternshipPosition from '@/components/company/InternshipPosition.vue'
import { getInfoCompanyById } from '@/services/userService'

const route = useRoute()
const activeTab = ref('info')
const company = ref(null)
const loading = ref(true)
const error = ref(null)

const switchTab = (tab) => {
  activeTab.value = tab
}

onMounted(async () => {
  try {
    const companyId = route.query.id
    if (!companyId) {
      error.value = 'Không tìm thấy ID công ty'
      loading.value = false
      return
    }

    const response = await getInfoCompanyById(companyId)
    company.value = response.data
    loading.value = false
  } catch (err) {
    error.value = 'Không thể tải thông tin công ty. Vui lòng thử lại sau.'
    loading.value = false
    console.error('Lỗi tải thông tin công ty:', err)
  }
})

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="company-detail-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin công ty...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="company" class="row">
      <div class="col-md-3">
        <div class="company-sidebar">
          <div class="logo-container">
            <img
              :src="company.logoPath || '../../assets/default-logo.png'"
              :alt="company.name"
              @error="$event.target.src = '../../assets/default-logo.png'"
              class="company-logo"
            />
          </div>
          <h2 class="company-name">{{ company.name }}</h2>
          <p class="short-name">{{ company.shortName }}</p>
          <p class="website">
            <a :href="company.website" target="_blank" rel="noopener noreferrer">
              {{ company.website }}
            </a>
          </p>
          <div class="verified-status" v-if="company.isVerified">
            <span class="verified-badge">Đã xác minh</span>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="tab-container">
          <div class="box" :class="{ active: activeTab === 'info' }" @click="switchTab('info')">
            Giới thiệu
          </div>
          <div
            class="box"
            :class="{ active: activeTab === 'positions' }"
            @click="switchTab('positions')"
          >
            Đề tài
          </div>
        </div>

        <CompanyInfo v-if="activeTab === 'info'" :company="company" />
        <InternshipPosition v-if="activeTab === 'positions'" :companyId="company.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-detail-container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-3 {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;
}

.col-md-9 {
  flex: 0 0 75%;
  max-width: 75%;
  padding: 0 15px;
}

.company-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
}

.logo-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.company-logo {
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
}

.company-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
  text-align: center;
  color: #c02135;
}

.short-name {
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
  text-align: center;
}

.website {
  font-size: 0.9rem;
  margin-bottom: 15px;
  text-align: center;
}

.website a {
  color: #007bff;
  text-decoration: none;
}

.website a:hover {
  text-decoration: underline;
}

.verified-status {
  text-align: center;
  margin-top: 10px;
}

.verified-badge {
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.tab-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.box {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.box.active {
  color: #c02135;
  border-bottom: 2px solid #c02135;
  font-weight: bold;
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

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .col-md-3,
  .col-md-9 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .company-sidebar {
    margin-bottom: 20px;
  }
}
</style>
