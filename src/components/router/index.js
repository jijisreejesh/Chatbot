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
    path:'/dashboard/:id',
    component:Dashboard,
    props : true // Pass route params as props to the component
   }
]

const router=createRouter({history:createWebHistory(),routes});
export default router;