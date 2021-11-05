const app = getApp();
Component({
  data: {
    isIphoneX: false,
    isHiddenTabBar: false, // 是否隐藏tabbar
   
    selected:0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "/static/tabBar/home2.png",
        "selectedIconPath": "/static/tabBar/home_active2.png",
        "text": "画布"
      },
      {
        "pagePath": "/pages/logs/logs",
        "iconPath": "/static/tabBar/mall2.png",
        "selectedIconPath": "/static/tabBar/mall_active2.png",
        "text": "时钟"
      },
      {
        "pagePath": "/pages/haibao/index",
        "iconPath": "/static/tabBar/user2.png",
        "selectedIconPath": "/static/tabBar/user_active2.png",
        "text": "分享海报"
      },{
        "pagePath": "/pages/three/index",
        "iconPath": "/static/tabBar/user2.png",
        "selectedIconPath": "/static/tabBar/user_active2.png",
        "text": "3d立方体"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(e,data.index)
      wx.switchTab({url})
     app.globalData.index = data.index,
      this.setData({
        selected: data.index
      })
    }
  }
})