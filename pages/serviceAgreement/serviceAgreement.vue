<template>
	<view class="serviceAgreement">
		<view v-html="text"></view>
		<view class="bottom" @click="getCoupon">我同意</view>
	</view>
</template>

<script>
	import MyAxios from "../../myAxios.js" // 引入axios
	var app=getApp();     // 取得全局App
	export default{
		data:()=>({text:""}),
		onLoad(data) {
			this.init(data.data)
		},
		//点击分享
		onShareAppMessage:function(res){
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png"
			}
		},
		methods:{
			//初始化
			init:async function(data){
				//获取全局serviceId
				let cate_id = app.globalData.serviceId
				//请求服务列表
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/service_agreement",{cate_id})
				this.text = result[1].data.agreement
				//动态改变标题
				uni.setNavigationBarTitle({
				    title: `约工宝 - ${data}`
				});
			},
			//点击同意后 让上个页面受否同意选项自动打勾
			getCoupon:function(){
				uni.$emit('update',true)
				uni.navigateBack()
			}	
		}
	}
</script>

<style lang='less'>
	.serviceAgreement{
		padding-bottom: 90rpx;
		.bottom{
			position: fixed;
			bottom: 0;
			width:100%;
			line-height:88rpx;
			text-align: center;
			background-color: #E83235;
			color:#fff;
			font-size: 28rpx;
		}
	}
</style>
				