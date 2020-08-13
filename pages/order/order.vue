<template>
	<view class="order">
		<!-- 头部导航 -->
		<view  class="headerBar">
			<text :class="{ show: isShow[0] }" @click="change(0)">选择服务</text>
			<text :class="{ show: isShow[1] }" @click="change(1)">服务详情</text>
			<text :class="{ show: isShow[2] }" @click="change(2)">常见问题</text>
		</view>
		<!-- 显示组件 -->
		<view class="lll" v-if="showComponents">
			<Fuwu :class="{ none: !isShow[0] , block : isShow[0]}" :telephone="telephone" :instruction="instruction" :service_name="service_name" :price="price" :sec_services="sec_services" ></Fuwu>
			<Servicedetails :class="{ none: !isShow[1] , block : isShow[1]}" :details="details"></Servicedetails>
			<Problem :class="{ none: !isShow[2] , block : isShow[2]}" :question="question"></Problem>
		</view>
		<!-- 立即下单 -->
		<view class="amount">
			<view class="jine">
				<text>{{service_name}}完成后支付：</text>
				<text class="myred">{{total}}</text>
			</view>
			<view class="xiadan" @click="go('../orderDetails/orderDetails',{total,HasChosen,service_name})">立即下单</view>
		</view>
		<!-- 警告弹窗 -->
		<view class="warning" v-if="isWarning">
			<text class="iconfont">&#xe60d;</text>
			<text>{{errMsg}}</text>
		</view>
	</view>
</template>

<script>
	//引入组件
	import Fuwu from "./fuwu/fuwu.vue";
	import Problem from "./problem/problem.vue";
	import Servicedetails from "./Servicedetails/Servicedetails.vue";
	// 引入axios
	import MyAxios from "../../myAxios.js"
	// 取得全局App
	var app = getApp();     
	export default{
		data(){
			return{
				last:0,                           //记录上一次展示组件的下标
				isShow:[true,false,false],        //通过数组的值判断谁显示 和 show / last 配合使用
				service_name:"",                  //选择服务下面的服务名称
				sec_services:[],                  //服务列表
				price:"",                         //起步价格
				telephone:"",                     //客服询价
				question:"",                      //常见问题
				details:"",                       //服务详情
				instruction:[],                   //下单说明
				isxy:true,                        //是否同意服务协议
				isWarning:false,                  //警告框是否显示
				errMsg:"",                        //错误提示
				HasChosen:[],                     //已选择的项目列表   这个是自己用的 
				total:0,                          //已选项目的金额
				showComponents: false             
			}
		},
		onLoad(data){
			app.globalData.serviceId = data.data //改变全局serviceId
			this.init(data.data)  //获取服务列表  服务详情  常见问题
			//监听isxy事件  在fuwu页面触发
			uni.$on('isxy',()=>{this.isxy = true})
			//触发isxyis事件  在fuwu页面触发
			uni.$on('isxyis',(data)=>{this.isxy = data})
			//监听changeHasChosen事件  在fuwu页面触发
			uni.$on('changeHasChosen',(data)=>{
				const {HasChosen,total} = data
				this.total = total
				this.HasChosen = HasChosen
			})
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
			//初始化
			init:async function(pid) {
				//获取商品列表
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/sec_service",{pid})
				//动态改变标题
				uni.setNavigationBarTitle({
				    title: `约工宝 - ${result[1].data.service_name}`
				});
				//因为获取到的图片地址不是完整的 所以要拼接 https://ygbao.magicxhx.com
				//这个也不是固定的,是变值,看后台让你加什么前缀网址
				result[1].data.sec_services.map((item,index)=>{
					result[1].data.sec_services[index].picture = `https://ygbao.magicxhx.com${result[1].data.sec_services[index].picture}` 
				})
				for(let key in this.$data){
					if(result[1].data[key] != undefined){
						this.$data[key] = result[1].data[key]
					}
				}
				this.showComponents = true
			},
			//切换组件
			change:function(number){ 
				this.show = number // show赋值number
				this.isShow[this.last] = false // 改变isShow数组对应下标的值
				this.isShow[number] = true // 改变isShow数组对应下标的值
				this.last = number // 更新展示组件的下标
			},
			//页面跳转
			go:function(url,data={}){
				// //没同意服务协议 不允许下单
				if(this.isxy == false){
					this.errMsg = "请先勾选服务协议"
					this.isWarning = true
					setTimeout(()=>{
						this.isWarning = false
					},2000)
					return
				}
				//没勾选服务 不允许下单
				if(this.total == 0){
					this.errMsg = "请先选择服务"
					this.isWarning = true
					setTimeout(()=>{
						this.isWarning = false
					},2000)
					return
				}
				uni.showLoading({
					title:"加载中"
				})
				this.send(data)
				uni.navigateTo({
					//传值要先转json不然下个页面收到的就是[object Object]  因为对象转字符串就是 [object Object]
					url:`${url}?data=${JSON.stringify(data)}`
				})
			},
			//把用户已选的服务项目发给后端
			send:async function(data){
				let user_id = app.globalData.user_id
				let city_id = app.globalData.cityId
				let cate_id = app.globalData.serviceId
				let openid = app.globalData.openid
				let total_fee = data.total
				let definite = data.HasChosen
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/order",{
					user_id,
					city_id,
					cate_id,
					openid,
					total_fee,
					definite
				},"post")
				//存储下单id
				app.globalData.order_id = result[1].data.order_id
			},
		},
		//引入组件
		components:{
			Fuwu,
			Problem,
			Servicedetails
		}
	}
</script>

<style lang="less">
	.order{
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
		.amount{
			position: fixed;
			display: flex;
			bottom: 0;
			left: 0;
			right: 0;
			justify-content: space-between;
			height:118rpx;
			background-color: #fff;
			.xiadan{
				width:233rpx;
				line-height: 118rpx;
				text-align: center;
				background-color: #E83235;
				color:#fff;
				font-size: 36rpx;
				letter-spacing: 2rpx;
			}
			.jine{
				font-size: 28rpx;
				color:#222;
				flex: 1;
				text-indent: 27rpx;
				line-height:118rpx;
				.myred{
					color:#E83235;
				}
			}
		}
		.warning{
			position: fixed;
			top:0;
			bottom:0;
			left: 0;
			right: 0;
			margin:auto;
			width:300rpx;
			height:200rpx;
			background-color: rgba(0,0,0,.8);
			border-radius: 10rpx;
			color:#fff;
			text{
				display: block;
				text-align: center;
				margin-top:30rpx;
				font-weight: 100;
				letter-spacing: 2rpx;
			}
			.iconfont{
				font-size: 60rpx;
			}
		}
		
	}
	.none{
		display: none;
	}
	.block{
		display: block;
	}
</style>

