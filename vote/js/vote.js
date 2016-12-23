/**
 * Created by Administrator on 2016/12/8.
 */
var code_val='';
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
function addVote(){
    var isClick=0;
    $('.addVote').click(function(){
        var That=$(this);
        var team=That.index()+1;
        isClick++;
        if(isClick>1){
            return false;
        }else{
            config['url']='/vote/create';
            config['field']['openId']=openId;
            config['field']['team']=team;
            asyn_load(function(data){
                if(data.status==1){
                    var i=That.children('i');
                    i.addClass('toggleOpacity');
                    setTimeout(function(){
                        i.removeClass('toggleOpacity');
                    },2000);
                    var team1=data.data.team1;
                    var team2=data.data.team2;
                    vote_change(team1,team2)
                }else{
                    alert(data.msg);
                }
                $('.addVote').unbind('click').addClass('on');
            },function(){
                // isClick=0;
                // alert('出错了');
                var data={
                    'status':1,
                    'data':{
                        'team1':20,
                        'team2':22
                    },
                    'msg':'ok'
                }
                if(data.status==1){
                    var i=That.children('i');
                    i.addClass('toggleOpacity');
                    setTimeout(function(){
                        i.removeClass('toggleOpacity');
                    },2000);
                    var team1=data.data.team1;
                    var team2=data.data.team2;
                    vote_change(team1,team2)
                }else{
                    alert(data.msg);
                }
                $('.addVote').unbind('click').addClass('on');
            });
        }
    })
    if(isVote=='yes' || !openId){
        $('.addVote').unbind('click').addClass('on');
    }
}
function vote_change(team1,team2){
    var team1_span=$('.addVote').eq(0).children('span');
    var team2_span=$('.addVote').eq(1).children('span');
    team1_span.text(team1);
    team2_span.text(team2);
    var speed_arr=vote_scale(team1,team2);
    var speed_vote=$('.speed_vote').children('div');
    speed_vote.eq(0).css('width',speed_arr[0]+'%');
    speed_vote.eq(1).css('width',speed_arr[1]+'%');
}
function vote_scale(team1,team2){
    var team1=Number(team1);
    var team2=Number(team2);
    var count=team1+team2;
    return [team1/count*100,team2/count*100];
}
function form(){
    var phone=$('#phone');
    var phone_msg=phone.siblings('label');
    var code=$('#code');
    var code_msg=code.siblings('label');
    $('#a_code').click(function(){
        var cur_time=60;
        if(!regPhone(phone.val())){
            phone_msg.text('请输入正确的手机号').show();
            return false;
        }else{
            phone_msg.hide();
            $(this).attr('disabled','disabled').addClass('disable');
            config['field']['phone']=phone.val();
            asyn_load(function(data){
                if(data.status==1){
                    code_val=data.data;
                    // console.log(code_val)
                    code_msg.text(data.msg).show();
                }else{
                    code_msg.text(data.msg).show();
                }
            },function(){
                // code_msg.text('出错了').show();
                var data={
                    'status':1,
                    'data':2586,
                    'msg':'ok'
                }
                if(data.status==1){
                    code_val=data.data;
                    alert(code_val)
                    // console.log(code_val)
                    code_msg.text(data.msg).show();
                }else{
                    code_msg.text(data.msg).show();
                }
            });
            window.sessionStorage.setItem('phone',phone.val());
            var That=$(this);
            var timer=setInterval(function(){
                cur_time--;
                if(cur_time>0){
                    That.val(cur_time+'秒后重新获取');
                }else{
                    clearInterval(timer);
                    That.removeAttr('disabled').val('获取验证码').removeClass('disable');
                }
            },1000);
        }
    });
    $('#btn_submit').on('click',function(){
        $(this).attr('disabled','disabled').addClass('disable');
        var val=window.sessionStorage.getItem('phone');
        if(!(val && val==phone.val())){
            phone_msg.text('请输入正确的手机号').show();
            $(this).removeAttr('disabled').removeClass('disable');
            return false;
        }else{
            phone_msg.hide();
        }
        if(code_val.toString().length!=4 || code_val!=code.val()){
            code_msg.text('请输入正确的验证码').show();
            $(this).removeAttr('disabled').removeClass('disable');
            return false;
        }else{
            code_msg.hide();
        }
        config['url']='sign/create';
        var msg=$(this).siblings('label');
        asyn_load(function(data){
            if(data.status==1){
                alert('签到成功');
            }else{
                msg.text(data.msg).show();
            }
        },function(){
            // msg.text('出错了').show();
            // $(this).removeAttr('disabled').removeClass('disable');
            var data={
                'status':1,
                'msg':'ok'
            }
            if(data.status==1){
                alert('签到成功');
            }else{
                msg.text(data.msg).show();
            }
        });
    })
}
function asyn_load(scuessFn,errorFn){
    // var btn_message=$('.btn_message');
    var arr=[];
    $.ajax({
        url:config['url'],
        type:config['edthod'],
        data:config['field'],
        dataType:'json',
        success:function(data,status,xhr){
            scuessFn(data);
        },
        error:function(data,error,exception){
            // btn_message.text('操作异常，请重新尝试！');
            errorFn();
        }
    });
}
//校验手机号码
function regPhone(value){
    var phoneReg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if(value.length==11 && phoneReg.test(value)){
        return true;
    }else{
        return false;
    }
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