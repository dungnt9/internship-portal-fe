<template>
  <div class="container">
    <div v-if="text_error" class="text-error">
      {{ text_error }}
    </div>
    <form class="profile-form row" @submit.prevent="save">
      <div class="col-md-12 d-flex justify-content-center align-items-center">
        <div class="profile-image-container">
          <img src="/images/user/default_avatar.svg" class="profile-image" />
          <div class="edit-badge">
            <img src="/images/user/edit_profile.svg" class="icon-placeholder" />
            <input type="file" @change="handleAvatarUpload" ref="fileInput" />
          </div>
        </div>
      </div>

      <div class="col-md-12"><strong>Thông tin chung</strong></div>
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
      </div>

      <div class="col-md-6">
        <div>
          <p>Email</p>
          <div class="input-group">
            <input type="text" placeholder="Email" class="input-box" disabled />
          </div>
        </div>
        <p>Số điện thoại</p>
        <div class="input-group">
          <input type="text" placeholder="Số điện thoại" class="input-box" disabled />
        </div>
      </div>

      <div class="col-md-12"><strong>Thông tin chi tiết</strong></div>
      <div class="col-md-6">
        <div>
          <p>Mã số sinh viên</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.email"
              placeholder="Mã số sinh viên"
              class="input-box"
            />
          </div>
        </div>
        <div>
          <p>Ngành</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Ngành" class="input-box" />
          </div>
        </div>
        <div>
          <p>Lớp</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Lớp" class="input-box" />
          </div>
        </div>
        <div>
          <p>CPA</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="CPA" class="input-box" />
          </div>
        </div>
        <div>
          <p>Ngoại ngữ</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Ngoại ngữ" class="input-box" />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Ngày sinh</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Ngày sinh" class="input-box" />
          </div>
        </div>
        <div>
          <p>Giới tính</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Giới tính" class="input-box" />
          </div>
        </div>
        <div>
          <p>Địa chỉ</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Địa chỉ" class="input-box" />
          </div>
        </div>
        <div>
          <p>Kỹ năng</p>
          <div class="input-group">
            <input type="text" v-model="formData.email" placeholder="Kỹ năng" class="input-box" />
          </div>
        </div>
      </div>

      <div class="col-6 mx-auto d-flex justify-content-center align-items-center">
        <button type="submit" class="login-button">
          <span v-if="loading" class="spinner-border spinner-border-sm mb-2"></span>Lưu
        </button>
      </div>
    </form>
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

const save = async () => {
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
    await authStore.save(payload)
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

.text-error {
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.profile-form {
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

.profile-image-container {
  position: relative;
  width: 107px;
  height: 107px;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  width: auto;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: blue;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-badge input[type='file'] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.icon-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
