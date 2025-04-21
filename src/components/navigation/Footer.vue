<template>
  <div class="footer-container">
    <img src="/images/logo/banner-footer.png" alt="Logo" class="logo" />
    <p>
      Bản quyền thuộc về Khoa Toán - Tin, Đại học Bách khoa Hà Nội <br />
      Văn phòng: Phòng 106 - Tòa nhà D3 01 Đại Cồ Việt - Quận Hai Bà Trưng - Hà Nội <br />
      Điện thoại: 04 3869 2137 - Fax: 04 3868 2470 <br />
      Email: fami@hust.edu.vn
    </p>
  </div>
</template>
<script setup></script>
<style scoped>
.footer-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 0 auto;
  background-color: #c02135;
  width: 100%;
}

.logo {
  height: 100px;
  width: auto;
}

p {
  color: white;
  font-size: 14px;
  margin: 0;
  padding: 0;
  text-align: end;
  line-height: 1.5;
}
</style>
