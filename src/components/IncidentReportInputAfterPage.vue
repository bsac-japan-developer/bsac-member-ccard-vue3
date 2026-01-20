<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header">
      <div class="header-text">事故報告を送信しました。</div>
    </div>
    <div id="content__body">
      <div class="contents">
        <p>この報告より１週間以内に「事故報告書」を training@bsac.jp までお送りください。</p>
        <p>「事故報告書」の書式は、入力いただいたメールアドレスに送信されます。</p>
        <p>もし届かない場合はBSAC Japan事務局（03-5297-5656）までご連絡ください。</p>
        <p>
          事故の内容によっては、弊社担当より詳細確認のご連絡をさせて頂く場合がございますので、よろしくお願いいたします。
        </p>
      </div>
      <div class="contents--red">
        <p>
          今回ご報告頂いた事故の内容について、法律の専門家のアドバイスが欲しい場合は、以下のボタンから進んで頂き、必要事項にご入力頂いて送信ボタンを押してください。
        </p>
        <p>※返信に数日かかる場合がありますので、ご了承ください。</p>
      </div>
    </div>
    <div id="content__footer">
      <v-ons-button
        @click="toIncidentReportInputToLaywerPage"
        modifier="cta block"
        class="button-transition"
        style="background-color: red"
      >
        <div class="label-wrapper">
          <span class="title">法律の専門家からアドバイスを<br />受ける</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
      <v-ons-button
        @click="toIncidentReportFrontPage"
        modifier="cta block"
        class="button-transition"
      >
        <div class="label-wrapper">
          <span class="title">事故報告トップに戻る</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
import incidentReportFrontPage from '@/components/IncidentReportFrontPage.vue';
import incidentReportInputToLaywerPage from '@/components/IncidentReportInputToLaywerPage.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {
    incidentReport: function () {
      return this.$store.getters['incidentReport/incidentReport'];
    },
  },
  created: function () {},
  data() {
    return {};
  },
  methods: {
    /**
     * 事故報告トップページに遷移する
     */
    toIncidentReportFrontPage: function () {
      this.$emit('replace-page-navigation', markRaw(incidentReportFrontPage));
    },
    /**
     * 専門家のアドバイス依頼入力画面に遷移する
     */
    toIncidentReportInputToLaywerPage: async function () {
      if (!this.incidentReport?.id) {
        this.$ons.notification.alert({
          title: '事故報告データ取得',
          message: `IDが取得できません`,
        });
        return;
      }
      this.$emit('show-loading-navigation');
      try {
        // 編集用データを取得する
        // データ取得処理を並列実行
        const results = await Promise.all([
          this.$store.dispatch('incidentReport/edit', this.incidentReport?.id),
        ]);

        // エラーの場合、メッセージを表示する
        let success = true;
        results.forEach((result, index) => {
          success = success && result.success;
          if (!result.success)
            this.$ons.notification.alert({
              title: '事故報告データ送信',
              message: result.message,
            });
        });

        if (success) this.$emit('push-page-navigation', markRaw(incidentReportInputToLaywerPage));
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/toMemberRegistrationChangePage] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
  },
  name: 'IncidentReportAfterInputPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.header-text {
  margin: 1rem auto 1.5rem auto;
  font-weight: bold;
}

.contents {
  padding: 0 1.5rem 0 2rem;
  text-align: left;
  font-size: 0.85rem;
}

.contents--red {
  padding: 0 1.5rem 0 2rem;
  text-align: left;
  font-size: 0.85rem;
  color: red;
}
</style>
