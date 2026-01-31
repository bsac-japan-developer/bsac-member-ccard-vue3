<template>
  <v-ons-navigator
    animation="lift"
    v-model:page-stack="pageStack"
    @hide-loading-navigation="hideLoading"
    @pop-page-navigation="pageStack = pageStack.slice(0, -1)"
    @push-page-navigation="pageStack = [...pageStack, $event]"
    @replace-page-navigation="pageStack = [...pageStack.slice(0, -1), $event]"
    @show-loading-navigation="showLoading"
    @show-signin-page-navigation="showSigninPage"
  ></v-ons-navigator>
</template>

<script>
import { markRaw } from 'vue';
import myPage from '@/components/MyPage.vue';

export default {
  computed: {
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
  },
  created: function () {},
  data() {
    return {
      pageStack: [markRaw(myPage)],
    };
  },
  methods: {
    /**
     * ローディング画面を隠す
     */
    hideLoading: function () {
      this.$emit('hide-loading-tabber');
    },
    /**
     * ローディング画面を表示する
     */
    showLoading: function () {
      this.$emit('show-loading-tabber');
    },
    /**
     * ログインページを表示する
     */
    showSigninPage: function () {
      this.$emit('show-signin-page-tabber');
    },
  },
  mounted: function () {
    if (this.$ons.platform.isIOS() || this.$ons.platform.isAndroid()) {
      // プッシュ通知用トピックを登録する
      window.FirebasePlugin.subscribe(this.$store.getters['env/topic'], null, null);
    }
  },
  name: 'MyPageNavigation',
  watch: {
    isAuthenticated(newVal, oldVal) {
      // newValがtrue（認証済）の場合、ページを初期化してスクロール位置を一番上に設定する
      if (newVal) {
        this.pageStack = [markRaw(myPage)];
        this.$nextTick(() => {
          try {
            const pages = document.querySelectorAll('.page__content');
            pages.forEach((page) => {
              page.scrollTop = 0;
            });
          } catch (error) {
            this.$logger.error(`[${this.$options.name}/isAuthenticated] ${error}`);
            this.$ons.notification.alert({ title: 'エラー', message: error.message });
          }
        });
      }
    },
  },
};
</script>
