<template>
  <div class="header-container">
    <div class="header-title" @click="redirectHome">
      <img src="/images/logo/logo-hust.webp" alt="Logo" class="logo" />
      <div class="title">
        <p class="title-1">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
        <div class="divider"></div>
        <p class="title-2">Hệ thống đăng ký và quản lý thực tập</p>
      </div>
    </div>
    <div class="menu">
      <div v-if="authStore.isAuthenticated" class="list-category">
        <div v-if="authStore.role == 'ROLE_STUDENT'" class="dropdown-container">
          <p class="category">Đăng ký thực tập</p>
          <div class="dropdown-wrapper-1" @click.stop>
            <Dropdown
              :items="[
                { label: 'Đăng ký nguyện vọng', route: '/dang-ky-nguyen-vong' },
                {
                  label: 'Đăng ký thực tập đơn vị chưa liên kết',
                  route: '/dang-ky-thuc-tap-don-vi-chua-lien-ket',
                },
              ]"
            />
          </div>
        </div>
        <div v-if="authStore.role == 'ROLE_COMPANY'" class="dropdown-container">
          <p class="category">Thông tin công ty của tôi</p>
          <div class="dropdown-wrapper-1" @click.stop>
            <Dropdown
              :items="[
                { label: 'Thông tin công ty', route: '/my-company-info' },
                {
                  label: 'Quản lý người liên lạc',
                  route: '/quan-ly-nguoi-lien-lac',
                },
                { label: 'Vị trí tuyển dụng', route: '/vi-tri-tuyen-dung' },
              ]"
            />
          </div>
        </div>
        <router-link
          v-if="authStore.role !== 'ROLE_COMPANY'"
          to="/danh-sach-doanh-nghiep"
          class="link"
        >
          <p class="category">Danh sách doanh nghiệp</p>
        </router-link>
        <router-link v-if="authStore.role === 'ROLE_COMPANY'" to="/duyet-thuc-tap" class="link">
          <p class="category">Xét duyệt sinh viên thực tập</p>
        </router-link>
        <router-link
          v-if="authStore.role === 'ROLE_COMPANY'"
          to="/qua-trinh-thuc-tap-sv"
          class="link"
        >
          <p class="category">Quá trình thực tập</p>
        </router-link>
        <router-link v-if="authStore.role === 'ROLE_TEACHER'" to="/xac-nhan-thuc-tap" class="link">
          <p class="category">Xác nhận thực tập</p>
        </router-link>
        <router-link v-if="authStore.role === 'ROLE_STUDENT'" to="/thuc-tap-cua-toi" class="link">
          <p class="category">Thực tập của tôi</p>
        </router-link>
      </div>

      <div v-if="authStore.isAuthenticated" class="info">
        <div class="dropdown-container">
          <img src="/images/header/user.png" alt="user" class="user" />
          <div class="dropdown-wrapper">
            <Dropdown
              :items="[
                { label: 'Thông tin cá nhân', route: '/thong-tin-ca-nhan' },
                { label: 'Đổi mật khẩu', route: '/doi-mat-khau' },
                { label: 'Đăng xuất', action: handleShowLogoutModal },
              ]"
            />
          </div>
        </div>
      </div>
      <div v-else class="info">
        <router-link to="/dang-nhap" class="link">
          <p class="category login-btn">Đăng nhập</p>
        </router-link>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="showLogoutModal">
      <LogoutModal @confirm="handleLogout" @close="closeLogoutModal" />
    </div>
  </Teleport>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Dropdown from '@/components/utils/Dropdown.vue'
import LogoutModal from '@/components/utils/LogoutModal.vue'

const authStore = useAuthStore()
const showLogoutModal = ref(false)
const router = useRouter()

const redirectHome = () => {
  router.push('/')
}

const handleShowLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeLogoutModal()
  router.push('/')
  window.location.reload()
}
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.dropdown-container {
  position: relative;
}

.dropdown-wrapper {
  position: absolute;
  right: 0;
  animation: dropdown 0.5s ease forwards;
  padding-top: 10px;
  display: none;
  z-index: 1;
}

.dropdown {
  /* max-width: 400px; */
  margin-left: 28px;
}

.dropdown-wrapper-1 {
  position: absolute;
  animation: dropdown 0.5s ease forwards;
  padding-top: 10px;
  display: none;
  z-index: 1;
}

.dropdown-container:hover .dropdown-wrapper {
  display: block;
}

.dropdown-container:hover .dropdown-wrapper-1 {
  display: block;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user {
  height: 50px;
  margin-right: 20px;
  cursor: pointer;
}

.category {
  color: black;
  font-size: 18px;
  margin: 0 20px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.login-btn {
  font-size: 18px;
  margin: 0 20px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 30px;
  color: white;
  background-color: #c02135;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.login-btn:active {
  transform: scale(0.9);
}

P {
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
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
