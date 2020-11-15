<template>
  <div>
    <van-nav-bar
      title="注册"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <logo />
    <van-form label-width="4em" class="form" @submit="onSubmit">
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
        placeholder="请输入6-12位密码仅支持字母和数字"
      />
      <van-field
        class="item"
        v-model="stu_name"
        type="text"
        label="姓名"
        placeholder="请输入您的姓名"
      />
      <van-field
        class="item"
        v-model="qq"
        type="text"
        label="QQ帐号"
        placeholder="请输入您的QQ号码"
      />
      <div class="btn">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
    <loading v-if="show" text="注册中..." />
    <van-overlay :show="show" />
    <!-- 透明遮罩层 -->
    <bgwhite v-if="switchPage" />
  </div>
</template>

<script>
import Logo from "@/components/content/logo/Logo";
import Loading from "@/components/content/loading/Loading";
import Bgwhite from "@/components/content/bgwhite/Bgwhite";
import { validateRegester } from "@/utils/validateForm";
export default {
  name: "regester",
  data() {
    return {
      username: "",
      password: "",
      qq: "",
      stu_name: "",
      show: false,
      switchPage: false,
    };
  },
  components: {
    Logo,
    Loading,
    Bgwhite,
  },
  methods: {
    onClickLeft() {
      this.$router.push("/login");
    },
    async onSubmit() {
      let qq = this.qq.trim();
      let username = this.username.trim();
      let password = this.password.trim();
      let stu_name = this.stu_name.trim();
      if (!validateRegester(username, password, qq, stu_name)) {
        return this.$notify({
          type: "warning",
          duration:1000,
          message: "注册格式不正确",
        });
      }
      // 开始注册
      this.show = true;
      let res = await this.$request({
        url: "/api/user/regester",
        method: "POST",
        data: {
          username,
          password,
          qq,
          stu_name,
        },
      });
      if (res.code == 200) {
        this.$toast({
          type: "success",
          message: res.msg,
          duration: 2000,
        });
        this.switchPage = true;
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } else {
        this.$toast({
          type: "fail",
          message: res.msg,
        });
      }
      this.show = false;
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
  margin-top: 20px;
}
.btn {
  margin-top: 20px;
}
</style>