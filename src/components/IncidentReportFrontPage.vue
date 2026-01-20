<template>
  <v-ons-page>
    <splitter-toolbar :title="'事故報告'"></splitter-toolbar>
    <div id="content__header">
      <div style="margin-bottom: 1.5rem"></div>
    </div>
    <div id="content__body">
      <v-ons-button
        @click="toIncidentReportInputPage"
        modifier="cta block"
        class="button-transition"
        style="background-color: red"
      >
        <div class="label-wrapper">
          <span class="title">事故の報告をする</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
      <v-ons-button
        @click="toIncidentReportDescriptionPage"
        modifier="cta block"
        class="button-transition"
      >
        <div class="label-wrapper">
          <span class="title">お客様に事故が発生したら？</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
      <v-ons-button
        @click="toIncidentReportDescriptionForFamilyPage"
        modifier="cta block"
        class="button-transition"
      >
        <div class="label-wrapper">
          <span class="title">事故者（被害者）やご遺族の対応について</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
      <v-ons-button modifier="quiet" class="tel-button" @click="toIncidentReportEmergencyCallPage">
        <img src="../../www/images/tel.png" style="width: 5rem" />
      </v-ons-button>
      <p class="note--center">
        直ぐに担当者と連絡が取りたい場合は<br />
        こちらのボタンを押してください。<br />
        ※BSAC JapanのスタッフにSMSが届きますので、<br />
        折り返しの連絡をお待ち下さい。<br />
      </p>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import incidentReportDescriptionForFamilyPage from '@/components/IncidentReportDescriptionForFamilyPage.vue';
import incidentReportDescriptionPage from '@/components/IncidentReportDescriptionPage.vue';
import incidentReportEmergencyCallPage from '@/components/IncidentReportEmergencyCallPage.vue';
import incidentReportInputPage from '@/components/IncidentReportInputPage.vue';
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';

export default {
  components: {
    splitterToolbar,
  },
  computed: {},
  methods: {
    /**
     * 事故者（被害者）やご遺族の対応についてページに遷移する
     */
    toIncidentReportDescriptionForFamilyPage: function () {
      this.$emit('push-page-navigation', markRaw(incidentReportDescriptionForFamilyPage));
    },
    /**
     * 緊急電話ページに遷移する
     */
    toIncidentReportEmergencyCallPage: function () {
      this.$emit('push-page-navigation', markRaw(incidentReportEmergencyCallPage));
    },
    /**
     * お客様に事故が発生したら？ページに遷移する
     */
    toIncidentReportDescriptionPage: function () {
      this.$emit('push-page-navigation', markRaw(incidentReportDescriptionPage));
    },
    /**
     * 事故の報告をするページに遷移する
     */
    toIncidentReportInputPage: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 新規作成用データを取得する
        // データ取得処理を並列実行
        const results = await Promise.all([this.$store.dispatch('incidentReport/new')]);

        // エラーの場合、メッセージを表示する
        let success = true;
        results.forEach((result, index) => {
          success = success && result.success;
          if (!result.success)
            this.$ons.notification.alert({
              title: '事故報告データ取得',
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
  },
  name: 'IncidentReportFrontPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
