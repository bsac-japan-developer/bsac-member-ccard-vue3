import axios from '@/bsac-api';

export default {
  /**
   * データを削除する
   * @param {*} param0
   */
  delete: async function (params) {
    return this.request({ ...params, method: 'delete' });
  },
  /**
   * データを取得する
   * @param {*} param0
   */
  get: async function ({ commit, config, endpoint, rootGetters, setters }) {
    if (!commit || !rootGetters) {
      let message = null;
      if (!commit) message = `パラメータが不正です (commit)`;
      if (!rootGetters) message = `パラメータが不正です (rootGetters)`;
      return {
        success: false,
        status: null,
        message: message,
      };
    }

    const url = `${rootGetters['env/baseURL']}${endpoint}`;

    if (!config) config = {};
    config['headers'] = rootGetters['user/authHeaders'];

    return axios
      .get(url, config)
      .then((response) => {
        if (commit && Array.isArray(setters))
          setters.forEach((setter) => commit(setter, response, { root: setter.includes('/') }));
        if (commit) commit('env/setOnline', true, { root: true });

        let ret = {
          success: true,
          status: response.status,
          message: response.data.message,
        };

        return ret;
      })
      .catch((error) => {
        let ret = null;

        if (error.code === 'ERR_NETWORK' && !error.status) {
          if (commit && Array.isArray(setters))
            setters.forEach((setter) => commit(setter, null, { root: setter.includes('/') }));
          if (commit) commit('env/setOnline', false, { root: true });
          ret = {
            success: false,
            status: 499,
            message: 'サーバに接続できません',
          };
        } else {
          ret = {
            success: false,
            status: error.response.status,
            message: error.response.data.message,
          };
        }
        return ret;
      });
  },
  /**
   * データを更新する
   * @param {*} param0
   */
  patch: async function (params) {
    return this.request({ ...params, method: 'patch' });
  },
  /**
   * データを登録する
   * @param {*} param0
   */
  post: async function (params) {
    return this.request({ ...params, method: 'post' });
  },
  /**
   * データを登録・更新・削除する
   * @param {*} param0
   */
  request: async function ({
    commit,
    config,
    data,
    dispatch,
    endpoint,
    method,
    rootGetters,
    setters,
  }) {
    if (!commit || !dispatch || !rootGetters) {
      let message = null;
      if (!commit) message = `パラメータが不正です (commit)`;
      if (!dispatch) message = `パラメータが不正です (dispatch)`;
      if (!rootGetters) message = `パラメータが不正です (rootGetters)`;
      return {
        success: false,
        status: null,
        message: message,
      };
    }

    const url = `${rootGetters['env/baseURL']}${endpoint}`;

    if (!config) config = {};
    config['headers'] = rootGetters['user/authHeaders'];

    return axios[method](url, data || config, method !== 'delete' ? config : undefined)
      .then((response) => {
        if (commit && Array.isArray(setters))
          setters.forEach((setter) => commit(setter, response, { root: setter.includes('/') }));
        // メールを送信する
        if (dispatch && response.data.mail_formats) {
          response.data.mail_formats.forEach(function (mail_format) {
            dispatch('mail/send', mail_format, { root: true });
          });
        }
        const ret = {
          success: true,
          status: response.status,
          message: response.data.message,
        };
        return ret;
      })
      .catch((error) => {
        let ret = null;
        if (error?.response?.status == 400) {
          let messages = null;
          if (error?.response?.data?.message) messages = error.response.data.message;
          if (error?.response?.data?.data && Array.isArray(error.response.data.data))
            messages += '<br>' + error.response.data.data.join('<br>');
          ret = {
            success: false,
            status: 400,
            message: messages,
          };
        } else if (error?.response?.status == 422) {
          ret = {
            success: false,
            status: 422,
            message: error?.response?.data?.errors?.full_messages[0],
          };
        } else {
          ret = {
            success: false,
            status: 499,
            message: 'エラーが発生しました',
          };
        }
        return ret;
      });
  },
};
