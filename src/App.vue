<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  async created() {
    // 刷新后验证token的合法性
    let res = await this.$store.dispatch("getUserInfo", (tag) => {
      // token不合法
      if (tag == false) {
        // 跳转到登陆页面
        this.$router.push("/login");
        // 清除token
        localStorage.removeItem("token");
      }
    });
    // 设置背景不可点击
    this.$toast.setDefaultOptions({ forbidClick: true });
  },
};
</script>

<style>
html {
  touch-action: none;
}
body {
  background-color: #f7f8fa;
}
* {
  padding: 0;
  margin: 0;
}

.fr {
  float: right !important;
}

.fl {
  float: left !important;
}
.van-overlay {
  z-index: 99999 !important;
}
.van-dialog {
  z-index: 99999 !important;
}
.van-toast {
  z-index: 99999 !important;
}
.van-popup {
  z-index: 99999 !important;
}
</style>
