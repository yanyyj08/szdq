var getAllScenery = function() {
    var sceneryHtml = '';
    var settings = {
        url: 'http://szdq.losta.net/api/TravelScenery',
        type: 'GET',
        dataType: 'json'
    }
    $.ajax(settings).done(function(data) {
        $.each(data, function(i, v) {
            sceneryHtml += '<li data-href="' + v.SceneryId + '">' + v.SceneryName + '</li>';
        });
        $('#sceneryList').html(sceneryHtml);
    })
};

var getVoiceUrl = function() {
    var voiceUrlHtml = '';
    var settings = {
        url: 'http://szdq.losta.net/api/Files?Folder=Voice',
        type: 'GET',
        dataType: 'json'
    }
    $.ajax(settings).done(function(data) {
        $.each(data, function(i, v) {
            voiceUrlHtml += '<li><a href="javascript:;" data-href="' + v + '">' + v.replace('/Voice/', '') + '</a></li>';
        });
        $('#voiceUrlList').append(voiceUrlHtml);
    })
};

var getImageUrl = function() {
    var imageUrlHtml = '';
    var imageBoxHtml = '';
    var settings = {
        url: 'http://szdq.losta.net/api/Files?Folder=Images',
        type: 'GET',
        dataType: 'json'
    }
    $.ajax(settings).done(function(data) {
        $.each(data, function(i, v) {
            imageUrlHtml += '<li><a href="javascript:;" data-href="' + v + '">' + v.replace('/Images/', '') + '</a></li>';
            imageBoxHtml += '<li>' + '    <img src="http://szdq.losta.net' + v + '" alt="">' + '    <p>' + v.replace('/Images/', '') + '</p>' + '    <i></i>' + '</li>'
        });
        $('#imageUrlList').append(imageUrlHtml);
        $('#chooseImg').append(imageBoxHtml);
    })
};

var clearForm = function() {
    $('#detailsForm').get(0).reset();
    editor.$txt.html('');
};

var showAddForm = function() {
    $('#addBtn').show();
    $('#modifyBtn').hide();
    $('#SceneryId').attr('value', 0)
    $('#detailsForm')
        .attr('action', 'http://szdq.losta.net/api/TravelScenery/0')
    clearForm();
    $('#modify').show();
};

var addChoosedImg = function() {
    var chooseImgHtml = '';
    $('#chooseImg').find('.choosed img').each(function() {
        chooseImgHtml += '<img src="' + $(this).attr('src') + '" alt="" />';
    });
    editor.$txt.html(editor.$txt.html() + chooseImgHtml);
    $('#Introduce').val(editor.$txt.html());
    changed = true;
};

$('#chooseImg').on('click', 'li', function() {
    if ($(this).hasClass('choosed')) {
        $(this).removeClass('choosed');
    } else {
        $(this).addClass('choosed');
    }
});

$('#addImgBtn').on('click', function() {
    $('#chooseImg li').removeClass('choosed');
});

$('#sceneryKind').on('click', 'a', function() {
    $('#SceneryKind').val($(this).attr('data-type'));
    $('#sceneryKindName').val($(this).html());
    changed = true;
});

$('#voiceUrlList').on('click', 'a', function() {
    $('#VoiceUrl').val($(this).attr('data-href'));
    changed = true;
});

$('#imageUrlList').on('click', 'a', function() {
    $('#MapUrl').val($(this).attr('data-href'));
    changed = true;
});

var toJudgeNull = function() {
    if($('#SceneryName').val() == '') {
        alert('景点名称不能为空！');
        return false;
    } else if($('#SceneryKind').val() == '') {
        alert('景点类型不能为空！');
        return false;
    } else if($('#SceneryLocation').val() == '') {
        alert('景点位置不能为空！');
        return false;
    } else if($('#Abstract').val() == '') {
        alert('摘要不能为空！');
        return false;
    } else if($('#WorkTime').val() == '') {
        alert('工作时间不能为空！');
        return false;
    } else if($('#Grade').val() == '') {
        alert('等级不能为空！');
        return false;
    } else if($('#Longitude').val() == '') {
        alert('经度不能为空！');
        return false;
    } else if($('#Latitude').val() == '') {
        alert('纬度不能为空！');
        return false;
    } else if($('#VoiceUrl').val() == '') {
        alert('语音链接不能为空！');
        return false;
    } else if($('#MapUrl').val() == '') {
        alert('地图链接不能为空！');
        return false;
    } else if ($('#Introduce').val() == '') {
        alert('导游介绍文字不能为空！');
        return false;
    } else {
        return true;
    }
};

$('#SceneryName').change(function() {
    changed = true;
});
$('#SceneryLocation').change(function() {
    changed = true;
});
$('#Abstract').change(function() {
    changed = true;
});
$('#WorkTime').change(function() {
    changed = true;
});
$('#Grade').change(function() {
    changed = true;
});
$('#WorkPhone').change(function() {
    changed = true;
});
$('#Longitude').change(function() {
    changed = true;
});
$('#Latitude').change(function() {
    changed = true;
});
$('#Comment').change(function() {
    changed = true;
});

var addLock = false;
var submitAddForm = function() {
    if(addLock) {
        return;
    }
    if (toJudgeNull()) {
        if(!changed) {
            alert('请勿重复添加！');
            return;
        }
        var settings = {
            url: $('#detailsForm').attr('action'),
            type: 'POST',
            data: $('#detailsForm').serialize(),
            dataType: 'json'
        }
        $.ajax(settings).done(function() {
            alert('添加成功!');
            addLock = false;
            changed = false;
            getAllScenery();
        }).error(function() {
            alert('添加失败!');
            addLock = false;
        })
    }
};

var updateLock = false;
var submitUpdataForm = function() {
    if (updateLock) {
        return;
    }
    if(toJudgeNull()) {
        if(!changed) {
            alert('没有做修改！');
            return;
        }
        var settings = {
            url: $('#detailsForm').attr('action'),
            type: 'POST',
            data: $('#detailsForm').serialize(),
            dataType: 'json'
        }
        $.ajax(settings).done(function() {
            alert('修改成功!');
            updateLock = false;
            changed = false;
            getAllScenery();
        }).error(function() {
            updateLock = false;
            alert('修改失败!');
        })
    }
};

var submitDeleteForm = function() {
    var settings = {
        url: $('#detailsForm').attr('action'),
        type: 'DELETE',
        dataType: 'json'
    }
    $.ajax(settings).done(function(data) {
        alert('成功删除景点');
        getAllScenery();
    })
};

var changed = false;
var sceneryId; //点击侧边栏获取id
var editor = new wangEditor('introduceDiv');
$(function() {
    var sceneryKindList = {
            'k10': '导语',
            'k100': '景点',
            'k110': '古巷',
            'k120': '古宅名圆',
            'k200': '宾馆／酒店',
            'k210': '宾馆',
            'k220': '酒店',
            'k230': '饭店',
            'k300': '道口'
    }
    // 阻止输出log
    wangEditor.config.printLog = false;
    // 上传图片
    editor.config.uploadImgUrl = encodeURI('http://szdq.losta.net/api/Files?Folder=Images');
    editor.create();
    $('#Introduce').val(editor.$txt.html());

    $('#introduceDiv').blur(function() {
        $('#Introduce').val(editor.$txt.html());
        changed = true;
    });

    getAllScenery();
    getVoiceUrl();
    getImageUrl();
    var sceneryListLock = false;
    $('#sceneryList').on('click', 'li', function() {
        if (sceneryListLock) {
            return;
        }
        $(this).addClass('current').siblings().removeClass('current');
        sceneryListLock = true;
        $('#modify').show();
        $('#addBtn').hide();
        $('#modifyBtn').show();
        sceneryId = $(this).attr('data-href');
        $('#detailsForm')
            .attr('action', 'http://szdq.losta.net/api/TravelScenery/' + sceneryId);
        var settings = {
            url: 'http://szdq.losta.net/api/TravelScenery/' + sceneryId,
            type: 'GET',
            dataType: 'json'
        }
        $.ajax(settings).done(function(data) {
            $('#SceneryId').val(data.SceneryId);
            $('#SceneryName').val(data.SceneryName);
            $('#SceneryKind').val(data.SceneryKind);
            $('#sceneryKindName').val(sceneryKindList['k' + data.SceneryKind]);
            $('#SceneryLocation').val(data.SceneryLocation);
            $('#Abstract').val(data.Abstract);
            $('#WorkTime').val(data.WorkTime);
            $('#WorkPhone').val(data.WorkPhone);
            editor.$txt.html(data.Introduce);
            $('#Introduce').val(data.Introduce);
            $('#VoiceUrl').val(data.VoiceUrl);
            $('#MapUrl').val(data.MapUrl);
            $('#Longitude').val(data.Longitude);
            $('#Latitude').val(data.Latitude);
            $('#Grade').val(data.Grade);
            $('#Comment').val(data.Comment);
            sceneryListLock = false;
        });
    })
})