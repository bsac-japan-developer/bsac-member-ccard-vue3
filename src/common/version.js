export default {
  /**
   * バージョン情報を比較する
   * 数値のみ、または`.`区切りの数値文字列を対象とする
   *
   * @param {*} a バージョンA
   * @param {*} b バージョンB
   * @returns Return 1 if a > b, Return -1 if a < b, Return 0 if a == b
   */
  compare: function (a, b) {
    if (a === b) return 0;

    // バージョンを`.`でユニットに切り分ける
    const aUnits = a.split('.');
    const bUnits = b.split('.');

    // ユニット数が少ない方の表記に探索幅を合わせる
    const len = Math.min(aUnits.length, bUnits.length);

    // 探索幅に従ってユニット毎に比較していく
    for (var i = 0; i < len; i++) {
      // A > B
      if (parseInt(aUnits[i]) > parseInt(bUnits[i])) return 1;
      // B > A
      if (parseInt(aUnits[i]) < parseInt(bUnits[i])) return -1;
    }

    // 個々のユニットが完全に一致している場合はユニット数が多い方が大きいとする
    if (aUnits.length > bUnits.length) return 1;
    if (aUnits.length < bUnits.length) return -1;

    // 上記の処理で判定仕切れない場合は同一とみなす
    return 0;
  },
};
