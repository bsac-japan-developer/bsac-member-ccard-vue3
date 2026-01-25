<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">
      <span>申請</span>
    </navigation-toolbar>
    <div id="content__header">
      <p class="note">
        申請情報の一部が画面中のカード画像に表示されます。<br />
        ※現物カードを発行された場合も同様です。情報のカードを発行して再発行が必要となった場合、
        <span class="note" style="margin: 0; padding: 0; color: red; font-weight: bold">
          カード再発行の費用をご負担頂きますので
        </span>
        、情報にお間違いが無いか再度ご確認の程よろしくお願いいたします。
      </p>
      <p v-if="input.id && !input.properties.editable" class="note--center" style="color: red">
        {{ input.properties.notEditableMessage }}
      </p>
    </div>
    <div id="content__body">
      <div class="input-area">
        <v-ons-list modifier="inset">
          <v-ons-list-header>
            <span class="list-header">申請ランク情報</span>
          </v-ons-list-header>
          <v-ons-list-item v-if="input.id" modifier="longdivider">
            <span class="list-item-title"> 申請ID </span>
            <div class="list-item-value">
              <span style="font-size: 1rem">{{ this.input.id }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> ランクグループ </span>
            <div class="list-item-value">
              <select
                v-model="input.rankGroupId"
                class="selectbox"
                style="width: 100%; text-align-last: left"
                @change="validate()"
                :disabled="!input.properties.editable"
              >
                <option v-for="rankGroup in rankGroups" :key="rankGroup.id" :value="rankGroup.id">
                  {{ rankGroup.value }}
                </option>
              </select>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> ランク </span>
            <div class="list-item-value">
              <select
                v-model="input.rankId"
                class="selectbox"
                style="width: 100%; text-align-last: left"
                @change="validate()"
                :disabled="!input.properties.editable"
              >
                <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
                  {{ rank.value }}
                </option>
              </select>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.rankId }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title">
              認定日
              <p class="list-item-title-note" style="color: red">
                認定を受けてから2週間以内に申請手続きを完了しないと、受付が出来ない場合がございますのでご注意下さい。
              </p>
            </span>
            <div class="list-item-value">
              <div class="inputs-side-by-side-wrapper">
                <div>
                  <select
                    v-model="input.certifyAtYear"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="year in years(1)" :key="year.value">
                      {{ year.value }}
                    </option>
                  </select>
                  <label class="datetime-label">年</label>
                </div>
                <div>
                  <select
                    v-model="input.certifyAtMonth"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="month in months" :key="month.value">
                      {{ month.value }}
                    </option>
                  </select>
                  <label class="datetime-label">月</label>
                </div>
                <div>
                  <select
                    v-model="input.certifyAtDay"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="day in certifyAtDays" :key="day.value">
                      {{ day.value }}
                    </option>
                  </select>
                  <label class="datetime-label">日</label>
                </div>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.certifyAt }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 認定メンバー </span>
            <span v-if="input.properties.editable" class="list-item-title-note">
              メンバーNOを入力して下さい
            </span>
            <div class="list-item-value">
              <div v-if="input.properties.editable" class="inputs-side-by-side-wrapper">
                <v-ons-input
                  placeholder="1234"
                  type="text"
                  inputmode="numeric"
                  v-model="input.certifierMemberId"
                  @blur="validate()"
                  :readonly="!input.properties.editable"
                  modifier="material"
                  class="textbox--20"
                ></v-ons-input>
                <span class="certifier-member-name">
                  {{ certifierMemberName }}
                </span>
              </div>
              <div v-if="!input.properties.editable">
                <v-ons-input
                  type="text"
                  v-model="input.certifierMemberName"
                  :readonly="!input.properties.editable"
                  modifier="material"
                  class="textbox"
                ></v-ons-input>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.certifierMemberId }}
            </span>
          </v-ons-list-item>
          <v-ons-list-header>
            <span class="list-header">所属</span>
          </v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> ダイブセンター </span>
            <div class="list-item-value">
              <div v-if="input.properties.editable" class="inputs-side-by-side-wrapper">
                <select
                  v-model="input.diveCenterId"
                  class="selectbox"
                  style="width: 100%; text-align-last: left; font-size: 1rem"
                  @change="
                    confirmChangingDiveCenter();
                    validate();
                  "
                  :disabled="!input.properties.editable"
                >
                  <option
                    v-for="diveCenter in diveCenters"
                    :key="diveCenter.id"
                    :value="diveCenter.id"
                    v-once
                  >
                    {{ diveCenter.value }}
                  </option>
                </select>
              </div>
              <div v-if="!input.properties.editable">
                <v-ons-input
                  type="text"
                  v-model="input.diveCenterName"
                  :readonly="!input.properties.editable"
                  modifier="material"
                  class="textbox"
                ></v-ons-input>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.diveCenterId }}
            </span>
          </v-ons-list-item>
          <!-- <v-ons-list-item modifier="longdivider" v-if="input.diveCenterId === 0">
            <span class="list-item-title"> フリーメンバー </span>
            <span v-if="input.properties.editable" class="list-item-title-note">
              メンバーNOを入力して下さい
            </span>
            <div class="list-item-value">
              <div v-if="input.properties.editable" class="inputs-side-by-side-wrapper">
                <v-ons-input
                  placeholder="1234"
                  type="text"
                  inputmode="numeric"
                  v-model="input.memberId"
                  @blur="validate()"
                  :disabled="!input.properties.editable"
                  modifier="material"
                  class="textbox--20"
                ></v-ons-input>
                <span class="certifier-member-name">
                  {{ freeMemberName }}
                </span>
              </div>
              <div v-if="!input.properties.editable">
                <v-ons-input
                  type="text"
                  v-model="input.memberName"
                  :readonly="!input.properties.editable"
                  modifier="material"
                  class="textbox"
                ></v-ons-input>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.memberId }}
            </span>
          </v-ons-list-item> -->
          <v-ons-list-header>
            <span class="list-header">申請者情報</span>
          </v-ons-list-header>
          <!-- <v-ons-list-item v-if="input.diverId" modifier="longdivider">
            <span class="list-item-title">ダイバーID</span>
            <div class="list-item-value">
              <span style="font-size: 1rem">{{ input.diverId }}</span>
            </div>
          </v-ons-list-item> -->
          <v-ons-list-item v-if="input.memberId" modifier="longdivider">
            <span class="list-item-title">メンバーID</span>
            <div class="list-item-value">
              <span style="font-size: 1rem">{{ input.memberId }}</span>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 氏名（漢字） </span>
            <span v-if="input.properties.editable" class="list-item-title-note">
              姓・名の間に<span class="red-bold">全角</span>スペースを入れて下さい
            </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="海野　太郎"
                type="text"
                v-model="input.nameJa"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.nameJa }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 氏名（かな） </span>
            <span v-if="input.properties.editable" class="list-item-title-note">
              姓・名の間に<span class="red-bold">全角</span>スペースを入れて下さい
            </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="うみの　たろう"
                type="text"
                v-model="input.nameKana"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.nameKana }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 氏名（英字） </span>
            <span v-if="input.properties.editable" class="list-item-title-note">
              姓・名の間に<span class="red-bold">半角</span>スペースを入れて下さい<br />
              <span class="blue">名→姓の順で入力をお願いします</span>
            </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="TARO UMINO"
                type="text"
                v-model="input.nameEn"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.nameEn }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 性別 </span>
            <div class="list-item-value">
              <select
                v-model="input.gender"
                @change="validate()"
                :disabled="!input.properties.editable"
                class="selectbox"
                style="width: 30%; text-align-last: left"
              >
                <option v-for="gender in genders" :key="gender.id" :value="gender.id">
                  {{ gender.value }}
                </option>
              </select>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.gender }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 生年月日 </span>
            <div class="list-item-value">
              <div class="inputs-side-by-side-wrapper">
                <div>
                  <select
                    v-model="input.birthAtYear"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="year in years(120)" :key="year.value">
                      {{ year.value }}
                    </option>
                  </select>
                  <label class="datetime-label">年</label>
                </div>
                <div>
                  <select
                    v-model="input.birthAtMonth"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="month in months" :key="month.value">
                      {{ month.value }}
                    </option>
                  </select>
                  <label class="datetime-label">月</label>
                </div>
                <div>
                  <select
                    v-model="input.birthAtDay"
                    @change="validate()"
                    :disabled="!input.properties.editable"
                    class="selectbox"
                  >
                    <option v-for="day in birtAtDays" :key="day.value">
                      {{ day.value }}
                    </option>
                  </select>
                  <label class="datetime-label">日</label>
                </div>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.birthAt }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 郵便番号 </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="101-0035"
                type="text"
                inputmode="numeric"
                v-model="input.postcode"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox--30"
              ></v-ons-input>
              <v-ons-button
                @click="setAddressByPostcode()"
                :disabled="!input.properties.editable"
                class="button--postcode-conversion"
              >
                住所をセット
              </v-ons-button>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.postcode }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 都道府県 </span>
            <div class="list-item-value">
              <select
                v-model="input.prefecture"
                @change="validate()"
                :disabled="!input.properties.editable"
                class="selectbox"
                style="width: 30%; text-align-last: left"
              >
                <option v-for="prefecture in prefectures" :key="prefecture">
                  {{ prefecture }}
                </option>
              </select>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.prefecture }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 住所１（市区町村・丁目番地） </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="千代田区神田紺屋町１３"
                type="text"
                v-model="input.address1st"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.address1st }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> 住所２（マンション等） </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="サンビル４F"
                type="text"
                v-model="input.address2nd"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.address2nd }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <p class="list-item-title">電話番号</p>
            <p v-if="input.properties.editable" class="list-item-title-note">
              自宅の電話番号または携帯番号をご記入ください<br />
              ハイフンは不要
            </p>
            <span class="list-item-title"> 自宅： </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="0352975656"
                type="text"
                inputmode="numeric"
                v-model="input.phoneNo"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox--40"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.phoneNo }}
            </span>
            <span class="list-item-title" style="margin-top: 0.5rem"> 携帯： </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="09012345678"
                type="text"
                inputmode="numeric"
                v-model="input.mobileNo"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox--40"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.mobileNo }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <p class="list-item-title">メールアドレス</p>
            <span v-if="input.properties.editable" class="list-item-title-note">
              ランク申請控えメールの送信先をご記入ください
            </span>
            <div class="list-item-value">
              <v-ons-input
                placeholder="taro_umino@bsac.co.jp"
                type="text"
                inputmode="email"
                v-model="input.email"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.email }}
            </span>
          </v-ons-list-item>
          <!-- <v-ons-list-header v-if="input.rankGroupId !== 3">
            <span class="list-header">他教育機関認定情報（クロスオーバーの場合のみ入力）</span>
          </v-ons-list-header>
          <v-ons-list-item v-if="input.rankGroupId !== 3" modifier="longdivider">
            <span class="list-item-title">教育機関名</span>
            <div class="list-item-value">
              <v-ons-input
                placeholder=""
                type="text"
                v-model="input.crossoverAssosiationName"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.crossoverAssosiationName }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item v-if="input.rankGroupId !== 3" modifier="longdivider">
            <span class="list-item-title">ランク名</span>
            <div class="list-item-value">
              <v-ons-input
                placeholder=""
                type="text"
                v-model="input.crossoverRankName"
                @blur="validate()"
                :readonly="!input.properties.editable"
                :disabled="!crossoverRquired"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.crossoverRankName }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item v-if="input.rankGroupId !== 3" modifier="longdivider">
            <span class="list-item-title">カードNo</span>
            <div class="list-item-value">
              <v-ons-input
                placeholder=""
                type="text"
                v-model="input.crossoverCardNo"
                @blur="validate()"
                :readonly="!input.properties.editable"
                :disabled="!crossoverRquired"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.crossoverCardNo }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item v-if="input.rankGroupId !== 3" modifier="longdivider">
            <span class="list-item-title"> 認定日 </span>
            <div class="list-item-value">
              <div class="inputs-side-by-side-wrapper">
                <div>
                  <select
                    v-model="input.crossoverCertifyAtYear"
                    @change="validate()"
                    :disabled="!input.properties.editable || !crossoverRquired"
                    class="selectbox"
                  >
                    <option v-for="year in years(120)" :key="year.value">
                      {{ year.value }}
                    </option>
                  </select>
                  <label class="datetime-label">年</label>
                </div>
                <div>
                  <select
                    v-model="input.crossoverCertifyAtMonth"
                    @change="validate()"
                    :disabled="!input.properties.editable || !crossoverRquired"
                    class="selectbox"
                  >
                    <option v-for="month in months" :key="month.value">
                      {{ month.value }}
                    </option>
                  </select>
                  <label class="datetime-label">月</label>
                </div>
                <div>
                  <select
                    v-model="input.crossoverCertifyAtDay"
                    @change="validate()"
                    :disabled="!input.properties.editable || !crossoverRquired"
                    class="selectbox"
                  >
                    <option v-for="day in crossoverDays" :key="day.value">
                      {{ day.value }}
                    </option>
                  </select>
                  <label class="datetime-label">日</label>
                </div>
              </div>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.crossoverCertifyAt }}
            </span>
          </v-ons-list-item> -->
          <v-ons-list-header>
            <span class="list-header">その他</span>
          </v-ons-list-header>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title">備考</span>
            <div class="list-item-value">
              <v-ons-input
                placeholder=""
                type="text"
                v-model="input.remarks"
                @blur="validate()"
                :readonly="!input.properties.editable"
                modifier="material"
                class="textbox"
              ></v-ons-input>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.remarks }}
            </span>
          </v-ons-list-item>
          <v-ons-list-item modifier="longdivider">
            <span class="list-item-title"> カード返送先 </span>
            <div class="list-item-value">
              <select
                v-model="input.deliverCardTo"
                class="selectbox"
                style="width: 50%; text-align-last: left"
                @change="validate()"
              >
                <option
                  v-for="destination in cardSendingDestinations"
                  :key="destination.id"
                  :value="destination.id"
                >
                  {{ destination.value }}
                </option>
              </select>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.deliverCardTo }}
            </span>
          </v-ons-list-item>
          <v-ons-list-header v-if="needIdPhoto">
            <span class="list-header">写真</span>
          </v-ons-list-header>
          <v-ons-list-item v-if="needIdPhoto" modifier="longdivider">
            <div style="width: 100%; text-align: center">
              <v-ons-button
                @click="toPhotoSelectionPage"
                :disabled="!input.properties.editable"
                class="button"
              >
                写真を選択する
              </v-ons-button>
              <img v-if="idPhoto" :src="`data:image/jpg;base64, ${idPhoto}`" />
              <v-ons-button
                v-if="idPhoto"
                @click="clearPhotoImage"
                :disabled="!input.properties.editable"
                class="button"
              >
                写真をクリア
              </v-ons-button>
            </div>
            <span v-if="input.properties.editable" class="validation-message">
              {{ this.error.idPhoto }}
            </span>
          </v-ons-list-item>
        </v-ons-list>
      </div>
    </div>
    <div id="content__footer">
      <v-ons-button
        v-if="input.properties.editable"
        @click="toCardApplicationConfirmPage"
        class="button"
      >
        確認画面へ
      </v-ons-button>
      <v-ons-button
        v-if="input.id && input.properties.editable"
        @click="confirmDelete"
        modifier="cta"
        class="button--red"
      >
        申請を取り消す
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import cardApplicationConfirmPage from '@/components/CardApplicationConfirmPage.vue';
import conversions from '@/common/conversions';
import photoSelectionPage from '@/components/PhotoSelectionPage.vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
import selectboxValues from '@/common/selectbox-values';
import validations from '@/common/validations';

export default {
  components: { navigationToolbar },
  computed: {
    /**
     * 日リスト
     */
    birtAtDays: function () {
      return selectboxValues.getDays({
        year: this.input.birthAtYear,
        month: this.input.birthAtMonth,
      });
    },
    /**
     * 登録可能かを判定する
     */
    canSubmit: function () {
      let result = true;
      result = result && this.error.address1st === null;
      result = result && this.error.address2nd === null;
      result = result && this.error.birthAt === null;
      result = result && this.error.certifierMemberId === null;
      result = result && this.error.certifyAt === null;
      // result = result && this.error.crossoverAssosiationName === null;
      // result = result && this.error.crossoverCardNo === null;
      // result = result && this.error.crossoverCertifyAt === null;
      // result = result && this.error.crossoverRankName === null;
      result = result && this.error.deliverCardTo === null;
      result = result && this.error.diveCenterId === null;
      // result = result && this.error.diverId === null;
      // result = result && this.error.diverUserId === null;
      result = result && this.error.deliverCardTo === null;
      result = result && this.error.email === null;
      result = result && this.error.gender === null;
      result = result && this.error.memberId === null;
      result = result && this.error.mobileNo === null;
      result = result && this.error.nameEn === null;
      result = result && this.error.nameKana === null;
      result = result && this.error.nameJa === null;
      result = result && this.error.partnerUserId === null;
      result = result && this.error.phoneNo === null;
      result = result && this.error.idPhoto === null;
      result = result && this.error.postcode === null;
      result = result && this.error.prefecture === null;
      result = result && this.error.rankId === null;
      result = result && this.error.remarks === null;
      return result;
    },
    /**
     * 申請リスト
     */
    cardApplications: function () {
      return this.$store.getters['ccardApplication/cardApplications'];
    },
    /**
     * 認定メンバー名
     */
    certifierMemberName: function () {
      return this.$store.getters['ccardApplication/memberName'](this.input.certifierMemberId);
    },
    /**
     * 他団体認定情報・日リスト
     */
    certifyAtDays: function () {
      return selectboxValues.getDays({
        year: this.input.certifyAtYear,
        month: this.input.certifyAtMonth,
      });
    },
    /**
     * 他団体認定情報・日リスト
     */
    crossoverDays: function () {
      return selectboxValues.getDays({
        year: this.input.crossoverCertifyAtYear,
        month: this.input.crossoverCertifyAtMonth,
      });
    },
    /**
     * カード返送先リスト
     */
    cardSendingDestinations: function () {
      return this.$store.getters['ccardApplication/cardSendingDestinations'];
    },
    /**
     * クロスオーバー必須可否
     */
    crossoverRquired: function () {
      return this.input.crossoverAssosiationName?.length > 0;
    },
    /**
     * ダイブセンターリスト
     */
    diveCenters: function () {
      return this.$store.getters['ccardApplication/diveCenters'];
    },
    /**
     * フリーメンバー名
     */
    freeMemberName: function () {
      return this.$store.getters['ccardApplication/freeMemberName'](this.input.memberId);
    },
    /**
     * フリーメンバーリスト
     */
    freeMembers: function () {
      return this.$store.getters['ccardApplication/members'](0);
    },
    /**
     * 性別リスト
     */
    genders: function () {
      return this.$store.getters['ccardApplication/genders'];
    },
    /**
     * 写真画像
     */
    idPhoto: function () {
      return this.$store.getters['ccardApplication/idPhoto'];
    },
    /**
     * 認証可否
     */
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
    /**
     * 写真要否
     */
    needIdPhoto: function () {
      return this.$store.getters['ccardApplication/needIdPhoto'](this.input.rankId);
    },
    /**
     * メンバーリスト
     */
    members: function () {
      return this.$store.getters['ccardApplication/members'](null);
    },
    /**
     * 月リスト
     */
    months: function () {
      return selectboxValues.getMonths();
    },
    /**
     * 都道府県リスト
     */
    prefectures: function () {
      return selectboxValues.prefectures;
    },
    /**
     * ランクグループリスト
     */
    rankGroups: function () {
      return this.$store.getters['ccardApplication/rankGroups'];
    },
    /**
     * ランクリスト
     */
    ranks: function () {
      return this.$store.getters['ccardApplication/ranks'](this.input.rankGroupId);
    },
  },
  created: function () {
    this.setData(false);
  },
  data() {
    return {
      input: {
        address1st: null,
        address2nd: null,
        birthAtDay: null,
        birthAtMonth: null,
        birthAtYear: null,
        certifierMemberId: null,
        certifyAtDay: null,
        certifyAtMonth: null,
        certifyAtYear: null,
        crossoverAssosiationName: null,
        crossoverCardNo: null,
        crossoverCertifyAtDay: null,
        crossoverCertifyAtMonth: null,
        crossoverCertifyAtYear: null,
        crossoverRankName: null,
        deliverCardTo: null,
        diveCenterId: null,
        diverId: null,
        diverUserId: null,
        email: null,
        gender: null,
        id: null,
        memberId: null,
        mobileNo: null,
        nameEn: null,
        nameKana: null,
        nameJa: null,
        partnerUserId: null,
        phoneNo: null,
        postcode: null,
        prefecture: null,
        properties: null,
        rankGroupId: 1,
        rankId: null,
        remarks: null,
        updatedAt: null,
      },
      error: {
        address1st: '',
        address2nd: '',
        birthAt: '',
        certifierMemberId: '',
        certifyAt: '',
        crossoverAssosiationName: '',
        crossoverCardNo: '',
        crossoverCertifyAt: '',
        crossoverRankName: '',
        deliverCardTo: '',
        diveCenterId: '',
        diverId: '',
        diverUserId: '',
        email: '',
        gender: '',
        idPhoto: '',
        memberId: '',
        mobileNo: '',
        nameEn: '',
        nameKana: '',
        nameJa: '',
        partnerUserId: '',
        phoneNo: '',
        postcode: '',
        prefecture: '',
        rankId: '',
        remarks: '',
      },
    };
  },
  methods: {
    /**
     * ダイブセンター変更時に確認する
     */
    confirmChangingDiveCenter: function () {
      if (!this.isAuthenticated) return;

      const application = this.$store.getters['ccardApplication/cardApplication'];
      if (!application || Object.keys(application).length < 1) return;
      if (this.input.diveCenterId === application.diveCenterId) return;

      this.$ons.notification.confirm({
        title: '確認',
        message: `所属ダイブセンターを変更します。よろしいですか？`,
        buttonLabels: ['いいえ', 'はい'],
        callback: (answer) => {
          console.log(`callback`);
          if (answer === 1) return;
          this.input.diveCenterId = application.diveCenterId;
        },
      });
    },
    /**
     * 選択した写真をクリアする
     */
    clearPhotoImage: function () {
      this.$store.commit('ccardApplication/setIdPhoto', null);
    },
    /**
     * 削除前の確認を行う
     */
    confirmDelete: function () {
      this.$ons.notification.confirm({
        title: '確認',
        message: `申請を取り消しますか？`,
        buttonLabels: ['いいえ', 'はい'],
        callback: (answer) => {
          if (answer === 1) this.submitDelete();
        },
      });
    },
    /**
     * 申請確認画面に遷移する
     */
    toCardApplicationConfirmPage: function () {
      if (!this.canSubmit) {
        this.$ons.notification.confirm({
          title: '確認',
          message: '入力エラーがあります<br>確認してください',
          buttonLabels: ['はい'],
        });
        return;
      }
      this.$store.commit('ccardApplication/setInput', this.input);
      this.$emit('push-page-navigation', markRaw(cardApplicationConfirmPage));
    },
    /**
     * 郵便番号から住所を取得しテキストボックスにセットする
     */
    setAddressByPostcode: async function () {
      try {
        let address = await conversions.toAddressByPostcode(this.input.postcode);
        this.input.prefecture = address.prefecture;
        this.input.address1st = address.address1st;
        this.validate();
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/setAddressByPostcode] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     * データをセットする
     */
    setData: function (isCopy) {
      const application = this.$store.getters['ccardApplication/cardApplication'];
      if (!application || Object.keys(application).length < 1) {
        this.validate();
        return;
      }
      this.input.address1st = application?.address1st;
      this.input.address2nd = application?.address2nd;
      this.input.birthAtDay = application?.birthAtDay;
      this.input.birthAtMonth = application?.birthAtMonth;
      this.input.birthAtYear = application?.birthAtYear;
      if (!isCopy) this.input.certifierMemberId = application?.certifierMemberId;
      this.input.certifierMemberName = application?.certifierMemberName;
      this.input.certifyAtDay = isCopy
        ? String(new Date().getDay() + 1).padStart(2, '0')
        : application?.certifyAtDay;
      this.input.certifyAtMonth = isCopy
        ? String(new Date().getMonth() + 1).padStart(2, '0')
        : application?.certifyAtMonth;
      this.input.certifyAtYear = isCopy
        ? String(new Date().getFullYear()).padStart(4, '0')
        : application?.certifyAtYear;
      if (!isCopy) this.input.crossoverAssosiationName = application?.crossoverAssosiationName;
      if (!isCopy) this.input.crossoverCardNo = application?.crossoverCardNo;
      if (!isCopy) this.input.crossoverCertifyAtDay = application?.crossoverCertifyAtDay;
      if (!isCopy) this.input.crossoverCertifyAtMonth = application?.crossoverCertifyAtMonth;
      if (!isCopy) this.input.crossoverCertifyAtYear = application?.crossoverCertifyAtYear;
      if (!isCopy) this.input.crossoverRankName = application?.crossoverRankName;
      this.input.deliverCardTo = application?.deliverCardTo;
      this.input.diveCenterId = application?.diveCenterId;
      this.input.diveCenterName = application?.diveCenterName;
      this.input.email = application?.email;
      // this.input.diverId = application?.diverId;
      // this.input.diverUserId = application?.diverUserId;
      if (!isCopy) this.input.properties = application?.properties;
      this.input.gender = application?.gender;
      if (!isCopy) this.input.id = application?.id;
      this.input.memberId = application?.memberId;
      this.input.memberName = application?.memberName;
      this.input.mobileNo = application?.mobileNo;
      this.input.nameEn = application?.nameEn;
      this.input.nameKana = application?.nameKana;
      this.input.nameJa = application?.nameJa;
      this.input.partnerUserId = application?.partnerUserId;
      this.input.phoneNo = application?.phoneNo;
      this.input.postcode = application?.postcode;
      this.input.prefecture = application?.prefecture;
      if (!isCopy) this.input.rankGroupId = application?.rankGroupId;
      if (!isCopy) this.input.rankId = application?.rankId;
      this.input.remarks = application?.remarks;
      if (!isCopy) this.input.status = application?.status;
      this.input.updatedAt = application?.updatedAt;
      this.validate();
      // console.log(`this.input: ${JSON.stringify(this.input)}`);
    },
    /**
     * 送信する
     */
    submitDelete: async function () {
      try {
        this.$store.commit('ccardApplication/setInput', this.input);

        // 申請を取り消す
        const result = await this.$store.dispatch('ccardApplication/destroy');

        this.$ons.notification.alert({
          title: '申請',
          message: result.message || 'エラーが発生しました',
        });

        // 登録成功時は入力データをクリアして一覧画面に戻る
        if (result.success) {
          this.$store.commit('ccardApplication/setInput', null);
          this.$store.commit('ccardApplication/setIdPhoto', null);
          this.$store.dispatch('ccardApplication/index');
          this.$emit('pop-page-navigation');
        } else {
          this.$ons.notification.alert({ title: 'エラー', message: result.message });
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/submitDelete] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     * 写真選択画面を表示する
     */
    toPhotoSelectionPage: function () {
      this.$emit('push-page-navigation', markRaw(photoSelectionPage));
    },
    /**
     * 入力チェックする
     */
    validate: function () {
      try {
        let message = null;
        /**
         * 住所１
         */
        this.error.address1st = validations.validateChars({
          value: this.input.address1st,
          size: 100,
          requiredCheck: true,
        });
        /**
         * 住所２
         */
        this.error.address2nd = validations.validateChars({
          value: this.input.address2nd,
          size: 100,
          requiredCheck: false,
        });
        /**
         * 生年月日
         */
        this.error.birthAt = validations.validateDate({
          value: {
            year: this.input.birthAtYear,
            month: this.input.birthAtMonth,
            day: this.input.birthAtDay,
          },
          requiredCheck: true,
        });
        /**
         * 認定インストラクター
         */
        this.input.certifierMemberId = isNaN(parseInt(this.input.certifierMemberId))
          ? null
          : parseInt(this.input.certifierMemberId);
        if (!this.certifierMemberName) this.input.certifierMemberId = null;
        this.error.certifierMemberId = validations.validateChars({
          value: this.input.certifierMemberId,
          size: 10,
          requiredCheck: true,
        });
        /**
         * 認定日
         */
        this.error.certifyAt = validations.validateDate({
          value: {
            year: this.input.certifyAtYear,
            month: this.input.certifyAtMonth,
            day: this.input.certifyAtDay,
          },
          requiredCheck: true,
          futureCheck: this.input.rankGroupId !== 3,
        });
        /**
         * 他団体認定情報・教育機関名
         */
        // if (this.input.rankGroupId === 3) this.input.crossoverAssosiationName = null;
        // this.error.crossoverAssosiationName = validations.validateChars({
        //   value: this.input.crossoverAssosiationName,
        //   size: 50,
        //   requiredCheck: false,
        // });
        /**
         * 他団体認定情報・カードNo
         */
        // if (this.input.rankGroupId === 3 || !this.crossoverRquired)
        //   this.input.crossoverCardNo = null;
        // this.error.crossoverCardNo = validations.validateChars({
        //   value: this.input.crossoverCardNo,
        //   size: 50,
        //   requiredCheck: this.crossoverRquired,
        // });
        /**
         * 他団体認定情報・認定日
         */
        // if (this.input.rankGroupId === 3 || !this.crossoverRquired) {
        //   this.input.crossoverCertifyAtYear = null;
        //   this.input.crossoverCertifyAtMonth = null;
        //   this.input.crossoverCertifyAtDay = null;
        // }
        // this.error.crossoverCertifyAt = validations.validateDate({
        //   value: {
        //     year: this.input.crossoverCertifyAtYear,
        //     month: this.input.crossoverCertifyAtMonth,
        //     day: this.input.crossoverCertifyAtDay,
        //   },
        //   requiredCheck: this.crossoverRquired,
        // });
        /**
         * 他団体認定情報・ランク名
         */
        // if (this.input.rankGroupId === 3 || !this.crossoverRquired)
        //   this.input.crossoverRankName = null;
        // this.error.crossoverRankName = validations.validateChars({
        //   value: this.input.crossoverRankName,
        //   size: 50,
        //   requiredCheck: this.crossoverRquired,
        // });
        /**
         * カード返送先
         */
        // this.error.deliverCardTo = validations.validateChars({
        //   value: this.input.deliverCardTo,
        //   size: 1,
        //   requiredCheck: true,
        // });
        /**
         * カード送付先
         */
        this.error.deliverCardTo = validations.validateChars({
          value: this.input.deliverCardTo,
          size: 1,
          requiredCheck: true,
        });
        /**
         * ダイブセンターID
         */
        this.error.diveCenterId = validations.validateChars({
          value: this.input.diveCenterId,
          size: 10,
          requiredCheck: true,
        });
        /**
         * メールアドレス
         */
        this.error.email = validations.validateChars({
          value: this.input.email,
          size: 100,
          requiredCheck: true,
          emailCheck: true,
        });
        /**
         * ダイバーID
         */
        // this.error.diverId = null;
        /**
         * ダイバーユーザーID
         */
        // this.error.diverUserId = validations.validateChars({
        //   value: this.input.diverUserId,
        //   size: 10,
        //   requiredCheck: true,
        // });
        /**
         * 性別
         */
        this.error.gender = validations.validateChars({
          value: this.input.gender,
          size: 1,
          requiredCheck: true,
        });
        /**
         * メンバーID
         */
        this.error.memberId = null;
        // this.input.memberId = isNaN(parseInt(this.input.memberId))
        //   ? null
        //   : parseInt(this.input.memberId);
        // if (!this.freeMemberName) this.input.memberId = null;
        // if (this.input.diveCenterId === 0) {
        //   if (this.input.memberId === -1) this.input.memberId = null;
        //   this.error.memberId = validations.validateChars({
        //     value: this.input.memberId,
        //     size: 10,
        //     requiredCheck: true,
        //   });
        // } else {
        //   this.input.memberId = -1;
        //   this.error.memberId = null;
        // }
        /**
         * 氏名（英字）
         */
        this.input.nameEn = conversions.toHalfUpper(this.input.nameEn);
        this.error.nameEn = validations.validateChars({
          value: this.input.nameEn,
          size: 50,
          requiredCheck: true,
        });
        /**
         * 氏名（かな）
         */
        this.error.nameKana = validations.validateChars({
          value: this.input.nameKana,
          size: 50,
          requiredCheck: true,
        });
        /**
         * 氏名（漢字）
         */
        this.error.nameJa = validations.validateChars({
          value: this.input.nameJa,
          size: 50,
          requiredCheck: true,
        });
        /**
         * パートナーユーザーID
         */
        this.error.partnerUserId = null;
        /**
         * 電話番号、携帯番号
         */
        this.error.phoneNo = validations.validateChars({
          value: this.input.phoneNo,
          size: 20,
          numericHyphenCheck: true,
          requiredCheck: false,
        });
        this.error.mobileNo = validations.validateChars({
          value: this.input.mobileNo,
          size: 20,
          numericHyphenCheck: true,
          requiredCheck: false,
        });
        if (!this.error.mobileNo) {
          this.error.mobileNo =
            !this.input.phoneNo && !this.input.mobileNo
              ? '自宅か携帯のどちらかを入力して下さい'
              : null;
        }
        /**
         * 写真画像
         */
        if (!this.needIdPhoto) this.idPhoto = null;
        this.error.idPhoto = this.needIdPhoto && !this.idPhoto ? '必須項目です' : null;
        /**
         * 郵便番号
         */
        this.error.postcode = validations.validateChars({
          value: this.input.postcode,
          size: 8,
          requiredCheck: true,
          numericHyphenCheck: true,
        });
        /**
         * 都道府県
         */
        this.error.prefecture = validations.validateChars({
          value: this.input.prefecture,
          size: 10,
          requiredCheck: true,
        });
        /**
         * ランク
         */
        this.error.rankId = validations.validateChars({
          value: this.input.rankId,
          size: 3,
          requiredCheck: true,
        });
        /**
         * 都道府県
         */
        this.error.remarks = validations.validateChars({
          value: this.input.remarks,
          size: 50,
          requiredCheck: false,
        });
        // console.log(`this.error: ${JSON.stringify(this.error)}`);
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/validate] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     * 年リスト
     */
    years: function (getBackYears) {
      const thisYear = new Date().getFullYear();
      return selectboxValues.getYears(thisYear, thisYear - getBackYears);
    },
  },
  mounted: function () {
    document.addEventListener('deviceready', () => {
      console.log('Cordova is ready');
    });
  },
  name: 'CardApplicationInputPage',
  watch: {
    idPhoto(newVal, oldVal) {
      this.validate();
    },
  },
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.certifier-member-name {
  margin: 0 0 0 1rem;
  padding: 0 0 0.25rem 0;
  font-size: 1rem;
  line-height: 1.5rem;
}

.img {
  max-width: 100%;
  height: auto;
}
</style>
