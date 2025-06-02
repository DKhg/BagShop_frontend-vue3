<template>
  <div class="order">
    <h2 class="title">주문내역</h2>
    <div class="container" v-if="state.orders.length != 0">
      <table class="styled-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>주문자명</th>
            <th>주소</th>
            <th>결제 수단</th>
            <th>구입 항목</th>
            <th>총 금액</th>
            <th>주문 날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(o, idx1) in state.orders" :key="idx1">
            <td>{{state.orders.length - idx1}}</td>
            <td>{{o.name}}</td>
            <td class="address">{{o.address}}</td>
            <td>{{o.payment}}</td>
            <td class="items-cell">
              <ul>
                <li v-for="(i, idx2) in o.items" :key="idx2">
                  <span class="item-name">{{i.item.name}}</span>
                  <span class="item-qty">× {{i.quantity}}개</span>
                </li>
              </ul>
            </td>
            <td class="total-price">{{lib.getNumberFormatted(o.totalPrice)}}원</td>
            <td class="order-date">{{lib.getDateFormatted(new Date(o.orderDate))}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-orders">
      주문내역이 존재하지 않습니다.
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
      orders: [],
    });

    axios
      .get("/api/orders")
      .then((res) => {
        state.orders = res.data;
        state.orders.forEach((order) => {
          order.totalPrice = order.items.reduce((sum, items) => {
            return (
              sum +
              (items.item.price - (items.item.price * items.item.discountPer) / 100) *
                items.quantity
            );
          }, 0);
        });
      })
      .catch((err) => {
        console.log("주문내역 가져오기 실패:", err);
      });

    return { state, lib };
  },
};
</script>

<style scoped>
.order {
  max-width: 1400px;
  margin: 40px auto;
  padding: 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fefefe;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-weight: 800;
  font-size: 2.3rem;
  color: #2c3e50;
  letter-spacing: 1.1px;
}


.styled-table {
  width: 100%; /* 150% -> 100% */
  /* 기존 스타일 유지 */
}

.styled-table thead tr {
  background-color: #34495e;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.styled-table thead th {
  padding: 14px 20px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}

.styled-table tbody tr {
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s ease;
}

.styled-table tbody tr:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.styled-table tbody td {
  padding: 18px 20px;
  text-align: center;
  vertical-align: middle;
  border-right: 1px solid #ecf0f1;
}

.total-price {
  font-weight: 700;
  color: #27ae60; /* 초록색 */
  font-size: 1.1rem;
  border-right: none;
}

.address {
  max-width: 250px;
  word-break: break-word;
  text-align: left;
  padding-left: 15px;
  color: #555;
}

.items-cell {
  max-width: 270px;
  text-align: left;
  padding-left: 15px;
}

.items-cell ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.items-cell li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #ecf0f1;
  font-size: 0.95rem;
  color: #34495e;
}

.items-cell li:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 600;
  color: #2980b9;
}

.item-qty {
  color: #7f8c8d;
  font-weight: 500;
}
.no-orders {
  text-align: center;      /* 가운데 정렬 */
  font-weight: bold;       /* 굵게 */
  color: red;              /* 빨간색 */
  margin-top: 20px;        /* 위쪽 여백 */
  font-size: 1.2rem;       /* 글자 크기 약간 키우기 */
}
</style>
