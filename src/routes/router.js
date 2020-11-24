export default [
  {
    path: "/",
    redirect: "/login",
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/Login"),
  },
  {
    name: "regester",
    path: "/regester",
    component: () => import("@/views/regester/Regester"),
  },
  {
    name: "modify",
    path: "/modify",
    component: () => import("@/views/Modify"),
  },
  {
    name: "index",
    path: "/index",
    redirect: "/index/mission",
    component: () => import("@/views/index/Index"),
    children: [
      {
        name: "mission",
        path: "mission",
        component: () => import("@/views/index/Mission"),
      },
      {
        name: "submit",
        path: "submit/:id",
        component: () => import("@/views/index/HandleMission"),
      },
      {
        name: "profile",
        path: "profile",
        component: () => import("@/views/index/Profile"),
      },
      {
        name: "addClass",
        path: "addClass",
        component: () => import("@/views/index/AddClass"),
      },
      {
        name: "createClass",
        path: "createClass",
        component: () => import("@/views/index/CreateClass"),
      },
      {
        name: "myClass",
        path: "myClass",
        component: () => import("@/views/index/MyClass"),
      },
      {
        name: "createMission",
        path: "createMission",
        component: () => import("@/views/index/CreateMission"),
      },
    ],
  },
];
