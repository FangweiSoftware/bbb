/**
 * Created by Fairlady on 2017/08/29.
 */
var WEBAPI_ADDRESS='http://192.168.200.219:8087/api';


//----------------------------No.1导航栏功能注册区域-------------------

//------ 1.1路口建档相关--------

$('#create_cross').on('click',function (){
    addAccordion({
        title:'新建路口',
        href:'pages/tc_cr/create_cross/createIntersection.html',
        onLoad:function (){
            console.log(1);
            var createIntersection = new CreateIntersection('create_intersection');
            createIntersection.initCreateIntersection();

        }
    })
})

$('#edit_cross').on('click',function (){
    addAccordion({
        title:'路口编辑',
        href:'pages/cross_record/edit_cross/edit_cross.html'
    })
})


//---------- 1.2路口巡检相关---------
$('#edit_plan').on('click',function (){
    addAccordion({
        title:'计划编辑',
        href:'pages/cross_inspection/edit_plan/edit_plan.html'
    })
})

$('#analyze_pro').on('click',function (){
    addAccordion({
        title:'问题分析',
        href:'pages/cross_inspection/analyze_pro/analyze_pro.html'
    })
})


// --------1.3舆情管理相关----------
$('#process_pubinfo').on('click',function (){
    addAccordion({
        title:'舆情处理',
        href:'pages/pubinfo_manage/process_pubinfo/process_pubinfo.html'
    })
})
$('#analyze_pubinfo').on('click',function (){
    addAccordion({
        title:'舆情分析',
        href:'pages/pubinfo_manage/analyze_pubinfo/analyze_pubinfo.html'
    })
})
$('#relative_pubinfo').on('click',function (){
    addAccordion({
        title:'同环比',
        href:'pages/pubinfo_manage/relative_pubinfo/relative_pubinfo.html'
    })
})


// ------------1.4绿路优化相关-----------
$('#optimize_task').on('click',function (){
    addAccordion({
        title:'优化任务',
        href:'pages/greenRoad_optimize/optimize_task/optimize_task.html'
    })
})

$('#create_greenRoad').on('click',function (){
    addAccordion({
        title:'新建绿路',
        href:'pages/greenRoad_optimize/create_greenRoad/create_greenRoad.html'
    })
})


//----------- 1.5查询统计相关---------
$('#inquery_cross').on('click',function (){
    addAccordion({
        title:'路口查询',
        href:'pages/inquery_statistics/inquery_cross/inquery_cross.html'
    })
})

$('#output_account').on('click',function (){
    addAccordion({
        title:'台账导出',
        href:'pages/inquery_statistics/output_account/output_account.html'
    })
})
$('#about_system').on('click',function () {
    addAccordion({
        title: '关于系统',
        href: 'pages/inquery_statistics/about_system/about_system.html'
    })


})
// ------------导航栏设置-------------

$('#settings').on('click',function (){
    openWindow({
        el:'#settings_window',
        title:'设置',
        href:'pages/system_options/options.html',
        x:500,
        y:200,
        w:480,
        h:250
    })
})
//----------------------------导航栏功能注册区域结束-------------------








//----------------------------No.2功能窗口注册区域---------------------

/*这里是封装的新打开的窗口,拖动产生新窗口也是该方法
 --参数--
 openWindow({
 el:'#edit_tc'选择器,
 title:'标题',
 href:窗口内容的html链接地址,
 ------------以下可选----------------
 x:水平位置,默认100
 y:垂直位置,默认100
 w:宽度,默认400
 h:高度,默认500
 })
 */


//2.1路口建档相关窗口
//打开新建路口
function openCreateCross(x,y){
    openWindow({
        el:'#create_cross_window',
        title:'新建路口',
        href:'pages/tc_cr/create_cross/createIntersection.html',
        x:x,
        y:y,
        w:480,
        h:545,
        onLoad:function (){
            console.log(2);
            var createIntersection = new CreateIntersection('create_intersection');
            createIntersection.initCreateIntersection();
        }
    })
}

// 打开编辑路口
function openEditCross(x,y){
    openWindow({
        el:'#edit_cross_window',
        title:'路口编辑',
        href:'pages/cross_record/create_cross/createCross.html',
        x:x,
        y:y,
        w:480,
        h:545
    })
}

//2.2路口巡检相关窗口



//2.3舆情管理相关窗口



//2.4绿路管理相关窗口



//2.5查询统计相关窗口


//----------------------------No.2功能窗口注册区域结束---------------------









// --------------------列表打开区(打开下方列表,路口管理,舆情管理,优化管理)---------------------------

$('#manage_pubinfo').on('click',function (){
    currentTab=1;
    openSouthLayout()
})

$('#manage_cross').on('click',function (){
    currentTab=0;
    openSouthLayout();
})


//----------------------------列表区结束-------------------------------------------------




/*---------------------------No.3拖拽窗口注册区域-----------------------------------
   在这里按照示例注册功能之后窗口才可以从西区的手风琴菜单拖出来变成独立窗口
*/
function dragWindow(title,x,y){
    $left_window.accordion('remove',title);
    switch(title)
    {
       /*
       这里匹配你的窗口标题
       case '新建路口':
       然后调用在No.2区注册的打开窗口方法,需要传入,x,y形参使窗口打开在指定位置
            openCreateCross(x,y);
            break;
       */
        case '新建路口':
            openCreateCross(x,y);
            break;
        case '路口编辑':
            openEditCross(x,y);
            break;
        default:
            console.log('没有找到对应的窗口');
    }
}