<template>
  <v-ons-page>
    <p style="color: red; font-size: 2rem">{{ this.$store.getters['env/mode'] }}</p>
    <div id="content__header">
      <img src="../../www/images/bsac_logo.png" class="bsac-logo-img" />
    </div>
    <div id="content__body">
      <p>
        <v-ons-input
          placeholder="メンバーサイト ID"
          type="text"
          inputmode="numeric"
          v-model="input.loginId"
          modifier="material"
          class="textbox--75"
        ></v-ons-input>
      </p>
      <p>
        <v-ons-input
          placeholder="メンバーサイト パスワード"
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
    <div>
      <p class="note">
        <ul>
          <li>
            ログインID・パスワードを紛失・お忘れの方は
            <v-ons-button
              modifier="quiet"
              @click="openExternalSite('https://www.bsac.co.jp/contact/')"
              style="display: inline; margin: 0; padding: 0"
            >
              こちら
            </v-ons-button>
            へお問合せください。
          </li>
          <li>ITセンター・ダイブセンターアカウントではログインすることができません。</li>
        </ul>
      </p>
    </div>
  </v-ons-page>
</template>

<script>
export default {
  components: {},
  computed: {
    user: function () {
      const user = this.$store.getters['user/user'];
      return user ? user : {};
    },
  },
  created: function () {
    this.input.loginId = this.$store.getters['env/data'].loginId;
    this.input.password = this.$store.getters['env/data'].password;
  },
  data() {
    return {
      input: {
        loginId: null,
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
      this.input.loginId = null;
      this.input.password = null;
    },
    /**
     * 指定したURLを外部ブラウザで開く
     * @param url
     */
    openExternalSite: function (url) {
      try {
        if (window?.cordova?.InAppBrowser) {
          window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
        } else {
          // プラグインが利用できない場合は通常のブラウザで開く
          window.open(url, '_blank');
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/openExternalSite] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
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
      const loginId = String(this.input.loginId ?? '').trim();
      const password = String(this.input.password ?? '').trim();

      if (!loginId) return 'メンバーIDが未入力です';
      if (!loginId.startsWith('2')) return '正しいメンバーIDを入力してください';
      if (!password) return 'パスワードが未入力です';

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
