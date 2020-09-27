<template>
  <div>
    <el-button type="info" @click="layOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    layOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped></style>
