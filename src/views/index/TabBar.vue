<template>
  <div>
    <van-tabbar route v-model="active" class="tab_bar">
      <van-tabbar-item to="/index/mission" icon="chat-o">任务</van-tabbar-item>
      <van-tabbar-item to="/index/profile" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      active:0
    }
  },
  methods:{
    
  }
};
</script>
<style scoped>
.tab_bar {
  height:50px;
}
</style>