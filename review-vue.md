* 通过使用v-once指令，可以一次性地插值，当数据改变时，插值处的内容不会更新。但是这会影响到该节点上的其它数据绑定

* v-html
```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

* 修饰符(Modifiers)是以半角句号.指明的特殊后缀，用于指出一个指令应该以特殊方式绑定，例如，.prevent修饰符告诉v-on指令对于触发的事件调用event.preventDefault();
```html
<form v-on.submit.prevent>...</form>
```

* 侦听属性: $watch

* class与style绑定
```html
<div v-bind:class="{active: isActive}"></div>
<div v-bind:class="[activeClass, errorClass]"></div>
```

* 一个对象的v-for
```html
<ul id="v-for-object" class="demo">
    <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
    </div>
</ul>
```

* 数组
由于JavaScript的限制，Vue不能检测一下变动的数组：

1、当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`

2、当你修改数组的长度时，例如：`vm.items.length = newLength`

*一段取值范围的v-for
```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```
结果：
```
1 2 3 4 5 6 7 8 9 10
```

* 时间修饰符
```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```