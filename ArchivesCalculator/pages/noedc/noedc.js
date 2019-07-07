/**
 * @file noedc.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        time:"请输入预产期",
        swanId:null,
        userInfo:null
    },
    onLoad() {
        // 监听页面加载的生命周期函数
        this.getUserInfo()
    },

    onReady(){
        let userInfo = app.globalData.userInfo
        console.log(userInfo)
        this.setData({
            userInfo:userInfo
        })
    },

    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        })
    },

    getUserInfo(e) {
        let that = this;
        swan.getUserInfo({
            success: res => {
                let userInfo = res.userInfo;
                that.setData({
                    userInfo:userInfo
                })
            },
            fail: err => {
                console.log(err);
                swan.showToast({
                    title: '请先授权'
                });
            }
        });
    },

    bindTimeChange:function(e){
        let that = this
        swan.getSwanId({
            success: function (res) {
                console.log(res.data.swanid)
                that.hlist(that,res.data.swanId,that.data.userInfo.avatarUrl,that.data.userInfo.nickName,that.data.userInfo.gender,e.detail.value,app.globalData.apiUrl)
            },
            fail: function (err) {
                console.log('getSwanId fail', err);
            }
        });
    },

    noedc_submit:function(e){
        let userInfo = app.globalData.userInfo
        let nickNname = app.getStorageSync(userInfo.nickName)
        if(nickNname){
            app.redirectTo('/pages/hlist/hlist');
        }
    },

    hlist:function(that,fbaiduid='',favatar='',nickName='',gender=0,fedc='',apiUrl){
         swan.request({
            url: apiUrl,
            method: 'POST',
            data: {
                act:"bdLogin",
                fbaiduid: fbaiduid,
                favatar: favatar,
                fnickname: nickName,
                fsex: gender,
                fprovince: '',
                fcity: '',
                fcountry: '',
                fphone: '',
                fname: '',
                fedc: fedc
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
                that.setData({
                    time:res.data.uInfo.fedc
                })
                app.setStorageSync(nickName,res.data.uInfo);
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    }
})
