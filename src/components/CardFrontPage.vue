<template>
  <v-ons-page>
    <splitter-toolbar :title="'ランク'"></splitter-toolbar>
    <div id="content__header">
      <version-check ref="versionCheck" />
      <v-ons-button
        modifier="quiet"
        class="unread-notification-button"
        @click="toNotificationListPage"
      >
        未読のお知らせが {{ notificationUnReadCount }} 件あります
      </v-ons-button>
      <taken-cards-at></taken-cards-at>
    </div>
    <div id="content__body">
      <v-ons-button modifier="quiet" @click="refresh(true)" class="reload-button">
        <img src="../../www/images/reload.png" />
      </v-ons-button>
      <card-detail v-if="latestCard !== null" :ccard="latestCard"></card-detail>
      <div class="member-status-note">
        <div v-show="isNegative">
          メンバーの登録手続きは完了していますが、<span style="color: red">保険は未加入の状態</span
          >です。 保険への加入を希望される場合は手続きを完了してください。
        </div>
        <div v-show="isReserve">
          メンバーの登録手続きが完了していない為、メンバーとしての活動は出来ない状態です。
          また、資格を復帰するのに<span style="color: red"
            >BSAC Japanが定める講習の受講が必要になる場合があります</span
          >ので、 ご不明な場合はBSAC Japan事務局までお問い合わせ下さい。
        </div>
      </div>
    </div>
    <div id="content__footer">
      <div class="quiet-button-area">
        <v-ons-button
          @click="toIncidentReportInputPage"
          :disabled="!(this.isActive || this.isNegative)"
          modifier="cta block"
          class="button-transition"
          style="background-color: red"
        >
          <div class="label-wrapper">
            <span class="title">事故の報告をする</span>
            <span class="arrow arrow-right"></span>
          </div>
        </v-ons-button>
        <div v-if="!(this.isActive || this.isNegative)" class="member-registration-recommend">
          <p class="text-style">事故報告機能を使うためには<br />BSACメンバー登録が必要です</p>
        </div>
        <p v-if="levelupCardsCount !== 0 || sdcCardsCount !== 0">■その他のカード / Other Cards</p>
        <v-ons-button
          v-if="levelupCardsCount !== 0"
          @click="toCardListPage(1)"
          modifier="cta block"
          class="button-transition"
        >
          <div class="label-wrapper">
            <span class="title">Level Up ({{ levelupCardsCount }})</span>
            <span class="arrow arrow-right"></span>
          </div>
        </v-ons-button>
        <v-ons-button
          v-if="sdcCardsCount !== 0"
          @click="toCardListPage(2)"
          modifier="cta block"
          class="button-transition"
        >
          <div class="label-wrapper">
            <span class="title" style="font-size: 1rem">
              Skill Development Course(SDC) ({{ sdcCardsCount }})
            </span>
            <span class="arrow arrow-right"></span>
          </div>
        </v-ons-button>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import cardDetail from '@/components/parts/CardDetail.vue';
import cardListPage from '@/components/CardListPage.vue';
import incidentReportInputPage from '@/components/IncidentReportInputPage.vue';
import notificationListPage from '@/components/NotificationListPage.vue';
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';
import takenCardsAt from '@/components/parts/TakenCardsAt.vue';
import versionCheck from '@/components/parts/VersionCheck.vue';

export default {
  components: {
    cardDetail,
    splitterToolbar,
    takenCardsAt,
    versionCheck,
  },
  computed: {
    isActive: function () {
      return this.$store.getters['member/isActive'];
    },
    isNegative: function () {
      return this.$store.getters['member/isNegative'];
    },
    isReserve: function () {
      return this.$store.getters['member/isReserve'];
    },
    latestCard: function () {
      return this.$store.getters['ccard/latestCard'];
    },
    levelupCardsCount: function () {
      const ret = this.$store.getters['ccard/levelupCards'];
      return ret ? ret.length : 0;
    },
    notificationUnReadCount: function () {
      return this.$store.getters['notification/unReadCount'];
    },
    online: function () {
      return this.$store.getters['env/online'];
    },
    sdcCardsCount: function () {
      const ret = this.$store.getters['ccard/sdcCards'];
      return ret ? ret.length : 0;
    },
  },
  created: function () {
    this.refresh(false);
  },
  data() {
    return {
      zeroDataMessage: '取得済みのランクがありません',
    };
  },
  methods: {
    /**
     * データを最新化する
     */
    refresh: async function (showDialog) {
      this.$emit('show-loading-navigation');
      try {
        // 認証チェック
        this.$store.commit('user/updateTimeToExpire');
        if (!this.$store.getters['user/isAuthenticated']) {
          this.$ons.notification.confirm({
            title: '確認',
            message: '前回ログインしてから一定時間経過したためログアウトします',
            buttonLabels: ['はい'],
            callback: () => this.signout(),
          });
        }

        this.zeroDataMessage = null;

        // バージョンチェックを実施する
        if (this.$refs.versionCheck) await this.$refs.versionCheck.checkVersion();

        // ログインする（devise_token_authの有効期限を延ばす）
        const userpass = this.$store.getters['user/userpass'];
        if (userpass?.loginId && userpass?.password)
          await this.$store.dispatch('user/signin', userpass);

        // データ取得処理を並列実行
        const results = await Promise.all([
          this.$store.dispatch('member/show'),
          this.$store.dispatch('ccard/index'),
          this.$store.dispatch('link/index'),
          this.$store.dispatch('notification/index'),
        ]);

        // データ取得日時を設定する
        this.$store.commit('ccard/setTakenCardsAt');

        if (showDialog) {
          this.$ons.notification.alert({
            title: 'データ取得',
            message: this.online ? '最新データを取得しました' : 'サーバに接続できません',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * カード一覧ページに遷移する
     * @param cardType
     */
    toCardListPage: function (cardType) {
      this.$emit(
        'push-page-navigation',
        markRaw({
          ...cardListPage,
          onsNavigatorProps: {
            cardType: cardType,
          },
        })
      );
    },
    /**
     * 事故報告入力ページに遷移する
     */
    toIncidentReportInputPage: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 新規作成情報を取得する;
        // データ取得処理を並列実行;
        const results = await Promise.all([this.$store.dispatch('incidentReport/new')]);

        // エラーの場合、メッセージを表示する
        let success = true;
        results.forEach((result, index) => {
          success = success && result.success;
          if (!result.success)
            this.$ons.notification.alert({
              title: 'メンバー変更申請データ取得',
              message: result.message,
            });
        });

        if (success) this.$emit('push-page-navigation', markRaw(incidentReportInputPage));
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/toMemberRegistrationChangePage] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * お知らせ一覧ページに遷移する
     */
    toNotificationListPage: function () {
      this.$emit('push-page-navigation', markRaw(notificationListPage));
    },
  },
  name: 'CardFrontPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';

.member-status-note {
  margin: 0.5rem 1rem;
  font-size: 0.9rem;
}

.member-registration-recommend {
  margin: 0.25rem 1rem 1rem 1rem;
  padding: 1rem;
  width: 80%;
  border: 0.1rem solid red;
}

.member-registration-recommend > .text-style {
  margin: 0 auto;
  font-size: 1rem;
  font-weight: 500;
  color: red;
}

.reload-button {
  margin: 0;
  text-align: right;
}

.reload-button > img {
  width: 25px;
}

.quiet-button-area {
  margin: 0 0 5% 0;
}

.unread-notification-button {
  margin: 0;
  z-index: 10;
  color: red;
  font-size: 1rem;
  text-decoration: underline;
}
</style>
