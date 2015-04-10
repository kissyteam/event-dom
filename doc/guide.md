### 使用说明

处理DOM事件。该模块专门处理标准的event事件，遵循[W3 DOM Level3 草稿](http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/)。除此之外，还拓展支持了一些常用事件: focusin, focusout, hashchange, input。

### 基本使用示例

标准的event事件使用 event-dom 模块即可：

```
KISSY.use(['event-dom'], function(S, DomEvent){
	DomEvent.on(document.body,{
        'click':{
            fn:function(){
                alert('hello,kissy..');
            },
            // filter: '', // delegate,
            once:true // 绑定一次
        },
        'mouseenter':function(){}
    });

    //写法相当于
    DomEvent.on(document.body, 'click', function(){
        alert('hello,kissy..');
    })

});
```

针对触屏设备，有一些专门处理触屏的事件，每种类型的事件都有自己的独立模块，需要独立引入，详情请查看api文档，使用如下例子：

```
KISSY.use(['node', 'event-dom/gesture/basic'], function(S, $, GestureBasic){
    $(window).on(GestureBasic.START, function(ev){
        //touch start...
    });
    $(window).on(GestureBasic.MOVE, function(ev){
        //touch move...
    });
    $(window).on(GestureBasic.END, function(ev){
        //touch end...
    });
});
```