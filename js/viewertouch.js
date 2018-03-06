;(function (window) {
    var defaultVal = {
        tapClose:false,
        sliderdownClose:false,
        close:function(obj){
            //obj.style.setProperty('display','none')
            return false;
        },
        slidernext:function(obj){
            return false;
        },
        sliderprev:function(obj){
            return false;
        },
        sliderreset:function(obj){
            return false
        },
        touchmove:function(obj,moveX,moveY){
            return false;
        }
    };

    var isClick;
    var startX;
    var startY;
    var endX;
    var endY;
    var distanceX;
    var distanceY;
    var prevX;
    var prevY;
    var deltaXs = [];
    var deltaYs = [];
    var viewertouch = function (options) {
        var obj = this;
        var opts = _merge(defaultVal, options);

        function _estart = function (e) {
            _touchstart(e,opts,obj);
        }
        function _emove = function (e) {
            _touchmove(e,opts,obj);
        }
        function _eend = function (e) {
            _touchend(e,opts,obj);
        }

        if (window.addEventListener) {
            obj.removeEventListener("touchstart", _estart);
            obj.removeEventListener("touchmove", _emove);
            obj.removeEventListener("touchend", _eend);

            obj.addEventListener('touchstart', _estart, false);
            obj.addEventListener('touchmove', _emove, false);
            obj.addEventListener('touchend', _eend, false);
        } else if (window.attachEvent) {
            obj.attach('ontouchstart', _estart);
            obj.attach('ontouchmove', _emove);
            obj.attach('ontouchend', _eend);
        }
        return obj;
    }

    // 合并两个对象
    var _merge = function (defaultVal, options) {
        for (name in options) {
            defaultVal[name] = options[name];
        }
        return defaultVal;
    };

    // 计算加速度
    var _accespeed = function(deltas){
        // 只计算最后N次数据
        var N = 5;
        if(deltas.length < N){
            return 0;
        }
        var over0 = 0;
        var blew0 = 0;
        var deltadis_sum = 0;
        var startidx = deltas.length-N;
        for (var i = startidx; i < deltas.length; i++) {
            if(deltas[i] > 0){
                over0 += 1;
            } else if(deltas[i] < 0){
                blew0 += 1;
            }
            if (i > 0) {
                var dis = deltas[i] - deltas[i-1];
                deltadis_sum += dis;
            }
        }
        if (over0 > 0 && blew0 > 0) {
            return 0;
        }
        var sp = deltadis_sum / (N-1);
        return sp;
    }

    // 计算滑动速度
    var _speed = function(deltas){
        // 计算最后N次数据
        var N = 5;
        if(deltas.length < N){
            return 0;
        }
        var over0  = 0;
        var blew0  = 0;
        var dissum = 0;
        var startidx = deltas.length - N;
        for (var i = startidx; i < deltas.length; i++) {
            if(deltas[i] > 0){
                over0 += 1;
            } else if(deltas[i] < 0){
                blew0 += 1;
            }
            dissum += deltas[i];
        }
        if (over0 > 0 && blew0 > 0) {
            return 0;
        }
        var sp = dissum / N;
        return sp;
    }

    var _touchstart = function (e,opts,obj) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        startX = touch.pageX;
        startY = touch.pageY;

        prevX  = touch.pageX;
        prevY  = touch.pageY;
        deltaXs = [];
        deltaYs = [];
        distanceX = 0;
        distanceY = 0;
        isClick = true;
    };

    var _touchmove = function (e,opts,obj) {
        e.preventDefault();
        if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
        var touch = e.targetTouches[0];
        isClick = false;
        distanceX = touch.pageX - startX;
        distanceY = touch.pageY - startY;

        var dx = touch.pageX - prevX;
        var dy = touch.pageY - prevY;
        deltaXs.push(dx);
        deltaYs.push(dy);
        if (opts.touchmove) {
            opts.touchmove(obj,distanceX,distanceY)
        }

        prevX  = touch.pageX;
        prevY  = touch.pageY;
    };

    var _touchend = function (e,opts,obj) {
        if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
        if (isClick || (Math.abs(distanceX) < 30 && Math.abs(distanceY) < 30 ) ) {
            // 点击
            if(opts.tapClose && opts.close){
                opts.close(obj)
                return;
            }
        }
        var flingSpeed = 10;
        var scrollDis  = 100;
        var speedX     = _speed(deltaXs)
        var speedY     = _speed(deltaYs)
        // var accespeedX = _accespeed(deltaXs)
        // var accespeedY = _accespeed(deltaYs)
        // console.log('_touchend speedX:'+speedX+" speedY:"+ speedY+" distanceX:"+distanceX+" distanceY:"+distanceY)

        if (speedY > flingSpeed || distanceY > scrollDis) {
          // 下滑
          if (opts.sliderdownClose && opts.close) {
            opts.close(obj)
            return;
          }
        } else if (speedY < -flingSpeed || distanceY < -scrollDis) {
            // 上滑
        } else if (speedX > flingSpeed || distanceX > scrollDis) {
          // 右滑
          if(opts.slidernext){
            opts.slidernext(obj);
            return;
          }
        } else if (speedX < -flingSpeed || distanceX < -scrollDis) {
          // 左滑
          if(opts.sliderprev){
            opts.sliderprev(obj);
            return;
          }
        }
        opts.sliderreset(obj);
    };

    // 对外输出的方式
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function () {
            return viewertouch;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        exports.viewertouch = viewertouch;
    } else {
        HTMLElement.prototype.viewertouch = viewertouch;
    }
}(window));