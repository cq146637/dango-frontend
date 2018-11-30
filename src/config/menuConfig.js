const menuList = [
    {
        title: '大盘统计',
        key: '/home'
    },
    {
        title: '房间管理',
        key: '/room'
    },
    {
        title: '标准管理',
        key: '/standard'
    },
    {
        title: '图片管理',
        key: '/pic'
    },
    {
        title: '订单管理',
        key: '/order'
    },
    {
        title: '评价管理',
        key: '/remark'
    },
    {
        title: '用户管理',
        key: '/user',
        children: [
            {
                title: '管理员查询',
                key: '/user/admin',
            },
            {
                title: '客户查询',
                key: '/user/customer',
            }
        ]
    },
];
export default menuList;