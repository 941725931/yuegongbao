<template>
	<view class="Wait">
		<!-- 待上门类型订单 -->
		<view class="dingdan" v-for="(item,index) in topDoorList" :key="index">
			<!-- 订单号 -->
			<view class="state">
				<text class="orderNumber">订单号：DK-{{item.Id}}</text>
				<text class="red">待上门</text>
			</view>
			<!-- 订单明细 -->
			<view class="main" v-for="(item1,index1) in item.item" :key="index1">
				<image :src="item1.picture" mode=""></image>
				<view class="describe">
					<view class="shuliang">
						<text class="xiaokong">{{item1.sec_services_name}}</text>
						<view class="geshu">
							<text>x</text>
							<text>{{item1.service_num}}</text>
							<text>个</text>
						</view>
					</view>
					<text class="jianjie">{{item1.service_desc}}</text>
				</view>
			</view>
			<!-- 合计金额 -->
			<view class="heji">
				<text>共计:￥</text>
				<text>{{item.pay_money}}</text>
			</view>
			<!-- 操作按钮 -->
			<view class="button">
				<view class="wancheng" @click="complete(item.Id)">完成</view>
				<view class="quxiao"  @click="hiddenOrShow(4,item.Id)">取消</view>
			</view>
		</view>
		<!-- 没有订单 显示此图片 -->
		<image v-if="!topDoorList.length" class="wudingdan" src="../../../static/home/wu.png" mode=""></image>
		<!-- 提示框 -->
		<view class="cancel" v-if="cancelShow" @click="hiddenOrShow(1)">
			<!-- 是否取消确认框 -->
			<view class="tanchuang" v-if="deleteShow">
				<view>是否取消该订单</view>
				<text @click.stop="hiddenOrShow(2)">是</text>
				<text @click="hiddenOrShow(3)">否</text>
			</view>
			<!-- 文本显示框 -->
			<view class="tanchuang queding" v-if="textShow">
				<text class="quedingxxx">您已取消该订单，请耐心等待，</text>
				<text class="quedingtop">后台审核后会退款到您的账户。</text>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入axios
	import MyAxios from "../../../myAxios.js"
	// 取得全局App
	var app=getApp();     
	export default{
		data:()=>{
			return{
				deleteShow:false, //是否删除弹窗
				textShow:false, //文本展示弹窗
				cancelShow:false, //遮罩层
				order_id:"",      //订单id  不是app.vue里面的order_id
			}
		},
		props:["topDoorList"],
		methods:{
			//点击完成按钮
			complete:async function(order_id){
				//告诉后台用户点击完成了
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/complete.html",{order_id},"post")
				//如果后台处理成功了
				if(result[1].data.code == 1){
					//触发dingdan页面的事件
					uni.$emit("get")
				}
			},
			//点击取消按钮
			hiddenOrShow:async function(number,order_id){
				if(number == 1){ //说明点击的是遮罩层 
					if(this.deleteShow == true)return //说明目前显示的是是否删除弹框 这个时候只能通过点击取消才能隐藏弹窗
					this.textShow = false
					this.deleteShow = true
					this.cancelShow = false
					//触发dingdan页面的事件
					uni.$emit("get")
				}else if(number == 2){ //说明点击的是确认按钮 确定删除这条订单
					let order_id = this.order_id
					//告诉后台用户确认取消此订单
					let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/refund.html",{order_id},"post")
					//取消成功
					if(result[1].data.code == 1){ 
						this.textShow = true
						this.deleteShow = false
						this.cancelShow = true
					}else{
						//弹窗取消失败
						uni.showModal({
							content:"取消失败"
						})
					}
				}else if(number == 3){//说明点击的是取消按钮 放弃删除
					this.textShow = false
					this.deleteShow = true
					this.cancelShow = false
				}else if(number == 4){//说明点击的是完成旁边的取消按钮 弹出是否删除弹窗
				    this.order_id = order_id
					this.textShow = false
					this.deleteShow = true
					this.cancelShow = true
				}
			}
		}
	}
</script>

<style lang="less">
	.red{
		color: #E83235;
	}
	.Wait{
		background-color: #F8F8F8;
		.wudingdan{
			display: block;
			width:391rpx;
			height:391rpx;
			margin:201rpx auto;
		}
		.dingdan{
			padding-bottom: 18rpx;
			background-color: #fff;
			margin-bottom: 30rpx;
			.state{
				box-sizing: border-box;
				padding:10rpx 28rpx;
				display: flex;
				font-weight: 600;
				font-size: 28rpx;
				justify-content: space-between;
				border-bottom: 2rpx solid #E7E7E7;
				.orderNumber{
					color:#222;
				}
			}
			.main{
				width:100%;
				border-bottom: 2rpx solid #E3E1E1;
				box-sizing: border-box;
				padding:19rpx 29rpx 12rpx;
				display: flex;
				image{
					width: 100rpx;
					height:100rpx;
					border-radius: 6rpx;
					background-color: #202020;
					margin-right: 20rpx;
				}
				.describe{
					flex:1;
					.shuliang{
						display: flex;
						justify-content: space-between;
						margin-bottom: 18rpx;
						.xiaokong{
							height:54rpx;
							line-height:28rpx;
							box-sizing: border-box;
							border-radius: 6rpx;
							font-size: 26rpx;
							padding: 10rpx;
							color:#E83235;
							border:2rpx solid #E83235;
						}
						.geshu{
							font-size: 24rpx;
						}
					}
					.jianjie{
						display: block;
						margin-top:-2rpx;
						font-size: 28rpx;
						color:#888;
					}
				}
			}
			.heji{
				box-sizing: border-box;
				padding:21rpx 32rpx 0;
				display: flex;
				justify-content: flex-end;
				text{
					font-size: 26rpx;
					color:#222;
				}
			}
			.button{
				box-sizing: border-box;
				padding:21rpx 32rpx 0;
				display: flex;
				justify-content: flex-end;
				view{
					width:149rpx;
					text-align: center;
					line-height:47rpx;
					color:#fff;
					border-radius:4rpx;
					font-size: 26rpx;
				}
				.wancheng{
					background:#1D82FE;
					margin-right: 36rpx;
				}
				.quxiao{
					background:#ED1F00;
				}
			}
		}
		.cancel{
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom:0;
			z-index: 999;
			background:rgba(51,51,51,.5);
			
			.tanchuang{
				position: absolute;
				top: 349rpx;
				right: 0;
				left: 0;
				margin: auto;
				width:563rpx;
				height:303rpx;
				background-color: #fff;
				font-size: 28rpx;
				border-radius:10rpx;
				view{
					margin-top:84rpx;
					text-align: center;
					font-weight: 600;
					letter-spacing: 4rpx;
				}
				text{
					display: inline-block;
					text-align: center;
					width:50%;
					margin-top:75rpx;
					color:#1D82FE;
				}
			}
			.queding{
				box-sizing: border-box;
				padding: 114rpx 0;
				.quedingxxx,.quedingtop{
					display: block;
					width:100%;
					text-align: center;
					color:#2D2C3A;
					font-weight: 600;
					margin-top:0rpx
				}
				.quedingtop{
					margin-top:20rpx;
				}
			}
		}
	}
</style>
