/**
 * Created by Fairlady on 2017/08/24.
 */

// $left_window为左侧的手风琴菜单
var $left_window=$('#left_windows');

var currentTab=0;

// 打开西区中的手风琴下拉窗口
function addAccordion(options){
    // 调用方法,打开西区窗口
    openWestLayout()
    // 防止报错
    options=options||{};
    // 获取相关参数
    var panel = $left_window.accordion('getPanel',options.title);
    // 如果含有该标题的窗口不存在的话,说明还不存在相关窗口, 新建一个
    if(!panel){
        $left_window.accordion('add', {
            title: options.title||'New Title',
            // content: 'New Content',
            href:options.href||'',
            selected: true,
            closable:true,
            tools:[{
                iconCls:'icon-drag',
                // handler:function(){alert('new')}
            }],
            onLoad:options.onLoad
        });
    }else{
        if(panel)panel.panel('open');
        $left_window.accordion('select',options.title);
    }
}


$left_window.on('dragend','.icon-drag',function (e){
    // var startX = e.pageX;
    // var startY = e.pageY;
    // 这里通过title判断拖动的是哪个窗口
    var title = $(this).parent().parent().find('.panel-title').html();
    console.log($(this).parent().parent());
    var endX = e.pageX||e.screenX;
    var endY = e.pageY||e.screenY-100;
    dragWindow(title,endX,endY);
    if($('.layout-panel-west')[0].style.display!='none')
        $('#main_layout').layout('collapse','west')
        
})



// 打开新建路口
// 这里是封装的标题拖动后新打开的窗口
/* 参数
 openWindow({
 el:'#edit_tc'选择器,
 title:'标题',
 href:窗口内容的html链接地址,
 ------------以下可选----------------
 x:水平位置,
 y:垂直位置,
 w:宽度,
 h:高度,
 })
 */



// 这里是封装的标题拖动后新打开的窗口
/* 参数
openWindow({
    el:'#edit_tc'选择器,
    title:'标题',
    href:窗口内容的html链接地址,
    ------------以下可选----------------
    x:水平位置,
    y:垂直位置,
    w:宽度,
    h:高度,

})
*/

function openWindow(o){
    $(o.el).window({
        href:o.href,
        left:o.x-200||100,
        top:o.y||100,
        title:o.title,
        shadow:false,
        width:o.w||400,
        height:o.h||500,
        minimizable:false,
        maximizable:false,
        resizable:false,
        onLoad:o.onLoad,
        onMove:function (x,y){
            var west_layout = $('.layout-panel-west')[0];
            if (west_layout){
                var val = window.getComputedStyle(west_layout,null).getPropertyValue("width");
            }
            var a = parseInt(val)-x;
            if(a>=300&&($('.layout-panel-west')[0].style.display!='none')){
                $(o.el).window('close');
                addAccordion({
                    title:o.title,
                    href:o.href,
                    onLoad:o.onLoad,
                })
            }else if(x<=-100&&($('.layout-panel-west')[0].style.display=='none')){
                $(o.el).window('close');
                addAccordion({
                    title:o.title,
                    href:o.href,
                    onLoad:o.onLoad,
                })
            }
        }
    }).window('open');
}


// 检测地图移动事件
setInterval(function (){
   var y =$('#main_layout').layout('panel', 'south')[0].clientHeight;
    $('.ol-viewport').css('margin-top','-'+y+'px');
    var x =$('#main_layout').layout('panel', 'west')[0].clientWidth;
    $('.ol-viewport').css('margin-left',x+'px');
},50)




// 打开西部的layout
function openWestLayout(){
    if($('.layout-panel-west')[0].style.display=='none'){
        $('#main_layout').layout('expand','west')
    }
};

// 关闭南部的layout
function closeSouthLayout(){
    if($('.layout-panel-south')[0].style.display!='none')
        $('#main_layout').layout('collapse','south')
}



$('#south_layout').on('dragend','.btn-drag-layout',function (e){
    $('#main_layout').layout('remove','south');
    dragLayout(e);
})


$('#mini_south_layout_window').on('click',function (){
    $('#south_layout_window').window('close');
    $('#main_layout').layout('add',{
        region: 'south',
        split: true,
        collapsed:true,
        height:200,
        href:'pages/crossManage.html',
        onLoad:function (){
            $('.btn-drag-layout').on('dragend',function (e){
                $('#main_layout').layout('remove','south');
                dragLayout(e);
            })
        }
    });

})




$('body').on('click','.layout-button-left',function (){
    console.log(1);
})


function openSouthLayout(){
    $('#list_tabs').tabs('select',currentTab)
    var south_layout = $('.layout-panel-south')[0];
    if (south_layout){
        var val = window.getComputedStyle($('.layout-panel-south')[0],null).getPropertyValue("display");
        
    }
    $('#main_layout').layout('add',{
        region: 'south',
        split: true,
        collapsed:true,
        height:200,
        href:'/traffic3-plan/pages/pubinfo.html',
        onLoad:function (){
            $('.btn-drag-layout').on('dragend',function (e){
                $('#main_layout').layout('remove','south');
                dragLayout(e);
            })
        }
    });
    if(val=='block'){
        $('#main_layout').layout('collapse','south');
    }else{
        $('#main_layout').layout('expand','south');

    }
}

/*
 * 获取当天日期，格式为（年-月-日）
 * */
function getTodayDate () {
    var date = new Date();                    // 获取当天时间
    var years = date.getFullYear();            // 获取年
    var mouths = date.getMonth() + 1;          // 获取月
    var days = date.getDate();                 // 获取日
    var hours = date.getHours();               // 获取时
    var minutes = date.getMinutes();           // 获取分
    var seconds = date.getSeconds();           // 获取秒

    if (mouths < 10) {mouths = '0' + mouths;}    // 如果小于 10 则为其前面添加 0
    if (days < 10) {days = '0' + days;}
    if (hours < 10) {hours = '0' + hours;}
    if (minutes < 10) {minutes = '0' + minutes;}
    if (seconds < 10) {seconds = '0' + seconds;}

    // 返回格式为"2017-07-17T11:57:59"
    return years + '-' + mouths + '-' + days + 'T' + hours + ':' + minutes + ':' + seconds;
}

