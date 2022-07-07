import proxyData from "./proxy";
import observe from './observe';
function initState(vm){
    let options = vm.$options; //for convinent
    if(options.data) {
        // if exist
        initData(vm);
    }
}

function initData(vm){
    // 判断完后都是需要初始化data
    let data = vm.$options.data;//use temp variable to store user data
    // 因为取数的时候是通过vm.data来取的，所以data需要将this绑定到vm上，所以data.call(vm)
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {} 
    //避免直接操作data，因为data是以函数的方式呈现的，调用data（），如果是以对象的方式写的就直接返回data，赋值给vm._data 后再进一步赋值给data
    // 要让data可以通过vm.data访问，需要写一个proxy,就是Object.defineProperty
    for(let key in data){
        proxyData(vm,'_data',key);
    }

    // 观察者模式：对data和内部进行观察，需要区分是否为对象，如果是object，或者数组要执行相应的拦截。

    observe(vm._data)
}
export {
    initState
}