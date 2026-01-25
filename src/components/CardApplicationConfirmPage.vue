<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">申請</navigation-toolbar>
    <div id="content__header">
      <p class="note">
        申請情報の一部が画面中のカード画像に表示されます。<br />
        ※現物カードを発行された場合も同様です。情報のカードを発行して再発行が必要となった場合、
        <span class="note" style="margin: 0; padding: 0; color: red; font-weight: bold">
          カード再発行の費用をご負担頂きますので
        </span>
        、情報にお間違いが無いか再度ご確認の程よろしくお願いいたします。
      </p>
    </div>
    <div id="content__body">
      <div class="input-area">
        <v-ons-list modifier="inset">
          <v-ons-list-header><span class="list-header">申請ランク情報</span></v-ons-list-header>
          <v-ons-list-item v-if="id" modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">申請ID：</span>
              <span class="list-item-value--row-1-col-2">{{ id }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">ランク：</span>
              <span class="list-item-value--row-1-col-2">{{ rankName }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">認定日：</span>
              <span class="list-item-value--row-1-col-2">
                {{ certifyAt }}
              </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">認定メンバー：</span>
              <span class="list-item-value--row-1-col-2">{{ certifierMemberName }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-header><span class="list-header">所属</span></v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">ダイブセンター：</span>
              <span class="list-item-value--row-1-col-2">
                {{ diveCenterName }}
              </span>
            </div>
          </v-ons-list-item>
          <!-- <v-ons-list-item v-if="memberName" modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">フリーメンバー：</span>
              <span class="list-item-value--row-1-col-2">{{ memberName }}</span>
            </div>
          </v-ons-list-item> -->
          <v-ons-list-header><span class="list-header">申請者情報</span></v-ons-list-header>
          <!-- <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">ダイバーID：</span>
              <span class="list-item-value--row-1-col-2">{{ diverId }}</span>
            </div>
          </v-ons-list-item> -->
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">メンバーユーザーID：</span>
              <span class="list-item-value--row-1-col-2">{{ partnerUserId }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">メンバーID：</span>
              <span class="list-item-value--row-1-col-2">{{ memberId }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">氏名（漢字）：</span>
              <span class="list-item-value--row-1-col-2">{{ nameJa }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">氏名（かな）：</span>
              <span class="list-item-value--row-1-col-2">{{ nameKana }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">氏名（英字）：</span>
              <span class="list-item-value--row-1-col-2">{{ nameEn }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">性別：</span>
              <span class="list-item-value--row-1-col-2">{{ gender }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">生年月日：</span>
              <span class="list-item-value--row-1-col-2">
                {{ birthAt }}
              </span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">郵便番号：</span>
              <span class="list-item-value--row-1-col-2">{{ postcode }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">都道府県：</span>
              <span class="list-item-value--row-1-col-2">{{ prefecture }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">住所１：</span>
              <span class="list-item-value--row-1-col-2">{{ address1st }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">住所２：</span>
              <span class="list-item-value--row-1-col-2">{{ address2nd }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">電話番号（自宅）：</span>
              <span class="list-item-value--row-1-col-2">{{ phoneNo }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">電話番号（携帯）：</span>
              <span class="list-item-value--row-1-col-2">{{ mobileNo }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">メールアドレス：</span>
              <span class="list-item-value--row-1-col-2">{{ email }}</span>
            </div>
          </v-ons-list-item>
          <!-- <v-ons-list-header>
            <span class="list-header">他教育機関認定情報（クロスオーバーの場合のみ入力）</span>
          </v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">教育機関名：</span>
              <span class="list-item-value--row-1-col-2">{{ crossoverAssosiationName }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">ランク名：</span>
              <span class="list-item-value--row-1-col-2">{{ crossoverRankName }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">カードNo：</span>
              <span class="list-item-value--row-1-col-2">{{ crossoverCardNo }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">認定日：</span>
              <span class="list-item-value--row-1-col-2">
                {{ crossoverCertifyAt }}
              </span>
            </div>
          </v-ons-list-item> -->
          <v-ons-list-header><span class="list-header">その他</span></v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">備考：</span>
              <span class="list-item-value--row-1-col-2">{{ remarks }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">カード送付先：</span>
              <span class="list-item-value--row-1-col-2">{{ deliverCardTo }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <div class="list-item-container">
              <span class="list-item-title">写真：</span>
              <span class="list-item-value--row-1-col-2">
                <img v-if="idPhoto" :src="`data:image/jpg;base64, ${idPhoto}`" />
              </span>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </div>
    </div>
    <div id="content__footer">
      <v-ons-button @click="confirm" class="button">
        申請する<span v-if="id">（更新）</span>
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
// import cardApplicationListPage from '@/components/CardApplicationListPage.vue';
import cardFrontPage from '@/components/CardFrontPage.vue';
import signinPage from '@/components/SigninPage.vue';

export default {
  components: { navigationToolbar },
  computed: {
    /**
     * 住所１
     */
    address1st: function () {
      return this.input?.address1st;
    },
    /**
     * 住所２
     */
    address2nd: function () {
      return this.input?.address2nd;
    },
    /**
     * 生年月日
     */
    birthAt: function () {
      const ret = `${this.input?.birthAtYear}-${this.input?.birthAtMonth}-${this.input?.birthAtDay}`;
      return ret.includes('null') || ret.includes('undefined') ? null : ret;
    },
    /**
     * 認定メンバー名
     */
    certifierMemberName: function () {
      return this.$store.getters['ccardApplication/memberName'](this.input?.certifierMemberId);
    },
    /**
     * 認定日
     */
    certifyAt: function () {
      const ret = `${this.input?.certifyAtYear}-${this.input?.certifyAtMonth}-${this.input?.certifyAtDay}`;
      return ret.includes('null') || ret.includes('undefined') ? null : ret;
    },
    /**
     * クロスオーバー（教育機関名）
     */
    crossoverAssosiationName: function () {
      return this.input?.crossoverAssosiationName;
    },
    /**
     * クロスオーバー（カードNO）
     */
    crossoverCardNo: function () {
      return this.input?.crossoverCardNo;
    },
    /**
     * クロスオーバー（認定日）
     */
    crossoverCertifyAt: function () {
      const ret = `${this.input?.crossoverCertifyAtYear}-${this.input?.crossoverCertifyAtMonth}-${this.input?.crossoverCertifyAtDay}`;
      return ret.includes('null') || ret.includes('undefined') ? null : ret;
    },
    /**
     * クロスオーバー（ランク名）
     */
    crossoverRankName: function () {
      return this.input?.crossoverRankName;
    },
    /**
     * カード送付先
     */
    deliverCardTo: function () {
      return this.$store.getters['ccardApplication/cardSendingDestinationValue'](
        this.input?.deliverCardTo
      );
    },
    /**
     * ダイブセンター名
     * @param id
     */
    diveCenterName: function () {
      return this.$store.getters['ccardApplication/diveCenterName'](this.input?.diveCenterId);
    },
    /**
     * ダイバーID
     */
    diverId: function () {
      return this.input?.diverId;
    },
    /**
     * メールアドレス
     */
    email: function () {
      return this.input?.email;
    },
    /**
     * 性別
     */
    gender: function () {
      return this.$store.getters['ccardApplication/genderValue'](this.input?.gender);
    },
    /**
     * ID
     */
    id: function () {
      return this.input?.id;
    },
    /**
     * 写真画像
     */
    idPhoto: function () {
      return this.$store.getters['ccardApplication/idPhoto'];
    },
    /**
     * 入力情報
     */
    input: function () {
      return this.$store.getters['ccardApplication/input'];
    },
    /**
     * 認証可否
     */
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
    /**
     * メンバーID
     */
    memberId: function () {
      return this.input?.memberId;
    },
    /**
     * メンバー名
     * @param
     */
    memberName: function () {
      return this.$store.getters['ccardApplication/memberName'](this.input?.memberId);
    },
    /**
     * 携帯番号
     */
    mobileNo: function () {
      return this.input?.mobileNo;
    },
    /**
     * 氏名（漢字）
     */
    nameJa: function () {
      return this.input?.nameJa;
    },
    /**
     * 氏名（かな）
     */
    nameKana: function () {
      return this.input?.nameKana;
    },
    /**
     * 氏名（英字）
     */
    nameEn: function () {
      return this.input?.nameEn;
    },
    /**
     * パートナーユーザーID
     */
    partnerUserId: function () {
      return this.input?.partnerUserId;
    },
    /**
     * 電話番号
     */
    phoneNo: function () {
      return this.input?.phoneNo;
    },
    /**
     * 郵便番号
     */
    postcode: function () {
      return this.input?.postcode;
    },
    /**
     * 都道府県
     */
    prefecture: function () {
      return this.input?.prefecture;
    },
    /**
     * ランク名
     */
    rankName: function () {
      return this.$store.getters['ccardApplication/rankName'](this.input?.rankId);
    },
    /**
     * 備考
     */
    remarks: function () {
      return this.input?.remarks;
    },
  },
  created: function () {},
  data() {
    return {};
  },
  methods: {
    /**
     * 処理前の確認を行う
     */
    confirm: function () {
      this.$ons.notification.confirm({
        title: '確認',
        message: `申請${this.input.id ? '（更新）' : ''}しますか？`,
        buttonLabels: ['いいえ', 'はい'],
        callback: (answer) => {
          if (answer === 1) this.submit();
        },
      });
    },
    /**
     * 送信する
     */
    submit: async function () {
      this.$emit('show-loading-navigation');
      try {
        // 申請情報を登録・更新する
        const method = this.input.id ? 'ccardApplication/update' : 'ccardApplication/create';
        const result = await this.$store.dispatch(method);

        this.$ons.notification.alert({
          title: '申請',
          message: result.message,
        });

        // 登録成功時は入力データをクリアして一覧画面に戻る
        if (result.success) {
          this.$store.commit('ccardApplication/setInput', null);
          this.$store.commit('ccardApplication/setIdPhoto', null);
          // this.$store.dispatch('ccardApplication/index');
          // this.$emit('replace-page-navigation', markRaw(cardApplicationListPage));
          this.$emit(
            'replace-page-navigation',
            this.isAuthenticated ? markRaw(cardFrontPage) : markRaw(signinPage)
          );
        } else {
          this.$ons.notification.alert({ title: 'エラー', message: result.message });
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/submit] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      } finally {
        this.$emit('hide-loading-navigation');
      }
    },
  },
  name: 'CardApplicationConfirmPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
