<template>
  <section>
    <div class="signup-container">
      <img class="bg-img" src="/img/MaisonDeHongBig.png" alt="Background" />
      <div class="signup-box">
        <h1>회원가입</h1>
        <form>
          <!-- 이름 -->
          <div class="form-group">
            <label for="name">이름</label>
            <input id="name" type="text" placeholder="이름을 입력하세요" v-model="state.form.name" ref="nameInput" required />
          </div>
          <!-- 아이디 + 중복 확인 버튼 -->
          <div class="form-group">
            <label for="userId">아이디</label>
            <div class="userId-check">
              <input id="userId" type="text" placeholder="아이디를 입력하세요" v-model="state.form.userId" ref="userIdInput" required />
              <button type="button" @click="idCheck()">중복 확인</button>
            </div>
          </div>
          <!-- 이메일 -->
          <div class="form-group">
              <label for="email">이메일</label>
              <input id="email" type="email" placeholder="이메일을 입력하세요" v-model="state.form.email" ref="emailInput" required />
          </div>
          <!-- 비밀번호 -->
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요" v-model="state.form.password" ref="passwordInput" required />
          </div>
          <!-- 비밀번호 확인 -->
          <div class="form-group">
            <label for="confirm">비밀번호 확인</label>
            <input id="confirmPassword" type="password" placeholder="비밀번호를 입력하세요" v-model="state.form.confirmPassword" ref="confirmPasswordInput" required />
          </div>
          <!-- 주소 -->
          <div class="form-group">
            <label for="address">주소</label>
            <div class="address-search">
              <input id="address" type="text" placeholder="주소를 입력하세요" v-model="state.form.address" ref="addressInput" required />
              <i class="fa fa-search" @click="searchAddress"></i>
            </div>
          </div>
          <!-- 전화번호 -->
          <div class="form-group">
              <label for="phoneNumber">전화번호</label>
              <input id="phoneNumber" type="text" placeholder="전화번호를 입력하세요" v-model="state.form.phoneNumber" ref="phoneNumberInput" @input="formatPhone" required />
          </div>
          <button type="button" class="signup-submit" @click="submit()">가입하기</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import {reactive, ref, watch} from "vue";
import axios from "axios";
import router from "@/scripts/router";
import lib from "@/scripts/lib";

export default {
  setup() {
    const state = reactive({
        form : {
            name: "",
            userId: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
            phoneNumber: "",
            idCheckYn: "N"
        }
    });

    const nameInput = ref(null);
    const userIdInput = ref(null);
    const emailInput = ref(null);
    const passwordInput = ref(null);
    const confirmPasswordInput = ref(null);
    const addressInput = ref(null);
    const phoneNumberInput = ref(null);

    //주소 찾기 팝업
    const searchAddress = ()=>{
        new window.daum.Postcode({
            oncomplete: (data) => {
                state.form.address = data.address;
                addressInput.value.focus();
            }
        }).open();
    }

    //아이디 중복 체크
    const idCheck = ()=>{
        if(state.form.userId.trim() == '') {
            alert("아이디를 입력하세요.");
            userIdInput.value.focus();
            return;
        }

        axios.get("/api/account/idCheck", {
            params: {
                userId: state.form.userId.trim()
            }
        }).then((res)=> {
            if(res.data){
                state.form.idCheckYn = "N"
                alert("사용중인 아이디 입니다.");
            } else {
                state.form.idCheckYn = "Y"
                alert("아이디를 사용할 수 있습니다.");
            }
        }).catch(() => {
            alert("중복 확인 중 오류가 발생했습니다.");
        });
    }

    //아이디 값이 바뀔 때 중복체크값 N으로 초기화
    //watch(감시할대상, 콜백함수() => {})
    watch(() => state.form.userId, () => {
      state.form.idCheckYn = "N";
    });

    //전화번호 형식
    const formatPhone = ()=> {
        let num = state.form.phoneNumber.replace(/[^0-9]/g, ""); //숫자만 남기기

        if(num.length < 4) {
            state.form.phoneNumber = num;
        } else if(num.length <= 7) {
            state.form.phoneNumber = num.slice(0,3) + "-" + num.slice(3);
        } else {
            state.form.phoneNumber = num.slice(0, 3) + "-" + num.slice(3, 7) + "-" + num.slice(7, 11);
        }
    }

    //회원 가입
    const submit = ()=>{
        //유효성 검사
        if(!state.form.name.trim()){
            alert("이름을 입력하세요.");
            nameInput.value.focus();
            return;
        } else if(!state.form.userId.trim()) {
            alert("아이디를 입력하세요.");
            userIdInput.value.focus();
            return;
        } else if(!state.form.email.trim()) {
            alert("이메일을 입력하세요.");
            emailInput.value.focus();
            return;
        } else if(!lib.isValidEmail(state.form.email.trim())) {
            alert("이메일 형식이 올바르지 않습니다.");
            emailInput.value.focus();
            return;
        } else if(!state.form.password.trim()) {
            alert("비밀번호를 입력하세요.");
            passwordInput.value.focus();
            return;
        } else if(!state.form.confirmPassword.trim()) {
            alert("비밀번호 확인을 해주세요.");
            confirmPasswordInput.value.focus();
            return;
        } else if(!state.form.address.trim()) {
            alert("주소를 입력하세요.");
            addressInput.value.focus();
            return;
        } else if(!state.form.phoneNumber.trim()) {
            alert("전화번호를 입력하세요.");
            phoneNumberInput.value.focus();
            return;
        } else if(state.form.password != state.form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        } else if(state.form.idCheckYn == "N") {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        //전송 전 trim 처리
        Object.keys(state.form).forEach((key)=>{
            if(typeof state.form[key] === "string") {
                state.form[key] = state.form[key].trim();
            }
        })


        //회원 가입 처리
        axios.post("/api/account/join", state.form).then(()=>{
            alert("회원가입이 완료되었습니다.");
            router.push({path: "/"});
        }).catch(()=>{
            alert("회원가입 중 오류가 발생했습니다.");
        })
    }

    return {
      state,
      submit,
      nameInput,
      userIdInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      addressInput, 
      phoneNumberInput,
      idCheck,
      lib,
      searchAddress,
      formatPhone
    };
  }
};
</script>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* header/footer 높이 고려한 전체 높이 */
  padding: 60px 0;                 /* 위아래 여백 추가 */
  background: #eaeff2;
}

.signup-container {
  display: flex;
  width: 1000px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: #fff;
}

.bg-img {
  width: 50%;
  object-fit: cover;
}

.signup-box {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signup-box h1 {
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

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.userId-check {
  display: flex;
  gap: 10px;
  align-items: center; /* 수직 정렬 */
}

.userId-check input {
  flex: 1;
  height: 42px; /* 버튼과 같은 높이로 맞춤 */
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.userId-check button {
  height: 42px; /* input과 일치 */
  padding: 0 16px;
  font-size: 15px;
  font-weight: bold;
  background: #00a4cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.userId-check button:hover {
  background: #007c9e;
}
.signup-submit {
  margin-top: 10px;
  background: #00a4cc;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.signup-submit:hover {
  background: #007c9e;
}
.address-search {
  position: relative;
  display: flex;
  align-items: center;
}

.address-search input {
  flex: 1;
  padding-right: 40px; /* 아이콘 공간 확보 */
}

.address-search i {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #007c9e;
  font-size: 18px;
}

</style>
