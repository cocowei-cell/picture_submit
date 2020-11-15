<template>
<!-- 遮挡tabbar白色背景 -->
  <div class="over_tab_bar">
  </div>
</template>

<script>
export default {
  name:'OverTabBar',
}
</script>
<style scoped>
.over_tab_bar {
  z-index:999;
  width:100vw;
  height:50px;
  position:fixed;
  left:0;
  bottom:0;
  background-color:#f7f8fa;
}
</style>