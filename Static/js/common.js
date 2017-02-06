//nav
$('.panel-nav').on('click', 'li', function() {
    $(this).addClass('current').siblings().removeClass('current');
    $($(this).attr('data-href')).show().siblings().hide();
});

var preventDefault = function(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

var keydown = function(e) {
    e = e || window.event;
    var keys = [37, 38, 39, 40];
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

var wheel = function(e) {
    preventDefault(e);
}

var disableScroll = function() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    window.ontouchmove = document.ontouchmove = wheel;
    document.onkeydown = keydown;
}

var enableScroll = function() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = window.ontouchmove = document.ontouchmove = null;
}

// $('#followBtn').click(function() {
//     var imgSrc;
//     if($(this).hasClass('btn-index-follow')) {
//         imgSrc = '../Static/images/qr-code.jpg';
//     } else {
//         imgSrc = '../../Static/images/qr-code.jpg';
//     }
//     var overlayHtml = '<div class="overlay" id="followOverlay">'
//                     + '    <div class="overlay-bg"></div>'
//                     + '    <div class="qr-code">'
//                     + '        <img src="' + imgSrc + '" alt="">'
//                     + '        <p>扫一扫关注道前印巷</p>'
//                     + '    </div>'
//                     + '</div>'
//     // $('#followOverlay').fadeIn(200);
//    $('body').append(overlayHtml);
//     disableScroll();
// });
$('#followBtn').click(function() {
    $('#followOverlay').fadeIn(200);
    disableScroll();
});

$('.overlay-bg').click(function() {
    $('#followOverlay').fadeOut(200);
    enableScroll();
});

$('#followBtn').click(function() {
    $('#followOverlay').fadeIn(200);
    disableScroll();
});

$('.overlay-bg').click(function() {
    $('#followOverlay').fadeOut(200);
    enableScroll();
});

$('#telBtn').click(function() {
    if ($('.tel-group').is(':hidden')) {
        $('.tel-group').fadeIn(200);
    } else {
        $('.tel-group').fadeOut(200);
    }
})

$('body').on('click', function(e) {
    if (e.target.id != 'telBtn') {
        $('.tel-group').hide();
    }
});

var defaultSlider = function(num) {
    $dragBln = false;
    $('#carouselMain' + num).touchSlider({
        flexible: true,
        speed: 200,
        btn_prev: $('#btnPrev' + num),
        btn_next: $('#btnNext' + num),
        paging: $('#carouselIcon' + num + ' a'),
        counter: function(e) {
            $('#carouselIcon' + num + ' a').removeClass('current').eq(e.current - 1).addClass('current');
        }
    });
    $('#carouselMain' + num).bind('mousedown', function() {
        $dragBln = false;
    })
    $('#carouselMain' + num).bind('dragstart', function() {
        $dragBln = true;
    })
    $('#carouselMain a' + num).click(function() {
        if ($dragBln) {
            return false;
        }
    })
    timer = setInterval(function() {
        $('#btnNext' + num).click();
    }, 3000);
    $('#carouselMain' + num).hover(function() {
        clearInterval(timer);
    })
    $('#carouselMain' + num).bind('touchstart', function() {
        clearInterval(timer);
    }).bind('touchend', function() {
        timer = setInterval(function() {
            $('#btnNext' + num).click();
        }, 3000);
    });
}

/*进度条*/
var drawProcess = function() {
    $('.spot-grade-pic').each(function() {
        var width = $('.spot-grade').get(0).offsetWidth * 2;
        $(this).attr('width', width + 'px').attr('height', width + 'px');
        $(this).css('width', width / 2 + 'px').css('height', width / 2 + 'px');
        var process = $(this).attr('data-rate') * 20;
        var canvas = $(this).get(0);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, width);

        context.beginPath();
        context.moveTo(width / 2, width / 2);
        context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2, false);
        context.closePath();

        context.fillStyle = '#f1f1f1';
        context.fill();

        var currentProcess = 0;
        var animation = function() {
            if (currentProcess <= process) {
                context.beginPath();
                context.moveTo(width / 2, width / 2);
                context.arc(width / 2, width / 2, width / 2, -Math.PI * 1 / 2, -Math.PI * 1 / 2 + Math.PI * 2 * currentProcess / 100, false);
                context.closePath();
                context.fillStyle = '#1baee4';
                context.fill();

                context.beginPath();
                context.moveTo(width / 2, width / 2);
                context.arc(width / 2, width / 2, width / 2 - 6, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = '#fff';
                context.fill();

                // context.font = "bold 18pt Arial";
                // context.fillStyle = '#666';
                // context.textAlign = 'center';
                // context.textBaseline = 'middle';
                // context.moveTo(width, width);
                // context.fillText(process + '%', width / 2, width / 2);

                currentProcess++;
            } else {
                clearInterval(animation);
                return;
            }
        }
        setInterval(animation, 10);
    });
}

var getTravelRoute = function() {
    var settings = {
        url: 'http://szdq.losta.net/api/travelroute/',
        type: 'GET',
        dateType: 'json'
    }
    $.ajax(settings).done(function(data) {})
};

var getRouteId = function() {
    var reg = new RegExp('(^|&)routeId=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg) ?
        window.location.search.substr(1).match(reg)[2] : '1';
    return r;
};

var getSceneryId = function() {
    var reg = new RegExp('(^|&)sceneryId=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg) ?
        window.location.search.substr(1).match(reg)[2] : '1';
    return r;
};

// 百度地图
// var toBDCoordinate = function(point) {
//     if (!point || point.length == 0) {
//         return [];
//     }
//     BD = coordtransform.gcj02tobd09(point[0], point[1]);
//     return BD;
// }
// var gcj02tobd09 = function(lng, lat) {
//     var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * Math.PI / 180);
//     var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * Math.PI / 180);
//     var bd_lng = z * Math.cos(theta) + 0.0065;
//     var bd_lat = z * Math.sin(theta) + 0.006;
//     return [bd_lng, bd_lat]
// }

// 高德地图
var map = new AMap.Map('routeMap', {
    resizeEnable: true,
    center: [120.623475, 31.307258],
    zoom: 15
});

var currentLocation = [120.616474, 31.30528];

var getCurrent = function() {
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('traceMap', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        var str = ['定位成功'];
        currentLocation = [data.position.getLng(), data.position.getLat()]
        // console.log('经度：' + data.position.getLng());
        // console.log('纬度：' + data.position.getLat());
        // console.log('精度：' + data.accuracy + ' 米');
        // console.log('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    }
    //解析定位错误信息
    function onError(data) {
        alert('定位失败');
    }
    return currentLocation;
}

// 弹框的链接跳转到高德地图
var bindGD = function() {
    var sceneryId = $('.map-button').attr('data-id');
    var traceMap = new AMap.Map('traceMap');
    var button = document.getElementById('mapButton' + sceneryId);
    var curr = getCurrent();
    var destination = [sceneryDetails[sceneryId].lon, sceneryDetails[sceneryId].lat];
    AMap.service('AMap.Walking', function() {
        walk = new AMap.Walking({
            map: traceMap,
            panel: "result"
        });
        //根据起终点坐标规划驾车路线
        walk.search(currentLocation, destination, function(status, result) {
            button.onclick = function() {
                walk.searchOnAMAP({
                    origin: result.origin,
                    destination: result.destination
                });
            };
        });
    });
};

var showScenery = function(positions) {
    // 添加一些分布不均的点到地图上,地图上添加三个点标记，作为参照
    var infoWindow = new AMap.InfoWindow();

    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
        setTimeout(function() {
            bindGD();
        }, 500);

    }
    for (var i = 0, marker; i < positions.length; i++) {
        marker = new AMap.Marker({
            position: positions[i],
            map: map
        });
        marker.content = '<a class="map-button" data-id="' + i + '" id="mapButton' + i + '">' + sceneryDetails[i].name + '</a>';
        //给Marker绑定单击事件
        marker.on('click', markerClick);

        map.setFitView();
        var center = map.getCenter();
        var newCenter = map.setFitView();
    };
}
