import api from '@/common/api';
import conversions from '@/common/conversions';
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import storage from '@/common/local-storage';

const SECRET_KEY = 'SwQHnmoSO131bV7vk0oISWVScXJ1YIXBre8jrKuFxkArO6MBqxXwSA41fm7Sav7W';

const state = {
  auth: null,
  timeToExpire: 0,
  user: null,
  userpass: null,
};

const getters = {
  auth: (state) => {
    if (!state.auth) state.auth = storage.getItem('auth');
    return state.auth;
  },
  authHeaders: (getters) => {
    if (!getters.auth) return null;
    const header = {
      'access-token': getters.auth['access-token'],
      client: getters.auth['client'],
      uid: getters.auth['uid'],
    };
    return header;
  },
  memberId: (getters) => {
    if (getters.user === null) return null;
    return getters.user?.memberId;
  },
  isAuthenticated: (state, getters) => {
    if (!getters.auth) return false;
    if (!getters.user) return false;
    if (!getters.auth['access-token']) return false;
    return getters.timeToExpire > 0;
  },
  user: (state) => {
    if (!state.user) state.user = storage.getItem('user');
    return state.user;
  },
  userpass: (state) => {
    if (state.userpass) return state.userpass;

    const encrypted = storage.getItem('userpass');
    if (!encrypted) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypt = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypt);
    } catch {
      return null;
    }
  },
  timeToExpire: (state) => {
    return state.timeToExpire;
  },
};

const mutations = {
  /**
   * データをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.user = null;
    state.auth = null;

    storage.removeItem('user');
    storage.removeItem('auth');
    storage.removeItem('userpass');
  },
  /**
   * 詳細情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setShow(state, response) {
    state.user = conversions.toCamelCaseForObjectV2(response.data.data || null);
    storage.setItem('user', state.user);
  },
  /**
   * ユーザーデータをローカルに保存する
   * @param {*} state
   * @param {*} response
   */
  setSignin(state, response) {
    state.user = conversions.toCamelCaseForObjectV2(response.data.data || null);
    state.auth = response.headers;
    storage.setItem('user', state.user);
    storage.setItem('auth', state.auth);
  },
  /**
   * ログインデータをセットする
   * @param {*} state
   * @param {*} login
   */
  setUserPass(state, login) {
    state.userpass = login;

    // ローカルストレージに保存する
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(login), SECRET_KEY).toString();
    storage.setItem('userpass', encrypted);
  },
  /**
   * 期限日時を更新する
   * @param {*} state
   * @returns
   */
  updateTimeToExpire(state) {
    if (!state.auth) return;

    const now = Math.floor(new Date().getTime() / 1000);
    state.timeToExpire = state.auth['expiry'] - now;
  },
};

const actions = {
  /**
   * ログインする
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  signin({ commit, getters, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: conversions.toSnakeCaseForObjectV2(input),
      dispatch,
      endpoint: 'api/v1/partner_auth/sign_in',
      rootGetters,
      setters: ['setSignin'],
    });
  },
  /**
   * ログアウトする
   * @param {*} param0
   * @returns
   */
  signout({ commit, dispatch, rootGetters }) {
    return api.delete({
      commit,
      config: {},
      dispatch,
      endpoint: 'api/v1/partner_auth/sign_out',
      rootGetters,
      setters: ['user/clearData'],
    });
  },
  /**
   * 更新する
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  // eslint-disable-next-line no-empty-pattern
  update({ commit, dispatch, getters, rootGetters }, input) {
    input['updated_at'] = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    return api.patch({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: `api/v2/member_app/partner_users/${getters['user'].id}`,
      rootGetters,
      setters: [],
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
