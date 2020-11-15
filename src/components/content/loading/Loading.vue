<template>
  <div class="loading">
    <van-loading :color="color" vertical :size="size">{{ text }}</van-loading>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    text: {
      type: String,
      default: "加载中...",
    },
    color: {
      type: String,
      default: "#c9c9c9",
    },
    size:{
      type:String,
      default:"24px"
    }
  },
};
</script>
<style scoped>
.loading {
  position: fixed;
  z-index: 9999999;
  top: 50%;
  left: 50%;
  transform:translate(-50%, -50%);
}
</style>