import { createStore } from 'vuex';
import appInformation from './modules/app-information';
import ccard from './modules/ccard';
import ccardApplication from './modules/ccard-application';
import env from './modules/env';
import incidentReport from './modules/incident-report';
import link from './modules/link';
import mail from './modules/mail';
import member from './modules/member';
import memberChangeRequest from './modules/member-change-request';
import notification from './modules/notification';
import sms from './modules/sms';
import user from './modules/user';

export default createStore({
  modules: {
    appInformation,
    ccard,
    ccardApplication,
    env,
    incidentReport,
    link,
    mail,
    member,
    memberChangeRequest,
    notification,
    sms,
    user,
  },
});
