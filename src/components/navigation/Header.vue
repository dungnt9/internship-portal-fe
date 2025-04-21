<template>
  <div class="header-container">
    <div class="header-title">
      <img src="/images/logo/logo-hust.webp" alt="Logo" class="logo" />
      <div class="title">
        <p class="title-1">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
        <div class="divider"></div>
        <p class="title-2">Hệ thống quản lý thực tập</p>
      </div>
    </div>
    <div class="menu">
      <router-link to="/dang-ky-thuc-tap">
        <p class="category">Đăng ký thực tập</p>
      </router-link>
      <router-link to="/danh-gia">
        <p class="category">Đánh giá</p>
      </router-link>
    </div>
  </div>
</template>
<script setup></script>
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
  padding: 10px;
}

.menu {
  display: flex;
  justify-content: center;
  align-items: center;
}

.category {
  color: black;
  font-size: 16px;
  margin: 0 20px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
}

P {
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-align: center;
  line-height: 1.5;
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

.title-2 {
  text-align: start;
}
</style>
