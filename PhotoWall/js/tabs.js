/**
 * Created by zhang on 16/6/17.
 */
(function($){
    var $parent='';
    var defaults={
        'header':[1,2,3],
        'content':[11,22,33]
    };
    var settings={};
    function tab(optings){
        $parent=this;
        //var new1=$.extend({},defaults,optings);
        //console.log(new1);
        $.extend(settings,defaults,optings);
        //console.log(settings);
        //return false;
        createHeader();
        createContnt();
        changeTab();
    }
    function createHeader(){
        var str='',cName='';
        var className=settings.className||'';
        $(settings.header).each(function(key,value){
            cName=key==0?'class="active"':'';
            str+='<a href="#" '+cName+'>'+value+'</a>';
        })
        $parent.append('<div class="header '+className+'">'+str+'</div>');
    }
    function createContnt(){
        var str='',cName;
        $(settings.content).each(function(key,value){
            cName=key==0?'class="active"':'';
            str+='<p '+cName+'>'+value+'</p>';
        })
        $parent.append('<div class="content">'+str+'</div>');
    }
    function changeTab(){
        var p=$parent.find('p');
        $parent.find('.header a').click(function(){
            $(this).addClass('active').siblings('a').removeClass('active');
            var index=$(this).index();
            p.eq(index).addClass('active').siblings('p').removeClass('active');
        })
    }
    $.fn.extend({
        tab:tab
    });
})(jQuery);
