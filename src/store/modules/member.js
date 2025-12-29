import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';
import storage from '@/common/local-storage';

const state = {
  member: null,
};

const getters = {
  member: (state) => state.member || {},
};

const mutations = {
  /**
   * データをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.member = null;

    storage.removeItem('cards');
  },
  /**
   * データをセットする
   * @param {*} state
   * @param {*} payload
   */
  setShow(state, response) {
    state.member = conversions.toCamelCaseForObjectV2(response?.data?.data || {});
    storage.setItem('member', state.member);
    log.output(`member.setShow`, `state.member`, state.member);
  },
};

const actions = {
  /**
   * メンバー情報を取得する
   * @param {*} param0
   * @returns
   */
  show({ rootGetters, commit }) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/member_app/members/${rootGetters['user/memberId']}`,
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
