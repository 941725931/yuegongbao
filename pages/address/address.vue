<template>
	<view class="address">
		<!-- 地址信息 -->
		<view class="ShippingAddress" v-for="(item,index) in addressList" :key="index">
			<!-- 联系人 -->
			<view class="people">
				<text>{{item.consignee}}</text>
				<text>{{item.mobile}}</text>
			</view>
			<!-- 联系地址 -->
			<view class="dizhi">{{item.address}}{{item.house_number}}</view>
			<!-- 默认地址 删除和编辑 -->
			<view class="operation">
				<view class="default" v-if="item.is_default == 1">
					<text class="iconfont">&#xeaf1;</text>
					<text class="one">默认地址</text>
				</view>
				<view class="editor">
					<text @click="go('../editAddress/editAddress',item)">编辑</text>
					<text @click="deleteAddress(item)">删除</text>
				</view>
			</view>
		</view>
		<!-- 添加收货地址 -->
		<view class="add" @click="go('../newAddress/newAddress')">添加收货地址</view>
	</view>
</template>

<script>
	// 引入axios
	import MyAxios from "../../myAxios.js" 
	// 取得全局App
	var app=getApp();     
	export default{
		data:()=>({addressList:[]}),//地址列表
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
				//获取用户地址列表
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/address_list",{user_id:user_id})
				//地址列表长度大于1 才有排序的意义
				if(result[1].data.length > 1){
					//把默认地址 升到第一个
					result[1].data.sort((last,next)=>{
						return next.is_default - last.is_default
					})
				}
				//给this.addressList赋值
				this.addressList = result[1].data
			},
			//跳转页面
			go:function(url,data={}){  //data不传值默认传空对象
				uni.navigateTo({
					//传值要先转json不然下个页面收到的就是[object Object]  因为对象转字符串就是 [object Object]
					url:`${url}?data=${JSON.stringify(data)}`,
				})
			},
			//删除地址
			deleteAddress:async function(item){
				//向后台发送被删除地址的数据
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/del_address",{id:item.Id})
				//判断是否删除成功
				if(result[1].data.code == 1){
					//弹窗提示删除成功
					uni.showToast({
						title:"地址删除成功",
						mask:true,
					})
					//弹窗结束后 再次请求最新的地址列表
					setTimeout(()=>{
						this.init()
					},1500)
				}else{
					//弹窗提示删除失败
					uni.showModal({
						content:"地址删除失败",
						showCancel:false,
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.address{
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
			.operation{
				height:40rpx;
				view{
					width:50%;
				}
				.default{
					display: flex;
					float: left;
					.iconfont{
						display: block;
						width:40rpx;
						line-height:40rpx;
						text-align: center;
						font-size: 26rpx;
						background:#E83235;
						color:#fff;
						border-radius:50%;
						margin-right: 31rpx;
					}
					.one{
						margin-top: 4rpx;
						font-size: 26rpx;
						color:#222;
						font-weight: 600;
					}
				}
				.editor{
					float: right;
					box-sizing: border-box;
					padding:0 50rpx;
					text{
						display:inline-block;
						width:50%;
						text-align: right;
						font-size: 26rpx;
					}
				}
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
