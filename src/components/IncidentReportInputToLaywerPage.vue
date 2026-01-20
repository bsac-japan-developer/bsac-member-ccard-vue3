<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header"></div>
    <div id="content__body">
      <div class="input-area">
        <input-form :inputForms="inputForms" @get-data="onGetData"></input-form>
      </div>
    </div>
    <div id="content__footer">
      <v-ons-button @click="confirm" class="button" style="background-color: red">
        BSAC事務局に報告する
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import incidentReportFrontPage from '@/components/IncidentReportFrontPage.vue';
import incidentReportInputAfterPage from '@/components/IncidentReportInputAfterPage.vue';
import inputForm from '@/components/parts/InputForm.vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    inputForm,
    navigationToolbar,
  },
  computed: {
    inputForms: function () {
      return this.$store.getters['incidentReport/inputForms'];
    },
  },
  created: function () {},
  data() {
    return {
      inputData: null,
    };
  },
  methods: {
    /**
     * データをクリアする
     */
    clearData: function () {
      this.inputData = null;
    },
    /**
     * 処理前の確認を行う
     */
    confirm: function () {
      if (!this.inputData) {
        this.$ons.notification.confirm({
          title: '確認',
          message: '入力エラーがあります<br>確認してください',
          buttonLabels: ['はい'],
        });
        return;
      }
      this.$ons.notification.confirm({
        title: '確認',
        message: '送信しますか？',
        buttonLabels: ['いいえ', 'はい'],
        callback: (answer) => {
          if (answer === 1) this.submit();
        },
      });
    },
    /**
     * 子コンポーネントのデータを取得する
     * @param data
     */
    onGetData: function (data) {
      this.inputData = data?.inputData;
    },
    /**
     * 送信する
     */
    submit: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 事故報告を登録する
        const result = await this.$store.dispatch('incidentReport/update', this.inputData);
        // console.log(JSON.stringify(this.inputData));
        // const result = { success: true, message: '送信しました' };
        // 登録成功時は入力データをクリアして一覧画面に戻る;
        if (result.success) {
          this.clearData();
          this.$ons.notification.confirm({
            title: '事故報告データ送信',
            message: '相談内容を送信しました<br>事故報告トップページに戻ります',
            buttonLabels: ['OK'],
            callback: (answer) => {
              if (answer === 0) {
                this.$emit('replace-page-navigation', markRaw(incidentReportFrontPage));
              }
            },
          });
        } else {
          this.$ons.notification.alert({ title: 'エラー', message: result.message });
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/submit] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
  },
  name: 'IncidentReportInputPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
