$(function(){
    //构造九宫格对象
    var Lattic=function(obj){
        this.elem=obj;
        this.arr=[0,1,2,3,4,5,6,7,8];
        this.emptyElem=0;
        this.step=0;
//            this.pic='img/j'+Math.ceil(Math.random()*8)+'.jpg';
        this.pic=Math.ceil(Math.random()*8);
        this.rendering();
        this.next();
    }
    //渲染到li
    Lattic.prototype.rendering=function(){
        var arr=this.arr,len=arr.length,str='';
        for(var i=0;i<len;i++){
            str+='<li style="background:url(img/j'+this.pic+'.jpg);background-position:'+(-i%3*100)+'px '+(-Math.floor(i/3)*100)+'px"><span style="display:none;">'+(i+1)+'</span></li>';
        }
        this.elem.html(str);
        var li=this.elem.find('li');
        arr.sort(function(){
            return Math.random()-0.5;
        })
        for(var i in arr){
            li.eq(arr[i]).attr('index',i).css({
                left:(i%3*100),
                top:(Math.floor(i/3)*100)
            });
            if(i==arr.length-1){
                li.eq(i).css('background','none').html('');
            }
        }
        this.emptyElem=li.eq(arr.length-1).attr('index');
        this.keyEv();
        this.showSerial();
        this.answer();
    }
    //按键事件
    Lattic.prototype.keyEv=function(){
        var _this=this;
        $(document).on('mousedown',function(ev){
            ev.preventDefault();
        })
        touch.on(_this.elem, 'swipeleft', function(){
            if(!$('#lattice li').is(":animated")) {
                _this.left(_this);
            }
        });
        touch.on(_this.elem, 'swiperight', function(){
            if(!$('#lattice li').is(":animated")) {
                _this.right(_this);
            }
        });
        touch.on(_this.elem, 'swipeup', function(){
            if(!$('#lattice li').is(":animated")) {
                _this.up(_this);
            }
        });
        touch.on(_this.elem, 'swipedown', function(){
            if(!$('#lattice li').is(":animated")) {
                _this.down(_this);
            }
        });
        $(document).on('keydown',function(ev){
            if(!$('#lattice li').is(":animated")) {
                switch(ev.keyCode){
                    case 40://down
                        _this.down(_this);
                        break;
                    case 38://up
                        _this.up(_this);
                        break;
                    case 37://left
                        _this.left(_this);
                        break;
                    case 39://right
                        _this.right(_this);
                        break;

                }
            }
        })
    };
    //按键向下
    Lattic.prototype.down=function(_this){
        if(_this.emptyElem>2){
            var tagIndex=parseInt(_this.emptyElem)-3;
            $('#lattice li[index='+tagIndex+']').animate({
                top:'+=100px'
            },{
                duration:100,
                easing:'linear',
                complete:function(){
                    $(this).attr('index',tagIndex+3)
                }
            })
            $('#lattice li[index='+_this.emptyElem+']').animate({
                top:'-=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex)
                    _this.judge(tagIndex)
                }
            })
        }
    }
    //按键向上
    Lattic.prototype.up=function(_this){
        if(_this.emptyElem<6){
            var tagIndex=parseInt(_this.emptyElem)+3;
            $('#lattice li[index='+tagIndex+']').animate({
                top:'-=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex-3)
                }
            })
            $('#lattice li[index='+_this.emptyElem+']').animate({
                top:'+=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex)
                    _this.judge(tagIndex)
                }
            })
        }
    }
    //按键向右
    Lattic.prototype.right=function(_this){
        if(_this.emptyElem % 3 >0){
            var tagIndex=parseInt(_this.emptyElem)-1;
            $('#lattice li[index='+tagIndex+']').animate({
                left:'+=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex+1);
                }
            })
            $('#lattice li[index='+_this.emptyElem+']').animate({
                left:'-=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex);
                    _this.judge(tagIndex)
                }
            })
        }
    }
    //按键向左
    Lattic.prototype.left=function(_this){
        if(_this.emptyElem % 3 <2){
            var tagIndex=parseInt(_this.emptyElem)+1;
            $('#lattice li[index='+tagIndex+']').animate({
                left:'-=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex-1);
                }
            })
            $('#lattice li[index='+_this.emptyElem+']').animate({
                left:'+=100px'
            },{
                duration:100,
                complete:function(){
                    $(this).attr('index',tagIndex);
                    _this.judge(tagIndex)
                }
            })
        }
    }
    //记录步数 判断结果
    Lattic.prototype.judge=function(tagIndex){
        this.emptyElem=tagIndex;
        $('.step').html(++this.step);
        var tmp=[0,1,2,3,4,5,6,7,8],arr_tmp=[];
        this.elem.find('li').each(function(){
            arr_tmp.push(Number($(this).attr('index')))
        })
        if(tmp.toString()==arr_tmp.toString()){
            $('#success').show();
        }
    }
    //显示序号
    Lattic.prototype.showSerial=function(){
        var _this=this,onoff=true;
        $('#showSerial').val('显示序号');
        $('#showSerial').on('click',function(){
            var span=_this.elem.find('span');
            if(onoff){
                this.value='隐藏序号';
                onoff=false;
                span.css('display','inline-block');
            }else{
                this.value='显示序号';
                onoff=true;
                span.css('display','none');
            }
        })
    }
    //显示答案
    Lattic.prototype.answer=function(){
        var _this=this,onoff=true;
        $('#answer').val('显示答案');$('#answerEle').hide();
        $('#answer').on('click',function(){
            if(onoff){
                onoff=false;
                $(this).val('隐藏答案');
                $('#answerEle').show().css('background-image','url(img/j'+_this.pic+'.jpg)');
            }else{
                onoff=true;
                $(this).val('显示答案');
                $('#answerEle').hide();
            }
        })
    }
    //换一个 下一关 重置
    Lattic.prototype.next=function(){
        var _this=this;
        $('.next').click(function(){
//                _this.pic='img/j'+Math.ceil(Math.random()*9)+'.jpg';
            _this.pic=(_this.pic+1)%9;
            $('#success').hide();
            change();
        })
        $('#reset').click(function(){
            change();
        })
        function change(){
            _this.emptyElem=0;
            _this.step=0;
            $('.step').html(_this.step);
            _this.rendering();
        }
    }
    var obj=$('#lattice');
    var l=new Lattic(obj);
})/**
 * Created by zhang on 16/5/29.
 */
