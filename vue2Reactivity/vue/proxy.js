function proxyData(vm,target,key){
    // 数据劫持
    
    Object.defineProperty(vm,key,{
        get(){
            console.log('get proxy data',vm[target][key])
            // 当访问vm.title 的时候，实际上拦截下来，返回的是vm._data.title
            return vm[target][key];
        },
        set(newValue){
            // 变成vm._data.title = newValue
            vm[target][key] = newValue
        }
    })
    
}

export default proxyData