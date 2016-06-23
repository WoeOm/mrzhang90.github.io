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

    var list_view_item=$('.list-view-item'),dropdownArr=[],dropOIndex=0,checkArr=[],checkOIndex=0;
    for(var i= 0,len=list_view_item.length;i<len;i++){
        dropdownArr.push($('.g-dropdown-button',list_view_item[i]));
        checkArr.push($('.checkbox',list_view_item[i]));
        (function(index){
            addEvent(checkArr[index][0],'click',check_list);
            function check_list(ev){
                console.log(1);
                if(list_view_item[index].className.indexOf('item-active')!=-1){
                    removeClass(list_view_item[index],'item-active');
                }else{
                    removeClass(list_view_item[checkOIndex],'item-active');
                    addClass(list_view_item[index],'item-active');
                    checkOIndex=index;
                }
                removeClass(list_view_item[index],'hover-item');
                ev.preventDefault();
                return false;
            }
            //点击dd后,如果存在item-active样式,则清除item-active;else则添加item-active样式
            addEvent(list_view_item[index],'click',change_active);
            function change_active(ev){
                console.log(2);
                if(this.className.indexOf('item-active')!=-1){
                    if(dropOIndex!=index)
                        removeClass(this,'item-active');
                }else{
                    removeClass(list_view_item[dropOIndex],'item-active');
                    addClass(this,'item-active');
                    dropOIndex=index;
                }
                removeClass(this,'hover-item');
                ev.preventDefault();
                return false;
            }
            //鼠标经过dd后,则添加hover-item样式,else则删除hover-item样式
            addEvent(list_view_item[index],'mouseover',function(){
                addClass(this,'hover-item');

            })
            addEvent(list_view_item[index],'mouseout',function(){
                removeClass(this,'hover-item');
                removeClass(dropdownArr[index][0],'button-open');
            })
        })(i)
    }
}