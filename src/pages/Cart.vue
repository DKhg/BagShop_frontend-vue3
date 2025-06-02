<template>
  <div class="cart">
    <div class="container">
      <h1 class="title">장바구니</h1>

      <ul class="cart-list">
        <li v-for="(c, idx) in state.carts" :key="idx" class="cart-item">
          <img :src="c.item.imgPath" alt="상품 이미지" class="item-image" />

          <div class="item-info">
            <h5 class="item-name">{{ c.item.name }}</h5>
            <p class="item-price">
              {{ lib.getNumberFormatted((c.item.price - (c.item.price * c.item.discountPer / 100)) * c.quantity) }}원
            </p>

            <!-- 수량 조절 부분 (가격 아래 위치) -->
            <div class="qty-control">
              <button @click="minusQuantity(c.item.id)">-</button>
              <span>{{ c.quantity }}</span>
              <button @click="plusQuantity(c.item.id)">+</button>
            </div>
          </div>

          <i class="fa fa-trash delete-btn" @click="remove(c.item.id)"></i>
        </li>
      </ul>

      <!-- 장바구니가 비어있을 때 / 구입하기 버튼 -->
      <router-link v-if="state.carts.length != 0" to="/order" class="btn-primary">구입하기</router-link>
      <div v-else class="empty">장바구니가 비어있습니다.</div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  setup() {
    const state = reactive({
      carts: [],
    });

    //장바구니 목록 불러오기
    const load = () => {
      axios.get("/api/cart/items").then((res) => {
        state.carts = res.data.carts;
      })
      .catch((err)=>{
        console.log("에러 : " + err);
      })
    };

    //장바구니에서 상품 삭제
    const remove = (itemId) => {

      if(confirm("정말 삭제 하시겠습니까?")) {
          axios.delete(`/api/cart/items/${itemId}`).then(() => {
              load();
          })
          .catch((err)=>{
              console.log("에러 : " + err);
          })
      } else {
          return;
      }
    };

    //수량 (+)
    const plusQuantity = (itemId) => {
      const cartItem = state.carts.find((cart) => cart.item.id === itemId);
      cartItem.quantity++;

      //DB 수량 증가
      axios.post("/api/cart/plusItem", cartItem)
        .then(() => {})
        .catch((err)=>{
            console.log("에러 : " + err);
        });
    };

    //수량 (-)
    const minusQuantity = (itemId) => {
      const cartItem = state.carts.find((cart) => cart.item.id === itemId);
      if (cartItem.quantity === 1) {
        alert("수량을 더 줄일 수 없습니다.");
        return;
      }
      cartItem.quantity--;

      //DB 수량 감소
      axios.post("/api/cart/minusItem", cartItem)
        .then(() => {})
        .catch((err)=>{
            console.log("에러 : " + err);
        });
    };

    //초기 로딩
    load();

    return { state, lib, remove, plusQuantity, minusQuantity };
  },
};
</script>

<style scoped>
.cart {
  padding: 40px 0;
  background: #f9fafc;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #222;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  margin-left: 20px;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.item-price {
  font-size: 16px;
  color: #0077cc;
  font-weight: 600;
  margin: 5px 0 10px;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 12px; /* 버튼 사이 간격 조금 넓게 */
}

.qty-control button {
  background: #0077cc;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.1s;
}

.qty-control button:hover {
  background: #005fa3;
  transform: translateY(-2px);
}

.qty-control button:active {
  transform: scale(0.95);
}

.delete-btn {
  font-size: 20px;
  color: #e74c3c;
  cursor: pointer;
  margin-left: 20px;
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #c0392b;
}

.btn-primary {
  display: block;
  width: 180px;
  margin: 30px auto 0;
  padding: 14px 0;
  text-align: center;
  background: #0077cc;
  color: white;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #005fa3;
}

.empty {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-top: 40px;
}
</style>
