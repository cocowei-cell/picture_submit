<template>
  <div>
    <van-nav-bar
      title="加入班级"
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
    />
    <div class="add_class">
      <!-- 邀请码 -->
      <van-field class="item" v-model="inviCode" label="*邀请码" />
      <van-button
        @click.native="addClass"
        style="width: 100%; margin-top: 15px"
        round
        type="primary"
        >加入</van-button
      >
    </div>
    <over-tab-bar />
  </div>
</template>

<script>
import MixinClass from "@/mixin/aboutClass";
export default {
  name: "AddClass",
  mixins: [MixinClass],
  data() {
    return {
      inviCode: "",
      clipboardText: "",
      flag: false,
    };
  },
  methods: {
    async addClass() {
      if (this.inviCode.trim() == "") {
        return this.$notify({
          type: "warning",
          duration: 1000,
          message: "请输入邀请码",
        });
      }
      // 发送请求
      let res = await this.$request({
        url: "/api/classes/add",
        method: "POST",
        data: {
          inviCode: this.inviCode,
        },
      });
      if (res.code == 200) {
        this.$toast({
          type: "success",
          duration: 900,
          message: "加入成功",
        });
        // 保存classID
        this.$store.commit("setClassID", res.classID);
        // 保存classID到本地缓存中
        let str = localStorage.getItem("userinfo");
        if (str) {
          let obj = JSON.parse(str);
          obj.classID = res.classID;
          localStorage.setItem("userinfo", JSON.stringify(obj));
        }
        // 如果加入成功，跳转到myClass页面
        setTimeout(() => {
          this.$router.replace("/index/myClass?type=add");
        }, 900);
      } else {
        this.$toast({
          type: "fail",
          duration: 900,
          message: res.msg,
        });
      }
    },
    // 剪切板内容
    async getClipboardContents() {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          this.$dialog
            .confirm({
              message:
                "系统检测到您的剪切板内容为" + text + " 是否粘贴到邀请码中",
            })
            .then(() => {
              this.inviCode = text;
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
      }
    },
  },
  mounted() {
    if (!this.flag) {
      this.getClipboardContents();
    }
  },
  created() {
    if (this.$store.state.classID) {
      this.$router.replace("/index/profile");
      this.flag = true;
    }
  },
};
</script>
<style scoped>
.item {
  border-radius: 20px;
  box-shadow: 0 0 1px #000;
  margin-top: 15px;
}
.add_class {
  padding: 10px;
}
</style>