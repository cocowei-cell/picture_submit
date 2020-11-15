/**
 * @description: Vuex
 * @param {*}
 * @return {*}
 */

import Vuex from "vuex";
import Vue from "vue";
import request from "@/service/request";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    stu_name: "",
    _id: "",
    stu_number: "",
    classID: "",
    alongUser: "",
    currentID: "",
    refresh: 0,
  },
  mutations: {
    // 设置信息
    setUserInfo(state, { stu_name, _id, stu_number, classID }) {
      state.stu_name = stu_name;
      state._id = _id;
      state.stu_number = stu_number;
      state.classID = classID;
    },
    setClassID(state, payload) {
      state.classID = payload;
    },
    setAdmin(state, payload) {
      state.alongUser = payload;
    },
    setCurrentID(state, payload) {
      state.currentID = payload;
    },
    setRefresh(state, payload) {
      state.refresh = payload;
    },
  },
  actions: {
    async getUserInfo({ commit }, cb) {
      let res = await request({
        url: "/api/others/getuserinfo",
      });
      if (res.code === 200) {
        commit("setUserInfo", res.userinfo);
        localStorage.setItem("userinfo", JSON.stringify(res.userinfo));
        cb(true);
      } else {
        cb(false);
      }
    },
  },
});
export default store;
