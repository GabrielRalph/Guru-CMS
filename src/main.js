import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VuePrismEditor from "vue-prism-editor";
import "vue-prism-editor/dist/VuePrismEditor.css"; // import the styles
import "prismjs";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import firebase from 'firebase';
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDe5Z5STt003BGd5k3EuGSTu7hWKqZltI4",
    authDomain: "guru-admin.firebaseapp.com",
    databaseURL: "https://guru-admin.firebaseio.com",
    projectId: "guru-admin",
    storageBucket: "guru-admin.appspot.com",
    messagingSenderId: "618229197693",
    appId: "1:618229197693:web:08bdb2afd1457f6f22ba14"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

import Logo from './components/logo.vue'
import "prismjs/themes/prism.css";
Vue.config.productionTip = false
Vue.component("prism-editor", VuePrismEditor);
Vue.component("logo", Logo);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
