
/*******************************************

Utilitys js v2.2

2023.09.17
by pp

*******************************************/

let gTraceFlug = true;

/*------------------------------------
 プラットフォーム判定
------------------------------------*/
const _ua = (function(u){
	return {
		Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
			|| u.indexOf("ipad") != -1
			|| (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
			|| (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
			|| u.indexOf("kindle") != -1
			|| u.indexOf("silk") != -1
			|| u.indexOf("playbook") != -1,
		Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
			|| u.indexOf("iphone") != -1
			|| u.indexOf("ipod") != -1
			|| (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
			|| (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
			|| u.indexOf("blackberry") != -1
	}
})(window.navigator.userAgent.toLowerCase());


/*------------------------------------
 トレース
------------------------------------*/
const trace = (xTxt) =>{
	if(gTraceFlug){
		console.log(xTxt);
		//window.console && console.log(xTxt);
	}
};


/*------------------------------------
 GETパラメータの取得
------------------------------------*/
const getParamArgs = () =>{
	var xResArray = null;
	var xQuery = window.location.search.substring(1);
	var xGetDatas = xQuery.split('&');
	if (xGetDatas.length > 0){
		xResArray = {};
		for (var i=0; i<xGetDatas.length; i++) {
			var xPos = xGetDatas[i].indexOf('=');
			if (xPos > 0) {
				var xKey = xGetDatas[i].substring(0,xPos);
				var xValue = xGetDatas[i].substring(xPos+1);
				xValue = decodeURI(xValue);
				xResArray[xKey] = xValue;
			}
		}
	}
	return xResArray;
};


/*------------------------------------
 スムーススクロール
------------------------------------*/
const paageScroll = (xAncar) =>{
	var xPos;
	var xHeight = $("#header").height();
	if (xAncar == "#top"){
		xPos = 0;
	}else if (xAncar != "#"){
		xPos = $(xAncar).offset().top - xHeight;
	}
	//trace(xPos);
	$('body,html').animate({scrollTop:xPos}, "slow", 'swing');
} 


/*------------------------------------
 イニシャライズ
------------------------------------*/

$(function(){

	if(_ua.Mobile){
		$("html").addClass("sp");
	}else if(_ua.Tablet){
		$("html").addClass("tb");
	}else{
		$("html").addClass("pc");
	}

	$("a[href^='#']").on("click",function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var xAncar = $(this).attr("href");
		paageScroll(xAncar);
	});

	trace("_util.js ver 2.0");

});



$(window).on("resize",()=> {
		//
});

$(window).on("load",() => {
	//
});


