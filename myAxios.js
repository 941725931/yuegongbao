exports.axios = function(url,data={},method="GET"){
	let myMethod = method.toLocaleUpperCase()  //转大写
	uni.showLoading({
		title:"数据加载中"
	})
	return uni.request({
		url,
		method:myMethod,
		data
	}).then((res)=>{
		uni.hideLoading()
		return res
	})
}





