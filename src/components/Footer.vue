<template>
  <footer class="site-footer text-white">
    <div class="container py-5">
      <div class="row">
        <!-- 브랜드 / 로고 -->
        <div class="col-md-4 mb-4">
          <h4 class="footer-brand">Maison de Hong</h4>
          <p class="small">당신의 라이프스타일에 딱 맞는 가방을 만나다</p>
        </div>

        <!-- 메뉴 -->
        <div class="col-md-4 mb-4">
          <h6>바로가기</h6>
          <ul class="list-unstyled">
            <li><a href="/">홈</a></li>
            <li><a href="#">고객센터</a></li>
          </ul>
        </div>

        <!-- 고객센터 -->
        <div class="col-md-4 mb-4">
          <h6>고객센터</h6>
          <p class="small mb-1">010-7630-3123</p>
          <p class="small mb-0">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
          <p class="small">rhghdrms100@naver.com</p>
        </div>
      </div>

      <!-- 하단 -->
      <div class="footer-bottom d-flex justify-content-between align-items-center pt-4 mt-4 border-top">
        <p class="mb-0 small">&copy; 2025 Maison de Hong. All rights reserved.</p>
        <a href="#" class="scroll-top">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          <span>TOP</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.site-footer {
  background-color: #6c757d;
  color: #eee;
}

.site-footer a {
  color: #ccc;
  text-decoration: none;
}

.site-footer a:hover:not(.scroll-top) {
  color: #fff;
  text-decoration: underline;
}

.footer-brand {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

/* scroll-top 영역 전체 클릭 및 hover */
.scroll-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #aaa;
  transition: color 0.3s;
  cursor: pointer;
}

.scroll-top i {
  font-size: 24px;
}

.scroll-top span {
  font-size: 12px;
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* hover 시 scroll-top 전체 효과 */
.scroll-top:hover {
  color: #fff;
}

/* 혹시 남은 밑줄 제거 */
.scroll-top i,
.scroll-top span {
  text-decoration: none;
}

</style>
