<template>
  <div class="footer-container">
    <div class="info-container">
      <div class="name-container">
        <img class="logo" src="/images/logo/logo-hust.webp" alt="Logo" />
        <div class="divider"></div>
        <div>
          <p class="name-vn">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
          <p class="name-en">HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY (HUST)</p>
        </div>
      </div>
      <div class="address-container">
        <p><img src="/images/footer/address.png" />Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
        <p><img src="/images/footer/mail.png" />vp@hust.edu.vn</p>
        <p><img src="/images/footer/phone.png" />024 3869 6099</p>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.footer-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  background-color: #f2f6fc;
  width: 100%;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.name-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.logo {
  height: 100px;
  width: auto;
}

.divider {
  height: 100px;
  width: 2px;
  background-color: #f3c108;
}

.name-vn {
  font-size: 24px;
  font-weight: bold;
  color: #c02135;
}

.address-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-container p {
  font-size: 18px;
  display: flex;
  align-items: center;
}

p img {
  width: 20px;
  margin-right: 10px;
}
</style>
