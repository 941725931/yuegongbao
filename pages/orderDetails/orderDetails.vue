<template>
	<view class="orderDetails">
		<!-- 新建收货地址 -->
		<view class="newAddress" v-if="noAddress" @click="go('../newAddress/newAddress')">
			<view>新增收货地址，保证商品顺利送达!</view>
			<image src="../../static/home/right.png" mode=""></image>
		</view>
		<!-- 联系人信息 -->
		<view class="xinxi" v-if="!noAddress">
			<view class="lianxiren">
				<view>
					<text class="one">联系人：</text>
					<text>{{address.consignee}}</text>
				</view>
				<text class="number">{{address.mobile}}</text>
			</view>
			<view class="dizhi" @click="go('../SwitchAddress/SwitchAddress')">
				<text class="iconfont">&#xe604;</text>
				<view class="xidz">
					<text>上门地址：</text>
					<text>{{address.address}}{{address.house_number}}</text>
				</view>
				<image src="../../static/home/right.png" mode=""></image>
			</view>
		</view>
		<!-- 详情 -->
		<view class="xiangqing">
			<!-- 上门时间 -->
			<hTimePicker sTime="8"  cTime="20" interval="1" @changeTime="changeTime">
			  <view slot="pCon" class="changeTime">
				  <view class="shangmenshijian">
				  	<view class="shangmenshijianTop">
				  		<text class="one">上门时间：</text>
				  		<text class="two">{{time}}</text>
				  	</view>
				  	<image src="../../static/home/right.png" mode=""></image>
				  </view>
			  </view>
			</hTimePicker>
			<!-- 订单详情 -->
			<view class="dingdanxiangqing">
				<view class="dingdan1">订单详情</view>
				<view class="dingdan">
					<view class="main" v-for="(item,index) in HasChosen" :key="index">
						<image :src="item.picture" mode=""></image>
						<view class="describe">
							<view class="shuliang">
								<text class="xiaokong">{{item.name}}</text>
								<view class="geshu">
									<text>x</text>
									<text class='paddingText'>{{item.number}}</text>
									<text>个</text>
								</view>
							</view>
							<text class="jianjie">{{item.service_desc}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="youhuiquan">
				<view @click="xuanze">
					<text>优惠券</text>
					<text v-if="preferential" class="two">无可用优惠劵</text>
					<text v-if="!preferential" class="two">{{selectedPreferential.name}}[{{selectedPreferential.money}}元]</text>
				</view>
				<image src="../../static/home/right.png" mode="" @click="xuanze"></image>
			</view>
			<!-- 支付明细 -->
			<view class="zhifumingxi">
				<view class="mingxi">支付明细</view>
				<view class="xiangqing">
					<view class="fuwufei" v-for="(item,index) in HasChosen" :key="index">
						<text>{{item.name}}服务费</text>
						<view class="right">
							<text>￥</text>
							<text>{{item.price / item.number}}</text>
							<text class="red paddingText">x</text>
							<text>{{item.number}}</text>
						</view>
					</view>
					<view class="new" v-if="!preferential">
						<text class="xinyonghu">{{selectedPreferential.name}}</text>
						<text class="margin">-</text>
						<text>￥</text>
						<text>{{selectedPreferential.money}}</text>
					</view>
				</view>
				<view class="heji">
					<text>合计：</text>
					<text>{{total - selectedPreferential.money}}</text>
				</view>
			</view>
			<!-- 订单备注 -->
			<view class="dingdanbeizhu" :class="{'nodisplay':!istextarea}">
				<textarea type="text" value="" placeholder="请输入对订单的备注信息！" @input="changeNote"/>
			</view>
			<!-- 公告 -->
			<view class="gonggao" v-if="prompt">
				<view class="gonggaoview">
					<text class="iconfont">&#xe6ce;</text>
					<view class="middle">
						<text class="zhongjian">请认真核对信息，确认无误后，点击立即下单进行下单</text>
					</view>
					<text class="iconfont" @click="prompt = false">&#xe61b;</text>
				</view>
			</view>
			<!-- 立即下单 -->
			<view class="lijixiadan">
				<view class="jine">
					<view class="one">
						<text>{{service_name}}完成后支付：</text>
						<text id="red">￥</text>
						<text id="red">{{total - selectedPreferential.money}}</text>
					</view>
					<view class="one">
						<text>优惠券已减：</text>
						<text>￥</text>
						<text>{{selectedPreferential.money}}</text>
					</view>
				</view>
				<view class="xiadan" @click="PlaceTheOrder">立即支付</view>
			</view>
		</view>
		<!-- 底部优惠弹窗 -->
		<view @click="hidden" :class="{'bottomWindow' : isShow , 'none':!isShow}">
			<view class="window" :class="{'show' : isShow}">
				<view class="one">优惠券</view>
				<!-- 优惠券列表 -->
				<view class="preferentialList">
					<view class="list" v-for="(item,index) in preferentialList" :key="index" @click="use(item,1)">
						<view class="dg">
							<view class="riqi">
								<text>截止日期 </text>
								<text>{{item.use_start_time}}-{{item.use_end_time}}</text>
							</view>
							<view class="price">
								<text class="fuhao">￥</text>
								<text class="money">{{item.money}}</text>
							</view>
							<view class="meet">满{{item.condition}}元可用</view>
							<image src="/static/home/666.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- 不使用优惠券 -->
				<view v-if="preferentialList.length" class="bushiyong">
					<text class="bushiyongone">暂不使用优惠券</text>
					<view class="bushiyongtwo" @click="use(0,0)">
						<text v-if="Dontuse"></text>
					</view>
				</view>
				<!-- 没有订单 显示此图片 -->
				<image v-if="!preferentialList.length" class="wudingdan" src="../../static/home/eab69e4d8b27c8016334e8c659f5111.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import hTimePicker from "@/components/h-timePicker/h-timePicker.vue";
	import MyAxios from "../../myAxios.js" // 引入axios
	var app = getApp();     // 取得全局App
	
	export default{
		data(){
			return{
				note:"",                    //订单备注信息
				time:"",                    //上门时间
				total:0,                    //下单金额
				address:{},                 //收货地址
				prompt:true,                //底部提示信息
				HasChosen:[],               //服务项目
				isShow:false,               //底部优惠卷弹窗
				Dontuse:false,              //暂不使用优惠卷
				istextarea:true,            //优惠券弹出来的时候 这个隐藏 不然会被盖住
				noAddress:false,            //没有默认地址
				preferential:false,         //优惠券  false显示无可用优惠券
				service_name:"",            //服务名
				preferentialList:[],        //可用优惠券列表
				selectedPreferential:{},    //选择了的优惠券
			}
		},
		components:{
		    hTimePicker //引入选择时间组件
		},
		onLoad(data) {
			//清除上个页面的加载框
			uni.hideLoading()
			//解构赋值
			const {total,HasChosen,service_name} = JSON.parse(data.data)
			this.total = total
			this.HasChosen = HasChosen
			this.service_name = service_name
			//改变页面标题
			uni.setNavigationBarTitle({
				title:`结算-${service_name}`
			})
			this.coupons()
		},
		//点击分享
		onShareAppMessage:function(res){
			return {
				title: '约工宝专业约工---快速上门，全城服务',
				path: '/pages/index/index',
				imageUrl:"../../static/home/logo.png"
			}
		},
		onShow() {
			this.getaddress()
			this.calculateTime()
		},
		
		methods:{
			//初始化数据
			getaddress:async function(){
				//取出user_id
				let user_id = app.globalData.user_id
				//请求用户默认地址
				let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/address_default",{user_id})
				//用户没有设置默认地址  让用户添加地址
				if(result[1].data.code == 0){ 
					//没有地址  显示提示用户添加地址
					this.noAddress = true  
				}else{
					//拥有地址   显示地址
					this.noAddress = false
					this.address = result[1].data
				}
			},
			//获取优惠券列表
			coupons:async function(){
				let order_id = app.globalData.order_id
				let user_id = app.globalData.user_id
				//如果没获取到order_id就不往下执行  并且重新执行该函数
				//底下必须用异步获取  同步我试了会一直获取不到
				if(!order_id){
					setTimeout(()=>{
						this.coupons()
					},100)
					return
				}
				//请求优惠券接口
				let result1 = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/balance",{order_id,user_id})
				//没有优惠卷
				if(result1[1].data.code == 2){ 
					this.preferential = true
					this.selectedPreferential.money = 0
				}else{
					//先吧后台传来的时间戳 转换成文本
					result1[1].data.map((item,index)=>{
						result1[1].data[index].use_start_time = this.getTime(item.use_start_time)
						result1[1].data[index].use_end_time = this.getTime(item.use_end_time)
					})
					this.preferentialList = result1[1].data
					//把第一个优惠券 添加到正在使用的优惠卷列表中
					//这样写可以避免 两个对象指向同一个内存地址
					let json = JSON.stringify(result1[1].data[0])
					this.selectedPreferential = JSON.parse(json)
				}
			},
			//把时间戳转换成日期
			getTime:function(timeStamp){
				let time = new Date(parseInt(timeStamp * 1000))
				let Y = time.getFullYear() + '-';
				let M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
				let D = time.getDate() + ' ';
				return time = Y + M + D
			},
			//订单备注信息
			changeNote:function(e){
				this.note = e.detail.value
			},
			//使用优惠券
			use:function(item,number){
				if(number == 1){
					//这样写可以避免 两个对象指向同一个内存地址
					let json = JSON.stringify(item)
					this.selectedPreferential = JSON.parse(json)
					this.Dontuse = false
				}else{
					this.selectedPreferential.money = 0
					this.selectedPreferential.name = "暂不使用优惠券"
					this.Dontuse = !this.Dontuse
				}
				this.istextarea = true
			},
			//计算上门时间
			calculateTime:function(){
				//获取当前时间
				let myDate = new Date();
				//获取到的分 是否小于10   小于10 就拼接一个 0
				let fen = myDate.getMinutes() < 10? "0" + myDate.getMinutes() : myDate.getMinutes()
				this.time = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()} ${myDate.getHours() + 1}:${fen}`
			},
			//改变上门时间
			changeTime:function(data){
				this.time = data
			},
			//底部优惠卷弹窗显示
			xuanze:function(){
				this.isShow = true
				this.istextarea = false
			},
			//底部优惠卷弹窗隐藏
			hidden:function(){
				this.isShow = false
				this.istextarea = true
			},
			//立即下单
			PlaceTheOrder:async function(){
				//判断有没有地址 没有地址不让下单
				if(this.noAddress){
					//弹窗提示
					uni.showModal({
						content:"请添加收货地址",
						showCancel:false,
						confirmText:"马上添加",
						success:(res)=>{
							//点击确认就去添加地址
							this.go("../newAddress/newAddress")
						}
					})
				}else{
					let result = await MyAxios.axios("https://ygbao.magicxhx.com/api/index/settle",{
						order_id : app.globalData.order_id,
						user_id : app.globalData.user_id,
						pay_money : this.total - this.selectedPreferential.money,
						address : this.address,
						detail : this.note,
						coupon : this.selectedPreferential,
						go_time : this.time,
					},"post")
					if(result[1].data.code == 1){
						let openid = app.globalData.openid
						let order_id = app.globalData.order_id
						uni.request({
						   url: 'https://ygbao.magicxhx.com/api/pay/getPayPreview', // 请求路径
						   method: 'POST', //请求方式
						   data:{
							   order_id,
							   openid
					       },
						   success: result => {
							//调起支付
								uni.requestPayment({
									provider:'wxpay',
									timeStamp:result.data.timeStamp, // 时间戳从1970年1月1日至今的秒数，即当前的时间
									nonceStr:result.data.nonceStr, // 随机字符串，长度为32个字符以下
									package:result.data.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx
									signType:'MD5', //签名算法，暂支持 MD5
									paySign:result.data.paySign, // 签名
									success:(res)=>{
										console.log('success:' + JSON.stringify(res));
										//让index页面刷新订单数和进行中的订单
										uni.$emit("orderNumber")
										uni.navigateBack({
											//这个值写大一点
										    delta: 100
										});
									},
									fail: function(err) {
										console.log('fail:' + JSON.stringify(err));
									}
								});
							}
						})
					}
				}
			},
			//页面跳转
			go:function(url,data={}){
				uni.showLoading({
					title:"加载中"
				})
				uni.navigateTo({
					//传值要先转json不然下个页面收到的就是[object Object]  因为对象转字符串就是 [object Object]
					url:`${url}?data=${JSON.stringify(data)}`
				})
			},
		}
	}
</script>

<style lang="less">
	.orderDetails{
		.newAddress{
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
			height:85rpx;
			padding: 0 34rpx;
			font-size: 28rpx;
			color:#222;
			border-bottom: 1rpx solid #E7E7E7;
			image{
				width:14rpx;
				height:24rpx;
				margin-top:30rpx;
			}
			view{
				line-height:85rpx;
			}
		}
		.xinxi{
			.lianxiren{
				box-sizing: border-box;
				padding: 34rpx 32rpx 24rpx;
				border-bottom: 1rpx solid #E7E7E7;
				display: flex;
				justify-content: space-between;
				view{
					display: flex;
					justify-content: space-between;
					color:#222;
					font-size: 30rpx;
				}
				.one{
					font-weight: 600;
				}
				.number{
					color:#FD5356;
					font-size: 24rpx;
				}
			}
			.dizhi{
				box-sizing: border-box;
				padding: 29rpx 32rpx 24rpx;
				border-bottom: 1rpx solid #E7E7E7;
				display: flex;
				justify-content: space-between;
				.xidz{
					width:599rpx;
					font-size:28rpx;
					color:#222;
				}
				image{
					margin-top:8rpx;
					width:14rpx;
					height:24rpx;
				}
			}
		}
		.xiangqing{
			.shangmenshijian{
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				height:85rpx;
				padding: 0 34rpx;
				font-size: 28rpx;
				color:#222;
				border-bottom: 1rpx solid #E7E7E7;
				.shangmenshijianTop{
					display: flex;
					line-height:85rpx;
					.one{
						font-weight: 600;
					}
					.two{
						color:#ccc;
					}
				}
				image{
					width:14rpx;
					height:24rpx;
					margin-top:30rpx;
				}
			}
			.dingdanxiangqing{
				color:#222;
				font-size: 28rpx;
				.dingdan1{
					font-weight: 600;
					line-height:83rpx;
					border-bottom: 1rpx solid #E7E7E7;
					box-sizing: border-box;
					padding: 0 34rpx;
				}
				.dingdan{
					.main{
						width:100%;
						border-bottom: 1rpx solid #E3E1E1;
						box-sizing: border-box;
						padding:19rpx 29rpx 12rpx;
						display: flex;
						image{
							width: 100rpx;
							height:100rpx;
							border-radius: 6rpx;
							margin-right: 20rpx;
						}
						.describe{
							flex:1;
							.shuliang{
								display: flex;
								justify-content: space-between;
								margin-bottom: 15rpx;
								.xiaokong{
									height:54rpx;
									line-height:28rpx;
									box-sizing: border-box;
									border-radius: 6rpx;
									font-size: 26rpx;
									padding: 10rpx;
									color:#E83235;
									border:1rpx solid #E83235;
								}
								.geshu{
									font-size: 24rpx;
									.paddingText{
										padding:0 10rpx;
									}
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
				}
				
			}
			.youhuiquan{
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				height:85rpx;
				padding: 0 34rpx;
				font-size: 28rpx;
				color:#222;
				border-bottom: 1rpx solid #E7E7E7;
				view{
					width: 650rpx;
					display: flex;
					justify-content: space-between;
					text{
						line-height: 85rpx;
						font-weight: 600;
					}
					.two{
						font-size: 24rpx;
						color:#666;
					}
				}
				image{
					width:14rpx;
					height:24rpx;
					margin-top:34rpx;
				}
			}
			.zhifumingxi{
				font-size: 28rpx;
				color:#222;
				border-bottom: 1rpx solid #E7E7E7;
				.mingxi{
					font-weight: 600;
					line-height:83rpx;
					box-sizing: border-box;
					padding: 0 34rpx;
					border-bottom: 1rpx solid #E7E7E7;    
				}
				.xiangqing{
					box-sizing: border-box;
					padding: 44rpx 34rpx 29rpx;
					border-bottom: 1rpx solid #e7e7e7;
					.fuwufei{
						display: flex;
						justify-content: space-between;
						.right{
							display: flex;
							justify-content: space-between;
							margin-bottom: 10rpx;
							.red{
								color:#E83235;
							}
							.paddingText{
								padding: 0 10rpx;
							}
						}
					}
					.new{
						color: #666;
						text-align: right;
						font-size: 22rpx;
						.xinyonghu{
							display: inline-block;
							border-radius:4rpx;
							text-align: center;
							padding: 0 10rpx;
							line-height:36rpx;
							background-color: #FFEEEB;
							font-size: 20rpx;
							color:#FE1D1D;
						}
						.margin{
							margin:0 10rpx;
						}
					}
				}
				.heji{
					box-sizing: border-box;
					padding: 0 34rpx;
					line-height: 62rpx;
					font-size: 30rpx;
					color:#FE1D1D;
					font-weight: 600;
					text-align: right;
					border-bottom: 0rpx solid #e7e7e7;
				}
			}
			.dingdanbeizhu{
				border-top:1rpx solid transparent;
				margin-bottom: 230rpx;
				textarea{
					width:684rpx;
					height:106rpx;
					margin:34rpx auto 0;
					box-sizing: border-box;
					padding: 0 23rpx;
					color:#888;
					font-size: 28rpx;
					resize: none;
					border:1rpx solid #CFCFCF;
					border-radius:20rpx;
				}
			}
			.nodisplay{
				display: none;
			}
			.gonggao{
				position: relative;
				height:80rpx;
				padding-bottom: 118rpx;
				color:#FD5356;
				font-size: 24rpx;
				.gonggaoview{
					position: absolute;
					left: 0;
					top: 0;
					box-sizing: border-box;
					padding: 0 34rpx;
					display: flex;
					width:100%;
					justify-content: space-between;
					line-height:80rpx;
					background-color: #FFFAE4;
					.middle{
						width:600rpx;
						overflow: hidden;
						.zhongjian{
							display: inline-block;
							width:600rpx;
							text-align: center;
							animation: go 10s infinite linear;
						}
					}
					@keyframes go{
						from{
							transform: translateX(600rpx);
						}
						to{
							transform: translateX(-600rpx);
						}
					}
				}	
			}
			.lijixiadan{
				position: fixed;
				z-index: 999;
				bottom: 0;
				height:118rpx;
				display: flex;
				background-color: #fff;
				box-shadow: 0px 0px 10px #ccc;
				.jine{
					width:517rpx;
					box-sizing: border-box;
					padding-left: 31rpx;
					font-size: 30rpx;
					color:#222;
					.one{
						line-height: 59rpx;
						#red{
							color:#E83235;
						}
					}
				}
				.xiadan{
					text-align: center;
					width:233rpx;
					background-color: #E83235;
					font-size:36rpx;
					color:#fff;
					line-height:119rpx;
					letter-spacing: 4rpx;
				}
			}
		}
		.none{
			display: none;
		}
		.bottomWindow{
			position: absolute;
			z-index: 9999999999;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background-color: rgba(0,0,0,.5);
			.window{
				position: fixed;
				z-index: 99999999999;
				bottom: -690rpx;
				background-color: #fff;
				height:690rpx;
				width:100%;
				border-radius:16rpx 16rpx 0px 0px;
				.wudingdan{
					display: block;
					width:400rpx;
					height:330rpx;
					margin:auto;
					margin-top:-370rpx;
				}
				.one{
					font-size: 28rpx;
					text-align: center;
					margin:44rpx 0 35rpx;
					font-weight: 800;
				}
				.bushiyong{
					display: flex;
					justify-content: space-between;
					line-height:99rpx;
					box-sizing: border-box;
					padding: 0 30rpx;
					margin-top:33rpx;
					border-top:1rpx solid #D2D2D2;
					border-bottom:1rpx solid #D2D2D2;
					.bushiyongone{
						font-size: 26rpx;
						color:#666;
						letter-spacing: 8rpx;
						font-weight: normal;
					}
					.bushiyongtwo{
						width:30rpx;
						height:30rpx;
						margin:auto 0;
						border-radius:50%;
						border:1rpx solid #666;
						text{
							display: block;
							width:23rpx;
							height:23rpx;
							margin-top: 4rpx;
							margin-left: 4rpx;
							border-radius:50%;
							background-color: #1AA034;
						}
					}
				}
				.preferentialList{
					height:400rpx;
					overflow: auto;
					.list{
						box-sizing: border-box;
						padding-left:28rpx;
						.dg{
							position: relative;
							image{
								width:513rpx;
								height:139rpx;
							}
							.riqi{
								position: absolute;
								width:335rpx;
								text-align: center;
								top:8rpx;
								left:175rpx;
								text{
									color:#fff;
									font-size: 20rpx;
								}
							}
							.price{
								position: absolute;
								width:335rpx;
								text-align: center;
								top:40rpx;
								left:-88rpx;
								color:#fff;
								.fuhao{
									font-size: 30rpx;
								}
								.money{
									font-size: 45rpx;
								}
							}
							.meet{
								position: absolute;
								width:335rpx;
								text-align: center;
								top:58rpx;
								left:175rpx;
								color:#fff;
								font-size: 20rpx;
								font-weight: 700;
							}
						}
					}
				}
			}
			.show{
				animation: run .4s ;
				animation-fill-mode:forwards;
			}
			@keyframes run{
				to{
					bottom:0;
				}
			}
		}
	}
</style>
