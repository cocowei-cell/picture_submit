<template>
  <div
    @load="loadFinish"
    class="user_item"
    :class="{ active: user._id == currentID }"
  >
    <span class="num">{{ user.stu_number }}</span>
    <span class="name">{{ user.stu_name }}</span>
    <span v-if="isAdmin" class="admin fr">班级管理员</span>
  </div>
</template>

<script>
export default {
  name: "UserListItem",
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isAdmin: false,
    };
  },
  computed: {
    currentID() {
      return this.$store.state.currentID;
    },
  },
  methods: {
    checkAdmin() {
      if (this.user._id == this.$store.state.alongUser) {
        this.isAdmin = true;
      }
    },
    loadFinish() {
      this.$bus.$emit("finished");
    },
  },
  created() {
    this.checkAdmin();
  },
  mounted() {
    this.loadFinish();
  },
};
</script>
<style scoped>
.user_item {
  color: #333;
  font-weight: 530;
  font-size: 14px;
  padding-left: 25px;
  height: 50px;
  box-sizing: border-box;
  line-height: 50px;
  width: 100%;
  border-radius: 12px;
  border-bottom: 1px solid #eee;
  background-color: #fefefe;
}
.user_item .name {
  margin-left: 10px;
}
.user_item.active {
  background-color: rgba(0, 0, 0, 0.1);
}
.admin.fr {
  margin-right: 18px;
}
</style>