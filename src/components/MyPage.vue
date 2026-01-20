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
    member: function () {
      return this.$store.getters['member/member'] || {};
    },
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
  },
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
