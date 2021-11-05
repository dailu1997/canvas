// logs.js
let context = '';
Page({
  data: {
    logs: []
  },
  onLoad() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 屏幕宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 高度,宽度 单位为px
        that.setData({
        x: res.windowWidth/2,
        y: res.windowHeight/2
        })
      }
    })
    
    wx.createSelectorQuery()
    .select("#canvas")
    .context(function (res) {
      console.log("节点实例：", res); // 节点对应的 Canvas 实例。
      context = res.context;
      context.translate(207,336)
      wx.hideLoading()
    })
    .exec();
    let width = 500;
    let height = 300;
    wx.showLoading({
      title: '加载中...',
    })
    let bgPicturePath = "https://xcx.upload.utan.com/article/coverimage/2018/01/25/eyJwaWMiOiIxNTE2ODU0MTg2OTY1NSIsImRvbWFpbiI6InV0YW50b3V0aWFvIn0=";//图片路径不要出错
    wx.getImageInfo({
      src: bgPicturePath, //请求的网络图片路径
      success: function (res) {
       console.log('下载网络图片成功', res)
       context.drawImage(res.path, -150, -150, width, height);
       context.draw(true);
       that.dial();
       that.zhen();
       wx.hideLoading()
      },
      fail: function (res) {
        console.log('下载网络图片失败', res)
        fail(res)
      },
    })
  },

  // 绘制表盘 
  dial(){
    context.arc(0,0,200,0,2*Math.PI)
    // context.setFillStyle('#cccccc')
    // context.fill()
    for (var i=0;i<12;i++){
      context.rotate(30*Math.PI/180);
      context.beginPath();
      context.moveTo(130,0);
      context.lineTo(150,0);
      context.stroke();
    }
    for (var i=0;i<60;i++){
      context.rotate(6*Math.PI/180);
      context.beginPath();
      context.moveTo(140,0);
      context.lineTo(150,0);
      context.stroke();
  }
  context.draw(true);
  },
  // 针
  zhen(){
    
    context.rotate(6*Math.PI/180);
      context.beginPath();
      context.moveTo(0,0);
      context.lineTo(0,-100);
      context.stroke();
      context.draw(true);
  },
  getimg: function () {
    wx.showLoading({
      title: '签名生成中..',
      mask:true
    })
    let that = this;
    //先拿到竖着的地址给image,挡住下面的操作!
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      quality: 1,
      success: function (res) {
        //把当前的图片放上去挡住,接着操作下面的canvas
        that.setData({
          src: res.tempFilePath,
        })
        that.baocun();
        wx.hideLoading()
      }
    })
 
  },
  baocun() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.src,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {
            that.setData({
              maskHidden: false
            })
          }
        })
      }
    })
  },
  onShow(){
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
  }
})
