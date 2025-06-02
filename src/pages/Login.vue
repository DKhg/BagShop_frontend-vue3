<template>
  <section>
    <div class="login-container">
      <img class="bg-img" src="/img/MaisonDeHong.png" alt="Background" />
      <div class="login-box">
        <p class="login-subtitle">Welcome to Maison de Hong</p>
        <form @submit.prevent="submit">
          <input type="text" placeholder="아이디" @keyup.enter="submit()" v-model="state.form.userId" />
          <input type="password" placeholder="비밀번호" @keyup.enter="submit()" v-model="state.form.password" />
          <button type="button" @click="submit()">로그인</button>
        </form>

        <!-- 하단 링크 영역 -->
        <div class="links">
          <router-link to="/join">회원가입</router-link>
          <span>|</span>
          <a href="#" @click.prevent="showResetModal = true">비밀번호 재설정</a>
        </div>
      </div>
    </div>

    <Modal v-model:show="showResetModal">
    <h2 class="modal-title">비밀번호 재설정</h2>
      <!-- 1. 아이디 입력 -->
      <div class="form-row">
        <label for="userId">아이디</label>
        <div class="input-group">
          <input id="userId" type="text" placeholder="아이디를 입력하세요" v-model="state.modalForm.userId" :disabled="emailSent"/>
          <button type="button" @click="sendEmailCode" :disabled="emailSent">
            이메일로 인증코드 전송
          </button>
        </div>
      </div>

      <!-- 2. 인증코드 입력 -->
      <div v-if="emailSent" class="form-row">
        <label for="authCode">인증코드</label>
        <div class="input-group">
          <input id="authCode" type="text" placeholder="인증코드를 입력하세요" v-model="state.modalForm.inputCode" :disabled="resetPassword" />
          <button type="button" @click="authConfirm" :disabled="resetPassword">
            인증 확인
          </button>
        </div>
      </div>

      <!-- 3. 비밀번호 재설정 -->
      <div v-if="resetPassword" class="form-row">
        <label for="updatedPassword">새 비밀번호</label>
        <div class="input-group">
          <input id="updatedPassword" type="password" placeholder="새 비밀번호를 입력하세요" v-model="state.modalForm.password" />
          <button type="button" @click="newPassword">
            변경하기
          </button>
        </div>
      </div>
    </Modal>

  </section>
</template>

<script>
import { reactive , ref } from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";
import Modal from "@/components/Modal.vue";

export default {

  components: { Modal },

  setup() {
    const state = reactive({
      form: {
          userId: "",
          password: ""
      },
      modalForm: {
          userId: "",
          authCode: "",
          inputCode: "",
          password: ""
      }
    });

    //비밀번호 재설정 팝업
    const showResetModal = ref(false);

    //이메일 인증코드 입력란 표시 여부
    const emailSent = ref(false);

    //비밀번호 재설정 입력란 표시 여부
    const resetPassword = ref(false);

    //이메일 인증코드 전송 버튼 클릭시 호출
    const sendEmailCode = () => {
        //post 로 보낼 때 2번째 인자는 body (RequestBody), 3번째 인자는 parameter (RequestParam)
        axios.post("/api/account/sendEmailCode", null, { params : {
                userId : state.modalForm.userId
            }
        }).then((res)=>{
            if(res.data.isExistUserId == true){
                alert(res.data.message);
                state.modalForm.authCode = res.data.authCode;
                emailSent.value = true;
            } else {
                alert(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            alert("전송 실패");
        });
    }

    //인증 번호 확인
    const authConfirm = ()=> {
        if(state.modalForm.authCode != state.modalForm.inputCode) {
            alert("인증번호가 일치하지 않습니다.");
        } else {
            alert("인증이 완료 되었습니다.");
            resetPassword.value = true;
        }
    }

    //비밀번호 재설정
    const newPassword = ()=> {
        axios.post("/api/account/resetPassword", state.modalForm).then(()=>{
            alert("비밀번호 재설정이 완료되었습니다.");
            //모달창 닫기
            showResetModal.value = false;
        }).catch(() => {
            alert("비밀번호 재설정 실패");
        })
    }

    //로그인 함수
    const submit = () => {

        //로그인 화면 유효성
        if(!state.form.userId.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        } else if(!state.form.password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        axios.post("/api/account/login", state.form).then((res) => {
            store.commit("setAccount", res.data);
            localStorage.setItem("userId", store.state.account.userId);
            router.push("/");
        }).catch((err) => {
            //비밀번호를 틀렸을 때
            if(err.response.data.errorType === "PWD_FAIL") {
                alert(err.response.data.message);
            //사용자가 존재하지 않을 때
            } else if(err.response.data.errorType === "USER_NOT_FOUND") {
                alert(err.response.data.message);
            }
        });
    };

    return { state, submit, showResetModal, emailSent, sendEmailCode, resetPassword, authConfirm, newPassword };
  },
};
</script>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #eaeff2;
}

.login-container {
  display: flex;
  width: 800px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: #fff;
}

.bg-img {
  width: 50%;
  object-fit: cover;
}

.login-box {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-box h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input[type="text"],
input[type="password"] {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 15px;
}

button[type="button"] {
  background: #00a4cc;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button[type="button"]:hover {
  background: #007c9e;
}

.links {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.links a {
  color: #00a4cc;
  text-decoration: none;
  font-weight: bold;
}

.links a:hover {
  text-decoration: underline;
}

.links span {
  margin: 0 10px;
  color: #aaa;
}
.form-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-row label {
  width: 90px;
  text-align: right;
  margin-right: 12px;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.input-group input {
  width: 200px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-group button {
  padding: 10px 14px;
  background-color: #00a4cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.input-group button:hover {
  background-color: #007c9e;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
}
.login-subtitle {
  font-size: 18px;
  font-weight: 500;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 0.5px;
}
</style>
