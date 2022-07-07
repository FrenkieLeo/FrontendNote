import observe from './observe'
function defineReactiveData(data,key,value){
    // value有可能还是一个对象或者数组，所以需要递归去重新观察
    observe(value);
    Object.defineProperty(data,key,{
        get(){
            console.log('响应式数据获取',value)
            return value;
        },
        set(newValue){
            console.log('响应式数据设置',value)
            if(newValue === value){
                return 
            }// 如果newValue是一个对象，那么还要对这个对象持续观察，然后观察完了再赋值
            observe(newValue)
            value = newValue
        }
    })
}

export default defineReactiveData