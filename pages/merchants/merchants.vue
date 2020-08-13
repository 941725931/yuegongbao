<template>
	<view class="merchants" v-html="details"></view>
</template>

<script>
	import MyAxios from "../../myAxios.js"
	export default{
		data:()=>({details:""}),
		onLoad:async function() {
			let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/business.html")
			this.details = result[1].data
		},
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

<style>
	.merchants{
		box-sizing: border-box;
		padding: 0 20rpx;
	}
</style>
