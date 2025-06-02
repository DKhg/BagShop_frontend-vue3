<template>
    <Header />
    <RouterView/>
    <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import store from "@/scripts/store";
import axios from "axios";
import {watch} from "vue";
import {useRoute} from 'vue-router';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const route = useRoute();

    const check = ()=> {
        axios.get("/api/account/check").then(({data})=>{
            if(data) {
                store.commit("setAccount", data);
            } else {
                store.commit("setAccount", "");
                localStorage.removeItem("userId");
            }
        })
    };


    watch(route, ()=> {
        check();
    });
  }
}
</script>

<style>
  /* 기본 Placeholder 이미지 스타일 */
  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  /* 큰 화면에서의 Placeholder 이미지 크기 */
  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }

  /* 예제 구분선 스타일 */
  .b-example-divider {
    width: 100%;
    height: 3rem;
    background-color: #0000001a;
    border: solid rgba(0, 0, 0, .15);
    border-width: 1px 0;
    box-shadow: inset 0 .5em 1.5em #0000001a,
                inset 0 .125em .5em #00000026;
  }

  /* 세로선 예시 */
  .b-example-vr {
    flex-shrink: 0;
    width: 1.5rem;
    height: 100vh;
  }

  /* Bootstrap Icons 설정 */
  .bi {
    vertical-align: -.125em;
    fill: currentColor;
  }

  /* 수평 스크롤 네비게이션 */
  .nav-scroller {
    position: relative;
    z-index: 2;
    height: 2.75rem;
    overflow-y: hidden;
  }

  .nav-scroller .nav {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    margin-top: -1px;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  /* 커스텀 보라색 버튼 */
  .btn-bd-primary {
    --bd-violet-bg: #712cf9;
    --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

    --bs-btn-font-weight: 600;
    --bs-btn-color: var(--bs-white);
    --bs-btn-bg: var(--bd-violet-bg);
    --bs-btn-border-color: var(--bd-violet-bg);

    --bs-btn-hover-color: var(--bs-white);
    --bs-btn-hover-bg: #6528e0;
    --bs-btn-hover-border-color: #6528e0;

    --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);

    --bs-btn-active-color: var(--bs-btn-hover-color);
    --bs-btn-active-bg: #5a23c8;
    --bs-btn-active-border-color: #5a23c8;
  }

  /* 다크/라이트 모드 토글 버튼 위치 및 아이콘 스타일 */
  .bd-mode-toggle {
    z-index: 1500;
  }

  .bd-mode-toggle .bi {
    width: 1em;
    height: 1em;
  }

  .bd-mode-toggle .dropdown-menu .active .bi {
    display: block !important;
  }
</style>
