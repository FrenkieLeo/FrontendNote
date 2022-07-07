class Vue {
    constructor(obj_instance) {
        this.$data = obj_instance.data;
        Observer(this.$data)
        Compile(obj_instance.el,this);
    }

}
// 数据劫持：数据监听函数observer，来检测数据变化
function Observer(data_instance) {
    if(!data_instance || typeof data_instance !== 'object') return;
    Object.keys(data_instance).forEach(key => {
        let value = data_instance[key]//获取key下的值，放在外面是为了让getter获取
        Observer(value)// 递归-子属性数据劫持，由于有子属性的对象，其value就是对象，所以这里是传入对象再次判断，但需要寻求出口，所以就有前面那一个判断
        /*
            以上字符串：可以理解为先把所有的可能性遍历出来之后再去赋值或者有操作
            那在这里就是先把name，more找出来，再找like，三个都找完后统一赋值
        */ 
        Object.defineProperty(data_instance, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(`访问了属性：${key} -> 值：${value}`)
                return value;
            },
            set(newValue){
                console.log(`属性${key}的值由${value}修改为${newValue}`)
                value = newValue;//修改了value值后，getter也会取最新的value变量值
                Observer(newValue)//定义getter和setter，就是用defineProperty方法
            }
        })
    })
}


// HTML末班解析
function Compile(element,vm){
    
}


// Oject.defineProperty(操作对象，操作属性，{
    // 传入对象，实现监听
    // enumerable:true// 可遍历
    // configurable:true//可改变
    // getter(){},
    // setter(){}
// })