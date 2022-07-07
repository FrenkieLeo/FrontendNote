import {ATTR,TEXT,REPLACE,REMOVE} from './patchTypes';

let patches={};//很多地方都要用到这个补丁包，这个是主角
// 由于结构需要深度遍历，所以这个node是有自己的index，所以外部需要一个index代表所有的节点编号，而vnodeWalk另外需要一个index
let vnIndex = 0;




function domDiff(oldVDom,newVDom){
    let index = 0; //这个是初始的，给vnodeWalk的index
    vnodeWalk(oldVDom,newVDom,index)//walk就是遍历的意思，虚拟节点的遍历，index需要有自己私有的
    return patches;

}
// 需要一个方法对比old和new两个dom，看哪里发生变化,index 是深度
// 由于vnodewalk肯定是不停递归的，所以遍历的是节点，所以传入的形参也应该是node
function vnodeWalk(oldNode,newNode,index){
    let vnPatch = [];//由于一个节点可能会有多个变更，所以用数组进行存储
    // 如果新的虚拟节点当中某个节点被删除了，那么就将删除这个节点推入到vnPatch中
    if(!newNode){
        vnPatch.push({
            type:REMOVE,
            index
        })
    }else if(typeof oldNode === 'string' && typeof newNode === 'string'){
        // 如果new和old的都是文本节点，则只需要进行text的变更
        // 先判断是否一样的，如果是一样的那就什么都不做
        if(oldNode!=newNode){
            vnPatch.push({
                type:TEXT,
                text:newNode,
            })
        }
    }else if(oldNode.type === newNode.type){
        // 两个都不是字符串，那就是元素节点，如果old的type是等于new的话证明需要比较属性的变化了，那就需要将属性的补丁拿出来
        const attrPatch = attrsWalk(oldNode.props,newNode.props) //遍历属性，新旧props进行比较,最后搞定之后需要将attrPatch放到patch当中
        // 如果attrPatch是个空对象，代表没有变化的话那就返回空对象
        if(Object.keys(attrPatch).length >0){
            vnPatch.push({
                type:ATTR,
                attrs:attrPatch
            })
        }
        // 遍历子节点，将老的children和新的children再对比
        childrenWalk(oldNode.children,newNode.children)
    }else{
        // 其他的情况就是整个节点都变化了
        vnPatch.push({
            type:REPLACE,
            newNode
        })
    }
    if(vnPatch.length>0){
        patches[index] = vnPatch;
    }
}

function attrsWalk(oldAttrs,newAttrs){
    let attrPatch = {}
    for(let key in oldAttrs){
        
        // 遍历后判断老的属性的key如果不等于newAttrs的key的时候，需要将补丁打进去。修改属性
        if(oldAttrs[key] !== newAttrs[key]){
            attrPatch[key] = newAttrs[key]//两个的属性值不一样的话，就修改属性。
        }
    }

    for(let key in newAttrs){
        // 如果老的node里面没有这个key，于是要增加属性，hasOwnProperty验证是否拥有这个key的属性，如果没有的话就打入补丁
        if(!oldAttrs.hasOwnProperty(key)){
            attrPatch[key] = newAttrs[key]
        }
    }
    return attrPatch;
    

}

function childrenWalk(oldChildren,newChildren){
    oldChildren.map((c,idx)=>{
        vnodeWalk(c,newChildren[idx],++vnIndex)//vnIndex决定了当前的节点，说明当前正在遍历的节点，放到外部的作用域当中的话，就能保证把所有的dom节点遍历完毕
    })
}

export default domDiff