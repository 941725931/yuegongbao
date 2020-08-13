<template>
	<view class="SwitchnewAddress">
		<!-- 头部区域 -->
		<view class="header">
				<!-- 新增地址 -->
				<view class="text">新增地址</view>
				<!-- 收货人 -->
				<view class="bitian">
					<text class="iconfont two">&#xe605;</text>
					<view class="tianxie">
						<text>收货人</text>
						<input type="text" @blur="changeAddress($event,1)" :value="address.consignee" placeholder="请输入收货人姓名"/>
					</view>
				</view>
				<!-- 手机号码 -->
				<view class="bitian">
					<text class="iconfont two">&#xe605;</text>
					<view class="tianxie">
						<text>手机号码</text>
						<input type="text" @blur="changeAddress($event,2)" :value="address.mobile" placeholder="请输入手机号码"/>
					</view>
				</view>
				<!-- 收货地址 -->
				<view class="bitian">
					<text class="iconfont two">&#xe605;</text>
					<view class="tianxie" @click="map">
						<text>收货地址</text>
						<text class="bitiantext">{{address.address}}</text>
					</view>
				</view>
				<!-- 门牌号 -->
				<view class="bitian menpai">
					<text class="iconfont two xxx">&#xe605;</text>
					<view class="tianxie">
						<text>门牌号</text>
						<input type="text" @blur="changeAddress($event,3)" :value="address.house_number" placeholder="请输入门牌号(选填)"/>
					</view>
				</view>
			</view>
			<!-- 保存 -->
			<view class="add" @click="save">保存</view>
	</view>
</template>

<script>
	import MyAxios from "../../myAxios.js" // 引入axios
	var app=getApp();     // 取得全局App
	export default{
		data:()=>{
			return{
				address:{
					consignee:"",
					mobile:"",
					address:"点击选择地址",
					house_number:"",
					is_default:1,
					user_id:"",
				},
			}
		},
		onLoad() {
			this.$set(this.address,'user_id',app.globalData.user_id)
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
			//跳转页面
			go:function(url){
				uni.navigateTo({url})
			},
			//地图选点
			map:function(){
				uni.authorize({
					scope:"scope.userLocation",
					success:()=>{
						uni.chooseLocation({
							success:(res)=>{
								this.address.address = res.name
							},
						})
					},
					fail() {
						uni.showModal({
							title:"提示",
							content:"请允许获取您的地理位置",
							showCancel:false,
							success: () => {
								uni.openSetting({});
							}
						})
					}
				})
			},
			//修改地址信息
			changeAddress:function(e,index){
				if(index == 1){       //修改联系人
					this.address.consignee = e.target.value
				}else if(index== 2){  //修改手机号码
					this.address.mobile = e.target.value
				}else if(index == 3){ //修改门牌号
					this.address.house_number = e.target.value
				}
			},
			//保存修改
			save:async function(){
				//手机号码正则
				if(!(/^1[3456789]\d{9}$/.test(this.address.mobile))){
				    uni.showModal({
				    	title:"提示",
				    	content:"手机号码有误，请重新输入",
				    	showCancel:false,
				    })
				    return  
				} 
				//如果用户点击保存时的数据有空的 就不能添加
				for(let key in this.address){
					if(this.address[key].toString() == "" || this.address.address.toString() == "点击选择地址"){
						uni.showModal({
							title:"提示",
							content:"地址信息有误",
							showCancel:false,
						})
						return
					}
				}
				
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/add_address",this.address,"post")
				if(result[1].data.code == 1){
					uni.showToast({
						title:"地址添加成功",
						mask:true,
						complete() {
							setTimeout(()=>{
								uni.navigateBack({ delta: 2})
							},1000)
						}
					})
				}else{
					uni.showModal({
						title:"提示",
						content:"地址添加失败",
						showCancel:false,
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.SwitchnewAddress{
		position: absolute;
		height:100%;
		width:100%;
		background-color: #F8F8F8;
		.header{
			box-sizing: border-box;
			padding:36rpx 0 0 13rpx ;
			color:#222;
			background-color: #fff;
			.text{
				text-align: center;
				font-weight: 600;
				font-size: 32rpx;
				letter-spacing: 2rpx;
				margin-bottom: 30rpx;
			}
			.bitian{
				display:flex;
				border-bottom: 2rpx solid #E3E1E1;
				border-top: 1rpx solid transparent;
				height:84rpx;
				.xxx{
					opacity: 0;
				}
				.two{
					color:#E83235;
					font-size: 12rpx;
					margin-top:48rpx;
					margin-right: 4rpx;
				}
				.tianxie{
					margin-top:34rpx;
					display:flex;
					font-size: 26rpx;
					text{
						font-weight: 600;
						display: inline-block;
						margin-right:90rpx;
						width:120rpx;
					}
					.bitiantext{
						width:400rpx;
						margin-right:0rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}
			.menpai{
				border-bottom: none;
				height:94rpx;
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
			font-size: 34rpx;
			text-align: center;
		}
	}
</style>
