<template>
  <div class="card">
    <span class="img" :style="{ backgroundImage: `url(${item.imgPath})` }"></span>
    <div class="card-body">
      <h5 class="item-name">{{ item.name }}</h5>
      <div class="price-section">
        <small class="real">{{ lib.getNumberFormatted(item.price - (item.price * item.discountPer / 100)) }}원</small>
        <small class="price">{{ lib.getNumberFormatted(item.price) }}원</small>
        <span class="discount">{{ item.discountPer }}%</span>
      </div>
      <div class="cart-btn">
        <button @click="addToCart(item.id)" aria-label="Add to cart">
          <svg xmlns="http://www.w3.org/2000/svg" class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import lib from "@/scripts/lib";
import store from "@/scripts/store";
import axios from "axios";

export default {
  name: "Card",
  props: {
    item: Object
  },
  setup() {
    const addToCart = (itemId) => {
      if (!store.state.account.userId) {
        alert("로그인 해주세요.");
        return;
      }
      axios.post(`/api/cart/items/${itemId}`).then((res) => {
        alert(res.data);
      });
    };
    return { lib, addToCart };
  }
};
</script>

<style scoped>
.card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.15);
}

.card .img {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: block;
}

.card-body {
  padding: 16px 20px 24px;
}

.item-name {
  margin-bottom: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  line-height: 1.3;
}

.price-section {
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.price-section .real {
  color: #e63946;
  font-weight: 700;
  font-size: 1.1rem;
}

.price-section .price {
  color: #999;
  font-size: 0.9rem;
  text-decoration: line-through;
}

.price-section .discount {
  background: #e63946;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  user-select: none;
  letter-spacing: 0.05em;
}

.cart-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.cart-btn button {
  background: #1d3557;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(29, 53, 87, 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.cart-btn button:hover {
  background: #457b9d;
  box-shadow: 0 6px 16px rgba(69, 123, 157, 0.5);
}

.cart-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}
</style>
