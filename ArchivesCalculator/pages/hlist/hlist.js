/**
 * @file hlist.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        uInfo: null,
        num: 10,
        page:0,
        hasMore:true,
        hName:''
    },
    onLoad(options) {
        // 监听页面加载的生命周期函数
    },

    /**
     * 先授权
     * 获取用户信息
     */
    getUserInfo(e) {
        let that = this;
        swan.getUserInfo({
            success: res => {
                that.setData({
                    userInfo:res.userInfo
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
    /**
     * 监听页面初次渲染完成的生命周期函数
     * 一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
     * 解决onLoad执行后并无法取到赋值的方案
     */
    onReady(){
        console.log(app.globalData.swanId)
        let userInfo = app.globalData.userInfo;
        if(!userInfo){
            app.redirectTo('/pages/noedc/noedc');
        }else{
            if(!app.getStorageSync(userInfo.nickName)){
                app.redirectTo('/pages/noedc/noedc');
            }else{
                this.setData({
                    userInfo:userInfo
                })
                let nickNname = app.getStorageSync(userInfo.nickName)
                this.hlist('',nickNname.fedc,this.data.num,app.globalData.apiUrl)
                this.list_one(nickNname.fedc,app.globalData.apiUrl)
            }
        }
        
    },
    /**
     * 医院详情跳转操作
     */
    showDetail:function(e){
        let id = e.currentTarget.dataset.id
        let edc = e.currentTarget.dataset.edc
        let swanId = app.globalData.swanId
        swan.navigateTo({
            url: "/pages/detail/detail?id="+id+"&uid="+swanId+'&edc='+edc
        });
    },

    /**
     * 预产期信息
     */
    list_one:function(edc,apiUrl){
        let that = this;
         swan.request({
            url: apiUrl,
            method: 'POST',
            data: {
                act: 'getEdcInfo',
                edc: edc
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
                that.setData({
                    edcinfo:res.data.edcInfo
                })
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    /**
     * 医院请求接口
     */
     hlist:function(hName='',edc,num,apiUrl){
         let that = this;
         swan.request({
            url: apiUrl,
            method: 'POST',
            data: {
                act: 'getHospitals',
                curCount: 0,
                pageSize:num,
                hName: hName,
                edc: edc
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
                let pageoffset = that.data.page + 1
                if(num <= res.data.curCount){
                    swan.showToast({
                        duration: 300,
                        title: '加载中...'
                    });
                    that.setData({
                        hospitals:res.data.hospitals,
                        page: pageoffset,
                        hasMore:true
                    })
                }else{
                    swan.showToast({
                        duration: 300,
                        title: '到底了'
                    });
                    that.setData({
                        hospitals:res.data.hospitals,
                        page: pageoffset,
                        hasMore:false
                    })
                    
                }
                
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    /**
     * 搜索
     */
    formSubmit:function(e){
        let hName = e.detail.value.name;
        let edc = e.detail.value.edc;
        let page = e.detail.value.num;
        this.setData({
            page:1,
            hName:hName
        })
        let pageSize = page*this.data.num;
        this.hlist(hName,edc,pageSize,app.globalData.apiUrl)
    },

    /**
     * 加载更多
     */
    hasMore:function(e){
        let id = e.currentTarget.dataset.id;
        let edc = e.currentTarget.dataset.edc;
        let pageSize = id*this.data.num;
        this.hlist(this.data.hName,edc,pageSize,app.globalData.apiUrl)
    }
})
