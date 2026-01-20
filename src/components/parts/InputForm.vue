<template>
  <div v-for="(group, index) in inputForms" :key="group.groupName">
    <v-ons-list
      v-if="group.groupName !== '内部情報'"
      modifier="inset"
      :style="index === 0 ? null : `margin-top: 2rem`"
    >
      <v-ons-list-header>
        <span class="list-header">
          {{ group.groupName }}
          <span
            v-if="group.groupCaution"
            style="margin-left: 0.5rem; font-size: 0.7rem; color: red"
          >
            {{ group.groupCaution }}
          </span>
        </span>
      </v-ons-list-header>
      <v-ons-list-item
        v-for="item in group.inputItems"
        :key="item.key"
        :modifier="getListItemModifier(item.props?.modifier)"
        :style="getListItemStyle(group?.listItemStyle)"
      >
        <span class="list-item-title"> {{ item.props?.name }} </span>
        <span v-if="item.props?.note" class="list-item-title-note" v-html="item.props?.note"></span>
        <div class="list-item-value">
          <div v-if="item.props?.inputType === 'date-select'">
            <div class="inputs-side-by-side-wrapper">
              <div>
                <select
                  v-model="item.value.year"
                  @change="
                    validate();
                    updateDays(item.key);
                  "
                  class="selectbox"
                >
                  <option v-for="year in item.props?.selections?.years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                <label class="datetime-label">年</label>
              </div>
              <div>
                <select
                  v-model="item.value.month"
                  @change="
                    validate();
                    updateDays(item.key);
                  "
                  class="selectbox"
                >
                  <option
                    v-for="month in item.props?.selections?.months"
                    :key="month"
                    :value="month"
                  >
                    {{ month }}
                  </option>
                </select>
                <label class="datetime-label">月</label>
              </div>
              <div>
                <select v-model="item.value.day" @change="validate()" class="selectbox">
                  <option v-for="day in item.props?.selections?.days" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
                <label class="datetime-label">日</label>
              </div>
            </div>
          </div>
          <div v-if="item.props?.inputType === 'datetime-select'">
            <div class="inputs-side-by-side-wrapper">
              <div>
                <select
                  v-model="item.value.year"
                  @change="
                    validate();
                    updateDays(item.key);
                  "
                  :disabled="item.props?.readOnly"
                  class="selectbox"
                >
                  <option v-for="year in item.props?.selections?.years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                <label class="datetime-label">年</label>
              </div>
              <div>
                <select
                  v-model="item.value.month"
                  @change="
                    validate();
                    updateDays(item.key);
                  "
                  :disabled="item.props?.readOnly"
                  class="selectbox"
                >
                  <option
                    v-for="month in item.props?.selections?.months"
                    :key="month"
                    :value="month"
                  >
                    {{ month }}
                  </option>
                </select>
                <label class="datetime-label">月</label>
              </div>
              <div>
                <select
                  v-model="item.value.day"
                  @change="validate()"
                  :disabled="item.props?.readOnly"
                  class="selectbox"
                >
                  <option v-for="day in item.props?.selections?.days" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
                <label class="datetime-label">日</label>
              </div>
              <div class="datetime-select-time">
                <v-ons-input
                  v-model="item.value.hour"
                  @blur="validate()"
                  type="text"
                  placeholder="00"
                  class="textbox time"
                  inputmode="numeric"
                  maxlength="2"
                  :disabled="item.props?.readOnly"
                ></v-ons-input>
                <label class="datetime-label">時</label>
              </div>
              <div class="datetime-select-time">
                <v-ons-input
                  v-model="item.value.minute"
                  @blur="validate()"
                  type="text"
                  placeholder="00"
                  class="textbox time"
                  inputmode="numeric"
                  maxlength="2"
                  :disabled="item.props?.readOnly"
                ></v-ons-input>
                <label class="datetime-label">分</label>
              </div>
            </div>
          </div>
          <div v-if="item.props?.inputType === 'destination-select'">
            <select
              v-model="item.value"
              @change="validate()"
              class="selectbox"
              style="text-align-last: left"
              :style="`width: ${item.props?.width || '100%'}`"
            >
              <option
                v-for="selection in item.props?.selections"
                :key="selection.key"
                :value="selection.key"
              >
                {{ selection.name }}
              </option>
            </select>
          </div>
          <div v-if="item.props?.inputType === 'course-select'">
            <select
              v-model="item.value"
              @change="validate()"
              class="selectbox"
              style="text-align-last: left"
              :style="`width: ${item.props?.width || '100%'}`"
            >
              <option
                v-for="selection in getCourses(item.props?.selections)"
                :key="selection.key"
                :value="selection.key"
              >
                {{ selection.value }}
              </option>
            </select>
            <div v-if="showOtherText(item.props?.selections, item.value)" style="margin-top: 1rem">
              <div v-if="item.other.props?.inputType === 'text'">
                <v-ons-input
                  v-model="item.other.value"
                  @blur="validate()"
                  type="text"
                  :placeholder="item.other?.props?.placeholder"
                  modifier="material"
                  class="textbox"
                  :style="`width: ${item.props?.width || '100%'}`"
                ></v-ons-input>
              </div>
            </div>
          </div>
          <div v-if="item.props?.inputType === 'radio'">
            <div class="radio-container">
              <div v-for="selection in item.props?.selections" :key="selection.key">
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="item.value"
                    :id="item.key"
                    :value="selection?.value"
                    @change="validate()"
                  />
                  <span class="radio-circle"></span>
                  <span class="radio-label-text">{{ selection?.value }}</span>
                </label>
              </div>
            </div>
          </div>
          <div v-if="item.props?.inputType === 'select'">
            <select
              v-model="item.value"
              @change="validate()"
              class="selectbox"
              style="text-align-last: left"
              :style="`width: ${item.props?.width || '100%'}`"
            >
              <option
                v-for="selection in item.props?.selections"
                :key="selection.key"
                :value="selection.key"
              >
                {{ selection.value }}
              </option>
            </select>
          </div>
          <div
            v-if="
              ['text', 'email', 'password', 'text_with_diver_id_search'].includes(
                item.props?.inputType
              )
            "
          >
            <v-ons-button
              v-if="item.props?.inputType === 'text_with_diver_id_search'"
              modifier="quiet"
              @click="openDiverSearch"
              style="margin: 0; font-size: 0.9rem"
            >
              ダイバーIDが不明な方こちら
            </v-ons-button>
            <v-ons-input
              v-model="item.value"
              @blur="validate()"
              @input="onTextInput(item, $event)"
              :type="item.props?.inputType"
              :inputmode="item.props?.inputMode"
              :placeholder="item.props?.placeholder"
              :disabled="item.props?.readOnly"
              modifier="material"
              class="textbox"
              :style="`width: ${item.props?.width || '100%'}`"
            ></v-ons-input>
          </div>
          <div v-if="item.props?.inputType === 'textarea'">
            <textarea
              v-model="item.value"
              @blur="validate()"
              :cols="item.props?.cols || 10"
              :rows="item.props?.rows || 10"
              class="textarea"
              :disabled="item.props?.readOnly"
            >
            </textarea>
          </div>
          <div v-if="item.props?.inputType === 'postcode'">
            <v-ons-input
              v-model="item.value"
              @blur="validate()"
              type="text"
              inputmode="tel"
              :placeholder="item.props?.placeholder"
              modifier="material"
              class="textbox"
              style="width: 30%"
            ></v-ons-input>
            <v-ons-button @click="updateAddress(item.key)" class="button--postcode-conversion">
              住所をセット
            </v-ons-button>
          </div>
          <div v-if="item.props?.inputType === 'timespan'" class="timespan-wrapper">
            <v-ons-input
              v-model="item.value.from.hour"
              @blur="validate()"
              type="text"
              placeholder="00"
              class="textbox time"
              inputmode="numeric"
              maxlength="2"
            ></v-ons-input>
            <label class="datetime-label">時</label>
            <v-ons-input
              v-model="item.value.from.minute"
              @blur="validate()"
              type="text"
              placeholder="00"
              class="textbox time"
              inputmode="numeric"
              maxlength="2"
            ></v-ons-input>
            <label class="datetime-label">分 〜</label>
            <v-ons-input
              v-model="item.value.to.hour"
              @blur="validate()"
              type="text"
              placeholder="00"
              class="textbox time"
              inputmode="numeric"
              maxlength="2"
            ></v-ons-input>
            <label class="datetime-label">時</label>
            <v-ons-input
              v-model="item.value.to.minute"
              @blur="validate()"
              type="text"
              placeholder="00"
              class="textbox time"
              inputmode="numeric"
              maxlength="2"
            ></v-ons-input>
            <label class="datetime-label">分</label>
          </div>
          <div v-if="item.props?.inputType === 'year-month-select'">
            <div class="inputs-side-by-side-wrapper">
              <div>
                <select v-model="item.value.year" @change="validate()" class="selectbox">
                  <option v-for="year in item.props?.selections?.years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                <label class="datetime-label">年</label>
              </div>
              <div>
                <select v-model="item.value.month" @change="validate()" class="selectbox">
                  <option
                    v-for="month in item.props?.selections?.months"
                    :key="month"
                    :value="month"
                  >
                    {{ month }}
                  </option>
                </select>
                <label class="datetime-label">月</label>
              </div>
            </div>
          </div>
        </div>
        <span class="validation-message">
          {{ item.error }}
        </span>
      </v-ons-list-item>
    </v-ons-list>
  </div>
</template>

<script>
import conversions from '@/common/conversions';
import validations from '@/common/validations';

export default {
  computed: {},
  created: function () {
    this.inputForms
      .flatMap((group) =>
        group.inputItems
          .filter(
            (item) =>
              item.props?.inputType === 'date-select' || item.props?.inputType === 'datetime-select'
          )
          .map((item) => item.key)
      )
      .forEach((key) => {
        this.updateDays(key);
      });

    this.validate();
  },
  data() {
    return {
      test: null,
    };
  },
  emits: ['get-data', 'to-diver-search-page'],
  methods: {
    /**
     * 送付先の選択値によりコースを取得する
     * @param courses
     */
    getCourses: function (courses) {
      let selection = null;
      this.inputForms.forEach((group) => {
        group.inputItems.forEach((item) => {
          if (item.key === 'destination') {
            selection = item.props?.selections.find((selection) => selection.id === item.value);
          }
        });
      });
      if (selection && selection?.type !== 3) {
        return courses.filter((course) => course?.types.includes('bsac'));
      }
      if (selection && selection?.type === 3) {
        return courses.filter((course) => course?.types.includes('other'));
      }
    },
    /**
     * Itemを取得する
     * @param key
     */
    getItem: function (key) {
      if (!key) return null;
      return this.inputForms
        .find((group) => group.inputItems.some((item) => item.key === key))
        ?.inputItems.find((item) => item.key === key);
    },
    /**
     * ListItemのmodifierを取得する
     * @param modifier
     */
    getListItemModifier: function (modifier) {
      return modifier || 'longdivider';
    },
    /**
     * ListItemのstyleを取得する
     * @param style
     */
    getListItemStyle: function (style) {
      let value = style || '';
      if (value.includes('background-color')) value += `; border-bottom: 1px solid #d7d7d7`;
      return value;
    },
    /**
     * ダイバー検索画面を表示する
     */
    openDiverSearch: function () {
      this.$emit('to-diver-search-page');
    },
    /**
     *
     */
    onTextInput: function (item, event) {
      try {
        if (item?.props?.upperCaseConversion) {
          // event.target.value が取れればそれを優先、無ければ item.value を使用
          const raw =
            event && event.target && typeof event.target.value === 'string'
              ? event.target.value
              : typeof item.value === 'string'
                ? item.value
                : '';

          const upper = raw.toUpperCase();
          // v-model に反映（これで画面の表示も更新されます）
          item.value = upper;
        }
        if (item?.props?.lowerCaseConversion) {
          // event.target.value が取れればそれを優先、無ければ item.value を使用
          const raw =
            event && event.target && typeof event.target.value === 'string'
              ? event.target.value
              : typeof item.value === 'string'
                ? item.value
                : '';

          const lower = raw.toLowerCase();
          // v-model に反映（これで画面の表示も更新されます）
          item.value = lower;
        }
      } catch (e) {
        console.error('[InputForm/onTextInput] ', e);
      }
    },
    /**
     * その他テキストボックスの表示・非表示を判定する
     */
    showOtherText: function (selections, value) {
      if (!selections || !value) return false;
      const selection = selections.find((selection) => selection.value === value);
      return selection?.showTextbox;
    },
    /**
     * ダイバー情報をテキストボックスにセットする
     * @param diver
     */
    setDiverForSignupForRegisteredPage: function (diver) {
      // console.log(
      //   `[InputForm] setDiverForSignupForRegisteredPage called. diver ${JSON.stringify(diver)}`
      // );
      if (!diver) return;

      this.inputForms.forEach((group) => {
        group.inputItems.forEach((item) => {
          // console.log(`item: ${JSON.stringify(item)}`);
          switch (item.key) {
            case 'diver_id':
              item.value = diver?.id;
              break;
            case 'ccard_no':
              item.value = String(diver?.ccardNo ?? '').replace(/-/g, '');
              break;
            case 'name':
              item.value = diver?.nameEn;
              break;
          }
        });
      });
      this.validate();
    },
    /**
     * 入力チェックする
     */
    validate: function () {
      try {
        let valid = true;

        this.inputForms.forEach((group) => {
          group.inputItems.forEach((item) => {
            item.error = this.validateItem(item);

            if (item.props?.inputType === 'course-select') {
              if (this.showOtherText(item.props?.selections, item.value)) {
                item.error = this.validateItem(item.other);
              }
            }

            if (item.validations?.optionalCheck) {
              const optionalCheck = item.validations?.optionalCheck;
              // console.log(`optionalCheck: ${JSON.stringify(optionalCheck)}`);
              let values = null;
              switch (optionalCheck?.name) {
                case 'conditional_required':
                  values = this.inputForms
                    .flatMap((group) =>
                      group.inputItems.filter((item) => item.key === optionalCheck?.item)
                    )
                    .map((item) => item?.value);
                  item.validations.required =
                    values.length > 0 && values[0] === optionalCheck?.value;
                  item.error = this.validateItem(item);
                  break;
                case 'multiple_conditional_required':
                  const conditions = optionalCheck?.conditions;
                  if (Array.isArray(conditions)) {
                    item.error = null;
                    conditions.forEach((condition) => {
                      values = this.inputForms
                        .flatMap((group) =>
                          group.inputItems.filter((item) => item.key === condition?.item)
                        )
                        .map((item) => item?.value);
                      item.validations.required =
                        values.length > 0 && values[0] === condition?.value;
                      if (!item.error) item.error = this.validateItem(item);
                    });
                  }
                  break;
                case 'phone_no_mobile_no':
                  values = this.inputForms
                    .flatMap((group) =>
                      group.inputItems.filter((item) => optionalCheck?.items.includes(item.key))
                    )
                    .map((item) => item?.value);
                  if (values.every((value) => value === '' || value === null)) {
                    item.error = optionalCheck?.message;
                  }
                  break;
                case 'same_value':
                  values = this.inputForms
                    .flatMap((group) =>
                      group.inputItems.filter((item) => optionalCheck?.items.includes(item.key))
                    )
                    .map((item) => item?.value);
                  // falseyな値が１つでもある場合は抜ける
                  if (values.some((value) => value === '' || value === null)) return;
                  // 全ての要素が同じ値かをチェックする
                  if (!values.every((value) => value === values[0])) {
                    item.error = optionalCheck?.message;
                  }
                  break;
              }
            }

            if (item.error) valid = false;
          });
        });

        let destination = null;
        let inputData = null;

        if (valid) {
          inputData = this.inputForms.reduce((acc, group) => {
            group.inputItems.forEach((item) => {
              if (!item.props?.skipSubmitData) {
                switch (item.props?.inputType) {
                  case 'date-select':
                    let dateStr = null;
                    if (item.value?.year && item.value?.month && item.value?.day)
                      dateStr = `${item.value?.year}-${item.value?.month}-${item.value?.day}`;
                    acc[item.key] = dateStr;
                    break;
                  case 'datetime-select':
                    let datetimeStr = null;
                    if (item.value?.year && item.value?.month && item.value?.day)
                      datetimeStr = `${item.value?.year}-${item.value?.month}-${item.value?.day} ${item.value?.hour}:${item.value?.minute}`;
                    acc[item.key] = datetimeStr;
                    break;
                  case 'destination-select':
                    // destinationにセットする
                    const selection = item.props?.selections.find(
                      (selection) => selection.id === item.value
                    );
                    // console.log(`destination-select selection: ${JSON.stringify(selection)}`);
                    if (selection) {
                      destination = selection
                        ? {
                            diveCenterId: selection.type === 1 ? selection.value : -1,
                            memberId: selection.type === 2 ? selection.value : -1,
                            otherName: selection.type === 3 ? selection.value : null,
                            otherEmail: selection.type === 3 ? selection.email : null,
                          }
                        : null;
                      // console.log(`destination: ${JSON.stringify(destination)}`);
                    }
                    break;
                  case 'course-select':
                    acc[item.key] = item.value;
                    if (this.showOtherText(item.props?.selections, item.value))
                      acc[item.key] = item.other?.value;
                    break;
                  case 'year-month-select':
                    let yearMonthStr = null;
                    if (item.value?.year && item.value?.month)
                      yearMonthStr = `${item.value?.year}-${item.value?.month}`;
                    acc[item.key] = yearMonthStr;
                    break;
                  default:
                    acc[item.key] = item.value;
                    break;
                }
              }
            });
            return acc;
          }, {});
        }

        this.$emit('get-data', {
          inputData: inputData,
          destination: destination,
        });
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/validateItem] ${error}`);
      }
    },
    /**
     * 各項目のデータタイプにより入力チェックを行う
     * @param item
     */
    validateItem: function (item) {
      let message = null;
      switch (item.validations?.type) {
        case 'date':
          return validations.validateDate({
            value: {
              year: item.value?.year,
              month: item.value?.month,
              day: item.value?.day,
            },
            requiredCheck: item.validations?.required || false,
          });
        case 'datetime':
          message = validations.validateDate({
            value: {
              year: item.value?.year,
              month: item.value?.month,
              day: item.value?.day,
            },
            requiredCheck: item.validations?.required || false,
          });
          if (!message) {
            return validations.validateTime({
              value: {
                hour: item.value?.hour,
                minute: item.value?.minute,
              },
              requiredCheck: item.validations?.required || false,
            });
          }
        case 'decimal':
          return validations.validateDecimal({
            value: item.value,
            requiredCheck: item.validations?.required || false,
            precision: item.validations?.precision || 0,
            scale: item.validations?.scale || 0,
          });
        case 'email':
          return validations.validateChars({
            value: item.value,
            requiredCheck: item.validations?.required || true,
            size: 100,
            emailCheck: true,
          });
        case 'password':
          return validations.validateChars({
            value: item.value,
            requiredCheck: true,
            size: 100,
            minSize: 8,
            alphaNumericSymbocCheck: true,
          });
        case 'postcode':
          return validations.validateChars({
            value: item.value,
            requiredCheck: item.validations?.required || false,
            size: 8,
            numericHyphenCheck: true,
          });
        case 'text':
          return validations.validateChars({
            value: item.value,
            requiredCheck: item.validations?.required || false,
            size: item.validations?.textSize || 65535,
            emailCheck: item.validations?.emailCheck || false,
            numericCheck: item.validations?.numericCheck || false,
            numericHyphenCheck: item.validations?.numericHyphenCheck || false,
          });
        case 'timespan':
          message = validations.validateTime({
            value: item.value.from,
            requiredCheck: item.validations?.required || false,
          });
          if (!message) {
            message = validations.validateTime({
              value: item.value.to,
              requiredCheck: item.validations?.required || false,
            });
          }
          return message;
        case 'yearmonth':
          return validations.validateDate({
            value: {
              year: item.value.year,
              month: item.value.month,
              day: item.value.year && item.value.month ? '01' : null,
            },
            requiredCheck: item.validations?.required || false,
          });
        default:
          return null;
      }
    },
    /**
     * 郵便番号から住所を更新する
     * @param key
     */
    updateAddress: async function (key) {
      try {
        // 郵便番号のItemを取得
        const postcode = this.getItem(key);
        if (!postcode?.updateTargetKey?.prefecture || !postcode?.updateTargetKey?.address1st)
          return;

        // 郵便番号から住所を取得
        if (!postcode.value) return;
        const address = await conversions.toAddressByPostcode(postcode.value);
        this.$logger.debug(`[${JSON.stringify(address)}`);

        // 都道府県をセット
        const prefecture = this.getItem(postcode?.updateTargetKey?.prefecture);
        prefecture.value = address.prefecture;

        // 住所１をセット
        const address1st = this.getItem(postcode?.updateTargetKey?.address1st);
        address1st.value = address.address1st;

        this.validate();
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/updateAddress] ${error}`);
      }
    },
    /**
     * 年月から日リストを更新する
     * @param key
     */
    updateDays: function (key) {
      try {
        // 年と月を取得
        const year = this.inputForms
          .find((group) => group.inputItems.some((item) => item.key === key))
          ?.inputItems.find((item) => item.key === key)?.value.year;

        const month = this.inputForms
          .find((group) => group.inputItems.some((item) => item.key === key))
          ?.inputItems.find((item) => item.key === key)?.value.month;

        // console.log(`year: ${year} month: ${month}`);

        if (!year || !month) return [];

        const daysInMonth = new Date(year, month, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));
        // console.log(`days: ${days}`);

        const targetItem = this.inputForms
          .find((group) => group.inputItems.some((item) => item.key === key))
          ?.inputItems.find((item) => item.key === key);

        if (Array.isArray(targetItem?.props?.selections?.days)) {
          targetItem.props.selections.days = days;
          // 日の選択値が日数を超えている場合、リセット
          if (targetItem.value.day > days.length) {
            targetItem.value.day = null;
          }
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/updateDays] ${error}`);
      }
    },
  },
  name: 'InputForm',
  props: {
    inputForms: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style scoped>
@import '../../stylesheets/base.css';
@import '../../stylesheets/form.css';

.timespan-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}

.timespan-wrapper > .datetime-label {
  margin: 0 0.5rem 0.5rem 0.5rem;
  font-size: 1rem;
}

.datetime-select-time {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.datetime-select-time > .textbox.time {
  width: 4rem;
  font-size: 1.2rem;
}

.datetime-select-time > .datetime-label {
  align-self: center;
  margin: 0 0.25rem 0 0.5rem;
  font-size: 1rem;
}

.textarea {
  font-size: 1rem;
  line-height: 1rem;
}
</style>
