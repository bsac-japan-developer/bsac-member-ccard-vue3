import { createStore } from 'vuex';
import env from './modules/env';
import mail from './modules/mail';
import user from './modules/user';

export default createStore({
  modules: {
    env,
    mail,
    user,
  },
});
