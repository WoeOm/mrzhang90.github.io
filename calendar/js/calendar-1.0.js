/**
 * Created by zhang on 16/6/19.
 */
//var sFtv = new Array("0101*元旦","0214 情人节","0308 妇女节","0309 偶今天又长一岁拉","0312 植树节","0315 消费者权益日","0401 愚人节","0418 MM的生日","0501 劳动节","0504 青年节","0512 护士节","0601 儿童节","0701 建党节 香港回归纪念","0801 建军节","0808 父亲节","0909 毛席逝世纪念","0910 教师节","0928 孔子诞辰","1001*国庆节",
//"1006 老人节","1024 联合国日","1112 孙中山诞辰","1220 澳门回归纪念","1225 圣诞节","1226 毛席诞辰")
(function($){
    var calendar_box=$('#calendar_box');
    function canendar(json){
        var elem=json.elem||"body";
        //var event=json.event || 'focus';
        //
        //var eOffset=$(elem).offset();
        //var eHeight=$(elem).height();
        //calendar_box.css({
        //    left:eOffset.left,
        //    top:eOffset.top+eHeight
        //});
        $(elem)[event](function(){
            console.log(this);
            //事件监听
        })
    }
    $.extend({
        canendar:canendar
    })
})(jQuery);
var canendar=$.canendar();