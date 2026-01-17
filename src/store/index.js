import { createStore } from 'vuex';
import appInformation from './modules/app-information';
import ccard from './modules/ccard';
import env from './modules/env';
import link from './modules/link';
import mail from './modules/mail';
import member from './modules/member';
import notification from './modules/notification';
import user from './modules/user';

export default createStore({
  modules: {
    appInformation,
    ccard,
    env,
    link,
    mail,
    member,
    notification,
    user,
  },
});
