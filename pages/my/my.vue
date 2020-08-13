<template>
	<view class="my">
		<!-- 头部区域 -->
		<view class="header">
			<view class="headerTop">
				<image :src='avatarUrl' mode=""></image>
				<view class="focus">
					<text class="city">{{nickName}}</text>
					<text class="more">更多功能请关注约工宝</text>
				</view>
			</view>
		</view>
		<!-- 中间区域 -->
		<view class="main">
			<!-- 全部订单 -->
			<view class="all">
				<view class="top">
					<text class="quanbu">全部订单</text>
					<view class="chakan" @click="go('../dingdan/dingdan',{number:0})">
						<text>查看全部</text>
						<image src="../../static/home/right.png" mode=""></image>
					</view>
				</view>
				<!-- 图标区域 -->
				<view class="tubiao">
					<!-- 待上门 -->
					<view class="one" @click="go('../dingdan/dingdan',{number:1})">
						<image class="aaa" src="../../static/home/efb74f6ef9d7e7de6f7169bfd8288d4.png" mode=""></image>
						<view class="wenben">待上门</view>
					</view>
					<!-- 待退款 -->
					<view class="one" @click="go('../dingdan/dingdan',{number:2})">
						<image src="../../static/home/51d2dc92145b30fa68ccf456ee2ecb4.png" mode=""></image>
						<view class="wenben">待退款</view>
					</view>
					<!-- 已完成 -->
					<view class="one" @click="go('../dingdan/dingdan',{number:3})">
						<image class="ccc" src="../../static/home/084322fbb33f1f926cf5420cfd34f06.png" mode=""></image>
						<view class="wenben">已完成</view>
					</view>
					<!-- 已取消 -->
					<view class="one" @click="go('../dingdan/dingdan',{number:4})">
						<image class="ddd" src="../../static/home/27185ffaebcea3fe223b8dd8aef5e8e.png" mode=""></image>
						<view class="wenben">已取消</view>
					</view>
				</view>
			</view>
			<!-- 各类功能 -->
			<view class="dianhua">
				<!-- 优惠券 -->
				<view class="one" @click="go('../coupons/coupons')">
					<text>优惠券</text>
					<image src="../../static/home/right.png" mode=""></image>
				</view>
				<!-- 我的地址 -->
				<view class="one" @click="go('../address/address')">
					<text>我的地址</text>
					<image src="../../static/home/right.png" mode=""></image>
				</view>
				<!-- 客服热线 -->
				<view class="one" @click="xuanze">
					<text>客服热线</text>
					<view class="two">
						<text>{{WorkingPhoneNumber}}</text>
						<image src="../../static/home/right.png" mode=""></image>
					</view>
				</view>
				<view class="one" @click="xuanze">
					<text>投诉热线</text>
					<view class=two>
						<text>{{WorkingPhoneNumber}}</text>
						<image src="../../static/home/right.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 各类功能 -->
			<view class="jiaru">
				<!-- 招商热线 -->
				<view class="one" @click="go('../merchants/merchants')">
					<text>招商热线</text>
					<image src="../../static/home/right.png" mode=""></image>
				</view>
				<!-- 商户入住 -->
				<view class="one" @click="go('../stayin/stayin')">
					<text>商户入住</text>
					<image src="../../static/home/right.png" mode=""></image>
				</view>
				<!-- 分享 -->
				<view class="one">
					<button class="button" type="primary" open-type="share">分享给好友得优惠券</button>
					<image src="../../static/home/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 底部呼叫弹窗 -->
		<view :class="{'bottomWindow' : isShow}">
			<view class="window" :class="{'show' : isShow}">
				<text class="number">{{WorkingPhoneNumber}}</text>
				<text class="hujiao"  @click="call(),hidden()" >呼叫</text>
				<text class="margin hujiao"  @click="hidden" >取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	import MyAxios from "../../myAxios.js" // 引入axios
	var app=getApp();     // 取得全局App
	
	export default{
		data:()=>{
			return{
				isShow:false,  //底部呼叫弹窗
				avatarUrl:"",  //用户头像
				nickName:"",   //用户昵称
				WorkingPhoneNumber:"", //客服热线  投诉热线
			}
		},
		onLoad(){
			this.init()
			this.WorkingPhone()
		},
		onShow(){uni.hideLoading()},
		
		//点击分享
		onShareAppMessage:function(res){
			if(res.from === 'button'){
				this.share()
			}
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png",
			}
		},
		methods:{
			//初始化数据
			init:async function(){
				//获取用户头像
				this.avatarUrl = app.globalData.avatarUrl
				//获取用户昵称
				this.nickName = app.globalData.nickName
			},
			//分享得优惠券
			share:async function(){
				const user_id = app.globalData.user_id
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/share_get_coupon",
				{share_user_id:user_id})
			},
			// 页面跳转
			go:function(url,data={}){
				uni.showLoading({
					title:"加载中"
				})
				uni.navigateTo({
					//传值要先转json不然下个页面收到的就是[object Object]  因为对象转字符串就是 [object Object]
					url:`${url}?data=${JSON.stringify(data)}`,
				})
			},
			//底部呼叫窗显示
			xuanze:function(){
				this.isShow = true
			},
			//底部呼叫弹窗隐藏
			hidden:function(){
				this.isShow = false
			},
			//获取合作电话号码
			WorkingPhone:async function(){
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/business_phone")
				//转字符串  因为打电话的api必须要天字符串 数字不行
				this.WorkingPhoneNumber = result[1].data.phone.phone + "" 
			},
			//拨打投诉热线或客服热线
			call:function(){
				uni.makePhoneCall({
				    phoneNumber: this.WorkingPhoneNumber ,//仅为示例
					complete: () => { //因为在app.vue里面设置了等待框 所以打电话回来 就会显示等待框 所以要在这里取消等待框
					    setTimeout(()=>{ //这里一定写成异步  不然uni.hideLoading()代码会先执行 就会达不到效果
						    uni.hideLoading()
					    },0)
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.my{
		position: absolute;
		height:100%;
		width:100%;
		background-color: #F5F5F5;
		font-weight: 600;
		.header{
			width: 750rpx;
			height: 240rpx;
			background-color: #e83235;
			box-sizing: border-box;
			padding:0 30rpx;
			border-top:1rpx solid #e83235;
			.headerTop{
				display:flex;
				margin-top:74rpx;
				image{
					width:100rpx;
					height:101rpx;
					border-radius:50%;
					margin-right:37rpx;
					background-color: #000;
				}
				.focus{
					height:101rpx;
					line-height: 50rpx;
					color:#fff;
					text{
						display: block;
					}
					.city{
						font-size: 32rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
					.more{
						font-size: 26rpx;
						letter-spacing: 4rpx;
					}
				}
			}
		}
		.main{
			box-sizing: border-box;
			padding:0 30rpx;
			.all{
				width:690rpx;
				height:287rpx;
				background:rgba(255,255,255,1);
				border-radius:10rpx;
				margin-top: -28rpx;
				box-sizing: border-box;
				padding:0 20rpx;
				.top{
					display: flex;
					justify-content: space-between;
					line-height: 90rpx;
					border-bottom: 1rpx solid #d3d3d3;
					.quanbu{
						font-size: 30rpx;
						color:#222;
					}
					.chakan{
						text{
							display:inline-block;
							font-size:26rpx;
							line-height: 96rpx;
							color:#888;
							margin-right: 35rpx;
						}
						image{
							width:14rpx;
							height:24rpx;
						}
					}
				}
				.tubiao{
					display:flex;
					justify-content: space-between;
					height:196rpx;
					.one{
						box-sizing: border-box;
						padding: 54rpx 0 57rpx;
						margin-right: 25rpx;
						image{
							display: block;
							margin-bottom: 20rpx;
							margin-left: 20rpx;
							width:52rpx;
							height:43rpx;
						}
						.aaa{
							width:35rpx;
						}
						.ccc,.ddd{
							width:43rpx;
						}
						.ddd{
							height:37rpx;
							margin-top:6rpx;
						}
						.wenben{
							display: block;
							font-weight: 600;
							font-size: 26rpx;
							color:#222;
						}
					}
					
				}
			}
			.dianhua{
				width:690rpx;
				height:358rpx;
				background:rgba(255,255,255,1);
				border-radius:10rpx;
				margin-top: 28rpx;
				box-sizing: border-box;
				padding:0 20rpx;
				.one{
					display: flex;
					justify-content: space-between;
					line-height: 89rpx;
					font-size: 30rpx;
					image{
						width:14rpx;
						height:24rpx;
						margin-top:32rpx;
					}
					.two{
						width:200rpx;
						display: flex;
						justify-content: space-between;
						font-size: 22rpx;
						color:#888;
					}
				}
			}
			.jiaru{
				width:690rpx;
				height:269rpx;
				background:rgba(255,255,255,1);
				border-radius:10rpx;
				margin-top: 28rpx;
				margin-bottom: 41rpx;
				box-sizing: border-box;
				padding:0 20rpx;
				.one{
					display: flex;
					justify-content: space-between;
					line-height: 89rpx;
					font-size: 30rpx;
					image{
						width:14rpx;
						height:24rpx;
						margin-top:32rpx;
					}
					.button{
						display: block;
						line-height: 89rpx;
						width: 100%;
						background-color: #fff;
						color: #000;
						text-align: left;
						padding: 0;
						font-size: 30rpx;
						&:after{
						   border: none;
						}
					}
				}
			}
		}
		.bottomWindow{
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background-color: rgba(0,0,0,.5);
			
			
		}
		.window{
			position: fixed;
			z-index: 999999;
			bottom: -371rpx;
			background-color: #fff;
			height:371rpx;
			width:100%;
			background-color: #F7F7F7;
			border-radius:16rpx 16rpx 0px 0px;
			text{
				display: block;
				text-align: center;
				line-height:117rpx;
				background-color: #fff;
			}
			.number{
				font-size: 28rpx;
				color:#888;
				border-bottom: 2rpx solid #EBEBEB;
			}
			.margin{
				margin-top:19rpx;
			}
			.hujiao{
				font-size: 30rpx;
				color:#222;
				font-weight: 600;
			}
		}
		.show{
			animation: run .4s ;
			animation-fill-mode:forwards;
		}
		@keyframes run{
			to{
				bottom:0;
			}
		}
	}
</style>
