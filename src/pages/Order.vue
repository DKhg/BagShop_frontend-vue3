<template>
  <div class="order">
    <div class="container">
      <main>
        <div class="py-5 text-center">
          <h1 class="h2">주문하기</h1>
        </div>

        <div class="row g-5">
          <!-- Cart Summary -->
          <div class="col-md-5 col-lg-4 order-md-last">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-primary">구입 목록</span>
              <span class="badge bg-primary rounded-pill">{{state.items.length}}</span>
            </h4>

            <ul class="list-group mb-3">
              <li class="list-group-item d-flex justify-content-between lh-sm" v-for="(i, idx) in state.items" :key="idx">
                <div>
                  <h6 class="my-0">{{i.item.name}} x {{i.quantity}}개</h6>
                </div>
                <span class="text-body-secondary">{{lib.getNumberFormatted((i.item.price - (i.item.price * i.item.discountPer / 100)) * i.quantity)}}원</span>
              </li>
            </ul>
            <h3 class="text-center total-price">{{lib.getNumberFormatted(computedPrice)}}원</h3>
          </div>

          <!-- Billing Form -->
          <div class="col-md-7 col-lg-8">
            <h4 class="mb-3">주문자 정보</h4>
            <div style="margin-bottom: 20px;">
                <input id="nameAddress" type="checkbox" class="form-check-input" @change="bringInfo"/>
                <label class="form-check-label" for="nameAddress">주문자 이름과 주소 불러오기</label>
            </div>
            <div class="needs-validation" novalidate>
              <div class="row g-3">
                <div class="col-12">
                  <label for="username" class="form-label">이름</label>
                    <input type="text" class="form-control" id="username" v-model="state.form.name" />
                </div>

                <div class="col-12">
                  <label for="address" class="form-label">주소</label>
                  <input type="text" class="form-control" id="address" v-model="state.form.address" />
                  <div class="invalid-feedback">Please enter your shipping address.</div>
                </div>
              </div>

              <hr class="my-4" />

              <h4 class="mb-3">결제수단</h4>

              <div class="my-3">
                <div class="form-check">
                  <input id="card" name="paymentMethod" type="radio" class="form-check-input" value="card" v-model="state.form.payment" />
                  <label class="form-check-label" for="card">신용카드</label>
                </div>

                <div class="form-check">
                  <input id="bank" name="paymentMethod" type="radio" class="form-check-input" value="bank" v-model="state.form.payment" />
                  <label class="form-check-label" for="bank">무통장 입금</label>
                </div>

              </div>

              <hr class="my-4" />
              <button class="btn btn-primary btn-lg" @click="submit()">
                결제하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>


<script>
import {computed, reactive} from "vue"
import axios from "axios"
import router from "@/scripts/router"
import lib from "@/scripts/lib"
import {loadTossPayments  } from "@tosspayments/tosspayments-sdk"

export default {
    setup() {

        const state = reactive({
            items:[],
            form: {
                name:"",
                address:"",
                payment:"",
                items:""
            }
        })

        //장바구니 내역 불러오기
        const load = ()=>{
            axios.get("/api/cart/items").then((res)=>{
                state.items = res.data.carts;
            })
            .catch((err)=>{
                console.log("에러 : " + err);
            });
        }

        //총 금액 계산
        const computedPrice = computed(()=>{
            let result = 0;
            for(let i of state.items) {
                result += (i.item.price - (i.item.price * i.item.discountPer / 100)) * i.quantity;
            }
            return result;
        })

        //결제 시 상품명 값 설정
        const orderName = computed(()=> {
            if(state.items.length === 0) return "";
            if(state.items.length === 1) return state.items[0].item.name;
            return `${state.items[0].item.name} 외 ${state.items.length-1}건`;
        });

        //주문자 이름 주소 불러오기
        const bringInfo = (event)=>{
            //체크 O
            if(event.target.checked === true) {
                axios.get("/api/cart/items").then((res)=>{
                    state.form.name = res.data.member.name;
                    state.form.address = res.data.member.address;
                })
                .catch((err)=>{
                    console.log("에러 : " + err);
                });
            //체크 X
            } else {
                state.form.name = "";
                state.form.address = "";
            }
        }

        //결제하기
        const submit = async()=>{

            //주문한 상품목록 불러오기
            const args = JSON.parse(JSON.stringify(state.form));
            args.items = state.items;

            //주문 유효성
            if(!state.form.name.trim()) {
                alert("이름을 입력해주세요.");
                return;
            } else if(!state.form.address.trim()) {
                alert("주소를 입력해주세요.");
                return;
            } else if(!state.form.payment) {
                alert("결제 수단을 선택해주세요.");
                return;
            }

            //카드결제 시
            if(state.form.payment == "card") {

                const clientKey = "test_ck_ORzdMaqN3wKepYRe7g7B35AkYXQG";
                const tossPayments = await loadTossPayments(clientKey);
                const customerKey = localStorage.getItem("userId") + "_1";
                const payment = tossPayments.payment({customerKey});

                payment.requestPayment({
                  method: "CARD",
                  amount: {
                    currency: "KRW",
                    value: computedPrice.value,
                  },
                  orderId: localStorage.getItem("userId")+Date.now(),
                  orderName: orderName.value,
                  customerEmail: "",
                  customerName: state.form.name,
                  card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                  },
                }).then(function () {
                   // 성공 처리: 서버 측에서 결제 승인 API를 호출하세요
                   //주문완료 및 주문내역 페이지 이동
                   axios.post("/api/orders", args).then(()=>{
                           alert("주문을 완료하였습니다.");
                           router.push({path:"/orders"});
                   })
                   .catch((err)=>{
                       console.log("에러 : " + err);
                   });
                })
                .catch((error) => {
                   // 에러 처리: 에러 목록을 확인하세요
                   // https://docs.tosspayments.com/sdk/v2/error-codes#failurl로-전달되는-에러
                   if (error.code === "USER_CANCEL") {
                       // 구매자가 결제창을 닫았을 때 에러 처리
                       alert("1");
                   } else if (error.code === "INVALID_CARD_COMPANY") {
                       // 유효하지 않은 카드 코드에 대한 에러 처리
                       alert("2");
                   }
                });
            }


        }

        load();

        return {state, lib, computedPrice, submit, bringInfo}
    }
}
</script>

<style scoped>
/* 컨테이너 안 카드 스타일 */
.col-md-5.col-lg-4.order-md-last,
.col-md-7.col-lg-8 {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

/* 전체 배경 및 폰트 */
.order {
  background: #f7f9fc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 40px 0;
}

/* 헤딩 스타일 */
h1.h2, h4.mb-3 {
  color: #222;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* 구입 목록 타이틀 */
.text-primary {
  color: #0077cc !important;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* 배지 스타일 */
.badge.bg-primary {
  background-color: #0077cc !important;
  font-weight: 600;
  font-size: 14px;
  padding: 0.4em 0.75em;
}

/* 리스트 아이템 */
.list-group-item {
  border: none;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
  font-weight: 500;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* 가격 텍스트 */
.text-body-secondary {
  color: #888;
  font-weight: 600;
}

/* 총합 가격 */
.total-price {
  font-weight: 700;
  font-size: 26px;
  margin-top: 20px;
  color: #0077cc;
}

/* 입력폼 전체 너비에 맞춤 */
input.form-control {
  width: 100%;
  font-size: 15px;
  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

input.form-control:focus {
  border-color: #0077cc;
  outline: none;
  box-shadow: 0 0 8px rgba(0,119,204,0.3);
}

/* 라디오 버튼 커스텀 */
.form-check-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid #0077cc;
  transition: background-color 0.3s ease;
}

.form-check-input:checked {
  background-color: #0077cc;
  border-color: #0077cc;
}

/* 라벨 */
.form-check-label {
  font-weight: 600;
  font-size: 15px;
  margin-left: 10px;
  cursor: pointer;
}

/* 결제 버튼 */
button.btn-primary {
  background: #0077cc;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 36px;
  width: 100%;
  max-width: 220px;
  margin: 30px auto 0;
  display: block;
  box-shadow: 0 4px 14px rgba(0, 119, 204, 0.3);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-primary:hover {
  background: #005fa3;
  box-shadow: 0 6px 18px rgba(0, 95, 163, 0.5);
}

</style>