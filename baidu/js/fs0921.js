/**
 * Created by zhang on 16/6/16.
 */
var Fs=function(){
    this.list_view=$('#list_view');
    //this.list_view=$('.list-view')[0];
    this.list_view_item=$('.list-view-item');
    this.len=this.list_view_item.length;
    this.first_col=$('.first-col')[0];
    this.check_all=$('#check_all');
    this.dropdownArr=[];
    this.dropOIndex=-1;
    this.checkArr=[];
    this.checkOff=true;
    this.downOff=false;
    this.moveOff=false;
    this.oldIndex=-1;
    this.checkedArr={'length':0};//选中的dd,都存到这里
    this.checkedArr_off=false;//在鼠标按下时,检查数组对象 如果存在,那么就开启开关,这个是在move里用的,因为如果直接在move里拿数组对象判断,不行的,如果开关开启,那么清空
    var This=this;
    //addEvent(this.list_view,'mousedown',function(){
    //    alert(1);
    //});
    addEvent(this.check_all,'click',function(){
        //自定义对象length属性和dd的数量对比,如果相等,说明已经全选
        if(This.len==This.checkedArr['length']){
            removeClass(This.first_col,'checked');
            This.checkedArr={};
            This.checkedArr['length']=0;
            for(var i=0;i<This.len;i++){
                removeClass(This.list_view_item[i],'item-active');
            }
        }else{
            addClass(This.first_col,'checked');
            This.checkedArr['length']=This.len;
            for(var i=0;i<This.len;i++){
                This.checkedArr[i]=This.list_view_item[i];
                addClass(This.list_view_item[i],'item-active');
            }
        }
        return false;
    })
    this.change();
};
Fs.prototype.change=function(){
    var This=this;
    for(var i= 0;i<this.len;i++){
        //这里是dd中移动/复制/重命名div
        this.dropdownArr.push($('.g-dropdown-button',this.list_view_item[i]));
        //这里是dd中每个checkbox
        this.checkArr.push($('.checkbox',this.list_view_item[i]));
        (function(index){
            //点击checkbox,选中响应的dd,支持复选,多选
            addEvent(This.checkArr[index][0],'mousedown',function(ev){
                This.check_down(ev,index);
            });
            addEvent(This.checkArr[index][0],'mousemove',This.check_move);
            addEvent(This.checkArr[index][0],'mouseup',This.check_up);

            //点击dd后,如果存在item-active样式,则清除item-active;else则添加item-active样式
            addEvent(This.list_view_item[i],'mousedown',function(ev){
                This.dd_down(ev,index);
            });
            addEvent(This.list_view_item[i],'mousemove',function(ev){
                This.dd_move(ev,index);
            });
            addEvent(This.list_view_item[i],'mouseup',function(ev){
                //addEvent(document,'mouseup',function(ev){
                This.dd_up(ev,index,this);
            });
            ////鼠标经过dd后,则添加hover-item样式,else则删除hover-item样式
            addEvent(This.list_view_item[index],'mouseover',function(){
                addClass(this,'hover-item');
            })
            addEvent(This.list_view_item[index],'mouseout',function(){
                removeClass(this,'hover-item');
                //删除dd中的移动/复制/重命名div
                removeClass(This.dropdownArr[index][0],'button-open');
            })
        })(i)
    }
}
//点击checkbox
Fs.prototype.check_down=function(ev,index){
    if(this.list_view_item[index].className.indexOf('item-active')!=-1){
        delete this.checkedArr[index];
        this.checkedArr['length']--;
        //console.log(this.checkedArr);
        removeClass(this.list_view_item[index],'item-active');
    }else{
        this.checkedArr['length']++;
        //console.log(this.list_view_item[index]);
        this.checkedArr[index]=this.list_view_item[index];
        //console.log(this.checkedArr);
        addClass(this.list_view_item[index],'item-active');
    }
    this.isCheckedAll();
    ev.cancelBubble=true;
}
Fs.prototype.dd_down=function(ev,index){
    //if(checkedArr.length>0){
    this.checkedArr_off=true;
    //}
    if(this.list_view_item[index].className.indexOf('item-active')==-1) {//不存在
        //empty_checkArr();
        this.downOff=true;
    }
    ev.cancelBubble=true;
}
Fs.prototype.dd_move=function(ev,index){
    //console.log("ddmove"+index+' dodnOff:'+this.downOff);
    if(this.downOff){
        if(this.checkedArr_off){
            this.checkedArr_off=false;
            if(this.checkedArr.length>0){
                for(var i in this.checkedArr){//如果开关开启,那么清空
                    removeClass(this.list_view_item[i],'item-active');
                }
            }
            this.empty_checkArr();
        }
        if(this.oldIndex!=index){
            //console.log(checkedArr)
            //console.log(oldIndex+'=='+index);
            addClass(this.list_view_item[index],'item-active');
            this.oldIndex=index;
            this.checkedArr.length++;
            this.checkedArr[index] = this.list_view_item[index];
            this.isCheckedAll();
            this.moveOff=true;
        }
    }
    ev.cancelBubble=true;
}
//通过移动开关判断,如果不是移动,那么就是点击;
Fs.prototype.dd_up=function(ev,index,_this){
    if(this.moveOff){//
        this.oldIndex=-1;
        //console.log('是移动');
        //console.log(checkedArr);
    }else{//如果是点击,那么清空其他,选择当前,同时改变数组length为1
        //console.log('是点击');
        //console.log(checkedArr);
        if(_this.className.indexOf('item-active')==-1 || this.checkedArr.length<=0){//不存在
            addClass(_this,'item-active');
        }
        if(this.checkedArr.length>0){
            for(var i in this.checkedArr){
                if(this.checkedArr[i] != _this){
                    removeClass(this.checkedArr[i],'item-active');
                }
            }
        }
        this.format_checkArr(index,_this);
    }
    this.downOff=false;
    this.moveOff=false;
    ev.cancelBubble=true;
}
Fs.prototype.format_checkArr=function(key,value){
    this.checkedArr={};
    this.checkedArr[key]=value;
    this.checkedArr['length']=1;
    //console.log(checkedArr);
    this.isCheckedAll();
}
Fs.prototype.empty_checkArr=function(){
    this.checkedArr={};
    this.checkedArr['length']=0;
}
Fs.prototype.isCheckedAll=function(){
    //全选
    //console.log(checkedArr['length']);
    //if(len==checkedArr['length']){
    //        checkOff=true;
    //        addClass(first_col,'checked');
    //}else if(checkOff){
    //    checkOff=false;
    //    removeClass(first_col,'checked');
    //}
    if(this.len==this.checkedArr['length']){
        this.checkOff=true;
        addClass(this.first_col,'checked');
    }else{
        this.checkOff=false;
        removeClass(this.first_col,'checked');
    }
    //console.log(len+'=='+checkedArr['length']);
    //console.log(checkedArr);
}
Fs.prototype.check_move=Fs.prototype.check_up=function(ev){
    ev.cancelBubble=true;
}
Fs.prototype.change_active=function(ev){
    //if(this.className.indexOf('item-active')!=-1){
    //    if(dropOIndex!=index){
    //        removeClass(this,'item-active');
    //    }
    //}else{
    //    checkedArr={};//因为是单选,所以先清空选中的数组内容
    //    checkedArr['length']=1;
    //    checkedArr[index]=list_view_item[index];
    //    dropOIndex>=0 && removeClass(list_view_item[dropOIndex],'item-active');
    //    addClass(this,'item-active');
    //    dropOIndex=index;
    //}
    var _this=this;
    if(this.className.indexOf('item-active')==-1 || checkedArr.length<=0){//不存在
        addClass(_this,'item-active');
    }
    if(checkedArr.length>0){
        for(var i in checkedArr){
            if(checkedArr[i] != _this){
                removeClass(checkedArr[i],'item-active');
            }
        }
    }
    //format_checkArr(index,_this);
    ev.cancelBubble=true;
}