/*
宏任务（硬菜）
微任务（软菜）
同步任务（水和米饭）

宏任务队列：
1、新程序或子程序被执行（script）
2、事件的回调函数，点击触发等等。
3、setTimeout和setInterval

微任务：
1、promise.then().catch().finally()
2、MutationObserver
3、Object.observe

事件循环：先执行同步任务（清空调用栈）—— 执行微任务队列的任务——执行宏任务

第一轮事件循环：宏任务——》微任务——》渲染——》宏任务
第二轮事件循环：宏任务——》微任务——》渲染——》宏任务
渲染（执行完js后看需不需要重新渲染）



1、Promise的链式调用then函数是怎么执行的：
    Promise.prototype.then 会隐式返回一个promise；
    .then是否会被推进微任务队列完全取决于接收的promise状态是如何的
        如果为pending的话，调用then会在该promise上注册一个回调函数，待状态改变后再推进微任务队列。
        如果为fulfilled或者是rejected的话，就会立即创建一个微任务，然后推入微任务队列。

2、new Promise(r=>r())和Promise.resolve()分析
    Promise.resolve():
    1、若传入一个promise实例，则直接返回这个实例对象：
    Promise.resolve(new Promise(resolve=>resolve('success'))) ====》 Promise {<fulfilled>: 'success'}
    2、若传入的是一个thenable对象，则会立即执行这个then方法
    let v = {
    then: function(resolve, reject) {
        console.log("v-begin");
        resolve("v-then");
    }
    };
    Promise.resolve(v)
    // 等价于
    Promise.resolve().then(()=>{
        console.log("v-begin");
        return "v-then"
    })

    3、若传入的不是以上的内容的话，那么就返回resolved状态的promise对象
    new Promise(r=>r())

。
*/

// let v = new Promise(resolve => {
//     resolve("v-then");
// });//实例对象
// Promise.resolve(v)
//     .then((v) => {
//         console.log(v)
//     });
//由于v是promise实例，所以相当于以下代码
new Promise(resolve =>{
    resolve("v-then");
}).then((v)=>{
    console.log(v)
})

// 此时的微任务队列 [ console.log(v) ]

new Promise(resolve => {
    resolve();
})
    .then(() => {
        console.log(2);
    })//此时的微任务队列 [ console.log(v) -> console.log(2)]
    .then(() => {
        console.log(3);
    })
    .then(() => {
        console.log(4);
    });

/*
分析new Promise(r=>r(v))
处理v参数分析有以下两种情况:
1、参数不是具有then方法的对象，或者不是对象，再或者不传参数，直接返回一个resolved状态的 Promise 对象
2、参数是具有then方法的对象或直接是一个Promise对象，通过NewPromiseResolveThenableJob()将v（thenable）包装成Promise 对象，
   这个过程是一个微任务，会加入微任务队列，等到下次循环发现v（thenable）是一个resolved状态的Promise，然后会执行v（thenable）对象的then方法，回调加入微任务队列等待执行。（不管v是Promise还是非Promise的thenable对象都会进行一次包装）

   人话解释：如果出现new Promise(这个promise是A)(r => r(new Promise(resolve=>resolve('这个是B'))))的情况，一共会经历三个阶段：
            1、包装promise：由于识别到B是thenable对象/promise对象，那么会调用NewPromiseResolveThenableJob() 会做两件事：a、将这个B包装为一个Promise对象;b、同时将新创建的Promise的then放入微任务中
            2、开箱promise：查看B的内部是resolve还是reject状态，相当于将包装的东西开箱：查看状态后看是resolve还是reject，然后将执行后的then推入微任务队列，而这个then并不是await后的then，而是new Promise(resolve=>resolve('这个是B')
            3、使用promise：当我开箱完毕后new Promise(resolve=>resolve(async2()))执行完毕，这时候返回一个promise，执行后面的then，这次就是真的把then推入微任务。

*/

/*
解答这道题
*/

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
  }
   
  async function async2() {
    console.log('async2 start');
    return new Promise((resolve, reject) => {
      resolve();
      console.log('async2 promise');
    })
  }
   
  console.log('script start');
   
  setTimeout(function() {
    console.log('setTimeout');
  }, 0);
   
  async1();
   
  new Promise(function(resolve) {
    debugger
    console.log('promise1');
    resolve();
  }).then(function() {
    console.log('promise2');
  }).then(function() {
    console.log('promise3');
  }).then(function() {
    console.log('promise5');
  }).then(function() {
    console.log('promise6');
  });
  
  Promise.resolve().then(function() {
    console.log('promise4');
  })

/*
同步任务：[]
微任务：W[t,2,4,p,3,?,5,6],
[5,6]

宏任务：H[]
1、同步任务：[async1 start]、同时遇到宏任务 H[setTimeout]
2、执行async2():[async1 start,async2 start,async2 promise], 由于async2返回一个Promise实例，形成 await new Promise... 相当于  new Promise(r => r(new Promise((resolve, reject) => {resolve();console.log('async2 promise');})))
3、开启NewPromiseResolveThenableJob():包装promise，W[packagePromise],
4、接着走同步任务：[async1 start,async2 start,async2 promise, promise1] resolve后将promise2推入微任务当中,W[packagePromise,promise2]
5、promise4也是微任务：推入微任务队列,W[packagePromise,promise2,promise4]
6、执行微任务：包装后，执行开箱 W[promise2，promise4 ,vt] ,输出promise2，同时推入promise3
7、执行微任务：[promise4,vt,promise3]，输出promise4
8、开箱动作：发现promise是resolve的，所以输出，将console.log('async1 end');这个then推入微任务：[promise3,async1 end]
9、按顺序执行完后再执行宏任务。

*/   

while(true) {

}
