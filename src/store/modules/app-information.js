import api from '@/common/api';
import version from '@/common/version';

const INITIAL_VALUE = {
  appInformation: {
    id: null,
    name: null,
    version: null,
    iosAppUrl: null,
    androidAppUrl: null,
  },
};

const state = () => Object.assign({}, INITIAL_VALUE);

const getters = {
  /**
   * メンバーを取得する
   * @param {*} state
   */
  appInformation: (state) => {
    return state.appInformation;
  },
  /**
   * アプリストアのURLを取得する
   * @param {*} state
   */
  appStoreUrl: (state) => (isIOS) => {
    return isIOS ? state.appInformation.iosAppUrl : state.appInformation.androidAppUrl;
  },
  /**
   * バージョンアップ可否を取得する
   * @param {*} state
   */
  needVersionUp: (state, getters, rootState, rootGetters) => {
    const appVersionOnServer = state.appInformation.version;
    const appVersionOnClient = rootGetters['env/version'];

    if (!appVersionOnServer) return false;
    return version.compare(appVersionOnServer, appVersionOnClient) === 1;
  },
};

const mutations = {
  /**
   * データをセットする
   * @param {*} state
   * @param {*} response
   */
  setShow(state, response) {
    if (!response?.data?.data) return;

    const data = response.data.data;
    state.appInformation = {
      id: data.id,
      name: data.name,
      version: data.version,
      iosAppUrl: data.ios_app_url,
      androidAppUrl: data.android_app_url,
    };
  },
};

const actions = {
  /**
   * 詳細情報を取得する
   * @param {*} param0
   * @returns
   */
  show({ commit, rootGetters }) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v1/common/app_informations/member_app`,
      rootGetters,
      setters: ['setShow'],
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
