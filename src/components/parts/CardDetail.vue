<template>
  <div class="body">
    <div class="card-image">
      <div class="front-side">
        <div
          v-if="this.ccard?.rankIsGold"
          class="front-side-rank-name"
          :style="'font-size: ' + this.getFontSize(this.ccard?.rankNameEn) + 'rem'"
        >
          {{ this.ccard?.rankNameEn }}
        </div>
        <img
          v-if="ccard"
          :src="`data:image/png;base64, ${this.ccard?.rankFrontImageBase64}`"
          class="rank-img"
        />
      </div>

      <div class="back-side">
        <img
          v-if="ccard"
          :src="`data:image/png;base64, ${this.ccard?.rankBackImageBase64}`"
          class="card-base-img"
        />
        <img
          v-if="ccard"
          :src="`data:image/png;base64, ${this.ccard?.profileImageBase64}`"
          class="profile-img"
        />
        <table class="ccard-table">
          <tr>
            <td colspan="2">
              <div
                class="ccard-table-rank-name"
                :style="'font-size: ' + this.getFontSize(this.ccard?.rankNameEn) + 'rem'"
              >
                {{ this.ccard?.rankNameEn }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <!-- <div class="card-detail__ccard-table-certification-message">
                This diver has fully completed the training of this certification level.
              </div> -->
            </td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Name</td>
            <td class="ccard-table-value-column">{{ this.ccard?.memberNameEn }}</td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Date of Birth</td>
            <td class="ccard-table-value-column">
              {{ this.ccard?.memberBirthAt?.replace(/-/g, '/') }}
            </td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Member No.</td>
            <td class="ccard-table-value-column">{{ this.ccard?.memberIdWithRank }}</td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Certification Date</td>
            <td class="ccard-table-value-column">
              {{ this.ccard?.certifyAt?.replace(/-/g, '/') }}
            </td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Instructor No.</td>
            <td class="ccard-table-value-column">{{ this.ccard?.certifierMemberIdWithRank }}</td>
          </tr>
          <tr>
            <td class="ccard-table-title-column">Member Status.</td>
            <td class="ccard-table-value-column" style="font-weight: bold">
              {{ memberStatus }}
            </td>
          </tr>
        </table>
      </div>
      <div class="bubbles">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </div>
    </div>
    <div class="body-note-bubble">スクリーンショット防止のため動く水泡を表示しています。</div>
    <div v-if="isNoImage" class="expandable-area">
      <v-ons-list modifier="noborder">
        <v-ons-list-item modifier="nodivider" expandable :expanded.sync="false">
          <div class="center list-item__center">画像登録希望の方はこちら</div>
          <div class="expandable-content">
            <div>
              ※ no image画像が表示されている方のみが対象です。
              <photo-rule></photo-rule>
              <div style="text-align: center">
                <v-ons-button modifier="quiet" @click="sendMail">
                  <span style="font-size: 1rem">メールアプリを使い画像を送信する</span>
                </v-ons-button>
              </div>
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </div>
</template>

<script>
import photoRule from '@/components/parts/PhotoRule.vue';

export default {
  components: { photoRule },
  computed: {
    isNoImage: function () {
      const base64 = this.ccard?.profileImageBase64;
      return (
        base64.slice(0, 100) ===
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcIBwgJCQgMDAsMDBEQDg4QERoSFBIUEhonGB0YGB0YJyMqIiAiKiM+MSsrMT5I' &&
        base64.slice(-100) ===
          '/pL/xAAUEQEAAAAAAAAAAAAAAAAAAACA/9oACAECAQE/AG3/AP/EABQRAQAAAAAAAAAAAAAAAAAAAID/2gAIAQMBAT8Abf8A/9k='
      );
    },
    rankIsGold: function () {
      return this.ccard ? this.ccard.rankIsGold : null;
    },
    memberStatus: function () {
      return this.$store.getters['member/member']?.status?.toUpperCase();
    },
  },
  created: function () {},
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
     * メールを送信する
     */
    sendMail: function () {
      try {
        const toAddress = this.$store.getters['env/insuranceEmail'];
        const subject = 'カード画像登録依頼（カードNO:' + this.ccard?.memberIdWithRank + '）';
        let url = 'mailto:' + toAddress + '?subject=' + subject;
        location.href = url;
        window.open = window.cordova.InAppBrowser.open;
        window.open(url, '_system', 'location=yes');
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/sendMail] ${error}`);
      }
    },
  },
  name: 'CardDetail',
  props: {
    ccard: Object,
  },
};
</script>

<style scoped>
@import '../../stylesheets/base.css';

.body {
  margin-bottom: 5%;
  text-align: center;
}

.card-image {
  position: relative;
}

.front-side {
  position: relative;
  height: 100%;
}

.front-side-rank-name {
  color: white;
  font-weight: bold;

  position: absolute;
  top: 70%;
  left: 10%;
}

.rank-img {
  margin: 2.5% 0 2.5% 0;
  width: 90%;
  min-width: 100px;
  height: auto;

  border-radius: 15px;
  box-shadow: 5px 5px 5px rgba(125, 125, 125, 0.4);
}

.back-side {
  position: relative;
  height: 100%;
  /* border: 1px solid #000000; todo 後で消す */
}

.card-base-img {
  margin-top: 0%;
  margin-bottom: 0%;
  width: 90%;
  min-width: 100px;
  height: auto;

  border-radius: 10px;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.5);
}

.bsac-logo-img {
  width: 20%;
  min-width: 50px;
  height: auto;

  position: absolute;
  top: 10%;
  left: 15%;
}

.profile-img {
  width: 25%;
  min-width: 50px;
  height: auto;

  position: absolute;
  top: 35%;
  left: 10%;
}

.ccard-table {
  width: 50%;
  height: 12rem;

  position: absolute;
  /* top: 30%; */
  top: 5%;
  left: 40%;

  /* border: 1px solid #000000; todo 後で消す */
}

.ccard-table-rank-name {
  text-align: left;
  vertical-align: bottom;
  border-bottom: thin solid #000000;
  min-height: 1rem;
}

.ccard-table-certification-message {
  font-size: 0.4rem;
  text-align: left;
}

.ccard-table-title-column {
  width: 40%;
  /* padding-top: 4%; */

  font-size: 0.5rem;
  text-align: left;
  vertical-align: middle;

  /* border: 1px solid #000000; todo 後で消す */
}

.ccard-table-value-column {
  width: 60%;
  padding-right: 0;

  font-size: 0.7rem;
  text-align: left;
  vertical-align: middle;

  /* border: 1px solid #000000; todo 後で消す */
}

.body-note-bubble {
  margin: 5% 5% 5% 5%;
  font-size: 0.7rem;
}

.expandable-area {
  margin: 5%;
}

.photo-request {
  margin: 5% 5% 5% 5%;
}

/* ons-list-item のCSSを上書き [start] */
.list {
  padding: 1% 2% 2% 1%;
}

.list-item__center {
  padding: 2% 0;
  min-height: 0;
  font-size: 0.9rem;
}

.expandable-content {
  padding: 0;
  font-size: 0.8rem;
}
/* ons-list-item のCSSを上書き [end] */

/* bubble animation section [start] */

.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}

.bubble {
  position: absolute;
  bottom: -40;
  width: 40px;
  height: 40px;
  /*background-color: transparent;*/
  background-color: rgba(24, 235, 249, 0.3);
  border: 1px solid #18ebf9;
  border-radius: 50%;
  animation: bubble 10s ease-in infinite;
}

.bubble:nth-child(1) {
  width: 15px;
  height: 15px;
  left: 30%;
  animation-duration: 6s;
}

.bubble:nth-child(2) {
  width: 30px;
  height: 30px;
  left: -10%;
  animation-duration: 4s;
}

.bubble:nth-child(3) {
  width: 25px;
  height: 25px;
  left: 30%;
  animation-duration: 7s;
}

.bubble:nth-child(4) {
  width: 35px;
  height: 35px;
  left: 67%;
  animation-duration: 6s;
}

.bubble:nth-child(5) {
  width: 20px;
  height: 20px;
  left: 70%;
  animation-duration: 4.5s;
}

.bubble:nth-child(6) {
  width: 40px;
  height: 40px;
  left: 30%;
  animation-duration: 8s;
}

.bubble:nth-child(7) {
  width: 30px;
  height: 30px;
  left: 10%;
  animation-duration: 3.5s;
}

.bubble:nth-child(8) {
  width: 50px;
  height: 50px;
  left: 40%;
  animation-duration: 6s;
}

@keyframes bubble {
  0% {
    bottom: -50px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    bottom: 100%;
  }
}
/* bubble animation section [end] */
</style>
