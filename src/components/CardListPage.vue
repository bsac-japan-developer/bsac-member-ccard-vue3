<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">{{ cardTypeName }}カード</navigation-toolbar>
    <div id="content__header">
      <taken-cards-at></taken-cards-at>
    </div>
    <div id="content__body">
      <v-ons-list modifier="noborder" v-for="ccard in this.ccards" :key="ccard.id">
        <v-ons-list-item
          tappable
          modifier="nodivider"
          @click="toCardDetailPage(ccard.id)"
          class="card-list-item"
        >
          <div style="display: flex; flex-direction: row; align-items: center">
            <div
              v-show="ccard.rankIsGold"
              class="rank-name"
              :style="'font-size: ' + getFontSize(ccard.rankNameEn) + 'rem'"
            >
              {{ ccard.rankNameEn }}
            </div>
            <div class="rank-img-area">
              <img :src="`data:image/png;base64, ${ccard.rankFrontImageBase64}`" class="rank-img" />
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
import cardDetailPage from '@/components/CardDetailPage.vue';
import takenCardsAt from '@/components/parts/TakenCardsAt.vue';

export default {
  components: { navigationToolbar, takenCardsAt },
  computed: {
    cardTypeName: function () {
      if (this.cardType === 1) return 'Levelup';
      if (this.cardType === 2) return 'SDC';
    },
    ccards: function () {
      if (this.cardType === 1) return this.$store.getters['ccard/levelupCards'];
      if (this.cardType === 2) return this.$store.getters['ccard/sdcCards'];
      return this.$store.getters['ccard/cards'];
    },
  },
  created: function () {},
  data() {
    return {};
  },
  methods: {
    /**
     * フォントサイズを取得する
     * @param value
     */
    getFontSize: function (value) {
      if (!value) return 0;
      let length = value.length;
      if (length < 10) length = 10;
      if (length > 30) length = 30;
      const fontSize = Math.floor((0.6 + 6 / length) * 10) / 10;
      if (fontSize > 1.2) return 1.2;
      if (fontSize < 0.5) return 0.5;
      return fontSize;
    },
    /**
     * カード詳細ページに遷移する
     * @param cardId カードID
     */
    toCardDetailPage: function (cardId) {
      this.$emit(
        'push-page-navigation',
        markRaw({
          ...cardDetailPage,
          onsNavigatorProps: {
            cardId: cardId,
          },
        })
      );
    },
  },
  name: 'CardListPage',
  props: ['cardType'],
};
</script>

<style scoped>
@import '../stylesheets/base.css';

.card-list-item {
  background-color: #ececf2;
}

.list-item-arrow {
  flex-basis: 1rem;
  position: relative;
  margin-left: auto;
}

.list-item-arrow::before {
  content: '';
  width: 0.6rem;
  height: 0.6rem;
  border-top: solid 2px #888;
  border-right: solid 2px #888;
  position: absolute;
  transform: rotate(45deg);
  left: -1rem;
  top: 0;
}

.rank-img-area {
  position: relative;

  text-align: center;
  background-color: #ececf2;
}

.rank-img {
  width: 80%;
  border-radius: 15px;
  box-shadow: 5px 5px 5px rgba(125, 125, 125, 0.4);
}

.rank-name {
  color: white;
  font-weight: bold;

  position: absolute;
  top: 70%;
  left: 15%;
}
</style>
