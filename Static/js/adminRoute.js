var getAllRoute = function() {
    var routeHtml = ''
    var settings = {
        url: 'http://szdq.losta.net/api/travelroute/',
        type: 'GET',
        dataType: 'json'
    }
    $.ajax(settings).done(function(data) {
        $.each(data, function(i, v) {
            routeHtml += '<li data-href="' + v.RouteId + '">' + v.RouteName + '</li>';
        });
        $('#routeList').html(routeHtml);
    })
};

var clearForm = function() {
    // $('#detailsForm').get(0).reset();
    $('#RouteId').val('0');
    $('#RouteName').val('');
    $('#Abstract').val('');
    $('#Comment').val('');
    $('#VoiceUrl').val('');
    $('#MapUrl').val('');
    $('#SceneryIdListString').val('');
    $('#Introduce').val('');
    sceneryList = [];
    $('#sceneryDynamic').html('');
    $('#allScenery').val('');
    editor.$txt.html('');
    changed = false;
};

var showAddForm = function() {
    $('#addBtn').show();
    $('#modifyBtn').hide();
    $('#RouteId').attr('readonly', 'readonly').attr('value', '0');
    $('#detailsForm')
        .attr('action', 'http://szdq.losta.net/api/travelroute/0')
    $('#sceneryDynamic').html('');
    clearForm();
    $('#modify').show();
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
            imageBoxHtml += '<li>'
                          + '    <img src="http://szdq.losta.net' + v + '" alt="">'
                          + '    <p>' + v.replace('/Images/', '') + '</p>'
                          + '    <i></i>'
                          + '</li>'
        });
        $('#imageUrlList').append(imageUrlHtml);
        $('#chooseImg').append(imageBoxHtml);
    })
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

$('#addImgBtn').click(function() {
    $('#chooseImg li').removeClass('choosed');
});

var sceneryList; //sceneryIdList
var addrouteId = function(i, v) {
    var addHtml = '<div class="row">'
                + '    <div class="col-md-10 alert alert-warning alert-dismissible" role="alert">'
                + '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                + '            <span aria-hidden="true">&times;</span>'
                + '        </button>'
                + '        <strong data-index="' + i + '">' + v + '</strong>'
                + '    </div>'
                + '    <div class="col-md-1 btn btn-info btn-up">&uarr;</div>'
                + '    <div class="col-md-1 btn btn-info btn-down">&darr;</div>'
                + '</div>'
    $('#sceneryDynamic').append(addHtml);
}

$('#sceneryDynamic').on('click', '.btn-up', function() {
    var clickSceneryId = $(this).siblings('.alert').find('strong').attr('data-index');
    var clickSceneryIdIndex = sceneryList.indexOf(parseInt(clickSceneryId));
    if (clickSceneryIdIndex == 0) {
        alert('已经是第一个了！')
    } else {
        sceneryList.splice(clickSceneryIdIndex, 1);
        sceneryList.splice(clickSceneryIdIndex - 1, 0, parseInt(clickSceneryId));
        $('#sceneryDynamic').html('');
        $.each(sceneryList, function(i, v) {
            addrouteId(v, allSceneryList[v]);
        })
        $('#SceneryIdListString').val(sceneryList);
        changed = true;
    }
})

$('#sceneryDynamic').on('click', '.btn-down', function() {
    var clickSceneryId = $(this).siblings('.alert').find('strong').attr('data-index');
    var clickSceneryIdIndex = sceneryList.indexOf(parseInt(clickSceneryId));
    if (clickSceneryIdIndex == (sceneryList.length - 1)) {
        alert('已经是最后一个了！')
    } else {
        sceneryList.splice(clickSceneryIdIndex, 1);
        sceneryList.splice(clickSceneryIdIndex + 1, 0, parseInt(clickSceneryId));
        $('#sceneryDynamic').html('');
        $.each(sceneryList, function(i, v) {
            addrouteId(v, allSceneryList[v]);
        })
        $('#SceneryIdListString').val(sceneryList);
        changed = true;
    }
})

$('#allScenery').change(function() {
    var id = parseInt($(this).val());
    if (!id) {
        alert('不能为空！');
    } else if (sceneryList.indexOf(id) == -1) {
        addrouteId(id, allSceneryList[id]);
        sceneryList.push(id);
        $('#SceneryIdListString').val(sceneryList);
        changed = true;
    } else {
        alert('请勿重复加入！')
    }
})

$('#sceneryDynamic').on('click', '.close', function() {
    var val = $(this).siblings('strong').attr('data-id');
    sceneryList.splice(sceneryList.indexOf(val), 1);
    $('#SceneryIdListString').val(sceneryList);
    changed = true;
    $(this).parent().parent().hide();
})

var isNum = function(e) {
    var k = window.event ? e.keyCode : e.which;
    if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {

    } else {
        if (window.event) {
            window.event.returnValue = false;
        } else {
            e.preventDefault();
        }
    }
};

$('#voiceUrlList').on('click', 'a', function() {
    $('#VoiceUrl').val($(this).attr('data-href'));
    changed = true;
});

$('#imageUrlList').on('click', 'a', function() {
    $('#MapUrl').val($(this).attr('data-href'));
    changed = true;
});

var toJudgeNull = function() {
    if ($('#RouteName').val() == '') {
        alert('线路名称不能为空！');
        return false;
    } else if ($('#Abstract').val() == '') {
        alert('摘要不能为空！');
        return false;
    } else if ($('#Comment').val() == '') {
        alert('备注不能为空！');
        return false;
    } else if ($('#VoiceUrl').val() == '') {
        alert('语音URL不能为空！');
        return false;
    } else if ($('#MapUrl').val() == '') {
        alert('地图URL不能为空！');
        return false;
    } else if ($('#SceneryIdListString').val() == '') {
        alert('景点列表不能为空！');
        return false;
    } else if ($('#Introduce').val() == '') {
        alert('导游介绍文字不能为空！');
        return false;
    } else {
        return true;
    }
}

$('#RouteName').change(function() {
    changed = true;
});
$('#Abstract').change(function() {
    changed = true;
});
$('#Comment').change(function() {
    changed = true;
});

var addLock = false;
var submitAddForm = function() {
    if (addLock) {
        return;
    }
    if (toJudgeNull()) {
        if (!changed) {
            alert('请勿重复添加！');
            return;
        }
        var settings = {
            url: $('#detailsForm').attr('action'),
            type: 'POST',
            data: $('#detailsForm').serialize(),
            dataType: 'json',
            beforeSend: function() {
                addLock = true;
            }
        }
        $.ajax(settings).done(function() {
            alert('添加成功!');
            addLock = false;
            changed = false;
            getAllRoute();
        }).error(function() {
            alert('添加失败!');
            addLock = false;
        })
    }
}

var updateLock = false;
var submitUpdateForm = function() {
    if (updateLock) {
        return;
    }
    if (toJudgeNull()) {
        if (!changed) {
            alert('没有做修改！')
            return;
        }
        var settings = {
            url: $('#detailsForm').attr('action'),
            type: 'POST',
            data: $('#detailsForm').serialize(),
            dataType: 'json',
            beforeSend: function() {
                updateLock = true;
            }
        }
        $.ajax(settings).done(function() {
            alert('修改成功!');
            updateLock = false;
            changed = false;
            getAllRoute();
        }).error(function(data) {
            updateLock = false;
            alert('修改失败!');
        });
    }
}

var submitDeleteForm = function() {
    // $('#detailsForm').attr('method', 'DELETE');
    // $('#detailsForm').submit();
    var settings = {
        url: $('#detailsForm').attr('action'),
        type: 'DELETE',
        dataType: 'json'
            // data: {
            //     'RouteId': $('#RouteId').val()
            // }
    }
    $.ajax(settings).done(function() {
        alert('修改成功!');
    }).error(function() {
        alert('修改失败!');
    })
}

var changed;
var routeId = '';
var editor = new wangEditor('introduceDiv');
var allSceneryList = []; //每个SceneryId对应的SceneryName
var allSceneryNameList = [];
$(function() {
    // 阻止输出log
    wangEditor.config.printLog = false;
    // 上传图片
    editor.config.uploadImgUrl = encodeURI('http://szdq.losta.net/api/Files?folder=Images');
    editor.create();

    $('#Introduce').val(editor.$txt.html());

    $('#introduceDiv').blur(function() {
        $('#Introduce').val(editor.$txt.html());
        change = true;
    });

    getAllRoute();
    getVoiceUrl();
    getImageUrl();
    var routeListLock = false;
    $('#routeList').on('click', 'li', function(e) {
        if (routeListLock) {
            return;
        }
        $(this).addClass('current').siblings().removeClass('current');
        routeListLock = true;
        $('#modify').show();
        $('#addBtn').hide();
        $('#modifyBtn').show();
        $('#sceneryDynamic').html('');
        changed = false;
        sceneryList = [];
        routeId = $(this).attr('data-href');
        $('#detailsForm').attr('action', 'http://szdq.losta.net/api/travelroute/' + routeId);
        var routeSettings = {
            url: 'http://szdq.losta.net/api/TravelScenery',
            type: 'GET',
            dataType: 'json'
        }
        $.ajax(routeSettings).done(function(data) {
            var allSceneryHtml = ''
            $.each(data, function(i, v) {
                allSceneryList[v.SceneryId] = v.SceneryName;
                allSceneryHtml += '<option value="' + v.SceneryId + '">' + v.SceneryName + '</option>'
            });
            $('#allScenery').html(allSceneryHtml);
            var settings = {
                url: 'http://szdq.losta.net/api/travelroute/' + routeId,
                type: 'GET',
                dataType: 'json'
            }
            $.ajax(settings).done(function(data) {
                $('#RouteId').val(data.RouteId);
                $('#RouteName').val(data.RouteName);
                $('#Abstract').val(data.Abstract);
                $('#Introduce').val(data.Introduce);
                $('#Comment').val(data.Comment);
                $('#VoiceUrl').val(data.VoiceUrl);
                $('#MapUrl').val(data.MapUrl);
                editor.$txt.html(data.Introduce);
                $('#Introduce').val(editor.$txt.html());
                $('#SceneryIdList').val(data.SceneryIdList);
                sceneryList = data.SceneryIdList;
                $('#sceneryDynamic').html('');
                $('#SceneryIdListString').val(sceneryList);
                $.each(data.SceneryIdList, function(i, v) {
                    addrouteId(v, allSceneryList[v]);
                });
                routeListLock = false;
            });
        })
    })
})
