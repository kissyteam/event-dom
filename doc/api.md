### on(selector, eventType, fn, [scope])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- fn {Function} 当事件触发时的回调函数
- [scope] {Object} 可选，回调函数的this值，如果不指定默认为绑定事件的当前元素

为符合匹配的 dom 节点的相应事件添加事件处理器

on 方法是给文档添加行为的主要方式. 所有的事件类型, 例如 focus , mouseover , resize 都是有效的事件类型

window 的 beforeunload 和 error 事件使用了不标准的方式, 该方法不支持, 请直接在 window 对象上注册事件处理器

当一个节点的某个事件触发时, 绑定该事件的所有处理器都会被调用.如果有多个事件处理器, 则他们的执行顺序和绑定的顺序保持一致, 当所有的事件处理器执行完毕后, 事件才继续向上传播

### detach(selector, [eventType], [fn], [scope])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- fn {Function} 当事件触发时的回调函数
- [scope] {Object} 可选，回调函数的this值，如果不指定默认为绑定事件的当前元素

从符合匹配的 dom 节点中移去相应事件的事件处理器

用 on 方法绑定的事件处理器可以用 detach 解除绑定，如果不传入 eventType 和 fn 参数则移除所有事件处理器，若传入具体参数就移除相应的事件处理器。

### fire(selector, eventType, [domEvent])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- [domEvent] {Object} 模拟原生事件的一些属性值信息
- return {Boolean} 如果其中一个事件处理器返回 false , 则返回 false, 否则返回最后一个事件处理器的返回值

执行符合匹配的 dom 节点的相应事件的事件处理器（并冒泡）和默认行为

### fireHandler(selector, eventType, [domEvent])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- [domEvent] {Object} 模拟原生事件的一些属性值信息
- return {Boolean} 如果其中一个事件处理器返回 false , 则返回 false, 否则返回最后一个事件处理器的返回值

执行符合匹配的 dom 节点的相应事件的事件处理器

fireHandler 和 fire 的区别在于:

fire 会冒泡以及执行对应事件的默认行为

fireHandler 只会执行当前节点的处理函数

### delegate(selector, eventType, filter, fn, [scope])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- filter {Function} 过滤函数
- fn {Function} 当事件触发时的回调函数
- [scope] {Object} 可选，回调函数的this值，如果不指定默认为绑定事件的当前元素

为符合匹配的 dom 节点的相应事件添加事件处理器, 并在该节点的子孙节点中匹配 filter 的节点上触发事件时调用

### undelegate(selector, eventType, filter, fn, [scope])

- selector {String|Array} 字符串表示[css3选择器](http://www.w3.org/TR/css3-selectors/)
- eventType {String} 包含一个或多个事件名称的字符串, 多个事件名以空格分开。 事件可以通过加点来表示分组，例如 "click.one" , "click.two"
- filter {Function} 过滤函数
- fn {Function} 当事件触发时的回调函数
- [scope] {Object} 可选，回调函数的this值，如果不指定默认为绑定事件的当前元素

为符合匹配的 dom 节点的相应事件去除事件处理器



=======================================

*以上均为处理标准DOM事件的API，针对触屏设备，还支持了如下事件类型，每种事件类型都有自己独立的模块，使用时需要单独引入*

### 基本手势事件 event-dom/gesture/basic

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

### 边缘拖动手势事件 event-dom/gesture/edge-pan

在窗口边缘区域往窗口中心区域拖进的拖动手势事件。当将元素在窗口边缘区域往窗口中心区域拖进时触发，默认边缘区域为窗口上下左右四个方向顶端往窗口中心靠近的 '60px' 的区域。例如，窗口宽度为320，那么横坐标 0~60 和 260~320 这段区域就是边缘区域的一部分，当某元素在这个区域往窗口中心区域拖进时触发事件。 引入模块则可以使用相应事件。

```
KISSY.use(['node', 'event-dom/gesture/edge-pan', 'dd'], function(S, $, GestureEdgePan, DD){
    new DD.Draggable({   //使得 #test 元素能被拖动
        node : '#test',
        move:true
    });
    $('#test').on(GestureEdgePan.EDGE_PAN_START, function(ev){ //在边缘区域往窗口中心区域开始拖进时触发
        //edge pan start...
    });
    $('#test').on(GestureEdgePan.EDGE_PAN, function(ev){  //在边缘区域往窗口中心区域拖进中时触发，如果已经超过边缘区域也会一直触发直到放开鼠标
        //edge paning...
    });
    $('#test').on(GestureEdgePan.EDGE_PAN_END, function(ev){  //在边缘区域往窗口中心区域拖进，放开鼠标时触发，如果已经超过边缘区域也会一直触发直到放开鼠标
        //edge pan end...
    });
});
```

### 拖动手势事件 event-dom/gesture/pan

```
KISSY.use(['node', 'event-dom/gesture/pan'], function(S, $, GesturePan){
    $('#test').on(GesturePan.PAN_START, function(ev){
        //pan start...
    });
    $('#test').on(GesturePan.PAN, function(ev){
        //paning...
    });
    $('#test').on(GesturePan.PAN_END, function(ev){
        //pan end...
    });
});
```

### pinch手势事件 event-dom/gesture/pinch

pinch手势事件，触屏上开始用双指调整某个 dom 元素大小时触发

```
KISSY.use(['node', 'event-dom/gesture/pinch'], function(S, $, GesturePinch){
    $(#test).on(GesturePinch.PINCH_START, function(ev){
        //pinch start...
    });
    $(#test).on(GesturePinch.PINCH, function(ev){
        //pinching...
    });
    $(#test).on(GesturePinch.PINCH_END, function(ev){
        //pinch end...
    });
});
```

### 旋转手势事件 event-dom/gesture/rotate

```
KISSY.use(['node', 'event-dom/gesture/rotate'], function(S, $, GestureRotate){
    $(#test).on(GestureRotate.ROTATE_START, function(ev){
        //rotate start...
    });
    $(#test).on(GestureRotate.ROTATE, function(ev){
        //rotating...
    });
    $(#test).on(GestureRotate.ROTATE_END, function(ev){
        //rotate end...
    });
});
```

### 摇动手势事件 event-dom/gesture/shake

```
KISSY.use(['node', 'event-dom/gesture/shake'], function(S, $, GestureShake){
    $(window).on(GestureShake.SHAKE, function(ev){
        //device is shaked...
});
```

### 滑动手势事件 event-dom/gesture/swipe

```
KISSY.use(['node', 'event-dom/gesture/swipe'], function(S, $, GestureSwipe){
    $(window).on(GestureSwipe.SWIPE, function(ev){
        //swiped
});
```

### 点击手势事件 event-dom/gesture/tap

```
KISSY.use(['node','event-dom/gesture/tap'], function(S, $, GestureTap){
	$('#test').on(GestureTap.TAP, function(ev){
        //taped...
    })
});
```