// ajax 对象实例
// var requestServiceObj = new RequestService();

/*
 * tab 选项卡导航对象
 * @author [冼国文]
 * */
// function Tab (tabCls, contentCls, activeCls) {
//   this.tabCls = tabCls;
//   this.contentCls = contentCls;
//   this.activeCls = activeCls;
// }
//
// // 点击选项卡切换内容事件函数
// // @author [冼国文]
// Tab.prototype.clickTab = function() {
//   var _this = this;
//   var $tab = $('.' + this.tabCls);
//   var $contents = $tab.siblings('.' + this.contentCls).children();
//   $tab.off('click').on('click', 'li', function (event) {
//     window.event ? window.event.cancelBubble = true : event.stopPropagation();
//     var $this = $(this);
//     var index = $this.index();
//     $this.addClass(_this.activeCls).siblings().removeClass(_this.activeCls);
//     $contents.css('display', 'none').eq(index).css('display', 'block');
//   });
// };

/*
* 下拉列表对象
* @author [冼国文]
* */
function DropDown (dropCls, textCls, selectionsCls) {
  this.dropCls = dropCls;
  this.textCls = textCls;
  this.selectionsCls = selectionsCls;
}

// @author [冼国文]
DropDown.prototype.zIndex = 30;

// 点击下拉列表滑动
DropDown.prototype.clickDropDown = function () {
  var _this = this;
  var $dropdown = $('.' + _this.dropCls);
  $dropdown.unbind('click').on('click', function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    $dropdown.not(this).find('.' + _this.selectionsCls).slideUp();    // 让其他的下拉列表隐藏
    var $this = $(this);    // 获取当前元素
    $this.css('zIndex', _this.zIndex++);  // 设置zIndex
    var $dropdownText = $this.find('.' + _this.textCls);    // 当前下拉列表的显示选择内容
    
    var $dropdownSelections = $this.find('.' + _this.selectionsCls);    // 下拉列表
    if ($dropdownSelections.children().length === 1) {
      $this.find('.drop-down-input').focus();
    } else {
      $dropdownSelections.slideToggle();    // 切换滑动
      $dropdownSelections.off().on('click', 'li', function (e) {    // 点击下拉列表内容选中
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        var $thisLi = $(this);
        if ($thisLi.index() === $dropdownSelections.children().length - 1) {
          openEditerDropdown($dropdownSelections, $this.prev().text());
        } else {
          $dropdownText.text($thisLi.text());
          $dropdownSelections.slideUp();
        }
      });
    }
  });
  $(document).on('click', function () {
    $dropdown.find('.' + _this.selectionsCls).slideUp();
  });
};

/*
* getValue (id, $ele)
* id 为传递到后台的参数，$ele为需要添加下拉列表的对象
* 下拉列表获取内容
* */
DropDown.prototype.getValue = function (id, $ele) {
  var _this = this;
  $.ajax({
    url: WEBAPI_ADDRESS + '/Tc_sys_value/Get',
    type: 'Get',
    data: {id: id},
    dataType: 'json',
    async: false,
    success: function (data, status) {
      if (data.statusCode === 2000) {
        var values = data.data;
        var $dropdownSelections = $ele.find('.' + _this.selectionsCls).empty();
        var $dropdownText = $ele.find('.' + _this.textCls);
        for (var i = 0, len = values.length; i < len; i++) {
          if (values[0].val === '') {
            var $input = $('<input class="drop-down-input" type="text">').css({
              width: '100%',
              height: '100%',
              padding: 0
            }).keyup(function (event) {
              event = event || window.event;
              var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
              if (keyCode !== 13) {
                return;
              }
              var $this = $(this);
              var value = $this.val();
              if (value === '') {
                return;
              }
              $dropdownText.css('display', 'block').text(value);
              $dropdownSelections.prepend($('<li></li>').text(value).data('valueid', 0));
              $this.remove();
            }).blur(function () {
              var $this = $(this);
              var value = $this.val();
              if (value === '') {
                return;
              }
              $dropdownText.css('display', 'block').text(value);
              $dropdownSelections.prepend($('<li></li>').text(value).data('valueid', 0));
              $this.remove();
            }).insertBefore($dropdownText);
            $dropdownText.css('display', 'none');
          } else if (values[i].val !== '') {
            if (i === 0 && $dropdownText.text() === '') {
              $dropdownText.text(values[i].val);
            }
            $('<li></li>').text(values[i].val).data('valueid', values[i].valueid).appendTo($dropdownSelections);
          }
        }
        if (values.length === 0) {
          var $input = $('<input class="drop-down-input" type="text">').css({
            width: '100%',
            height: '100%',
            padding: 0
          }).val($dropdownText.text()).keyup(function (event) {
            event = event || window.event;
            var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            if (keyCode !== 13) {
              return;
            }
            var $this = $(this);
            var value = $this.val();
            if (value === '') {
              return;
            }
            $dropdownText.css('display', 'block').text(value);
            $dropdownSelections.prepend($('<li></li>').text(value).data('valueid', 0));
            $this.remove();
          }).blur(function () {
            var $this = $(this);
            var value = $this.val();
            if (value === '') {
              return;
            }
            $dropdownText.css('display', 'block').text(value);
            $dropdownSelections.prepend($('<li></li>').text(value).data('valueid', 0));
            $this.remove();
          }).insertBefore($dropdownText);
          $dropdownText.css('display', 'none');
        }
        $('<li><a></a></li>').appendTo($dropdownSelections);
      }
    }
  });
};

/*
* 关联位置函数
* */
function getIntersectionId (callback) {
  var intersectionid = 0;
  /*拉框选择-开始*/
  Draw.setActive(false);
  boxSelect.setActive(true);//开启拉框选择
  boxSelectLayer = getLayerByName(LYRNAME_INTERSECTION, 'WFS');//设置选择图层
  boxSelectFunction = function (features) {//选取后的处理方法
    if (features.length === 0) return;
    var nodeFeature = features[0];
    //放大到地图
    var coords = nodeFeature.getGeometry().getCoordinates();
    var nodeFeatureExtent = [coords[0] - INTERSECTION_RADIUS, coords[1] - INTERSECTION_RADIUS, coords[0] + INTERSECTION_RADIUS, coords[1] + INTERSECTION_RADIUS];//半径为50m的路口范围
    map.getView().fit(nodeFeatureExtent, map.getSize());
    expReportCurentIntersectionNodeFeature32 = nodeFeature;
    intersectionid = nodeFeature.get('id');
    if (intersectionid > 0) {
      if (nodeFeature.values_.flag === 1) {   // 如果路口已经关联
        $.messager.alert("操作提示", "此路口已经关联，请重新关联位置", "alert");
      } else {
        $.messager.alert("操作提示", "关联成功！", "alert");
        callback(intersectionid, nodeFeature);
      }
    }
    boxSelect.clearSelectFeatures();//清除选择的要素
    boxSelect.setActive(false);//关闭选择
  };
}

/*
* openCreateIntersection (crossno, intersectionid, flag)
* crossno 为路口编号，intersectionid为路口空间id，flag为判断路口显示，1为查看，其他为新建
* 打开新建路口界面函数
* */
// function openCreateIntersection (crossno, intersectionid, flag) {
//   var $createIntersection = $('#create_intersection_window');
//   $createIntersection.dialog({
//     width: '529',
//     top: '110px',
//     left: '10px',
//     shadow: false,
//     href: '../tc/cross/createIntersection.html',
//     onLoad: function () {
//       var createIntersection = new CreateIntersection('create_intersection_window');
//       createIntersection.initCreateIntersection(crossno, intersectionid, flag);
//     }
//   });
//   $createIntersection.dialog('open');
// }

/*
 * CreateIntersection
 * 新建路口界面对象
 * */
function CreateIntersection (id) {
  this.id = id;
}

/*
* createIntersection (crossno)
* crossno 路口编号
* 新建路口界面函数入口
* */
CreateIntersection.prototype.initCreateIntersection = function (crossno, intersectionid, flag) {
  var _this = this;
  var $createIntersection = $('#' + _this.id);   // 获取新建路口界面
  if ($createIntersection.length === 0) {return;}
  $createIntersection.data('intersectionid', 0);
  var $intersectionContentTab = $createIntersection.find('.intersection-content-tab');    // 获取选项卡所在父级
  var $intersectionContentTabMessage = $createIntersection.find('.intersection-content-tab-message'); // 获取选项卡所对应的内容区域
  var $tabMessages = $intersectionContentTabMessage.children();   // 选项卡内容区域各个内容区
  var $intersectionInformation = $createIntersection.find('.intersection-information');

  // 取消按钮操作
  var $intersectionCancelBtn = $createIntersection.find('.intersection-cancel-btn');
  $intersectionCancelBtn.click(function (event) {
      console.log(1);
      $('#create_cross_window').window('close');
    // window.event ? window.event.cancelBubble = true : event.stopPropagation();    // 阻止冒泡行为
    // var tableData = _this.getWeekdayManagmentData();    // 获取工作表/时段表数据
    // var removeManagerids = $weekdayManagment.data('removeManagerids');    // 获取删除的信息，保存的是managerid，以字符串保存
    // $createIntersection.window('close');
    //
    // if (removeManagerids) {   // 如果有删除
    //   var removeManageridArr = [];    // 将managerid字符串转为数组
    //   if (typeof removeManagerids === 'number') {
    //     removeManageridArr.push(removeManagerids);
    //   } else {
    //     removeManageridArr = removeManagerids.split(',');
    //   }
    //   for (var i = 0, idLen = removeManageridArr.length; i < idLen; i++) {
    //     $.ajax({
    //       url: WEBAPI_ADDRESS + '/Tc_phase_manager/Delete',
    //       type: 'Delete',
    //       data: {id: parseInt(removeManageridArr[i])},    // 循环删除对应的managerid数据
    //       dataType: 'json'
    //       // async: false,
    //     });
    //   }
    // }
  });

  var $inputs = $intersectionInformation.find('input.crno-input');         // 获取所有必填的input
  $inputs.each(function () {
    $(this).keyup(function () {   // 绑定键盘事件，如果输入内容为空，星星图片就显示，否则隐藏
      var $this = $(this);
      if ($(this).val() !== '') {
        $this.next().css('display', 'none');
      } else {
        $this.next().css('display', 'block');
      }
    });
  });

  var $crossname = $intersectionInformation.find('.crno-crossname');  // 信号系统路口名
  var $crossno = $intersectionInformation.find('.crno-crossno');  // 信号系统路口编号
  var $annfactory = $intersectionInformation.find('.crno-annfactory');  // 信号机厂家
  var $anntype = $intersectionInformation.find('.crno-anntype');  // 信号机型号
  var $idstr = $intersectionInformation.find('.crno-idstr');  // 信号机编号

  // 关联位置按钮
  var $relatePositionBtn = $createIntersection.find('.relate-position-btn');
  if (crossno) {    // 如果是查询路口进入，则设置关联相位按钮点击失效
    // $relatePositionBtn.css({backgroundColor: '#ccc', color: '#fff'});
    $relatePositionBtn.addClass('bgcolor-ccc-btn');
    if (flag === 1) {
      $createIntersection.prev().find('.panel-title').text('路口查看');
      $createIntersection.find('div.hide-footer').css('display', 'none');
    } else {
      $createIntersection.prev().find('.panel-title').text('路口基础信息');
    }
  } else if (intersectionid) {
    $relatePositionBtn.css({backgroundColor: '#ccc', color: '#fff'});
    $createIntersection.prev().find('.panel-title').text('新建路口');
    if (intersectionid > 0) {   // 如果关联到路口，获取路口ID--intersectidAddRode，并设置为页面的data属性
      $createIntersection.data('intersectionid', intersectionid);   // 设置页面的data属性intersectionid，路口空间ID
      $.get(WEBAPI_ADDRESS + '/Annunciator/GetByIntersectionID?id=' + intersectionid, function (data, status) {
        if (data.data.length > 0) {
          var dataInformatiion = data.data[0];
          $crossname.val(dataInformatiion.crossname);  // 信号系统路口名
          $crossno.val(dataInformatiion.crossid);  // 信号系统路口编号
          $annfactory.text(dataInformatiion.annfactory);  // 信号机厂家
          $anntype.text(dataInformatiion.anntype);  // 信号机型号
          $idstr.val(dataInformatiion.idstr);  // 信号机编号
        }
        // 路口结构界面初始化
        // _this.initIntersectionStructure(intersectionid);
      });
    }
  } else {
    $relatePositionBtn.css('background-color', '#1b7ac4');    // 设置背景，初始背景
    $createIntersection.prev().find('.panel-title').text('新建路口');
    $relatePositionBtn.click(function () {
      getIntersectionId(function (intersectionid, nodeFeature) {
         // 如果关联到路口，获取路口ID--intersectidAddRode，并设置为页面的data属性
          $createIntersection.data('intersectionid', intersectionid);   // 设置页面的data属性intersectionid，路口空间ID
          $.get(WEBAPI_ADDRESS + '/Annunciator/GetByIntersectionID?id=' + intersectionid, function (data, status) {
            if (data.data.length > 0) {
              var dataInformatiion = data.data[0];
              $crossname.val(dataInformatiion.crossname);  // 信号系统路口名
              $crossno.val(dataInformatiion.crossid);  // 信号系统路口编号
              $annfactory.text(dataInformatiion.annfactory);  // 信号机厂家
              $anntype.text(dataInformatiion.anntype);  // 信号机型号
              $idstr.val(dataInformatiion.idstr);  // 信号机编号
            }
            // 路口结构界面初始化
            // _this.initIntersectionStructure(intersectionid);
          });
      });
    });
  }

  // 路口基本信息界面初始化
  _this.initIntersectionInformation(crossno);

  // 工作表/时段表管理
  // 添加行按鈕提示
  var $weekdayManagment = $createIntersection.find('.weekday-managment');
  var $intersectionNumber = $weekdayManagment.find('.intersection-number'); // 路口编号

  // 点击tab选择
  $intersectionContentTab.on('click', 'li', function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    var $this = $(this);
    if ($intersectionNumber.text() === '' && $this.index() !== 0) {
      $.messager.alert('操作提示', '请先新建路口基本信息！', 'error');
    } else {
      var index = $this.index();
      $this.addClass('li-active').siblings().removeClass('li-active');
      $tabMessages.css('display', 'none').eq(index).css('display', 'block');
      if (_this.id === 'createIntersection') {    // 新建路口界面宽度变化
        switch (index) {
          case 0:
          case 1:
            $createIntersection.css('width', '515px');
            $createIntersection.prev().css('width', '515px');
            $createIntersection.parent().css('width', '525px');
            if ($createIntersection.find('.intersection-structure-tab-message img').length === 0) {
              // 路口结构界面初始化
              _this.initIntersectionStructure($createIntersection.data('intersectionid'));
            }
            break;
          case 2:
            $createIntersection.css('width', '780px');
            $createIntersection.prev().css('width', '780px');
            $createIntersection.parent().css('width', '790px');
            break;
        }
      } else {         // 路口编辑界面宽度变化
        switch (index) {
          case 0:
          case 1:
            $createIntersection.css('width', '716px');
            $createIntersection.prev().css('width', '716px');
            $createIntersection.parent().css('width', '726px');
            $createIntersection.find('.intersection-manager-content-right').css('width', '515px');
            if ($createIntersection.find('.intersection-structure-tab-message img').length === 0) {
              // 路口结构界面初始化
              _this.initIntersectionStructure($createIntersection.data('intersectionid'));
            }
            break;
          case 2:
            $createIntersection.css('width', '981px');
            $createIntersection.prev().css('width', '981px');
            $createIntersection.parent().css('width', '991px');
            $createIntersection.find('.intersection-manager-content-right').css('width', '780px');
            break;
        }
      }
    }
  });
};

/*
 * initIntersectionInformation ()
 * 路口基本信息界面初始化
 * */
CreateIntersection.prototype.initIntersectionInformation = function (crossno, flag) {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $intersectionInformation = $createIntersection.find('.intersection-information');   // 路口基本信息界面
  if (crossno) {
    $.ajax({
      url: WEBAPI_ADDRESS + '/Tc_cr_createbasic/Get',
      type: 'GET',
      data: {crno: crossno},
      dataType: 'json',
      async: false,
      success: function (data, status) {
        if (data.statusCode === 2000) {
          var dataInformatiion = data.data[0];
          $createIntersection.data('intersectionid', dataInformatiion.crossid);
          $intersectionInformation.find('.crno-createname').text(dataInformatiion.createname);  // 用户名称
          $intersectionInformation.find('.crno-createtime').text(dataInformatiion.createtime.replace('T', ' '));  // 建档时间
          $intersectionInformation.find('.crno-cralias').val(dataInformatiion.cralias);    // 路口别称
          $intersectionInformation.find('.crno-crossname').val(dataInformatiion.crossname);  // 信号系统路口名
          $intersectionInformation.find('.crno-crossno').val(dataInformatiion.crossno).attr('disabled', 'true');  // 信号系统路口编号
          $intersectionInformation.find('.crno-crosstype').text(dataInformatiion.crosstype);  // 路口类型
          $intersectionInformation.find('.crno-annfactory').text(dataInformatiion.annfactory);  // 信号机厂家
          $intersectionInformation.find('.crno-region').text(dataInformatiion.region);  // 所属辖区
          $intersectionInformation.find('.crno-anntype').text(dataInformatiion.anntype);  // 信号机型号
          $intersectionInformation.find('.crno-manager').text(dataInformatiion.manager);  // 路口管理单位
          $intersectionInformation.find('.crno-idstr').val(dataInformatiion.idstr);  // 信号机编号
          $intersectionInformation.find('.crno-degree').text(dataInformatiion.degree);  // 重要程度
          $intersectionInformation.find('.crno-webtype').text(dataInformatiion.webtype);  // 联网方式
          $intersectionInformation.find('.crno-lighttype').text(dataInformatiion.lighttype);  // 亮灯方式
          $intersectionInformation.find('.crno-timetype').text(dataInformatiion.timetype);  // 授时方式
          $intersectionInformation.find('.crno-monitorno').val(dataInformatiion.monitorno);  // 监控编号
          $intersectionInformation.find('.crno-planmaintain').text(dataInformatiion.planmaintain);  // 方案维护单位
          $intersectionInformation.find('.crno-devicemaintain').text(dataInformatiion.devicemaintain);  // 设备维护单位

          $intersectionInformation.find('img.crno-star').css('display', 'none');

          // 渲染工作表/时段表管理界面
          // 路口结构界面初始化
          // _this.initIntersectionStructure(dataInformatiion.crossid);
          // 渲染工作表/时段表管理界面
          $.ajax({
            url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetNum',
            type: 'GET',
            data: {crossno: crossno},
            dataType: 'json',
            async: false,
            success: function (data, status) {
              if (data.statusCode === 2000) {
                var num = data.data[0].id;
                $.ajax({
                  url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetByTypePageWithDay',
                  type: 'GET',
                  data: {
                    crossno: dataInformatiion.crossno,
                    num: num === 0 ? 1 : num,
                    pno: 1,
                    flag: $intersectionInformation.find('.crno-anntype').text().toLowerCase().indexOf('scats') !== -1 ? 1 : 0
                  },
                  dataType: 'json',
                  async: false,
                  success: function (data, status) {
                    if (data.statusCode === 2000) {
                      _this.putIntersectionInformationData();   // 修改数据
                      var len = data.data === null ? 1 : data.data.length;
                      var obj = {
                        crossname: dataInformatiion.crossname,
                        crossno: dataInformatiion.crossno,
                        anntype: dataInformatiion.anntype
                      };
                      _this.initPaginations(len);   // 初始化分页码
                      _this.initWorkdayManagment(obj, data.data);
                    }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.messager.alert('操作提示', '获取数据失败，请重新打开！', 'error');
                  }
                });
              }
            }
          });
        }
      }
    });
  } else {
    $intersectionInformation.find('.crno-createname').text(sessionStorage.fwgistwebsiteusername);  // 用户名称
    $intersectionInformation.find('.crno-createtime').text(getTodayDate().replace('T', ' '));   // 建档时间
    _this.postIntersectionInformationData();    // 保存数据
  }

  // 下拉列表
  var dropDown = new DropDown('drop-down', 'drop-down-text', 'drop-down-selections');

  // 初始化下拉列表
  var $dropdown = $intersectionInformation.find('div.drop-down');
  dropDown.getValue(203000, $dropdown.eq(0));   // 路口类型
  dropDown.getValue(201500, $dropdown.eq(1));   // 所属辖区
  dropDown.getValue(203700, $dropdown.eq(2));   // 信号机厂家
  dropDown.getValue(203400, $dropdown.eq(3));   // 路口管理单位
  dropDown.getValue(203800, $dropdown.eq(4));   // 信号机型号
  dropDown.getValue(203100, $dropdown.eq(5));   // 重要程度
  dropDown.getValue(203200, $dropdown.eq(6));   // 亮灯方式
  dropDown.getValue(203500, $dropdown.eq(7));   // 联网方式
  dropDown.getValue(203600, $dropdown.eq(8));   // 授时方式
  dropDown.getValue(203300, $dropdown.eq(9));   // 方案维护单位
  dropDown.getValue(203900, $dropdown.eq(10));   // 设备维护单位

  // 下拉列表点击事件
  dropDown.clickDropDown();
};

/*
 * getIntersectionInformationData ()
 * 路口基本信息界面 -- 获取数据
 * */
CreateIntersection.prototype.getIntersectionInformationData = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $intersectionInformation = $createIntersection.find('.intersection-information');   // 路口基本信息界面
  var crnoCreatenameText = $intersectionInformation.find('.crno-createname').text();  // 用户名称
  var crnoCreatetimeText = $intersectionInformation.find('.crno-createtime').text();  // 建档时间
  var crnoCraliasText = $intersectionInformation.find('.crno-cralias').val();    // 路口别称
  var crnoCrossnameText = $intersectionInformation.find('.crno-crossname').val();  // 信号系统路口名
  var crnoCrossnoText = $intersectionInformation.find('.crno-crossno').val();  // 信号系统路口编号
  var crnoCrosstypeText = $intersectionInformation.find('.crno-crosstype').text();  // 路口类型
  var crnoAnnfactoryText = $intersectionInformation.find('.crno-annfactory').text();  // 信号机厂家
  var crnoRegionText = $intersectionInformation.find('.crno-region').text();  // 所属辖区
  var crnoAnntypeText = $intersectionInformation.find('.crno-anntype').text();  // 信号机型号
  var crnoManagerText = $intersectionInformation.find('.crno-manager').text();  // 路口管理单位
  var crnoIdstrText = $intersectionInformation.find('.crno-idstr').val();  // 信号机编号
  var crnoDegreeText = $intersectionInformation.find('.crno-degree').text();  // 重要程度
  var crnoWebtypeText = $intersectionInformation.find('.crno-webtype').text();  // 联网方式
  var crnoLighttypeText = $intersectionInformation.find('.crno-lighttype').text();  // 亮灯方式
  var crnoTimetypeText = $intersectionInformation.find('.crno-timetype').text();  // 授时方式
  var crnoMonitornoText = $intersectionInformation.find('.crno-monitorno').val();  // 监控编号
  var crnoPlanmaintainText = $intersectionInformation.find('.crno-planmaintain').text();  // 方案维护单位
  var crnoDevicemaintainText = $intersectionInformation.find('.crno-devicemaintain').text();  // 设备维护单位

  var obj = {
    crossno:	crnoCrossnoText,
    crossid: $createIntersection.data('intersectionid'),
    cralias: crnoCraliasText,
    lighttype: crnoLighttypeText,
    annunciatorno: crnoIdstrText,
    monitorno: crnoMonitornoText,
    createname: crnoCreatenameText,
    createtime: crnoCreatetimeText.replace(' ', 'T'),
    planmaintain: crnoPlanmaintainText,
    devicemaintain: crnoDevicemaintainText,
    region: crnoRegionText,
    manager: crnoManagerText,
    sysflag:	0,
    username: sessionStorage.fwgistwebsiteusername,
    edittime: getTodayDate(),
    crosstype: crnoCrosstypeText,
    degree: crnoDegreeText,
    idstr: crnoIdstrText,
    crossname: crnoCrossnameText,
    annfactory: crnoAnnfactoryText,
    anntype: crnoAnntypeText,
    webtype: crnoWebtypeText,
    timetype: crnoTimetypeText
  };
  return obj;
};

/*
 * putIntersectionInformationData ()
 * 路口基本信息界面 -- 保存修改数据
 * */
CreateIntersection.prototype.putIntersectionInformationData = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $intersectionInformation = $createIntersection.find('.intersection-information');   // 路口基本信息界面
  var $intersectionSaveBtn = $intersectionInformation.find('.intersection-save-btn');     // 保存按钮
  $intersectionSaveBtn.unbind('click').click(function (event) {    // 保存按钮事件
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    var $inputs = $intersectionInformation.find('input.crno-input');         // 获取所有的input
    var i = 0;
    var len = $inputs.length;
    for (i = 0; i < len; i++) {   // Input为必填
      var $this = $inputs.eq(i);
      if ($this.val() === '') {
        $.messager.alert('操作提示', $this.prev().text().replace(':', '') + '不能为空！', 'error');
        return;
      }
    }
    // for (i = 0; i < len; i++) {     // 如果为空，则返回
    //   var $this = $inputs.eq(i);
    //   if ($this.val() === '') {
    //     return;
    //   }
    // }
    var obj = _this.getIntersectionInformationData();   // 获取所有信息
    var crnoCrossnoText = $intersectionInformation.find('.crno-crossno').val();  // 信号系统路口编号

    $intersectionInformation.data('crossno', crnoCrossnoText);    // 设置crossno属性
    $.ajax({
      url: WEBAPI_ADDRESS + '/Tc_cr_createbasic/Put',
      type: 'Put',
      data: {value: JSON.stringify(obj)},
      dataType: 'json',
      async: false,
      success: function (data, status) {
        if (data.statusCode === 2000) {
          $.ajax({
            url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetNum',
            type: 'GET',
            data: {crossno: obj.crossno},
            dataType: 'json',
            success: function (data, status) {
              if (data.statusCode === 2000) {
                var num = data.data[0].id;
                $.ajax({
                  url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetByTypePageWithDay',
                  type: 'GET',
                  data: {
                    crossno: obj.crossno,
                    num: num === 0 ? 1 : num,
                    pno: 1,
                    flag: obj.anntype.toLowerCase().indexOf('scats') !== -1 ? 1 : 0   // 判断是否是scats系统
                  },
                  dataType: 'json',
                  success: function (data, status) {
                    if (data.statusCode === 2000) {
                      // 如果保存成功后，則渲染工作表/时段表管理界面
                      var len = data.data === null ? 1 : data.data.length;
                      // _this.putIntersectionInformationData();   // 修改数据
                      $.messager.show({
                        timeout: 1000,
                        msg: '修改成功',
                        title: '提示'
                      });
                      _this.initPaginations(len);   // 初始化分页码
                      _this.initWorkdayManagment(obj, data.data);   // 初始化工作表/时段表管理界面
                      $('#IntersectionManagement_html .pagination-load').trigger('click');
                    }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.messager.alert('操作提示', '获取数据失败，请重新获取！', 'error');
                  }
                });
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              $.messager.alert('操作提示', '获取数据失败，请重新获取！', 'error');
            }
          });
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $.messager.alert('操作提示', '获取数据失败，请重新获取！', 'error');
      }
    });
  });
};

/*
 * postIntersectionInformationData ()
 * 路口基本信息界面 -- 保存添加数据
 * */
CreateIntersection.prototype.postIntersectionInformationData = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $intersectionInformation = $createIntersection.find('.intersection-information');   // 路口基本信息界面
  var $intersectionSaveBtn = $intersectionInformation.find('.intersection-save-btn');   // 保存按钮
  $intersectionSaveBtn.unbind('click').click(function (event) {   // 保存按钮事件
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    if ($createIntersection.data('intersectionid') > 0) {   // 如果有关联到路口
      var obj = _this.getIntersectionInformationData();   // 获取界面信息
      var crnoCrossnoText = $intersectionInformation.find('.crno-crossno').val();  // 信号系统路口编号
      var $inputs = $intersectionInformation.find('input.crno-input');         // 获取所有的input
      var i = 0;
      var len = $inputs.length;
      for (i = 0; i < len; i++) {   // Input为必填
        var $this = $inputs.eq(i);
        if ($this.val() === '') {
          $.messager.alert('操作提示', $this.prev().text().replace(':', '') + '不能为空！', 'error');
          return;
        }
      }
      // for (i = 0; i < len; i++) {     // 如果为空，则返回
      //   var $this = $inputs.eq(i);
      //   if ($this.val() === '') {
      //     return;
      //   }
      // }

      $intersectionInformation.data('crossno', crnoCrossnoText);  // 路口编号
      $.ajax({
        url: WEBAPI_ADDRESS + '/Tc_cr_createbasic/JudgeUnique',
        type: 'GET',
        data: {crno: crnoCrossnoText},
        dataType: 'json',
        success: function (data, status) {
          if (data.data === 1) {      // 判断路口编号是否存在
            $.messager.alert('操作提示', '路口编号已存在，请重新输入！', 'error');
          } else if (data.data === 0) {
            $.ajax({
              url: WEBAPI_ADDRESS + '/Tc_cr_createbasic/Post',
              type: 'Post',
              data: {value: obj},
              dataType: 'json',
              success: function (data, status) {
                if (data.statusCode === 2000) {
                  // 如果保存成功后，则渲染工作表/时段表管理界面
                  // getLayerByName(LYRNAME_INTERSECTION,'WFS').getSource().clear();
                  var vectorSource=getLayerByName(LYRNAME_INTERSECTION,'WFS').getSource();
                  vectorSource.clear();
                  $.messager.show({
                    timeout: 1000,
                    msg: '保存成功',
                    title: '提示'
                  });
                  _this.initPaginations(1);   // 初始化分页码
                  _this.initWorkdayManagment(obj);  // 初始化工作表/时段表管理界面
                }
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.messager.alert('操作提示', '保存失败！', 'error');
              }
            });
          }
        }
      });
    } else {
      $.messager.alert('操作提示', '请关联位置！', 'error');
    }
  });
};

/*
 * initIntersectionStructure ()
 * 路口结构界面初始化
 * */
CreateIntersection.prototype.initIntersectionStructure = function (crossid) {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $intersectionStructure = $createIntersection.find('.intersection-structure');   // 路口结构界面
  var $intersectionEditBtn = $intersectionStructure.find('.intersection-edit-btn');   // 路口编辑按钮
  var $traficSignal = $createIntersection.find('.intersection-structure-tab li').first();

  var $tab = $createIntersection.find('ul.intersection-structure-tab');
  var $contents = $createIntersection.find('.intersection-structure-tab-message').children();
  $tab.off('click').on('click', 'li', function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    var $this = $(this);
    var index = $this.index();
    $this.addClass('li-active').siblings().removeClass('li-active');
    $contents.css('display', 'none').eq(index).css('display', 'block');
  });

  if (crossid > 0) {    // crossid 为空间路口ID
    var $message = $createIntersection.find('.intersection-structure-tab-message1');
    var $map = $('#map');
    zoomToNodeById(crossid, function (nodeFeature) {
      if (nodeFeature === undefined) { return;}
      createIntersectionSketchMap(nodeFeature, _this.id);    // 信号管控组织图片显示
      setTimeout(function () {
        exportMapByInersection(nodeFeature, function (url) {       // 交通信号组织
          $message.empty();    // 设置交通信号组织图片显示
          $('<img src="' + url + '">').css({
            width: 'auto',
            height: '351px',
            marginLeft:  - 351 / 2 * ($map.width() / $map.height()) + 491 / 2 + 'px'
          }).appendTo($message);
        });
      }, 1500);
      $traficSignal.click(function () {    // 交通信号组织
        exportMapByInersection(nodeFeature, function (url) {
          $message.empty();    // 设置交通信号组织图片显示
          $('<img src="' + url + '">').css({
            width: 'auto',
            height: '351px',
            marginLeft:  - 351 / 2 * ($map.width() / $map.height()) + 491 / 2 + 'px'
          }).appendTo($message);
        });
      });
      // 路口编辑按钮事件
      $intersectionEditBtn.click(function (event) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        openMasterEditorDialog(nodeFeature, _this.id);    // 打开路口交通组织按钮
        $createIntersection.window('close');   // 隐藏新建路口界面或路口编辑页面，等关闭路口交通组织页面时显示
      });
    });
  }
};

/*
 * initWorkdayManagment ()
 * 工作表/时段表管理界面初始化
 * */
CreateIntersection.prototype.initWorkdayManagment = function (object, data) {
  var _this = this;
  var $createIntersection = $('#' + _this.id);                       // 新建路口界面
  var $weekdayManagment = $createIntersection.find('.weekday-managment');   // 工作表/时段表管理界面

  var $intersectionName = $weekdayManagment.find('.intersection-name');     // 路口名称
  $intersectionName.text(object.crossname);
  var $intersectionNumber = $weekdayManagment.find('.intersection-number'); // 路口编号
  $intersectionNumber.text(object.crossno);
  var intersectionNumberText = $intersectionNumber.text();
  var $annunciatorType = $weekdayManagment.find('.annunciator-type');        // 信号机类型
  $annunciatorType.text(object.anntype);

  if ($intersectionNumber.text() === '-1') {
    $intersectionNumber.text('null');
    return;
  }

  var $table = $weekdayManagment.find('table');                                // 获取管理表格
  var $tableLastTr = $table.find('tr').last();                                 // 表格最后一行，也就是說添加按鈕一行

  $table.empty().append($tableLastTr);

  var $workday = $('#workday');                                               // 時段表管理界面
  var $scatsWorkday = $('#scatsWorkday');                                    // scats 時段表管理界面

  var obj = {      // 需要傳入到時段表管理界面的對象參數
    crossname: object.crossname,
    crossno: object.crossno,
    anntype: object.anntype
  };

  // 添加行按鈕
  var $addTrBtn = $tableLastTr.find('.add-tr-btn');
  $addTrBtn.click(function (event) {
    _this.createIntersectionTr($weekdayManagment);
    return false;
  });

  // 循环遍历数据渲染页面
  if (data) {
    for (var i = 0,  len = data.length; i < len; i++) {
      var weekdays = data[i].weekday.split('');
      var $tr = $('<tr></tr>').data('managerid', data[i].managerid).insertBefore($tableLastTr);
      $('<td></td>').text(i + 1).appendTo($tr);
      $('<td></td>').text(data[i].phasename).appendTo($tr);  // 时段表名称
      $('<td></td>').text(data[i].phaseno).appendTo($tr);    // 时段表编号
      var $td = $('<td>' +    // 星期执行日
        '<ul class="week-day"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li></ul>' +
        '<ul class="week-day-select"><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>' +
        '</td>')
        .appendTo($tr);
      for (var j = 0, wLen = weekdays.length; j < wLen; j++) {
        if (weekdays[j] === '1') {
          $td.children('ul.week-day-select').children().eq(j).addClass('li-active');
        }
      }
      $('<td>' +
          '<input class="specialday" type="text" style="width: 80%; height: 20px;">' +
        '</td>').appendTo($tr);    // 特殊日
      var specialday = data[i].specialday.split('T')[0];
      if (specialday === '1900-01-01') {specialday = '';}
      $tr.find('.specialday').datebox({
        required: true
      }).datebox("setValue", specialday);
      $('<td><a class="weekday-edit-btn" href="javascript:;"></a></td>').appendTo($tr);   // 时段表
      $('<td><a class="remove-tr-btn" href="javascript:;"></a></td>').appendTo($tr);      // 操作
    }
  }

  // 星期执行日点击选择
  $table.unbind('click').on('click', 'ul.week-day-select li', function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    $(this).toggleClass('li-active');
  });

  _this.clickChangePage();  // 点击改变页码

  // if ($weekdayManagment.find('.weekday-managment-footer').css('display') === 'none') {return;}
  // 时段表编辑按鈕
  $table.on('click', 'a.weekday-edit-btn', function (event) {
    obj.managerid = $(this).parents('tr').data('managerid');
    anntype = $weekdayManagment.find('.annunciator-type').text();  // 信号机类型
    if (anntype.replace(/^\w/g, '') !== '' && anntype.toLowerCase().indexOf('scats') !== -1) {    // 判断信号机类型是否是scats系統
      openScatsIntersectionWeekday(obj);
    } else {
      openIntersectionWeekday(obj);
    }
    return false;
  });

  // 操作 - 删除钮
  $table.on('click', 'a.remove-tr-btn', function (event) {
    var $thisRemoveTr = $(this).parents('tr');
    var thisRemoveTrManagerid = $thisRemoveTr.data('managerid');
    var removeManagerids = $weekdayManagment.data('removeManagerids');
    if (removeManagerids === undefined) {
      removeManagerids = thisRemoveTrManagerid;
    } else {
      removeManagerids += ',' + thisRemoveTrManagerid;
    }
    $weekdayManagment.data('removeManagerids', removeManagerids);
    $thisRemoveTr.remove();   // 删除该行
    var $tbodyTrs = $table.find('tbody tr');  // 获取tbody中所有的行
    var length = $tbodyTrs.length;    // 获取行数
    // 重新排列序号，從小到大
    $tbodyTrs.each(function () {
      var $thisTr = $(this);
      if ($thisTr.index() === length - 1) {return;}
      $thisTr.children('td').first().text($thisTr.index() + 1);
    });
    if (length % 3 === 0) {
      // 初始化分页码
      _this.initPaginations(length - 1);
      // 点击改变页码
      _this.clickChangePage();
      return false;
    }
    return false;
  });

  _this.dblclickPhase();    // 双击编辑
  _this.weekdayManagmentSave(); // 保存数据
};

/*
* initPaginations ()
* 工作表/时段表管理界面 -- 分页码初始化
* */
CreateIntersection.prototype.initPaginations = function (num) {
  var _this = this;
  var $weekdayManagment = $('#' + _this.id).find('.weekday-managment');   // 工作表/时段表管理
  var $pageBtnWrap = $weekdayManagment.find('.page-btn-wrap');
  $pageBtnWrap.empty();
  $('<a class="prev-page-btn"></a><a class="next-page-btn"></a>').appendTo($pageBtnWrap);
  var $nextPageBtn = $weekdayManagment.find('a.next-page-btn');
  var len = Math.ceil((num + 1) / 3);
  for (var i = 1; i <= len; i++) {
    if (i === 1) {
      $('<a class="page-active"></a>').text(i).insertBefore($nextPageBtn);
    } else {
      $('<a></a>').text(i).insertBefore($nextPageBtn);
    }
  }
};

/*
* clickChangePage ()
* 工作表/时段表管理界面 -- 點擊頁碼切換頁面顯示
* */
CreateIntersection.prototype.clickChangePage = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);                       // 新建路口界面
  var $weekdayManagment = $createIntersection.find('.weekday-managment');   // 工作表/时段表管理
  var height = $weekdayManagment.find('.middle-message').height() - 1;       // 获取分页的高度
  var $table = $weekdayManagment.find('table');     // 用来分页的table
  var $pageBtnWrap = $weekdayManagment.find('.page-btn-wrap');    // 分页按钮框
  var $links = $pageBtnWrap.children('a');    // 分页按钮

  $table.css('top', 0);   // 设置初始高度为0
  $links.on('click', function (event) {   // 点击分页按钮显示对应的界面
    var $this = $(this);
    var index = $this.index();
    var $pageActive = $pageBtnWrap.find('.page-active');    // 获取当前的有效
    var top = $table.position().top;
    var pageActiveIndex = $pageActive.index();
    if (index === 0) {
      if (pageActiveIndex === 1) {return;}
      $pageActive.removeClass('page-active').prev().addClass('page-active');
      $table.css('top', top + height);
    } else if (index === $links.length - 1) {
      if (pageActiveIndex === $links.length - 2) {return;}
      $table.css('top', top - height);
      $pageActive.removeClass('page-active').next().addClass('page-active');
    } else {
      $this.addClass('page-active').siblings().removeClass('page-active');
      $table.css('top', - (index - 1) * height);
    }
  });
};

/*
* createIntersectionTr ()
* 添加表格的行
* */
CreateIntersection.prototype.createIntersectionTr = function ($weekdayManagment) {
  var _this = this;
  var crossno = $weekdayManagment.find('.intersection-number').text(); // 路口编号
  var $table = $weekdayManagment.find('table');                                // 获取管理表格
  var $tableLastTr = $table.find('tr').last();                                 // 表格最后一行，也就是說添加按鈕一行
  $.get(WEBAPI_ADDRESS + '/Tc_phase_manager/GetSeqNextVal', function (data, status) {   // 获取新的managerid
    var newManagerid = data.data[0].id;   // 获取新的managerid
    var saveData = {    // 默认的数据
      managerid:	newManagerid,
      phasename:	'',
      phaseno:	'',
      weekday: "0000000",
      specialday: "1900-01-01T15:51:55",
      sysflag:	0,
      username: sessionStorage.fwgistwebsiteusername,
      edittime: '2017-07-04T15:51:55',
      crossno:	crossno,
      d1:	'0',
      d2:	'0',
      d3:	'0',
      d4:	'0',
      d5:	'0',
      d6:	'0',
      d7:	'0'
    };
    $.ajax({     // 添加一行后保存默认的数组到后台，为了可以直接调用时段表界面
      url: WEBAPI_ADDRESS + '/Tc_phase_manager/Post',
      type: 'POST',
      data: saveData,
      dataType: 'json',
      success: function (data, status) {
        if (data.statusCode === 2000) {
          var orderNum = parseInt($tableLastTr.prev().children('td').first().text()) + 1;  // 最後一行的序號
          if (!orderNum) {orderNum = 1;}    // 如果是新添加的，则设置为1
          // 添加默认格式的行
          var $tr = $('<tr>' +
            '<td>' + orderNum + '</td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>' +
            '<ul class="week-day"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li></ul>' +
            '<ul class="week-day-select"><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>' +
            '</td>' +
            '<td><input class="specialday" type="text" style="width: 80%; height: 20px;"></td>' +
            '<td><a class="weekday-edit-btn" href="javascript:;"></a></td>' +
            '<td><a class="remove-tr-btn" href="javascript:;"></a></td>' +
            '</tr>')
            .data('managerid', newManagerid)
            .insertBefore($tableLastTr);
          $tr.find('.specialday').datebox({   // 特殊日设置
            required: true
          });
          // 星期执行日点击选择
          if (orderNum % 3 === 0) {
            // 初始化分頁碼
            _this.initPaginations(orderNum);
            // 點擊改變頁碼
            _this.clickChangePage();
          }
        }
      }
    });
  });
};

/*
 * dblclickPhase ()
 * 工作表/时段表管理界面 -- 时段表名称和时段表编号双击编辑事件
 * */
CreateIntersection.prototype.dblclickPhase = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);                       // 新建路口界面
  var $weekdayManagment = $createIntersection.find('.weekday-managment');   // 工作表/时段表管理
  var $table = $weekdayManagment.find('table');                                // 获取管理表格

  // 双击表格里的 td 添加一个编辑框，可以编辑 td 里的内容
  $table.unbind('dblclick').on('dblclick', 'td', function () {
    var $thisTD = $(this);

    // 判断是否为表格行的第一列或第二列
    if ($thisTD.index() === 1 || $thisTD.index() === 2) {
      // 设计该点击元素的定位为相对定位，并获取高与宽
      // $thisTD.css('position', 'relative');
      var height = $thisTD.height();    // td的宽
      var width = $thisTD.width();      // td的高
      var oldText = $thisTD.text();     // td原来的数据
      $thisTD.text('');

      // 创建一个 input 并添加到该点击的元素 td 上，并绑定事件
      var $newInput = $('<input type="text" class="td-input" spellcheck="false">')
        .addClass('create-input')
      .blur(function (event) {    // 失去焦点后的函数，如果没有输入，则不修改原来数据，如果有输入，则修改为输入的数据
        if ($(this).val() !== '') {
          oldText = $(this).val();
        }
        $thisTD.text(oldText);
        $(this).remove();  // 删除添加的Input
      }).keyup(function (event) {    // 按下回车键，如果没有输入，则不修改原来数据，如果有输入，则修改为输入的数据
        event = event || window.event;
        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (keyCode === 13) {
          if ($(this).val() !== '') {
            oldText = $(this).val();
          }
          $thisTD.text(oldText);
          $(this).remove();
        }
      }).appendTo($thisTD);
      $newInput.focus();    // 获取焦点
    }
  });
};

/*
* 工作表/时段表管理界面 -- 获取数据
* */
CreateIntersection.prototype.getWeekdayManagmentData = function () {
  var _this = this;
  var $weekdayManagment = $('#' + _this.id).find('.weekday-managment');
  var $intersectionNumber = $weekdayManagment.find('.intersection-number'); // 路口编号
  var intersectionNumberText = $intersectionNumber.text();
  var $annunciatorType = $weekdayManagment.find('.annunciator-type');       // 信号机类型
  var annunciatorType = $annunciatorType.text().toLowerCase();                // 转为小写
  var $trs = $weekdayManagment.find('table tr');                             // 获取表格所有的行
  var tableData = [];   // 数据以数组形式保存
  $trs.each(function () {
    var $this = $(this);
    if ($this.index() === $trs.length - 1) {return;}    // 最后一行为一个加号，没有数据
    // 特殊日期
    var specialday = $this.children('td').eq(4).find('.specialday').datebox('getValue');
    if (specialday === '') {
      specialday = '1900-01-01'
    }
    var obj = {     // 保存到后台的数据格式
      sysflag:	0,
      username: sessionStorage.fwgistwebsiteusername,
      edittime: "2017-07-04T15:51:55",
      crossno: intersectionNumberText,
      flag: annunciatorType.indexOf('scats') !== -1 ? 1 : 0
    };
    obj.managerid = $this.data('managerid');    // 保存managerid
    obj.phasename = $this.children('td').eq(1).text();    // 时段表名称
    obj.phaseno = $this.children('td').eq(2).text();      // 时段表编号
    obj.specialday = specialday + 'T15:51:55';          // 特殊日
    var $selections = $this.find('ul.week-day-select li');
    var weekdayArr = [];      // 保存星期执行日的数据
    $selections.each(function () {
      var $thisLi = $(this);
      var index = $thisLi.index();
      if ($thisLi.hasClass('li-active')) {
        weekdayArr.push('1');   // 1为选中
      } else {
        weekdayArr.push('0');   // 0为未选中
      }
    });
    obj.weekday = weekdayArr.join('');  // 以字符串形式传输

    // if (obj.weekday.indexOf('1') === -1) {
    //   var removeManagerids = $weekdayManagment.data('removeManagerids');
    //   if (removeManagerids === undefined) {
    //     removeManagerids = obj.managerid;
    //   } else {
    //     removeManagerids += ',' +  obj.managerid;
    //   }
    //   $weekdayManagment.data('removeManagerids', removeManagerids);
    // }

    // 无用数据，配合后台数据格式
    obj.d1 = weekdayArr[0];
    obj.d2 = weekdayArr[1];
    obj.d3 = weekdayArr[2];
    obj.d4 = weekdayArr[3];
    obj.d5 = weekdayArr[4];
    obj.d6 = weekdayArr[5];
    obj.d7 = weekdayArr[6];

    // 将对象添加到数组里
    tableData.push(obj);
  });
  return tableData;
};

/*
* 工作表/时段表管理界面 -- 保存數據
* */
CreateIntersection.prototype.weekdayManagmentSave = function () {
  var _this = this;
  var $createIntersection = $('#' + _this.id);
  var $weekdayManagment = $createIntersection.find('.weekday-managment');
  var $intersectionSaveBtn = $weekdayManagment.find('.intersection-save-btn');    // 保存按钮
  $intersectionSaveBtn.click(function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    var tableData = _this.getWeekdayManagmentData();    // 获取工作表/时段表数据
    var removeManagerids = $weekdayManagment.data('removeManagerids');    // 获取删除的信息，保存的是managerid，以字符串保存

    if (removeManagerids) {   // 如果有删除
      var removeManageridArr = [];    // 将managerid字符串转为数组
      if (typeof removeManagerids === 'number') {
        removeManageridArr.push(removeManagerids);
      } else {
        removeManageridArr = removeManagerids.split(',');
      }
      for (var i = 0, idLen = removeManageridArr.length; i < idLen; i++) {
        $.ajax({
          url: WEBAPI_ADDRESS + '/Tc_phase_manager/Delete',
          type: 'Delete',
          data: {id: parseInt(removeManageridArr[i])},    // 循环删除对应的managerid数据
          dataType: 'json'
          // async: false,
        });
      }
    }
    for (var j = 0; j < tableData.length; j++) {     // 循环保存数据，以修改接口保存
      var data = tableData[j];
      $.ajax({
        url: WEBAPI_ADDRESS + '/Tc_phase_manager/Put',
        type: 'PUT',
        data: {value: JSON.stringify(data)},
        dataType: 'json',
        success: function (data, status) {
          $.messager.show({
            timeout: 1000,
            msg: '保存成功',
            title: '提示'
          });
        }
      });
    }
  });
};


/*********************************** 路口编辑界面 ***********************************/
function openIntersectionManagerPanel () {
  var $intersectionManagerPanel = $('#intersectionManagerPanel');
  $intersectionManagerPanel.dialog({
    width: '720',
    height: '551',
    top: '110px',
    left: '10px',
    shadow: false,
    href: '../tc/cross/intersectionManagerPanel.html',
    onLoad: function () {
      initIntersectionManagerPanel();
    }
  });
  $intersectionManagerPanel.dialog('open');
}

/*
 * intersectionDynamicSearch ($roadDynamicSearch, callback)
 * 路口检索函数
 * $roadDynamicSearch 为路口检索div
 * callbacak (crossid, crossno)，回调函数，参数为路口空间ID和路口编号
 * @author [冼国文]
 * */
function intersectionDynamicSearch ($roadDynamicSearch, callback) {
  var $searchInput = $roadDynamicSearch.find('.road-dynamic-search-input');     // 路口检索输入框
  var $searchBtn = $roadDynamicSearch.find('.road-dynamic-search-btn');         // 路口检索搜索按钮
  var $searchInfo = $roadDynamicSearch.find('.road-dynamic-search-info');       // 路口检索下拉列表
  $searchInput.keyup(function (event) {   // 键盘事件，每输入一个字就申请一次后台获取数据并刷新下拉列表
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    event = window.event || event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (keyCode !== 13) {   // 判断如果按下的不是回车键
      var value = $(this).val();    // 获取输入内容
      if (value !== '') {           // 内容不为空则根据内容进行模糊查询
        $.ajax({
          url: WEBAPI_ADDRESS + '/Tc_name_crossname/GetCrossName',
          type: 'Get',
          data: {name: value},
          dataType: 'json',
          async: false,
          success: function (data, status) {
            var crossname = data.data;
            if (crossname.length === 0) {return;}     // 如果返回的数据为空，则下拉列表不显示，直接返回
            $searchInfo.empty();    // 清空下拉列表，目的是为了防止重复渲染
            for (var i = 0, len = crossname.length; i < len; i++) {
              if (i === 0) {
                // 设置第一个搜索结果的属性为默认值
                $searchInput.data('crossid', crossname[i].crossid).data('crossno', crossname[i].crossno);
              }
              // 根据搜索结果设置对应的属性
              $('<li></li>')
                .text(crossname[i].cralias)
                .data('crossid', crossname[i].crossid)
                .data('crossno', crossname[i].crossno)
                .appendTo($searchInfo);
            }
            // 如果下拉列表有内容，则显示下拉列表
            if ($searchInfo.children().length > 0) {
              $searchInfo.css('display', 'block');
            }
          }
        });
      } else {
        // 设置下拉列表为隐藏
        $searchInfo.css('display', 'none');
      }
    } else {
      // 模拟搜索按钮点击事件
      $searchBtn.click();
    }
  });

  $searchInfo.on('click', 'li', function (event) {      // 点击下拉列表的实现
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    var $this = $(this);
    // 获取点击的路口信息
    $searchInput.val($this.text()).data('crossid', $this.data('crossid')).data('crossno', $this.data('crossno'));
    $searchBtn.click();
  });

  //  搜索按钮点击事件
  $searchBtn.click(function () {        // 点击搜索按钮的实现
    if (callback) {   // 如果有回调函数，则执行回调函数
      callback ($searchInput.data('crossid'), $searchInput.data('crossno'));
    }
  });
}


/*
 * initIntersectionManagerPanel ()
 * 路口编辑初始化函数
 * @author [冼国文]
 * */
function initIntersectionManagerPanel () {
  var $intersectionManagerPanel = $('#intersectionManagerPanel');
  var $intersectionManagerContentLeft = $intersectionManagerPanel.find('.intersection-manager-content-left');
  var $intersectionManagerContentRight = $intersectionManagerPanel.find('.intersection-manager-content-right');
  var createIntersection = new CreateIntersection('intersectionManagerPanel');    // 引用CreateIntersection对象

  // 引用 createIntersection.html 页面
  $intersectionManagerContentRight.load('./tc/cross/createIntersection.html', function () {
    createIntersection.initCreateIntersection('-1');
  });

  // 调用搜索框
  intersectionDynamicSearch($('.intersection-dynamic-search'), function (crossid, crossno) {
    createIntersection.initCreateIntersection(crossno);
  });
}


/*********************************** 下拉列表编辑界面 ***********************************/
/*
 * initEditerDropdown ()
 * 下拉列表编辑初始化函数
 * @author [冼国文]
 * */
function openEditerDropdown ($selectionWrap, text) {
  var $editerDropdown = $('#editerDropdown');   // 类型编辑界面
  $editerDropdown.dialog({
    top: '110px',
    left: '10px',
    shadow: false
  });
  $editerDropdown.dialog('open');
  initEditerDropdown($selectionWrap, text);
}

/*
 * initEditerDropdown ()
 * 下拉列表编辑初始化函数
 * @author [冼国文]
 * */
function initEditerDropdown ($selectionWrap, text) {
  var $editerDropdown = $('#editerDropdown');   // 类型编辑界面
  var $editerLabel = $editerDropdown.find('.editer-label');
  var $editerInput = $editerDropdown.find('#editer-input');   // 输入框
  var $ul = $editerDropdown.find('ul').empty();     // 显示下拉列表内容的列表

  $editerLabel.text(text);

  // 取消按钮操作
  var $editerDropdownCancelBtn = $editerDropdown.find('.editer-cancel-btn');
  $editerDropdownCancelBtn.click(function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();    // 阻止冒泡行为
    $editerDropdown.dialog('close');
  });

  // 渲染 ul
  var $selections = $selectionWrap.children('li');
  if ($selections.length > 0) {
    $selections.each(function () {
      var $this = $(this);
      var index = $this.index();
      if (index === $selections.length - 1) {return;}
      var $li = $('<li></li>')
        .hover(function () {
          $(this).children('a').addClass('animate-right');
        }, function () {
          $(this).children('a').removeClass('animate-right');
        })
        .text($this.text())
        .data('valueid', $this.data('valueid'))
        .appendTo($ul);
      $('<a></a>').appendTo($li);
    });
  }

  // 输入框回车保存
  $editerInput.unbind('keyup').keyup(function (event) {
    event = window.event || event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (keyCode === 13) {
      if ($(this).val() === '') {return;}
      var $li = $('<li></li>')
        .hover(function () {
          $(this).children('a').addClass('animate-right');
        }, function () {
          $(this).children('a').removeClass('animate-right');
        })
        .text($(this).val())
        .data('valueid', 0)
        .appendTo($ul);
      $('<a></a>').css({}).appendTo($li);
      $(this).val('');
    }
  });

  var str = '';
  var array = [];
  // 每一行的删除按钮事件操作
  $ul.unbind('click').on('click', 'a', function () {
    var $thisLi = $(this).parent();
    array.push($thisLi.data('valueid'));
    str += $thisLi.data('valueid') + ',';
    $thisLi.remove();
  });

  // 保存按钮操作
  var $editerDropdownSaveBtn = $editerDropdown.find('.editer-save-btn');
  $editerDropdownSaveBtn.unbind('click').click(function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();    // 阻止冒泡行为
    var id = getIdByText(text);
    saveValue(id, array, $ul);
    var dropdown = new DropDown('drop-down', 'drop-down-text', 'drop-down-selections');
    dropdown.getValue(id, $selectionWrap.parent());
    $editerDropdown.dialog('close');
  });
}

/*
 * getIdByText (text)
 * 获取id
 * @author [冼国文]
 * */
function getIdByText (text) {
  text = text.replace('：', '');
  var number = 0;
  switch (text) {
    case '所在部门':
      number = 201000;
      break;
    case '用户角色':
      number = 201100;
      break;
    case '数据权限':
      number = 201200;
      break;
    case '是否有效':
      number = 201300;
      break;
    case '部门类别':
      number = 201400;
      break;
    case '路口类型':
      number = 203000;
      break;
    case '重要程度':
      number = 203100;
      break;
    case '亮灯方式':
      number = 203200;
      break;
    case '方案维护单位':
      number = 203300;
      break;
    case '路口管理单位':
      number = 203400;
      break;
    case '联网方式':
      number = 203500;
      break;
    case '授时方式':
      number = 203600;
      break;
    case '信号机厂家':
      number = 203700;
      break;
    case '信号机型号':
      number = 203800;
      break;
    case '设备维护单位':
      number = 203900;
      break;
    case '右转渠化':
      number = 204000;
      break;
    case '分隔带':
      number = 204100;
      break;
    case '二次过街':
      number = 204200;
      break;
    case '进口道方向':
      number = 204300;
      break;
    case '独立掉头':
      number = 204400;
      break;
    case '左 直 右':
      number = 204500;
      break;
    case '行人过街':
      number = 204600;
      break;
    case '公车专用':
      number = 204700;
      break;
    case '非机动车':
      number = 204800;
      break;
    case '问题分类':
      number = 205000;
      break;
    case '巡检方式':
      number = 205100;
      break;
    case '紧急程度':
      number = 205200;
      break;
    case '所属辖区':
      number = 201500;
      break;
    case '绿路类型':
      number = 205500;
      break;
    case '协调方向':
      number = 205600;
      break;
    case '舆情来源':
      number = 206000;
      break;
  }
  return number;
}

/*
 * saveValue (id, array, $ele)
 * id 为传递到后台的参数，array为删除的id数组，$ele为需要添加下拉列表的对象
 * 下拉列表获取内容
 * */
function saveValue (id, array, $ele) {
  var $selections = $ele.children('li');
  if (array.length > 0) {
    for (var i = 0, len = array.length; i < len; i++) {
      $.ajax({
        url: WEBAPI_ADDRESS + '/Tc_sys_value/Delete',
        type: 'Delete',
        data: {id: parseInt(array[i])},
        dataType: 'json',
        async: false
      });
    }
  }

  var arr = [];
  $selections.each(function () {
    var $this = $(this);
    if ($this.data('valueid') !== 0) {return;}
    var obj = {
      valueid: 0,
      itemid: id,
      val: $this.text()
    };
    arr.push(obj);
  });

  $.ajax({
    url: WEBAPI_ADDRESS + '/Tc_sys_value/Post',
    type: 'Post',
    data: {value: JSON.stringify(arr)},
    dataType: 'json',
    async: false
  });
}


/******************************************** 工作表/时段表管理界面 ********************************************/
/*
 * openWeekdayManager ()
 * 工作表/时段表管理界面打开函数
 * */
function openWeekdayManager (crossno, callback) {
  var $weekdayManager = $('#weekdayManager');
  $weekdayManager.dialog({
    width: '794',
    top: '110px',
    left: '10px',
    href: '../tc/cross/weekdayManager.html',
    onLoad: function () {
      initWeekdayManager(crossno, callback);
    }
  });
  $weekdayManager.dialog('open');
}


/*
 * initWeekdayManager ()
 * 工作表/时段表管理界面初始化
 * */
function initWeekdayManager (crossno, callback) {
  var $weekdayManager = $('#weekdayManager');                       // 工作表/时段表管理界面

  var result = [];
  var problemsId = getExistenceProblemsID();
  requestServiceObj.ajaxSyncRequestGet('Tc_tune_problem/Get', {id: problemsId}, function (data) {
    if (data.statusCode === 2000) {
      result = data.data;
    }
  });

  $.ajax({
    url: WEBAPI_ADDRESS + '/Tc_cr_createbasic/Get',
    type: 'GET',
    data: {crno: crossno},
    dataType: 'json',
    async: false,
    success: function (data, status) {
      $weekdayManager.find('.intersection-name').text(data.data[0].crossname);
      $weekdayManager.find('.intersection-number').text(crossno);
      $weekdayManager.find('.annunciator-type').text(data.data[0].anntype);
    }
  });

  var crossname = $weekdayManager.find('.intersection-name').text();   // 路口名称
  var anntype = $weekdayManager.find('.annunciator-type').text();  // 信号机类型
  var $table = $weekdayManager.find('table');                                // 获取管理表格

  $table.empty();   // 清空表格
  var obj = {
    managerid: 0,
    crossname: crossname,
    crossno: crossno,
    anntype: anntype,
    timeTableName: '',
    periodids: ''
  };

  // 根据路口编号获取数据渲染表格
  $.ajax({
    url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetNum',
    type: 'GET',
    data: {crossno: crossno},
    dataType: 'json',
    async: false,
    success: function (data, status) {
      if (data.statusCode === 2000) {
        var num = data.data[0].id;
        $.ajax({
          url: WEBAPI_ADDRESS + '/Tc_phase_manager/GetByTypePageWithDay',
          type: 'GET',
          data: {
            crossno: crossno,
            num: num,
            pno: 1,
            flag: anntype.toLowerCase().indexOf('scats') !== -1 ? 1 : 0
          },
          dataType: 'json',
          success: function (data, status) {
            if (data.statusCode === 2000) {
              var thisData = data.data;
              if (!thisData) {return;}
              initPaginations(num);   // 初始化分頁碼
              clickChangePage();  // 点击改变页码
              for (var i = 0,  len = thisData.length; i < len; i++) {
                var weekdays = thisData[i].weekday.split('');
                var $tr = $('<tr></tr>').data('managerid', thisData[i].managerid).data('periodids', '').appendTo($table);
                $('<td></td>').text(i + 1).appendTo($tr);
                $('<td></td>').text(thisData[i].phasename).appendTo($tr);  // 时段表名称
                $('<td></td>').text(thisData[i].phaseno).appendTo($tr);    // 时段表编号
                var $td = $('<td class="week-day-select">' +    // 星期执行日
                  '<ul><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li></ul>' +
                  '<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>' +
                  '</td>')
                  .appendTo($tr);
                for (var j = 0, wLen = weekdays.length; j < wLen; j++) {
                  if (weekdays[j] === '1') {
                    $td.children('td.week-day-select ul').last().children().eq(j).addClass('li-active');
                  }
                }
                var specialday = thisData[i].specialday.split('T')[0];
                if (specialday === '1900-01-01') {
                  specialday = '——';
                }
                $('<td>' + specialday + '</td>').appendTo($tr);    // 特殊日
                $('<td><a class="open-time-period"></a></td>').appendTo($tr);    // 时段查看

                for (var r = 0, rLen = result.length; r < rLen; r++) {
                  if (result[r].managerid === thisData[i].managerid) {
                    $tr.data('periodids', result[r].periodid);
                  }
                }
              }
              $table.find('a.open-time-period').click(function (event) {
                var $thisTr = $(this).parents('tr');
                obj.managerid = $thisTr.data('managerid');
                obj.periodids = $thisTr.data('periodids');
                if (anntype.toLowerCase().indexOf('scats') === -1) {
                  openInquiryTimePeriodPanel('inquiryTimePeriod', obj, function (periodids) {
                    $thisTr.data('periodids', periodids);
                  });
                } else {
                  openInquiryTimePeriodPanel('inquiryScatsTimePeriod', obj, function (periodids) {
                    $thisTr.data('periodids', periodids);
                  });
                }
                return false;
              });
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.messager.show({
              timeout: 1000,
              msg: '获取数据失败，请重新获取！',
              title: '提示'
            });
          }
        });
      }
    }
  });

  // 双击表格行返回一个对象
  $table.on('dblclick', 'tr', function () {
    var $this = $(this);
    obj.managerid = $this.data('managerid');
    obj.timeTableName = $this.children('td').eq(1).text();
    obj.periodids = $this.data('periodids') ? $this.data('periodids') : '';
    if (callback) {
      callback(obj);
      // $weekdayManager.dialog('close');
    }
  });
}

/*
 * initPaginations ()
 * 工作表/时段表管理界面 -- 分页码初始化
 * */
function initPaginations (num) {
  var $weekdayManager = $('#weekdayManager');                       // 工作表/时段表管理界面
  var $pageBtnWrap = $weekdayManager.find('.page-btn-wrap');
  $pageBtnWrap.empty();
  $('<a class="prev-page-btn"></a><a class="next-page-btn"></a>').appendTo($pageBtnWrap);
  var $nextPageBtn = $weekdayManager.find('a.next-page-btn');
  var len = Math.ceil((num) / 3);
  for (var i = 1; i <= len; i++) {
    if (i === 1) {
      $('<a class="page-active"></a>').text(i).insertBefore($nextPageBtn);
    } else {
      $('<a></a>').text(i).insertBefore($nextPageBtn);
    }
  }
}

/*
 * clickChangePage ()
 * 工作表/时段表管理界面 -- 點擊頁碼切換頁面顯示
 * */
function clickChangePage () {
  var $weekdayManager = $('#weekdayManager');                       // 工作表/时段表管理界面
  var height = $weekdayManager.find('.middle-message').height() - 1;
  var $table = $weekdayManager.find('table');
  var $pageBtnWrap = $weekdayManager.find('.page-btn-wrap');
  var $links = $pageBtnWrap.children('a');

  $table.css('top', 0);
  $links.on('click', function (event) {
    var $this = $(this);
    var index = $this.index();
    var $pageActive = $pageBtnWrap.find('.page-active');
    var top = $table.position().top;
    var pageActiveIndex = $pageActive.index();
    if (index === 0) {
      if (pageActiveIndex === 1) {return;}
      $pageActive.removeClass('page-active').prev().addClass('page-active');
      $table.css('top', top + height);
    } else if (index === $links.length - 1) {
      if (pageActiveIndex === $links.length - 2) {return;}
      $table.css('top', top - height);
      $pageActive.removeClass('page-active').next().addClass('page-active');
    } else {
      $this.addClass('page-active').siblings().removeClass('page-active');
      $table.css('top', - (index - 1) * height);
    }
  });
}