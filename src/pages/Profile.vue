<template>
  <section>
    <div class="edit-container">
      <img class="bg-img" src="/img/MaisonDeHongBig.png" alt="Background" />
      <div class="edit-box">
        <h1>회원정보 수정</h1>
        <form>
          <!-- 이름 -->
          <div class="form-group">
            <label for="name">이름</label>
            <input id="name" type="text" placeholder="이름을 입력하세요" v-model="state.form.name" ref="nameInput"/>
          </div>
          <!-- 아이디 (수정불가) -->
          <div class="form-group">
            <label for="userId">아이디</label>
            <input id="userId" type="text" ref="userIdInput" v-model="state.form.userId" readonly />
          </div>
          <!-- 이메일 -->
          <div class="form-group">
            <label for="email">이메일</label>
            <input id="email" type="email" placeholder="이메일을 입력하세요" v-model="state.form.email" ref="emailInput" />
          </div>
          <!-- 비밀번호 변경 (선택) -->
          <div class="form-group">
            <label for="password">새 비밀번호 (선택)</label>
            <input id="password" type="password" placeholder="새 비밀번호를 입력하세요" v-model="state.form.password" ref="passwordInput"/>
          </div>
          <!-- 비밀번호 확인 -->
          <div class="form-group">
            <label for="confirmPassword">비밀번호 확인</label>
            <input id="confirmPassword" type="password" placeholder="새 비밀번호를 다시 입력하세요" v-model="state.form.confirmPassword" ref="confirmPasswordInput" />
          </div>
          <!-- 주소 -->
          <div class="form-group">
            <label for="address">주소</label>
            <div class="address-search">
              <input id="address" type="text" placeholder="주소를 입력하세요" v-model="state.form.address" ref="addressInput" />
              <i class="fa fa-search" @click="searchAddress"></i>
            </div>
          </div>
          <!-- 전화번호 -->
          <div class="form-group">
            <label for="phoneNumber">전화번호</label>
            <input id="phoneNumber" type="text" placeholder="전화번호를 입력하세요" v-model="state.form.phoneNumber" ref="phoneNumberInput" @input="formatPhone" />
          </div>
          <button type="button" class="edit-submit" @click="updateMemberInfo">수정하기</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import {reactive, ref} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import store from "@/scripts/store";
import router from "@/scripts/router";

export default {

    setup() {
        const state = reactive({
            form: {
                name: "",
                userId: "",
                email: "",
                password: "",
                confirmPassword: "",
                address: "",
                phoneNumber: ""
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

        //전화번호 형식 자동완성
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

        //사용자 정보 불러오기
        const getMemberInfo = ()=> {
            const userId = store.state.account.userId || localStorage.getItem("userId");

            if(userId == null) {
                return;
            }

            //사용자 정보 불러오기 실행
            axios.get("/api/account/getMemberInfo", {
                params: { userId: userId }
            }).then((res) => {
                //state.form = res.data 하면 res.data 로 state.form 전체를 통째로 대체하기 때문에
                //password, confirmPassword 요소가 사라진다
                state.form.name = res.data.name;
                state.form.email = res.data.email;
                state.form.userId = res.data.userId;
                state.form.address = res.data.address;
                state.form.phoneNumber = res.data.phoneNumber;
                formatPhone();
            }).catch((err) => {
                console.log("에러 : "+ err);
            });
        }

        getMemberInfo();

        //사용자 정보 수정
        const updateMemberInfo = ()=> {
            //유효성 체크
            if(!state.form.name.trim()){
                alert("이름을 입력하세요.");
                nameInput.value.focus();
                return;
            } else if(!state.form.email.trim()) {
                alert("이메일을 입력하세요.");
                emailInput.value.focus();
                return;
            } else if(!lib.isValidEmail(state.form.email.trim())) {
                alert("이메일 형식이 올바르지 않습니다.");
                emailInput.value.focus();
                return;
            } else if( state.form.password.trim() && !state.form.confirmPassword.trim()) {
                alert("비밀번호 확인을 해주세요.");
                confirmPasswordInput.value.focus();
                return;
            } else if(state.form.password != state.form.confirmPassword) {
                alert("비밀번호가 서로 일치하지 않습니다.");
                return;
            } else if(!state.form.address.trim()) {
                alert("주소를 입력하세요.");
                addressInput.value.focus();
                return;
            } else if(!state.form.phoneNumber.trim()) {
                alert("전화번호를 입력하세요.");
                phoneNumberInput.value.focus();
                return;
            }

            //전송 전 trim 처리
            Object.keys(state.form).forEach((key)=>{
                if(typeof state.form[key] === "string") {
                    state.form[key] = state.form[key].trim();
                }
            });

            //사용자 정보 수정 실행
            axios.post("/api/account/updateMemberInfo", state.form).then(()=>{
                alert("회원 정보 수정이 완료되었습니다.");
                router.push("/");
            })
            .catch((err) => {
                console.log("에러 : "+ err);
            });
        }

        return {
          state,
          nameInput,
          userIdInput,
          emailInput,
          passwordInput,
          confirmPasswordInput,
          addressInput,
          phoneNumberInput,
          searchAddress,
          formatPhone,
          getMemberInfo,
          updateMemberInfo,
          lib,
          store
        };
    }


}


</script>

<style scoped>
/* 기존 회원가입 스타일과 거의 동일, 클래스명만 수정 */
section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 60px 0;
  background: #eaeff2;
}

.edit-container {
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

.edit-box {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.edit-box h1 {
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

.address-search {
  position: relative;
  display: flex;
  align-items: center;
}

.address-search input {
  flex: 1;
  padding-right: 40px;
}

.address-search i {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #007c9e;
  font-size: 18px;
}

.edit-submit {
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

.edit-submit:hover {
  background: #007c9e;
}
</style>
