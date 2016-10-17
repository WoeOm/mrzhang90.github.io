/**
 * Created by zhang on 16/6/16.
 */
var Fs=function(){
    this.list_view=$('#list_view');
    this.grid_view=$('#grid-view');
    //this.list_view=$('.list-view')[0];
    this.list_view_item=$('.list-view-item');
    this.grid_view_item=$('.grid-view-item');
    //this.grid_view_width=this.grid_view_item[0].offsetWidth;
    //console.log(this.grid_view_item[0]);
    this.checkbox=$('.checkbox',this.grid_view);
    this.len=this.list_view_item.length;
    this.first_col=$('.first-col');
    //this.check_all=$('#check_all');
    this.check_all=$('.check-icon');
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
    //列表内鼠标单击拖动,画出选框
    var listDiv="",x= 0,y= 0,listDivBool=false;
    Constituency(this.list_view,This.list_view_item);
    Constituency(this.grid_view,This.grid_view_item);
    function Constituency(view,view_item){
        addEvent(view,'mousedown',function(ev){
            listDivBool=true;
            x=ev.clientX;
            y=ev.clientY;
            if(!listDiv){
                listDiv=document.createElement('div');
                listDiv.style.cssText='display:none;position:absolute;z-index:99999;border:solid 1px rgb(19,98,100);opacity:0.5;background-color:rgb(139,191,249);';
                document.body.appendChild(listDiv);
            }
            addEvent(document,'mousemove',function(ev){
                var listArr=[];
                if(listDivBool){
                    var w= 0,h= 0,x1= 0,y1=0;
                    if(x>ev.clientX){//左划
                        w=x-ev.clientX;
                        x1=x-w;
                    }else{//右划
                        w=ev.clientX-x;
                        x1=x;
                    }
                    if(y>ev.clientY){//上划
                        h=y-ev.clientY;
                        y1=y-h;
                    }else{
                        h=ev.clientY-y;
                        y1=y;
                    }
                    listDiv.style.display='block';
                    listDiv.style.width=w+'px';
                    listDiv.style.height=h+'px';
                    listDiv.style.left=x1+'px';
                    listDiv.style.top=y1+'px';
                    for(var i= 0;i<This.len;i++){
                        if(collision(listDiv,view_item[i])){
                            addClass(This.list_view_item[i],'item-active');
                            addClass(This.grid_view_item[i],'item-active');
                            listArr.push(This.list_view_item[i]);
                        }else{
                            removeClass(This.list_view_item[i],'item-active');
                            removeClass(This.grid_view_item[i],'item-active');
                        }
                    }
                    This.isCheckedAll(listArr.length);
                }
            });
            addEvent(document,'mouseup',function(){
                if(listDivBool){
                    listDivBool=false;
                    listDiv.style.display='none';
                }
            });
        });
    }

    //缩略图-鼠标经过样式
    for(var i= 0,len=This.grid_view_item.length;i<len;i++){
        addEvent(This.grid_view_item[i],'mouseover',function(){
            addClass(this,'hover-item');
        })
        addEvent(This.grid_view_item[i],'mouseout',function(){
            removeClass(this,'hover-item');
        })
    }

    //全选-列表和缩略图的全选
    for(var j= 0,len=this.check_all.length;j<len;j++){
        this.check_all[j].zdy=j;
        addEvent(this.check_all[j],'click',function(){
            var num=this.zdy;
            //自定义对象length属性和dd的数量对比,如果相等,说明已经全选
            if(This.len==This.checkedArr['length']){
                removeClass(This.first_col[0],'checked');
                removeClass(This.first_col[1],'checked');
                This.checkedArr={};
                This.checkedArr['length']=0;
                for(var i=0;i<This.len;i++){
                    removeClass(This.list_view_item[i],'item-active');
                    removeClass(This.grid_view_item[i],'item-active');
                }
            }else{
                addClass(This.first_col[0],'checked');
                addClass(This.first_col[1],'checked');
                This.checkedArr['length']=This.len;
                for(var i=0;i<This.len;i++){
                    This.checkedArr[i]=This.list_view_item[i];
                    addClass(This.list_view_item[i],'item-active');
                    addClass(This.grid_view_item[i],'item-active');
                }
            }
            checkedShowDiv(This.checkedArr['length']);
            return false;
        })
    }

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
            Singleclick(This.list_view_item,index);
            for(var j= 0,jlen=This.checkbox.length;j<jlen;j++){
                Singleclick(This.checkbox,index);
            }

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
    //点击选择列表和缩略图
    function Singleclick(viewitem,index){
        addEvent(viewitem[index],'mousedown',function(){
            for(var j= 0,len=This.len;j<len;j++){
                if(j==index){
                    addClass(This.list_view_item[index],'item-active');
                    addClass(This.grid_view_item[index],'item-active');
                }else{
                    removeClass(This.list_view_item[j],'item-active');
                    removeClass(This.grid_view_item[j],'item-active');
                }
            }
            This.isCheckedAll(1);
            //ev.cancelBubble=true;
        });
    }
}
//点击checkbox
Fs.prototype.check_down=function(ev,index){
    if(this.list_view_item[index].className.indexOf('item-active')!=-1){
        delete this.checkedArr[index];
        this.checkedArr['length']--;
        removeClass(this.list_view_item[index],'item-active');
        removeClass(this.grid_view_item[index],'item-active');
    }else{
        this.checkedArr['length']++;
        this.checkedArr[index]=this.list_view_item[index];
        addClass(this.list_view_item[index],'item-active');
        addClass(this.grid_view_item[index],'item-active');
    }
    this.isCheckedAll(this.checkedArr['length']);
    ev.cancelBubble=true;
}
Fs.prototype.isCheckedAll=function(len){
    checkedShowDiv(len);
    //全选
    this.checkedArr['length']=len;
    if(this.len==len){
        this.checkOff=true;
        addClass(this.first_col[0],'checked');
        addClass(this.first_col[1],'checked');
    }else{
        this.checkOff=false;
        removeClass(this.first_col[0],'checked');
        removeClass(this.first_col[1],'checked');
    }
}
Fs.prototype.check_move=Fs.prototype.check_up=function(ev){
    ev.cancelBubble=true;
};
function checkedShowDiv(len){
    var list_header=$('.list-header')[0];
    var list_header_operatearea=$('.list-header-operatearea',list_header)[0];
    var rename=$('#rename');
    var count_tips=$('.count-tips',list_header)[0];
    count_tips.innerHTML='已选中'+len+'个文件/文件夹';
    if(len<1){
        removeClass(list_header,'list-header-operate');
        list_header_operatearea.style.display='none';
    }else{
        if(len==1){
            removeClass(rename,'g-disabled');
        }else{
            addClass(rename,'g-disabled');
        }
        addClass(list_header,'list-header-operate');
        list_header_operatearea.style.display='block';
    }
}