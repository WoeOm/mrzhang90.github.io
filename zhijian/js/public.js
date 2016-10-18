/**
 * Created by zhang on 16/7/7.
 */
/*配置布局视口*/
var i=0;
i=window.devicePixelRatio>1?1/devicePixelRatio:1;
document.write('<meta name="viewport" content="width=device-width,initial-scale='+i+',minimum-scale='+i+',maximum-scale='+i+'">');

/*定义页面*/
window.addEventListener('resize',load_size);
window.addEventListener('load',load_size);
function load_size(){
    var ohtml=document.getElementsByTagName('html')[0];
    var iWidth=ohtml.getBoundingClientRect().width;
    //var iWidth=window.innerWidth;
    ohtml.style.fontSize=iWidth/15+'px';
}