/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({
    onLaunch(options) {
        let that = this
        swan.getSwanId({
            success: function (res) {
                that.globalData.swanId = res.data.swanid
            },
            fail: function (err) {
                console.log('getSwanId fail', err);
            }
        });
        this.getUserInfo()
    },

    /**
     * 先授权
     * 获取用户信息
     */
    getUserInfo(e) {
        let that = this;
        swan.getUserInfo({
            success: res => {
                that.globalData.userInfo = res.userInfo
            },
            fail: err => {
                console.log(err);
                swan.showToast({
                    title: '请先授权'
                });
            }
        });
    },

    redirectTo(url) {
        swan.redirectTo({
            url: url,
            success: function () {
                console.log('正在跳转:'+url)
            },
            fail: function (err) {
                console.log('跳转失败:'+err)
            }
        });
    },

    setStorageSync(key,value) {
        try {
            swan.setStorageSync(key, value);
        } catch (e) {
            console.log('存储失败');
        }
    },

    getStorageSync(key) {
        try {
            return swan.getStorageSync(key);
        } catch (e) {
            console.log('读取失败');
        }
    },
    getStorage(key) {
        try {
            return swan.getStorage(key);
        } catch (e) {
            console.log('读取失败');
        }
    },

    globalData:{
        apiUrl : "https://wx.boluoyunyu.com/jiandangshenqi/calculator/baidu.php",
        swanId: null,
        userInfo: null
    }
});
