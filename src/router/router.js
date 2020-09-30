import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/users.vue";
import Rights from "../components/role/rights.vue"
import Roles from "../components/role/roles.vue"

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
      path: "/",
      component: Login
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [{
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/users",
          component: Users
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        }
      ]
    }
  ]
});

// 权限控制
router.beforeEach((to, form, next) => {
  if (to.path === "/login") {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) {
    return next("/login");
  }

  next();
});
export default router;
