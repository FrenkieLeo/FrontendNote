class Commitment {
    static PENDING = '待定'; static FULFILLED = '成功'; static REJECTED = '拒绝'
    constructor(func) {
        this.status = Commitment.PENDING //默认状态就是pengding，随后根据实际情况改变
        this.result = null
        this.resolveCallbacks = [];//任务队列，用于在异步当中排队的时候存放的，利用数组是因为数组是先入先出的状态
        this.rejectCallbacks = [];
        try {
            func(this.resolve.bind(this), this.reject.bind(this));//需要为这个函数的参数传入自己的函数
            //bind:给实例的resolve和reject方法绑定这个this为当前的实例对象。
        }
        catch (err) {
            this.reject(err)//这里不需要使用bind，因为这里是直接执行，不是创建实例后再执行
        }

    }


    resolve(result) {
        setTimeout(() => {
            if (this.status == Commitment.PENDING) {
                this.status = Commitment.FULFILLED
                this.result = result
                //resolve执行完之后再在resolveCallbacks当中寻找是否有剩余任务，如果有的话就执行。
                this.resolveCallbacks.forEach(callback =>{
                    callback(result)
                })
            }
        })
    }
    reject(result) {
        setTimeout(() => {
            if (this.status == Commitment.PENDING) {
                this.status = Commitment.FULFILLED
                this.result = result;
                
                this.rejectCallbacks.forEach(callback =>{
                    callback(result)
                })
            }
        })
        
    }

    then(onFULFILLED, onREJECTED) {
        //提前判断，如果onFULFILLED函数是一个函数的话，那就将函数本身再赋值给它，如果不是一个函数的话，那么就赋值一个空函数，这样怎么样都不会报错。
        onFULFILLED == typeof onFULFILLED === 'function' ? onFULFILLED : () => { }
        onREJECTED == typeof onREJECTED === 'function' ? onREJECTED : () => { }
        if(this.status === Commitment.PENDING){
            //处理pending状态的后
            this.resolveCallbacks.push(onFULFILLED)
            this.rejectCallbacks.push(onREJECTED)
        }
        if (this.status === Commitment.FULFILLED) {
            setTimeout(() => {
                onFULFILLED(this.result);
            })

        }
        if (this.status === Commitment.REJECTED) {
            setTimeout(() => {
                onREJECTED(this.result);
            })
        }
    }


}
console.log('第一步')
let commitment = new Commitment((resolve, reject) => {
    console.log('第二步')
    setTimeout(()=>{
        resolve('这次一定')
        console.log('第四步')

    })
})

commitment.then(
    result =>{console.log(result) },
    result => { console.log(result.message) }
)
console.log('第三步')

// 1、用类方法来创建这两个函数
// 2、虽然现在是创建的resolve 和 reject，但是没有被调用，那么func(resolve,reject)并不会被调用，需要用this来调用自身的class方法
// 3、resolve和reject需要利用状态来执行，那就是fulfilled，pending还有rejected,因此需要定义变量
// 4、由于resolve和reject都是可以传参的，所以将穿进去的参数称为result，后续可以利用这个result

//5、 let commitment = new Commitment((resolve,reject)=>{
//     resolve('这次一定')
// })
//this的指向问题：当我们new一个commitment对象的时候，constructor中的this确实是指向commitment，但是如果我们调用resolve的时候this就会丢失
// 出现'Uncaught TypeError: Cannot read properties of undefined (reading 'status')',这是因为类中的resolve中的this不是指向类，所以里头的this.status不是我们想要的那个status
//因此我们使用bind的方法绑定一下this，这样在构建函数的时候this就会绑定构造函数所在的this

//6、then :then方法可以传入两个参数，一个是成功时执行的代码，一个是失败时的代码，所以只会执行其中一个，所以我们需要在代码当中强调这一点


//7、执行异常：a、如果在执行构造函数的时候报错，我们想的是不能让系统报error而是通过reject的方式将错误信息输出出来，于是我们需要在构造函数的里面进行错误捕捉
//保证
//b、原生Promise里规定then里面的两个参数如果不是函数的话就要被忽略，所以需要对then的传参进行,如果我们传入非函数的参数，那么就会出现
// TypeError: onFULFILLED is not a function这个错误，所以我们需要对此进行判断。


//8、异步功能：原生promise的运行顺序规则（宏任务和微任务——事件循环）。因此可以设定一个settimeout进行异步执行.
//  但会出现一个问题：如果在原生promise当中加入一个settimeout，那么我们需要讨论一下settimeout是异步的，then也是异步的，到底谁先谁后。
// 在原生当中应该是先执行then后执行settimeout
// 然后在手写代码当中，如果仅仅添加settimeout，then方法是不会执行的，原因是then方法里面是根据status来执行代码的，如果onFULFILLED没有被执行的话
// 很有可能是因为status错误. 在执行第一、二、三步的时候就已经要处理异步了。所以错误的根源在于，肯定是先执行了then方法，但是因为then方法内部没有对
// pending状态的处理，所以没有输出内容

// 9、因此需要用到回调函数保存这个方法，将任务放在队列当中，然后在执行完之后调用回调函数来将剩余的任务执行完毕
// 难点：resolve和reject是需要在事件循环的末尾执行的，所以需要将solve还有reject的所有代码用settimeout包裹起来
