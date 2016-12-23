/**
 * Created by Administrator on 2016/12/5.
 */
function init(){
    var scale=window.devicePixelRatio>1?1/window.devicePixelRatio:1;
    $('meta[name=viewport]').attr('content',"width=device-width,initial-scale="+scale+",minimum-scale="+scale+",maximum-scale="+scale+",user-scalable=no");
    var oHtml=$('html');
    var iWidth=oHtml.width();
    oHtml.css('font-size',iWidth/15);
}
verif_screen(function(calback){
    init();
})
function form(){
    var strReg=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;//验证特殊字符
    var radio=$('label','.sex_div');
    radio.on('click',function(){
        $(this).addClass('on').siblings('label').removeClass('on');
    })
    $('.btn_submit').on('click',function(){
        var uname=$('.username');
        var uname_val=uname.val();
        var name_message=$('.name_message');
        if(uname_val.length>1 && uname_val.length<6 && !(strReg.test(uname_val))){
            name_message.text('');
        }else{
            uname.focus();
            name_message.text('请输入正确的姓名');
            return;
        }
        var sex=$('label.on','.sex_div').children('input');
        var sex_val=sex.val();
        var config={
            'url':'create',
            'method':'post',
            'field':'name='+uname_val+'&sex='+sex_val
        };
        asyn_load(config);
    })
}
function asyn_load(config){
    var btn_message=$('.btn_message');
    var arr=[];
    $.ajax({
        url:config['url'],
        type:config['edthod'],
        data:config['field'],
        dataType:'json',
        success:function(data,status,xhr){
            state_set(data);
            return;

        },
        error:function(xhr,error,exception){
            // btn_message.text('操作异常，请重新尝试！');
            var uname=$('.username');
            var uname_val=uname.val();
            var sex=$('label.on','.sex_div').children('input');
            var sex_val=sex.val();
            var data={
                'status':1,
                'data':{
                    'id':1,
                    'sex':{
                        'value':sex_val
                    },
                    'name':uname_val
                },
                'msg':'ok'
            }
            state_set(data);
            return;
        }
    });
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