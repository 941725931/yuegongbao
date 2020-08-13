<template>
	<view class="container">
		<!-- 头部信息 -->
		<view class="introducer">
			<view class="introTitle">
				<text>点击</text>
				<view class="shareIcon">
				  <img src="@/static/home/load.png" />
				</view>
				<text>收藏到我的小程序,下单更便捷</text>
				<img class="upIcon" src="@/static/home/up.png" />
			</view>	
		</view>
		<!-- 城市信息 -->
		<view class="city">
			<view class="city-content">
				<view class="city-content-left" @click="go('../my/my')">
					<img :src="avatarUrl"/>
					<button v-if="isLogin" open-type="getUserInfo" @getuserinfo="getuserinfo" @click.stop>点击登录</button>
					<text class="name" v-if="!isLogin">
						<text class="myname">{{nickName}}</text>
						<text class="people">[个人中心]</text>
					</text>
				</view>
				<view class="city-content-right" @click="go('../dingdan/dingdan',{number:0})">
					<text>我的订单</text>
					<text class="order-number">（{{order}}）</text>
					<img src="@/static/home/right.png" />
				</view>
			</view>
		  <!-- 选择城市 -->
		  <view class="city-address">
			<view class="uni-list">
				<view class="uni-list-cell">
					<img class="address-icon" src="@/static/home/address.png" />
					<view class="uni-list-cell-left">当前城市：</view>
					<view class="uni-list-cell-db">
						<picker class="picker" @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input" @click.stop>{{array[index]}}</view>
							<view class="switch">[切换]</view>
						</picker>
					</view>
				</view>
			</view>
			</view>
		</view>
		<!-- 广告栏 -->
		<view class="ad-column">
			<img src="@/static/home/advertisement.png" />
		</view>
		<!-- 首页订单提醒 -->
		<view class="remind" v-if="isGo">
			<view class="remindxiangxi">
				<view class="ddtx">您有一个<text id="red">{{service_name}}</text>的订单正在进行中</view>
				<view class="ddtx">订单号:[<text id="red">{{order_num}}</text>]</view>
			</view>
			<text class="lianxi" @click="xuanze">联系师傅</text>
		</view>
		<!-- 商家列表 -->
		<view class="merchant">
			<view class="mer-content" v-for="(item, index) in MerchantList" :key="index" @click="go('../order/order',item.Id)">
				<view class="mer-name">
					<image :src='item.icon' mode=""></image>
					<text>{{item.service_name}}</text>
				</view>
				<view class="mer-price">
					<text>￥{{item.price}}/个</text>
					<img src="../../static/home/button1.png"/>
				</view>
			</view>
		</view>
		<!-- 了解约工宝 -->
		<view class="understand" @click="go('../about/about')">点击了解约工宝平台</view>
		<!-- 咨询合作电话 -->
		<view class="phone">
			<view class="tel" @click='call(WorkingPhoneNumber)'>
				<image class="contact"  src="../../static/home/contact.png" mode=""></image>
				<text class="text">咨询合作电话：{{WorkingPhoneNumber}}</text>
			</view>
		</view>
		<!-- 优惠卷弹窗 -->
		<view class="DiscountWindow"  v-if="isNewUser">
			<view>
				<text @click="windowNone" class="iconfont">&#xe668;</text>
				<image src="../../static/home/gongxi.png" mode=""></image>
				<text class="text">获得一张{{money}}元无门槛券</text>
				<text class="fuhao text">￥</text>
				<text class="jine text">{{money}}</text>
				<text @click="windowNone" class="ImmediateUse"></text>
			</view>
		</view>
		<!-- 底部呼叫弹窗 -->
		<view :class="{'bottomWindow' : isShow}">
			<view class="window" :class="{'show' : isShow}">
				<text class="number">{{workersNumber}}</text>
				<text class="hujiao"  @click="call(workersNumber),hidden()" >呼叫</text>
				<text class="margin hujiao"  @click="hidden" >取消</text>
			</view>
		</view>
		<!-- 分享领优惠券 -->
		<view v-if='isCoupons' class="buttonCoupons">
			<text class="iconfont" @click='isCoupons = false'>&#xe668;</text>
			<button class="button" type="primary" open-type="share">.</button>
			<image src='../../static/home/c7bbe316dbfc7664cfe21b917c21624.png'></image>
		</view>
    </view>
</template>

<script>
import MyAxios from "../../myAxios.js" // 引入axios
var app=getApp();     // 取得全局App

export default {
	name: "index",
	data(){
		return {
			array: [], 			    //picker组件定义
			index: 0, 			    //picker组件定义
			cityIdArr:[], 		    //picker组件定义
		    title: 'picker', 		//picker组件定义
			isGo: 0,   			    //用户是否有进行中的订单
			money:0,                //优惠券金额
		    order: 0,   			//用户的订单数
			nickName:"",  		    //用户名称
			isNewUser:0,            //是否是新用户 是的话显示优惠券弹窗
			avatarUrl:"",  		    //用户头像
			order_num:"",           //订单号
			isShow:false,  		    //底部呼叫弹窗
			isLogin:false,          //是否授权了获取用户信息权限
			MerchantList:[], 		//商家列表
		    service_name:"",        //订单名称
		    workersNumber: 0,   	//工人号码
		    WorkingPhoneNumber:"",  //首页合作电话的号码
			isCoupons:true,         //分享优惠券
		}
	},
	onLoad:function(){
		this.login()   		//登录获取头像 名称
		this.city()        	//获取城市列表
		this.getMerchants() //获取城市下的商户列表
		this.WorkingPhone() //获取合作电话号码
		//监听orderDetails页面 和 dingdan页面 触发的函数
		uni.$on('orderNumber',()=>{
			this.orderNumber(app.globalData.openid)
		})
	},
	onShow:function(){
		uni.hideLoading()   //隐藏加载框
	},
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
		//登录
		login:function(){
			uni.login({
				success: res => {
					let code = res.code
					uni.getUserInfo({   //获取用户头像和名字
						success:async (res)=>{
							let nick = res.userInfo.nickName
							let avaurl = res.userInfo.avatarUrl
							this.avatarUrl = avaurl		
							this.nickName = nick		
							app.globalData.avatarUrl = avaurl	//改变全局的头像
							app.globalData.nickName = nick  	//改变全局的用户名
							let result = await MyAxios.axios("https://ygbao.magicxhx.com/admin/Wchat/getOpenid.html",{code,nick,avaurl})
							//获取openid成功
							if(result[1].data.code != 0){
								const {openid,user_id,is_first,money} = result[1].data
								this.isNewUser = is_first
								this.money = money
								app.globalData.openid = openid  	//改变全局的openid
								app.globalData.user_id = user_id  	//改变全局的user_id
								this.orderNumber(openid)  //获取用户订单数 之所以放在这里获取  因为在外面获取 第一次获取不到openid					
							//获取openid失败
							}else{
								uni.showModal({
									content:"获取授权失败",
									showCancel:false,
									confirmText:"重新获取",
									success:()=> {
										this.login()
									}
								})
							}
						},
						fail: () => {
							//如果用户没有授权  就显示点击登录
							this.isLogin = true
						}
					})
				}
			});
		},
		//获取头像的回调
		getuserinfo:function(e){
			if(!e.detail.rawData)return
			this.isLogin = false
			this.login()
		},
		//分享得优惠券
		share:async function(){
			const user_id = app.globalData.user_id
			let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/share_get_coupon",
			{share_user_id:user_id})
		},
		//获取合作电话号码
		WorkingPhone:async function(){
			let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/business_phone")
			//转字符串  因为打电话的api必须要天字符串 数字不行
			this.WorkingPhoneNumber = result[1].data.phone.phone + "" 
		},
		//获取用户订单数
		orderNumber:async function(openid){
			//请求进行中的订单
			let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/index_order",{openid},"post")
			this.order = result[1].data.order_count
			//result[1].data.is_go_on 等于1的话  说明有进行中的订单
			this.isGo = result[1].data.is_go_on
			//转字符串  因为打电话的api必须要天字符串 数字不行
			this.workersNumber = result[1].data.mobile + ""
			this.service_name = result[1].data.service_name
			this.order_num = result[1].data.order_num
		},
		//获取城市列表
		city:async function(){
			let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/city.html")
			result[1].data.map(item=>{     //把id和城市名分开保存  因为picker组件不支持数组对象渲染 会被渲染成 [object object]
				this.cityIdArr.push(item.Id)    //储存城市id的列表
				this.array.push(item.c_name)    //储存城市名的列表
			})
		},
		//拨打电话
		call:function(phoneNumber){
		  uni.makePhoneCall({
		      phoneNumber, //电话号码  只能写字符串  数字不能生效
		  });
		},
		//页面跳转
	    go:function(url,data={}){
			if(this.isLogin == true){
				uni.showModal({
					content:"请先登录",
					showCancel:false,
					success: () => {
						uni.openSetting({});
					}
				})
				return
			}
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
		//隐藏优惠卷弹框
		windowNone:function(){
			this.isNewUser = false
		},
		//获取城市下的入住商家
		getMerchants:async function(id=1){ //默认是获取上海的商家
			let result = await MyAxios.axios(`https://ygbao.magicxhx.com/api/index/cate_services?city_id=${id}`) 
			//因为获取到的图片地址不是完整的 所以要拼接 https://ygbao.magicxhx.com 
			//这个也不是固定的,是变值,看后台让你加什么前缀网址
			result[1].data.map((item,index)=>{
				result[1].data[index].icon = `https://ygbao.magicxhx.com${result[1].data[index].icon}` 
			})
			this.MerchantList = result[1].data
			app.globalData.cityId = id //改变全局cityId
		},
		//用户选择了新的城市 触发的逻辑
		bindPickerChange: function(e) {
			if(e.target.value == this.index)return                     //如果本次选择的城市和上次一样就不要拉取数据
			this.index = e.target.value                                //picker组件写的
			this.getMerchants(this.cityIdArr[e.target.value])          //重新获取商户列表
		},
	}
};
</script>

<style lang="less">
	.container{
		position: absolute;
		min-height: 100vh;
		background-color: #f5f5f5;
		.buttonCoupons{
			position: fixed;
			right: 14rpx;
			bottom: 149rpx;
			.iconfont{
				position: absolute;
				top:-45rpx;
				right:10rpx;
				color:red;
			}
			.button{
				position: absolute;
				top: 0;
				left: 0;
				width: 149rpx;
				line-height: 74px;
				background-color: transparent;
				color: transparent;
				&:after{
				   border: none;
				}
			}
			image{
				width:170rpx;
				height:150rpx;
			}
		}
		.DiscountWindow{
				position: fixed;
				z-index: 999;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background:rgba(51,51,51,0.5);
				view{
					position: absolute;
					width:528.5rpx;
					height:527.2rpx;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					margin:auto;
					.ImmediateUse{
						width:260rpx;
						height:56rpx;
						position: absolute;
						top: 365rpx;
						left: 126rpx;
						background-color:transparent;
					}
					.text{
						position: absolute;
						top:168rpx;
						left:70rpx;
						color:#fff;
						font-size: 32rpx;
					}
					.iconfont{
						position: absolute;
						right: -64rpx;
						top:-94rpx;
						font-size: 64rpx;
						color:#ED3927;
					}
					image{
						position: absolute;
						width:528.5rpx;
						height:527.2rpx;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
						margin:auto;
					}
					.fuhao{
						position: absolute;
						top:252rpx;
						left:152rpx;
						font-size: 60rpx
					}
					.jine{
						position: absolute;
						top:255rpx;
						left:212rpx;
						font-size: 56rpx;
					}
				}
			}
		.bottomWindow{
			position: absolute;
			z-index: 9999;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background-color: rgba(0,0,0,.5);
		}
		.window{
			position: fixed;
			z-index: 999999;
			height:371rpx;
			width:100%;
			bottom: -371rpx;
			background-color: #F7F7F7;
			border-radius:16rpx 16rpx 0px 0px;
			text{
				display: block;
				line-height:117rpx;
				text-align: center;
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
		.city-address{
			.uni-list-cell{
				display: flex;
				.picker{
					display: flex;
					.uni-input{
						display: inline;
					}
					.switch {
						display: inline;
					  margin-left: 8rpx;
					  color: #E63235;
					}
				}
			}
		}
		.remind {
			display: flex;
			width:712rpx;
			height:109rpx;
			padding:0 15rpx;
			margin:-6rpx auto 29rpx;
			background-color: #fff;
			box-sizing: border-box;
			border-radius: 10rpx;
			.remindxiangxi{
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				.ddtx{
					width:512rpx;
					line-height:55rpx;
					font-size:28rpx;
					font-weight:bold;
					color:rgba(34,34,34,1);
				}
			}
			.lianxi{
				width:148rpx;
				height:61rpx;
				margin:auto 0;
				line-height:61rpx;
				border:2rpx solid;
				border-radius:4rpx;
				font-size:28rpx;
				color:#1D82FE;
				text-align: center;
			}
		}
		.understand{
			display: block;
			margin:22rpx 0;
			margin-bottom: 130rpx;
			font-size: 22rpx;
			color:#999;
			letter-spacing: 3rpx;
			text-align: center;
		}
		.phone{
			width:642rpx;
			position: fixed;
			bottom:36rpx;
			left: 0;
			right: 0;
			margin:0 auto;
			border-radius: 25%;
			.tel{
				position: relative;
				height:76rpx;
				.contact{
					width:100%;
					height:100%;
				}
				.text{
					position: absolute;
					top:20rpx;
					left:157rpx;
					color:#fff;
					font-size: 30rpx;
				}
			}
		}
		.city {
			position: relative;
			top: -90rpx;
			left: 20rpx;
			z-index: 1;
			width: 710rpx;
			height: 181rpx;
			font-size: 27rpx;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2px 9px 0px rgba(215, 215, 215, 0.8);
			border-radius: 10rpx;
			.city-content {
				display: flex;
				justify-content: space-between;
				.city-content-right {
				  margin-top: 81rpx;
				  color: #E63235;
				  margin-right: 55rpx;
				  img {
					position: relative;
					top: 5rpx;
					left: 24rpx;  
				    width: 17rpx;
				    height: 26rpx;
				  }
				}
				.city-content-left {
					position: relative;
					display: flex;
					width:450rpx;
					img {
						width: 80rpx;
						height: 80rpx;
						margin-left: 27rpx;
						margin-top: 31rpx;
						background: rgba(242, 191, 191, 1);
						border-radius: 50%;
					}
					.name {
						display: flex;
						justify-content: space-between;
						margin-top:60rpx;
						margin-left:20rpx;
						height:30rpx;
						width:340rpx;
						font-size: 30rpx;
						line-height: 30rpx;
						text{
							display: inline-block;
						}
						.people{
							color:red;
						}
						.myname{
							width:100rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							vertical-align: -5rpx;
						}
					}
					button {
						position: absolute;
						bottom: 18rpx;
						left: 124rpx;
						font-size: 30rpx;
						line-height: 50rpx;
						width: 190rpx;
						font-weight: normal;
					}
				}
			}
			.city-address {
				margin-top: 8rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.address-icon {
					margin-left: 59rpx;
					margin-right: 11rpx;
					width: 21rpx;
					height: 30rpx;
				}
			}
		}
		.introducer {
			width: 750rpx;
			height: 170rpx;
			background-color: #e83235;
			border-radius: 0rpx 0rpx 40rpx 40rpx;
			.introTitle {
				display: flex;
			    flex-direction: row;
			    justify-content: center;
			    align-content: center;
				box-sizing: border-box;
				padding-top: 20rpx;
			    font-size: 24rpx;
			    font-family: Source Han Sans SC;
			    font-weight: bold;
			    color: rgba(255, 255, 255, 1);
				.shareIcon {
					width: 42rpx;
					height: 30rpx;
					margin-left: 10rpx;
					margin-right: 10rpx;
					display: flex;
					justify-content: center;
					background: rgba(184, 40, 42, 1);
					border-radius: 15rpx;
					align-items: center;
					img {
					   width: 31rpx;
					   height: 11rpx;
					}
				}
				.upIcon {
				  width: 11rpx;
				  height: 26rpx;
				  padding-left: 24rpx;
				}
			}
		}
		.merchant {
			display: flex;
			width: 750rpx;
			box-sizing: border-box;
			padding-left: 20rpx;
			margin-bottom: 200rpx;
			flex-direction: row;
			flex-wrap: wrap;
			.mer-content {
				width: 345rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px -1px 8px 0px rgba(203, 203, 203, 0.8);
				border-radius: 10rpx;
				.mer-name {
					display: flex;
					align-items: center;
					image {
						width: 80rpx;
						height: 80rpx;
						margin-top: 21rpx;
						margin-left: 25rpx;
						border-radius: 50%;
					}
					text {
						margin-left: 17rpx;
						font-size: 34rpx;
						color: #202020;
						font-weight: bold;
					}
				}
				.mer-price {
					display: flex;
					margin-bottom: 17rpx;
					justify-content: space-around;
					align-items: flex-end;
					img {
						width: 138rpx;
						height: 51rpx;
						background: rgba(232, 50, 53, 1);
						border-radius: 10rpx;
					 }
					text {
						font-size: 32rpx;
						color: #E83235;
						font-weight: 600;
					}
				}
				
			}
		  
		}
		.ad-column{
			img {
				width: 750rpx;
				height: 140rpx;
				margin-top: -65rpx;
				margin-bottom: 12rpx;
			}
		}
		@keyframes run{
			to{
				bottom:0;
			}
		}
		#red{
			color:#E83235;
		}
	}
</style>