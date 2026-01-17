import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';
import storage from '@/common/local-storage';

const state = {
  links: [],
};

const getters = {
  links: (state) => {
    if (Array.isArray(state.links) && state.links.length === 0)
      state.links = storage.getItem('links');
    return state.links ? state.links : [];
  },
};

const mutations = {
  /**
   * データをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.links = null;
    storage.removeItem('links');
  },
  /**
   * 一覧情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setIndex(state, response) {
    state.links = conversions.toCamelCaseForObjectV2(response?.data?.data || []);
    storage.setItem('links', state.links);
    log.output(`link.setIndex`, `state.links`, state.links);
  },
};

const actions = {
  /**
   * 一覧情報を取得する
   * @param {*} param0
   * @returns
   */
  index({ commit, rootGetters }) {
    return api.get({
      commit,
      config: {},
      endpoint: 'api/v2/member_app/links/',
      rootGetters,
      setters: ['setIndex'],
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
