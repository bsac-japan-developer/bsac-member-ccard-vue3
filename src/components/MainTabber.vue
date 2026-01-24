<template>
  <v-ons-page>
    <v-ons-tabbar
      animation="none"
      position="auto"
      :tabs="tabs"
      :visible="isAuthenticated"
      v-model:active-index="activeIndex"
      @hide-loading-tabber="hideLoading"
      @show-incident-report-page-tabber="showIncidentReportPage"
      @show-loading-tabber="showLoading"
      @show-notification-page-tabber="showNotificationPage"
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
import incidentReportNavigation from '@/components/IncidentReportNavigation.vue';
import linkNavigation from '@/components/LinkNavigation.vue';
import loading from '@/components/parts/Loading.vue';
import myPageNavigation from '@/components/MyPageNavigation.vue';
import notificationNavigation from '@/components/NotificationNavigation.vue';
import signinNavigation from '@/components/SigninNavigation.vue';

export default {
  components: {
    cardNavigation,
    incidentReportNavigation,
    linkNavigation,
    loading,
    myPageNavigation,
    notificationNavigation,
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
          icon: this.isAndroid() ? null : 'ion-ios-alert',
          label: '事故報告',
          page: markRaw(incidentReportNavigation),
        },
        {
          icon: this.isAndroid() ? null : 'ion-ios-volume-high',
          label: 'お知らせ',
          page: markRaw(notificationNavigation),
        },
        {
          icon: this.isAndroid() ? null : 'ion-ios-link',
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
     * 事故報告ページを表示する
     */
    showIncidentReportPage: function () {
      this.activeIndex = 1;
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
     * お知らせ一覧ページを表示する
     */
    showNotificationPage: function () {
      this.activeIndex = 2;
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
