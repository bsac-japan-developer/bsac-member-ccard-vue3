const state = {
  env: 1, // 0:本番環境 1:開発環境 2:テスト環境
  online: true, // オンライン状態を表す
  version: '2.3.0', // アプリバージョン
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
      // return true;
      case 1: // 開発環境
        return false;
    }
  },
  data: (state) => {
    switch (state.env) {
      case 0: // 本番環境
      case 2: // テスト環境
        return {
          loginId: null,
          password: null,
        };
      case 1: // 開発環境
        return {
          loginId: '20132282',
          password: '2013tboe',
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
  topic: (state) => {
    switch (state.env) {
      case 0: // 本番環境
        return 'bsac-member-ccard-production';
      case 1: // 開発環境
        return 'bsac-member-ccard-development';
      case 2: // テスト環境
        return 'bsac-member-ccard-staging';
    }
  },
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
