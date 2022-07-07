import Observer from './observer'


function observe(data){
    // 观察对象：需要先判断这个对象
    if(typeof data !== 'object' || data === null) return; //不进行观察
    return new Observer(data);
}

export default observe