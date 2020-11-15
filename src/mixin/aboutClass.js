import OverTabBar from '../views/index/children/OverTabBar'
export default {
  components:{
    OverTabBar
  },
  methods: {
    onClickLeft() {
      this.$router.replace("/index/profile")
    }
  },
}