/**
 * Created by zhang on 16/6/8.
 */
//头
function header(){
    var skyDrive=$('#skyDrive');
    var content=$('.content',skyDrive)[0];
    skyDrive.onmouseover=function(){
        addClass(this,'hover');
        content.style.display='block';
    }
    skyDrive.onmouseout=function(){
        removeClass(this,'hover');
        content.style.display='none';
    }

    var form_search=$('#form_search');
    var input_search=$('.search-query',form_search)[0];
    var default_search=$('.input-placeholder',form_search)[0];
    var clear_search=$('.input-clear',form_search)[0];
    default_search.onclick=input_search.onfocus=function(){
        input_search.focus();
        default_search.style.display='none';
    }
    input_search.onkeyup=function(){
        if(input_search.value.length>0){
            clear_search.style.display='block';
        }else{
            clear_search.style.display='none';
        }
    }
    clear_search.onclick=function(){
        input_search.value='';
        default_search.style.display='block';
        clear_search.style.display='none';
    }
    input_search.onblur=function(){
        if(input_search.value.length<=0){
            clear_search.style.display='none';
            default_search.style.display='block';
        }
    }

    var menu_name=$('#menu-name');
    head_down(menu_name);
    var info_more=$('#info-more');
    head_down(info_more);
    function head_down(obj){
        var user_info=$('.user-info',obj)[0];
        obj.onmouseover=function(){
            user_info.style.display='block';
        }
        obj.onmouseout=function(){
            user_info.style.display='none';
        }
    }

    var sidebarUlJs=$('.sidebarUlJs');
    for(var s= 0,slen=sidebarUlJs.length;s<slen;s++){
        var sa=$('a',sidebarUlJs[s]),sa_old=0;
        for(var i= 0,len=sa.length;i<len;i++){
            sa[i].onmouseover=function(){
                sa_old?removeClass(sa_old,'hover'):'';
                addClass(this,'hover');
                sa_old=this;
            }
            sa[i].onmouseout=function(){
                sa_old?removeClass(sa_old,'hover'):'';
                sa_old=0;
            }
        }
    }

    var side_lmore=$('#side-lmore');
    var side_option_panel=$('#side-option-panel');
    side_option_panel.onmouseover=side_lmore.onmouseover=function(){
        side_option_panel.style.display='block';
        setTimeout(function(){
            side_option_panel.onmouseout=side_lmore.onmouseout=function(){
                side_option_panel.style.display='none';
            }
        },100)
    }
    var oWidth=window.innerWidth;
    var search=$('#search');
    var sidebar_position=$('#sidebar_position');
    var absolute_container=$('#absolute-container');
    var module_list_view=$('.module-list-view')[0];//获取右侧内容的高度
    var module_list=$('.module-list')[0];//获取右侧内容以及上边的横向条 的高度
    changeSize();
    window.onresize=changeSize;
    function changeSize(){
        var oHeight=window.innerHeight-173;
        module_list_view.style.height=oHeight+'px';//配置内容的高度
        module_list.style.height=oHeight+73+'px';//配置右侧内容以及上边的横向条 的高度
        oWidth=window.innerWidth;
        if(oWidth<=1092){
            search.style.display='none';
        }

        if(sidebar_position.offsetHeight>=753){
            absolute_container.style.cssText='top:auto;bottom:0px;';
        }else{
            absolute_container.style.cssText='top:460px;bottom:auto;';
        }
    }

    var g_dropdown_button=$('.g-dropdown-button');
    for(var i= 0,len=g_dropdown_button.length;i<len;i++){
        if(g_dropdown_button[i].getAttribute('data-target')=='click'){
            g_dropdown_button[i].onclick=function(){
                if(this.className.indexOf('button-open')!=-1){
                    removeClass(this,'button-open');
                }else{
                    addClass(this,'button-open');
                }
            }
        }else{
            g_dropdown_button[i].onmouseover=function(){
                addClass(this,'button-open');
            }
            g_dropdown_button[i].onmouseout=function(){
                removeClass(this,'button-open');
            }
        }
    }
    var list_grid_js=$('#list_grid_js');
    var list_grid=$('a',list_grid_js);
    list_grid[0].onclick=function(){
        list_grid_js.className='list-grid-switch list-switched-on';
    }
    list_grid[1].onclick=function(){
        list_grid_js.className='list-grid-switch grid-switched-on';
    }

    var list_view=$('.list-view')[0],list_view_item=$('.list-view-item'),len=list_view_item.length,first_col=$('.first-col')[0],check_all=$('#check_all'),dropdownArr=[],dropOIndex=-1,checkArr=[],checkOff=true,downOff=false,moveOff=false,oldIndex=-1;
    var checkedArr={'length':0};//选中的dd,都存到这里
    addEvent(check_all,'click',function(){
        //自定义对象length属性和dd的数量对比,如果相等,说明已经全选
        if(len==checkedArr['length']){
            removeClass(first_col,'checked');
            checkedArr={};
            checkedArr['length']=0;
            for(var i=0;i<len;i++){
                removeClass(list_view_item[i],'item-active');
            }
        }else{
            addClass(first_col,'checked');
            checkedArr['length']=len;
            for(var i=0;i<len;i++){
                checkedArr[i]=list_view_item[i];
                addClass(list_view_item[i],'item-active');
            }
        }
    })
    for(var i= 0;i<len;i++){
        //这里是dd中移动/复制/重命名div
        dropdownArr.push($('.g-dropdown-button',list_view_item[i]));
        //这里是dd中每个checkbox
        checkArr.push($('.checkbox',list_view_item[i]));
        (function(index){
            //点击checkbox,选中响应的dd,支持复选,多选
            addEvent(checkArr[index][0],'mousedown',check_down);
            addEvent(checkArr[index][0],'mousemove',check_move);
            addEvent(checkArr[index][0],'mouseup',check_up);
            //点击dd后,如果存在item-active样式,则清除item-active;else则添加item-active样式
            //addEvent(list_view_item[index],'mousedown',change_active);
            //addEvent(list_view_item[index],'mousemove',check_move);
            //addEvent(list_view_item[index],'mouseup',check_up);
            addEvent(list_view_item[i],'mousedown',dd_down);
            addEvent(list_view_item[i],'mousemove',dd_move);
            addEvent(list_view_item[i],'mouseup',dd_up);
            //点击checkbox
            function check_down(ev){
                if(list_view_item[index].className.indexOf('item-active')!=-1){
                    delete checkedArr[index];
                    checkedArr['length']--;
                    console.log(checkedArr);
                    removeClass(list_view_item[index],'item-active');
                }else{
                    checkedArr['length']++;
                    console.log(list_view_item[index]);
                    checkedArr[index]=list_view_item[index];
                    console.log(checkedArr);
                    addClass(list_view_item[index],'item-active');
                }
                isCheckedAll();
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
    function format_checkArr(key,value){
        checkedArr={};
        checkedArr[key]=value;
        checkedArr['length']=1;
        //console.log(checkedArr);
        isCheckedAll();
    }
    function empty_checkArr(){
        checkedArr={};
        checkedArr['length']=0;
    }
    function isCheckedAll(){
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
    function check_move(ev){
        ev.cancelBubble=true;
    }
    function check_up(ev){
        ev.cancelBubble=true;
    }
}