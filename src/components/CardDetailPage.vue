<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">{{ ccard.rankNameEn }}</navigation-toolbar>
    <div id="content__header">
      <taken-cards-at></taken-cards-at>
    </div>
    <div id="content__body">
      <card-detail :ccard="ccard"></card-detail>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
import cardDetail from '@/components/parts/CardDetail.vue';
import takenCardsAt from '@/components/parts/TakenCardsAt.vue';

export default {
  components: { navigationToolbar, cardDetail, takenCardsAt },
  created: function () {
    this.ccard = this.$store.getters['ccard/card'](this.cardId);
  },
  data() {
    return {
      ccard: null,
    };
  },
  methods: {},
  name: 'CardDetailPage',
  props: ['cardId'],
};
</script>

<style scoped>
@import '../stylesheets/base.css';
</style>
