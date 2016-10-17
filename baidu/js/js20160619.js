/**
 * Created by zhang on 16/3/25.
 */
/**
 * 查询DOM元素,参数可接受用户传入的ID\Class\TAG标签等元素
 * @param {String} [element]
 * @returns {Element}
 */
var Js=function(element,parent){
    return new Js.fn.init(element,parent);
};
Js.fn=Js.prototype={
    constructor:Js,
    init:function(element,parent){
        this.firstName=element.charAt(0);
        this.result=[];
        this.name='';
        this.parent=parent||document;
        if(this.firstName==='#'){
            this.name=element.substring(1);
            this.result=document.getElementById(this.name);
        }else if(this.firstName==='.'){
            this.name=element.substring(1);
            if(this.parent.getElementsByClassName){
                this.result=this.parent.getElementsByClassName(this.name);
            }else{
                this.allElement=this.parent.getElementsByTagName('*');
                for(var i= 0;i<this.allElement.length;i++){
                    this.arr=this.allElement[i].className.split(' ');
                    for(var j in this.arr){
                        if(this.arr[j]==this.name){
                            this.result.push(this.allElement[i]);
                        }
                    }
                }
            }
        }else{
            this.result=this.parent.getElementsByTagName(element);
        }
        return this.result;
    }
};
/**
 * 正则去首尾空格
 * @param {String} [str]
 * @returns {string}
 */
Js.trim=function(str,type){
    if(typeof str !='string'){
        return '请输入一个字符串';
    }
    var pattern;
    if(type=='left'){
        pattern=/^\s+/g;
    }else if(type=='right'){
        pattern=/\s+$/g;
    }else {
        pattern =/(^\s+)|(\s+)$/g;
    }
    str=str.replace(pattern,'');
    return str;
}
var $=Js;
/*
 * 获取元素的样式
 * element 代表 div之类的元素
 * stylesheet 代表 宽高颜色之类的样式
 * */
function getCss(element,stylesheet){
    var value=0;
    if(stylesheet == "backgroundSize"){
        stylesheet='height';
    }
    //兼容IE
    if(element.currentStyle){
//        if(stylesheet=='float')
//            stylesheet=styleFloat;
        value=element.currentStyle[stylesheet];
    }
    //标准浏览器
    else
        value=getComputedStyle(element)[stylesheet];
    if(stylesheet == "opacity"){
        return Math.round(value*100);
    }
    return value;
}
/**
 * 返回顶部,直接调用函数即可
 */
function backTop() {
    var timer = setInterval(function () {
        var y = window.pageYOffset;
        i++;
        y += (0 - y) / 4;
        if (y == 0) {
            clearInterval(timer);
        }
        window.scrollTo(0, y);
    }, 20);
}
/*
* 用来让position:absolute的元素,在一个容器内水平居中
* arr是一个数组,第一个值是width,第二个元素是border
* 根据公式:(容器总宽度-绝对定位元素的宽度)/2;
* */
function positionCenter(Element,width,arr){
    if(!Element)
        return false;
    var width1=parseInt(arr[0]/2)+parseFloat(arr[1]);
    console.log(parseInt(arr[0]/2));
    if(!width){
        Element.style.left='50%';
        Element.style.marginLeft=-width1+'px';
    }
    else
        Element.style.left=(width-width1)/2+'px';
}
/**
 * 追加className,已经考虑到去重了
 * @param {String} [element]
 * @param {String} [attr]
 */
function addClass(element,attr){
    attr=attr.trim();
    //这里去左右空格,是为了防止用户输入多余空格,影响下边的判断
    var className=element.className.trim();
    //正则里,考虑了2种className,1.class='aa1';2.class='aa2 aa3 aa4 aa5';aa1对应了正则里第一种假设,aa2对应了第二种,aa3对应了第三种,aa5对应了第四种
    //var pattern=new RegExp('^'+attr+'$|^'+attr+' | '+attr+' | '+attr+'$','g');
    var pattern=new RegExp('\\b'+attr+'\\b','g');
    //为false,说明attr不存在className里,那么就添加
    if(!pattern.test(className)){
        element.className=className+' '+attr;
    }
}
/**
 * 删除className
 * @param {String} [element]
 * @param {String} [attr]
 */
function removeClass(element,attr){
    attr=attr.trim();
    if(!element.className||element.className==attr){
        element.className='';
    }else{
        var arr=element.className.split(" ");
        for(var i= 0,len=arr.length;i<len;i++){
            if(arr[i]==attr){
                arr.splice(i,1);
            }
        }
        element.className=arr.join(' ');
    }
}
/**
 * window.onload加载方法的封装
 * @param {Function} [fn]
 */
function addLoadEvent(fn){
    var load=window.onload;
    if(!load){
        window.onload=fn;
    }else{
        window.onload=function(){
            load();
            fn();
        }
    }
}
/**
 * 事件封装
 * @param {Element} [obj]
 * @param {Event} [event]
 * @param {Function} [fn]
 */
function addEvent(obj,event,fn){
    window.removeEventFn=function(){
        fn.call(obj);

    }
    //标准浏览器
    if(obj.addEventListener){
        obj.addEventListener(event,fn);
    }else{
        //IE低版本浏览器
        obj.attachEvent('on'+event,window.removeEventFn12);
    }
}
function removeEvent(obj,event,fn){
    //标准浏览器
    if(obj.removeEventListener){
        obj.removeEventListener(event,fn);
    }else{
        //IE
        obj.detachEvent('on'+event,window.removeEventFn)
    }
}
/**
 * 在target元素后边添加new元素
 * @param {String} [newElemnt]
 * @param {String} [targetELement]
 */
function insertAfter(newElemnt,targetElement){
    var parent=targetElement.parentNode;
    if(parent.lastElementChild==targetElement)
        parent.appendChild(newElemnt);
    else{
        parent.insertBefore(newElemnt,targetElement.nextElementSibling);
    }
}
/**
 * 获取指定字符串有多少字节,1个中文是两个字节
 * @param {String} [str]
 * @returns {number}
 */
function getByteLen(str){
    var tmp=0;
    for(var i=0;i<str.length;i++){
        var s=str.charAt(i);
        if(/[\u4e00-\u9fa5]/.test(s)){
            tmp+=2;
        }else{
            tmp+=1;
        }
    }
    return tmp;
}
/**
 * 判断给定字符串字符串是否数组,如果存在,返回索引;如果不存在,返回-1
 * @param {Array} [arr]
 * @returns {int}
 */
function inArray(arr,value){
    for(var i in arr){
        if(arr[i]==value){
            return i;
        }
    }
    return -1;
}
/**
 * 判断是不是数组
 * @param {Array} [obj]
 * @returns {boolean}
 */
function isArray(obj){
    return Object.prototype.toString.call(obj)=='[object Array]';
}
/**
 * 判断是不是函数
 * @param {Function} [obj]
 * @returns {boolean}
 */
function isFunction(obj){
    return Object.prototype.toString.call(obj)=='[object Function]';
}
function object(o){
    var tmp=function(){};
    tmp.prototype=o;
    return new tmp;
}
/**
 * 确定该属性是不是存在原型中,因为hasOwnProperty属性只有在实例中才会返回true,反之,当返回false,同时in返回true,就可以确定属性是原型中的属性
 * @param object
 * @param name
 * @returns {boolean}
 */
function hasPrototypePropertry(object,name){
    return !object.hasOwnProperty(name) && (name in object);
}
/**
 * 深度克隆,把一个对象克隆给另一个对象
 * @param {Object} [obj] 接收对象
 * @param [Boolean] [bool] 默认或false赋址,true赋值
 * @returns {*}
 */
function objectClone(obj,bool){
    if(typeof bool!='undefined' && !bool){
        return obj;
    }else{
        var o=obj.constructor==Array?[]:{};
        for(var attr in obj){
            if(obj[attr]!=null && typeof obj[attr]=='object'){
                o[attr]=objectClone(obj[attr]);
            }else{
                o[attr]=obj[attr];
            }
        }
        return o;
    }
}
/**
 * 获取浏览器类型和版本号
 * @returns {Array} [0 type,1 version]
 */
function getBorrowType(){
    var agent=window.navigator.userAgent;
    if(agent.indexOf('QQBrowser')!=-1){
        return ['QQ',getVersion('QQBrowser')];
    }
    else if(agent.indexOf('Chrome')!=-1){
        return ['谷歌',getVersion('Chrome')];
    }
    else if(agent.indexOf('Safari')!=-1){
        return ['Safari',getVersion('Safari')];
    }
    else if(agent.indexOf('Firefox')!=-1){
        return ['Firefox',getVersion('Firefox,')];
    }
    else if(agent.indexOf('MSIE 6.0')!=-1){
        return ['IE','MSIE 6.0'];
    }
    function getVersion(str){
        var start=agent.indexOf(str)+1+str.length;
        var end=agent.indexOf(' ',start);
        if(end>1){
            return agent.substring(start,end);
        }
        else{
            return agent.substring(start);
        }

    }
}
/**
 * date时间,传递一个时间戳,如果参数为空,则默认返回当前时间,返回一个年月日时分秒的数组
 * @param {DateTime} [time]
 * @returns {Array}
 */
function getDateTime(time){
    var date=0;
    if(!time){
        date=new Date();
    }else
        date=new Date(time);
    var y=date.getFullYear();
    var m=toDb(date.getMonth()+1);
    var d=toDb(date.getDate());
    var h=toDb(date.getHours());
    var i=toDb(date.getMinutes());
    var s=toDb(date.getSeconds());
    arr=new Array();
    arr['y']=y;
    arr['m']=m;
    arr['d']=d;
    arr['h']=h;
    arr['i']=i;
    arr['s']=s;
    return arr;
    //return formatDate([y,m,d,h,i,s]);
}
/**
 * 时间数组转换成正常时间格式
 * @param arrTime
 * @returns {string}
 */
function formatDate(arrTime){
    var len=arrTime.length;
    var dateArr=['年','月','日','时','分','秒'];
    if(len==4){
        dateArr=['日','时','分','秒'];
    }
    var str='';
    for(var i= 0,len=arrTime.length;i<len;i++){
        str+=arrTime[i]+''+dateArr[i];
    }
    return str;
}
/**
 * 得到两个戳的相差值
 * @param num1
 * @param num2
 * @returns [天,时,分,秒]的数组,否则为false
 */
function differ(num1,num2){
    if(num2>num1){
        var diffNum=(num2-num1)/1000;//相差值得秒数
        var day=parseInt(diffNum/86400);//天数
        var hour=parseInt(diffNum%86400/3600);//小时数
        var min=parseInt(diffNum%3600/60);//分钟
        var sec=parseInt(diffNum%60);//秒
        return [day,hour,min,sec];
        //return formatDate([day,hour,min,sec]);
    }else{
        return false;
    }
}
/**
 * 给日期的个位补0
 * @param date
 * @returns 如果10以内,补一个0,10及以上的数字,改成字符串格式输出
 */
function toDb(date){
    return date<10?'0'+date:''+date;
}
//Tween算法-元素弹性运动
var Tween = {
    linear: function (t, b, c, d){
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
};
//实例:
// var json={
// 'obj':element,
// 'time':500,
// 'target':{'left':0,'top':0,'opacity':100},
// 'type':easeOut,
// 'callback':callback
// };
function mTween(init)
{
    var obj=init['obj'];
    var time=init['time'];
    var target=init['target'];
    var type=init['type'];
    var callback=init['callback'];
    //t次数 , b开始值, c/开始值和目标值之间的差值, d总次数
    var t = 0;
    var b={};
    var c={};
    for(var s in target){
        b[s]=parseFloat(getCss(obj,s));
        c[s]=target[s] - b[s];
    }
//    var b =  parseFloat(getCss(obj,attr));
//    var c =  target - b;
    var d = time / 20;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        t++;
        for(var s in target){
            var tub=Tween[type](t,b[s],c[s],d);
            if(s=='opacity'){
                obj.style[s]=tub/100;
                obj.style.filter='alpha(opacity='+tub+')';
            }else if(s=='backgroundSize'){
                obj.style.backgroundSize='100% '+tub+'px';
            }
            else
                obj.style[s]=tub+'px';
        }
        if(t>d){
            clearInterval(obj.timer);
            //if(callback)
            // callback();
            callback&&callback();
        }
    },20);
}
/**
 * Tween算法-元素弹性运动
 * @param obj,attr,time,target,type,callback,conback
 * @returns 如果10以内,补一个0,10及以上的数字,改成字符串格式输出
 *
 * callback 回调函数,在函数执行完后,调用这个函数
 * conback  并发函数,在函数执行时同步执行这个函数
 * @param obj
 * @param attr
 * @param time
 * @param target
 * @param type
 * @param callback
 * @param conback
 * @returns {string}
 */
function startMove(obj,attr,time,target,type,callback,conback)
{
    //t次数 , b开始值, c/开始值和目标值之间的差值, d总次数
    var t = 0;
    var b =  parseFloat(getCss(obj,attr));
    var c =  target - b;
    var d = time / 20;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        t++;
        var tub=Tween[type](t,b,c,d);
        if(attr=='opacity'){
            obj.style[attr]=tub/100;
            obj.style.filter='alpha(opacity='+tub+')';
        }else if(attr=='backgroundSize'){
            obj.style.backgroundSize='100% '+tub+'px';
        }
        else
            obj.style[attr]=tub+'px';
        conback&&conback();
        if(t>d){
            clearInterval(obj.timer);
            //if(callback)
            // callback();
            callback&&callback();
        }
    },20);
}
/**
 * 碰撞
 */
function getPos(obj){
    var pos = {"left":0,"top":0};
    while(obj){
        pos.left += obj.offsetLeft;
        pos.top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return pos;
};
function collision(obj1,obj2){
    var obj1L = getPos(obj1).left;
    var obj1LW = obj1L + obj1.offsetWidth;
    var obj1T = getPos(obj1).top;
    var obj1TH = obj1T + obj1.offsetHeight;

    var obj2L = getPos(obj2).left;
    var obj2LW = obj2L + obj2.offsetWidth;
    var obj2T = getPos(obj2).top;
    var obj2TH = obj2T + obj2.offsetHeight;

    if( obj1LW < obj2L || obj1L > obj2LW || obj1TH < obj2T || obj1T > obj2TH ){
        return false
    }
    return true;
};
/**
 * 元素拖动,如果只传一个参数,那么就是拖拽这个元素,如果给obj2传值,那么就默认开始了碰撞,当obj和obj2碰撞后,obj2变色
 * @param {Element} [obj]
 * @param {Element} [obj2]
 */
function Drag(obj,obj2){
    var x= 0,y=0;
    addEvent(obj,'mousedown',down);
    function down(ev){
        x=ev.pageX-obj.offsetLeft;
        y=ev.pageY-obj.offsetTop;
        addEvent(document,'mousemove',move);
        addEvent(document,'mouseup',up);
        ev.preventDefault();
    }
    function move(ev){
        var left=ev.pageX-x;
        if(left<=10){
            left=0;
        }else if(left+obj.offsetWidth>=document.documentElement.clientWidth-10){
            left=document.documentElement.clientWidth-obj.offsetWidth;
        }
        var top=ev.pageY-y;
        if(top<=10){
            top=0;
        }
        else if(top+obj.offsetHeight>=document.documentElement.clientHeight-10){
            top=document.documentElement.clientHeight-obj.offsetHeight;
        }
        obj.style.left=left+'px';
        obj.style.top=top+'px';

        //obj2存在,说明开启碰撞测试,那么如果碰撞后,会改变obj2的背景色
        if(obj2){
            if(Bong()){
                obj2.style.background='yellow';
            }else{
                obj2.style.background='blue';
            }
            function Bong(){
                var r=left+obj.offsetWidth;
                var b=top+obj.offsetHeight;

                var l2=obj2.offsetLeft;
                var t2=obj2.offsetTop;
                var r2=l2+obj2.offsetWidth;
                var b2=t2+obj2.offsetHeight;
                if(r<l2||b<t2||left>r2||top>b2){
                    return false;
                }else{
                    return true;
                }
            }
        }
    }
    function up(){
        document.removeEventListener('mousemove',move);
        document.removeEventListener('mouseup',up)
    }
}
/**
 * 鼠标滚动事件封装,回调函数中,传一个值,是上还是向下
 * @param {Element} [obj]
 * @param {Function} [callback]
 */
function scroll(obj,callback){
    var isFF=window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1;
    if(isFF){
        obj.addEventListener('DOMMouseScroll',fn);
    }else{
        obj.addEventListener('mousewheel',fn);
    }
    function fn(ev){
        var isUp=true;
        if(ev.detail){
            isUp=ev.detail<0?true:false;
        }else{
            isUp=ev.wheelDelta>0?true:false;
        }
        typeof callback=='function' && callback(isUp);
    }
}