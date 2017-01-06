/**
 * Created by Administrator on 2017/1/3.
 */
verif_screen(function(calback){
    load();
})
function load(){
    var scale=window.devicePixelRatio>1?1/window.devicePixelRatio:1;
    $('meta[name=viewport]').attr('content',"width=device-width,initial-scale="+scale+",minimum-scale="+scale+",maximum-scale="+scale+",user-scalable=no");
    var oHtml=$('html');
    var iWidth=oHtml.width();
    oHtml.css('font-size',iWidth/15);
}
//验证横屏或竖屏,竖屏返回true,横屏返回false
function verif_screen(callback){
    var supportOrientation = (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object');
    var init = function(){
        var orientation='';
        var updateOrientation = function(){
            if(supportOrientation){
                orientation = window.orientation;
                switch(orientation){
                    case 90:
                    case -90:
                        orientation = false;
                        break;
                    default:
                        orientation = true;
                        break;
                }
            }else{
                orientation = (window.innerWidth > window.innerHeight) ? true : false;
            }
            callback(orientation);
        };
        if(supportOrientation){
            window.addEventListener('orientationchange',updateOrientation,false);
        }else{
            //监听resize事件
            window.addEventListener('resize',updateOrientation,false);
        }
        updateOrientation();
    };
    init();
}