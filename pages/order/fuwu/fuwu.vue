<template>
	<view class="xuanzefuwu">
		<!-- 头部区域 -->
		<view class="header">
			<!-- 服务名称 -->
			<text class="project">{{service_name}}</text>
			<!-- 商品列表 -->
			<view class="main" v-for="(item,index) in list" :key="index">
				<image :src="item.picture" mode=""></image>
				<view class="describe">
					<text class="jianjie">{{item.service_desc}}</text>
					<view class="bottom">
						<text class="xiaokong">{{item.name}}</text>
						<view class="jiaOrJian">
							<text class="jian" @click="reduce(index,0,item)">-</text>
							<text>{{chooseNumber[index]}}</text>
							<text class="jia" @click="increase(index,0,item)">+</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 更多商品列表 -->
			<view class="gengduo" v-if="isMore">
				<view class="show" @click="changeHide(1)">
					<view class="ad-column" v-if="ishide == true">
						<text class="project">更多项目</text>
						<text class="project right myblue">(展开更多↓↓↓)</text>
					</view>
					<text class="project hideText myblue" v-if="ishide == true">展开[+]</text>
				</view>
				<view class="hide" v-if="ishide == false" @click="changeHide(2)">
					<text class="project">更多项目</text>
					<text class="project hideText">隐藏[-]</text>
				</view>
				<view class="main" v-if="moreHide" v-for="(item,index) in moreList" :key="index">
					<image :src="item.picture" mode=""></image>
					<view class="describe">
						<text class="jianjie">{{item.service_desc}}</text>
						<view class="bottom">
							<text class="xiaokong">{{item.name}}</text>
							<view class="jiaOrJian">
								<text class="jian" @click="reduce(index,1,item)">-</text>
								<text>{{moreNumber[index]}}</text>
								<text class="jia" @click="increase(index,1,item)">+</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 费用明细 -->
		<view class="detail">
			<text class="feiyong">费用明细：</text>
			<text class="feiyong myred" v-if="!NotChoose">({{price}}元起，选定项目后计算)</text>
			<view class="show" v-if="NotChoose">
				<text>已选服务</text>
				<text>数量</text>
				<text>费用小计</text>
			</view>
			<view class="mulu" v-for="(item,index) in HasChosen" :key="index">
				<view class="selected">
					<view>{{item.name}}</view>
					<view><text>{{item.number}}</text>个</view>
					<view class="red">￥<text>{{item.price}}</text></view>
				</view>
			</view>
			<view class="combined" v-if="NotChoose">
				合计：<text>{{total}}</text>
			</view>
		</view>
		<!-- 费用介绍 -->
		<view class="instructions">
			<view class="xiadan">
				<image src="../../../static/home/xiadanshuoming.png" mode=""></image>
				<text v-for="(item,index) in instruction" :key="index">{{index + 1}}.{{item}}</text>
			</view>
			<view class="contact" @click="call(telephone)">
				<text>不会选？</text>
				<view class="inquiry">
					<view class="phone">
						<view class="iconfont">&#xe639;</view>
					</view>
					<text>联系客服询价:{{telephone}}</text>
				</view>
			</view>
		</view>
		<!-- 服务协议 -->
		<view class="terms">
			<view @click="changeisxy" :class="{ no: !isxy , yes : isxy}">
				<view class="iconfont">&#xeaf1;</view>
			</view>
			<text @click="goServiceAgreement('../serviceAgreement/serviceAgreement',service_name)">我已阅读并同意服务协议</text>
		</view>
	</view>
</template>

<script>
	import MyAxios from "../../../myAxios.js" // 引入axios
	var app=getApp();     // 取得全局App
	
	export default {
		data:()=>{
			return {
				isxy:true,                        //是否同意服务协议
				list:[],                          //服务列表
				chooseNumber:[],                  //服务列表选择的数量
				moreNumber:[],                    //更多列表选择的数量
				isMore:false,                     //是否显示更多项目
				moreList:[],                      //更多项目列表
				ishide:true,                      //更多项目列表分为隐藏和显示  这个属性来控制
				moreHide:false,                   //更多项目列表分为隐藏和显示  这个属性来控制
				HasChosen:[],                     //已选择的项目列表   这个是自己用的  
				NotChoose:false,                  //未选择项目
				total:0,                          //已选服务的总金额
			}
		},
		props:["service_name","sec_services","price","instruction","telephone"],
		mounted(){
			this.init()
			uni.hideLoading()
			//监听on事件  在serviceAgreement页面触发
			uni.$on('update',()=>{
				this.isxy = true
				//触发isxy事件  在order页面触发
				uni.$emit('isxy')
			})
		},
		methods: {
			//初始化数据
			init:function(){
				this.name = this.service_name
				this.money = this.price
				//如果传过来的条数大于4 我就等于4 小于就全部push到服务列表
				let len = this.sec_services.length > 4? 5 : this.sec_services.length
				//给服务列表注入数据
				for(let i = 0;i < len;i++){
					this.list.push(this.sec_services[i])
					this.chooseNumber.push(0)
				}
				
				//如果获取的列表大于5 就把多余的项目放到更多项目列表里面
				if(this.sec_services.length > 5){
					this.isMore = true
					for(let i = 5;i < this.sec_services.length;i++){
						this.moreList.push(this.sec_services[i])
						this.moreNumber.push(0)
					}
				}
			},
			//拨打电话
			call:function(phoneNumber){
			  uni.makePhoneCall({
			      phoneNumber, //电话号码  只能写字符串  数字不能生效
			  });
			},
			//改变isxy
			changeisxy:function(){
				this.isxy = !this.isxy
				//触发isxyis事件  在order页面触发
				uni.$emit('isxyis',this.isxy)
			},
			//这个专门去serviceAgreement页面   这个不用验证
			goServiceAgreement:function(url,data){
				uni.navigateTo({
					url:`${url}?data=${data}`
				})
			},
			
			//更多项目显示与隐藏
			changeHide:function(number){
				if(number == 1){
					this.ishide = false
					this.moreHide = true
				}else{
					this.ishide = true
					this.moreHide = false
				}
			},
			//点击减少
			reduce:function(index,number,item){
				if(number == 0){   // 服务列表的
					if(this.chooseNumber[index] == 0)return   //如果已经是0了就不能减了
					this.chooseNumber[index] -= 1
				}else{    //更多列表
					if(this.moreNumber[index] == 0)return   //如果已经是0了就不能减了
					this.moreNumber[index] -= 1
				}
				this.changeHasChosen(item,0)
			},
			//点击增加
			increase:function(index,number,item){
				if(number == 0){   // 服务列表的
					this.chooseNumber[index] += 1
				}else{    //更多列表
					this.moreNumber[index] += 1
				}
				this.changeHasChosen(item,1)
			},
			//更新已选项目
			changeHasChosen:function(obj,num){
				//num等于1  说明是加
				if(num == 1){ 
				   //说明已选列表里面什么都没有  那就直接创建一个
					if(this.HasChosen.length == 0){
						this.HasChosen.push({
							Id:obj.Id,
							name:obj.name,
							number:1,
							price:obj.price,
							picture:obj.picture,
							service_desc:obj.service_desc
						})
						this.NotChoose = true   //让明细显示
					}else{
						let bl = true
						this.HasChosen.map((item,index)=>{
							//如果已选择的列表中有点击的项目  就在已选列表对应的项的数量加一
							if(item.name == obj.name){ 
								this.HasChosen[index].number +=  1
								this.HasChosen[index].price = obj.price *  this.HasChosen[index].number
								bl = false
								return
							}  
						})
						//bl = true说明已经找到了  就不用push新的了
						if(bl){   
							this.HasChosen.push({
								Id:obj.Id,
								name:obj.name,
								number:1,
								price:obj.price,
								picture:obj.picture,
								service_desc:obj.service_desc
							})
						}
					}
				}else{ //num等于0  说明是减
					this.HasChosen.map((item,index)=>{
						if(item.name == obj.name){ //如果已选择的列表中有点击的项目  就在已选列表对应的项的数量减一
							if(this.HasChosen[index].number == 1){ //如果number == 1 再减少就直接把这个对象删除
								this.HasChosen.splice(index,1)
								if(this.HasChosen.length == 0){  //减完以后判断列表长度是否为0 是的话隐藏总金额和明细
									this.NotChoose = false
								}
							}else{
								this.HasChosen[index].number -= 1
								this.HasChosen[index].price = obj.price *  this.HasChosen[index].number
							}
						}
					})
				}
				this.allPrice()
			},
		    //计算总金额
			allPrice:function(){
				let price = 0
				this.HasChosen.map((item,index)=>{
					price += (item.price / item.number) *  item.number
				})
				this.total = price 
				uni.$emit('changeHasChosen',{HasChosen:this.HasChosen,total:this.total})
			}
		}
	}
</script>

<style lang="less">
	.xuanzefuwu{
		background-color: #F8F8F8;
		border-bottom: 1rpx solid transparent;
		.detail{
			width:100%;
			margin-top:18rpx;
			background-color: #fff;
			box-sizing: border-box;
			padding: 0 31rpx;
			padding-bottom: 10rpx;
			.show{
				display:flex;
				border-top:1px solid #E3E1E1;
				border-bottom:1px solid #E3E1E1;
				text{
					width:33.33%;
					text-align: center;
					line-height: 76rpx;
					color:#888;
					font-size: 27rpx;
				}
			}
			.feiyong{
				display: inline-block;
				font-weight: 600;
				font-size: 30rpx;
				color:#222;
				margin-top:19rpx;
				margin-bottom: 13rpx;
			}
			.myred{
				color:#E83235;
			}
			.mulu{
				border-bottom:1px solid #E3E1E1;
				font-weight: 600;
				.selected{
					display:  flex;
					.red{
						color:#FE1D1D;
					}
					view{
						color:#222;
						font-size: 28rpx;
						text-align: center;
						width:33.33%;
						line-height: 76rpx;
					}
				}
			}
		}
		.combined{
			font-size: 32rpx;
			font-weight: 600;
			color:#FE1D1D;
			text-align: right;
			margin-top:10rpx;
		}
		.instructions{
			background-color: #fff;
			border-bottom: 1rpx solid #fff;
			border-top: 1rpx solid #fff;
			margin-top:26rpx;
			.xiadan{
				background-color: #DAE2EB;
				width:709rpx;
				border-top: 1rpx solid #DAE2EB;
				margin:26rpx auto 0; 
				text{
					display:block;
					color:#222;
					font-size: 25rpx;
					line-height: 60rpx;
					margin:0 50rpx;
				}
				image{
					width:86%;
					display: block;
					margin:27rpx auto 15rpx;
					height:30rpx;
				}
			}
			.contact{
				display: flex;
				justify-content: space-around;
				color:#1D82FE;
				font-size: 24rpx;
				margin:62rpx auto 30rpx;
				.inquiry{
					display: flex;
					.phone{
						background-color: #1D82FE;
						width:40rpx;
						height:40rpx;
						border-radius: 50%;
						margin:-4rpx 10rpx 0 0;
						view{
							color:#fff;
							width:40rpx;
							line-height:40rpx;
							text-align: center;
							font-size: 20rpx;
						}
					}
				} 
			}
		}
		.terms{
			display: flex;
			justify-content: center;
			font-size: 24rpx;
			color:#1D82FE;
			height:60rpx;
			margin-top:70rpx;
			margin-bottom:222rpx;
			.yes{
				width:58rpx;
				height:60rpx;
				border-radius: 10rpx;
				background-color: #1D82FE;
				margin:-12rpx 10rpx 0 0;
				view{
					color:#fff;
					width:58rpx;
					line-height:60rpx;
					text-align: center;
					font-size: 36rpx;
				}
			}
			.no{
				width:58rpx;
				height:60rpx;
				border-radius: 10rpx;
				background-color: #fff;
				margin:-12rpx 10rpx 0 0;
				view{
					color:#fff;
					width:58rpx;
					line-height:60rpx;
					text-align: center;
					font-size: 36rpx;
				}
			}
		}
		
		
		
		.header{
			background-color: #fff;
			box-sizing: border-box;
			padding: 0 31rpx;
			.hide{
				display: flex;
				justify-content: space-between;
				.hideText{
					color:#888;
				}
			} 
			.show{
				display: flex;
				justify-content: space-between;
				.right{
					margin-left: 20rpx;
					letter-spacing: 4rpx;
				}
				.myblue{
					color:#1D82FE;
				}
			}
			.project{
				display: inline-block;
				font-weight: 600;
				font-size: 30rpx;
				color:#222;
				margin-top:19rpx;
				margin-bottom: 24rpx;
			}
			.main{
				width:100%;
				padding-bottom: 4rpx;
				border-bottom: 1rpx solid #E3E1E1;
				margin:0 auto 10rpx;
				display: flex;
				image{
					width: 100rpx;
					height:100rpx;
					border-radius: 6rpx;
					margin-right: 20rpx;
				}
				.describe{
					flex:1;
					.jianjie{
						display: block;
						margin-top:-2rpx;
						font-size: 28rpx;
						color:#888;
					}
					.bottom{
						margin-top: 10rpx;
						display: flex;
						justify-content: space-between;
						view{
							display: flex;
							justify-content: space-between;
						}
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
						.jiaOrJian{
							text{
								display: block;
								margin:0 3rpx;
								background-color: #EBEBEB;
								color:#343434;
								width:56rpx;
								line-height:50rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}
</style>