import api from '@/common/api';
import conversions from '@/common/conversions';
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import storage from '@/common/local-storage';

const SECRET_KEY = 'SwQHnmoSO131bV7vk0oISWVScXJ1YIXBre8jrKuFxkArO6MBqxXwSA41fm7Sav7W';

const state = {
  auth: null,
  diveCenters: [],
  genders: [],
  inputForms: {},
  members: [],
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
  expiryDate: (getters) => {
    if (!getters.auth) return null;
    const date = new Date(getters.auth['expiry'] * 1000);
    return date.toLocaleString('ja');
  },
  diveCenter: (state, getters) => (value) => {
    if (isNaN(parseInt(value))) return null;
    const diveCenters = getters.diveCenters.filter((diveCenter) => {
      return diveCenter.id === parseInt(value);
    });
    if (diveCenters.length < 1) return null;
    return diveCenters[0];
  },
  diveCenters: (state) => (state.diveCenters ? state.diveCenters : []),
  diverId: (getters) => {
    if (!getters.user) return null;
    return getters.user['diverId'];
  },
  diverUserId: (getters) => {
    if (!getters.user) return null;
    return getters.user['id'];
  },
  genders: (state) => (state.genders ? state.genders : []),
  inputForms: (state) => (state.inputForms ? state.inputForms : {}),
  isAuthenticated: (state, getters) => {
    if (!getters.auth) return false;
    if (!getters.user) return false;
    if (!getters.auth['access-token']) return false;
    return getters.timeToExpire > 0;
  },
  medicalCheck: (state, getter) => {
    return getter.user?.medicalCheck;
  },
  freeMember: (state, getters) => (value) => {
    if (isNaN(parseInt(value))) return null;
    const members = getters.members.filter((member) => {
      return member.diveCenterId === 0 && member.id === parseInt(value);
    });
    if (members.length < 1) return null;
    return members[0];
  },
  members: (state) => (state.members ? state.members : []),
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
   * ユーザーデータをローカルに保存する
   * @param {*} state
   * @param {*} response
   */
  saveData(state, response) {
    if (!response?.data?.data) return;

    state.user = conversions.toCamelCaseForObject(response.data.data);
    state.auth = response.headers;
    storage.setItem('user', state.user);
    storage.setItem('auth', state.auth);
  },
  /**
   * ダイブセンターデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setDiveCenters(state, response) {
    if (!response?.data?.options?.dive_centers) return;

    const list = [];
    response.data.options.dive_centers.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.diveCenters = list;
  },
  /**
   * 編集情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setEdit(state, response) {
    state.inputForms = conversions.toCamelCaseForObjectV2(response?.data?.input_forms || {});
    state.user = conversions.toCamelCaseForObjectV2(response?.data?.data || {});
    storage.setItem('user', state.user);
  },
  /**
   * 性別データをセットする
   * @param {*} state
   * @param {*} response
   */
  setGenders(state, response) {
    if (!response?.data?.options?.genders) return;

    const list = [];
    response.data.options.genders.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.genders = list;
  },
  /**
   * メディカルチェック セクションの表示・非表示をセットする
   * @param {*} state
   * @param {*} response
   */
  setMedicalCheckVisibleSections(state) {
    const sections = state.user?.medicalCheck?.sections;
    if (!sections || !Array.isArray(sections)) return;
    if (sections.length < 0) return;
    const mainSection = sections[0];
    const subSections = sections.filter((section) => section.sectionId > 0);
    mainSection.questions.forEach((question) => {
      subSections.forEach((subSection) => {
        if (subSection.sign === question.subSectionSign)
          subSection.visible = question.answer === 'はい';
      });
    });
  },
  /**
   * メンバーデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setMembers(state, response) {
    if (!response?.data?.options?.members) return;

    const list = [];
    response.data.options.members.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.members = list;
  },
  /**
   * 新規登録情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setNew(state, response) {
    state.inputForms = conversions.toCamelCaseForObjectV2(response?.data?.input_forms || {});
  },
  /**
   * 詳細情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setShow(state, response) {
    if (!response?.data?.data) return;

    state.user = conversions.toCamelCaseForObjectV2(response.data.data);
    storage.setItem('user', state.user);
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
   * ダイバー登録情報変更依頼に登録する
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  createAtDiverRegistrationChangeRequests({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: {
        address_1st: input.address1st,
        address_2nd: input.address2nd,
        birth_at: `${input.birthAtYear}-${input.birthAtMonth}-${input.birthAtDay}`,
        dive_center_id: input.diveCenterId,
        diver_id: input.diverId,
        diver_user_id: input.diverUserId,
        gender: input.gender,
        member_id: input.memberId,
        mobile_no: input.mobileNo,
        name_en: input.nameEn,
        name_kana: input.nameKana,
        name_ja: input.nameJa,
        phone_no: input.phoneNo,
        postcode: input.postcode,
        prefecture: input.prefecture,
      },
      dispatch,
      endpoint: 'api/v2/diver_app/diver_registration_change_requests/',
      rootGetters,
      setters: [],
    });
  },
  /**
   * ダイバーメディカル送信依頼に登録する
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  createMedicalCheckSendRequest({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: 'api/v2/diver_app/diver_medical_check_send_requests/',
      rootGetters,
      setters: [],
    });
  },
  /**
   * 編集情報を表示する
   * @param {*} param0
   * @returns
   */
  edit({ commit, getters, rootGetters }, type) {
    return api.get({
      rootGetters,
      commit,
      endpoint: `api/v2/diver_app/diver_users/${getters['user'].id}/edit`,
      config: {
        params: { type: type },
      },
      setters: ['setEdit', 'setDiveCenters', 'setGenders', 'setMembers'],
    });
  },
  /**
   * 新規登録情報を表示する
   * @param {*} param0
   * @returns
   */
  new({ commit, rootGetters }, type) {
    return api.get({
      rootGetters,
      commit,
      endpoint: `api/v2/diver_app/diver_users/new`,
      config: {
        params: { type: type },
      },
      setters: ['setNew'],
    });
  },
  /**
   * パスワードをリセットする
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  // eslint-disable-next-line no-empty-pattern
  resetPassword({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: 'api/v1/diver_auth/password',
      rootGetters,
      setters: ['clearData', 'saveData'],
    });
  },
  /**
   * 詳細情報を取得する
   * @param {*} param0
   * @returns
   */
  show({ commit, getters, rootGetters }) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/diver_app/diver_users/${getters['user'].id}`,
      rootGetters,
      setters: ['setShow'],
    });
  },
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
      setters: ['saveData'],
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
      endpoint: 'api/v1/diver_auth/sign_out',
      rootGetters,
      setters: ['user/clearData'],
    });
  },
  /**
   * ユーザー登録する
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  // eslint-disable-next-line no-empty-pattern
  signup({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: 'api/v1/diver_auth/',
      rootGetters,
      setters: [],
    });
  },
  /**
   * 退会する
   * @param {*} param0
   * @returns
   */
  // eslint-disable-next-line no-empty-pattern
  unsubscribe({ commit, dispatch, rootGetters }) {
    return api.delete({
      commit,
      config: {},
      dispatch,
      endpoint: 'api/v1/diver_auth',
      rootGetters,
      setters: ['clearData'],
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
      endpoint: `api/v2/diver_app/diver_users/${getters['user'].id}`,
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
