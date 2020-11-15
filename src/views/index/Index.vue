<template>
  <div>
    <keep-alive include="Mission">
      <router-view></router-view>
    </keep-alive>
    <tab-bar class="tab_bar" />
  </div>
</template>

<script>
import TabBar from "./TabBar";
export default {
  name: "Index",
  components: {
    TabBar,
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {},
  created() {},
};
</script>
<style scoped>
</style>