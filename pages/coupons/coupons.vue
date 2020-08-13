<template>
	<view class="coupons">
		<!-- 头部导航 -->
		<view  class="headerBar">
			<text :class="{ show: isShow[0] }" @click="change(0)">未使用</text>
			<text :class="{ show: isShow[1] }" @click="change(1)">已过期</text>
		</view>
		<!-- 显示组件区域 -->
		<view class="lll" >
			<Dontuse v-if='show === 0' :DontuseList="DontuseList"></Dontuse>
			<Expired v-if='show === 1' :ExpiredList="ExpiredList"></Expired>
		</view>
	</view>
</template>

<script>
	//引入组件
	import Dontuse from "./Dontuse/Dontuse";
	import Expired from "./expired/expired";
	import MyAxios from '../../myAxios.js';
	var app=getApp();     // 取得全局App
	
	export default{
		data:()=>{
			return{
				show:0,                 //拥有show类名的展示
				last:0,                 //记录上一次展示组件的下标
				ExpiredList:[],         //已过期列表
				DontuseList:[],         //未使用的列表
				isShow:[true,false] ,   //通过数组的值判断谁显示 和 show / last 配合使用
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
		onLoad(){this.init()},
		methods:{
			//初始化数据
			init:async function(){
				const user_id = app.globalData.user_id
				//获取用户名下所有类型的优惠券
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/my_all_coupon",{user_id})
				//先吧后台传来的时间戳 转换成文本
				result[1].data.map((item,index)=>{
					result[1].data[index].use_end_time = this.getTime(item.use_end_time)
				})
				//往数组添加数据
				result[1].data.map((item,index)=>{
					if(item.flag == 1){ //未使用的优惠券
						this.DontuseList.push(item)
					}else{              //已过期的优惠券
						this.ExpiredList.push(item)
					}
				})
			},
			//把时间戳转换成日期
			getTime:function(timeStamp){
				let time = new Date(parseInt(timeStamp * 1000))
				let Y = time.getFullYear() + '-';
				let M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
				let D = time.getDate() + ' ';
				return time = Y + M + D
			},
			//切换组件
			change:function(number){                
				this.show = number                  // show赋值number
				this.isShow[this.last] = false      // 改变isShow数组对应下标的值
				this.isShow[number] = true          // 改变isShow数组对应下标的值
				this.last = number                  // 更新展示组件的下标
			},
		},
		//注册组件
		components:{
			Dontuse,
			Expired,
		}
	}
</script>

<style lang="less">
	.coupons{
		position: absolute;
		width:100%;
		height: 100%;
		background-color: #F8F8F8;
		.lll{
			background-color:#fff;
			margin-top:90rpx;
		}
		.headerBar{
			position: fixed;
			z-index: 9999;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			height:98rpx;
			background-color: #fff;
			box-sizing: border-box;
			padding: 0 41rpx;
			text{
				flex: 1;
				line-height: 98rpx;
				text-align: center;
				color:#666;
				font-size: 28rpx;
			}
			.show{
				border-bottom: 4rpx solid #E83235;
				font-size: 34rpx;
				font-weight: 700;
				color:#222;
			}
		}
	}
</style>
