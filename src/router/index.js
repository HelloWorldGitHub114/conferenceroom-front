import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import error from '../views/error'
import index from '../views/index'
import conference_room from "../views/conference_room";
import applyConference from "../views/applyConference";
import conferenceRecordByUser from "../views/conferenceRecordByUser";
import conferenceRecordByAdmin from "../views/conferenceRecordByAdmin";
import home from '../views/home';


Vue.use(VueRouter);

  const routes = [

    {
      path: "/",
      name: 'genmulu',
      redirect:{name:'login'}
      // redirect:'/login'

    },
    {
      path:"/login",
      name:'login',
      component:login
    },
    {
      path:"/index",
      name:'index',
      component:index,
      meta:{
        title:'首页',
        requireAuth:true,
      },
      children:[
        {
          path:"/",
          name:'home',
          component:home,
        },
        {
          path:"/conference_room",
          name:'conference_room',
          component:conference_room,
          meta:{
            title:'会议室管理',
            requireAuth:true,
            role:['admin']
          }
        },
        {
          path:"/applyConference",
          name:'applyConference',
          component:applyConference,
          meta:{
            title:'会议室申请',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/conferenceRecordByUser",
          name:'conferenceRecordByUser',
          component:conferenceRecordByUser,
          meta:{
            title:'查看申请记录',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/conferenceRecordByAdmin",
          name:'conferenceRecordByAdmin',
          component:conferenceRecordByAdmin,
          meta:{
            title:'查看申请记录',
            requireAuth:true,
            role:['admin']
          }
        },
      ]

    },

    {
      path:'*',
      name:'error',
      component:error
    }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
