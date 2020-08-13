<template>
	<view class="refund">
		<!-- 待退款类型订单 -->
		<view class="dingdan" v-for="(item,index) in refundList" :key="index">
			<!-- 订单号 -->
			<view class="state">
				<text class="orderNumber">订单号：DK-{{item.Id}}</text>
				<text class="red">待退款</text>
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
		</view>
		<!-- 没有订单 显示此图片 -->
		<image v-if="!refundList.length" class="wudingdan" src="../../../static/home/wu.png" mode=""></image>
	</view>
</template>

<script>
	export default{
		props:["refundList"]
	}
</script>

<style lang="less">
	.red{
		color: #E83235;
	}
	.refund{
		background-color: #F8F8F8;
		.wudingdan{
			display: block;
			width:391rpx;
			height:391rpx;
			margin:201rpx auto;
		}
		.dingdan{
			padding-bottom: 24rpx;
			background-color: #fff;
			margin-bottom: 30rpx;
			.state{
				box-sizing: border-box;
				padding:10rpx 28rpx;
				font-weight: 600;
				display: flex;
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
		}
	}
</style>

