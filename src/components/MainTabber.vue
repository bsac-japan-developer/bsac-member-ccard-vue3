<template>
  <v-ons-page>
    <v-ons-tabbar
      animation="none"
      position="auto"
      :tabs="tabs"
      :visible="isAuthenticated"
      v-model:active-index="activeIndex"
      @hide-loading-tabber="hideLoading"
      @show-loading-tabber="showLoading"
      @show-signin-page-tabber="showSigninPage"
      @show-main-page-tabber="showMainPage"
    >
    </v-ons-tabbar>
    <loading :isLoading="isLoading" />
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import cardNavigation from '@/components/CardNavigation.vue';
import linkNavigation from '@/components/LinkNavigation.vue';
import loading from '@/components/parts/Loading.vue';
import myPageNavigation from '@/components/MyPageNavigation.vue';
import signinNavigation from '@/components/SigninNavigation.vue';

export default {
  components: {
    cardNavigation,
    linkNavigation,
    loading,
    myPageNavigation,
    signinNavigation,
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
  },
  created: function () {
    if (this.isAuthenticated) {
      // 外部からタブ切替要求を受ける（例: this.$emitter.emit('activate:tab', index)）
      if (this.$emitter && typeof this.$emitter.on === 'function') {
        this.$emitter.on('activate:tab', (index) => {
          if (typeof index === 'number') this.activeIndex = index;
        });
      }

      return;
    }

    // 未認証の場合、ログインページに遷移する
    this.showSigninPage();
  },
  data() {
    return {
      activeIndex: 0,
      isLoading: false,
      tabs: [
        {
          icon: this.isAndroid() ? null : 'ion-ios-home',
          label: 'ランク',
          page: markRaw(cardNavigation),
        },
        {
          icon: this.isAndroid() ? null : 'ion-ios-bookmarks',
          label: '各種リンク',
          page: markRaw(linkNavigation),
        },
        {
          icon: this.isAndroid() ? null : 'ion-ios-person',
          label: 'マイページ',
          page: markRaw(myPageNavigation),
        },
      ],
    };
  },
  methods: {
    /**
     * ローディング画面を隠す
     */
    hideLoading: function () {
      this.isLoading = false;
    },
    /**
     * Androidか否かを判定する
     */
    isAndroid: function () {
      return this.$ons.platform.isAndroid();
    },
    /**
     * ローディング画面を表示する
     */
    showLoading: function () {
      this.isLoading = true;
    },
    /**
     * メインページを表示する
     */
    showMainPage: async function () {
      this.activeIndex = 0;
      this.tabs[0].page = markRaw(cardNavigation);
    },
    /**
     * ログインページを表示する
     */
    showSigninPage: function () {
      this.activeIndex = 0;
      this.tabs[0].page = markRaw(signinNavigation);
    },
  },
  name: 'MainTabber',
  props: {
    activeTab: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    activeTab(newVal) {
      this.activeIndex = newVal;
    },
  },
};
</script>
