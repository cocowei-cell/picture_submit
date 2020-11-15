<template>
  <div class="profile_list">
    <profile-list-item @click.native="addClass" text="加入班级"/>
    <profile-list-item @click.native="createClass" text="创建班级" />
    <profile-list-item @click.native="myClass" class="item" text="我的班级" />
    <van-button @click.native="logOut" class="btn_logout" round type="warning">退出登录</van-button>
  </div>
</template>

<script>
import ProfileListItem from "./ProfileListItem";
export default {
  name: "ProfileList",
  data() {
    return {
      classID:""
    }
  },
  components: {
    ProfileListItem,
  },
  methods: {
    logOut() {
      // 提示是否要退出
      // 删除token和vuex
      this.$store.commit('setUserInfo',{
        stu_name: "",
        _id: "",
        stu_number: "",
        classID:""
      })
      localStorage.clear()
      this.$router.replace('/login');
    },
    createClass() {
      // 跳转到班级创建班级页面
      // 如果没有创建班级就跳转到对应班级页面
      if(!this.classID) {
        this.$router.push('/index/createClass')
      } else {
        this.$toast({
          type:"info",
          duration:900,
          forbidClick:true,
          message:"您已加入班级，不能创建班级"
        })
      }
    },
    // 我的班级
    myClass() {
      if(this.classID) {
         this.$router.push('/index/myClass')
      } else {
        this.$toast({
          type:"info",
          duration:900,
          forbidClick:true,
          message:"您还未加入班级，请获取邀请码后加入班级"
        })
      }
    },
    addClass() {
      if(!this.classID) {
        this.$router.push('/index/addClass')
      } else {
        this.$toast({
          type:"info",
          duration:900,
          forbidClick:true,
          message:"您已加入过班级，不能再次加入班级"
        })
      }
    }
  },
  created() {
    this.classID = this.$store.state.classID
  },
};
</script>
<style scoped>
.profile_list {
  padding: 10px;
  overflow: hidden;
}
.item {
  margin-top: 10px;
}
.btn_logout {
  margin-top:20px;
  width: 100%;
}
</style>