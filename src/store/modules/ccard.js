import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';
import storage from '@/common/local-storage';

const state = {
  cards: null,
  takenCardsAt: null,
};

const getters = {
  cards: (state) => {
    if (!state.cards) state.cards = JSON.parse(localStorage.getItem('cards'));
    return state.cards;
  },
  levelupCards: (getters) => {
    if (!getters.cards) return null;
    return getters.cards.filter((card) => {
      return card.rankGroupId === 1;
    });
  },
  sdcCards: (getters) => {
    if (!getters.cards) return null;
    return getters.cards.filter((card) => {
      return card.rankGroupId === 2;
    });
  },
  card: (getters) => (id) => {
    if (!getters.cards) return null;
    const cards = getters.cards.filter((card) => {
      return card.id === id;
    });
    return cards[0];
  },
  latestCard: (getters) => {
    if (!getters.cards) return null;

    // レベルアップカードを並べ替えて一番目を返す
    const levelupCards = getters.cards.filter((card) => {
      return card.rankGroupId === 1;
    });

    if (levelupCards.length > 0) {
      levelupCards.sort(function (a, b) {
        // ランクレベルの降順で並び替え
        if (a.rankLevel !== b.rankLevel) {
          if (a.rankLevel < b.rankLevel) return 1;
          if (a.rankLevel >= b.rankLevel) return -1;
        }
        // ランク表示順の降順で並び替え
        if (a.rankDisplayOrder !== b.rankDisplayOrder) {
          if (a.rankDisplayOrder < b.rankDisplayOrder) return 1;
          if (a.rankDisplayOrder >= b.rankDisplayOrder) return -1;
        }
        // 認定日の降順で並び替え
        if (a.certifyAt !== b.certifyAt) {
          if (a.certifyAt < b.certifyAt) return 1;
          if (a.certifyAt >= b.certifyAt) return -1;
        }
      });
      return levelupCards[0];
    }

    // SDCカードを並べ替えて一番目を返す
    const sdsCards = getters.cards.filter((card) => {
      return card.rankGroupId === 2;
    });
    if (sdsCards.length > 0) {
      sdsCards.sort(function (a, b) {
        // ランク表示順の昇順で並び替え
        if (a.rankDisplayOrder !== b.rankDisplayOrder) {
          if (a.rankDisplayOrder < b.rankDisplayOrder) return -1;
          if (a.rankDisplayOrder >= b.rankDisplayOrder) return 1;
        }
      });
      return sdsCards[0];
    }

    return null;
  },
  takenCardsAt: (state) => {
    if (!state.takenCardsAt) {
      state.takenCardsAt = localStorage.getItem('takenCardsAt');
    }
    return state.takenCardsAt;
  },
};

const mutations = {
  /**
   * ストアとローカルストレージからカードデータをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.cards = null;
    state.takenCardsAt = null;

    storage.removeItem('cards');
    storage.removeItem('takenCardsAt');
  },
  /**
   * ストアとローカルストレージにカードデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setIndex(state, response) {
    if (!response?.data?.data) return;

    const list = [];
    response.data.data.forEach((value) => {
      list.push(conversions.toCamelCaseForObjectV2(value));
    });
    state.cards = list;
    storage.setItem('cards', state.cards);
    log.output(`ccard.setIndex`, `state.cards`, state.cards);
  },
  /**
   * 取得日時をセットする
   * @param {*} state
   */
  setTakenCardsAt(state) {
    state.takenCardsAt = new Date().toLocaleString('ja');
    storage.setItem('takenCardsAt', state.takenCardsAt);
    log.output(`ccard.setTakenCardsAt`, `state.takenCardsAt`, state.takenCardsAt);
  },
};

const actions = {
  /**
   * 一覧情報を取得する
   * @param {*} param0
   * @returns
   */
  index({ rootGetters, commit }) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/member_app/member_ccards`,
      rootGetters,
      setters: ['setIndex', 'setTakenCardsAt'],
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
