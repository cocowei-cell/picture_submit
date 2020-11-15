<template>
  <div>
    <van-nav-bar
      title="创建任务"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form label-width="50" class="form" @submit="onSubmit">
      <van-field
        class="item"
        v-model="mission_name"
        label="名称"
        placeholder="请输入任务名称"
      />
      <van-field
        class="item"
        v-model="time"
        type="text"
        label="期限"
        placeholder="请输入期限：如3 代表 3天只能输入整数"
      />
      <van-field
        class="item"
        v-model="count"
        label="数量"
        placeholder="请输入提交图片数量"
      />
      <div class="switch">
        <p>
          <span style="color: #ccc; font-size: 14px"
            >是否开启QQ邮箱通知功能：开启后创建任务后将自动通知班级中所有人</span
          >
        </p>
        <van-switch
          @change="changeSwitch"
          class="switch_item"
          v-model="checked"
        />
      </div>
      <van-overlay :show="show" @click="show = false" />
      <loading v-if="show" text="创建中，请稍后..." />
      <div class="btn">
        <van-button round block type="primary" native-type="submit">
          创建
        </van-button>
      </div>
      <div @click="copyTO" class="info" v-if="urls">
        任务链接为(点击即可复制)：
        <p>{{ url }}</p>
      </div>
    </van-form>
    <!-- TabBar白色背景覆盖 -->
    <over-tab-bar />
  </div>
</template>

<script>
import MixinClass from "@/mixin/aboutClass";
import Loading from "@/components/content/loading/Loading";
import Copy from "@/utils/copyToClip";
import config from "@/config";
export default {
  name: "CreateMission",
  mixins: [MixinClass],
  components: {
    Loading,
  },
  data() {
    return {
      time: "",
      mission_name: "",
      classID: "",
      count: "",
      checked: false,
      show: false,
      url: "",
      urls: false,
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("/index/myClass");
    },
    async onSubmit() {
      // 非空判断
      const name = this.mission_name.trim();
      const time = this.time.trim();
      const count = this.count.trim();
      const checked = this.checked;
      if (
        name !== "" &&
        time !== "" &&
        count !== "" &&
        (+count == 1 || +count == 2) &&
        Number(time).toString() !== "NaN" &&
        Number(count).toString() !== "NaN"
      ) {
        // 发起请求进行添加。
        this.show = true;
        let res = await this.$request({
          url: "/api/mission/add",
          method: "POST",
          data: {
            name,
            time,
            count,
            checked,
            classID: this.classID,
          },
        });
        if (res.code == 200) {
          this.urls = true;
          this.url = `${config.staticURL}`;
          this.$toast({
            type: "success",
            duration: 800,
            message: "创建成功",
          });
          this.mission_name = "";
          this.time = "";
          this.count = "";
          this.checked = false;
        } else {
          this.$toast({
            type: "fail",
            message: "创建失败",
          });
        }
        this.show = false;
      } else {
        return this.$notify({
          type: "warning",
          duration: 800,
          message: "填写格式错误",
        });
      }
    },
    checkInvalid() {
      if (this.$store.state.alongUser !== this.$store.state._id) {
        this.$router.replace("/index/myClass");
      } else {
        if (!this.$route.query.id) {
          this.$router.replace("/index/myClass");
        } else {
          this.classID = this.$store.state.classID;
        }
      }
    },
    changeSwitch() {
      this.$toast({
        type: "info",
        duration: 300,
        message: this.checked ? "开启" : "关闭",
      });
    },
    async getMissions() {
      let res = await this.$request({
        url: "/api/mission/get?classId=" + this.classID,
        method: "GET",
      });
      if (res.code == 200) {
        this.url = `${config.staticURL}`;
        this.urls = true;
      }
    },
    copyTO() {
      let tag = Copy(this.url);
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
    this.checkInvalid();
    this.getMissions();
  },
  activated() {
    this.checkInvalid();
  },
  mounted() {
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
.switch {
  margin-top: 15px;
}
.switch_item {
  margin-top: 10px;
}
.info {
  margin-top: 15px;
}
.info p {
  padding-top: 15px;
  width: 100%;
  word-wrap: break-word;
}
</style>