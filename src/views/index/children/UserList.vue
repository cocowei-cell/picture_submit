<template>
  <div>
    <scroll ref="scrolls" class="wrapper" @scrolls="locks" @scrEnd="ends">
      <user-list-item
        @touchstart.native="handleUser(item)"
        @touchend.native="clear"
        v-for="item in users"
        :key="item._id"
        :user="item"
      />
      <div class="footer">被你发现了^_^</div>
    </scroll>
    <van-action-sheet
      class="sheet"
      @select="sel"
      @close="$store.commit('setCurrentID', '')"
      cancel-text="取消"
      v-model="isShow"
      title="操作选项(请谨慎操作)"
      :actions="actions"
    >
    </van-action-sheet>
  </div>
</template>

<script>
import UserListItem from "./UserListItem";
import Scroll from "@/components/common/scroll/Scroll";
import { mapState } from "vuex";
export default {
  name: "UserList",
  components: {
    Scroll,
    UserListItem,
  },
  props: {
    users: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      timer: null,
      refreshClock: null,
      isShow: false,
      current: null,
      clock: false,
      tag: true,
      actions: [
        {
          name: "删除用户",
          color: "#ee0a24",
        },
        {
          name: "重置用户密码",
          color: "#ee0a24",
        },
        {
          name: "删除截图",
          color: "#ee0a24",
        },
      ],
    };
  },
  computed: {
    ...mapState(["alongUser"]),
  },
  methods: {
    locks() {
      this.clock = true;
    },
    // 滚动结束
    ends() {
      this.clock = false;
      this.tag = true;
    },
    handleUser(data) {
      // 手指按下后是否滚动
      setTimeout(() => {
        if (this.clock) {
          this.tag = false;
        }
      }, 500);
      if (this.tag) {
        // 判断是否是管理员
        let flag = this.checkIsAdmin();
        // 如果是管理员
        if (flag && this.clock !== true) {
          // 开启定时器
          this.timer = setTimeout(() => {
            if (this.tag == false) {
              return;
            }
            this.$store.commit("setCurrentID", data._id);
            if (this.alongUser == data._id) {
              // 不可以删除自己
              this.$dialog.alert({
                title: "Tips",
                message: "删除自己？什么鬼？",
              });
              return this.$store.commit("setCurrentID", "");
            }
            // 弹出
            this.current = data;
            this.tag = true;
            this.isShow = true;
            this.clock = false;
          }, 800);
        } else {
          return;
        }
      }
    },
    checkIsAdmin() {
      return this.$store.state._id === this.$store.state.alongUser;
    },
    sel(e) {
      if (e.name == "删除用户") {
        // 删除用户
        this.confirm({
          message: `确认删除${this.current.stu_name}吗？`,
          title: "删除用户",
        })
          .then(async () => {
            let res = await this.$request({
              url: "/api/user/delete/" + this.current._id,
              method: "DELETE",
            });
            if (res.code == 200) {
              this.$toast({
                type: "success",
                message: res.msg,
              });
              // 重新去获取数据
              this.$emit("refreshData");
            } else {
              this.$toast({
                type: "fail",
                message: res.msg,
              });
            }
            this.isShow = false;
            this.$store.commit("setCurrentID", "");
          })
          .catch(() => {
            return;
          });
      } else if (e.name == "重置用户密码") {
        // 重置用户密码
        this.confirm({
          message: `确认重置${this.current.stu_name}的密码吗？重置后的密码为123456`,
          title: "重置用户密码",
        })
          .then(async () => {
            let res = await this.$request({
              url: "/api/user/refresh",
              method: "put",
              data: {
                _id: this.current._id,
              },
            });
            if (res.code == 200) {
              this.$toast({
                type: "success",
                message: res.msg,
              });
            } else {
              this.$toast({
                type: "fail",
                message: res.msg,
              });
            }
            this.isShow = false;
            this.$store.commit("setCurrentID", "");
          })
          .catch(() => {
            return;
          });
      } else {
        // 重置用户密码
        this.confirm({
          message: `确认删除${this.current.stu_name}的截图吗？`,
          title: "删除截图",
        })
          .then(async () => {
            let res = await this.$request({
              url: "/api/user/deletePicture/" + this.current._id,
              method: "delete",
            });
            if (res.code == 200) {
              this.$toast({
                type: "success",
                duration: 800,
                message: res.msg,
              });
            } else {
              this.$toast({
                type: "fail",
                duration: 800,
                message: res.msg,
              });
            }
            this.isShow = false;
            this.$store.commit("setCurrentID", "");
          })
          .catch(() => {
            return;
          });
      }
    },
    // 确认弹出框
    confirm(optios) {
      return this.$dialog.confirm({
        title: optios.title,
        message: optios.message,
      });
    },
    // 松开清楚定时器
    clear() {
      this.timer && clearTimeout(this.timer);
    },
    // 刷新DOM
    refreshDOM() {
      this.$refs.scrolls &&
        this.$refs.scrolls.refresh &&
        this.$refs.scrolls.refresh();
    },
    loadFinish() {
      this.$bus.$on("finished", () => {
        this.debounce()();
      });
    },
    // 防抖
    debounce() {
      let timer = this.refreshClock;
      let that = this;
      return function () {
        timer && clearTimeout(timer);
        that.refreshClock = setTimeout(() => {
          that.refreshDOM();
        }, 200);
      };
    },
  },
  updated() {
    this.loadFinish();
  },
};
</script>
<style scoped>
.footer {
  padding: 8px;
  text-align: center;
  color: #ccc;
}
.wrapper {
  position: relative;
  z-index: 9999;
  overflow: hidden;
  height: calc(100vh - 75px);
  margin-top: 5px;
  user-select: none;
}
.sheet {
  z-index: 99999 !important;
}
</style>