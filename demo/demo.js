window.onload = init;

var viewer;
function init(){
    var vh = $('.mobile_image_viewer').height()
    var vw = $('.mobile_image_viewer').width()
    var urls = [
        'http://d.hiphotos.baidu.com/image/pic/item/8601a18b87d6277fcdb9b01d24381f30e924fc68.jpg',
        'http://b.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9eab4279cc5d939b6003bf3b3c4.jpg',
        'http://a.hiphotos.baidu.com/image/pic/item/314e251f95cad1c847e70404733e6709c93d51b1.jpg',
    ];
    viewer = $('.mobile_image_viewer').MobileImageViewer({
        vwidth: vw,
        vheight: vh,
        indicator:true,
        tapClose:true,
        sliderReverse:true,
        sliderdownClose:false,
        debugfunc:function(msg){
            console.log(msg)
        }
    });
    viewer.show(urls,0)
}