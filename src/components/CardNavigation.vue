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
import cardFrontPage from '@/components/CardFrontPage.vue';

export default {
  created: function () {},
  data() {
    return {
      pageStack: [markRaw(cardFrontPage)],
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
  name: 'CardNavigation',
};
</script>
