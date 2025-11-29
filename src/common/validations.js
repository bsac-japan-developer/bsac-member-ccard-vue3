export default {
  /**
   * 入力値が半角英数字記号かをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isAlphaNumericSymbol: function (value) {
    return new RegExp(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/).test(value);
  },
  /**
   * 入力値が日付形式かをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isDateFormat: function (value) {
    if (value === null) return true;
    if (value.includes('null')) return false;
    let date = new Date(value);
    return !isNaN(date.getDate());
  },
  /**
   * 入力値が半角英数字記号かをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isEmail: function (value) {
    return new RegExp(/^[A-Za-z0-9]{1}[A-Za-z0-9\\+_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]*$/).test(
      value
    );
  },
  /**
   * JSONかを判定する
   * @param {*} value
   * @returns
   */
  isJSON: function (value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  },
  /**
   * 入力値がNULLまたは空文字でないかをチェックする
   * @param {*} value
   * @returns
   */
  isNullOrEmpty: function (value) {
    if (value === null) return true;
    if (value === '') return true;
    return false;
  },
  /**
   * 入力値が半角数字のみかをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isNumeric: function (value) {
    return new RegExp(/^[0-9]*$/).test(value);
  },
  /**
   * 入力値が半角数字とハイフンのみかをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isNumericHyphen: function (value) {
    return new RegExp(/^[0-9\-]*$/).test(value);
  },
  /**
   * 入力値が半角数字とピリオドのみかをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isNumericPeriod: function (value) {
    return new RegExp(/^[0-9\.]*$/).test(value);
  },
  /**
   * 入力値が制限サイズを超えていないかをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isOver: function (value, size) {
    if (value === null) return false;
    if (value === undefined) return false;
    if (value.toString().length > size) return true;
    return false;
  },
  /**
   * 入力値が指定したサイズを満たしていないかをチェックする
   * @param {*} value
   * @param {*} size
   * @returns
   */
  isUnder: function (value, size) {
    if (value === null) return false;
    if (value === undefined) return false;
    if (value.toString().length < size) return true;
    return false;
  },
  /**
   * 文字列を検証する
   * @param {*} param0
   * @returns
   */
  validateChars: function ({
    value,
    size,
    minSize,
    requiredCheck,
    alphaNumericSymbocCheck,
    numericCheck,
    numericHyphenCheck,
    emailCheck,
    passwordCheck,
  }) {
    //console.log({ value, size, requiredCheck, alphaNumericSymbocCheck });

    if (requiredCheck && this.isNullOrEmpty(value)) return '必須項目です';

    // 空文字の場合以降のチェックを行わない
    if (this.isNullOrEmpty(value)) return null;

    if (alphaNumericSymbocCheck && !this.isAlphaNumericSymbol(value))
      return '半角英数字記号で入力してください';

    if (numericCheck && !this.isNumeric(value)) return '半角数字で入力してください';

    if (numericHyphenCheck && !this.isNumericHyphen(value))
      return '半角数字とハイフンで入力してください';

    if (emailCheck && !this.isEmail(value)) return 'メールアドレスの形式で入力してください';

    if (this.isOver(value, size)) return size + '文字以内で入力してください';

    if (minSize && this.isUnder(value, minSize)) return minSize + '文字以上で入力してください';

    return null;
  },
  /**
   * 日付を検証する
   * @param {*} param0
   * @returns
   */
  validateDate: function ({ value, requiredCheck, futureCheck }) {
    const year = value.year || null;
    const month = value.month || null;
    const day = value.day || null;

    if (!year && !month && !day) return requiredCheck ? '必須項目です' : null;

    if (!year) return '年を入力してください';
    if (!month) return '月を入力してください';
    if (!day) return '日を入力してください';

    if (!this.isDateFormat(`${year}-${month}-${day}`)) return '日付形式ではありません';

    if (futureCheck) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10) - 1; // JS の月は 0-11
      const d = parseInt(day, 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return '日付形式ではありません';
      const inputDate = new Date(y, m, d);
      // 日付のみで比較するため今日の 00:00 と比較
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) return '今日以前の日付を指定してください';
    }

    return null;
  },
  /**
   * 時間を検証する
   * @param {*} param0
   * @returns
   */
  validateTime: function ({ value, requiredCheck }) {
    let hour = value?.hour || null;
    let minute = value?.minute || null;

    // 必須チェック
    if (!hour && !minute) return requiredCheck ? '必須項目です' : null;

    // hour/minuteが数字かチェック
    hour = typeof hour === 'string' ? hour.padStart(2, '0') : String(hour).padStart(2, '0');
    minute = typeof minute === 'string' ? minute.padStart(2, '0') : String(minute).padStart(2, '0');

    // hour: 00〜23, minute: 00〜59
    if (!/^(0[0-9]|1[0-9]|2[0-3])$/.test(hour)) {
      return '時間は0〜23で入力してください';
    }
    if (!/^[0-5][0-9]$/.test(minute)) {
      return '分は0〜59で入力してください';
    }

    return null;
  },
  /**
   * 小数値を検証する
   * @param {*} param0
   * @returns
   */
  validateDecimal: function ({ value, precision, scale, requiredCheck }) {
    if (requiredCheck && this.isNullOrEmpty(value)) {
      return '必須項目です';
    }

    // 空文字の場合以降のチェックを行わない
    if (this.isNullOrEmpty(value)) return null;

    if (!this.isNumericPeriod(value)) {
      return '数字とピリオドで入力してください';
    }

    let array = value.split('.');
    if (array.length > 2) {
      return 'ピリオド(.)は１つ以内で入力してください';
    }
    //console.log(array);
    switch (array.length) {
      case 1:
        if (array[0].toString().length > precision) {
          return '整数部分：' + precision + '桁、小数部分：' + scale + '桁で入力してください';
        }
        break;
      case 2:
        if (array[0].toString().length > precision || array[1].toString().length > scale) {
          return '整数部分：' + precision + '桁、小数部分：' + scale + '桁で入力してください';
        }
        break;
      default:
        return 'ピリオド(.)は１つ以内で入力してください';
    }

    return null;
  },
  /**
   * 入力した年月日が現在日より未来かを検証する
   * @param {*} param0
   * @returns
   */
  validateFutureDate: function ({ value }) {
    let dateChars = `${value.year}/${value.month}/${value.day}`;
    const currentDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    );

    if (this.isDateFormat(dateChars)) {
      const inputDate = new Date(dateChars);
      if (inputDate < currentDate) {
        return '本日より未来の日付を入力してください';
      }
    }

    return null;
  },
  /**
   * 小数値を検証する
   * @param {*} param0
   * @returns
   */
  validateDecimal: function ({ value, precision, scale, requiredCheck }) {
    if (requiredCheck && this.isNullOrEmpty(value)) return '必須項目です';

    // 空文字の場合以降のチェックを行わない
    if (this.isNullOrEmpty(value)) return null;

    if (!this.isNumericPeriod(value)) return '数字とピリオドで入力してください';

    let array = value.split('.');
    if (array.length > 2) return 'ピリオド(.)は１つ以内で入力してください';

    //console.log(array);
    switch (array.length) {
      case 1:
        if (array[0].toString().length > precision)
          return '整数部分：' + precision + '桁、小数部分：' + scale + '桁で入力してください';
        break;
      case 2:
        if (array[0].toString().length > precision || array[1].toString().length > scale)
          return '整数部分：' + precision + '桁、小数部分：' + scale + '桁で入力してください';
        break;
      default:
        return 'ピリオド(.)は１つ以内で入力してください';
    }

    return null;
  },
};
