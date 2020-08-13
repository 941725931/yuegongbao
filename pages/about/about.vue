<template>
	<view class="about">
		<text class="strong">关于约工宝</text>
		<view class="logo">
			<image src="../../static/home/logo.png" mode=""></image>
		</view>
		<text class="jiesao">本平台是为整合城市服务请工方便而生。方便城市居民可以在手机上快速请到各种技术工人，解决日常生活中的各种难题。下单和付款只在分秒之间。明码低价，安全无忧。</text>
	</view>
</template>

<script>
	export default{
		//点击分享
		onShareAppMessage:function(res){
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png"
			}
		},
	}
</script>

<style lang="less">
	.strong{
		display: block;
		font-size:36rpx;
		font-weight:600;
		text-align: center;
		color:#222;
		margin:30rpx auto 40rpx;
	}
	.logo{
		width:190rpx;
		margin:auto;
		height:160rpx;
		margin-bottom: 54rpx;
		image{
			width:190rpx;
			height:160rpx;
		}
	}
	.jiesao{
		display: block;
		width:697rpx;
		margin:auto;
		color:#222;
		font-size: 28rpx;
		line-height: 50rpx;
		text-indent: 72rpx;
	}
</style>
