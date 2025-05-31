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

      <div v-if="successMessage" class="text-success text-center">
        {{ successMessage }}
      </div>

      <form class="login-form" @submit.prevent="sendOtp">
        <p>Email</p>
        <div class="input-group">
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            class="input-box"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="send-button" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <strong>{{ loading ? 'Đang gửi...' : 'Lấy lại mật khẩu' }}</strong>
        </button>
      </form>
    </div>

    <!-- OTP Popup -->
    <Teleport to="body">
      <div v-if="showOtpPopup" class="popup-overlay" @click="closePopup">
        <div class="popup-container" @click.stop>
          <div class="popup-header">
            <h3>Xác thực OTP</h3>
            <button class="close-btn" @click="closePopup">&times;</button>
          </div>

          <div class="popup-content">
            <p>
              Mã OTP đã được gửi đến email: <strong>{{ email }}</strong>
            </p>

            <div v-if="otpError" class="text-error">
              {{ otpError }}
            </div>

            <form @submit.prevent="verifyOtpCode">
              <div class="input-group">
                <label>Mã OTP</label>
                <input
                  type="text"
                  v-model="otp"
                  placeholder="Nhập mã OTP"
                  class="input-box"
                  maxlength="6"
                  :disabled="otpLoading"
                />
              </div>

              <button type="submit" class="verify-btn" :disabled="otpLoading || !otp">
                <span v-if="otpLoading" class="spinner-border spinner-border-sm"></span>
                {{ otpLoading ? 'Đang xác thực...' : 'Xác thực OTP' }}
              </button>
            </form>

            <div class="resend-section">
              <p>
                Không nhận được mã?
                <button
                  class="resend-btn"
                  @click="resendOtp"
                  :disabled="resendCountdown > 0 || loading"
                >
                  {{ resendCountdown > 0 ? `Gửi lại sau ${resendCountdown}s` : 'Gửi lại mã' }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reset Password Popup -->
    <Teleport to="body">
      <div v-if="showResetPopup" class="popup-overlay" @click="closeResetPopup">
        <div class="popup-container" @click.stop>
          <div class="popup-header">
            <h3>Đặt lại mật khẩu</h3>
            <button class="close-btn" @click="closeResetPopup">&times;</button>
          </div>

          <div class="popup-content">
            <div v-if="resetError" class="text-error">
              {{ resetError }}
            </div>

            <form @submit.prevent="resetUserPassword">
              <div class="input-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  v-model="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  class="input-box"
                  :disabled="resetLoading"
                />
              </div>

              <div class="input-group">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  class="input-box"
                  :disabled="resetLoading"
                />
              </div>

              <button
                type="submit"
                class="reset-btn"
                :disabled="resetLoading || !newPassword || !confirmPassword"
              >
                <span v-if="resetLoading" class="spinner-border spinner-border-sm"></span>
                {{ resetLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { validEmail } from '@/utils/validators.js'
import { forgotPassword, verifyOtp, resetPassword } from '@/services/authService.js'
import { toast } from 'vue3-toastify'

const router = useRouter()

// Form data
const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Loading states
const loading = ref(false)
const otpLoading = ref(false)
const resetLoading = ref(false)

// Error messages
const text_error = ref('')
const otpError = ref('')
const resetError = ref('')
const successMessage = ref('')

// Popup states
const showOtpPopup = ref(false)
const showResetPopup = ref(false)

// Resend countdown
const resendCountdown = ref(0)
let resendTimer = null

// Send OTP
const sendOtp = async () => {
  if (loading.value) return

  // Reset errors
  text_error.value = ''
  successMessage.value = ''

  // Validation
  if (!email.value) {
    text_error.value = 'Vui lòng nhập địa chỉ email'
    return
  }

  if (!validEmail(email.value)) {
    text_error.value = 'Email không đúng định dạng'
    return
  }

  loading.value = true

  try {
    const response = await forgotPassword({ email: email.value })

    if (response.status === 200) {
      successMessage.value = response.message
      showOtpPopup.value = true
      startResendCountdown()
    }
  } catch (error) {
    text_error.value = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    loading.value = false
  }
}

// Verify OTP
const verifyOtpCode = async () => {
  if (otpLoading.value) return

  otpError.value = ''

  if (!otp.value) {
    otpError.value = 'Vui lòng nhập mã OTP'
    return
  }

  if (otp.value.length !== 6) {
    otpError.value = 'Mã OTP phải có 6 số'
    return
  }

  otpLoading.value = true

  try {
    const response = await verifyOtp({
      email: email.value,
      otp: otp.value,
    })

    if (response.status === 200 && response.data === true) {
      showOtpPopup.value = false
      showResetPopup.value = true
      clearResendTimer()
    }
  } catch (error) {
    otpError.value = error.response?.data?.message || 'Mã OTP không đúng'
  } finally {
    otpLoading.value = false
  }
}

// Reset password
const resetUserPassword = async () => {
  if (resetLoading.value) return

  resetError.value = ''

  // Validation
  if (!newPassword.value || !confirmPassword.value) {
    resetError.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }

  if (newPassword.value.length < 6) {
    resetError.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    resetError.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  resetLoading.value = true

  try {
    const response = await resetPassword({
      email: email.value,
      otp: otp.value,
      newPassword: newPassword.value,
    })

    if (response.status === 200 && response.data === true) {
      toast.success('Đặt lại mật khẩu thành công!')
      showResetPopup.value = false
      setTimeout(() => {
        router.push('/dang-nhap')
      }, 3000)
    }
  } catch (error) {
    resetError.value = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    resetLoading.value = false
  }
}

// Resend OTP
const resendOtp = async () => {
  if (resendCountdown.value > 0 || loading.value) return

  try {
    await sendOtp()
    if (successMessage.value) {
      startResendCountdown()
      otpError.value = ''
      otp.value = ''
    }
  } catch (error) {
    otpError.value = 'Không thể gửi lại mã OTP'
  }
}

// Start resend countdown
const startResendCountdown = () => {
  resendCountdown.value = 60
  resendTimer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearResendTimer()
    }
  }, 1000)
}

// Clear resend timer
const clearResendTimer = () => {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
  resendCountdown.value = 0
}

// Close popups
const closePopup = () => {
  showOtpPopup.value = false
  otp.value = ''
  otpError.value = ''
  clearResendTimer()
}

const closeResetPopup = () => {
  showResetPopup.value = false
  newPassword.value = ''
  confirmPassword.value = ''
  resetError.value = ''
}

// Cleanup on unmount
onUnmounted(() => {
  clearResendTimer()
})
</script>

<style scoped>
.container {
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.background {
  position: relative;
  height: 600px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 10px 50px rgba(4, 54, 255, 0.1);
}

.login-container {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.84);
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
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 14px;
}

.text-success {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 14px;
}

.login-form {
  min-width: 300px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.input-box {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  padding: 0 10px;
  outline: none;
  border-radius: 10px;
  font-size: 14px;
}

.input-box:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.input-box:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  width: 100%;
  height: 40px;
  background-color: #c02135;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.send-button:hover:not(:disabled) {
  background-color: #a01e2f;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-container {
  background-color: white;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: popup-appear 0.3s ease-out;
}

@keyframes popup-appear {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.popup-content {
  padding: 20px;
}

.popup-content p {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.verify-btn,
.reset-btn {
  width: 100%;
  height: 40px;
  background-color: #007bff;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.verify-btn:hover:not(:disabled),
.reset-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.verify-btn:disabled,
.reset-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.resend-section {
  margin-top: 20px;
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.resend-section p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.resend-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.resend-btn:hover:not(:disabled) {
  color: #0056b3;
}

.resend-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

.spinner-border {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner-border-sm {
  width: 14px;
  height: 14px;
}
</style>
