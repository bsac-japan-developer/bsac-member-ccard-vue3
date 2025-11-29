const state = {
  env: 1, // 0:本番環境 1:開発環境 2:テスト環境
  online: true, // オンライン状態を表す
  version: '2.1.6', // アプリバージョン
};

const getters = {
  baseURL: (state) => {
    switch (state.env) {
      case 0: // 本番環境
        return 'https://api.bsac-japan.com/';
      case 1: // 開発環境（開発環境により適宜変更する）
        return 'http://api.bsac-japan.local:3002/';
      case 2: // テスト環境
        return 'https://api-test.bsac-japan.com/';
    }
  },
  compress: (state) => {
    switch (state.env) {
      case 0: // 本番環境
      case 2: // テスト環境
        return true;
      case 1: // 開発環境
        return false;
    }
  },
  data: (state) => {
    switch (state.env) {
      case 0: // 本番環境
      case 2: // テスト環境
        return {
          address1st: null,
          address1stKana: null,
          address2nd: null,
          address2ndKana: null,
          birthAtDay: null,
          birthAtMonth: null,
          birthAtYear: null,
          bloodType: null,
          ccardNo: null,
          ccardNo1st: null,
          ccardNo2nd: null,
          diveCenterId: null,
          diverId: null,
          email: null,
          gender: null,
          mobileNo: null,
          name: null,
          nameEn: null,
          nameKana: null,
          nameJa: null,
          password: null,
          phoneNo: null,
          postcode: null,
          prefecture: null,
        };
      case 1: // 開発環境
        return {
          address1st: '千代田区神田紺屋町１３',
          address1stKana: 'ちよだくかんだこんやまち１３',
          address2nd: 'サンビル４F',
          address2ndKana: 'さんびる４かい',
          birthAtDay: '21',
          birthAtMonth: '06',
          birthAtYear: '1982',
          bloodType: 'A型',
          ccardNo: '0000000001',
          ccardNo1st: '0000',
          ccardNo2nd: '0001',
          diveCenterId: 9997,
          diverId: '10000000',
          email: `bsacjapan.developer+10000000@gmail.com`,
          gender: 1,
          mobileNo: '09012345678',
          name: 'TARO UMINO',
          nameEn: 'TARO UMINO',
          nameKana: 'うみの　たろう',
          nameJa: '海野　太郎',
          password: 'password1234',
          phoneNo: '0352975656',
          postcode: '101-0035',
          prefecture: '東京都',
        };
    }
  },
  insuranceEmail: (state) => {
    switch (state.env) {
      case 0: // 本番環境
        return 'certification@bsac.jp';
      case 1: // 開発環境
      case 2: // テスト環境
        return 'bsacjapan.developer@gmail.com';
    }
  },
  logLevel: (state) => {
    switch (state.env) {
      case 0: // 本番環境
        return 'error';
      case 1: // 開発環境
        return 'debug';
      case 2: // テスト環境
        return 'error';
      default:
        return 'error';
    }
  },
  mode: (state) => {
    switch (state.env) {
      case 0: // 本番環境
        return '';
      case 1: // 開発環境
        return '【開発環境】';
      case 2: // テスト環境
        return '【テスト環境】';
    }
  },
  online: (state) => state.online,
  version: (state) => state.version,
};

const mutations = {
  /**
   * オンライン状態をセットする
   * @param {*} state
   */
  setOnline(state, online) {
    state.online = online;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
