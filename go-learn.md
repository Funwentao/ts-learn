## 包的概念、导入与可见性
必须在源文件中非注释的第一行指明这个文件属于哪个包，如package.main。package.main表示一个可独立执行的程序，每个Go应用都包含一个名为main的包

### 可见性规则
当标识符（包括常量、变量、类型、函数名、结构字段等等）以一个大写字母开头，如：Group1，那么使用这种形式的标识符的对象就可以被外部包的代码所使用，这就被称为导出；标识符如果以小写字母开头，则对包外是不可见的，但是他们在整个包的内部是可见并且可用的

### go程序执行顺序如下
* 1 按顺序导入所有被main包引用的其它包，然后在每个包中执行如下流程
* 2 如果该包又导入了其它的包，则从第一步开始递归执行，但是每个包只会被导入一次
* 3 然后以相反的顺序在每个包中初始化常量和变量，如果该包含有init函数的话，则调用该函数
* 4 在完成这一切之后，main也执行同样的过程，最后调用main函数开始执行程序

## 常量
常量使用关键字const定义，用于存储不会改变的数据
```go
const identifier [type] = value
```
常量的值必须是能够在编译时就能够确定的；你可以在其赋值表达式中涉及计算过程，但是所有用于计算的值必须在编译期间就能够获得。
* 正确的做法：const c1 = 2/3
* 错误的做法：const c2 = getNumber() //引发构建错误 ：getNumber() used as value

因为在编译期间自定义函数均属于未知，因此无法用于常量的赋值，但内置函数可以使用，如：len()。

### strings和strconv包
```go
//判断字符串s是否以prefix开头
strings.HasPrefix(s, prefix, string) bool
//判断字符串s是否以suffix结尾
strings.HasSuffix(s, suffix, string) bool
//包含关系
strings.Contains(s, substr, string) bool
//判断字符串str在字符串s中的索引
strings.Index(s, str, string) int
strings.LastIndex(s, str, string) int
//字符串替换
strings.Replace(s, str, string) int
//重复count次字符串s并返回一个新的字符串
strings.Repeat(s, count int) string
//修改字符串大小写
strings.Tolower(s) string
strings.ToUpper(s) string
//剔除字符串开头和结尾的空白符号
strings.TrimSpace(s)
//剔除指定字符
strings.Trim(s, "cut")
strings.Trimleft(s, "cut")
strings.TrimRight(s, "cut")
//利用一个或多个空白符号来作为动态长度的分割符将字符串分割
strings.Fields(s)
strings.Split(s, sep)
//拼接字符串
strings.Join(sl []string, sep string) string



