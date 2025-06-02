import { createApp } from 'vue'
import store from '@/scripts/store'
import router from '@/scripts/router'
import App from './App.vue'
import axios from 'axios';

//axios 인터셉터 등록 ( Vue 앱 생선 전에 등록 : 모든 axios 요청/응답에 대해 전역 처리를 하기 위함
axios.interceptors.response.use(
    (response) => {
        //요청이 성공적으로 끝나면 그대로 반환
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401 && error.response.data.errorType != "PWD_FAIL") {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            router.push("/login");
        }
        //에러를 계속 전달
        // Promise.reject(error) 반환 : 에러가 그대로 전달되니까, 각 요청마다 .catch()로 처리 가능
        return Promise.reject(error);
    }
)

//앱 생성후 Vuex 등록, 라우터 등록, id가 app 인 DOM 요소에 Vue 앱 마운트
createApp(App).use(store).use(router).mount('#app')
