<template>
  <div>
    <van-nav-bar
      :title="class_name"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      @touchstart.native="onTouchStart"
      @touchend.native="onTouchEnd"
    >
      <template v-if="isAdmin" #right>
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>
    <div class="tips">
      当前班级共:{{ count }}人,邀请码：{{ class_info.invitation_code }}
    </div>
    <user-list ref="userListRef" @refreshData="getUser" :users="userinfo" />
    <!-- TabBar白色背景覆盖 -->
    <van-popup
      round
      v-model="show"
      teleport="body"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div class="download">
        <!-- 下载nav -->
        <div class="download_nav">打包为ZIP文件</div>
        <!-- 下载主区域 -->
        <div class="download_main">
          <ul>
            <li>{{ class_name }}班</li>
            <li>当前任务：{{ downloadObj.mission.name }}</li>
            <li>
              已提交人数：{{ downloadObj.y_count }}人,未交人数：{{
                downloadObj.n_count
              }}人
            </li>
            <li style="text-align: center; margin-top: 20px">
              <van-button v-if="!btnShow" @click.native="pagage" type="primary"
                >打包</van-button
              >
              <van-button v-if="btnShow" @click.native="download" type="primary"
                >下载</van-button
              >
              <van-button
                v-if="btnShow"
                @click.native="downloadURL"
                style="margin-left: 30px"
                type="primary"
                >复制链接</van-button
              >
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <over-tab-bar />
    <loading text="打包中,请稍后..." v-if="loading" />
    <loading text="获取中..." v-show="getUserLoading" />
  </div>
</template>
<script>
import MixinClass from "@/mixin/aboutClass";
import UserList from "./children/UserList";
import Loading from "@/components/content/loading/Loading";
import Copy from "@/utils/copyToClip";
export default {
  name: "MyClass",
  mixins: [MixinClass],
  components: {
    UserList,
    Loading,
  },
  data() {
    return {
      classID: "",
      userID: "",
      userinfo: [],
      along_user: "",
      class_name: "",
      class_info: {},
      isAdmin: false,
      count: 0,
      timmer: null,
      X1: 0,
      middle: 0,
      show: false,
      downloadObj: {
        y_count: 0,
        n_count: 0,
        mission: {},
      },
      loading: false,
      getUserLoading: false,
      btnShow: false,
      url: "",
    };
  },
  methods: {
    async getUser() {
      // 发送请求之前获取一次ID
      this.getID();
      this.getUserLoading = true;
      let res = await this.$request({
        url: "/api/classes/getUser?classID=" + this.classID,
      });
      if (res.code == 200) {
        this.userinfo = [];
        let info = res.info;
        this.class_info = info.class_info;
        this.class_name = info.class_info.class_name;
        this.along_user = info.class_info.along_user;
        this.userinfo = info.user_info;
        this.count = info.user_info.length;
        // 将管理员筛选出来
        let index = 0;
        for (let i = 0, len = this.userinfo.length; i < len; i++) {
          if (this.userinfo[i]._id == this.along_user) {
            index = i;
            break;
          }
        }
        // 删除该项，追加到第一项中
        let admin = this.userinfo.splice(index, 1);
        // 重新加入到第一行
        this.userinfo.unshift(admin[0]);
        setTimeout(() => {
          this.$refs.userListRef.refreshDOM();
        }, 600);
        // 判断该用户是否是班级管理员
        if (this.userID == this.along_user) {
          this.isAdmin = true;
        }
        this.$store.commit("setAdmin", this.along_user);
      } else {
        this.$toast({
          type: "fail",
          message: "获取失败！",
        });
      }
      this.getUserLoading = false;
    },
    getID() {
      let str = localStorage.getItem("userinfo");
      if (!str) {
        this.classID = this.$store.state.classID;
        this.userID = this.$store.state._id;
      } else {
        let obj = JSON.parse(str);
        this.classID = obj.classID;
        this.userID = obj._id;
      }
    },
    // 添加任务
    onClickRight() {
      this.$router.push(`/index/createMission?id=${this.classID}`);
    },
    onTouchStart(e) {
      this.X1 = e.changedTouches[0].clientX;
    },
    onTouchEnd(e) {
      // 只有是管理员时，才进行滑动下载功能
      if (this.isAdmin == true) {
        let X2 = e.changedTouches[0].clientX;
        let X1 = this.X1;
        let middle = this.middle;
        if (
          X1 > middle - 100 &&
          X1 <= middle &&
          X2 < middle + 100 &&
          X2 > middle
        ) {
          // 下载对应的图片
          this.show = true;
          this.getMission();
        }
      }
    },
    // 执行下载任务
    async pagage() {
      this.loading = true;
      let res = await this.$request({
        url: "/api/others/download",
        method: "POST",
        data: {
          missionID: this.downloadObj.mission._id,
          count: this.downloadObj.mission.count,
          class_name: this.class_name,
        },
      });
      if (res.code == 200) {
        // 打包成功
        this.url = res.url;
        this.btnShow = true;
        this.$toast({
          type: "success",
          message:
            "打包成功，您可以点击复制链接到浏览器中或者点击下载直接下载到本地",
        });
      }
      this.loading = false;
    },
    // 点击下载功能
    download() {
      location.href = this.url;
    },
    downloadURL() {
      let tag = Copy(this.url);
      if (tag) {
        this.$toast({
          type: "success",
          message: "复制成功，请在浏览器中打开",
        });
      }
    },
    // 请求任务和提交的人数
    async getMission() {
      let res = await this.$request({
        url: "/api/mission/getCount?classID=" + this.classID,
      });
      if (res.code == 200) {
        this.downloadObj.y_count = res.obj.y_count;
        this.downloadObj.n_count = this.count - res.obj.y_count;
        this.downloadObj.mission = res.obj.mission;
      }
    },
  },
  created() {
    // 获取classID，刷新后获取
    this.getID();
    // 判断是否有班级ID，没有就不让其进入
    if (!this.classID) {
      this.$router.replace("/index/profile");
    }
    this.middle = window.innerWidth / 2;
  },
  mounted() {
    // 进入班级 进行获取班级数据的请求
    if (this.classID) {
      this.getUser();
    }
    // 监听链接到班级成功
    this.$soc.emit("login_class", {
      classID: this.classID,
      userID: this._id,
    });
    // 从邀请码页面跳转过来
    // 监听新用户加入  发射事件，监听所有人
    if (this.$route.query.type == "add") {
      this.$soc.emit("add_class", {
        _id: this.$store.state._id,
        classID: this.$store.state.classID,
      });
    }
    this.$soc.on("new_user", (data) => {
      // 监听的数据有可能有多个，因此要对其进行过滤，如果存在就不让其添加。
      for (let i = 0, len = this.userinfo.length; i < len; i++) {
        if (this.userinfo[i]._id == data._id) {
          return;
        }
      }
      // 将用户信息重新加入
      this.userinfo.push(data);
      this.count = this.userinfo.length;
      // 刷新DOM
      this.$refs.userListRef && this.$refs.userListRef.refreshDOM();
    });
  },
};
</script>
<style scoped>
.tips {
  margin-left: 10px;
  color: #ccc;
}
.download_nav {
  text-align: center;
  padding: 15px;
}
.download_main {
  padding-left: 10px;
}
</style>