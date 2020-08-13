<template>
	<view class="editAddress">
		<!-- 头部区域 -->
		<view class="header">
			<!-- 编辑地址 -->
			<view class="text">编辑地址</view>
			<!-- 请输入收货人姓名 -->
			<view class="bitian">
				<text class="iconfont two">&#xe605;</text>
				<view class="tianxie">
					<text>收货人</text>
					<input type="text" @blur="changeAddress($event,1)" :value="address.consignee" placeholder="请输入收货人姓名"/>
				</view>
			</view>
			<!-- 请输入手机号码 -->
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
		<!-- 设置默认地址 -->
		<view class="default">
			<text>设置默认地址</text>
			<view @click="changeAddress($event,4)" :class="{ 'huakuai': queren, 'nHuakuai': quxiao }">
				<view  :class="{ 'qiu': queren, 'nQiu': quxiao }"></view>
			</view>
		</view>
		<!-- 保存 -->
		<view class="add" @click="save">保存</view>
	</view>
</template>

<script>
	import MyAxios from "../../myAxios.js" // 引入axios
	export default{
		data:()=>{
			return{
				address:{},    //地址
				default:"",    //方便save函数里面判断
				queren:true,   //是否设置为默认地址按钮外面的大框  通过这个判断背景色
				quxiao:false   //是否设置为默认地址按钮里面的小球  通过这个判断小球在左还是在右
			}
		},
		onLoad(data){
			this.address = JSON.parse(data.data)
			this.default = JSON.parse(data.data)
			if(this.address.is_default == 1){ //如果传过来的是默认地址  改变选择框颜色
				this.queren = false
				this.quxiao = true
			}
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
				}else if(index == 4){ //修改是否是默认地址
					this.queren = !this.queren
					this.quxiao = !this.quxiao
					this.address.is_default = this.queren? 0 : 1
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
				//如果用户点击保存时的数据 和 刚来时的数据一模一样   就不允许修改
				let bl = false
				for(let key in this.address){
					if(this.address[key] != this.default[key]){
						bl = true
					}
				}
				if(!bl){
					uni.showModal({
						title:"提示",
						content:"请先修改地址再保存",
						showCancel:false,
					})
					return
				}
				
				//有空白的input
				for(let key1 in this.address){
					if(this.address[key1].toString() == ""){
						uni.showModal({
							title:"提示",
							content:"地址信息有误",
							showCancel:false,
						})
						return
					}
				}
				
				//向后台发送修改后的数据
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/edit_address",this.address,"post")
				//修改成功 弹窗提示
				if(result[1].data.code == 1){
					uni.showToast({
						title:"地址修改成功",
						complete() {
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
						}
					})
				}else{
					//修改失败 弹窗提示
					uni.showModal({
						title:"提示",
						content:"地址修改失败",
						showCancel:false,
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.editAddress{
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
		.default{
			box-sizing: border-box;
			padding:0 28rpx;
			margin-top:30rpx;
			display: flex;
			justify-content: space-between;
			text{
				font-weight: 600;
				font-size: 26rpx;
				color:#222;
			}
			.huakuai{
				position: relative;
				width:104rpx;
				height:53rpx;
				border:2rpx solid red;
				background:red;
				border-radius:27rpx;
				.qiu{
					position: absolute;
					left:0;
					width:53rpx;
					height:53rpx;
					background:rgba(254,254,254,1);
					border-radius:50%;
				}
			}
			.nHuakuai{
				position: relative;
				width:104rpx;
				height:53rpx;
				border:2rpx solid rgba(29,130,254,1);
				background:rgba(29,130,254,1);
				border-radius:27rpx;
				.nQiu{
					position: absolute;
					right:0;
					width:53rpx;
					height:53rpx;
					background:rgba(254,254,254,1);
					border-radius:50%;
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
			font-size: 34rpx;
			text-align: center;
		}
	}
</style>
