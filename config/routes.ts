export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'},
      {name: '用户中心', path: '/user/center', component: './User/UserInfo'}
    ],
  },
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome'},
  {path: '/interface_info/:id', name: '接口信息', icon: 'smile', component: './InterfaceInfo', hideInMenu: true,},
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {path: '/admin', redirect: '/admin/interfaceInfoList'},
      {path: '/admin/interfaceInfoList', name: '接口管理表', component: './Admin/InterfaceInfo'},
      {path: '/admin/userList', name: '用户管理表', component: './Admin/UserList'},
    ],
  },
  {name: '查询接口', icon: 'table', path: '/list', component: './InterfaceInfoList'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
