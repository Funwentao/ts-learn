console.log('nimojs@126.com'.replace(/(.+)(@)(.*)/,"$2$1"))

function logArguments() {
    console.log(arguments)
    return "返回值会替换匹配到的目标"
}

console.log('nimojs@126.com'.replace(/(.+)(@)(.*)/, logArguments))

