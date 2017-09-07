/**
 * Created by Fairlady on 2017/09/05.
 */
// 块级元素
function Element(option){
    this.element = document.createElement(option.el);
    // 类名
    if(option.className)this.element.className=option.className;
    // id
    if(option.id)this.element.id=option.id;
    // 宽度
    if(option.width)this.element.style.width=option.width;
    // 高度
    if(option.height)this.element.style.height=option.height;
    // 内容颜色
    if(option.color)this.element.style.color=option.color;
    // 背景颜色
    if(option.background)this.element.style.background=option.background;
    // 边框
    if(option.border)this.element.style.border=option.border;
    // 圆角
    if(option.borderRadius)this.element.style.borderRadius=option.borderRadius;
    //外边距
    if(option.margin!=undefined)this.element.style.margin=option.margin;
    // 内边距
    if(option.padding!=undefined)this.element.style.padding=option.padding;
    // 定位
    if(option.position)this.element.style.position=option.position;
    if(option.left!=undefined) this.element.style.left=option.left;
    if(option.right!=undefined)this.element.style.right=option.right;
    if(option.top!=undefined)this.element.style.top=option.top;
    if(option.bottom!=undefined)this.element.style.bottom=option.bottom;
    // 层级
    if(option.zIndex!=undefined)this.element.style.zIndex=option.zIndex;
    // 显示模式
    if(option.display)this.element.style.display=option.display;
    // flex
    if(option.justifyContent)this.element.style.justifyContent=option.justifyContent;
    // 内容
    if(option.html)this.element.innerHTML=option.html;
    // 子元素,传入数组
    if(option.children){
        for (var i = 0; i < option.children.length; i++) {
            this.element.appendChild(option.children[i]);
        }
    }
    // 自定义属性,传入对象
    if(option.attr){
        for(var key in option.attr){
            console.log(key);
            this.element[key]=option.attr[key];
        }
    }
    return this.element;
}

// input表单元素
function Input(option){
    this.input=new Element(option);
    // input类型
    this.input.type=option.type||'text';
    // input的name
    if(option.name)this.input.name=option.name;
    // input的值
    if(option.value!=undefined)this.input.value=option.value;
    return this.input;
}

function Select(option){
    option.el='select';
    this.select= new Element(option)
    for (var i = 0; i < option.options.length; i++) {
        var op = document.createElement('option');
        op.value=option.options[i].value;
        op.innerHTML=option.options[i].html;
        this.select.appendChild(op);
    }
    return this.select;
}


var TC = {
    crossRecord:{},
    crossInspection:{},
    greenRoadOptimize:{},
    inqueryStatistics:{},
    pubinfoManage:{},
}
