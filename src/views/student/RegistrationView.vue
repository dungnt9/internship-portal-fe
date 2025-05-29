<template>
  <div class="container mt-4">
    <!-- Tiêu đề và mô tả -->
    <div class="mb-4">
      <h2 class="text-center">Đăng ký thực tập</h2>
      <p class="text-center text-muted">
        Đăng ký thực tập cho các vị trí trong danh sách công ty đối tác của trường
      </p>
    </div>

    <!-- Hiển thị thông báo lỗi -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Hiển thị thông báo hướng dẫn -->
    <div class="alert alert-info mb-4" role="alert">
      <h5 class="alert-heading"><i class="bi bi-info-circle-fill me-2"></i>Hướng dẫn đăng ký</h5>
      <p>Bạn cần thực hiện theo các bước sau để hoàn tất đăng ký thực tập:</p>
      <ol>
        <li><strong>Tải lên CV:</strong> Tải lên CV của bạn để tạo đơn đăng ký</li>
        <li>
          <strong>Chọn 3 nguyện vọng:</strong> Chọn đúng 3 vị trí thực tập theo thứ tự ưu tiên
          (nguyện vọng 1, 2, 3)
        </li>
        <li><strong>Xác nhận đăng ký:</strong> Ấn nút đăng ký để hoàn tất quy trình</li>
      </ol>
      <p class="mb-0">
        <strong>Lưu ý:</strong> Bạn cần tải lên CV trước khi đăng ký nguyện vọng. Sau khi đăng ký,
        bạn sẽ không thể thay đổi các nguyện vọng.
      </p>
    </div>

    <!-- Phần 1: Tải lên CV -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Bước 1: Tải lên CV</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleUploadCV" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="periodSelect" class="form-label"
              >Kỳ thực tập <span class="text-danger">*</span></label
            >
            <select
              id="periodSelect"
              v-model="formData.periodId"
              class="form-select"
              :disabled="loading || hasCvUploaded"
              required
            >
              <option value="" disabled selected>-- Chọn kỳ thực tập --</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.id }} ({{ formatDateRange(period.startDate, period.endDate) }})
              </option>
            </select>
            <small class="form-text text-muted">Chọn kỳ thực tập bạn muốn đăng ký</small>
          </div>

          <div class="mb-3">
            <label for="cvFile" class="form-label">
              CV của bạn <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              id="cvFile"
              ref="fileInput"
              class="form-control"
              @change="handleFileChange"
              :disabled="loading || hasCvUploaded"
              required
            />
            <small class="form-text text-muted">
              Tải lên CV của bạn (định dạng PDF, DOC, DOCX, tối đa 5MB)
            </small>
          </div>

          <div v-if="selectedFile" class="mb-3">
            <div class="d-flex align-items-center">
              <i class="bi bi-file-earmark-text me-2"></i>
              <span>{{ selectedFile.name }}</span>
              <button
                v-if="!hasCvUploaded"
                type="button"
                class="btn btn-sm text-danger ms-2"
                @click="removeSelectedFile"
                :disabled="loading"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>

          <div class="d-grid mt-4">
            <button
              v-if="!hasCvUploaded"
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !isStep1Valid"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-upload me-1"></i>
              Tải lên CV
            </button>
            <div v-else class="alert alert-success mb-0">
              <i class="bi bi-check-circle-fill me-2"></i>
              CV đã được tải lên thành công! Vui lòng tiếp tục bước 2.
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Phần 2: Chọn nguyện vọng -->
    <div class="card mb-4" :class="{ 'border-primary': hasCvUploaded && !hasRegistered }">
      <div
        class="card-header"
        :class="{
          'bg-primary text-white': hasCvUploaded && !hasRegistered,
          'bg-secondary text-white': !hasCvUploaded || hasRegistered,
        }"
      >
        <h5 class="mb-0">Bước 2: Chọn 3 nguyện vọng thực tập</h5>
      </div>
      <div class="card-body">
        <div v-if="!hasCvUploaded" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Vui lòng tải lên CV ở bước 1 trước khi tiếp tục
        </div>

        <div v-else-if="hasRegistered" class="alert alert-success">
          <i class="bi bi-check-circle-fill me-2"></i>
          Bạn đã đăng ký nguyện vọng thực tập thành công!
        </div>

        <div v-else>
          <div v-if="loadingPositions" class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải danh sách vị trí thực tập...</p>
          </div>

          <div v-else>
            <form @submit.prevent="handleRegisterPreferences">
              <!-- Nguyện vọng 1 -->
              <div class="mb-4">
                <label class="form-label fw-bold">
                  Nguyện vọng 1 <span class="text-danger">*</span>
                </label>
                <div class="card">
                  <div class="card-body bg-light">
                    <!-- Chọn công ty trước -->
                    <div class="mb-3">
                      <label class="form-label">Chọn công ty:</label>
                      <select
                        v-model="preferences[0].companyId"
                        class="form-select"
                        required
                        :disabled="positionLoading"
                        @change="handleCompanyChange(0)"
                      >
                        <option value="" disabled selected>-- Chọn công ty --</option>
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                          {{ company.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Sau đó chọn vị trí -->
                    <div class="mb-3">
                      <label class="form-label">Chọn vị trí thực tập:</label>
                      <select
                        v-model="preferences[0].positionId"
                        class="form-select"
                        required
                        :disabled="positionLoading || !preferences[0].companyId"
                      >
                        <option value="" disabled selected>
                          {{ getPositionPlaceholder(0) }}
                        </option>
                        <option
                          v-for="position in companyPositions[0]"
                          :key="position.id"
                          :value="position.id"
                          :disabled="isPositionSelected(position.id, 0)"
                        >
                          {{ position.title }}
                        </option>
                      </select>
                      <div v-if="loadingCompanyPositions[0]" class="text-center mt-2">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                          <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <small class="ms-2">Đang tải danh sách vị trí...</small>
                      </div>
                    </div>

                    <div
                      v-if="preferences[0].positionId"
                      class="position-details p-3 border rounded mb-3"
                    >
                      <div v-if="getSelectedPosition(0)">
                        <h6>
                          {{ getSelectedPosition(0).title }}
                          <span class="badge bg-primary ms-2">Nguyện vọng 1</span>
                        </h6>
                        <p class="mb-1">
                          <strong>Công ty:</strong>
                          {{ getCompanyName(preferences[0].companyId) }}
                        </p>
                        <p class="mb-1">
                          <strong>Mô tả:</strong>
                          {{ getSelectedPosition(0).description }}
                        </p>
                        <p class="mb-0">
                          <strong>Yêu cầu:</strong>
                          {{ getSelectedPosition(0).requirements }}
                        </p>
                      </div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label">Ghi chú:</label>
                      <textarea
                        v-model="preferences[0].note"
                        class="form-control"
                        rows="2"
                        placeholder="Nhập ghi chú cho nguyện vọng 1 (không bắt buộc)"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nguyện vọng 2 -->
              <div class="mb-4">
                <label class="form-label fw-bold">
                  Nguyện vọng 2 <span class="text-danger">*</span>
                </label>
                <div class="card">
                  <div class="card-body bg-light">
                    <!-- Chọn công ty trước -->
                    <div class="mb-3">
                      <label class="form-label">Chọn công ty:</label>
                      <select
                        v-model="preferences[1].companyId"
                        class="form-select"
                        required
                        :disabled="positionLoading"
                        @change="handleCompanyChange(1)"
                      >
                        <option value="" disabled selected>-- Chọn công ty --</option>
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                          {{ company.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Sau đó chọn vị trí -->
                    <div class="mb-3">
                      <label class="form-label">Chọn vị trí thực tập:</label>
                      <select
                        v-model="preferences[1].positionId"
                        class="form-select"
                        required
                        :disabled="positionLoading || !preferences[1].companyId"
                      >
                        <option value="" disabled selected>
                          {{ getPositionPlaceholder(1) }}
                        </option>
                        <option
                          v-for="position in companyPositions[1]"
                          :key="position.id"
                          :value="position.id"
                          :disabled="isPositionSelected(position.id, 1)"
                        >
                          {{ position.title }}
                        </option>
                      </select>
                      <div v-if="loadingCompanyPositions[1]" class="text-center mt-2">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                          <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <small class="ms-2">Đang tải danh sách vị trí...</small>
                      </div>
                    </div>

                    <div
                      v-if="preferences[1].positionId"
                      class="position-details p-3 border rounded mb-3"
                    >
                      <div v-if="getSelectedPosition(1)">
                        <h6>
                          {{ getSelectedPosition(1).title }}
                          <span class="badge bg-info ms-2">Nguyện vọng 2</span>
                        </h6>
                        <p class="mb-1">
                          <strong>Công ty:</strong>
                          {{ getCompanyName(preferences[1].companyId) }}
                        </p>
                        <p class="mb-1">
                          <strong>Mô tả:</strong>
                          {{ getSelectedPosition(1).description }}
                        </p>
                        <p class="mb-0">
                          <strong>Yêu cầu:</strong>
                          {{ getSelectedPosition(1).requirements }}
                        </p>
                      </div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label">Ghi chú:</label>
                      <textarea
                        v-model="preferences[1].note"
                        class="form-control"
                        rows="2"
                        placeholder="Nhập ghi chú cho nguyện vọng 2 (không bắt buộc)"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nguyện vọng 3 -->
              <div class="mb-4">
                <label class="form-label fw-bold">
                  Nguyện vọng 3 <span class="text-danger">*</span>
                </label>
                <div class="card">
                  <div class="card-body bg-light">
                    <!-- Chọn công ty trước -->
                    <div class="mb-3">
                      <label class="form-label">Chọn công ty:</label>
                      <select
                        v-model="preferences[2].companyId"
                        class="form-select"
                        required
                        :disabled="positionLoading"
                        @change="handleCompanyChange(2)"
                      >
                        <option value="" disabled selected>-- Chọn công ty --</option>
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                          {{ company.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Sau đó chọn vị trí -->
                    <div class="mb-3">
                      <label class="form-label">Chọn vị trí thực tập:</label>
                      <select
                        v-model="preferences[2].positionId"
                        class="form-select"
                        required
                        :disabled="positionLoading || !preferences[2].companyId"
                      >
                        <option value="" disabled selected>
                          {{ getPositionPlaceholder(2) }}
                        </option>
                        <option
                          v-for="position in companyPositions[2]"
                          :key="position.id"
                          :value="position.id"
                          :disabled="isPositionSelected(position.id, 2)"
                        >
                          {{ position.title }}
                        </option>
                      </select>
                      <div v-if="loadingCompanyPositions[2]" class="text-center mt-2">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                          <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <small class="ms-2">Đang tải danh sách vị trí...</small>
                      </div>
                    </div>

                    <div
                      v-if="preferences[2].positionId"
                      class="position-details p-3 border rounded mb-3"
                    >
                      <div v-if="getSelectedPosition(2)">
                        <h6>
                          {{ getSelectedPosition(2).title }}
                          <span class="badge bg-secondary ms-2">Nguyện vọng 3</span>
                        </h6>
                        <p class="mb-1">
                          <strong>Công ty:</strong>
                          {{ getCompanyName(preferences[2].companyId) }}
                        </p>
                        <p class="mb-1">
                          <strong>Mô tả:</strong>
                          {{ getSelectedPosition(2).description }}
                        </p>
                        <p class="mb-0">
                          <strong>Yêu cầu:</strong>
                          {{ getSelectedPosition(2).requirements }}
                        </p>
                      </div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label">Ghi chú:</label>
                      <textarea
                        v-model="preferences[2].note"
                        class="form-control"
                        rows="2"
                        placeholder="Nhập ghi chú cho nguyện vọng 3 (không bắt buộc)"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-grid mt-4">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="positionLoading || !arePreferencesValid"
                >
                  <span v-if="positionLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  Xác nhận đăng ký nguyện vọng
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần 3: Thông tin đăng ký của tôi -->
    <div class="card">
      <div
        class="card-header bg-secondary text-white d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Thông tin đăng ký của tôi</h5>
        <button
          class="btn btn-sm btn-light"
          @click="fetchMyApplications"
          :disabled="loadingApplications"
        >
          <i class="bi bi-arrow-clockwise me-1"></i>
          <span v-if="!loadingApplications">Làm mới</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
      <div class="card-body">
        <div v-if="loadingApplications" class="text-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải thông tin đăng ký...</p>
        </div>

        <div v-else-if="applications.length === 0" class="text-center py-4">
          <i class="bi bi-folder text-muted" style="font-size: 3rem"></i>
          <p class="mt-3">Bạn chưa có đơn đăng ký thực tập nào</p>
        </div>

        <div v-else>
          <div v-for="application in applications" :key="application.id" class="mb-4">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-light">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Đơn đăng ký kỳ {{ application.periodId }}</h5>
                  <span class="text-muted">Ngày tạo: {{ formatDate(application.createdAt) }}</span>
                </div>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <strong>CV của bạn:</strong>
                  <a href="#" class="ms-2" @click.prevent="downloadFile(application)">
                    <i class="bi bi-download me-1"></i>Tải xuống CV
                  </a>
                </div>

                <h6 class="mt-4 mb-3">Danh sách nguyện vọng:</h6>

                <div v-if="application.details && application.details.length > 0">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nguyện vọng</th>
                          <th>Vị trí</th>
                          <th>Công ty</th>
                          <th>Trạng thái</th>
                          <th>Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="detail in getSortedDetails(application.details)"
                          :key="detail.id"
                        >
                          <td>
                            <span
                              :class="{
                                badge: true,
                                'bg-primary': detail.preferenceOrder === 1,
                                'bg-info': detail.preferenceOrder === 2,
                                'bg-secondary': detail.preferenceOrder === 3,
                              }"
                            >
                              Nguyện vọng {{ detail.preferenceOrder }}
                            </span>
                          </td>
                          <td>{{ detail.positionTitle }}</td>
                          <td>{{ detail.companyName }}</td>
                          <td>
                            <span
                              :class="{
                                'badge rounded-pill': true,
                                'bg-warning': detail.status === 'PENDING',
                                'bg-success': detail.status === 'APPROVED',
                                'bg-danger': detail.status === 'REJECTED',
                                'bg-secondary': detail.status === 'CANCELLED',
                              }"
                            >
                              {{ getStatusText(detail.status) }}
                            </span>
                          </td>
                          <td>{{ detail.note || 'Không có' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-else class="alert alert-info">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  Bạn chưa đăng ký nguyện vọng cho đơn này
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { viewFile } from '@/services/fileService'
import {
  getCurrentPeriod,
  getPositionOfCompany,
  getMyApplications,
  uploadCV,
  registerPreferences,
  getUpcomingPeriod,
} from '@/services/registerService.js'
import { getAllCompany } from '@/services/userService.js'

// State variables
const error = ref('')
const loading = ref(false)
const positionLoading = ref(false)
const loadingApplications = ref(false)
const loadingPositions = ref(false)
const periods = ref([])
const positions = ref([])
const applications = ref([])
const selectedFile = ref(null)
const currentApplication = ref(null)
const hasCvUploaded = ref(false)
const hasRegistered = ref(false)
const companies = ref([])

// Trạng thái hiển thị loading cho từng nguyện vọng khi tải danh sách vị trí
const loadingCompanyPositions = ref([false, false, false])

// Lưu trữ các vị trí cho từng nguyện vọng theo công ty
const companyPositions = ref([[], [], []])

// Form data
const formData = ref({
  periodId: '',
})

// Preferences data - khởi tạo 3 nguyện vọng rỗng với thêm trường companyId
const preferences = ref([
  { positionId: '', preferenceOrder: 1, companyId: '', note: '' },
  { positionId: '', preferenceOrder: 2, companyId: '', note: '' },
  { positionId: '', preferenceOrder: 3, companyId: '', note: '' },
])

// Computed property để kiểm tra form CV hợp lệ
const isStep1Valid = computed(() => {
  return formData.value.periodId && selectedFile.value
})

// Computed property để kiểm tra tất cả các nguyện vọng có hợp lệ không
const arePreferencesValid = computed(() => {
  // Kiểm tra tất cả 3 nguyện vọng đã được chọn công ty và vị trí
  return (
    preferences.value[0].companyId &&
    preferences.value[0].positionId &&
    preferences.value[1].companyId &&
    preferences.value[1].positionId &&
    preferences.value[2].companyId &&
    preferences.value[2].positionId
  )
})

const downloadFile = (application) => {
  if (!application.cvFilePath) {
    toast.error('Không tìm thấy đường dẫn tải CV')
    return
  }

  try {
    // Open CV file in new tab for viewing
    const fileUrl = viewFile(application.cvFilePath)
    window.open(fileUrl, '_blank')
  } catch (err) {
    console.error('Lỗi khi xem CV:', err)
    toast.error('Không thể mở CV. Vui lòng thử lại sau.')
  }
}

// Hiển thị placeholder cho select vị trí dựa trên trạng thái
const getPositionPlaceholder = (index) => {
  if (!preferences.value[index].companyId) {
    return '-- Vui lòng chọn công ty trước --'
  }

  if (loadingCompanyPositions.value[index]) {
    return '-- Đang tải danh sách vị trí --'
  }

  return '-- Chọn vị trí thực tập --'
}

// Xử lý sự kiện khi người dùng chọn công ty
const handleCompanyChange = async (index) => {
  // Reset vị trí đã chọn
  preferences.value[index].positionId = ''

  // Đánh dấu đang tải vị trí
  loadingCompanyPositions.value[index] = true

  try {
    // Lấy danh sách vị trí của công ty đã chọn
    const companyId = preferences.value[index].companyId
    const response = await getPositionOfCompany(companyId)

    if (response && response.data) {
      // Lọc vị trí theo kỳ thực tập hiện tại
      const filteredPositions = response.data.filter(
        (position) => position.periodId === formData.value.periodId,
      )

      // Cập nhật danh sách vị trí cho nguyện vọng này
      companyPositions.value[index] = filteredPositions.map((position) => ({
        id: position.id,
        title: position.title,
        description: position.description || 'Không có mô tả',
        requirements: position.requirements || 'Không có yêu cầu cụ thể',
        availableSlots: position.availableSlots || 0,
      }))
    }
  } catch (error) {
    console.error(`Lỗi khi lấy vị trí của công ty cho nguyện vọng ${index + 1}:`, error)
    toast.error(`Không thể tải danh sách vị trí cho nguyện vọng ${index + 1}`)
    companyPositions.value[index] = []
  } finally {
    loadingCompanyPositions.value[index] = false
  }
}

// Lấy tên công ty từ ID
const getCompanyName = (companyId) => {
  const company = companies.value.find((c) => c.id === companyId)
  return company ? company.name : 'Không xác định'
}

// Kiểm tra xem một vị trí đã được chọn ở nguyện vọng khác chưa
const isPositionSelected = (positionId, currentIndex) => {
  return preferences.value.some(
    (pref, index) => index !== currentIndex && pref.positionId === positionId,
  )
}

// Lấy thông tin vị trí đã chọn cho nguyện vọng
const getSelectedPosition = (index) => {
  const positionId = preferences.value[index].positionId
  if (!positionId) return null

  return companyPositions.value[index].find((pos) => pos.id === positionId)
}

// Sắp xếp các chi tiết nguyện vọng theo thứ tự ưu tiên
const getSortedDetails = (details) => {
  return [...details].sort((a, b) => a.preferenceOrder - b.preferenceOrder)
}

// Format date to display
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format date range
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  const start = new Date(startDate)
  const end = new Date(endDate)

  const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return `${new Intl.DateTimeFormat('vi-VN', formatOptions).format(start)} - ${new Intl.DateTimeFormat('vi-VN', formatOptions).format(end)}`
}

// Get readable status text
const getStatusText = (status) => {
  const statusMap = {
    PENDING: 'Đang chờ xét duyệt',
    APPROVED: 'Đã được chấp thuận',
    REJECTED: 'Đã bị từ chối',
    CANCELLED: 'Đã hủy',
  }
  return statusMap[status] || status
}

// Fetch data when component mounts
onMounted(async () => {
  try {
    // Tải danh sách công ty
    await fetchCompanies()
    await Promise.all([fetchUpcomingPeriod(), fetchMyApplications()])
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
  }
})

// Fetch current period information
const fetchUpcomingPeriod = async () => {
  try {
    const response = await getUpcomingPeriod()
    if (response && response.data) {
      // Assume the response includes an active period
      periods.value = [response.data]

      // Set the current period as default
      formData.value.periodId = response.data.id
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin kỳ thực tập:', err)
    toast.error('Không thể tải thông tin kỳ thực tập hiện tại')
    throw err
  }
}

const handleUploadCV = async () => {
  if (loading.value) return
  if (!isStep1Valid.value) {
    toast.error('Vui lòng chọn kỳ thực tập và tải lên CV')
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Tạo form data để gửi file
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('periodId', formData.value.periodId)
    formDataToSubmit.append('cvFile', selectedFile.value)

    // Gửi request tải lên CV
    const response = await uploadCV(formDataToSubmit)

    if (response && response.data) {
      toast.success('Tải lên CV thành công')

      // Cập nhật trạng thái
      currentApplication.value = response.data
      hasCvUploaded.value = true

      // Làm mới danh sách đơn đăng ký
      await fetchMyApplications()
    }
  } catch (err) {
    console.error('Lỗi khi tải lên CV:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi tải lên CV. Vui lòng thử lại sau.'
    }
    toast.error('Tải lên CV không thành công')
  } finally {
    loading.value = false
  }
}

// Fetch all companies
const fetchCompanies = async () => {
  try {
    const response = await getAllCompany()
    if (response && response.data) {
      companies.value = response.data
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách công ty:', error)
    toast.error('Không thể tải danh sách công ty')
  }
}

// Fetch user's internship applications
const fetchMyApplications = async () => {
  loadingApplications.value = true
  try {
    const response = await getMyApplications()
    if (response && response.data) {
      applications.value = response.data

      // Kiểm tra nếu có application với CV đã upload
      if (applications.value.length > 0) {
        // Tìm application cho kỳ hiện tại
        const currentPeriodApp = applications.value.find(
          (app) => formData.value.periodId && app.periodId === formData.value.periodId,
        )

        if (currentPeriodApp) {
          currentApplication.value = currentPeriodApp
          hasCvUploaded.value = true

          // Kiểm tra xem đã đăng ký nguyện vọng chưa
          if (currentPeriodApp.details && currentPeriodApp.details.length > 0) {
            hasRegistered.value = true
          }
        }
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn đăng ký:', err)
    toast.error('Không thể tải danh sách đơn đăng ký thực tập')
  } finally {
    loadingApplications.value = false
  }
}

// Helper function to get cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Kiểm tra định dạng file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file định dạng PDF, DOC hoặc DOCX')
      event.target.value = '' // Reset input file
      selectedFile.value = null
      return
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      event.target.value = '' // Reset input file
      selectedFile.value = null
      return
    }

    selectedFile.value = file
  }
}

// Remove selected file
const removeSelectedFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('cvFile')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Handle preferences registration
const handleRegisterPreferences = async () => {
  if (positionLoading.value) return
  if (!arePreferencesValid.value) {
    toast.error('Vui lòng chọn đủ 3 nguyện vọng thực tập')
    return
  }

  positionLoading.value = true
  error.value = ''

  try {
    // Chuẩn bị dữ liệu để gửi
    // Lưu ý: API chỉ cần positionId và preferenceOrder, không cần companyId
    const preferencesData = {
      applicationId: currentApplication.value.id,
      preferences: preferences.value.map((pref) => ({
        positionId: pref.positionId,
        preferenceOrder: pref.preferenceOrder,
        note: pref.note,
      })),
    }

    // Gửi request đăng ký nguyện vọng
    const response = await registerPreferences(preferencesData)

    if (response && response.data) {
      toast.success('Đăng ký nguyện vọng thực tập thành công')

      // Cập nhật trạng thái
      hasRegistered.value = true

      // Làm mới danh sách đơn đăng ký
      await fetchMyApplications()
    }
  } catch (err) {
    console.error('Lỗi khi đăng ký nguyện vọng:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Có lỗi xảy ra khi đăng ký nguyện vọng. Vui lòng thử lại sau.'
    }
    toast.error('Đăng ký nguyện vọng không thành công')
  } finally {
    positionLoading.value = false
  }
}
</script>
<style scoped>
.container {
  max-width: 900px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  border-radius: 8px 8px 0 0;
}

.btn-primary {
  background-color: #c02135;
  border-color: #c02135;
}

.btn-primary:hover {
  background-color: #a61b2d;
  border-color: #a61b2d;
}

.bg-primary {
  background-color: #c02135 !important;
}

.text-primary {
  color: #c02135 !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #c02135;
  box-shadow: 0 0 0 0.25rem rgba(192, 33, 53, 0.25);
}

.position-details {
  background-color: #f8f9fa;
}
</style>
