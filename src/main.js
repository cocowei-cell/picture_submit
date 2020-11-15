import Vue from "vue";
import App from "./App.vue";
import Vant from "vant";
import store from "./store";
import router from "./routes";
import "vant/lib/index.css";
import request from "./service/request";
import socket from "@/utils/socket";
import FastClick from "fastclick";
// FastClick.attach(document.body);
Vue.config.productionTip = false;
Vue.prototype.$request = request;
Vue.prototype.$soc = socket;
Vue.prototype.$bus = new Vue();
Vue.use(Vant);
new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
