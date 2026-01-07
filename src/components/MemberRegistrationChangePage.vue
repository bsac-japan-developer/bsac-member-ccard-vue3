<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">メンバー登録情報変更依頼</navigation-toolbar>
    <div id="content__header">
      <p class="note--center">
        BSAC事務局にユーザー情報変更を依頼します。<br />
        変更依頼の間隔は{{ intervalHours }}時間以上空けて下さい。
      </p>
    </div>
    <div id="content__body">
      <!-- <div class="input-area">
        <input-form :inputForms="inputForms" @get-data="onGetData"></input-form>
      </div> -->
    </div>
    <div id="content__footer">
      <v-ons-button @click="confirm" class="button"> 送信する </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import inputForm from '@/components/parts/InputForm.vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    inputForm,
    navigationToolbar,
  },
  computed: {
    inputForms: function () {
      // return this.$store.getters['memberRegistrationChangeRequest/inputForms'];
    },
    intervalHours: function () {
      return 9999; // this.$store.getters['memberRegistrationChangeRequest/intervalHours'];
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
        // ダイバーコース申込送信依頼に登録する
        // const result = await this.$store.dispatch(
        //   'memberRegistrationChangeRequest/create',
        //   this.inputData
        // );
        const result = { success: true, message: '送信しました' };
        this.$ons.notification.alert({
          title: 'ダイバー登録情報変更依頼',
          message: result.message,
        });
        // 登録成功時は入力データをクリアして一覧画面に戻る;
        if (result.success) {
          this.clearData();
          this.$emit('pop-page-navigation');
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
  name: 'MemberRegistrationChangePage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
