/*!
 * Mobile image viewer lib
 * Copyright 2018, sailaway@github
 *
 */
(function($) {
  'use strict';
  $.MobileImageViewer = function(el, options) {
    var viewer = this;
    var AppConfig = {};
    viewer.$el = $(el);
    viewer.el = el[0];
    viewer.curindex = 0;
    viewer.images = [];

    viewer.close = function(obj){
        viewer.$el.hide();
    }

    viewer.adjustImg = function(imgele,imgw,imgh){
        var adjustw = AppConfig.vwidth * imgh < AppConfig.vheight * imgw;
        var offsettop = 0;
        var offsetleft = 0;
        var imgelew = AppConfig.vwidth;
        var imgeleh = AppConfig.vheight;
        if (adjustw) {
            imgeleh = imgh * AppConfig.vwidth  / imgw
            offsettop = (AppConfig.vheight - imgeleh)/2;
        } else {
            imgelew = imgw * AppConfig.vheight / imgh
            offsetleft = (AppConfig.vwidth - imgelew)/2;
        }
        imgele.style.width  = imgelew+"px";
        imgele.style.height = imgeleh+"px";
        imgele.style.left = offsetleft+"px"
        imgele.style.top  = offsettop+"px"
    }

    viewer.setIndicator = function(indicator,count){
        if (count <= 0) {
            return;
        }
        var indw = 30;
        var indmargin = 10;
        var leftval = (AppConfig.vwidth - count * (indw + indmargin) )/2;
        var innerhtml = "";
        for(var i = 0;i < count;i++){
            innerhtml += "<span class='ind' style='width:"+indw+"px;'></span>";
        }
        indicator.css('left',leftval+'px')
        indicator.html(innerhtml);
    }

    viewer.show = function(images,initindex){
        // create DOM element
        viewer.$el.show();
        viewer.images = images;
        viewer.curindex = initindex;

        var imgdivwidth = AppConfig.vwidth * images.length + 30;
        var innerhtml;
        innerhtml  = "<div class='mivcontainer'>";
        innerhtml += "  <div class='imgcontainer'>";
        innerhtml += "    <div class='imginner' style='width:"+imgdivwidth+"px;'>";
        for(var i = 0; i < images.length;i++){
          innerhtml += "    <div class='item' style='width:"+AppConfig.vwidth+"px;'>";
          innerhtml += "      <img src='"+images[i]+"'>"
          innerhtml += "    </div>"
        }
        innerhtml += "    </div>";
        innerhtml += "  </div>";

        // indicator div
        innerhtml += "  <div class='indicator'>";
        innerhtml += "  </div>";

        innerhtml += "</div>";
        viewer.el.innerHTML = innerhtml;

        $('.imgcontainer .item img').on('load',function(){
            var img = new Image();
            img.src = $(this).attr("src") ;
            var w   = img.width;
            var h   = img.height;
            viewer.adjustImg(this,w,h)
        })

        if(AppConfig.indicator){
            viewer.setIndicator($('.mivcontainer .indicator'),images.length)
        }

        viewer.sliderto(viewer.curindex,0,false);
    }
    viewer.sliderto = function(idx,offsetx,animate){
        if(idx < 0){
            idx = 0;
        }
        if (idx >= viewer.images.length) {
            idx = viewer.images.length -1
        }
        var w = viewer.$el.width();
        var leftx = idx * w + offsetx;
        var maxx  = (viewer.images.length-1) * w;
        if(leftx < 0){
            leftx = 0
        }
        if(leftx > maxx){
            leftx = maxx;
        }
        var imgdiv = viewer.el.getElementsByClassName('imgcontainer')[0]
        if (animate) {
            // scroll to leftx
            AppConfig.debugfunc('sliderto scrollTo '+leftx)
            //imgdiv.scrollTo(leftx,0)
            imgdiv.scrollLeft = leftx;
        } else {
            // set element position
            imgdiv.scrollLeft = leftx;
            AppConfig.debugfunc('sliderto scrollLeft '+leftx)
        }
        viewer.curindex = idx;

        if(AppConfig.indicator){
            $('.mivcontainer .indicator .ind').removeClass('select')
            $('.mivcontainer .indicator .ind:nth-child('+(idx+1)+')').addClass('select')
        }
    }
    viewer.slidernext = function(obj){
        var idx = viewer.curindex + 1;
        if (AppConfig.sliderReverse) {
            idx = viewer.curindex - 1;
        }
        viewer.sliderto(idx,0,true);
    }
    viewer.sliderprev = function(obj){
        var idx = viewer.curindex - 1;
        if (AppConfig.sliderReverse) {
            idx = viewer.curindex + 1;
        }
        viewer.sliderto(idx,0,true);
    }
    viewer.touchmove = function(obj,moveX,moveY){
        if (AppConfig.sliderReverse) {
            moveX = -moveX;
        }
        viewer.sliderto(viewer.curindex,moveX,false)
    }
    viewer.sliderreset = function(obj){
        viewer.sliderto(viewer.curindex,0,false)
    },

    // Add a reverse reference to the DOM object
    viewer.$el.data('MobileImageViewer', viewer);
    viewer.init = function() {
      AppConfig = $.extend({}, $.MobileImageViewer.defaultOptions, options);

      viewer.el.viewertouch({
          tapClose:AppConfig.tapClose,
          sliderdownClose:AppConfig.sliderdownClose,
          close:viewer.close,
          slidernext:viewer.slidernext,
          sliderprev:viewer.sliderprev,
          sliderreset:viewer.sliderreset,
          debugfunc:AppConfig.debugfunc,
          touchmove:viewer.touchmove
      });

    };

    $.MobileImageViewer.defaultOptions = {
        tapClose:true,
        sliderdownClose:true,
        sliderReverse:false,
        debugfunc:function(msg){
            return false
        }
    };
    viewer.init();
  };

  $.fn.MobileImageViewer = function(options) {
    return Object.create(new $.MobileImageViewer(this, options));
  };
}(jQuery));

/**
 *
 * Object.create method for perform as a fallback if method not available.
 * The syntax just takes away the illusion that JavaScript uses Classical Inheritance.
 */
if(typeof Object.create !== 'function') {
  Object.create = function(o) {
    'use strict';

    function F() {}
    F.prototype = o;
    return new F();
  };
}