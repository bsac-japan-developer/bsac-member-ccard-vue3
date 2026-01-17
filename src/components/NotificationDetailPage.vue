<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">お知らせ</navigation-toolbar>
    <div id="content__header"></div>
    <div id="content__body">
      <div class="notification-detail">
        <div class="updated-at">
          <img src="../../www/images/notification_icon.png" class="icon" />
          <p class="text-style">
            {{ notification.updatedAt }}
          </p>
        </div>
        <div class="title">
          <p class="text-style">
            {{ notification.title }}
          </p>
        </div>
        <div v-html="notification.content" class="content"></div>
        <div class="attached-files-wrapper">
          <p
            v-if="notification.attachedFiles && notification.attachedFiles.length > 0"
            class="text-style"
          >
            添付ファイル
          </p>
          <div class="attached-files">
            <div v-for="file in notification.attachedFiles" :key="file.name" class="attached-file">
              <v-ons-button
                modifier="quiet"
                @click="openAttachedFile(notification.id, file?.name)"
                class="button"
              >
                <img
                  v-if="file?.name?.toLowerCase().endsWith('jpg')"
                  :src="`data:image/jpeg;base64, ${file?.base64File}`"
                  style="width: 100px"
                />
                <img
                  v-if="file?.name?.toLowerCase().endsWith('pdf')"
                  src="../../www/images/pdf.png"
                  style="width: 80px"
                />
                <p class="text-style" style="font-size: 0.85rem">{{ file?.name }}</p>
              </v-ons-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {
    /**
     * お知らせ詳細
     */
    notification: function () {
      return this.$store.getters['notification/notification'];
    },
  },
  created() {},
  data() {
    return {};
  },
  methods: {
    /**
     * 添付ファイルを開く
     */
    openAttachedFile(notificationId, fileName) {
      const url = `${this.$store.getters['env/baseURL']}api/v2/member_app/notifications/${notificationId}/attached_files/${fileName}`;
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
  name: 'NotificationDetailPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.notification-detail {
  margin: 0.5rem auto 1rem auto;
  width: 90%;
  text-align: left;
}

.notification-detail > .attached-files-wrapper > .attached-files {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  margin: 1rem 0 1rem 0;
  text-align: center;
}

.notification-detail > .attached-files-wrapper > .attached-files > .attached-file {
  flex-basis: 110px;
}

.notification-detail > .attached-files-wrapper > .attached-files > .attached-file > .button {
  margin: 0.25rem 0.25rem 0.5rem 0.25rem;
  padding: 0;
}

.notification-detail > .content {
  margin: 1rem auto;
  padding: 0.75rem;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
}

.notification-detail .icon {
  width: 1rem;
  margin-right: 0.5rem;
}

.notification-detail .text-style {
  margin: 0;
  padding: 0;

  font-size: 1rem;
}

.notification-detail > .title > .text-style {
  font-size: 1.2rem;
}

.notification-detail > .updated-at {
  display: flex;
  align-items: center;
  flex-direction: row;

  margin-bottom: 1rem;
}
</style>
