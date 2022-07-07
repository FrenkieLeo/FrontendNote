import { ARR_METHODS } from "./config";
import observeArr from "./observeArr";

let originArrayMethods = Array.prototype;//复制一份，但只是复制一个引用
let arrMethods = Object.create(originArrayMethods);//于是新创建一个对象，就不是引用了

ARR_METHODS.map(function(m){
    // 遍历config的每一项，m = push，pop那些
    arrMethods[m] = function(){
        // 重写特定方法 相当于 arr['push'] = function(){} 但由于splice可以传入多个参数，参数不定，所以要用到arguments，
        // 因为是类数组，原型链上没有 Array.prototype，所以我们不能用 Array.prototype 上的 forEach、map 等数组特有的方法
        // 因此我们可以通过一些常用的手段将arguments改为数组Array.prototyle.slice.call()，在es6中可以用[...arguments]来变更
        let args = Array.prototype.slice.call(arguments) // slice返回一个原数组，将参数强行变成一个参数数组。
        let rt = originArrayMethods[m].apply(this,args); //执行原来的数组方法，因为原数组执行完了之后才能更改数据，同时更改数据后还要做其他事情
        // 这个就相当于简单的用arr.push(args)，然后后面继续干正事
        // 以上保留原来的功能，下面是执行其他新的功能
        let newArr;
        // push，unshift 还有splice都是会新增东西的，所以要另外判断：
        // 新增的东西可能是数组可能是对象，所以将args赋值给newArr
        // 若为push或者unshift就是新增一项，所以直接赋值
        // 如果是splice中可以接受三个参数的，那么就需要去args[2] 第三个参数才是新增的对象或者数组
        switch(m){
            case 'push':
            case 'unshift':
                newArr = args
                break;
            case 'splice':
                newArr = args.slice(2); //获取插入的元素，可以是对象
                break;
            default:
                break;
        }
        // splice有可能是删除的，所以newArr存在undefinded的情况
        newArr && observeArr(newArr)
        // rt就等于return出来一个新的方法集合，而且这些数组全部都变成了响应式的
        return rt;
    }
})

export {
    arrMethods,
}