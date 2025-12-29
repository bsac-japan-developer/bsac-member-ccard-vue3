<template>
  <div>
    <v-ons-button
      modifier="quiet"
      v-if="versionUpMessage"
      @click="toAppStore"
      class="version-up-message"
    >
      {{ versionUpMessage }}
    </v-ons-button>
  </div>
</template>

<script>
export default {
  created: function () {
    this.checkVersion();
  },
  data() {
    return {
      versionUpMessage: null,
    };
  },
  methods: {
    /**
     * アプリバージョンをチェックする
     */
    async checkVersion() {
      // サーバからアプリ情報を取得する
      await this.$store.dispatch('appInformation/show');

      const appInformation = this.$store.getters['appInformation/appInformation'];

      const needVersionUp = this.$store.getters['appInformation/needVersionUp'];

      this.versionUpMessage = needVersionUp
        ? `最新版アプリが公開されました （${appInformation.version}）`
        : null;
    },
    /**
     * アップストアへ遷移する
     */
    toAppStore: async function () {
      const appStoreUrl = this.$store.getters['appInformation/appStoreUrl'](
        this.$ons.platform.isIOS()
      );

      this.$ons.notification.confirm({
        title: 'アップデート',
        messageHTML: `アプリストアへ移動します`,
        buttonLabels: ['キャンセル', 'アプリストアへ'],
        callback: function (index) {
          if (index != 1) return;

          if (window?.cordova?.InAppBrowser) {
            window.cordova.InAppBrowser.open(appStoreUrl, '_system', 'location=yes');
          } else {
            // プラグインが利用できない場合は通常のブラウザで開く
            window.open(appStoreUrl, '_blank');
          }
        },
      });
    },
  },
  name: 'VersionCheck',
};
</script>

<style scoped>
.version-up-message {
  margin: 0;
  z-index: 10;
  color: red;
  font-size: 1rem;
  text-decoration: underline;
}
</style>
