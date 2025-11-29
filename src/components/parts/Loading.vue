<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  created: function () {},
  name: 'Loading',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
/* 背景のオーバーレイを追加 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.1); /* 半透明の背景 */
  display: flex;
  justify-content: center; /* 水平方向中央揃え */
  align-items: center; /* 垂直方向中央揃え */
  z-index: 1000; /* 他の要素の上に表示 */
}

/* ローディングスピナー */
.loading {
  width: 5em;
  height: 5em;
  border-radius: 50%;
  border: 0.25em solid #ccc;
  border-top-color: #0000ff;
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
