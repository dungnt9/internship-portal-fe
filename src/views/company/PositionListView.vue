<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getListPosition } from '@/services/registerService.js'
import AddPosition from '@/components/company/AddPosition.vue'
import EditPosition from '@/components/company/EditPosition.vue'

const positions = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

// Modal control states
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedPositionId = ref(null)

onMounted(async () => {
  await fetchPositions()
})

const fetchPositions = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getListPosition()
    positions.value = response.data
    loading.value = false
  } catch (err) {
    error.value = 'Không thể tải danh sách vị trí. Vui lòng thử lại sau.'
    loading.value = false
    console.error('Lỗi tải danh sách vị trí:', err)
  }
}

const navigateToPositionDetail = (positionId) => {
  router.push({
    name: 'thong-tin-vi-tri',
    query: { id: positionId },
  })
}

const openAddModal = () => {
  showAddModal.value = true
}

const openEditModal = (positionId, event) => {
  event.stopPropagation()
  selectedPositionId.value = positionId
  showEditModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedPositionId.value = null
}

const handlePositionAdded = (newPosition) => {
  // Add the new position to the list or refresh the list
  fetchPositions()
}

const handlePositionUpdated = (updatedPosition) => {
  // Update the position in the list or refresh the list
  fetchPositions()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const getStatusClass = (status) => {
  return {
    'status-open': status === 'OPEN',
    'status-closed': status === 'CLOSED',
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'OPEN':
      return 'Đang mở'
    case 'CLOSED':
      return 'Đã đóng'
    default:
      return status
  }
}
</script>

<template>
  <div class="position-list-container">
    <div class="header-actions">
      <h1 class="title">Danh sách vị trí thực tập</h1>
      <button @click="openAddModal" class="add-button">
        <i class="fas fa-plus"></i> Thêm vị trí mới
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải danh sách vị trí...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchPositions" class="retry-button">Thử lại</button>
    </div>

    <div v-else class="position-table-container">
      <table class="position-table">
        <thead>
          <tr>
            <th>Kỳ thực tập</th>
            <th>Tên vị trí</th>
            <th>Công ty</th>
            <th>Mô tả</th>
            <th>Số lượng</th>
            <th>Hình thức làm việc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="position in positions"
            :key="position.id"
            class="position-row"
            @click="navigateToPositionDetail(position.id)"
          >
            <td class="period-cell">{{ position.periodId }}</td>
            <td>{{ position.title }}</td>
            <td>{{ position.companyName }}</td>
            <td class="description-cell">{{ position.description }}</td>
            <td>{{ position.availableSlots }}</td>
            <td>{{ position.workType }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(position.status)]">
                {{ getStatusText(position.status) }}
              </span>
            </td>
            <td>
              <button @click="openEditModal(position.id, $event)" class="edit-button">
                <i class="fas fa-edit"></i> Sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !error && positions.length === 0" class="no-positions">
      <p>Không có vị trí thực tập nào.</p>
      <button @click="openAddModal" class="add-button">Thêm vị trí mới</button>
    </div>

    <!-- Modal components using teleport -->
    <AddPosition
      :showModal="showAddModal"
      @close="closeAddModal"
      @position-added="handlePositionAdded"
    />

    <EditPosition
      :showModal="showEditModal"
      :positionId="selectedPositionId"
      @close="closeEditModal"
      @position-updated="handlePositionUpdated"
    />
  </div>
</template>

<style scoped>
.position-list-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  margin: 0;
  color: #333;
}

.add-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.add-button:hover {
  background-color: #a01c2d;
}

.position-table-container {
  overflow-x: auto;
}

.position-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.position-table th,
.position-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.position-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.position-row {
  transition: background-color 0.2s;
  cursor: pointer;
}

.position-row:hover {
  background-color: #f9f9f9;
}

.description-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-open {
  background-color: #e6f7e6;
  color: #28a745;
}

.edit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.edit-button:hover {
  background-color: #3a7bc8;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.delete-button:hover {
  background-color: #c82333;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c02135;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 50px 0;
  color: #c02135;
}

.retry-button {
  background-color: #c02135;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.no-positions {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

/* For small screens */
@media (max-width: 768px) {
  .actions-cell {
    flex-direction: column;
    gap: 5px;
  }

  .edit-button,
  .delete-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
