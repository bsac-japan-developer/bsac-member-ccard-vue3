<template>
  <v-ons-page>
    <p style="color: red; font-size: 2rem">{{ this.$store.getters['env/mode'] }}</p>
    <div id="content__header">
      <img src="../../www/images/bsac_logo.png" class="bsac-logo-img" />
    </div>
    <div id="content__body">
      <p>
        <v-ons-input
          placeholder="メールアドレス"
          type="email"
          inputmode="email"
          v-model="input.email"
          modifier="material"
          class="textbox--75"
        ></v-ons-input>
      </p>
      <p>
        <v-ons-input
          placeholder="パスワード"
          type="password"
          v-model="input.password"
          modifier="material"
          class="textbox--75"
        ></v-ons-input>
      </p>
    </div>
    <div id="content__footer">
      <v-ons-button @click="submit" class="button">ログイン</v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';

export default {
  components: {},
  created: function () {
    this.input.email = this.$store.getters['env/data'].email;
    this.input.password = this.$store.getters['env/data'].password;
  },
  data() {
    return {
      input: {
        email: null,
        password: null,
      },
      // isLoading: false,
    };
  },
  methods: {
    /**
     * データをクリアする
     */
    clearData: function () {
      this.input.email = null;
      this.input.password = null;
    },
    /**
     * ログインする
     */
    submit: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 入力チェックする
        const validateMessage = this.validate();
        if (validateMessage !== null) {
          this.$ons.notification.alert({
            title: 'ログイン',
            message: validateMessage,
          });
          return;
        }

        // ログインする
        const result = await this.$store.dispatch('user/signin', this.input);
        if (result.success) {
          // ログインパスワードを保存する（オブジェクトをコピーする）
          this.$store.commit('user/setUserPass', JSON.parse(JSON.stringify(this.input)));
          // メインページに遷移する
          this.$emit('show-main-page-navigation');
          // 入力データをクリアする
          this.clearData();
        } else {
          this.$ons.notification.alert({ title: 'エラー', message: 'ログインできません' });
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/submit] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * 入力チェックする
     */
    validate: function () {
      if (this.email === null) {
        return 'メールアドレスが未入力です';
      }
      if (this.password === null) {
        return 'パスワードが未入力です';
      }
      return null;
    },
  },
  name: 'SigninPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.bsac-logo-img {
  margin-top: 25%;
  margin-bottom: 20%;
  width: 60%;
  min-width: 100px;
  height: auto;
}
</style>
