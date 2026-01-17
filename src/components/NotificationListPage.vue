<template>
  <v-ons-page>
    <splitter-toolbar :title="'お知らせ'"></splitter-toolbar>
    <div id="content__header">
      <div class="readall">
        <v-ons-button modifier="quiet" @click="doHasReadAll"> 全て既読にする </v-ons-button>
      </div>
    </div>
    <div id="content__body">
      <v-ons-list-header class="list-header">
        <div class="header-title">総合お知らせ</div>
        <div class="reload">
          <v-ons-button modifier="quiet" @click="refresh" class="button">
            <img src="../../www/images/reload.png" class="image" />
          </v-ons-button>
        </div>
      </v-ons-list-header>
      <v-ons-list v-for="notification in notifications" :key="notification.id">
        <v-ons-list-item
          tappable
          @click="toNotificationDetailPage(notification.id, notification?.updatedAt)"
          class="list-item"
        >
          <div class="list-item-content">
            <div class="left">
              <div class="unread-sign">
                <span v-if="!notification?.hasRead" class="text-style">●</span>
              </div>
            </div>
            <div class="right">
              <div class="notification-title">
                <img src="../../www/images/notification_icon.png" class="icon" />
                <p class="text-style">{{ notification?.title }}</p>
              </div>
              <div class="notification-updated-at">
                <img src="../../www/images/schedule_icon.png" class="icon" />
                <p class="text-style" style="font-size: 0.85rem">{{ notification?.updatedAt }}</p>
              </div>
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';
import notificationDetailPage from '@/components/NotificationDetailPage.vue';

export default {
  components: {
    splitterToolbar,
  },
  computed: {
    /**
     * お知らせ一覧
     */
    notifications: function () {
      return this.$store.getters['notification/notifications'];
    },
    online: function () {
      return this.$store.getters['env/online'];
    },
  },
  methods: {
    /**
     * 全て既読にする
     */
    doHasReadAll: function () {
      for (let notification of this.notifications) {
        this.$store.commit('notification/addReadNotifications', {
          id: notification?.id,
          updatedAt: notification?.updatedAt,
        });
        this.$store.commit('notification/hasRead', {
          id: notification?.id,
          updatedAt: notification?.updatedAt,
        });
      }
    },
    /**
     * お知らせ詳細情報を取得する
     */
    toNotificationDetailPage: async function (id, updatedAt) {
      this.$emit('show-loading-navigation');
      try {
        // 詳細情報を取得する
        // データ取得処理を並列実行
        const results = await Promise.all([this.$store.dispatch('notification/show', id)]);

        // エラーの場合、メッセージを表示する
        let success = true;
        results.forEach((result, index) => {
          success = success && result.success;
          if (!result.success)
            this.$ons.notification.alert({
              title: 'お知らせ情報取得',
              message: result.message,
            });
        });

        if (success) {
          this.$emit('push-page-navigation', markRaw(notificationDetailPage));
          this.$store.commit('notification/addReadNotifications', { id: id, updatedAt: updatedAt });
          this.$store.commit('notification/hasRead', { id: id, updatedAt: updatedAt });
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/toNotificationDetailPage] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * お知らせ一覧情報を再取得する
     */
    refresh: async function () {
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

        // データ取得処理を並列実行
        const results = await Promise.all([this.$store.dispatch('notification/index')]);

        this.$ons.notification.alert({
          title: 'データ取得',
          message: this.online ? 'お知らせを更新しました' : 'サーバに接続できません',
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
  },
  name: 'NotificationListPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header > .header-title {
  margin-left: 0.5rem;
  font-size: 1.1rem;
}

.list-header > .reload > .button > .image {
  margin-top: 0.5rem;
  width: 1.5rem;
}

.list-item {
  background-color: #ececf2;
  border-bottom: 1px solid black;
}

.list-item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.list-item-content > .left {
  display: flex;
}

.list-item-content > .left > .unread-sign {
  margin: 0 0.5rem 0 0;
  min-width: 0.75rem;
}

.list-item-content > .left > .unread-sign .text-style {
  color: red;
  font-size: 1.5rem;
}

.list-item-content > .right {
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  min-height: 25px;
  text-align: left;
}

.list-item-content > .right > .notification-title {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  width: 100%;
}

.list-item-content > .right > .notification-updated-at {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 0.5rem;
}

.list-item-content > .right .icon {
  width: 1rem;
}

.list-item-content > .right .text-style {
  margin: 0 auto 0 0;
  padding: 0 0 0 0.5rem;
  font-size: 1rem;
}

.readall {
  text-align: right;
}
</style>
