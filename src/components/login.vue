<template>
  <div class="login_container">
    <!-- 图像区 -->
    <div class="login_box">
      <div class="login_avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form
        ref="ruleForm11"
        :model="login_form"
        :rules="ruleForm"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item class="form_input" prop="username">
          <el-input
            v-model="login_form.username"
            prefix-icon="iconfont icon-zhanghao-"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="form_input" prop="password">
          <el-input
            v-model="login_form.password"
            prefix-icon="iconfont icon-tubiaozhizuomoban1-01"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginForm">登陆</el-button>
          <el-button type="primary" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login_form: {
        username: "admin",
        password: "123456"
      },
      // 表单的验证规则
      ruleForm: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.ruleForm11.resetFields();
    },
    loginForm() {
      this.$refs.ruleForm11.validate(async value => {
        if (!value) return;
        // 发送登陆请求
        const { data: res } = await this.$http.post("/login", this.login_form);

        if (res.meta.status !== 200) {
          this.$message("登陆失败");
        } else {
          this.$message({
            message: "登陆成功",
            type: "success"
          });
          // 保存token
          window.sessionStorage.setItem("token", res.data.token);
          console.log(this);
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .login_avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    border-radius: 50%;
    border: 1px solid #eee;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
