<template>
  <div>
    <div class="logo">
      <img src="~@/assets/logog.jpg" alt="logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Logo",
};
</script>
<style scoped>
.logo {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.logo img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>