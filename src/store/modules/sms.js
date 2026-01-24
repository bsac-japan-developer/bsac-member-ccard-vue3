import api from '@/common/api';

const state = {};

const getters = {};

const mutations = {};

const actions = {
  /**
   * APIを呼び出しメールを送信する
   * @param {*} param0
   * @returns
   */
  send({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: 'api/v2/member_app/emergency_call_requests/',
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
