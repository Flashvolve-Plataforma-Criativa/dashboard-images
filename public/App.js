import Dashboard from './views/Dashboard.js';

const socket = io("/");

const routes = [
  { name: "Dashboard", path: '/:path', component: Dashboard},
];

const instanceAxios = axios.create({
  baseURL: 'https://slow-canyon-parcel.glitch.me',
  timeout: 50000
});

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach(async (to, from, next) => {
  next();
});

const app = new Vue({
  el: '#app',
  router,
  data: {
    instanceAxios: instanceAxios,
    socket: socket
  },
  created: function(){
    console.log('Opa');
  },
  render: h => h('router-view')
});