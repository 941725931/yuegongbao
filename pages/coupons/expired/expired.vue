<template>
	<view class="expired">
		<!-- 已过期优惠券列表 -->
		<view v-for="(item,index) in ExpiredList" :key="index">
			<image src="../../../static/home/ffb312eddc58712615cc26b2e58673c.jpg" mode=""></image>
			<text class="time">{{item.use_end_time}}日过期</text>
			<view class="price">
				<text class="fuhao">￥</text>
				<text class="money">{{item.money}}</text>
			</view>
			<view class="condition">满{{item.condition}}元可用</view>
			<view class="number">x {{item.ammount}}</view>
		</view>
		<!-- 没有过期优惠券时 显示此图片 -->
		<image v-if="!ExpiredList.length" class="wudingdan" src="../../../static/home/eab69e4d8b27c8016334e8c659f5111.png" mode=""></image>
	</view>
</template>

<script>
	export default{
		props:["ExpiredList"]
	}
</script>

<style lang="less">
	.expired{
		position: absolute;
		width:100vw;
		height:100%;
		background-color: #F8F8F8;
		.wudingdan{
			display: block;
			width:400rpx;
			height:330rpx;
			margin:200rpx auto;
		}
		view{
			position: relative;
			.time{
				position: absolute;
				bottom: 38rpx;
				left:66rpx;
				font-size:18rpx;
				color:#FFFFFF;
			}
			.price{
				position: absolute;
				width:335rpx;
				text-align: center;
				top:78rpx;
				left:-36rpx;
				color:#fff;
				.fuhao{
					font-size: 30rpx;
				}
				.money{
					font-size: 45rpx;
				}
			}
			image{
				width:600rpx;
				height:160rpx;
				margin-left: 47rpx;
				margin-top: 39rpx;
				border-radius: 10rpx;
			}
			.condition{
				position: absolute;
				width:335rpx;
				text-align: center;
				top:118rpx;
				left:234rpx;
				color:#fff;
			}
			.number{
				position: absolute;
				top: 65rpx;
				left: 485rpx;
				color: #fff;
			}
		}
	}
</style>
