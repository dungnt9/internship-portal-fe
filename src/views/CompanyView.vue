<script setup>
import { ref } from 'vue'
import CompanyInfo from '@/components/company/CompanyInfo.vue'
import InternshipPosition from '@/components/company/InternshipPosition.vue'

const activeTab = ref('info')

const switchTab = (tab) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="row">
    <div class="col-md-3">
      <img src="../../assets/logo.png" alt="" />
      <p>Tên công ty</p>
    </div>
    <div class="col-md-9">
      <div class="container">
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
      <CompanyInfo v-if="activeTab === 'info'" />
      <InternshipPosition v-if="activeTab === 'positions'" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

.box {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.box.active {
  color: #c02135;
  border-bottom: 2px solid #c02135;
  font-weight: bold;
}

.col-md-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
