import { createWebHistory,createRouter } from "vue-router";
import Home from "../Home.vue";
import Login from "../Login.vue";
import Signup from "../Signup.vue";
import Dashboard from "../Dashboard.vue";

const routes=[
   {
    path: "/",
    name: "home",
    component: Home,
   },
   {
    path:'/login',
    name:"login",
    component:Login
   },
   {
    path:'/signup',
    name:'signup',
    component:Signup
   },
   {
    path:'/dashboard',
    name:'dashboard',
    component:Dashboard
   }
]

const router=createRouter({history:createWebHistory(),routes});
export default router;