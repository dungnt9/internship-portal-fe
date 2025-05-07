<template>
  <div class="container">
    <div v-if="error" class="text-error">
      {{ error }}
    </div>
    <div class="profile-image-container">
      <img
        :src="teacherData.imagePath || '/images/user/default_avatar.svg'"
        class="profile-image"
      />
      <div class="edit-badge">
        <img src="/images/user/edit_profile.svg" class="icon-placeholder" />
        <input type="file" @change="handleAvatarUpload" ref="fileInput" />
      </div>
    </div>

    <form class="profile-form row" @submit.prevent="handleSubmit">
      <div class="col-md-12"><strong>Thông tin chung</strong></div>
      <div class="col-md-6">
        <div>
          <p>Họ và tên (*)</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.name"
              placeholder="Họ và tên"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Email</p>
          <div class="input-group">
            <input
              type="text"
              v-model="teacherData.email"
              placeholder="Email"
              class="input-box"
              disabled
            />
          </div>
        </div>
        <p>Số điện thoại</p>
        <div class="input-group">
          <input
            type="text"
            v-model="teacherData.phone"
            placeholder="Số điện thoại"
            class="input-box"
            disabled
          />
        </div>
      </div>

      <div class="col-md-12"><strong>Thông tin chi tiết</strong></div>
      <div class="col-md-6">
        <div>
          <p>Đơn vị công tác</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.department"
              placeholder="Đơn vị công tác"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Vị trí</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.position"
              placeholder="Vị trí"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <!-- Buttons in a separate row at the bottom -->
      <div class="col-md-12">
        <div
          v-if="editStatus"
          class="col-6 mx-auto d-flex justify-content-center align-items-center"
        >
          <button type="button" @click="toggleEditMode" class="login-button-1 btn btn-success">
            Chỉnh sửa
          </button>
        </div>

        <div
          v-if="!editStatus"
          class="col-6 mx-auto d-flex justify-content-center align-items-center gap-2"
        >
          <button type="button" @click="cancelEdit" class="login-button-1 btn btn-secondary">
            <span v-if="loading" class="spinner-border spinner-border-sm mb-2"></span>Hủy
          </button>
          <button type="submit" class="login-button-1 btn btn-danger">
            <span v-if="loading" class="spinner-border spinner-border-sm mb-2"></span>Lưu
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { getInfoTeacher, putInfoTeacher } from '@/services/userService'

// State variables
const error = ref('')
const loading = ref(false)
const editStatus = ref(true) // true = view mode, false = edit mode
const originalData = ref({}) // Store original data for cancel operation

// Form data
const formData = ref({
  name: '',
  department: '',
  position: '',
})

// Fetch teacher information on component mount
onMounted(async () => {
  try {
    await fetchTeacherInfo()
  } catch (err) {
    error.value = 'Không thể tải thông tin giảng viên. Vui lòng thử lại sau.'
    toast.error('Không thể tải thông tin giảng viên')
  }
})

// Toggle between view and edit mode
const toggleEditMode = () => {
  editStatus.value = false
  // Store original data to revert if canceled
  originalData.value = { ...formData.value }
}

// Cancel edit and revert to original data
const cancelEdit = () => {
  formData.value = { ...originalData.value }
  editStatus.value = true
  error.value = ''
}

// Complete teacher data including non-editable fields
const teacherData = ref({
  id: 0,
  authUserId: 0,
  name: '',
  department: '',
  position: '',
  imagePath: '',
  email: '',
  phone: '',
})

// Fetch teacher information from API
const fetchTeacherInfo = async () => {
  loading.value = true
  try {
    const response = await getInfoTeacher()
    if (response && response.data) {
      teacherData.value = response.data

      // Only store editable fields in formData
      formData.value = {
        name: response.data.name,
        department: response.data.department,
        position: response.data.position,
      }

      // Store original data for cancel operation
      originalData.value = { ...formData.value }
    }
  } catch (err) {
    console.error('Error fetching teacher info:', err)
    error.value = 'Không thể tải thông tin giảng viên'
    throw err
  } finally {
    loading.value = false
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (loading.value) return

  error.value = ''

  // Basic validation
  if (!formData.value.name) {
    error.value = 'Vui lòng nhập họ và tên'
    return
  }

  // Check if any data has changed
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(originalData.value)

  if (!hasChanges) {
    toast.info('Không có thay đổi nào được thực hiện')
    editStatus.value = true // Return to view mode without API call
    return
  }

  // Prepare payload for API
  const payload = {
    name: formData.value.name,
    department: formData.value.department,
    position: formData.value.position,
  }

  loading.value = true
  try {
    const response = await putInfoTeacher(payload)
    if (response && response.data) {
      // Update teacherData with the complete response
      teacherData.value = response.data

      // Update formData with editable fields
      formData.value = {
        name: response.data.name,
        department: response.data.department,
        position: response.data.position,
      }

      // Store updated data for cancel operation
      originalData.value = { ...formData.value }

      toast.success('Cập nhật thông tin thành công')
      editStatus.value = true // Return to view mode
    }
  } catch (err) {
    console.error('Error updating teacher info:', err)
    error.value = 'Không thể cập nhật thông tin giảng viên'
    toast.error('Cập nhật thông tin không thành công')
  } finally {
    loading.value = false
  }
}

// Handle avatar upload (placeholder for future implementation)
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Here you would implement the avatar upload logic
    // This would typically involve creating a FormData object and sending to an API
    toast.info('Tính năng tải ảnh đại diện chưa được triển khai')
  }
}
</script>

<style>
.container {
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

.input-box:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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

.login-button-1 {
  width: 100%;
  height: 40px;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
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
