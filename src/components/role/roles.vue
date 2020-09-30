<template>
  <div>
    <!-- 面包穴导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">主要按钮</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表展示区 -->
      <el-table :data="roleList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, in1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', in1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级列表 -->
              <el-col :span="5">
                <el-tag>
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级列表 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, in2) in item1.children"
                  :key="item2.id"
                  :class="[in2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable
                      >"
                      {{ item2.authName }}
                    </el-tag>

                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="CloseRightsAndRole(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="small" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="small"
              type="warning"
              icon="el-icon-setting"
              @click="showRoleList(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出对话框 -->
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisibleRole" width="30%">
      <el-tree
        :data="rightList"
        :props="defaultProps1"
        default-expand-all
        show-checkbox
        :default-checked-keys="checkKey"
        ref="treeRef"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRole">重置</el-button>
        <el-button type="primary" @click="toRoleAddRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      roleList: [],
      rightList: [],
      dialogVisibleRole: false,
      defaultProps1: {
        children: "children",
        label: "authName"
      },
      checkKey: [],
      // 角色Id
      roleId: ""
    };
  },
  methods: {
    // 展示分配权限选项卡
    async showRoleList(role) {
      this.roleId = role.id;
      // 获取权限列表页
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取权限失败");
      //把获取到权限数据保存到data中
      this.rightList = res.data;

      this.getRoleCheckKey(role, this.checkKey);

      this.dialogVisibleRole = true;
    },
    // 递归获取选中或半选中的子节点
    getRoleCheckKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getRoleCheckKey(item, arr);
      });
    },

    // 为角色分配权限
    async toRoleAddRight() {
      const keysId = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const keyStr = keysId.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keyStr }
      );
      if (res.meta.status !== 200) return this.$message.error("添加权限失败");
      this.getRoleList();
      this.dialogVisibleRole = false;
    },
    // 重置角色数据
    closeRole() {
      this.checkKey = [];
    },

    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");

      this.$message.success("获取角色成功");
      this.roleList = res.data;
    },
    // 关闭权限事件
    async CloseRightsAndRole(roles, rightsId) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result !== "confirm") return this.$message.error("取消关闭");

      // 发起删除 角色和权限数据
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightsId}`
      );

      if (res.meta.status !== 200) return this.$message.error("删除数据失败");
      this.$message.success("删除权限成功");
      //  更新数据显示
      roles.children = res.data;
    }
  }
};
</script>
<style lang="less" scoped>
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.el-tag {
  margin: 7px;
}
</style>
