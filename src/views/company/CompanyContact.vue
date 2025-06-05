<template>
  <div class="company-contact-container">
    <!-- Header Section -->
    <div class="header-section">
      <h2 class="page-title">Quản lý liên hệ công ty</h2>
      <button @click="showAddModal = true" class="add-button">
        <span class="add-icon">+</span>
        Thêm liên hệ mới
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
      <p>Đang tải danh sách liên hệ...</p>
    </div>

    <!-- Contacts List -->
    <div v-else class="contacts-grid">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="contact-card"
        @click="viewContactDetail(contact)"
      >
        <div class="contact-header">
          <img
            :src="getAvatarUrl(contact.imagePath)"
            :alt="contact.name"
            class="contact-avatar"
            @error="handleImageError"
          />
          <div class="contact-info">
            <h3 class="contact-name">{{ contact.name }}</h3>
            <p class="contact-position">{{ contact.position }}</p>
            <span class="contact-status" :class="{ active: contact.isActive }">
              {{ contact.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
        </div>

        <div class="contact-details">
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ contact.email }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Điện thoại:</span>
            <span class="detail-value">{{ contact.phone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Ngày tạo:</span>
            <span class="detail-value">{{ formatDate(contact.createdAt) }}</span>
          </div>
        </div>

        <div class="contact-actions" @click.stop>
          <button @click="editContact(contact)" class="action-btn edit-btn">
            <span class="btn-icon">✏️</span>
            Sửa
          </button>
          <button @click="deleteContact(contact)" class="action-btn delete-btn">
            <span class="btn-icon">🗑️</span>
            Xóa
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="contacts.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>Chưa có liên hệ nào</h3>
        <p>Bắt đầu bằng cách thêm liên hệ đầu tiên cho công ty của bạn</p>
        <button @click="showAddModal = true" class="add-button primary">
          Thêm liên hệ đầu tiên
        </button>
      </div>
    </div>

    <!-- Add/Edit Contact Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm liên hệ mới' : 'Chỉnh sửa liên hệ' }}</h3>
          <button @click="closeModals" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div v-if="modalError" class="alert alert-danger">
            {{ modalError }}
          </div>

          <form @submit.prevent="showAddModal ? addContact() : updateContact()">
            <div class="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                v-model="contactForm.name"
                class="form-control"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div class="form-group">
              <label>Vị trí</label>
              <input
                type="text"
                v-model="contactForm.position"
                class="form-control"
                placeholder="Nhập vị trí công việc"
              />
            </div>

            <div v-if="showAddModal">
              <div class="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  v-model="contactForm.email"
                  class="form-control"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  v-model="contactForm.phone"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div class="form-group">
                <label>Mật khẩu *</label>
                <div class="password-input">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="contactForm.password"
                    class="form-control"
                    placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                    minlength="8"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  v-model="contactForm.email"
                  class="form-control"
                  placeholder="Nhập địa chỉ email mới"
                />
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  v-model="contactForm.phone"
                  class="form-control"
                  placeholder="Nhập số điện thoại mới"
                />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModals" class="btn btn-secondary">Hủy</button>
              <button type="submit" :disabled="modalLoading" class="btn btn-primary">
                <span v-if="modalLoading" class="spinner-border spinner-border-sm mr-2"></span>
                {{ showAddModal ? 'Thêm liên hệ' : 'Cập nhật' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button @click="closeModals" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">⚠️</div>
            <p>
              Bạn có chắc chắn muốn xóa liên hệ
              <strong>{{ contactToDelete?.name }}</strong
              >?
            </p>
            <p class="warning-text">Hành động này không thể hoàn tác.</p>
          </div>

          <div class="modal-actions">
            <button @click="closeModals" class="btn btn-secondary">Hủy</button>
            <button @click="confirmDelete" :disabled="modalLoading" class="btn btn-danger">
              <span v-if="modalLoading" class="spinner-border spinner-border-sm mr-2"></span>
              Xóa liên hệ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import {
  getCompanyContacts,
  getCompanyContactById,
  createCompanyContact,
  updateCompanyContact,
  deleteCompanyContact,
} from '@/services/companyContactService'

// State management
const loading = ref(false)
const modalLoading = ref(false)
const error = ref('')
const modalError = ref('')

// Data
const contacts = ref([])
const selectedContact = ref(null)
const contactToDelete = ref(null)

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)

// Form data
const contactForm = ref({
  name: '',
  position: '',
  email: '',
  phone: '',
  password: '',
})

// UI state
const showPassword = ref(false)

// Load contacts on component mount
onMounted(async () => {
  await fetchContacts()
})

// Fetch all company contacts
const fetchContacts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await getCompanyContacts()
    if (response && response.data) {
      contacts.value = response.data
    }
  } catch (err) {
    console.error('Error fetching contacts:', err)
    error.value = 'Không thể tải danh sách liên hệ. Vui lòng thử lại.'
    toast.error('Không thể tải danh sách liên hệ')
  } finally {
    loading.value = false
  }
}

// View contact detail
const viewContactDetail = async (contact) => {
  try {
    const response = await getCompanyContactById(contact.id)
    if (response && response.data) {
      selectedContact.value = response.data
      showDetailModal.value = true
    }
  } catch (err) {
    console.error('Error fetching contact detail:', err)
    toast.error('Không thể tải chi tiết liên hệ')
  }
}

// Edit contact
const editContact = (contact) => {
  selectedContact.value = contact
  contactForm.value = {
    name: contact.name,
    position: contact.position,
    email: contact.email,
    phone: contact.phone,
    password: '',
  }
  showEditModal.value = true
}

// Delete contact
const deleteContact = (contact) => {
  contactToDelete.value = contact
  showDeleteModal.value = true
}

// Add new contact
const addContact = async () => {
  modalLoading.value = true
  modalError.value = ''

  try {
    // Validate form
    if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.password) {
      modalError.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
      return
    }

    if (contactForm.value.password.length < 8) {
      modalError.value = 'Mật khẩu phải có ít nhất 8 ký tự'
      return
    }

    const payload = {
      name: contactForm.value.name,
      position: contactForm.value.position,
      email: contactForm.value.email,
      phone: contactForm.value.phone,
      password: contactForm.value.password,
    }

    const response = await createCompanyContact(payload)
    if (response && response.data) {
      toast.success('Thêm liên hệ thành công')
      closeModals()
      await fetchContacts() // Refresh the list
    }
  } catch (err) {
    console.error('Error adding contact:', err)
    modalError.value = 'Không thể thêm liên hệ. Vui lòng kiểm tra lại thông tin.'
    toast.error('Thêm liên hệ không thành công')
  } finally {
    modalLoading.value = false
  }
}

// Update contact
const updateContact = async () => {
  modalLoading.value = true
  modalError.value = ''

  try {
    if (!contactForm.value.name) {
      modalError.value = 'Vui lòng nhập họ và tên'
      return
    }

    const payload = {
      name: contactForm.value.name,
      position: contactForm.value.position,
      email: contactForm.value.email,
      phone: contactForm.value.phone,
    }

    const response = await updateCompanyContact(selectedContact.value.id, payload)
    if (response && response.data) {
      toast.success('Cập nhật liên hệ thành công')
      closeModals()
      await fetchContacts() // Refresh the list
    }
  } catch (err) {
    console.error('Error updating contact:', err)
    modalError.value = 'Không thể cập nhật liên hệ. Vui lòng thử lại.'
    toast.error('Cập nhật liên hệ không thành công')
  } finally {
    modalLoading.value = false
  }
}

// Confirm delete
const confirmDelete = async () => {
  modalLoading.value = true

  try {
    await deleteCompanyContact(contactToDelete.value.id)
    toast.success('Xóa liên hệ thành công')
    closeModals()
    await fetchContacts() // Refresh the list
  } catch (err) {
    console.error('Error deleting contact:', err)
    toast.error('Không thể xóa liên hệ')
  } finally {
    modalLoading.value = false
  }
}

// Close all modals
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  showDeleteModal.value = false
  selectedContact.value = null
  contactToDelete.value = null
  modalError.value = ''
  contactForm.value = {
    name: '',
    position: '',
    email: '',
    phone: '',
    password: '',
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getAvatarUrl = (imagePath) => {
  if (!imagePath) return '/images/user/default_avatar.svg'
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:8002${imagePath}`
  }
  return imagePath
}

const handleImageError = (event) => {
  event.target.src = '/images/user/default_avatar.svg'
}
</script>

<style scoped>
.company-contact-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.page-title {
  color: #c02135;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.add-button {
  background-color: #c02135;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.add-button:hover {
  background-color: #a61b2d;
  transform: translateY(-2px);
}

.add-button.primary {
  background-color: #007bff;
  margin-top: 20px;
}

.add-button.primary:hover {
  background-color: #0056b3;
}

.add-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.contact-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #c02135;
}

.contact-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.contact-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
  border: 3px solid #f0f0f0;
}

.contact-info {
  flex: 1;
}

.contact-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.contact-position {
  margin: 4px 0;
  color: #666;
  font-style: italic;
}

.contact-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: #dc3545;
  color: white;
}

.contact-status.active {
  background-color: #28a745;
}

.contact-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: bold;
  color: #666;
  min-width: 80px;
}

.detail-value {
  color: #333;
  word-break: break-word;
}

.contact-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 10px;
}

.empty-state p {
  color: #999;
  margin-bottom: 20px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 700px;
}

.modal-content.small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #c02135;
  box-shadow: 0 0 0 2px rgba(192, 33, 53, 0.2);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #c02135;
  color: white;
}

.btn-primary:hover {
  background-color: #a61b2d;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Detail Modal Styles */
.detail-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-avatar {
  margin-right: 20px;
}

.large-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.detail-info h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.detail-info .position {
  color: #666;
  font-style: italic;
  margin: 0 0 8px 0;
}

.detail-info .status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: bold;
  background-color: #dc3545;
  color: white;
}

.detail-info .status.active {
  background-color: #28a745;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.detail-card h4 {
  margin: 0 0 16px 0;
  color: #c02135;
  font-size: 1.1rem;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item .label {
  font-weight: bold;
  color: #666;
  min-width: 100px;
}

.info-item .value {
  color: #333;
  word-break: break-word;
}

/* Delete Modal Styles */
.delete-warning {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.delete-warning p {
  margin-bottom: 12px;
  color: #333;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .page-title {
    text-align: center;
    font-size: 1.5rem;
  }

  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .detail-section {
    flex-direction: column;
    text-align: center;
  }

  .detail-avatar {
    margin: 0 0 16px 0;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .contact-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .company-contact-container {
    padding: 10px;
  }

  .contact-card {
    padding: 16px;
  }

  .contact-header {
    flex-direction: column;
    text-align: center;
  }

  .contact-avatar {
    margin: 0 0 12px 0;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-card {
  animation: fadeIn 0.3s ease forwards;
}

.modal-content {
  animation: fadeIn 0.3s ease forwards;
}

/* Loading spinner */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.125em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.125em;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.mr-2 {
  margin-right: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
