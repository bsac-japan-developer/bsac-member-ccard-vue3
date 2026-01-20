import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';

const state = {
  inputForms: {},
  intervalHours: null,
};

const getters = {
  inputForms: (state) => (state.inputForms ? state.inputForms : {}),
  intervalHours: (state) => state.intervalHours,
};

const mutations = {
  /**
   * 間隔時間をセットする
   * @param {*} state
   * @param {*} response
   */
  setIntervalHours(state, response) {
    state.intervalHours = response.data.options.interval_hours || 24;
    log.output(`memberChangeRequest.setIntervalHours`, `state.intervalHours`, state.intervalHours);
  },
  /**
   * 新規作成データをセットする
   * @param {*} state
   * @param {*} response
   */
  setNew(state, response) {
    state.inputForms = conversions.toCamelCaseForObjectV2(response?.data?.input_forms || {});
    log.output(`memberChangeRequest.setNew`, `state.inputForms`, state.inputForms);
  },
};

const actions = {
  /**
   * 登録する
   * @param {*} param0
   * @param {*} input
   * @returns
   */
  create({ commit, dispatch, rootGetters }, input) {
    return api.post({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: 'api/v2/member_app/member_change_requests/',
      rootGetters,
      setters: [],
    });
  },
  /**
   * 新規作成データを取得する
   * @param {*} param0
   * @returns
   */
  new({ commit, rootGetters }) {
    return api.get({
      rootGetters,
      commit,
      endpoint: `api/v2/member_app/member_change_requests/new`,
      config: {},
      setters: ['setNew', 'setIntervalHours'],
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
