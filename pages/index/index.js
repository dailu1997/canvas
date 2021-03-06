// canvas 全局配置
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var arrx = [];//所有点的X轴集合
var arry = [];//所有点的Y轴集合
var canvasw = 0;//画布的宽 
var canvash = 0;//画布的高
var top = 0;
var left = 0;
let app = getApp();
//注册页面
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  //绘制之前
  canvasStart: function (event) {
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
    //就算点击之后手指没有移动,那么下次要移动之前还是必定会先触发这个
  },
  //手指移动过程
  canvasMove: function (event) {
    context.moveTo(arrx[arrx.length - 1], arry[arrx.length - 1])
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
    context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);
    context.setLineWidth(4);//设置线条的宽度
    context.setStrokeStyle(this.data.pen); // 画笔颜色
    context.setLineCap('round');//设置结束时 点的样式
    context.stroke();//画线
    context.draw(true);//设置为true时，会保留上一次画出的图像，false则会清空
  },
  //手指离开
  canvasEnd: function (event) {
 
  },
  clickPen(e){
   let c = e.currentTarget.dataset.c
    this.setData({
      pen:c
    })
    console.log(this.data.pen)
  },
  cleardraw: function () {
    //清除画布
    arrx = [];
    arry = [];
    // arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(false);
    this.setData({
      cvsHeight: "100%",
      src:''
    })
  },
  //导出图片
  getimg: function () {
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    wx.showLoading({
      title: '签名生成中..',
      mask:true
    })
    let that = this;
    //先拿到竖着的地址给image,挡住下面的操作!
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      quality: 1,
      // width: canvasw,
      // height: canvash,
      // destWidth: canvasw,
      // destHeight: canvasw * canvasw / canvash,
      success: function (res) {
        //把当前的图片放上去挡住,接着操作下面的canvas
        that.setData({
          src: res.tempFilePath,
          cvsHeight: canvasw * canvasw / canvash
        })
        context.clearRect(0, 0, canvasw, canvash);
        
        context.translate(0, canvasw/2.4);
        context.rotate(270 * Math.PI / 180);
        context.drawImage(res.tempFilePath, 0, 0,canvasw * canvasw / canvash, canvasw);
        context.draw(false, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            success: result => {
              var tempFilePath = res.tempFilePath;
              that.setData({
                imagePath:tempFilePath
              })
              that.baocun();
             //转成base64
              wx.getFileSystemManager().readFile({ 
                  filePath: res.tempFilePath, //选择图片返回的相对路径
                  encoding: 'base64', //编码格式
                  success: result => { //成功的回调
                    let base64 = result.data;    
                  }
              })  
             
              //全局变量,用于返回显示
              // app.globalData.pages.cvsAutograph.autograph = result.tempFilePath;
              // wx.navigateTo({
              //   url: '../index/index'
              // })
              wx.hideLoading()
            }
          }, this)
        }, 100))
      }
    })
 
  },
  baocun() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
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
   * 页面的初始数据
   */
  data: {
    src: "",
    cvsHeight:'100%',
    pen:'#000000'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 使用 wx.createContext 获取绘图上下文 context
    
    // context = wx.createCanvasContext('canvas');
    wx.createSelectorQuery()
      .select("#canvas")
      .context(function (res) {
        console.log("节点实例：", res); // 节点对应的 Canvas 实例。
        context = res.context;
        context.beginPath();
        let img = "http://images.17173.com/2010/newgame/2010/07/08/allan07081500_11s.jpg";

        context.drawImage(img, 0, 0,100,100);
        context.draw()
        wx.hideLoading()
      })
      .exec();
    // var query = wx.createSelectorQuery();
    // query.select('.handCenter').boundingClientRect(rect => {
    //   top = rect.top;
    //   left = rect.left;
    //   canvasw = rect.width;
    //   canvash = rect.height;
    //   wx.hideLoading()
    // }).exec();
  },
  onShow(){
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
  }
})