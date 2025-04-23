<template>
  <div class="container">
    <img src="/images/background/background.webp" alt="Logo" class="background" />
    <div class="login-container">
      <img src="/images/logo/logo-hust.webp" alt="Logo" class="logo" />
      <p>Khôi phục mật khẩu</p>
      <p>Bạn vui lòng nhập địa chỉ Email để tiến hành khôi phục mật khẩu.</p>
      <div v-if="text_error" class="text-error text-center">
        {{ text_error }}
      </div>
      <form class="login-form" @submit.prevent="send">
        <p>Email</p>
        <div class="input-group">
          <input type="text" v-model="email" placeholder="Email" class="input-box" />
        </div>

        <button type="submit" class="send-button">
          <span v-if="loading" class="spinner-border spinner-border-sm mb-2"></span>Lấy lại mật khẩu
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { validEmail } from '@/utils/validators'
import { useAuthStore } from '@/stores/authStore'

const text_error = ref('')
const authStore = useAuthStore()
const loading = ref(false)
const email = ref(null)
const password = ref(null)

const send = async () => {
  if (loading.value) return
  if (!email.value || !password.value) {
    text_error.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }
  if (email.value.length > 10) {
    if (!validEmail(email.value)) {
      text_error.value = 'Email không đúng định dạng'
      return
    }
  }

  const payload = {
    email: email.value,
    password: password.value,
  }

  loading.value = true
  try {
    await authStore.login(payload)
    // const userStore = useUserStore()
    // await userStore.fetchUser()
  } catch (err) {
    text_error.value = err
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: relative;
  height: 600px;
  z-index: -1;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 10px 50px rgba(4, 54, 255, 0.1);
}

.login-container {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.726);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  min-width: 500px;
  height: auto;
  padding: 20px;
}

.logo {
  width: 70px;
  padding: 10px;
}

.text-error {
  color: red;
  margin-bottom: 1rem;
}

.login-form {
  min-width: 300px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
}

.input-group-prepend {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 10px;
}

.input-box {
  width: 100%;
  height: 40px;
  border: none;
  margin-bottom: 1rem;
  padding: 0 10px;
}

.view {
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  z-index: 1;
  cursor: pointer;
}

.send-button {
  width: 100%;
  height: 40px;
  background-color: #c02135;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
</style>
