import Vue from 'vue';//导入的自己的原生vue


// 传入对象 里面有一些选项，比如computed，watch，methods等，所以叫Options API
debugger;
let vm = new Vue({
    el:'#app',
    data(){
        // 数据 - 数据劫持 -文本编译 -- 渲染视图
        return {
            title:'学生列表',
            classNum:1,
            teacher:['张三','李四'],
            total:2,
            info:{
                a:{
                    b:1
                }
            },
            students:[
                {
                    id:1,
                    name:'小红'
                },
                {
                    id:2,
                    name:'小明'
                }
            ]
        }
    }
});

console.log(vm.teacher[0]) 


/*
实现流程：
new Vue -> data()执行后返回一个数据对象
由index.js来初始化data：在Vue的原型属性上挂载一个initState方法（源码用插件的方法，但思路相同），三要素：固定this，在vm对象上把用户的options传进来，然后最后传进initState
initState 方法主要是对 props、methods、data、computed 和 wathcer 等属性做了初始化操作。
init.js：
    数据劫持（拦截）的目的：希望是在做操作的时候，我们可以给它增加一些东西，比如视图的绑定（数据变化时，视图也变化）。
    1、分类（处理computed，data，methods等options,这里只处理data）：判断data是不是function,不是的话那就是对象，所以判断情况来拿到vm里面的data（目的拿到data函数中的数据）
        一个是对定义 data 函数返回对象的遍历，通过 proxy 把每一个值 vm._data.xxx 都代理到 vm.xxx 上；另一个是调用 observe 方法观测整个 data 的变化，把 data 也变成响应式    
        2、希望通过vm.data就能访问：利用proxyData，对vm._data 做一个数据劫持（代理）
        3、proxy.js：利用Object.defineProperty来进行属性的数据劫持，只要访问vm.title的时候，实际上访问的是vm._data.title
        4、虽然设置了数据劫持，但还是要让数据对象变得“可观测”，即每次数据读或写时，我们能感知到数据被读取了或数据被改写了，所以用observe
        5、observe.js: （observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 Observer 对象实例）
            判断：只拦截对象，如果不是对象或者是null的时候不会进行观察，如果是对象或者数据，用observer来观察（目的仅仅是观察数据）
    6、observer.js: （它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新）区分对象和数组

        （会对 value 做判断，对于数组会调用 observeArr 方法，否则对纯对象调用 walk 方法。
        可以看到 observeArr 是遍历数组再次调用 observe 方法，而 walk 方法是遍历对象的 key 调用 defineReactive 方法）


        对象：遍历对象中的属性，拿到对应的值，然后用defineReactiveData来劫持，来制作响应式数据
            reactive.js：这里的Object.defineProperty用来制作响应式，但get的value或者set的newValue都有可能也是嵌套的数据或对象，需要对这些对象进行观察


                    （defineReactive 函数最开始初始化 Dep 对象的实例，接着拿到 obj 的属性描述符，然后对子对象递归调用 observe 方法，
                     这样就保证了无论 obj 的结构多复杂，它的所有子属性也能变成响应式的对象，
                     这样我们访问或修改 obj 中一个嵌套较深的属性，也能触发 getter 和 setter。） 
                     
                     
            array.js: 重新改写了数组的原型方法后，将原型赋值给data.__proto__ 令原型也变成响应式
        数组：config.js需要更改原数组的进行重写，由于这些方法都对系统中的数据进行改变，
              array.js: 每个数组的原型中有很多方法，除了安装原来的原型方法外，还对有可能新增的嵌套数组或者对象用observeArr进行observe
                        observeArr.js:简单地拆分插入的新数组然后重新observe

    7、定义订阅器：订阅器是指对那些跟视图有关的响应式数据的依赖收集，一个响应式数据在不同的钩子函数当中都会产生不同的依赖，然后dep会通知watcher去
    监听，完成依赖收集的方法就是：在视图需要某个响应式数据的时候，顺便把这个响应式数据加入依赖；在数据变化时，通知watcher要记得更新，以便视图也跟着更新


    Dep 是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 target，这是一个全局唯一 Watcher，
    这是一个非常巧妙的设计，因为在同一时间只能有一个全局的 Watcher 被计算，另外它的自身属性 subs 也是 Watcher 的数组。
    Dep 实际上就是对 Watcher 的一种管理，Dep 脱离 Watcher 单独存在是没有意义的。

    8、Watcher的实现：getter实例化渲染watcher时---将Dep.target 赋值为当前的渲染 watcher 并压栈（为了恢复用）---触发了数据对象的 getter 获取依赖的响应式数据
    ----做一些逻辑判断（保证同一数据不会被添加多次）后订阅到这个数据持有的 dep 的 subs 中 ---- 为后续数据变化时候能通知到哪些 subs 做准备---然后再解除绑定，轮到下一个watcher

    当我们在组件中对响应的数据做了修改，就会触发 setter 的逻辑，最后调用 watcher 中的 update 方法

    每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。
    之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
                        

*/ 
