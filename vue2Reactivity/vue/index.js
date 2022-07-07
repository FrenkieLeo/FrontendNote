//数据劫持主程序入口 

import {initState} from './init'

function Vue( options ){
    this._init(options);//new Vue的必经过程
}

Vue.prototype._init = function(options){
    // 初始化实例,将所有的options进行初始化
    let vm = this;//先固定this对象
    vm.$options = options // 挂载到实例上
    // 初始化状态
    initState(vm);

}

export default Vue;


/*
涉及到prototype，__proto__
*/ 