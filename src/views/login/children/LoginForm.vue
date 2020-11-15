<template>
  <div>
    <van-form label-width="3em" class="form" @submit="onSubmit">
      <van-field
        class="item"
        v-model="username"
        label="学号"
        placeholder="请输入学号"
      />
      <van-field
        class="item"
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入6-12位密码"
      />
      <div class="btn">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <loading v-if="loginShow" text="登录中" />
    <van-overlay :show="loginShow" />
  </div>
</template>

<script>
import { validateLogin } from "@/utils/validateForm";
import Loading from "@/components/content/loading/Loading";
export default {
  name: "LoginForm",
  components: {
    Loading,
  },
  data() {
    return {
      username: "",
      password: "",
      loginShow: false,
    };
  },
  methods: {
    async onSubmit() {
      let username = this.username.trim();
      let password = this.password.trim();
      if (!validateLogin(username, password)) {
        return this.$notify({
          type: "warning",
          duration: 1000,
          message: "学号或密码格式不正确",
        });
      }
      // 发起http注册请求
      this.loginShow = true;
      let res = await this.$request({
        url: "/api/user/login",
        method: "POST",
        data: {
          username,
          password,
        },
      });
      this.loginShow = false;
      if (res.code !== 200) {
        return this.$toast({
          type: "fail",
          duration: 1000,
          message: res.msg,
        });
      }
      // 保存token跳转到主页面
      localStorage.setItem("token", res.token);
      // 保存到本地
      localStorage.setItem("userinfo", JSON.stringify(res.userinfo));
      // 保存用户信息到vuex中
      this.$store.commit("setUserInfo", res.userinfo);
      // 跳转到首页
      this.$router.replace("/index");
    },
  },
};
</script>
<style scoped>
.form {
  padding: 10px;
}
.item {
  border-radius: 20px;
  box-shadow: 0 0 1px #ccc;
  margin-top: 15px;
}
.btn {
  margin-top: 20px;
}
</style>