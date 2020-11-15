<template>
  <div>
    <van-nav-bar class="nav_miss" title="青年大学习截图提交" />
    <van-pull-refresh
      style="min-height: 100vh"
      success-text="刷新成功"
      v-model="isLoading"
      @refresh="refresh"
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
          {{ info }}
        </div>
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
      isLoading: false,
      time: 0,
      showInfo: false,
      fileList: [],
      isSubmit: false,
    };
  },
  methods: {
    async getMission() {
      let classID = this.$store.state.classID;
      if (classID) {
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
            this.info = "任务已过期";
          } else {
            if (res.is_submit == true) {
              this.showInfo = true;
              this.info = "恭喜你已完成任务！";
            } else {
              this.time = left;
              this.showInfo = false;
            }
          }
        } else {
          this.showInfo = true;
          this.info = res.msg;
        }
      } else {
        this.showInfo = true;
        this.info = "请先加入班级";
      }
      this.isLoading = false;
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
            this.info = "恭喜你已经完成任务";
            this.showInfo = true;
            this.fileList = [];
          }
        }, 800);
      } else {
        file.status = "failed";
        this.$toast({
          type: "fail",
          duration: 800,
          message: "上传失败",
        });
      }
    },
    // btn_submit
  },
  created() {
    this.getMission();
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
</style>
