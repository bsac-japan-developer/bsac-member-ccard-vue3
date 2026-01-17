import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';
import storage from '@/common/local-storage';

const state = {
  notification: {},
  notifications: [],
};

const getters = {
  hasRead: (state) => (id, updatedAt) => {
    // console.log(`[notification.vue] hasRead called. id: ${id} updatedAt: ${updatedAt}`);

    let readNotifications = JSON.parse(storage.getItem('readNotifications'));
    if (!readNotifications || !Array.isArray(readNotifications)) return;

    for (let notification of readNotifications) {
      if (notification?.id === id && notification?.updatedAt === updatedAt) return true;
    }
    return false;
  },
  notification: (state) => state.notification || {},
  notifications: (state) => state.notifications || [],
};

const mutations = {
  /**
   * 既読リストに追加する
   * @param {*} state
   * @param {*} payload
   */
  addReadNotifications(state, payload) {
    // console.log(
    //   `[notification.vue] addReadNotifications called. id: ${payload?.id} updatedAt: ${payload?.updatedAt}`
    // );
    if (!payload?.id || !payload?.updatedAt) return;

    let readNotifications = JSON.parse(storage.getItem('readNotifications'));
    if (!readNotifications || !Array.isArray(readNotifications)) readNotifications = [];

    // console.log(`readNotifications: ${JSON.stringify(readNotifications)}`);

    let judge = false;
    for (let notification of readNotifications) {
      if (notification?.id === payload?.id && notification?.updatedAt === payload?.updatedAt)
        judge = true;
    }
    // console.log(`[notification.vue] addReadNotifications judge: ${judge}`);
    if (!judge) readNotifications.push(payload);

    storage.setItem('readNotifications', JSON.stringify(readNotifications));
  },
  /**
   * データをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.notification = {};
    state.notifications = [];
    storage.removeItem('notifications');
  },
  /**
   * 既読にする
   * @param {*} state
   * @param {*} payload
   */
  hasRead(state, payload) {
    if (!payload?.id || !payload?.updatedAt) return;
    for (let notification of state.notifications) {
      if (notification?.id === payload?.id && notification?.updatedAt === payload?.updatedAt)
        notification.hasRead = true;
    }
  },
  /**
   * 一覧情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setIndex(state, response) {
    state.notifications = conversions.toCamelCaseForObjectV2(response?.data?.data || []);

    // 既読リストからお知らせ情報の既読プロパティに値をセットする
    for (let notification of state.notifications) {
      notification.hasRead = false;
    }
    let readNotifications = JSON.parse(storage.getItem('readNotifications'));
    if (readNotifications && Array.isArray(readNotifications)) {
      for (let readNotification of readNotifications) {
        for (let notification of state.notifications) {
          if (
            readNotification?.id === notification?.id &&
            readNotification?.updatedAt === notification?.updatedAt
          )
            notification.hasRead = true;
        }
      }
    }

    storage.setItem('notifications', state.notifications);
    log.output(`notification.setIndex`, `state.notifications`, state.notifications);
  },
  /**
   * 詳細情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setShow(state, response) {
    state.notification = conversions.toCamelCaseForObjectV2(response?.data?.data || {});
    log.output(`notification.setShow`, `state.notification`, state.notification);
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
      endpoint: 'api/v2/member_app/notifications/',
      rootGetters,
      setters: ['setIndex'],
    });
  },
  /**
   * 詳細情報を取得する
   * @param {*} param0
   * @returns
   */
  show({ commit, rootGetters }, id) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/member_app/notifications/${id}`,
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
