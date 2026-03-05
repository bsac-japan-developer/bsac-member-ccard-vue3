<template>
  <v-ons-navigator
    animation="lift"
    v-model:page-stack="pageStack"
    @hide-loading-navigation="hideLoading"
    @pop-page-navigation="pageStack = pageStack.slice(0, -1)"
    @push-page-navigation="pageStack = [...pageStack, $event]"
    @replace-page-navigation="pageStack = [...pageStack.slice(0, -1), $event]"
    @show-loading-navigation="showLoading"
  ></v-ons-navigator>
</template>

<script>
import { markRaw } from 'vue';
import notificationListPage from '@/components/NotificationListPage.vue';

export default {
  computed: {
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
  },
  created: function () {},
  data() {
    return {
      pageStack: [markRaw(notificationListPage)],
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
  },
  mounted: function () {
    const clearBadge = () => {
      try {
        // FirebaseX の API を使ってバッジを0に
        if (window.FirebasePlugin && typeof window.FirebasePlugin.setBadgeNumber === 'function') {
          window.FirebasePlugin.setBadgeNumber(
            0,
            () => {
              this.$logger.info(`[${this.$options.name}] FirebasePlugin.setBadgeNumber OK`);
            },
            (err) => {
              this.$logger.error(
                `[${this.$options.name}] FirebasePlugin.setBadgeNumber error ${err}`
              );
            }
          );
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}] clearBadge error ${error}`);
      }
    };

    const setup = () => {
      if (this.$ons.platform.isIOS() || this.$ons.platform.isAndroid()) {
        // プッシュ通知用トピックを登録する（存在チェックとログ付き）
        try {
          const topic = this.$store.getters['env/topic'];
          if (window.FirebasePlugin && typeof window.FirebasePlugin.subscribe === 'function') {
            window.FirebasePlugin.subscribe(
              topic,
              () => this.$logger.info(`[${this.$options.name}] subscribed ${topic}`),
              (err) => this.$logger.error(`[${this.$options.name}] subscribe error ${err}`)
            );
          }
        } catch (err) {
          this.$logger.error(`[${this.$options.name}] subscribe exception ${err}`);
        }

        // バッジを消す
        clearBadge();

        // 端末がフォアグラウンドに戻ったときにもバッジを消す
        try {
          document.addEventListener('resume', clearBadge, false);
        } catch (err) {
          this.$logger.warn(`[${this.$options.name}] resume listener not attached: ${err}`);
        }
      }
    };

    // Cordova プラグインが利用可能になるのを待つ
    if (window.cordova) {
      document.addEventListener('deviceready', setup, false);
    } else {
      // web 上（開発）ではすぐセットアップ
      setup();
    }
  },
  name: 'NotificationNavigation',
  watch: {
    isAuthenticated(newVal, oldVal) {
      // newValがtrue（認証済）の場合、ページを初期化してスクロール位置を一番上に設定する
      if (newVal) {
        this.pageStack = [markRaw(notificationListPage)];
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
