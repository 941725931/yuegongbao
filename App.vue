<script>
	let number = 0 
	export default {
		onLaunch: function() {
		},
		onShow: function() {
			//因为打电话和地图选点 完成后都会触发这个函数 导致显示等待框
			//所以每次让number+1 然后再通过判断  就可以让等待框只在小程序第一次初始化的时候会显示
			//在拨打电话回来和地图选址回来后不会出现等待框
			//如果对我说的不理解   请取消if判断 然后去打电话 和 地图选点 看看效果
			number += 1
			if(number == 1){
				uni.showLoading({
					title:"加载中"
				})
			}
		},
		onHide: function() {
		},
		//定义全局变量  方便各个页面获取和修改 
		globalData: {  
			avatarUrl:"",  //头像
			nickName:"",   //名字
			cityId:"",     //cityId
			serviceId:"",  //serviceId
			openid:"",      //openid
			order_id:"",     //order_id
			user_id:""
		}, 
	}
	
</script>

<style>
	/*每个页面公共css */
	@font-face {
	  font-family: 'iconfont';  /* project id 1768874 */
	  src: url('//at.alicdn.com/t/font_1768874_am2ionw67hk.eot');
	  src: url('//at.alicdn.com/t/font_1768874_am2ionw67hk.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1768874_am2ionw67hk.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1768874_am2ionw67hk.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1768874_am2ionw67hk.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1768874_am2ionw67hk.svg#iconfont') format('svg');
	}
	.iconfont{
	    font-family:"iconfont" !important;
	    font-size:16px;font-style:normal;
	    -webkit-font-smoothing: antialiased;
	    -webkit-text-stroke-width: 0.2px;
	    -moz-osx-font-smoothing: grayscale;}
</style>
