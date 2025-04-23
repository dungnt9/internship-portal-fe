<template>
  <div class="header-container">
    <div class="header-title">
      <img src="/images/logo/logo-hust.webp" alt="Logo" class="logo" />
      <div class="title">
        <p class="title-1">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
        <div class="divider"></div>
        <p class="title-2">Hệ thống đăng ký và quản lý thực tập</p>
      </div>
    </div>
    <div class="menu">
      <div v-if="!!authStore.token" class="list-category">
        <router-link to="/dang-ky-thuc-tap" class="link">
          <p class="category">Đăng ký thực tập</p>
        </router-link>
        <router-link to="/danh-gia" class="link">
          <p class="category">Đánh giá</p>
        </router-link>
      </div>

      <div v-if="!!authStore.token" class="info">
        <img src="/images/header/bell.svg" alt="bell" class="bell" />
        <img src="/images/header/user.png" alt="user" class="user" />
      </div>
      <div v-else class="info">
        <router-link to="/dang-nhap" class="link">
          <p class="category">Đăng nhập</p>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.header-title {
  background-color: #c02135;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.logo {
  width: 70px;
  padding: 15px;
}

.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 5rem;
}

.list-category {
  display: flex;
  flex-direction: row;
}

.link {
  text-decoration: none;
}

.info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bell {
  margin-right: 10px;
  height: 40px;
}

.user {
  height: 50px;
  margin-right: 20px;
}

.category {
  color: black;
  font-size: 18px;
  margin: 0 20px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

P {
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-align: center;
  line-height: 1.5;
  text-align: start;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: white;
  margin: 5px 0;
}

.title-1 {
  font-weight: bold;
}
</style>
