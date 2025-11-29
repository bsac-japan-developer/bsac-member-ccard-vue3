import { Base64 } from 'js-base64';
import { Core as YubinBangoCore } from 'yubinbango-core2';
import pako from 'pako';

export default {
  /**
   * 郵便番号から住所を取得する
   */
  toAddressByPostcode: async function (postcode) {
    if (!postcode) return;
    let ret = { prefecture: null, address1st: null };
    await new YubinBangoCore(postcode.replace('-', ''), (address) => {
      ret.prefecture = address.region;
      ret.address1st = address.locality + address.street;
    });
    // 念のためスリープする
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);

    return ret;
  },
  /**
   * 文字列をスネークケースからキャメルケースに変換する
   * @param {*} str 変換対象の文字列
   * @returns キャメルケースに変換した文字列
   */
  toCamelCase: function (str) {
    return str
      .split('_')
      .map(function (word, index) {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  },
  /**
   * 文字列をスネークケースからキャメルケースに変換する
   * @param {*} str 変換対象の文字列
   * @returns キャメルケースに変換した文字列
   */
  toCamelCaseV2: function (str) {
    return str
      .split('_')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  },
  /**
   * オブジェクトをスネークケースからキャメルケースに変換する
   * @param {*} obj 変換対象のオブジェクト
   * @returns キャメルケースに変換したオブジェクト
   */
  toCamelCaseForObject: function (obj) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[this.toCamelCase(key)] = obj[key];
    });
    return result;
  },
  /**
   * オブジェクトをスネークケースからキャメルケースに変換する
   * @param {*} obj 変換対象のオブジェクト
   * @returns キャメルケースに変換したオブジェクト
   */
  toCamelCaseForObjectV2: function (obj) {
    if (Array.isArray(obj)) {
      // 配列の場合は各要素に適用（再帰処理）
      return obj.map((item) => this.toCamelCaseForObjectV2(item));
    } else if (obj !== null && typeof obj === 'object') {
      // オブジェクトの場合、キーを変換し、値も再帰処理
      const result = {};
      Object.keys(obj).forEach((key) => {
        result[this.toCamelCaseV2(key)] = this.toCamelCaseForObjectV2(obj[key]);
      });
      return result;
    }
    return obj;
  },
  /**
   * 半角大文字に変換する
   * @param {*} str
   */
  toHalfUpper: function (str) {
    if (!str) return str;
    return str
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      })
      .toUpperCase()
      .replace(/\u3000/g, ' ');
  },
  /**
   * 文字列をキャメルケースからスネークケースに変換する
   * @param {*} str 変換対象の文字列
   * @returns スネークケースに変換した文字列
   */
  toSnakeCase: function (str) {
    return str
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
  },
  /**
   * 文字列をキャメルケースからスネークケースに変換する
   * @param {string} str 変換対象の文字列
   * @returns {string} スネークケースに変換した文字列
   */
  toSnakeCaseV2: function (str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase基本
      .replace(/([a-zA-Z])(\d)(?=[a-zA-Z])/g, '$1_$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .toLowerCase();
  },
  /**
   * オブジェクトをキャメルケースからスネークケースに変換する
   * @param {*} obj 変換対象のオブジェクト
   * @returns スネークケースに変換したオブジェクト
   */
  toSnakeCaseForObject: function (obj) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[this.toSnakeCase(key)] = obj[key];
    });
    return result;
  },
  /**
   * オブジェクトをキャメルケースからスネークケースに変換する（再帰処理対応）
   * @param {Object} obj 変換対象のオブジェクト
   * @returns {Object} スネークケースに変換したオブジェクト
   */
  toSnakeCaseForObjectV2: function (obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.toSnakeCaseForObjectV2(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = this.toSnakeCaseV2(key);
        acc[newKey] = this.toSnakeCaseForObjectV2(obj[key]);
        return acc;
      }, {});
    }
    return obj; // プリミティブ型はそのまま返す
  },
  toGzipBase64: function (str) {
    // 1. UTF-8 バイナリに変換
    const utf8Bytes = new TextEncoder().encode(str);

    // 2. Gzip 圧縮（pako.gzip は Gzip形式！）
    const gzipped = pako.gzip(utf8Bytes); // Uint8Array

    // 3. Uint8Array → binary string に変換
    let binaryStr = '';
    gzipped.forEach((byte) => {
      binaryStr += String.fromCharCode(byte);
    });

    // 4. binary string → Base64 に変換
    return btoa(binaryStr);
  },
};
