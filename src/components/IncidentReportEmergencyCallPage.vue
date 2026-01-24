<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header"></div>
    <div id="content__body">
      <p class="tel-description">
        BSAC Japanの担当者に折り返し電話を依頼します<br /><br />折り返し先を変更する場合は下記の電話番号を変更してください
      </p>
      <input v-model="phoneNo" type="text" inputmode="tel" class="textbox" />
      <p v-if="!phoneNo" class="validation-message-label">折り返し先電話番号を入力してください</p>
      <p class="tel-description-under">※携帯電話番号を優先して表示しています</p>
      <v-ons-button :disabled="!phoneNo" modifier="quiet" class="tel-button" @click="confirm">
        <img src="../../www/images/tel.png" class="tel-button-image" />
      </v-ons-button>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import incidentReportFrontPage from '@/components/IncidentReportFrontPage.vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {
    member: function () {
      return this.$store.getters['member/member'];
    },
  },
  created() {
    this.phoneNo = this.member.mobileNo || this.member.phoneNo;
  },
  data() {
    return {
      phoneNo: null,
    };
  },
  methods: {
    /**
     * 処理前の確認を行う
     */
    confirm: function () {
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
     * 折り返し電話リクエストを送信する
     */
    submit: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 折り返し電話リクエストを登録する
        const result = await this.$store.dispatch('sms/send', { callback_phone_no: this.phoneNo });
        // const result = { success: true, message: '送信しました' };
        // 登録成功時は入力データをクリアして一覧画面に戻る;
        if (result.success) {
          this.$ons.notification.confirm({
            title: '折り返し電話依頼送信',
            message: '折り返し電話依頼を送信しました<br>事故報告トップページに戻ります',
            buttonLabels: ['OK'],
            callback: (answer) => {
              if (answer === 0) {
                // 事故報告トップページに遷移する
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
      // // SMSを送信する
      // const res = await this.$store.dispatch('sms/send', {
      //   callback_phone_no: this.phoneNo,
      // });

      // this.$ons.notification.confirm({
      //   title: '折り返し電話依頼',
      //   message: res.message,
      //   buttonLabels: ['OK'],
      //   callback: (answer) => {
      //     if (answer === 0) {
      //       // 事故報告トップページに遷移する
      //       this.$emit('replace-page-navigation', markRaw(incidentReportFrontPage));
      //     }
      //   },
      // });
    },
  },
  name: 'IncidentReportEmergencyCallPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.tel-description {
  margin: 1rem auto 1.5rem auto;
  width: 78%;
  font-size: 1.2rem;
}

.validation-message-label {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: red;
}

.tel-description-under {
  margin: 1rem auto 0.5rem auto;
  width: 80%;
  font-size: 1rem;
}

.textbox {
  background-color: white;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid gray;
  font-size: 1.5rem;
  line-height: 2rem;
  width: 80%;
  text-align: center;
}

.tel-button {
  margin: 2rem 0 0 0;
}

.tel-button-image {
  width: 5rem;
}
</style>
