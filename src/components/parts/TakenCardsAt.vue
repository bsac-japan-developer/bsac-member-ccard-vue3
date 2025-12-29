<template>
  <div>
    <p class="cards_taken_at-label">データ取得日時：{{ takenCardsAt }}</p>
  </div>
</template>

<script>
export default {
  props: {
    takenCardsAt: String,
  },
};
</script>

<style scoped>
.cards_taken_at-label {
  margin: 1% 1% 1% 1%;

  font-size: 0.8rem;
  text-align: right;
}
</style>
