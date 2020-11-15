<template>
  <div class="footer">
    <span @click="findPass">找回密码</span>
    <span> &nbsp;| &nbsp;</span>
    <span @click="regester">注册账号</span>
  </div>
</template>

<script>
export default {
  name: "LoginFooter",
  methods: {
    // 找回密码
    findPass() {
      this.$toast("请联系班级管理员进行修改");
    },
    // 注册
    regester() {
      this.$router.push("/regester");
    },
  },
};
</script>
<style scoped>
.footer {
  margin-top: 20px;
  text-align: center;
  color: #605f39;
}
</style>