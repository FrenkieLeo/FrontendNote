import Element from './Element';

function createElement(type,props,children){
    return new Element(type,props,children)
}

function setAttrs(node, prop, value){
    switch(prop){
        case 'value':
            if(node.tagName === 'INPUT' || node.tagName === 'TEXTAREA'){
                node.value = value;
            }else{
                node.setAttribute(prop,value);
            }
            break;
        case 'style':
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(prop,value);
            break;
    }
}

// 将vDom转换成真实的节点
function render(vDom){
    const {type,props, children} = vDom
    const el = document.createElement(type)

    // 遍历属性
    /* 
        是要给el设置key这个属性，利用props[key]来获取，但有问题
        但里面有一些属性比如value与某些节点是不匹配的，比如input 和 textarae，直接setAttribute（）太过于简单粗暴了，所以要另外设置方法
    */ 
    for(let key in props){
        setAttrs(el,key,props[key])//考虑到这是对象，所以key是需要的，获取class，style那些东西，如果单单有这一行代码的话缺少了children的渲染

    }
    // 将children中的el也遍历完毕了，利用递归的方法，然后将children给到这个el
    children.map((c) =>{
        // 如果children是文本类型的话，没办法遍历，所以要判断一下是不是Element类型
        if(c instanceof Element){
            c = render(c);
        }else{
            c = document.createTextNode(c);
        }
        el.appendChild(c)
    })
    return el;
}

// rDom已经制作完毕之后，就需要一个渲染函数
function renderDOM(el,rootEl){
    rootEl.appendChild(el)
}
export {createElement,render,setAttrs,renderDOM}