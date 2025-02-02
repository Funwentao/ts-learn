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
#### 使用常量代替mutation事件类型
使用常量替代mutation事件类型在各种flux实现中是很常见的模式。这样可以使linter之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个app包含的mutation一目了然：
```js
//mutation-type.js
export const SOME_MUTATION = "SOME_MUTATION"
```
```js
//store.js
import Vuex from 'vuex'
import {SOME_MUTATION} from './mutation-types'

const store = new Vuex.Store({
    state: {...},
    mutation: {
        [SOME_MUTATION](state) {

        }
    }
})
```
用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。
#### Mutation必须是同步函数
一条重要的原则就是要记住mutation必须是同步函数。
```js
mutations: {
    someMutation(state) {
        api.callAsyncMethod(() => {
            state.count++
        })
    }
}
```
现在想像，我们正在debug一个app并且观察devtool中的mutation日志。每一条mutation被记录，devtool都需要被捕捉前一状态和后一状态的快照。然而，在上面的例子中mutation中的异步函数中的回调让这不可能完成：因为当mutation触发的时候，回调函数还没有被调用，devtool不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。
### 在组件中提交Mutation
可以在组建中使用this.$store.commit("xxx")提交mutation，或者使用mapMutation辅助函数将组件中的methods映射为store.commit调用（需要再根节点注入store）。
```js
import {mapMutation} from 'Vuex'

export default {
    methods: {
        ...mapMutation([
            'increment',
            'incrementBy'
        ]),
        ...mapMutation([
            add: 'increment'
        ])
    }
}
```
#### 下一步：Action
在mutation中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的mutation来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这个两个概念。在Vuex中，mutation都是同步事务：

Action类似于mutation，不同于：
* Action提交的是mutation，而不是直接变更状态
* Action可以包含任意异步操作
让我们来注册一个简单的action：
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment');

        }
    }
})
```
Action函数接受一个与store实例具有相同方法和属性context对象(不是store实例本身)，因此你可以调用context.commit提交一个mutation，或者通过context.state和context.getters来获取state和getters。
```js
//使用参数结构来简化代码
actions: {
    increment ({commit}) {
        commit('increment')
    }
}
```
#### 分发action
action通过store.dispatch方法触发：
```js
store.dispatch('increment')
```
乍一眼看上去感觉多此一举，我们直接分发mutation岂不更方便？实际上并非如此，还记得mutation必须同步执行这个限制么？Action就不受拘束！我们可以在action内部执行异步操作:
```js
actions: {
    incrementAsync ({commit}) {
        setTimeout(() => {
            commit('commit')
        }, 1000)
    }
}
//以载荷形式分发
store.dispatch('incrementAsync',{
    amount: 10
})
//以对象形式分发
store.dispatch({
    type: 'incrementAsync',
    amount: 10
})
```
购物车实例
```js
actions: {
    checkout({commit,state},products) {
        const savedCartItems = [...state.cart.added]
        commit(types.CHECKOUT_REQUEST)
        shop.buyProducts(
            products,
            //成功回调
            () => commit(types.CHECKOUT_SUCCESS),
            () => commit(types.CHECKOUT_FAILURE,savedCartItems)
        )
    }
}
```
#### 在组件中分发Action
你在组件中使用this.$store.dispatch('xxx')分发action,或者使用mapActions辅助函数将组件的methods映射为store.dispatch调用(需要先在根节点注入store)
```js
import {mapActions} from 'vuex'

export default {
    methods: {
        ...mapActions([
            'increment',
            'incrementBy'
        ]),
        ...mapActions([
            add: 'increment'
        ])
    }
}
```
#### 组合action
action通常是异步的，那么如何知道action什么时候结束呢？更重要的是，我们如何才能组合多个action，以处理更加复杂的异步流程？
首先，你需要明白store.dispatch可以处理被触发的action的处理函数的promise，并且store.dispatch仍旧返回promise：
```js
actions: {
    acctionA ({commit}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('someMutation');
                resolve()
            }, 1000)
        })
    }
}
store.dispatch('actionA').then(() => {

})
actions: {
    actionB ({dispatch, commit}) {
        return dispatch('actionA').then(() => {
            commit('someOtherMutation')
        })
    }
}
//假设getData()和getOtherData()返回的是Promise
actions: {
    async actionA ({commit}) {
        commit('gotData', await getData())
    },
    async actionB ({dispatch, commit}) {
        await dispatch('actionA')
        commit('gotOtherData', await getOtherData())
    }
}
```
一个store.dispatch在不同模块中可以触发多个action函数。在这种情况下，只有当所有触发函数完成后，返回的Promise才会执行

### Module
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就有可能变得相当臃肿
 为了解决以上问题，Vuex允许我们将store分割成模块。每个模块拥有自己的state、mutation、action、getter、甚至是嵌套子模块——从上之下进行同样方式的分割：
 ```js
 const moduleA = {
     state: { ... },
     mutations: { ... },
     ations: { ... },
     gettters: {...}
 }

const moduleB = {
    state: {...},
    mutations: {...},
    actions: {...}
}

const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB
    }
})

store.state.a // -> moduleA的状态
store.state.b // -> moduleB的状态
```
模块的局部状态
对于模块内部的mutation和getter，接收的第一个参数是模块的局部状态对象
```js
const moduleA  = {
    state: {count: 0},
    mutations: {
        increment (state) {
            state.count++
        }
    },
    getters:{
        doubleCount (state) {
            return stata.count * 2
        }
    }
}
```
同样，对于模块内部的action，局部状态通过context.state暴露出来，根节点状态则为context.rootState:
```js
const moduleA = {
    actions: {
        incrementIfOddOnRootSum ({state,commit,rootState}) {
            if ((state.count + rootState.count) % 2 === 1) {
                commit('increment')
            }
        }
    }
}
//对于模块内部的getter，根节点状态会作为第三个参数暴露出来
const moduleA = {
    getters: {
        sumWithRootCount (state, gettres, rootState) {
            return state.count = rootState.count
        }
    }
}
```
### 命名空间
默认情况下，模块内部的action、mutation和getter是注册在全局命名空间的——这样使得多个模块能够对同一mutation或action做出相应。
如果希望你的模块具有更高的封装性和复用性，你可以通过添加namespaced: true的方式使其成为带命名空间的模块。当模块被注册后，它的所有getter、action及mutation都会自动根据模块注册的路径调整命名：
```js
const store = new Vuex.Store({
    modules: {
        account: {
            namespaced: true,
            state: {...}
            getters: {
                isAdmin () {...}
            },
            actions: {
                login () {...}
            },
            mutations: {
                login () {...}
            },
            //嵌套模块
            modules: {
                myPage: {
                    state:{...},
                    getters: {
                        profile () {...}
                    }
                },
                posts: {
                    namepaced: true,
                    state: {...}
                    getters: {
                        popular () {...}
                    }
                }
            }
        }
    }
})
```
启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。