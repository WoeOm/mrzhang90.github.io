var is_trunPage = true;
var is_bottom=false;
var height = 0;
var ul_load = $('#ul-load');
ul_load.after('<p id="p-load" style="display:none;text-align:center;line-height:2rem;">商品加载中…</p>');
var load_message = $('#p-load');
var load_height = load_message.height() * 2;
var sort_div = $('.sort_div');
//滑动加载数据
$(window).on('scroll', function () {
    var bottom = $(this).scrollTop();
    if (bottom + load_height >= height && is_trunPage && !is_bottom) {//asyn start
        is_trunPage = false;
        config_head['field']['pageNo'] = config_head['field']['pageNo'] + 1;
        asyn_load();
    }
});
$(window).resize(init);
function load() {
    init();
    head_nav();
    list_load();
    asyn_load();
}
function init(){
    var scale = window.devicePixelRatio;
    scale = scale > 1 ? 1 / scale : 1;
    $('meta[name=viewport]').attr('content', "width=device-width,initial-scale=" + scale + ",minimum-scale=" + scale + ",maximum-scale=" + scale + ",user-scalable=no");

    var ohtml = $("html");
    var iWidth = ohtml.width();
    ohtml.css("font-size", iWidth / 15 + 'px');
}
function list_load(){
    var ul=$('#list_type');
    var arr=[];
    arr.push(['<li><a href="javascript:void(0)" data-name="classificationId" data-value="">全部</a></li>']);
    for(var i=0,len=arr_list.length;i<len;i++){
        arr.push(['<li><a href="javascript:void(0)" data-name="classificationId" data-value="'+arr_list[i]["id"]+'">'+arr_list[i]["name"]+'</a></li>']);
    }
    ul.html(arr.join(''));
}
function head_nav() {
    var sort = $('#a-sort');
    var sort_i = sort.children('i');
    var sort_ul = sort.siblings('ul');
    sort_div.height($(window).height());
    sort.on('touchstart', function (ev) {
        type_hide();
        if (sort_hide()) {
            sort_show();
        }
        a_head_click($(this).siblings('ul'), $(this));
        ev.stopPropagation();
    })

    var type = $('#a-type');
    var type_i = type.children('i');
    var type_info = $('.type_info');
    var isMove = false;
    type.on('touchstart', function (ev) {
        sort_hide();
        if (type_hide()) {
            type_show();
        }
        type_info.on('touchmove', function (ev) {
            isMove = true;
        })
        a_head_click($(this).siblings('.type_info'), $(this));
        ev.stopPropagation();
        return false;
    })
    sort_div.on('touchstart', function (ev) {
        sort_hide();
        type_hide();
        ev.preventDefault();
    });

    a_head_click($('.promote'));
    function a_head_click(parents, siblings) {
        var a_head = siblings ? $('a', parents) : parents;
        a_head.on('touchstart', function () {
            isMove = false;
        })
        a_head.on('touchend', function () {
            if (isMove) {
                return false;
            }
            if (!siblings) {
                sort_hide();
                type_hide();
            }
            var name = $(this).attr('data-name');
            var value = $(this).attr('data-value');
            if (name && !$(this).hasClass('on') && is_trunPage) {
                sort_div.hide();
                // $('.on', '.head').removeClass('on');
                if (siblings) {
                    sort_i.removeClass('active');
                    type_i.removeClass('active');
                    var text_sib=siblings.children('span');
                    if($(this).text()=='全部'){
                        text_sib.text('分类');
                    }else{
                        text_sib.text($(this).text());
                    }
                    parents.hide();
                    siblings.addClass('on');
                    a_head.removeClass('on');
                }
                if(name=='classificationId'){//分类
                    delete config_head['field']["recommend"];
                    $('.promote').removeClass('on');
                }
                if(name=='recommend'){//精品推荐
                    delete config_head['field']["classificationId"];
                    type.children('span').text('分类');
                    type.removeClass('on');
                    type_info.find('.on').removeClass('on');
                }
                $(this).addClass('on');
                ul_load.html('');
                is_trunPage = false;
                config_head['field'][name] = value;
                config_head['field']['pageNo'] = 1;
                is_bottom=false;
                asyn_load();
            }
        })
    }

    function sort_hide() {
        if (!sort_ul.is(':hidden')) {
            sort_i.removeClass('active');
            sort_ul.hide();
            sort_div.hide();
            return false;
        }
        return true;
    }

    function sort_show() {
        sort_i.addClass('active');
        sort_ul.show();
        sort_div.show();
    }

    function type_hide() {
        if (!type_info.is(':hidden')) {
            type_i.removeClass('active');
            type_info.hide();
            sort_div.hide();
            return false;
        }
        return true;
    }

    function type_show() {
        type_i.addClass('active');
        type_info.show();
        sort_div.show();
    }
}
function asyn_load() {
    load_message.show();
    var arr = [];
    $.ajax({
        url: config_head['url'],
        type: config_head['method'],
        data: config_head['field'],
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data.status == 1 && data.data.dataList.length > 0) {
                $.each(data.data.dataList, function (index, value) {
                    var span = '';
                    for (var i = 0, len = value['name'].length; i < len; i++) {
                        span += '<span>' + value['name'][i] + '</span>';
                    }
                    var str = '<li><a href="' + value['url'] + '">' +
                        '<div class="no_goods"><img src="' + value['image'] + '" alt=""></div>' +
                        '<h2>' + value['name'] + '</h2>' +
                        '<span class="price"><i>¥</i>' + value['price'] + '</span><div class="label">' +
                        // span+
                        '</div></a></li>';
                    arr.push(str);
                });
                load_message.hide();
                ul_load.append(arr.join(''));
                height = $(document).height() - $(window).height();
            } else{
                is_bottom=true;
                console.log(data.msg);
                load_message.html('没有了');
            }
            is_trunPage = true;
        },
        error: function (xhr, error, exception) {
            // load_message.html('出错了');
            var data='';
            if(config_head['field'].pageNo==3){
                data={"status":1,"code":1,"msg":"ok","data":{"pageSize":10,"total":0,"pageNo":3,"dataList":[]}};
            }else{
                var data={"status":1,"code":1,"msg":"ok","data":{"pageSize":10,"total":0,"pageNo":1,"dataList":[{"price":4,"priceOriginal":5,"selfGoods":{"value":1,"desc":"自营商品"},"name":"沙发沙发舒服","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.hao123.com","id":"ABq2384d"},{"price":55,"priceOriginal":44,"selfGoods":{"value":1,"desc":"自营商品"},"name":"发顺丰14","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.sohu.com","id":"DKD2"},{"price":199,"priceOriginal":259,"selfGoods":{"value":1,"desc":"自营商品"},"name":"测试商品","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.baidu.com","id":"CE2D9992"},{"price":55,"priceOriginal":77,"selfGoods":{"value":2,"desc":"非自营商品"},"name":"df","platform":{"value":2,"desc":"淘宝"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.baidu.com","id":"ABq2DKD2"},{"price":88,"priceOriginal":99,"selfGoods":{"value":1,"desc":"自营商品"},"name":"发到付","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.163.com","id":"ABq2zdkd"},{"price":78,"priceOriginal":99,"selfGoods":{"value":2,"desc":"非自营商品"},"name":"qwer","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.baidu.com","id":"ABq29992"},{"price":555,"priceOriginal":66,"selfGoods":{"value":1,"desc":"自营商品"},"name":"新的商品","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.baidu.com","id":"CE2DABq2"},{"price":34.5,"priceOriginal":0,"selfGoods":{"value":1,"desc":"自营商品"},"name":"sdfasdf","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://wwwbaidu.com","id":"ABq2dk23"},{"price":435,"priceOriginal":44,"selfGoods":{"value":1,"desc":"自营商品"},"name":"爱沙发沙发舒服","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":1,"desc":"推荐"},"url":"http://www.hao123.com","id":"ABq23132"},{"price":33,"priceOriginal":66,"selfGoods":{"value":1,"desc":"自营商品"},"name":"df","platform":{"value":1,"desc":"京东"},"image":"https://img10.360buyimg.com/n1/jfs/t2107/238/2911258703/101300/a68072aa/5721bf6cN60c3fca7.jpg","recommend":{"value":2,"desc":"不推荐"},"url":"http://www.baidu.com","id":"ABq2ABq2"}]}};
            }
            if (data.status == 1 && data.data.dataList.length > 0) {
                $.each(data.data.dataList, function (index, value) {
                    var span = '';
                    for (var i = 0, len = value['name'].length; i < len; i++) {
                        span += '<span>' + value['name'][i] + '</span>';
                    }
                    var str = '<li><a href="' + value['url'] + '">' +
                        '<div class="no_goods"><img src="' + value['image'] + '" alt=""></div>' +
                        '<h2>' + value['name'] + '</h2>' +
                        '<span class="price"><i>¥</i>' + value['price'] + '</span><div class="label">' +
                        // span+
                        '</div></a></li>';
                    arr.push(str);
                });
                load_message.hide();
                ul_load.append(arr.join(''));
                height = $(document).height() - $(window).height();
            } else{
                is_bottom=true;
                console.log(data.msg);
                load_message.html('没有了');
            }
            is_trunPage = true;
        }
    });
}

function selectType(config, type) {
    config['field']['type'] = type;
    asyn_load(config);
}

//info head 轮播图
function carousel_pic() {
    var now = 0, zIndex = 0;
    var li = $('li', '#carousel');
    var span = $('span', '#carousel');
    var length = li.length;
    var speed = '0.4s';
    li.swipe(
        {
            swipe: function (event, direction, distance, duration, fingerCount) {
                if (direction == "left") {//next
                    var next = now + 1;
                    if (next > length - 1) {
                        next = 0;
                    }
                    li.eq(next).css({'transition': '0s'}).attr('class', '');
                    setTimeout(
                        function () {
                            li.eq(next).css({'transition': speed}).attr('class', 'pageNext');
                            li.eq(now).css({'transition': speed}).attr('class', 'pageNow');
                            span.eq(next).addClass('on');
                            span.eq(now).removeClass('on');
                            now = next;
                        }, 30
                    );
                } else if (direction == "right") {//up
                    var next = now - 1;
                    if (next < 0) {
                        next = length - 1;
                    }
                    li.eq(next).css({'transition': '0s'}).attr('class', 'pageNow');
                    setTimeout(
                        function () {
                            li.eq(next).css({'transition': speed}).attr('class', 'pageNext');
                            li.eq(now).css({'transition': speed}).attr('class', '');
                            span.eq(next).addClass('on');
                            span.eq(now).removeClass('on');
                            now = next;
                        }, 30
                    );
                }
            }
        }
    );
}