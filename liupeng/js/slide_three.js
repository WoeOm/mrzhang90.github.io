loadSlide($('#tixi_ul'));
loadSlide($('#school_ul'));
loadSlide($('#shizi_ul'));
function loadSlide(slideElement){
    var biZhiDelayLoadImg = slideElement.children('li');
    var biZhiDelayLoadImgLength = biZhiDelayLoadImg.length;

    // var _focus_num = $(".smallUl > li").length;
    var _focus_num = Math.ceil(biZhiDelayLoadImgLength/3);
    // console.log(biZhiDelayLoadImg);
    var _focus_direction = true;
    var _focus_pos = 0;
    var _focus_max_length = _focus_num * 1280;
    var _focus_li_length = 1280;
    var _focus_dsq = null;
    var _focus_lock = true;
    function autoExecAnimate() {
        var moveLen = _focus_pos * _focus_li_length;
        slideElement.animate({
                left: "-" + moveLen + "px"
            },
            600);
        if (_focus_pos == (_focus_num - 1)) {
            _focus_direction = false
        }
        if (_focus_pos == 0) {
            _focus_direction = true
        }
        if (_focus_direction) {
            _focus_pos++
        } else {
            _focus_pos--
        }
    }
    // _focus_dsq = setInterval("autoExecAnimate()", 1000);
    var _parent=slideElement.parents('.container');
    _parent.find('.previous').click(function(){
        if (_focus_lock) {
            clearInterval(_focus_dsq);
            _focus_lock = false
        }
        _focus_pos--;
        if(_focus_pos>=0){
            var moveLen = _focus_pos * _focus_li_length;
            slideElement.stop(true, true).animate({
                    left: "-" + moveLen + "px"
                },
                600)
        }else{
            _focus_pos++;
        }
    })
    _parent.find('.next').click(function(){
        if (_focus_lock) {
            clearInterval(_focus_dsq);
            _focus_lock = false
        }
        _focus_pos++;
        if(_focus_pos<_focus_num){
            var moveLen = _focus_pos * _focus_li_length;
            slideElement.stop(true, true).animate({
                    left: "-" + moveLen + "px"
                },
                600)
        }else{
            _focus_pos--;
        }
    })
}