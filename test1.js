var data = { name: 'yck' }

observe(data)
let tempname = data.name
data.name = 'yyy'

function observe (obj) {
    if (!obj || typeof obj !== 'object') {
        return
    }

    Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key])
    })
}

function defineReactive (obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            console.log('get value')
            return val
        },
        set: function reactiveSetter(newVal) {
            console.log('change value')
            val = newVal
        }
    })
}

class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null

class Watcher {
    constructor(obj, key, cb) {
        Dep.target = this
        this.cb = cb
        this.obj = obj
        this.key = key
        this.value = obj[key]
        Dep.target = null
    }
    update() {
        this.value = this.obj[this.key]
        this.cb(this.value)
    }
}
var data = { name: 'yck'}
observe(data)
new Watcher(data, 'name', update)
data.name = 'yyy'