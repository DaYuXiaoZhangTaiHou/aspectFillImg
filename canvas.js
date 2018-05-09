// pages/canvasDemo/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasImg:'',
    isHidden:false,
    imageX:0,
    imageY:0,
    windowX:0,
    windowY:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowX = res.windowWidth;
        let windowY = res.windowHeight;
        that.setData({
          windowX: windowX,
          windowY: windowY
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    wx.chooseImage({
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            that.setData({
              imageX: res.width,
              imageY: res.height
            });
            that.aspectFillImg(res.path, function (url) {
              console.log(url);
            });
          }
        })
        
      }
    })
  },
//按照图片的最小边进行等比缩放
  aspectFillImg: function (imageurl, callback) {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    
    var imageX = that.data.imageX;
    var imageY = that.data.imageY;

    var windowX = that.data.windowX;
    var windowY = that.data.windowY;

    var imageSub = imageX / imageY - windowX / windowY;
    if (imageSub > 0) {//截取宽度
      var subX = imageX - imageY * windowX / windowY;
      context.drawImage(imageurl, subX / 2, 0, imageX - subX, imageY, 0, 0, windowX, windowY);
    } else {//截取高度
      var subY = imageY - imageX * windowY / windowX;
      context.drawImage(imageurl, 0, subY / 2, imageX, imageY - subY, 0, 0, windowX, windowY);
    }
    context.draw(false, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: windowX,
        height: windowY,
        destWidth: windowX * 3,
        destHeight: windowY * 3,
        canvasId: 'iphoneXImage',
        quality: 1,
        success: function (res) {
          var outLine = that.data.outLine;
          var point = outLine.point;
          var previewPhoto = that.data.previewPhoto;
          previewPhoto[point].imageW = windowX * 3;
          previewPhoto[point].imageH = windowY * 3;
          that.setData({
            previewPhoto: previewPhoto
          });
          console.log(res.tempFilePath)
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          // })
          callback(res.tempFilePath)

        }, fail: function (res) {
          console.log(res)
        }, complete: function (res) {
          console.log(res.tempFilePath)
        }
      }, this)
    }, 300));
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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