<template>
	<view class="quanbu">
		<!-- 头部导航 -->
		<view  class="headerBar">
			<text :class="{ show: isShow[0] }" @click="change(0)">全部</text>
			<text :class="{ show: isShow[1] }" @click="change(1)">待上门</text>
			<text :class="{ show: isShow[2] }" @click="change(2)">待退款</text>
			<text :class="{ show: isShow[3] }" @click="change(3)">已完成</text>
			<text :class="{ show: isShow[4] }" @click="change(4)">已取消</text>
		</view>
		<!-- 显示组件区域 -->
		<view class="lll">
			<All v-if='show === 0' :allList='allList'></All>
			<Wait v-if='show === 1' :topDoorList='topDoorList'></Wait>
			<Refund v-if='show === 2' :refundList='refundList'></Refund>
			<Complete v-if='show === 3' :completeList='completeList'></Complete>
			<Cancel v-if='show === 4' :cancelList='cancelList'></Cancel>
		</view>
	</view>
</template>

<script>
	// 引入axios
	import MyAxios from "../../myAxios.js" 
	// 取得全局App
	var app=getApp();     
	//引入组件
	import All from "./all/all";
	import Cancel from "./cancel/cancel";
	import Complete from "./complete/complete";
	import Refund from "./refund/refund";
	import Wait from "./Wait/Wait";
	export default{
		data:()=>{
			return{
				show:0,                              //拥有show类名的展示
				last:0,                              //记录上一次展示组件的下标
				allList:[],                          //所有类型的订单
				topDoorList:[],                      //待上门订单
				refundList:[],                       //待退款订单
				completeList:[],                     //已完成订单
				cancelList:[],                       //已取消订单
				isShow:[true,false,false,false,false]//通过数组的值判断谁显示 和 show / last 配合使用
			}
		},
		//监听触底事件
		onReachBottom(){this.change(this.show)},
		//点击分享
		onShareAppMessage:function(res){
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png"
			}
		},
		onLoad(data) {
			//消除上个页面的等待框
			uni.hideLoading()
			//解构赋值
			const {number} = JSON.parse(data.data)
			//执行change函数
			this.change(number)
			//监听get事件   wait页面 取消或完成 后触发此函数
			uni.$on("get",()=>{this.get()})
		},
		methods:{
			//获取全部类型数据
			init:async function(number){
				let status
				let start
				//status 状态: "" 全部，1，待上门，2，已完成, 3,待退款,4,已取消 
				if(number == 0){
					status = ""  					//状态
					start = this.allList.length  	//列表里已经有多少条
				}else if(number == 1){
					status = 1
					start = this.topDoorList.length
				}else if(number == 2){
					status = 3
					start = this.refundList.length
				}else if(number == 3){
					status = 2
					start = this.completeList.length
				}else if(number == 4){
					status = 4
					start = this.cancelList.length
				}
				//获取openid
				let openid = app.globalData.openid
				//获取订单  （4种类型）
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/my_order",{openid,status,start})
				//添加图片前缀
				result[1].data.map((item,index)=>{
					item.item.map((item1,index1)=>{
						item1.picture = `https://ygbao.magicxhx.com${item1.picture}`
					})
				})
				//判断这是哪个页面请求的数据   谁请求就注入谁的列表
				if(number == 0){
					//判断订单类型  只有全部页面要判断 其他页面是固定的
					result[1].data.map(item => {
						if(item.status == "1"){
							item.status = "待上门"
						}else if(item.status == "2"){
							item.status = "已完成"
						}else if(item.status == "3"){
							item.status = "待退款"
						}else if(item.status == "4"){
							item.status = "已取消"
						}
						this.allList.push(item)
					})
				}else if(number == 1){
					result[1].data.map(item => {
						this.topDoorList.push(item)
					})
				}else if(number == 2){
					result[1].data.map(item => {
						this.refundList.push(item)
					})
				}else if(number == 3){
					result[1].data.map(item => {
						this.completeList.push(item)
					})
				}else if(number == 4){
					result[1].data.map(item => {
						this.cancelList.push(item)
					})
				}
			},
			//切换组件
			change:function(number){ 		
				this.show = number 				// show赋值number
				this.isShow[this.last] = false  // 改变isShow数组对应下标的值
				this.isShow[number] = true      // 改变isShow数组对应下标的值
				this.last = number              // 更新展示组件的下标
				this.init(number)               //切换组件 就获取
			}, 
			//专门给wait获取订单
			get:async function(){
				let status = 1
				let start = 0
				//获取openid
				let openid = app.globalData.openid
				//获取wait类型订单
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/my_order",{openid,status,start})
				//添加图片前缀
				result[1].data.map((item,index)=>{
					item.item.map((item1,index1)=>{
						item1.picture = `https://ygbao.magicxhx.com${item1.picture}`
					})
				})
				this.topDoorList = result[1].data
				//让index页面刷新订单数和进行中的订单
				uni.$emit("orderNumber")
			}
		},
		//注册组件
		components:{
			All,
			Cancel,
			Complete,
			Refund,
			Wait
		}
	}
</script>

<style lang="less">
	.quanbu{
		position: absolute;
		width:100%;
		height: 100%;
		background-color: #F8F8F8;
		.lll{
			background-color:#fff;
			margin-top:120rpx;
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
