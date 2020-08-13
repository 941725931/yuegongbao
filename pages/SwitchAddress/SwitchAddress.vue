<template>
	<view class="SwitchAddress">
		<!-- 收货地址 -->
		<view class="ShippingAddress"  v-for="item in addressList" @click="godefault(item)" >
			<view class="people">
				<text>{{item.consignee}}</text>
				<text>{{item.mobile}}</text>
			</view>
			<view class="dizhi">{{item.address}}{{item.house_number}}</view>
		</view>
		<!-- 添加收货地址 -->
		<view class="add" @click="go('../SwitchnewAddress/SwitchnewAddress')">添加收货地址</view>
	</view>
</template>

<script>
	import MyAxios from "../../myAxios.js" // 引入axios
	var app=getApp();     // 取得全局App
	export default{
		data:()=>({addressList:[]}),
		onShow(){this.init()},
		//点击分享
		onShareAppMessage:function(res){
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png"
			}
		},
		methods:{
			//初始化数据
			init:async function(){
				//取出user_id
				let user_id = app.globalData.user_id
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/address_list",{user_id:user_id})
				//把默认地址 升到第一个
				result[1].data.sort((last,next)=>{
					return next.is_default - last.is_default
				})
				this.addressList = result[1].data
			},
			//点击变成默认地址
			godefault:async function(item){
				item.is_default = 1
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/edit_address",item,"post")
				uni.navigateBack()
			},
			//跳转页面
			go:function(url,data={}){  //data不传值默认传空对象
				uni.navigateTo({
					//传值要先转json不然下个页面收到的就是[object Object]  因为对象转字符串就是 [object Object]
					url:`${url}?data=${JSON.stringify(data)}`,
				})
			},
		}
	}
</script>

<style lang="less">
	.SwitchAddress{
		position: absolute;
		height:100%;
		background-color: #F8F8F8;
		.ShippingAddress{
			width:750rpx;
			box-sizing: border-box;
			margin-bottom: 20rpx;
			padding: 31rpx;
			color:#222;
			background-color: #fff;
			.people{
				display: flex;
				font-size: 30rpx;
				justify-content:space-between;
				margin-bottom: 20rpx;
			}
			.dizhi{
				font-size: 28rpx;
				line-height: 50rpx;
				margin-bottom: 40rpx;
			}
		}
		.add{
			position: fixed;
			bottom: 0;
			width:100%;
			letter-spacing: 2rpx;
			line-height: 98rpx;
			background-color: #E73437;
			color:#fff;
			font-size: 26rpx;
			text-align: center;
		}
	}
</style>
