import Vue from "vue";
import Router from "vue-router";
import routes from "./router";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
Nprogress.configure({ showSpinner: false });
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const router = new Router({
  routes,
});
// 全局前置守卫
router.beforeEach((to, from, next) => {
  Nprogress.start();
  if (to.fullPath.includes("/index")) {
    // 判断是否登录
    let token = localStorage.getItem("token");
    if (!token) {
      next("/login");
    } else {
      next();
    }
  }
  next();
});
// 全局后置守卫
router.afterEach(() => {
  Nprogress.done();
});

export default router;
