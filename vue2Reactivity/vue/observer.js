
import { arrMethods } from './array';
import observeArr from './observeArr';
import defineReactiveData from './reactive'



function Observer(data){
    // 判断data的类型
    if(Array.isArray(data)){
        // 数组
        // Object.defineProperty本来是针对对象而不是针对数组的，所以数组需要自己处理一下
        // 需要重写数组的方法，因为需要增加一些新东西上去。
        // 将数组的原型赋值给data对象
        data.__proto__ = arrMethods;
        observeArr(data)//可能数组里还有数组，于是使用递归数组中的每一项，然后再对单独的哪一项进行observe
    }else{
        // 对象
        this.walk(data)
    }

}

Observer.prototype.walk = function(data){
    // 如果是对象，需要将所有的key和value需要重新定义
    let keys = Object.keys(data);
    for(let i=0;i<keys.length;i++){
        let key = keys[i];
        let value = data[key]
        // 利用defineProperty
        defineReactiveData(data,key,value)//响应化
    }
}

export default Observer;

/*
对象和数组的处理方法不同：
对象需要用defineProperty
对于数组，需要自己去写相应的方法
所以首先需要判断
*/ 