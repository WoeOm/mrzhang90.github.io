$(document).ready(function(e){
	var opt	=	{
	"speed"	:	",normal"		,	//变换速度,三速度可选 slow,normal,fast;
	"by"	:	"mouseover"		,	//触发事件,click或者mouseover;
	"auto"	:	false		,	//是否自动播放;
	"sec"	:	3000	 		//自动播放间隔;
	};
	$("#demo").IMGDEMO(opt);    
});

var mySwiper1 = new Swiper('.swiper1',{
	pagination: '.pag1',
	paginationClickable: true,
	autoplay:3000,
	autoplayDisableOnInteraction : false,
})

var mySwiper2 = new Swiper('.ryUl',{
	pagination: '.pag2',
	paginationClickable: true,
	slidesPerView: 5,
	loop: true,
})
$('.button-prev').on('click', function(e){
    e.preventDefault()
    mySwiper2.swipePrev()
  })
  $('.button-next').on('click', function(e){
    e.preventDefault()
    mySwiper2.swipeNext()
  })
/*五大核心功能js*/
var _index7=0;
$("#dList li").mouseover(function(){
	_index7=$(this).index();
	$(this).stop().animate({width:400},500).siblings("li").stop().animate({width:200},500);
});

/*案例切换效果*/
$("#nList a").each(function(index) {
    $(this).hover(function(){
		$(this).addClass("lin").siblings().removeClass("lin");
		$("#aList ul").eq(index).css("display","block").siblings().css("display","none");
	})
});

/*微商资讯js*/
$("#zxNav li").each(function(index) {
    $(this).hover(function(){
		$(this).addClass("lin").siblings().removeClass("lin");
		$(".zxList").eq(index).css("display","block").siblings().css("display","none");	
	})
});

