import { createStore } from 'vuex';
import appInformation from './modules/app-information';
import ccard from './modules/ccard';
import env from './modules/env';
import mail from './modules/mail';
import member from './modules/member';
import user from './modules/user';

export default createStore({
  modules: {
    appInformation,
    ccard,
    env,
    mail,
    member,
    user,
  },
});
