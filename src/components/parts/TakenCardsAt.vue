<template>
  <div>
    <p class="label">データ取得日時：{{ takenCardsAt }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    takenCardsAt: function () {
      return this.$store.getters['ccard/takenCardsAt'];
    },
  },
  created: function () {},
  name: 'TakenCardsAt',
};
</script>

<style scoped>
.label {
  margin: 1% 5%;

  font-size: 0.9rem;
  text-align: right;
}
</style>
