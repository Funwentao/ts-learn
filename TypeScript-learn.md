### 编译代码
```ts
> tsc greeter.ts
```

### 类型注解
```ts
function greeter(person: string) {
    return "Hello, " + person;
}
```

### 接口
在Typescript里，只在两个类型内部结构兼容那么这两个类型就是兼容的。这就允许我们在实现接口的时候只要保证办函了接口要求的结构空就可以，而不必明确地使用`implements`语句

```ts
interface Person {
    firstName: string;
    lastNmae: string;
}

function greeter(person: Person) {
    retrun "Hello, +" person.firstName + " " + person.lastName; 
}
let user = {firstName: "Jane", lastName: "User"};
document.body.innerHtml = greeter(user);
```

### 类
在构造函数的参数上使用`public`等同于创建了同名的成员变量

```ts
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName){
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("jane", "M.", "User");
```

### 基础类型

提供了实用的枚举类型
```ts
let isDone: boolean = false

//除了支持十进制和十六进制字面量，Typescript还支持ECMAScript 2015中引入的二进制和八进制字面量
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral： number = 0b1010;
let octalLiteral: number = 0o744

let name: string = "bob";
name = "smith";
//可以使用模板字符串，它可以定义多行文本和内嵌表达式。这种字符串是被反引号（`），并且以${ expr }这种形式嵌入表达式
let sentence: string = `Hello, my name is ${name}.
I'll be ${age + 1} years old next month.`;


//可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：
let list: number[] = [1, 2, 3];
//第二种方式是使用数组泛型
let list: Array<number> = [1, 2, 3];
```

#### 元组
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。比如，你可以定义一对值分别为 `string`和`number`类型的元组


```ts
let x: [string, number];

x = ['hello', 10];

x = [10, 'hello'];
```
当访问一个已知索引的元素，会得到正确的类型：
```ts
console.log(x[0].substr(0)); //ok

console.log(x[1].substr(1)); //Error, 'number' does not have 'substr'
```
当访问一个越界的元素，会使用联合类型代替
```ts
x[3] = 'world';//ok,字符串可以赋值给(string|number)类型

console.log(x[5].toString());//ok,'string'和'number'都用toString

x[6] = true; //Error,布尔不是(string|number)类型
```

#### 枚举
`enum`类型是对JavaScript标准数据类型的一个补充。像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字

```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
默认情况下，从0开始为元素编号。你可以手动的指定成员的数值。例如，我们将上面的例子改成从1开始编号
```ts
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```
或者，全部都采用手动赋值。枚举类型提供的一个便利是你可以由枚举的值得到它的名字。例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：
```ts
enum Color {Red = 1, Green, Blue}
let colorName: String = Color[2]
alert(colorName); //显示'Green' 因为上面代码里它的值是2
```

#### Any
```ts
let notSure: any = 4
notSure = "maybe a string instead";
notSure = false //okay,definitely a boolean

let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

let list: any[] = [1, true, "free"];

list[1] = 100;
```
#### Void
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：
```ts
function warnUser(): void {
    alert("This is my warning message");
}
```

声明一个void类型的变量没有什么大用，因为你只能为它赋予`undefine`和`null`
```ts
let unusable: void = undefined;
```
#### Null和undefined
默认情况下null和undefined是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。然而，当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个 `string`或`null`或`undefined`，你可以使用联合类型`string | null | undefined`。

#### Never
`never`类型表示的是那些永不存在的值得类型。例如，`never`类型是那些总是会抛出异常或者根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；变量也有可能是`never`类型，当它们被永不为真的类型保护所约束时。

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。 即使 `any`也不可以赋值给`never`。

#### 类型断言
类型断言有两种形式。 其一是“尖括号”语法：
```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
另一个为as语法：
```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```
两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。

### let声明
当用`let`声明一个变量，它使用的是词法作用域或块作用域。不同于使用`var`声明的变量那样可以在包含它们的函数外访问，块级作用域变量在包含它们的块或for循环之外是不能访问的。
```ts
function f(input: boolean) {
    let a = 100;

    if (input) {
        // Still okay to reference 'a'
        let b = a + 1;
        return b;
    }
    //Error: 'b' doesn't exist here
    return b;
}
```
在`catch`语句里声明的变量也具有同样的作用域规则。
```ts
try {
    throw "oh no!";
}
catch (e) {
    console.log("oh well.");
}

console.log(e);
```

#### 重定义和屏蔽
```ts
let x = 10;
let x = 20;//Error
```

在一个嵌套作用域里引入一个新名字的行为称做屏蔽。 它是一把双刃剑，它可能会不小心地引入新问题，同时也可能会解决一些错误。

```ts
function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```
这个版本的循环能得到正确的结果，因为内层循环的i可以屏蔽掉外层循环的i。

当`let`声明出现在循环体里面时拥有完全不同的行为。不仅是在循环里引入了一个新的变量环境，而是针对每次迭代都会创建这样一个新的作用域。这就是我们咋使用立即执行的函数表达式时做的事，所以在`setTimeout`例子里我们仅使用`let`声明就可以了。
```ts
for (let i = 0; i < 10; i++) {
    setTimeout(function() {console.log(i);}, 100*i);
}
```

#### 展开
对象展开有其它一些意想不到的限制。首先，它仅包含对象自身的可枚举属性。大体上是说当你展开一个对象实例时，你会丢失其方法：
```ts
class C {
    p = 12;
    m() {
    }
}
let c = new C();
let clone = {...c};
clone.p;//ok
clone.m();//error
```
其次，TypeScript编译器不允许展开泛型函数上的类型参数。 这个特性会在TypeScript的未来版本中考虑实现。

### 接口
```ts
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let myObj = {size:10, label:"Size 10 Object"};
printLabel(myObj);
```
LabelledValue接口好比一个名字，用来描述上面例子里的要求。他代表了有一个`label`属性且类型为`string`的对象。

#### 可选属性
接口里的属性不都是必需的。有些是只在某些条件下存在，或者根本不存在。可选属性在应用“option bags”模式时很常用，即给函数传入的参数对象中只有部分属性赋值了。

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig):{color: String; area: number}{
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}
let mySquare = createSquare({color:"balck"});
```

#### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值。你可以在属性名前用`readonly`来指定只读属性：
```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = {x: 10,y: 20};
p1.x = 5;//error!
```
Typescript具有ReadonlyArray<T>类型，它于Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; //error
ro.push(5); //error
ro.length = 100; //error
a = ro; //error
```
#### 额外的属性检查
我们在第一个例子里面,Typescript让我们传入`{size: number;label: string}`到仅期望得到`{label: string}`的函数里。我们已经学过了可选属性，并且知道他们在"option bags"模式里很有用。

然而，天真地将这两者结合的话就会像在JavaScript里那样搬起石头砸自己的脚。比如，拿`createSquare`例子来说：
```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig):{color: string;area: number}{
    //...
}
let mySquare =  createSquare({colour:"red",width:100});
```
注意传入createSquare的参数拼写为colour而不是color。在JavaScript里，这会默默的失败。
你可能会争辩这个程序已经正确地类型化了，因为`width`属性是兼容的，不存在`color`属性，而且额外的colour属性是无意义的。
然而，Typescript会认为这段代码可能存在bug。对象字面量会被特殊对待而且会经过额外属性检查，当将他们赋值给变量或作为参数传递的时候。如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。
```ts
//error:'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({colour: 'red',width: 100});
```
绕开这些检查非常简单。最简便的方法是使用类型断言：
```ts
let mySquare = createSquare({width:100,opcity:0.5} as SquareConfig);
```

然而，最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些作为特殊用途的额外属性。如果`SquareConfig`带有上面定义的类型的`color`和`width`属性，并且还会带有任意数量的其他属性，那么我们可以这个定义它：
```ts
interface SquareConfig {
    color?: string;
    width?：number;
    [propName: string]： any;
}
```
#### 函数类型
接口能够描述JavaScript找那个对象拥有的各种各样的外形。除了描述带有属性的普通对象外，接口也可以描述函数类型。
为了使用接口表示函数类型，我们需要给接口定义一个调用签名。他就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```
这样定义后，我们可以像使用其他接口一样使用这个函数类型的接口。下列展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。
```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result  = source.search(subString);
    return result > -1;
}
```
对于函数类型的类型检查来说，函数的参数名不需要于接口里定义的名字相匹配。比如，我们使用下面的代码重写上面的例子：
```ts
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string):boolean {
    let reasult = src.search(sub);
    return result > -1;
}
```
函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。如果你不想指定类型，Typescript的类型系统会推断出参数类型，因为函数直接赋值给了SearchFunc类型变量。函数的返回值类型是通过其返回类型推断出来的（比例是`false`和`true`）。如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型于`SearchFunc`接口中的定义不匹配。
```ts
let mySearch: SearchFunc;
mySearch = function(src,sub) {
    let result = src.search(sub);
    return result > -1;
}
```
#### 可索引的类型
与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。可索引类型具有一个索引签名，他描述了对象索引的类型，还有相应的索引返回值类型。让我们看一个例子：
```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];
```
这个索引签名表示了当用`number`去索引时才会得到值。共用两种索引签名：字符串和数字。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。这是因为当使用`number`来说索引时，JavaScript会将它转换成`string`然后再去索引对象。
```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}
//错误：使用数值类型的字符串索引，有时会得到完全不同的Animal！
interface NotOkay {
    [x: number]: Aniaml;
    [x: string]: Dog;
}
```
字符串索引签名能够很好的描述`dictionary`模式，并且它们也会确保所有属性与其返回值类型相匹配。因为字符串索引声明了`obj.property`和`obj["property"]`两种形式都可以。下面的例子里，`name`的类型与字符串索引类型不匹配，所以类型检查给出一个错误提示：
```ts
interface NumberDictionary {
    [index: string]: number;
    length: number;  //可以，length是number类型
    name: string;   //错误，name的类型与索引类型返回值的类型不匹配
}
```
最后，你可以将索引签名设置为只读，这样就可以防止了给索引赋值：
```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory";  //error
```
### 类类型
#### 实现接口
与C#或java里接口的基本作用一样，Typescript也能够用它来明确的强制一个类去符合某种契约。
```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number){}
}
```
你也可以在接口中描述一个方法，在类里实现它，如同下面的setTime方法一样：
```ts
interface ClockInterface {
    currentTime: Date;
    setTime:(d: Date);
}
class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor
}
```
### 函数
#### 函数类型
```ts
function add(x: number,y: number): number {
    return x + y;
}
let myAdd = function(x: number,y: number): number { return x + y;};
```

#### 书写完整函数类型
```ts
let myAdd: (x: number, y: number) => number = function(x: number, y:number): number { return x + y};

