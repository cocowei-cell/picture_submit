<template>
  <div>
    <van-nav-bar
      title="创建班级"
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
    />
    <van-form class="form" @submit="onSubmit">
      <van-field
        class="item"
        v-model="classes"
        label="班级"
        placeholder="输入班级，例：2018197"
      />
      <div class="btn">
        <van-button round block type="primary" native-type="submit">
          创建
        </van-button>
      </div>
      <div @click="insertBoard" v-if="codeShow" class="code_info">
        班级邀请码为(点击即可复制)：
        <span>{{ invCode }}</span>
      </div>
    </van-form>
    <over-tab-bar />
    <loading text="创建中" v-if="show" />
    <bgwhite v-if="show" />
  </div>
</template>

<script>
import MixinClass from "@/mixin/aboutClass";
import Loading from "@/components/content/loading/Loading";
import Bgwhite from "@/components/content/bgwhite/Bgwhite";
import Copy from "@/utils/copyToClip";
export default {
  name: "CreateClass",
  mixins: [MixinClass],
  components: {
    Loading,
    Bgwhite,
  },
  data() {
    return {
      codeShow: false,
      classes: "",
      invCode: "",
      show: false,
    };
  },
  methods: {
    // 复制到剪切板
    insertBoard() {
      console.log(123);
    },
    async onSubmit() {
      let classes = this.classes;
      if (!/^20[1-9]{2}[0-9]{3}$/.test(classes)) {
        return this.$notify({
          type: "warning",
          duration: 1000,
          message: "请输入正确的班级",
        });
      }
      // 提交到服务器中
      this.show = true;
      let res = await this.$request({
        url: "/api/classes/create",
        method: "POST",
        data: {
          classes,
        },
      });
      if (res.code == 200) {
        this.codeShow = true;
        this.invCode = res.inv_code;
        this.$store.commit("setClassID", res.classID);
        this.$toast({
          type: "success",
          duration: 900,
          message: "创建成功",
        });
        this.classes = "";
        // 保存classID到本地缓存中
        let str = localStorage.getItem("userinfo");
        if (str) {
          let obj = JSON.parse(str);
          obj.classID = res.classID;
          localStorage.setItem("userinfo", JSON.stringify(obj));
        }
      } else {
        this.$toast({
          type: "fail",
          duration: 900,
          message: res.msg,
        });
      }
      this.show = false;
    },
    insertBoard() {
      let tag = Copy(this.invCode);
      if (tag) {
        this.$toast({
          type: "success",
          duration: 800,
          message: "复制成功",
        });
      }
    },
  },
  created() {
    // 判断是否具有班级ID
    if (this.$store.state.classID) {
      this.$router.replace("/index/profile");
    }
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
.code_info {
  margin-top: 20px;
}
</style>