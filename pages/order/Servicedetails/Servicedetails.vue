<template>
	<view class="Servicedetails">
		<view v-html="details"></view>
	</view>
</template>

<script>
	export default{
		props:["details"]
	}
</script>

<style lang="less">
	.Servicedetails{
		padding-bottom: 120rpx;
	}
</style>
