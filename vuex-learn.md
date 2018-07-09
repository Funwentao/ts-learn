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
        <div>
    `
})