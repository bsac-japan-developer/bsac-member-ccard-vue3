import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';

const state = {
  incidentReport: {},
  inputForms: {},
};

const getters = {
  incidentReport: (state) => (state.incidentReport ? state.incidentReport : {}),
  inputForms: (state) => (state.inputForms ? state.inputForms : {}),
};

const mutations = {
  /**
   * 新規登録データをセットする
   * @param {*} state
   * @param {*} response
   */
  setCreate(state, response) {
    state.incidentReport = conversions.toCamelCaseForObjectV2(response?.data?.data || {});
    log.output(`incidentReport.setCreate`, `state.incidentReport`, state.incidentReport);
  },
  /**
   * 編集データをセットする
   * @param {*} state
   * @param {*} response
   */
  setEdit(state, response) {
    state.inputForms = conversions.toCamelCaseForObjectV2(response?.data?.input_forms || {});
    log.output(`incidentReport.setEdit`, `state.inputForms`, state.inputForms);
  },
  /**
   * 新規作成データをセットする
   * @param {*} state
   * @param {*} response
   */
  setNew(state, response) {
    state.inputForms = conversions.toCamelCaseForObjectV2(response?.data?.input_forms || {});
    log.output(`incidentReport.setNew`, `state.inputForms`, state.inputForms);
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
      endpoint: 'api/v2/member_app/incident_reports/',
      rootGetters,
      setters: ['setCreate'],
    });
  },
  /**
   * 編集データを取得する
   * @param {*} param0
   * @returns
   */
  edit({ commit, rootGetters }, id) {
    return api.get({
      rootGetters,
      commit,
      endpoint: `api/v2/member_app/incident_reports/${id}/edit`,
      config: {},
      setters: ['setEdit'],
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
      endpoint: `api/v2/member_app/incident_reports/new`,
      config: {},
      setters: ['setNew'],
    });
  },
  /**
   * 更新する
   * @param {*} param0
   * @returns
   */
  update({ commit, dispatch, getters, rootGetters }, input) {
    return api.patch({
      commit,
      config: {},
      data: input,
      dispatch,
      endpoint: `api/v2/member_app/incident_reports/${input.id}`,
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
