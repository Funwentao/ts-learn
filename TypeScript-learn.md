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