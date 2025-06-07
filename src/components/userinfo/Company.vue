<template>
  <div class="container">
    <div v-if="error" class="text-error">
      {{ error }}
    </div>

    <div class="profile-image-container">
      <img
        :src="getCompanyLogoUrl(companyData.logoPath)"
        class="profile-image"
        @error="handleImageError"
      />
      <div class="edit-badge" :class="{ uploading: uploadingAvatar }">
        <img v-if="!uploadingAvatar" src="/images/user/edit_profile.svg" class="icon-placeholder" />
        <div v-else class="spinner-border spinner-border-sm text-white"></div>
        <input
          type="file"
          @change="handleLogoUpload"
          ref="fileInput"
          accept="image/*"
          :disabled="uploadingAvatar"
        />
      </div>
    </div>

    <!-- Company Status -->
    <div class="company-status-container">
      <div class="status-badge" :class="getStatusClass()">
        <span class="status-icon">{{ getStatusIcon() }}</span>
        <span class="status-text">{{ getStatusText() }}</span>
      </div>
      <div v-if="companyData.isLinked" class="linked-badge">
        <span class="linked-icon">🔗</span>
        <span>Đã liên kết</span>
      </div>
    </div>

    <form class="profile-form row" @submit.prevent="handleSubmit">
      <div class="col-md-12"><strong>Thông tin cơ bản</strong></div>

      <div class="col-md-6">
        <div>
          <p>Tên công ty (*)</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.name"
              placeholder="Tên công ty"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Tên viết tắt</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.shortName"
              placeholder="Tên viết tắt"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Mã số thuế (*)</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.taxCode"
              placeholder="Mã số thuế"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Website</p>
          <div class="input-group">
            <input
              type="url"
              v-model="formData.website"
              placeholder="https://example.com"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div>
          <p>Loại công ty</p>
          <div class="input-group">
            <input
              type="text"
              :value="formData.isForeignCompany ? 'Công ty nước ngoài' : 'Công ty trong nước'"
              placeholder="Loại công ty"
              class="input-box"
              readonly
            />
          </div>
        </div>
      </div>

      <div class="col-md-12"><strong>Thông tin chi tiết</strong></div>

      <div class="col-md-6">
        <div>
          <p>Lĩnh vực kinh doanh</p>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.businessType"
              placeholder="Lĩnh vực kinh doanh"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Năm thành lập</p>
          <div class="input-group">
            <input
              type="number"
              v-model="formData.foundingYear"
              placeholder="2020"
              min="1900"
              :max="currentYear"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Số lượng nhân viên</p>
          <div class="input-group">
            <input
              type="number"
              v-model="formData.employeeCount"
              placeholder="Số lượng nhân viên"
              min="1"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <p>Vốn điều lệ (VND)</p>
          <div class="input-group">
            <input
              type="text"
              :value="formatCurrency(formData.capital)"
              @input="handleCapitalInput"
              placeholder="Vốn điều lệ"
              class="input-box"
              :disabled="editStatus"
            />
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div>
          <p>Địa chỉ</p>
          <div class="input-group">
            <textarea
              v-model="formData.address"
              placeholder="Địa chỉ công ty"
              class="input-box textarea"
              rows="3"
              :disabled="editStatus"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div>
          <p>Mô tả công ty</p>
          <div class="input-group">
            <textarea
              v-model="formData.description"
              placeholder="Mô tả về công ty, lĩnh vực hoạt động..."
              class="input-box textarea"
              rows="5"
              :disabled="editStatus"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="col-md-12">
        <div
          v-if="editStatus"
          class="col-6 mx-auto d-flex justify-content-center align-items-center"
        >
          <button type="button" @click="toggleEditMode" class="login-button">Chỉnh sửa</button>
        </div>

        <div
          v-if="!editStatus"
          class="col-6 mx-auto d-flex justify-content-center align-items-center gap-2"
        >
          <button
            type="button"
            @click="cancelEdit"
            class="login-button btn-secondary"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>Hủy
          </button>
          <button type="submit" class="login-button btn-danger" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>Lưu
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { getInfoMyCompany, putInfoMyCompany, uploadLogo } from '@/services/userService'

// State variables
const error = ref('')
const loading = ref(false)
const editStatus = ref(true) // true = view mode, false = edit mode
const originalData = ref({}) // Store original data for cancel operation
const fileInput = ref(null)
const uploadingAvatar = ref(false)

// Current year for validation
const currentYear = computed(() => new Date().getFullYear())

// Form data - contains all editable fields
const formData = ref({
  name: '',
  shortName: '',
  isForeignCompany: false,
  taxCode: '',
  website: '',
  address: '',
  businessType: '',
  description: '',
  foundingYear: null,
  employeeCount: null,
  capital: null,
})

// Complete company data including non-editable fields
const companyData = ref({
  id: 0,
  name: '',
  shortName: '',
  isForeignCompany: false,
  taxCode: '',
  website: '',
  address: '',
  businessType: '',
  description: '',
  foundingYear: null,
  employeeCount: null,
  capital: null,
  logoPath: '',
  isVerified: false,
  verificationDate: null,
  isLinked: false,
  createdAt: '',
  updatedAt: '',
})

// Fetch company information on component mount
onMounted(async () => {
  try {
    await fetchCompanyInfo()
  } catch (err) {
    error.value = 'Không thể tải thông tin công ty. Vui lòng thử lại sau.'
    toast.error('Không thể tải thông tin công ty')
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

// Fetch company information from API
const fetchCompanyInfo = async () => {
  loading.value = true
  try {
    const response = await getInfoMyCompany()
    if (response && response.data) {
      companyData.value = response.data

      // Map all editable fields to formData
      formData.value = {
        name: response.data.name || '',
        shortName: response.data.shortName || '',
        isForeignCompany: response.data.isForeignCompany || false,
        taxCode: response.data.taxCode || '',
        website: response.data.website || '',
        address: response.data.address || '',
        businessType: response.data.businessType || '',
        description: response.data.description || '',
        foundingYear: response.data.foundingYear || null,
        employeeCount: response.data.employeeCount || null,
        capital: response.data.capital || null,
      }

      // Store original data for cancel operation
      originalData.value = { ...formData.value }
    }
  } catch (err) {
    console.error('Error fetching company info:', err)
    error.value = 'Không thể tải thông tin công ty'
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
  if (!formData.value.name.trim()) {
    error.value = 'Vui lòng nhập tên công ty'
    return
  }

  if (!formData.value.taxCode.trim()) {
    error.value = 'Vui lòng nhập mã số thuế'
    return
  }

  // Validate website URL if provided
  if (formData.value.website && !isValidUrl(formData.value.website)) {
    error.value = 'Vui lòng nhập URL website hợp lệ'
    return
  }

  // Validate founded year if provided
  if (
    formData.value.foundingYear &&
    (formData.value.foundingYear < 1900 || formData.value.foundingYear > currentYear.value)
  ) {
    error.value = `Năm thành lập phải từ 1900 đến ${currentYear.value}`
    return
  }

  // Validate employee count if provided
  if (formData.value.employeeCount && formData.value.employeeCount < 1) {
    error.value = 'Số lượng nhân viên phải lớn hơn 0'
    return
  }

  // Validate capital if provided
  if (formData.value.capital && formData.value.capital < 0) {
    error.value = 'Vốn điều lệ phải lớn hơn hoặc bằng 0'
    return
  }

  // Check if any data has changed
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(originalData.value)

  if (!hasChanges) {
    toast.info('Không có thay đổi nào được thực hiện')
    editStatus.value = true // Return to view mode without API call
    return
  }

  // Prepare payload for API - clean up empty strings and match API structure
  const payload = {
    name: formData.value.name.trim(),
    shortName: formData.value.shortName?.trim() || '',
    // isForeignCompany is read-only, don't include in payload
    taxCode: formData.value.taxCode?.trim() || '',
    website: formData.value.website?.trim() || '',
    address: formData.value.address?.trim() || '',
    businessType: formData.value.businessType?.trim() || '',
    description: formData.value.description?.trim() || '',
    foundingYear: formData.value.foundingYear || null,
    employeeCount: formData.value.employeeCount || null,
    capital: formData.value.capital || null,
  }

  loading.value = true
  try {
    const response = await putInfoMyCompany(payload)
    if (response && response.data) {
      // Update companyData with the complete response
      companyData.value = response.data

      // Update formData with response data
      formData.value = {
        name: response.data.name || '',
        shortName: response.data.shortName || '',
        isForeignCompany: response.data.isForeignCompany || false,
        taxCode: response.data.taxCode || '',
        website: response.data.website || '',
        address: response.data.address || '',
        businessType: response.data.businessType || '',
        description: response.data.description || '',
        foundingYear: response.data.foundingYear || null,
        employeeCount: response.data.employeeCount || null,
        capital: response.data.capital || null,
      }

      // Store updated data for cancel operation
      originalData.value = { ...formData.value }

      toast.success('Cập nhật thông tin công ty thành công')
      editStatus.value = true // Return to view mode
    }
  } catch (err) {
    console.error('Error updating company info:', err)
    error.value = 'Không thể cập nhật thông tin công ty'
    toast.error('Cập nhật thông tin không thành công')
  } finally {
    loading.value = false
  }
}

// Handle logo upload
const handleLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Vui lòng chọn file ảnh hợp lệ')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Kích thước file không được vượt quá 5MB')
    return
  }

  uploadingAvatar.value = true

  try {
    const response = await uploadLogo(file) // Thay đổi từ uploadAvatar thành uploadLogo
    if (response && response.data) {
      companyData.value.logoPath = response.data
      toast.success('Cập nhật logo công ty thành công')
    }
  } catch (err) {
    console.error('Error uploading logo:', err)
    toast.error('Không thể cập nhật logo công ty')
  } finally {
    uploadingAvatar.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Utility functions
const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) return '/images/company/default_logo.svg'
  if (logoPath.startsWith('/uploads/')) {
    return `http://localhost:8002${logoPath}`
  }
  return logoPath
}

const handleImageError = (event) => {
  event.target.src = '/images/company/default_logo.svg'
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const formatCurrency = (value) => {
  if (!value) return ''
  return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ'
}

const handleCapitalInput = (event) => {
  if (editStatus.value) return

  // Remove all non-digit characters
  const numericValue = event.target.value.replace(/[^\d]/g, '')
  formData.value.capital = numericValue ? parseInt(numericValue) : null

  // Update the display value
  event.target.value = numericValue ? formatCurrency(parseInt(numericValue)) : ''
}

// Status helper functions
const getStatusClass = () => {
  if (companyData.value.isVerified) return 'status-verified'
  return 'status-pending'
}

const getStatusIcon = () => {
  if (companyData.value.isVerified) return '✓'
  return '⏳'
}

const getStatusText = () => {
  if (companyData.value.isVerified) return 'Đã xác thực'
  return 'Chờ xác thực'
}
</script>

<style scoped>
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
  padding: 0 12px;
  font-size: 0.95rem;
  outline: none;
  border-radius: 10px;
}

.input-box.textarea {
  height: auto;
  resize: vertical;
  padding: 12px;
  font-family: inherit;
}

.input-box:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.input-box:disabled,
.input-box[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover:not(:disabled) {
  background-color: #a61b2d;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
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
  width: 107px;
  height: 107px;
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
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-badge.uploading {
  background-color: #6c757d;
  cursor: not-allowed;
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

.edit-badge.uploading input[type='file'] {
  cursor: not-allowed;
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

.company-status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-verified {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.linked-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  background-color: #e7f3ff;
  color: #0066cc;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-icon,
.linked-icon {
  font-size: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  margin: 0;
}

.checkbox-label input[type='checkbox'] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label input[type='checkbox']:disabled {
  cursor: not-allowed;
}

.checkmark {
  margin-left: 4px;
}

.gap-2 {
  gap: 0.5rem;
}

.me-2 {
  margin-right: 0.5rem;
}
</style>
