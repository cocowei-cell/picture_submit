<template>
  <div class="login">
    <login-nav />
    <logo />
    <login-form />
    <login-footer />
  </div>
</template>

<script>
import LoginNav from "./children/LoginNav";
import LoginForm from "./children/LoginForm";
import LoginFooter from "./children/LoginFooter";
import Logo from "@/components/content/logo/Logo";
export default {
  name: "Login",
  components: {
    LoginNav,
    LoginForm,
    LoginFooter,
    Logo,
  },
  async created() {
    // 当组件一创建后就去请求对应的数据，如果处于有token'态，就直接登录
    // 刷新后验证token的合法性
    let token = localStorage.getItem("token");
    if (token) {
      this.$router.replace("/index");
    }
  },
};
</script>

<style scoped>
</style>
