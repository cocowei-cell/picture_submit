<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  data() {
    return {
      Scroll:null
    }
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        if (!this.Scroll) {
          // 2 手指滚动侦测  惯性不侦测
          this.Scroll = new BScroll(this.$refs.wrapper, {
            probeType: 3,
            click: true,
            scrollY: true,
            pullUpLoad: true,
          });
          let bs = this.Scroll;
          // 滚动时候发射一个事件
          bs.on("scroll",  ()=> {
            this.$emit("scrolls");
          });
          bs.on("scrollEnd",()=>{
            this.$emit("scrEnd")
          })
          // 只会加载一次
          /* bs.on("pullingUp", function () {
            console.log("上拉加载更多");
            // 完成加载更多
            bs.finishPullUp();
          }); */
        } else {
          this.Scroll.refresh();
        }
      });
    },
    refresh() {
      this.Scroll && this.Scroll.refresh();
    }
  },
  mounted() {
    setTimeout(() => {
      this.initScroll()
    },20)
  },
};
</script>
<style scoped>
</style>