<template>
  <header>
        <div class="collapse text-bg-dark" id="navbarHeader">
          <div class="container">
            <div class="row">
              <div class="col-sm-4 py-4">
              <ul class="list-unstyled text-white">
                <li>
                  👉<router-link to="/" class="text-white">메인 화면</router-link>
                </li>
                <li v-if="$store.state.account.userId">
                  👉<router-link to="/profile" class="text-white">회원 정보 수정</router-link>
                </li>
                <li v-if="$store.state.account.userId">
                  👉<router-link to="/orders" class="text-white">주문 내역</router-link>
                </li>
                <li v-if="!$store.state.account.userId">
                  👉<router-link to="/login" class="text-white">로그인</router-link>
                </li>
                <li v-else>
                  👉<a @click="logout" class="text-white" style="cursor:pointer;">로그아웃</a>
                </li>
              </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar navbar-dark bg-dark shadow-sm">
          <div class="container">
            <router-link to="/" class="navbar-brand d-flex align-items-center">
              <img src="/img/MaisonDeHong_logo.svg" width="90" height="90" class="me-2" />
              <strong>Maison de Hong</strong>
            </router-link>
            <div class="flex-grow-1"></div>
            <div class="text-white mx-3 fw-light" v-if="$store.state.account.userId">
                🙋‍♂️ {{$store.state.account.userId}} 님 환영합니다
            </div>
            <div class="text-white mx-3 fw-light" v-else>
                🔐 로그인 해주세요
            </div>
            <router-link to="/cart" class="cart btn" v-if="$store.state.account.userId">
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader"
              aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>
</template>

<script>
import store from "@/scripts/store";
import router from "@/scripts/router";
import axios from "axios";

export default {
  name: 'Header',
  setup() {
    const logout = ()=> {
        axios.post("/api/account/logout").then(()=> {
            store.commit('setAccount', "");
            router.push({path:"/"});
        })
    }
    return {logout};
  }
}
</script>

<style scoped>
header ul li a{
    cursor: pointer;
}
header .navbar .cart{
    margin-left: auto;
    color: #fff;
}

header .navbar-dark.bg-dark {
  background-color: #6c757d !important; /* 밝은 그레이 */
}

#navbarHeader {
  background-color: #adb5bd !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1050;
}

/* collapse 열릴 때 높이 애니메이션 유지 + 배경색 고정 */
.collapse {
  background-color: #adb5bd !important;
  transition: height 0.35s ease;
  overflow: hidden; /* 깜빡임 방지 */
}

ul.list-unstyled.text-white li a {
  text-decoration: none; /* 기본 밑줄 없애기 */
  cursor: pointer;
  color: inherit; /* 상위 텍스트 색상 따라가기 */
  transition: color 0.3s ease;
}

ul.list-unstyled.text-white li a:hover {
  text-decoration: underline; /* 호버시에만 밑줄 */
  color: #ffd700; /* 예: 골드 색으로 강조 */
}

</style>

