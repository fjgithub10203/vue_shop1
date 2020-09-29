<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="nav_header">
      <div class="logo">
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="layOut">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="isCollapse?'64px':'200px'">
        <div class="aside_collapse" @click="btnisCollapse">|||</div>
        <el-menu
          background-color="#333744 "
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + itemsub.path"
              v-for="itemsub in item.children"
              :key="itemsub.id"
              @click="saveNavPath('/' + itemsub.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{ itemsub.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menuList: [],
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    layOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 将获取到数据 赋值到data进行绑定
      this.menuList = res.data
    },
    // 是否折叠
    btnisCollapse () {
      this.isCollapse = true
    },
    saveNavPath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-container {
  height: 100%;
}
.el-menu {
  border-right: none;
}
.aside_collapse {
  width: 100%;
  height: 25px;
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.el-main {
  background-color: #eaedf1;
}
</style>
