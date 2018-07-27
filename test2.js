process.nextTick(function () {
    console.log('nextTick run1')
})
process.nextTick(function () {
    console.log('nextTick run2')
})
setImmediate(function () {
    console.log('setImmediate run1')
    process.nextTick(function () {
        console.log('nextTick run3')
    })
})
setImmediate(function () {
    console.log('setImmediate run2')
})
console.log('normal run')
