<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="company-info-container">
    <div class="info-grid">
      <div class="info-section">
        <div class="info-item">
          <div class="info-label">Tên đầy đủ</div>
          <div class="info-value">{{ company.name }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Tên viết tắt</div>
          <div class="info-value">{{ company.shortName }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Vốn điều lệ</div>
          <div class="info-value">{{ formatCurrency(company.capital) }}</div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <div class="info-label">Loại doanh nghiệp</div>
          <div class="info-value">{{ company.businessType }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Năm thành lập</div>
          <div class="info-value">{{ company.foundingYear }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Địa chỉ</div>
          <div class="info-value">{{ company.address }}</div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <div class="info-label">Số nhân viên</div>
          <div class="info-value">{{ company.employeeCount }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Website</div>
          <div class="info-value">
            <a :href="company.website" target="_blank" rel="noopener noreferrer">{{
              company.website
            }}</a>
          </div>
        </div>
        <div class="info-item" v-if="company.taxCode">
          <div class="info-label">Mã số thuế</div>
          <div class="info-value">{{ company.taxCode }}</div>
        </div>
      </div>
    </div>

    <div class="description-section">
      <h3 class="section-title">Mô tả</h3>
      <p class="description-text">{{ company.description }}</p>
    </div>

    <div class="contact-section">
      <h3 class="section-title">Thông tin liên hệ</h3>
      <div class="contact-info">
        <p>{{ company.address }}</p>
        <p>
          <a :href="company.website" target="_blank" rel="noopener noreferrer">{{
            company.website
          }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-info-container {
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  margin-bottom: 10px;
}

.info-label {
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.info-value {
  color: #333;
  font-size: 1rem;
}

.section-title {
  color: #c02135;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.description-section {
  margin-bottom: 30px;
}

.description-text {
  line-height: 1.6;
  color: #333;
}

.contact-info p {
  margin: 5px 0;
  color: #333;
}

.contact-info a {
  color: #007bff;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
