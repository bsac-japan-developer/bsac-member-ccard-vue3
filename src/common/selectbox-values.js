export default {
  /**
   * 指定した年月の日リストを取得する
   * @returns
   */
  getDays: function ({ year, month }) {
    let lastDay = 31;
    if (year && month) {
      lastDay = new Date(year, month, 0).getDate();
    }
    let list = [''];
    for (let i = 1; i <= lastDay; i++) {
      list.push({ value: ('00' + i).slice(-2).toString() });
    }
    return list;
  },
  /**
   * 時リストを取得する
   * @returns
   */
  getHours: function () {
    let list = [''];
    for (let i = 0; i <= 23; i++) {
      list.push({ value: ('00' + i).slice(-2).toString() });
    }
    return list;
  },
  /**
   * 分リストを取得する
   * @returns
   */
  getMinutes: function () {
    let list = [''];
    for (let i = 0; i < 6; i++) {
      list.push({ value: ('00' + i * 10).slice(-2).toString() });
    }
    return list;
  },
  /**
   * 月リストを取得する
   * @returns
   */
  getMonths: function () {
    let list = [''];
    for (let i = 1; i <= 12; i++) {
      list.push({ value: ('00' + i).slice(-2).toString() });
    }
    return list;
  },
  /**
   * 年リストを取得する
   * @param {*} max
   * @param {*} min
   * @returns
   */
  getYears: function (max, min) {
    let list = [''];
    for (let i = max; i >= min; i--) {
      list.push({ value: i.toString() });
    }
    return list;
  },
  /**
   * 性別リスト
   */
  genders: [
    {
      name: '不特定',
      value: 0,
    },
    {
      name: '男性',
      value: 1,
    },
    {
      name: '女性',
      value: 2,
    },
  ],
  /**
   * 都道府県リスト
   */
  prefectures: [
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
    '海外',
  ],
};
