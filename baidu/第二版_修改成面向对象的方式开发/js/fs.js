/**
 * Created by zhang on 16/6/16.
 */
var fs=function(){
    this.list_view=$('.list-view')[0];
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
    addEvent(this.check_all,'click',function(){
        //自定义对象length属性和dd的数量对比,如果相等,说明已经全选
        if(this.len==this.checkedArr['length']){
            removeClass(this.first_col,'checked');
            this.checkedArr={};
            this.checkedArr['length']=0;
            for(var i=0;i<this.len;i++){
                removeClass(this.list_view_item[i],'item-active');
            }
        }else{
            addClass(this.first_col,'checked');
            this.checkedArr['length']=this.len;
            for(var i=0;i<this.len;i++){
                this.checkedArr[i]=this.list_view_item[i];
                addClass(this.list_view_item[i],'item-active');
            }
        }
    })
};
fs.prototype.change=function(){
    for(var i= 0;i<this.len;i++){
        //这里是dd中移动/复制/重命名div
        this.dropdownArr.push($('.g-dropdown-button',this.list_view_item[i]));
        //这里是dd中每个checkbox
        this.checkArr.push($('.checkbox',this.list_view_item[i]));
        (function(index){
            //点击checkbox,选中响应的dd,支持复选,多选
            addEvent(this.checkArr[index][0],'mousedown',this.check_down);
            addEvent(this.checkArr[index][0],'mousemove',check_move);
            addEvent(this.checkArr[index][0],'mouseup',check_up);
            //点击dd后,如果存在item-active样式,则清除item-active;else则添加item-active样式
            addEvent(list_view_item[i],'mousedown',dd_down);
            addEvent(list_view_item[i],'mousemove',dd_move);
            addEvent(list_view_item[i],'mouseup',dd_up);
            //点击checkbox
            function check_down(ev){
                if(this.list_view_item[index].className.indexOf('item-active')!=-1){
                    delete this.checkedArr[index];
                    this.checkedArr['length']--;
                    console.log(this.checkedArr);
                    removeClass(this.list_view_item[index],'item-active');
                }else{
                    this.checkedArr['length']++;
                    console.log(this.list_view_item[index]);
                    this.checkedArr[index]=this.list_view_item[index];
                    console.log(this.checkedArr);
                    addClass(this.list_view_item[index],'item-active');
                }
                this.isCheckedAll();
                ev.cancelBubble=true;
            }
            var checkedArr_off=false;//在鼠标按下时,检查数组对象 如果存在,那么就开启开关,这个是在move里用的,因为如果直接在move里拿数组对象判断,不行的,如果开关开启,那么清空
            function dd_down(ev){
                //if(checkedArr.length>0){
                checkedArr_off=true;
                //}
                if(list_view_item[index].className.indexOf('item-active')==-1) {//不存在
                    //empty_checkArr();
                    downOff=true;
                }
                ev.cancelBubble=true;
            }
            function dd_move(ev){
                if(downOff){
                    if(checkedArr_off){
                        checkedArr_off=false;
                        if(checkedArr.length>0){
                            for(var i in checkedArr){//如果开关开启,那么清空
                                removeClass(list_view_item[i],'item-active');
                            }
                        }
                        empty_checkArr();
                        console.log(1)
                    }
                    if(oldIndex!=index){
                        console.log(checkedArr)
                        //console.log(oldIndex+'=='+index);
                        addClass(list_view_item[index],'item-active');
                        oldIndex=index;
                        checkedArr.length++;
                        checkedArr[index] = list_view_item[index];
                        isCheckedAll();
                        moveOff=true;
                    }
                }
                ev.cancelBubble=true;
            }
            //通过移动开关判断,如果不是移动,那么就是点击;
            function dd_up(ev){
                if(moveOff){//
                    oldIndex=-1;
                    //console.log('是移动');
                    //console.log(checkedArr);
                }else{//如果是点击,那么清空其他,选择当前,同时改变数组length为1
                    //console.log('是点击');
                    //console.log(checkedArr);
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
                    format_checkArr(index,_this);
                }
                downOff=false;
                moveOff=false;
                ev.cancelBubble=true;
            }
            function change_active(ev){
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
            //鼠标经过dd后,则添加hover-item样式,else则删除hover-item样式
            addEvent(list_view_item[index],'mouseover',function(){
                addClass(this,'hover-item');

            })
            addEvent(list_view_item[index],'mouseout',function(){
                removeClass(this,'hover-item');
                //删除dd中的移动/复制/重命名div
                removeClass(dropdownArr[index][0],'button-open');
            })
        })(i)
    }
}
fs.prototype.format_checkArr=function(key,value){
    checkedArr={};
    checkedArr[key]=value;
    checkedArr['length']=1;
    //console.log(checkedArr);
    isCheckedAll();
}
fs.prototype.empty_checkArr(){
    checkedArr={};
    checkedArr['length']=0;
}
fs.prototype.isCheckedAll=function(){
    //全选
    //console.log(checkedArr['length']);
    //if(len==checkedArr['length']){
    //        checkOff=true;
    //        addClass(first_col,'checked');
    //}else if(checkOff){
    //    checkOff=false;
    //    removeClass(first_col,'checked');
    //}
    if(len==checkedArr['length']){
        checkOff=true;
        addClass(first_col,'checked');
    }else{
        checkOff=false;
        removeClass(first_col,'checked');
    }
    //console.log(len+'=='+checkedArr['length']);
    //console.log(checkedArr);
}
fs.prototype.check_move=function(ev){
    ev.cancelBubble=true;
}
fs.prototype.check_up=function(ev){
    ev.cancelBubble=true;
}