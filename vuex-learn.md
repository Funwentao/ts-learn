每一个vuex应用的核心就是store。store基本就是一个容器，它包含这你的应用中大部分的状态。vuex和单纯的全局对象有一下两点的不同;
* vuex的状态存储是响应式的。当vuex组件从store中读取状态的时候，若store中的状态发生变化，那么相应的组件也会相应地得到高效更新
* 你不能直接改变store中的状态。改变store中的状态的唯一途径就是现实提交commit mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用

```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        incremnet(state) {
            state.count++
        }
    }
})
```
现在你可以通过store.state来获取状态对象，以及通过store.commit方法触发状态变更：
```js
store.commit("increment")
console.log(store.state.count)
```
## 核心概念
单一状态树
vuex使用单一状态树，y用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源”而存在。这也意味着，每个应用将仅仅包含一个store实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

### 在Vue组件中获得Vuex状态
```js
//创建一个Counter组件
const Counter = {
    template: `<div>{{count}}</div>`,
    computed: {
        count () {
            return store.state.count
        }
    }
}
```
这种模式导致组件依赖全局状态单例。在模块化的构建系统中，在每个需要使用 state 的组件中需要频繁地导入，并且在测试组件时需要模拟状态。

Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）：
```js
const app = new Vue({
    el:'app'
    store,
    components: {Counter},
    template:`
        <div class="app">
            <counter></counter>
        </div> 
    `
})
```
通过根实例中注册store选项，该store实例会注入到根组件下的所有子组件中，且子组件能通过this.$store访问到。
```js
const Counter = {
    template :`<div>{{ count }}</div>`,
    computed: {
        count () {
            return this.$store.state.count
        }
    }
}
```
### mapState函数
当一个组件需要获取多个状态的时候，将这些状态都声明未计算属性会有些重复和冗余。为了解决这个问题，我们可以使用mapstate辅助函数帮助我们生成计算属性，让你少按几次键：
```js
import {mapState} from 'vuex'

export default {
    computed: mapState({
        count: state => state.count,
        countAlias: 'count',
        countPlusLocalState(state) {
            return state.count + this.localCount
        }
    })
}
```
### 对象展开运算符
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。但是自从有了对象展开运算符（现处于 ECMASCript 提案 stage-4 阶段），我们可以极大地简化写法：
```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```
## Getter
有时候我们需要从store中的state中派生出一些状态，例如对列表进行过滤并计算：
```js
computed:{
    doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length
    }
}
```
如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接受 state 作为其第一个参数：
```js
const store = new Vuex.store({
    state: {
        todos: [
            {id: 1, text: '...', done: true},
            {id: 2, text: '...', done: false}
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.state)
        }
    }
})
```
#### 通过属性访问
Getter会暴露为 store.getters 对象，你可以以属性的形式访问这些值：
```js
store.getters.doneTodos
```
Getter也可以接受其他getter作为第二个参数
```js
getters: {
    doneTodosCount: (state, getters)=>{
        return getters.doneTodos.length
    }
}
```
在组件中使用
```js
computed: {
    doneTodosCount () {
        return this.$store.getters.doneTodosCount
    }
}
```
#### 通过方法访问
```js
getter:{
    getTodoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id)
    }
}
```
#### mapGetters 辅助函数
mapGetters辅助函数仅仅是讲store中的getter映射到局部计算属性：
```js
import {mapGetters} from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
        ])
    }
}
```
## Mutation
更改Vuex的store中的状态的唯一方法是提交mutation。Vuex中的mutation非常类似于事件：每个mutation都有一个字符串事件类型(type)和一个回调函数(handler)。这个函调函数就是我们实际进行状态更改的地方，并且他会接受state作为第一个参数
```js
const store = new Vuex.Store({
    state: {
        count: 1
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
})
```
你不能直接调用一个mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment的mutation时，调用此函数。”要唤醒一个mutation handler，你需要以相应的type调用store.commit方法：
```js
store.commit('increment')
```
#### 提交载荷(Payload)
你可以向store.commit传入额外的参数，机mutation的载荷(payload)
```js
mutation: {
    increment(state, n) {
        state.count += n
    }
}
store.commit('incremnet',10)
//对象的提交方式,提交 mutation 的另一种方式是直接使用包含 type 属性的对象：
store.commit({
    type: 'increment',
    amount: 10
})
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}
```
#### mutation需要遵守Vue的响应规则
既然Vuex的store中的状态是响应式的，那么当我们变更状态时，监视状态的Vue组件也会自动更新。这样意味着Vuex中的mutation也需要使用Vue一样遵守一些注意事项：
1.最好提前在你的store中初始化好所有所需属性。
2.当需要在对象上添加新属性时，你应该
* 使用Vue.set(obj, 'newProp',123)
* 以新对象替换老对象。例如，利用对象展开运算符：
```js
state.obj = {...state.obj, newProp:123}
```
