<template>
	<view class="problem" >
		<view v-html="question"></view>
	</view>
</template>

<script>
	export default{
		props:["question"]
	}
</script>

<style>
	.problem{
		padding-bottom: 120rpx;
	}
</style>
