import { createApp } from 'vue';
import VueOnsen from 'vue-onsenui';
import * as components from 'vue-onsenui/esm/components';
import App from '@/App.vue';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import store from '@/store';
import 'ionicons/dist/css/ionicons.min.css';
import mitt from 'mitt';

if (VueOnsen.platform.isIPhoneX()) {
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

const app = createApp(App);

const emitter = mitt();
app.config.globalProperties.$emitter = emitter;

// Register all vue-onsenui components
Object.values(components).forEach((component) => app.component(component.name, component));

app.use(VueOnsen);
app.use(store);

import logger from '@/logger';
app.config.globalProperties.$logger = logger;

app.mount('#app');

app.config.errorHandler = (err, vm, info) => {
  return false;
};

document.addEventListener(
  'deviceready',
  function () {
    // プッシュ通知のパーミッションをリクエスト
    window.FirebasePlugin.grantPermission();
  },
  false
);
