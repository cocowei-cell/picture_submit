<template>
  <div>
    <van-nav-bar class="nav_miss" title="青年大学习截图提交" />
    <van-pull-refresh
      style="min-height: 100vh"
      success-text="刷新成功"
      v-model="isLoading"
      @refresh="refresh"
      :disabled="disabled"
    >
      <div class="container">
        <div class="upload" v-if="!showInfo">
          <div class="message">
            <h1>欢迎来到 {{ mission.name }}</h1>
            <p>
              本次需提交
              <span style="color: red; font-size: 20px">{{
                mission.count
              }}</span>
              张截图
            </p>
            <p>
              <span>提交截止倒计时</span>
              <van-count-down
                style="color: red; font-size: 20px; margin-top: 15px"
                :time="time"
                format="DD 天 HH 时 mm 分 ss 秒"
                @finish="finish"
              />
            </p>
          </div>
          <div class="up">
            <span id="infos">点击图标上传</span>
            <van-uploader
              :preview-full-image="false"
              :before-read="beforeRead"
              v-model="fileList"
              multiple
              :max-count="mission.count"
              :after-read="afterRead"
            />
          </div>
        </div>
        <div class="info" v-else>
          <p>{{ info }}</p>
        </div>
      </div>
      <div
        v-if="success"
        @touchstart="touchstart"
        @touchend="touchend"
        class="touch_container"
      >
        <div class="touch">
          <div class="box" :class="{ active: touchTag }"></div>
        </div>
        <div class="tips">长按撤销</div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: "Mission",
  data() {
    return {
      mission: {},
      info: "",
      success: false,
      isLoading: false,
      time: 0,
      showInfo: false,
      fileList: [],
      isSubmit: false,
      disabled: false,
      touchTag: false,
      timmer: null,
    };
  },
  methods: {
    async getMission() {
      let classID = "";
      // 优先从缓存中获取
      let str = localStorage.getItem("userinfo");
      let obj = JSON.parse(str);
      classID = str ? obj.classID : this.$store.state.classID;
      if (classID) {
        this.fileList = [];
        let res = await this.$request({
          url: "/api/mission/get?classId=" + classID,
        });
        if (res.code == 200) {
          this.mission = res.mission;
          // 判断其是否提交
          this.isSubmit = res.is_submit;
          let left = this.mission.time - Date.now();
          if (left < 0) {
            this.showInfo = true;
            this.success = false;
            this.info = "任务已过期";
          } else {
            if (res.is_submit == true) {
              this.showInfo = true;
              this.success = true;
              this.info = "恭喜你已完成任务！";
            } else {
              this.time = left;
              this.success = false;
              this.showInfo = false;
            }
          }
        } else {
          this.showInfo = true;
          this.success = false;
          this.info = res.msg;
        }
      } else {
        this.showInfo = true;
        this.success = false;
        this.info = "请先加入班级";
      }
      this.isLoading = false;
    },
    // 定时结束时触发
    finish() {
      this.showInfo = true;
      this.info = "任务已过期";
    },
    refresh() {
      this.getMission();
    },
    beforeRead(file) {
      let tag = Object.prototype.toString.call(file);
      // 如果是数组
      if (tag.includes("Array")) {
        for (let i = 0; i < file.length; i++) {
          if (!file[i].type.includes("image")) {
            this.$toast({
              type: "warning",
              duration: 800,
              message: "请上传图片类文件",
            });
            return false;
          }
        }
      } else {
        if (!file.type.includes("image")) {
          this.$toast({
            type: "warning",
            duration: 800,
            message: "请上传图片类文件",
          });
          return false;
        }
        return true;
      }
    },
    async afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      let File = file.file;
      const Form = new FormData();
      Form.append("pic", File);
      this.disabled = true;
      let res = await this.$request({
        url:
          "/api/others/upload?missionID=" +
          this.mission._id +
          "&num=" +
          this.fileList.length +
          "&count=" +
          this.mission.count,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: Form,
      });
      if (res.code == 200) {
        file.status = "done";
        this.$toast({
          type: "success",
          duration: 800,
          message: res.msg,
        });
        setTimeout(() => {
          // 如果已经完成
          if (res.isOver == true) {
            this.isSubmit = true;
            this.info = "恭喜你已经完成任务!";
            this.success = true;
            this.showInfo = true;
            this.fileList = [];
          }
        }, 800);
      } else {
        file.status = "failed";
        file.message = "上传失败";
        this.$toast({
          type: "fail",
          duration: 800,
          message: "上传失败，请删除后再次尝试",
        });
      }
      this.disabled = false;
    },
    touchstart() {
      this.disabled = true;
      this.touchTag = true;
      this.timmer = setTimeout(async () => {
        // 删除开始
        let id = this.$store.state._id;
        let res = await this.$request({
          url: "/api/user/deletePicture/" + id,
          method: "DELETE",
        });
        if (res.code == 200) {
          this.$toast({
            type: "success",
            duration: 800,
            message: "撤销成功",
          });
          this.refresh();
        } else {
          this.$toast({
            type: "fail",
            duration: 800,
            message: "撤销失败",
          });
        }
      }, 1300);
    },
    touchend() {
      this.touchTag = false;
      this.disabled = false;
      this.timmer && clearTimeout(this.timmer);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getMission();
    });
  },
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: calc(100vh - 96px);
  background-color: #ffffff;
  text-align: center;
  padding-top: 20px;
}

.message h1 {
  font-size: 18px;
}

.message {
  color: #262626;
}

.up {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#infos {
  margin-right: 10px;
}
.btn_submit {
  margin-top: 25px;
}
.info {
  text-align: center;
  color: red;
  font-size: 20px;
}
.nav_miss {
  box-shadow: 0 0 5px #ccc;
}
.touch {
  position: fixed;
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  overflow: hidden;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 3px 0px rgba(204, 204, 204, 0.9);
}
.tips {
  user-select: none;
  position: fixed;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  z-index: 1;
}
.touch .box {
  width: 0;
  height: 0;
  background-color: #4595e6;
  transition: all 1.3s;
  border-radius: 50%;
}
.active.box {
  width: 100%;
  height: 100%;
}
</style>
