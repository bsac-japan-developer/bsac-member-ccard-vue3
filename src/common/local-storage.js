import LZString from 'lz-string';
import store from '@/store';
import validations from '@/common/validations';

export default {
  /**
   * 全データをクリアする
   */
  clear: function () {
    localStorage.clear();
  },
  /**
   * ローカルストレージからデータを取得する
   * @param {*} key
   */
  getItem: function (key) {
    try {
      const value = localStorage.getItem(key);

      if (!value) return value;

      const decompressed = LZString.decompress(value);
      const isCompressed = decompressed !== null && LZString.compress(decompressed) === value;

      if (isCompressed) {
        if (validations.isJSON(decompressed)) {
          return JSON.parse(decompressed);
        } else {
          return decompressed;
        }
      } else {
        if (validations.isJSON(value)) {
          return JSON.parse(value);
        } else {
          return value;
        }
      }
    } catch (error) {}
  },
  /**
   * ローカルストレージからデータを削除する
   * @param {*} key
   */
  removeItem: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {}
  },
  /**
   * ローカルストレージにデータをセットする
   * @param {*} key
   * @param {*} value
   */
  setItem: function (key, value) {
    try {
      const strigified = JSON.stringify(value);
      localStorage.setItem(
        key,
        store.getters['env/compress'] ? LZString.compress(strigified) : strigified
      );
    } catch (error) {}
  },
};
