<template>
  <div>
    <!-- 标题 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUsersList"
            v-model="queryUser.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addselecter">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表展示区 -->
      <el-table stripe :data="usersList" border style="width: 100%">
        <el-table-column prop="username" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话" hidden></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="username" label="状态">
          <template slot-scope="slotProps">
            <el-switch
              @change="usersStatus(slotProps.row)"
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="slotProps">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(slotProps.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserIfo(slotProps.row.id)"
            ></el-button>
            <!-- 分配按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-setting"
                size="mini"
                @click="roleUsers(usersList.id)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryUser.pagenum"
          :page-sizes="[1, 2, 4, 10]"
          :page-size="queryUser.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹框组件 -->
    <el-dialog
      title="添加用户信息"
      :visible.sync="adddialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="addUserForm"
        :rules="userRules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFrom">重置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹框组件 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editdialogVisible"
      width="30%"
      :before-close="edithandleClose"
    >
      <el-form
        :model="editUserForm"
        :rules="edituserRules"
        ref="editUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditFrom">重置</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsersList();
  },
  data() {
    // 自定义校验规则;
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      usersList: [],
      queryUser: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0,

      adddialogVisible: false,
      editdialogVisible: false,

      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserForm: {},
      // 校验规则
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: blur },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: blur },

          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改校验表单
      edituserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: blur },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: blur },

          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 修改用户
    async showEditDialog(id) {
      // 根据用户id获取数据渲染列表
      const { data: res } = await this.$http.get("users/" + id);

      if (res.meta.status !== 200)
        return this.message.error("查询用户信息失败");
      this.$message.success("查询成功");
      // 渲染数据
      this.editUserForm = res.data;
      // 打开弹窗用户
      this.editdialogVisible = true;
    },
    // 提交修数据
    editUsers() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return this.$message.error("校验不通过");
        console.log(this.editUserForm.mobile);
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        this.editdialogVisible = false;
        this.getUsersList();
      });
    },

    //删除用户
    async deleteUserIfo(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(result);
      if (result !== "confirm") return this.$message.error("取消删除");
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getUsersList();
    },

    // 添加用户表单数据
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return;
        //合法 发送
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        //  更新列表
        this.getUsersList();
        // 关闭窗口
        this.handleClose();
      });
    },
    // 打开弹窗用户
    addselecter() {
      this.adddialogVisible = true;
    },

    //重置表单
    resetFrom() {
      this.$refs.addUserRef.resetFields();
    },
    // 重置修改表单
    resetEditFrom() {
      this.$refs.editUserRef.resetFields();
    },
    // 关闭添加用户的弹窗
    handleClose() {
      this.adddialogVisible = false;
    },
    // 关闭修改用户的弹窗
    edithandleClose() {
      this.editdialogVisible = false;
    },

    //获取表单数据
    async getUsersList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryUser
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);
      // 将获取到数据 赋值到data进行绑定
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    // 监听要显示的页码大小
    handleSizeChange(newPageSize) {
      this.queryUser.pagesize = newPageSize;

      this.getUsersList();
    },
    // 显示当前页面要跳到第几页
    handleCurrentChange(pageChange) {
      this.queryUser.pagenum = pageChange;
      this.getUsersList();
    },
    // 修改用户的状态
    async usersStatus(userInfo) {
      // this.$http.put('users/:uId/state/:type')
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        // 改回原来的值
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success("更新成功");
    }
  }
};
</script>
<style lang="less" scoped>
.el-card {
  background-color: #fff;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.block {
  margin-top: 15px;
}
</style>
