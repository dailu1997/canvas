// pages/haibao/index.js
var context = null
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.createSelectorQuery()
    .select("#canvas")
    .context(function (res) {
      console.log("节点实例：", res); // 节点对应的 Canvas 实例。
      context = res.context;
    })
    .exec(function(res){
       that.pic();
    });
   
  },
  // 获取绘制
  pic (){
    let bgPicturePath = "https://xcx.upload.utan.com/article/coverimage/2018/01/25/eyJwaWMiOiIxNTE2ODU0MTg2OTY1NSIsImRvbWFpbiI6InV0YW50b3V0aWFvIn0=";//图片路径不要出错
    let avatar = '../three/pikachu.png'
    wx.getImageInfo({
      src: bgPicturePath, //请求的网络图片路径
      success: function (res) {
       console.log('下载网络图片成功', res)
       context.drawImage(res.path, 0, 0, 285, 536);
       context.draw(true);
       context.drawImage(avatar, 130, 160, 38, 38);
       context.draw(true);
      },
      fail: function (res) {
        console.log('下载网络图片失败', res)
        fail(res)
      },
    })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})