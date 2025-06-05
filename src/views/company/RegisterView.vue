<template>
  <div class="container">
    <img src="/images/background/background.webp" alt="Logo" class="background" />
    <div class="login-container">
      <img src="/images/logo/logo-hust.webp" alt="Logo" class="logo" />
      <p>Đăng ký Thông tin Doanh nghiệp</p>
      <p class="note">
        LƯU Ý:<br />
        Mỗi Doanh nghiệp CHỈ ĐĂNG KÝ 01 lần. Đăng ký sẽ không được duyệt nếu trùng với Doanh nghiệp
        đã tồn tại.<br />
        Mã số thuế sẽ là thông tin yêu cầu dùng để định danh của doanh nghiệp
      </p>
      <div v-if="text_error" class="text-error text-center">
        {{ text_error }}
      </div>
      <form class="login-form row" @submit.prevent="register">
        <div class="col-md-12"><strong>Thông tin chung</strong></div>
        <div class="col-md-12">
          <div class="form-check">
            <input
              type="checkbox"
              id="termsCheckbox"
              v-model="formData.isForeignCompany"
              class="form-check-input"
            />
            <label for="termsCheckbox" class="form-check-label"> Là doanh nghiệp nước ngoài </label>
          </div>
        </div>
        <div class="col-md-6">
          <div>
            <p>Tên công ty (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.companyName"
                placeholder="Tên công ty"
                class="input-box"
              />
            </div>
          </div>
          <div>
            <p>Website Công ty (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.website"
                placeholder="Website công ty"
                class="input-box"
              />
            </div>
          </div>
          <div v-if="!formData.isForeignCompany">
            <p>Mã số thuế (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.taxCode"
                placeholder="Mã số thuế"
                class="input-box"
              />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div>
            <p>Tên viết tắt (Nếu có)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.shortName"
                placeholder="Tên viết tắt"
                class="input-box"
              />
            </div>
          </div>
          <div>
            <p>Địa chỉ (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.address"
                placeholder="Địa chỉ"
                class="input-box"
              />
            </div>
          </div>
        </div>

        <div class="col-md-12"><strong>Thông tin Tài khoản Người đại diện</strong></div>
        <div class="col-md-6">
          <div>
            <p>Họ và tên (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.fullName"
                placeholder="Họ và tên"
                class="input-box"
              />
            </div>
          </div>
          <div>
            <p>Email (*)</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div>
            <p>Vị trí tại Công ty (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.position"
                placeholder="Vị trí tại Công ty"
                class="input-box"
              />
            </div>
          </div>
          <div>
            <p>Điện thoại (*)</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.phone"
                placeholder="Điện thoại"
                class="input-box"
              />
            </div>
          </div>
        </div>

        <div class="col-6 mx-auto d-flex justify-content-center align-items-center">
          <button type="submit" class="login-button">
            <span v-if="loading" class="spinner-border spinner-border-sm mb-2"></span>Đăng ký
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { validEmail, validPhone, emoji } from '@/utils/validators.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { registerCompany } from '@/services/userService'

const router = useRouter()

const text_error = ref('')
const authStore = useAuthStore()
const loading = ref(false)

const formData = ref({
  companyName: '',
  shortName: '',
  website: '',
  taxCode: '',
  address: '',
  isForeignCompany: false,

  fullName: '',
  email: '',
  phone: '',
  position: '',
})

const validateForm = () => {
  const requiredFields = [
    'companyName',
    'website',
    'address',
    'fullName',
    'email',
    'phone',
    'position',
  ]

  // Only require tax code for domestic companies
  if (!formData.value.isForeignCompany) {
    requiredFields.push('taxCode')
  }

  for (const field of requiredFields) {
    if (!formData.value[field] || formData.value[field].trim() === '') {
      text_error.value = 'Vui lòng nhập đầy đủ thông tin'
      return false
    }
  }

  if (!validEmail(formData.value.email)) {
    text_error.value = 'Email không đúng định dạng'
    return false
  }

  if (!validPhone(formData.value.phone)) {
    text_error.value = 'Số điện thoại không đúng định dạng'
    return false
  }

  return true
}

const register = async () => {
  if (loading.value) return

  text_error.value = ''

  if (!validateForm()) {
    return
  }

  const payload = {
    companyName: formData.value.companyName,
    shortName: formData.value.shortName,
    website: formData.value.website,
    taxCode: formData.value.isForeignCompany ? null : formData.value.taxCode,
    address: formData.value.address,
    isForeignCompany: formData.value.isForeignCompany,

    fullName: formData.value.fullName,
    email: formData.value.email,
    phone: formData.value.phone,
    position: formData.value.position,
  }

  loading.value = true
  try {
    const response = await registerCompany(payload)

    if (response.status === 201) {
      toast.success('Đăng ký thành công. Vui lòng kiểm tra email để nhận mật khẩu.')

      // Reset form
      formData.value = {
        companyName: '',
        shortName: '',
        website: '',
        taxCode: '',
        address: '',
        isForeignCompany: false,

        fullName: '',
        email: '',
        phone: '',
        position: '',
      }

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/dang-nhap')
      }, 3000)
    }
  } catch (err) {
    console.error('Registration error:', err)
    if (err.response?.data?.message) {
      text_error.value = err.response.data.message
    } else {
      text_error.value = 'Đăng ký không thành công. Vui lòng thử lại.'
    }
    toast.error(text_error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: relative;
  height: 700px;
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
  border-radius: 20px;
  max-width: 900px;
  padding: 20px;
  max-height: 600px;
  overflow: auto;
  scrollbar-width: thin;
}

.logo {
  width: 70px;
  padding: 10px;
}

.note {
  color: red;
  margin-bottom: 1rem;
}

.text-error {
  color: red;
  margin-bottom: 1rem;
}

.login-form {
  min-width: 800px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
}

.input-box {
  width: 100%;
  height: 40px;
  border: none;
  margin-bottom: 1rem;
  padding: 0 10px;
  outline: none;
  border-radius: 10px;
}

.input-box:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.login-button {
  width: 100%;
  height: 40px;
  background-color: #c02135;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
</style>
