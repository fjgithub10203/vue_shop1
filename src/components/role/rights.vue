<template>
  <div>
    <!-- 面包穴导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-card class="box-card">
      <el-table :data="rightsList">
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="等级" prop="level">
          <template slot-scope="slotPros">
            <el-tag v-if="slotPros.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="slotPros.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else-if="slotPros.row.level === '2'"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getRighsList();
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getRighsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.$message.success("获取权限列表成功");
      this.rightsList = res.data;
    }
  }
};
</script>
<style lang="less" scoped></style>
