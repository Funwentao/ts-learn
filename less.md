## 如何在vue中使用
* 第一步，安装依赖
```js
>npm install less less-loader --save
```
* 第二步，在webpack加入配置
```js
{
    test: /\.less$\/,
    loader: "style-loader!css-loader!less-loader"
}
```
* 第三步，然后在使用的时候在style标签里加上lang=”less”里面就可以写less的代码了，或者:
```css
@import '***.less';
```


# less的一些特性
## 变量
### 编译前
```less
@nice-blue: #123;
@fnord: "I am fnord."
@var: "fnord";


@light-blue: @nice-blue + #111;

#header { 
    color: @light-blue;
    &:after {
        content: @@var;  //甚至可以用变量名定义为变量:
    }
}
```
### 编译后
```css
#header { 
    color: #234; 
}
#header:after {
    content: "I am fnord.";
}  
```
## 混合
在 LESS 中我们可以定义一些通用的属性集为一个class，然后在另一个class中去调用这些属性.任何 CSS class, id 或者 元素 属性集都可以以同样的方式引入.
### 编译前
```less
.bordered {
    border-top: 1px solid black;
}

#menu a {
    color: #111;
    .bordered;
}
```
### 编译后
```css
.bordered {
    border-top: 1px solid black;
}
#menu a {
    color: #111;
    border-top: 1px solid black;
}
```
混入时还可以携带参数,可以给参数设置默认值
```less
.border-radius(@radius: 5px) {
    border-radius: @radius;
}
#header {
    .border-radius(4px);
}
p {
    .border-radius;
}
```
编译后
```css
#header {
    .border-radius: 4px;
}
p {
    .border-radius: 5px;
}
```
### @arguments变量的使用
```less
.box-shadow (@x: 0, @y: 0, @blur: 1px, @color: #000) {
  box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  -webkit-box-shadow: @arguments;
}
#header {
    .box-shadow(2px, 5px);
}
```
### 编译后
```css
#header {
    box-shadow: 2px 5px 1px #000;
    -moz-box-shadow: 2px 5px 1px #000;
    -webkit-box-shadow: 2px 5px 1px #000;
}
```
## 模式匹配和导引表达式
```less
.mixin (dark, @color) {
    color: darken(@color, 10%);
}
.mixin(light, @color) {
    color: lighten(@color, 10%);
}
.mixin(@_, @color) { //接受任意值
    display: block;
}
@switch: light;
.class {
    .mixin(@switch, #888)
}
```
### 编译后
```css
.class {
    color: #a2a2a2;
    display: block;
}
```
### 使用when来做导引
```less
.mixin (@a) when (lightness(@a) >= 50%) {
    background-color: black;
}
.mixin (@a) when (lightness(@a) < 50%) {
    background-color: white;
}
.mixin (@a) {
    color: @a;
}
.class1 {
    .mixin(#ddd);
}
.class2 {
    .mixin(#555);
}
```
### 编译后

```css
.class1 {
    background-color: black;
    color: #ddd;
}
class2 {
    background-color: white;
    color: #555;
}
```
注意：比较相等用 `=` 就好了，不必要使用两个或者三个等号，除去关键字`true`以外的值都被视为`false`，如果有多个表达式时用`,`分割，当且仅当所有条件都符合时，才会被视为匹配成功；在导引序列中可以使用`and`关键字实现与条件；使用`not`关键字实现或条件
```less
.truth (@a) when (@a) { ... }
.truth (@a) when (@a = true) { ... }

.mixin (@a) when (@a > 10), (@a < -10) { ... }

.mixin (@a) when (isnumber(@a)) and (@a > 0) { ... }

.mixin (@b) when not (@b > 0) { ... }
```
上面的前两个混合是相同的，只有`a`为`true`时才能正确匹配到，第三个混合不可能引用的到。
### 常见的检测函式
```less
iscolor 
isnumber
isstring
iskeyword
isurl
ispixel
ispercentage
isem
```
## 嵌套规则
```less
#header {
  color: black;

  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
    &:hover { text-decoration: none }
  }
}
```
### 编译后：
```css
#header { color: black; }
#header .navigation {
  font-size: 12px;
}
#header .logo { 
  width: 300px; 
}
#header .logo:hover {
  text-decoration: none;
}
```
## 媒体查询合嵌套媒体查询
```less
.screencolor{
  @media screen {
    color: green;
    @media (min-width:768px) {
    color: red;
    }
    }
  @media tv {
    color: black;
  }
}
```
编译后
```css
@media screen {
  .screencolor {
    color: green;
  }
}
@media screen and (min-width: 768px) {
  .screencolor {
    color: red;
  }
}
@media tv {
  .screencolor {
    color: black;
  }
}
```
## color函数
```less
lighten(@color, 10%);     // return a color which is 10% *lighter* than @color
darken(@color, 10%);      // return a color which is 10% *darker* than @color

saturate(@color, 10%);    // return a color 10% *more* saturated than @color
desaturate(@color, 10%);  // return a color 10% *less* saturated than @color

fadein(@color, 10%);      // return a color 10% *less* transparent than @color
fadeout(@color, 10%);     // return a color 10% *more* transparent than @color
fade(@color, 50%);        // return @color with 50% transparency

spin(@color, 10);         // return a color with a 10 degree larger in hue than @color
spin(@color, -10);        // return a color with a 10 degree smaller hue than @color

mix(@color1, @color2);    // return a mix of @color1 and @color2
```


# Sass
## 嵌套规则
### 属性嵌套
```scss
.funky {
    font: {
        family: fantasy;
        size: 30em;
        weight: bold;
    }
}
```
编译后
```css
.funky {
    font-family: fantasy;
    font-size: 30em;
    font-weight: bold;
}
```
### 变量$
```scss
$width: 5em
```
### 插值语句#{}
```scss
$name: foo;
$attr: border;
P.#{name} {
    #{attr}-color: blue;
}
```
#### 编译后
```css
p.foo {
    border-color: blue
}
```

