/**
 * @file detail.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        userInfo: {}
    },
    onLoad(options) {
        // 监听页面加载的生命周期函数
        this.hlist(options.id,options.edc,app.globalData.apiUrl)
    },

    onReady(options){
        let userInfo = app.globalData.userInfo;
        console.log(userInfo)
        this.setData({
            userInfo:userInfo
        })
    },

    /**
     * 请求接口
     */
     hlist:function(hid,edc,apiUrl){
         let that = this;
         swan.request({
            url: apiUrl,
            method: 'POST',
            data: {
                act: 'getDetail',
                hId: hid,
                edc: edc
            },
            dataType:"json",
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
                let data;
                if(typeof(res.data) == 'string'){
                    data = JSON.parse(res.data)
                }else{
                    data = res.data
                }
                that.setData({
                    data: data
                })
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
})
