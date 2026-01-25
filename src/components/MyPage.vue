<template>
  <v-ons-page>
    <splitter-toolbar :title="'マイページ'"></splitter-toolbar>
    <div id="content__header">
      <p class="note--center">登録中のメンバー情報を表示しています。</p>
    </div>
    <div id="content__body">
      <div class="input-area">
        <v-ons-list modifier="inset">
          <v-ons-list-header>
            <span class="list-header">登録情報</span>
          </v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">メンバーID：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.idWithRank }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">姓名：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.nameJa }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">姓名（英字）：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.nameEn }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">性別：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.genderJa }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">生年月日：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.birthAt }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">郵便番号：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.postcode }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">都道府県：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.prefecture }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">住所（市区町村）：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.address1st }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">住所（その他）：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.address2nd }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">電話番号：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.phoneNo }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">FAX番号：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.faxNo }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">携帯番号：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.mobileNo }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">メールアドレス：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.email }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">所属：</span>
              <span class="list-item-value--row-1-col-2"> {{ member?.diveCenterNameJa }} </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">ステータス：</span>
              <span class="list-item-value--row-1-col-2">
                {{ member?.status?.toUpperCase() }}
              </span>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <div class="expandable-area" style="margin: 2.5%">
        <v-ons-list modifier="noborder">
          <v-ons-list-item modifier="nodivider" expandable :expanded.sync="false">
            <div>アプリ情報</div>
            <div class="expandable-content" style="margin-bottom: 1rem">
              <v-ons-list modifier="inset">
                <v-ons-list-header>
                  <span class="list-header">アプリ環境情報</span>
                </v-ons-list-header>
                <v-ons-list-item modifier="longdivider">
                  <div class="list-item-container">
                    <span class="list-item-title">アプリバージョン：</span>
                    <span class="list-item-value--row-1-col-2">
                      {{ envVersion }}
                    </span>
                  </div>
                </v-ons-list-item>
                <v-ons-list-item modifier="longdivider">
                  <div class="list-item-container">
                    <span class="list-item-title">OSバージョン：</span>
                    <span class="list-item-value--row-1-col-2">
                      {{
                        deviceInfo?.platform
                          ? `${deviceInfo?.platform} ${deviceInfo?.version}`
                          : `${osVersion}`
                      }}
                    </span>
                  </div>
                </v-ons-list-item>
                <v-ons-list-item modifier="longdivider">
                  <div class="list-item-container">
                    <span class="list-item-title">機種内部名：</span>
                    <span class="list-item-value--row-1-col-2">
                      {{ deviceInfo?.model }}
                      <span v-if="deviceInfo?.model" style="display: block; font-size: 0.7rem">
                        ※ 機種名とは異なります
                      </span>
                    </span>
                  </div>
                </v-ons-list-item>
                <v-ons-list-item modifier="longdivider">
                  <div class="list-item-container">
                    <span class="list-item-title">トークン：</span>
                    <span class="list-item-value--row-1-col-2">
                      {{ fcmToken }}
                    </span>
                  </div>
                </v-ons-list-item>
              </v-ons-list>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </div>
    </div>
    <div id="content__footer">
      <v-ons-button
        @click="toMemberRegistrationChangePage"
        modifier="cta block"
        class="button-transition"
      >
        <div class="label-wrapper">
          <span class="title">メンバー登録情報の変更</span>
          <span class="arrow arrow-right"></span>
        </div>
      </v-ons-button>
      <v-ons-button @click="confirmSignout" modifier="quiet" class="button" style="font-size: 1rem">
        ログアウト
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import memberRegistrationChangePage from '@/components/MemberRegistrationChangePage.vue';
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';
import storage from '@/common/local-storage';

export default {
  components: {
    splitterToolbar,
  },
  computed: {
    envVersion: function () {
      return this.$store.getters['env/version'];
    },
    member: function () {
      return this.$store.getters['member/member'] || {};
    },
  },
  created: function () {},
  data() {
    return {
      osVersion: '',
      deviceInfo: {},
      fcmToken: null,
    };
  },
  methods: {
    /**
     * サインアウトの意思確認を行う
     */
    confirmSignout: function () {
      this.$ons.notification.confirm({
        title: '確認',
        message: 'ログアウトしますか？',
        buttonLabels: ['いいえ', 'はい'],
        callback: (answer) => {
          if (answer === 1) this.signout();
        },
      });
    },
    /**
     *
     */
    getDeviceInfoFromBrowser: function () {
      // console.log('Getting device info from browser...');
      const userAgent = navigator.userAgent;
      // console.log('User Agent:', userAgent);

      let osVersion = 'Browser';

      if (/iPad|iPhone|iPod/.test(userAgent)) {
        const match = userAgent.match(/OS (\d+_\d+_?\d*)/);
        if (match) {
          osVersion = `iOS ${match[1].replace(/_/g, '.')}`;
        } else {
          osVersion = 'iOS (version unknown)';
        }
      } else if (/Android/.test(userAgent)) {
        const match = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
        if (match) {
          osVersion = `Android ${match[1]}`;
        } else {
          osVersion = 'Android (version unknown)';
        }
      }

      this.osVersion = osVersion;
      // console.log('Detected OS version:', osVersion);
    },
    /**
     *
     */
    initializeDeviceInfo: function () {
      // console.log('Initializing device info...');

      // Cordova環境かどうかをチェック
      if (typeof cordova !== 'undefined') {
        // console.log('Cordova environment detected, waiting for deviceready...');
        document.addEventListener('deviceready', this.onDeviceReady, false);

        // タイムアウト処理（5秒後にフォールバック）
        setTimeout(() => {
          if (!this.osVersion) {
            // console.log('Device ready timeout, falling back to browser detection');
            this.getDeviceInfoFromBrowser();
          }
        }, 5000);
      } else {
        // console.log('Browser environment detected, using browser detection');
        this.getDeviceInfoFromBrowser();
      }
    },
    /**
     *
     */
    onDeviceReady: function () {
      // console.log('Device ready event fired');
      try {
        if (typeof device !== 'undefined') {
          // console.log('Device info available:');
          // console.log('- cordova:', device.cordova);
          // console.log('- version:', device.version);
          // console.log('- platform:', device.platform);
          // console.log('- model:', device.model);

          this.osVersion = device.version;
          this.deviceInfo = {
            cordova: device.cordova,
            platform: device.platform,
            version: device.version,
            model: device.model,
            manufacturer: device.manufacturer || 'Unknown',
          };
          // FCM トークン設定（deviceready 後に実行）
          if (this.setupFcmToken) this.setupFcmToken();
        } else {
          // console.warn('device object still not available after deviceready');
          this.getDeviceInfoFromBrowser();
        }
      } catch (error) {
        // console.error('Error in onDeviceReady:', error);
        this.getDeviceInfoFromBrowser();
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

        // ローカルストレージ全データ削除
        storage.clear();

        // ログインページに戻る
        this.$emit('show-signin-page-navigation');
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/signout] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * メンバー登録情報変更依頼画面に遷移する
     */
    toMemberRegistrationChangePage: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 新規作成情報を取得する;
        // データ取得処理を並列実行;
        const results = await Promise.all([this.$store.dispatch('memberChangeRequest/new')]);

        // エラーの場合、メッセージを表示する
        let success = true;
        results.forEach((result, index) => {
          success = success && result.success;
          if (!result.success)
            this.$ons.notification.alert({
              title: 'メンバー変更申請データ取得',
              message: result.message,
            });
        });

        if (success) this.$emit('push-page-navigation', markRaw(memberRegistrationChangePage));
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/toMemberRegistrationChangePage] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
    /**
     * FCM トークンを取得して画面に反映する
     */
    setupFcmToken: function () {
      if (!(this.$ons.platform.isIOS() || this.$ons.platform.isAndroid())) return;
      if (!window.FirebasePlugin || !window.FirebasePlugin.getToken) return;

      try {
        window.FirebasePlugin.getToken(
          (token) => {
            this.fcmToken = token;
            console.log('FCM token:', token);
          },
          (err) => {
            console.error('getToken error', err);
          }
        );

        if (window.FirebasePlugin.onTokenRefresh) {
          window.FirebasePlugin.onTokenRefresh((token) => {
            this.fcmToken = token;
            console.log('token refreshed:', token);
          });
        }
      } catch (e) {
        console.error('setupFcmToken error', e);
      }
    },
  },
  mounted: function () {
    this.initializeDeviceInfo();
    // マウント時にもトークン取得を試みる（ブラウザ/一部の環境用）
    if (this.setupFcmToken) this.setupFcmToken();
  },
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
