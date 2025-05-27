<!-- views/ApproveCV.vue -->
<template>
  <div>
    <div class="container-fluid px-4 py-4">
      <div class="row mb-4">
        <div class="col">
          <h2>Quản lý đơn đăng ký thực tập</h2>
          <p class="text-muted">Xem và duyệt đơn đăng ký của sinh viên</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'pending' }"
            href="#"
            @click.prevent="activeTab = 'pending'"
          >
            <i class="bi bi-hourglass me-1"></i>Đơn chờ duyệt
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'history' }"
            href="#"
            @click.prevent="activeTab = 'history'"
          >
            <i class="bi bi-clock-history me-1"></i>Lịch sử đơn đăng ký
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Pending Applications Tab -->
        <div v-if="activeTab === 'pending'" class="tab-pane fade show active">
          <company-applications />
        </div>

        <!-- Application History Tab -->
        <div v-if="activeTab === 'history'" class="tab-pane fade show active">
          <application-history />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompanyApplications from './CompanyApplications.vue'
import ApplicationHistory from './ApplicationHistory.vue'

const activeTab = ref('pending')
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
}

.nav-tabs .nav-link.active {
  color: #c02135;
  border-bottom: 2px solid #c02135;
  font-weight: bold;
}

.container-fluid {
  max-width: 1400px;
}
</style>
