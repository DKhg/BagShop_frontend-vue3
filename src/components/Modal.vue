<template>
  <div v-if="show" class="modal-overlay" @click.self="close"> <!-- @click.self="close" 모달 밖 클릭 시 종료 -->
    <div class="modal-content">
      <!-- 모달 안 내용 -->
      <slot></slot>
      <button class="close-btn" @click="close">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  //부모에서 전달한 값
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  //부모에게 어떤 이벤트를 내보낼 것인지 선언
  emits: ["update:show"],
  //이 컴포넌트 내에서 사용
  methods: {
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 600px;
  min-height: 280px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.close-btn {
  background: #e53935;
  border: none;
  color: white;
  font-weight: bold;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 14px;
}

.close-btn:hover {
  background: #c62828;
}
</style>
