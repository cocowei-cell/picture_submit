<template>
  <div>
    <van-nav-bar
    title="我的" />
    <logo/>
    <!-- 展示列表 -->
    <profile-list/>
  </div>
</template>

<script>
import Logo from '@/components/content/logo/Logo'
import ProfileList from "./children/ProfileList"
export default {
  name:'Profile',
  components:{
    Logo,
    ProfileList
  }
}
</script>
<style scoped>

</style>