<template>
  <v-ons-page>
    <splitter-toolbar :title="'ランク'"></splitter-toolbar>
    <div id="content__header">
      <version-check ref="versionCheck" />
    </div>
    <div id="content__body">ボディ</div>
    <div id="content__footer">フッター</div>
    <v-ons-button @click="signout"> ログアウト </v-ons-button>
  </v-ons-page>
</template>

<script>
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';
import versionCheck from '@/components/parts/VersionCheck.vue';

export default {
  components: {
    splitterToolbar,
    versionCheck,
  },
  computed: {},
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
        const results = await Promise.all([this.$store.dispatch('member/show')]);
      } catch (error) {
        console.error(error);
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * ログアウトする
     * @param answer
     */
    signout: async function () {
      this.$emit('show-loading-navigation');
      try {
        await this.$store.dispatch('user/signout');
        // ログインページに戻る
        this.$emit('show-signin-page-navigation');
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/signout] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
  },
  name: 'CardFrontPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
</style>
