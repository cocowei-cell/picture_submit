<template>
  <div>
    <div class="list_item">
      <span>{{ text }}</span>
      <van-icon class="fr icon" name="arrow" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileListItem",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped>
.list_item {
  color: #333;
  font-weight: 530;
  font-size: 14px;
  padding-left: 25px;
  height: 50px;
  box-sizing: border-box;
  line-height: 50px;
  width: 100%;
  border-radius:12px;
  border-bottom: 1px solid #eee;
  background-color: #fefefe;
}
.list_item:active {
  background-color:rgba(0,0,0,0.1);
}
.fr.icon {
  margin-right: 20px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
</style>