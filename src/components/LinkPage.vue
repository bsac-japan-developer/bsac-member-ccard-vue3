<template>
  <v-ons-page>
    <splitter-toolbar :title="'各種リンク'"></splitter-toolbar>
    <div id="content__header"></div>
    <div id="content__body">
      <div v-for="link in links" :key="link.id" class="link-flex-item">
        <v-ons-button
          modifier="quiet"
          class="open-link-button"
          @click="openExternalSite(`${link.url}`)"
        >
          <img :src="`data:image/png;base64, ${link.logoBase64}`" class="image-link" />
          <br />
          <span v-html="link.name"></span>
        </v-ons-button>
      </div>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';

export default {
  components: { splitterToolbar },
  computed: {
    links: function () {
      const isFreeMember = this.$store.getters['member/member']?.diveCenterId === 0;
      // console.log(`isFreeMember: ${isFreeMember}`);
      const authParam = this.$store.getters['user/user']?.authParam;
      // console.log(`authParam: ${authParam}`);

      const links = this.$store.getters['link/links']?.filter(
        (link) => link?.name !== 'ショッピング' || isFreeMember
      );
      links.forEach((link) => {
        if (link?.name === 'ショッピング' && authParam) link.url += '?auth=' + authParam;
      });
      return links;
    },
  },
  created: function () {},
  data() {
    return {};
  },
  methods: {
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
  },
  name: 'LinkPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';

.image-link {
  margin: 10% 0 0 0;
  width: 30%;
  min-width: 50px;
  height: auto;
}

.link-flex-container {
  margin: 0 0 0 0;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  /* text-align: center; */
  /* border: solid 1px blue; */
}

.link-flex-item {
  margin: 0 auto 0 auto;
  width: 100%;
  max-width: 200px;
  min-width: 150px;

  /* border: solid 1px red; */
}

.open-link-button {
  margin: 0 0 0 0;
  font-size: 0.8rem;
}
</style>
