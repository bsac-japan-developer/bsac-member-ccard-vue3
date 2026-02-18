import api from '@/common/api';
import conversions from '@/common/conversions';
import log from '@/common/log';
import storage from '@/common/local-storage';

const state = {
  applicationTypes: [],
  bloodTypes: [],
  cardApplication: {},
  cardApplications: [],
  cardSendingDestinations: [],
  diveCenters: [],
  genders: [],
  idPhoto: null,
  input: {},
  memberPledge: {},
  members: [],
  rankGroups: [],
  ranks: [],
  searchConditions: { exclude_canceled: true },
};

const getters = {
  applicationTypes: (state) => state.applicationTypes || [],
  applicationTypeValue: (state) => (key) => {
    const types = state.applicationTypes.filter((type) => {
      return type.key === key;
    });
    if (types.length < 1) return null;
    return types[0].value;
  },
  bloodTypes: (state) => state.bloodTypes || [],
  cardApplication: (state) => state.cardApplication || {},
  cardApplications: (state) => {
    if (Array.isArray(state.cardApplications) && state.cardApplications.length === 0)
      state.cardApplications = storage.getItem('card-applications');
    return state.cardApplications || [];
  },
  cardSendingDestinations: (state) => (diveCenter) => {
    if (diveCenter === 0) {
      return state.cardSendingDestinations.filter((destination) => {
        return destination?.value !== 'ダイブセンター';
      });
    } else {
      return state.cardSendingDestinations;
    }
  },
  cardSendingDestinationValue: (state) => (id) => {
    const destinations = state.cardSendingDestinations.filter((gender) => {
      return gender.id === id;
    });
    if (destinations.length < 1) return null;
    return destinations[0].value;
  },
  cardSendingDestinationsForDiveCenter: (state) =>
    state.cardSendingDestinations.filter((destination) => destination.diveCenter),
  cardSendingDestinationsForMember: (state) =>
    state.cardSendingDestinations.filter((destination) => destination.member),
  diveCenters: (state) => state.diveCenters || [],
  diveCenterName: (state) => (id) => {
    const diveCenters = state.diveCenters.filter((diveCenter) => {
      return diveCenter.id === id;
    });
    if (diveCenters.length < 1) return null;
    return diveCenters[0].name;
  },
  freeMemberName: (state) => (value) => {
    if (isNaN(parseInt(value))) return null;
    const members = state.members.filter((member) => {
      if (member.diveCenterId !== 0) return false;
      return member.id === parseInt(value);
    });
    if (members.length < 1) return null;
    return members[0].name;
  },
  genders: (state) => state.genders || [],
  genderValue: (state) => (id) => {
    const genders = state.genders.filter((gender) => {
      return gender.id === id;
    });
    if (genders.length < 1) return null;
    return genders[0].value;
  },
  idPhoto: (state) => {
    if (!state.idPhoto) return;
    return state.idPhoto.replace(/data:image\/(jpg|jpeg);base64,/g, '').trim();
  },
  input: (state) => state.input || {},
  memberName: (state) => (value) => {
    if (isNaN(parseInt(value))) return null;
    const members = state.members.filter((member) => {
      return member.id === parseInt(value);
    });
    if (members.length < 1) return null;
    return members[0].name;
  },
  memberPledge: (state) => state.memberPledge || {},
  members: (state) => (diveCenterId) => {
    if (diveCenterId === null) return state.members; // フリーメンバーは0のため`=== null`で判定する
    const members = state.members.filter((member) => member.diveCenterId === diveCenterId);
    return members.map((member) => ({
      id: member.id,
      value: member.value,
    }));
  },
  needIdPhoto: (state) => (rankId) => {
    const ranks = state.ranks.filter((rank) => rank.id === rankId);
    if (ranks.length < 1) return true;
    return ranks[0].needIdPhoto;
  },
  rankGroups: (state) => state.rankGroups || [],
  rankName: (state) => (id) => {
    const ranks = state.ranks.filter((rank) => {
      return rank.id === id;
    });
    if (ranks.length < 1) return null;
    return ranks[0].value;
  },
  ranks: (state) => (rankGroupId) => {
    if (!rankGroupId || !state.ranks || !Array.isArray(state.ranks)) return [];
    const ranks = state.ranks
      .filter((rank) => rank.rankGroupId === rankGroupId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return ranks.map((rank) => ({
      id: rank.id,
      value: rank.value,
    }));
  },
  requestData: (getters) => {
    const input = getters.input;
    if (!input) return {};
    const now = new Date();
    return {
      address_1st: input.address1st,
      address_2nd: input.address2nd,
      apply_at: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
      application_type: input.applicationType,
      birth_at: `${input.birthAtYear}-${input.birthAtMonth}-${input.birthAtDay}`,
      blood_type: input.bloodType,
      certifier_member_id: input.certifierMemberId,
      certify_at: `${input.certifyAtYear}-${input.certifyAtMonth}-${input.certifyAtDay}`,
      crossover_assosiation_name: input.crossoverAssosiationName,
      crossover_card_no: input.crossoverCardNo,
      crossover_certify_at: `${input.crossoverCertifyAtYear}-${input.crossoverCertifyAtMonth}-${input.crossoverCertifyAtDay}`,
      crossover_rank_name: input.crossoverRankName,
      deliver_card_to: input.deliverCardTo,
      dive_center_id: input.diveCenterId !== null ? input.diveCenterId : -1,
      email: input.email,
      // diver_id: input.diverId !== null ? input.diverId : -1,
      // diver_user_id: input.diverUserId !== null ? input.diverUserId : -1,
      gender: input.gender,
      id_photo_base64: getters.idPhoto,
      member_id: input.memberId !== null ? input.memberId : -1,
      mobile_no: input.mobileNo,
      name_en: input.nameEn,
      name_kana: input.nameKana,
      name_ja: input.nameJa,
      partner_user_id: input.partnerUserId !== null ? input.partnerUserId : -1,
      phone_no: input.phoneNo,
      postcode: input.postcode,
      prefecture: input.prefecture,
      remarks: input.remarks,
      rank_id: input.rankId,
      updated_at: input.updatedAt,
    };
  },
  searchConditions: (state) => state.searchConditions || {},
};

const mutations = {
  /**
   * 申請種別データをセットする
   * @param {*} state
   * @param {*} response
   */
  setApplicationTypes(state, response) {
    if (!response?.data?.options?.application_types) return;

    const list = [];
    response.data.options.application_types.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.applicationTypes = list;
    log.output(
      `cardApplication.setApplicationTypes`,
      `state.applicationTypes`,
      state.applicationTypes
    );
  },
  /**
   * 血液型データをセットする
   * @param {*} state
   * @param {*} response
   */
  setBloodTypes(state, response) {
    if (!response?.data?.options?.blood_types) return;

    const list = [];
    response.data.options.blood_types.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.bloodTypes = list;
    log.output(`cardApplication.setBloodTypes`, `state.bloodTypes`, state.bloodTypes);
  },
  /**
   * データをクリアする
   * @param {*} state
   */
  clearData(state) {
    state.cardApplication = null;
    state.idPhoto = null;
    storage.removeItem('card-applications');
  },
  /**
   * カード送付先リストをセットする
   * @param {*} state
   * @param {*} response
   */
  setCardSendingDestinations(state, response) {
    if (!response?.data?.options.card_sending_destinations) return;

    const list = [];
    response.data.options.card_sending_destinations.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.cardSendingDestinations = list;
    log.output(
      `cardApplication.setCardSendingDestinations`,
      `state.cardSendingDestinations`,
      state.cardSendingDestinations
    );
  },
  /**
   * 取得した詳細データをセットする
   * @param {*} state
   * @param {*} response
   * @returns
   */
  setDetailData(state, response) {
    if (!response?.data?.data) return;

    const application = conversions.toCamelCaseForObject(response.data.data);
    if (!application) return;
    // console.log(`setDetailData before: ${JSON.stringify(application)}`);

    state.cardApplication = {
      address1st: application?.address1st,
      address2nd: application?.address2nd,
      applicationType: application?.applicationType,
      birthAtDay:
        application?.birthAt?.split('-')?.length > 2 ? application?.birthAt?.split('-')[2] : null,
      birthAtMonth:
        application?.birthAt?.split('-')?.length > 1 ? application?.birthAt?.split('-')[1] : null,
      birthAtYear:
        application?.birthAt?.split('-')?.length > 0 ? application?.birthAt?.split('-')[0] : null,
      bloodType: application?.bloodType,
      certifierMemberId: application?.certifierMemberId,
      certifierMemberName: application?.certifierMemberName,
      certifyAtDay:
        application?.certifyAt?.split('-')?.length > 2
          ? application?.certifyAt?.split('-')[2]
          : null,
      certifyAtMonth:
        application?.certifyAt?.split('-')?.length > 1
          ? application?.certifyAt?.split('-')[1]
          : null,
      certifyAtYear:
        application?.certifyAt?.split('-')?.length > 0
          ? application?.certifyAt?.split('-')[0]
          : null,
      crossoverAssosiationName: application?.crossoverAssosiationName,
      crossoverCardNo: application?.crossoverCardNo,
      crossoverCertifyAtDay:
        application?.crossoverCertifyAt?.split('-')?.length > 2
          ? application?.crossoverCertifyAt?.split('-')[2]
          : null,
      crossoverCertifyAtMonth:
        application?.crossoverCertifyAt?.split('-')?.length > 1
          ? application?.crossoverCertifyAt?.split('-')[1]
          : null,
      crossoverCertifyAtYear:
        application?.crossoverCertifyAt?.split('-')?.length > 0
          ? application?.crossoverCertifyAt?.split('-')[0]
          : null,
      crossoverRankName: application?.crossoverRankName,
      deliverCardTo: application?.deliverCardTo,
      diveCenterId: application?.diveCenterId,
      diveCenterName: application?.diveCenterName,
      // diverId: application.diverId === -1 ? null : application.diverId,
      // diverUserId: application.diverUserId,
      gender: application?.genderValue,
      email: application?.email,
      id: application?.id,
      memberId: application?.memberId,
      memberName: application?.memberName,
      mobileNo: application?.mobileNo,
      nameEn: application?.nameEn,
      nameKana: application?.nameKana,
      nameJa: application?.nameJa,
      partnerUserId: application?.partnerUserId,
      phoneNo: application?.phoneNo,
      postcode: application?.postcode,
      prefecture: application?.prefecture,
      properties: conversions.toCamelCaseForObject(application?.properties),
      rankGroupId: application?.rankGroupId ? application?.rankGroupId : 1,
      rankId: application?.rankId,
      remarks: application?.remarks,
      status: application?.status,
      updatedAt: application?.updatedAt,
    };
    log.output(`cardApplication.setDetailData`, `state.cardApplication`, state.cardApplication);

    state.idPhoto = application?.profileImageBase64
      ?.replace(/data:image\/(jpg|jpeg);base64,/g, '')
      ?.trim();
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
    log.output(`cardApplication.setDiveCenters`, `state.diveCenters`, state.diveCenters);
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
    log.output(`cardApplication.setGenders`, `state.genders`, state.genders);
  },
  /**
   * ダイバーデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setIdPhoto(state, idPhoto) {
    state.idPhoto = idPhoto ? idPhoto.replace(/data:image\/(jpg|jpeg);base64,/g, '').trim() : null;
  },
  /**
   * 一覧情報をセットする
   * @param {*} state
   * @param {*} response
   */
  setIndex(state, response) {
    if (!response?.data?.data) return;

    const cardApplications = [];
    response.data.data.forEach((value) => {
      cardApplications.push(conversions.toCamelCaseForObject(value));
    });
    state.cardApplications = cardApplications;
    storage.setItem('card-applications', state.cardApplications);
  },
  /**
   * 入力データをセットする
   * @param {*} state
   * @param {*} response
   */
  setInput(state, payload) {
    state.input = payload;
  },
  /**
   * メンバー誓約をセットする
   * @param {*} state
   * @param {*} response
   */
  setMemberPledge(state, response) {
    state.memberPledge = response?.data?.member_pledge;
    log.output(`cardApplication.memberPledge`, `state.memberPledge`, state.memberPledge);
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
    log.output(`cardApplication.setMembers`, `state.members`, state.members);
  },
  /**
   * ランクグループデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setRankGroups(state, response) {
    if (!response?.data?.options?.rank_groups) return;

    const list = [];
    response.data.options.rank_groups.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.rankGroups = list;
    log.output(`cardApplication.setRankGroups`, `state.rankGroups`, state.rankGroups);
  },
  /**
   * ランクデータをセットする
   * @param {*} state
   * @param {*} response
   */
  setRanks(state, response) {
    if (!response?.data?.options?.ranks) return;

    const list = [];
    response.data.options.ranks.forEach((value) => {
      list.push(conversions.toCamelCaseForObject(value));
    });
    state.ranks = list;
    log.output(`cardApplication.setRanks`, `state.ranks`, state.ranks);
  },
  /**
   * 入力データをセットする
   * @param {*} state
   * @param {*} response
   */
  setSearchConditions(state, payload) {
    state.searchConditions = {
      exclude_canceled: payload.excludeCanceled,
    };
  },
};

const actions = {
  /**
   * 編集情報を表示する
   * @param {*} param0
   * @returns
   */
  edit({ commit, rootGetters }, id) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/member_app/member_ccard_applications/${id}/edit`,
      rootGetters,
      setters: [
        'clearData',
        'setDetailData',
        'setCardSendingDestinations',
        'setDiveCenters',
        'setGenders',
        'setMembers',
        'setRankGroups',
        'setRanks',
      ],
    });
  },
  /**
   * 登録する
   * @param {*} param0
   * @returns
   */
  create({ commit, dispatch, getters, rootGetters }) {
    // console.log(`request: ${JSON.stringify(getters['requestData'])}`);
    return api.post({
      commit,
      config: {},
      data: getters['requestData'],
      dispatch,
      endpoint: `api/v2/member_app/member_ccard_applications/`,
      rootGetters,
      setters: [],
    });
  },
  /**
   * 削除する
   * @param {*} param0
   * @returns
   */
  destroy({ commit, dispatch, getters, rootGetters }) {
    return api.delete({
      commit,
      config: {
        headers: rootGetters['user/authHeaders'],
        data: {
          status: 0,
          updated_at: getters['input'].updatedAt,
        },
      },
      dispatch,
      endpoint: `api/v2/member_app/member_ccard_applications/${getters['input'].id}`,
      rootGetters,
    });
  },
  /**
   * 一覧を取得する
   * @param {*} param0
   * @returns
   */
  index({ commit, getters, rootGetters }) {
    return api.get({
      commit,
      config: { params: getters['searchConditions'] },
      endpoint: `api/v2/member_app/member_ccard_applications/`,
      rootGetters,
      setters: ['setIndex'],
    });
  },
  /**
   * 新規登録情報を表示する
   * @param {*} param0
   * @returns
   */
  new({ commit, rootGetters }) {
    return api.get({
      commit,
      config: {},
      endpoint: `api/v2/member_app/member_ccard_applications/new`,
      rootGetters,
      setters: [
        'clearData',
        'setApplicationTypes',
        'setBloodTypes',
        'setDetailData',
        'setCardSendingDestinations',
        'setDiveCenters',
        'setGenders',
        'setMembers',
        'setMemberPledge',
        'setRankGroups',
        'setRanks',
      ],
    });
  },
  /**
   * 更新する
   * @param {*} param0
   * @returns
   */
  update({ commit, dispatch, getters, rootGetters }) {
    return api.patch({
      commit,
      config: {},
      data: getters['requestData'],
      dispatch,
      endpoint: `api/v2/member_app/member_ccard_applications/${getters['input'].id}`,
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
