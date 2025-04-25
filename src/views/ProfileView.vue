<template>
  <div class="container">
    <div class="login-container">
      <p class="text-center fw-bold title">Thông tin cá nhân</p>
      <div v-if="text_error" class="text-error">
        {{ text_error }}
      </div>
      <form class="login-form row" @submit.prevent="register">
        <div class="col-md-12"><strong>Thông tin chung</strong></div>
        <div class="col-md-6">
          <div>
            <p>Ảnh</p>
            <div class="input-group">
              <input type="text" v-model="formData.companyName" placeholder="" class="input-box" />
            </div>
          </div>
          <div>
            <p>Email</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.shortName"
                placeholder="Email"
                class="input-box"
              />
            </div>
          </div>
        </div>

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
          <p>Số điện thoại</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.taxCode"
              placeholder="Số điện thoại"
              class="input-box"
            />
          </div>
        </div>

        <div class="col-md-12"><strong>Thông tin chi tiết</strong></div>
        <div class="col-md-6">
          <div>
            <p>Đơn vị công tác</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Mã số sinh viên</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Ngành</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Lớp</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>CPA</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Ngoại ngữ</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div>
            <p>Vị trí</p>
            <div class="input-group">
              <input
                type="text"
                v-model="formData.phone"
                placeholder="Điện thoại"
                class="input-box"
              />
            </div>
          </div>
          <div>
            <p>Ngày sinh</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Giới tính</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Địa chỉ</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
            </div>
          </div>
          <div>
            <p>Kỹ năng</p>
            <div class="input-group">
              <input type="text" v-model="formData.email" placeholder="Email" class="input-box" />
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
import { validEmail, validPhone, emoji } from '@/utils/validators'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

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
  password: '',
  confirmPassword: '',
})

const validateForm = () => {
  const requiredFields = [
    'companyName',
    'website',
    'taxCode',
    'address',
    'fullName',
    'email',
    'phone',
    'position',
    'password',
    'confirmPassword',
  ]

  if (!formData.value.isForeignCompany) {
    requiredFields.push('taxCode')
  }

  for (const field of requiredFields) {
    if (!formData.value[field]) {
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

  if (formData.value.password.length < 8 || formData.value.password.length > 20) {
    text_error.value = 'Mật khẩu dài từ 8 - 20 ký tự'
    return false
  }

  if (emoji(formData.value.password)) {
    text_error.value = 'Mật khẩu gồm chữ cái, số hoặc kí tự đặc biệt'
    return false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    text_error.value = 'Mật khẩu nhập lại không khớp'
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
    taxCode: formData.value.taxCode,
    address: formData.value.address,

    fullName: formData.value.fullName,
    email: formData.value.email,
    phone: formData.value.phone,
    position: formData.value.position,
    password: formData.value.password,
  }

  loading.value = true
  try {
    await authStore.register(payload)
    toast.success('Đăng ký thành công. Vui lòng chờ duyệt tài khoản')
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
      password: '',
      confirmPassword: '',
    }
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (err) {
    text_error.value = err
  } finally {
    loading.value = false
    toast.error('Đăng ký không thành công')
  }
}
</script>
<style>
.container {
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  min-width: 500px;
  height: auto;
  padding: 2rem;
  box-shadow: 0px 10px 50px rgba(4, 54, 255, 0.1);
}

.title {
  color: #c02135;
  font-size: 1.5rem;
}

.text-error {
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.login-form {
  min-width: 300px;
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 1.5rem;
}

.input-box {
  width: 100%;
  height: 40px;
  border: 1px solid #e0e0e0;
  padding: 0 40px 0 12px;
  font-size: 0.95rem;
  outline: none;
  border-radius: 10px;
}

.input-box:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.view {
  position: absolute;
  right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 40px;
  background-color: #c02135;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #a61b2d;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

p {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333333;
  text-align: left;
  width: 100%;
}
</style>
