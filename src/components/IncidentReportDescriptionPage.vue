<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header">
      <p class="contents-title">お客様に事故が発生したら？</p>
    </div>
    <hr />
    <div id="content__body">
      <ol class="contents">
        <li>
          まず落ち着いて、メンバーの皆様ご自身のお身体などに問題や異常がないか確認し、その次に事故者の状況を確認してください。
        </li>
        <li>
          状況によって、救急の手配（119番）、海上保安部（118話）や警察（110番）への捜索・救助要請の必要性があるか確認をして、落ち着いて対応してください。
        </li>
        <li>状況によって、周囲に医療従事者がいないか確認し、対応の協力のお願いをしてください。</li>
        <li>
          緊急連絡先（ご家族など）への連絡先を確認しておきましょう。特に遭難など重大な事故につながる可能性がある時には、事故者の家族への早めの報告を忘れないようにしましょう。
        </li>
        <li>その他の対応について、以下の内容を確認しておきましょう。</li>
      </ol>
      <ul class="contents">
        <li>
          事故の詳細は早期に事故報告書に時系列でまとめておきましょう（事故報告書はこの報告の後にフォーマットをメールでお送り致します。可能であれば、ゲストにも情報提供の協力をお願いしてください。）
        </li>
        <li>申込書、健康診断書などの書式はコピーを取っておいてください。</li>
        <li>海上保安部や警察に提出した書類や報告内容などをできるだけ覚えておいてください。</li>
        <li>
          事故者の最終残圧とダイブコンピュータのデータを取得できれば一番良いですが、既に海上保安部や警察に提出してしまっている場合などは、メンバーご自身やバディのダイブコンピュータのデータなどを取得しておく事が望ましいでしょう。
        </li>
        <li>
          事故当時の海況などを明らかにするため、海面を撮影した画像や動画があればもらっておくようにしましょう。
        </li>
      </ul>
    </div>
    <div id="content__footer">
      <v-ons-button
        @click="toIncidentReportInputPage"
        modifier="cta block"
        class="button-transition"
      >
        <div class="label-wrapper">
          <span class="title">事故の報告をする</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import incidentReportInputPage from '@/components/IncidentReportInputPage.vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {},
  methods: {
    /**
     * 事故の報告をするページに遷移する
     */
    toIncidentReportInputPage: function () {
      this.$emit('push-page-navigation', markRaw(incidentReportInputPage));
    },
  },
  name: 'IncidentReportDescriptionPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.contents-title {
  font-size: 1.2rem;
}

.contents {
  padding: 0 1rem 0 2rem;
  text-align: left;
  font-size: 1.1rem;
}

.contents li {
  margin: 0.5rem 0;
}
</style>
