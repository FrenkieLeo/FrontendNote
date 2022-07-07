import {ATTR,TEXT,REPLACE,REMOVE} from './patchTypes';
import { render, setAttrs } from './virtualDom';
let finalPatches = {};
let rnIndex = 0; //真实节点的rnIndex


function doPatch(rDom,patches){
    finalPatches = patches; //将补丁赋值给finalPatches，这里的目的是先一次性将patches给过去，然后一个个处理补丁，将补丁放到rDom当中去
    rNodeWalk(rDom);//真实节点的遍历，为了给rDom定位那些地方需要打补丁
}

function rNodeWalk(rNode){
    const rnPatch = finalPatches[rnIndex ++] //每次取都+1 
    const childNodes = rNode.childNodes; //获取到rNode的子节点，然后再遍历一下

    [...childNodes].map((c)=>{
        rNodeWalk(c)//每次都放一个儿子进去
    });

    // 不是所有节点都需要修改，所以0,2之间还有一个1的节点为undefined，所以需要判断rnPatch当前的补丁不是undefined的时候打补丁
    if(rnPatch){
        patchAction(rNode,rnPatch);
    }
}

function patchAction(rNode,rnPatch){
    // rnPatch可能有多个补丁，于是是以数组的方式呈现的
    rnPatch.map((p)=>{
        switch(p.type){
            case ATTR:
                // 遍历属性
                for(let key in p.attrs){
                    const value = p.attrs[key];//如果是undefined，需要删除
                    if(value){
                        setAttrs(rNode,key,value); //设置这个属性
                    }else{
                        // 如果是undefined
                        rNode.removeAttribute(key);
                    }
                }
                break;
            case TEXT:
                // 给真实节点修改text内容
                rNode.textContent = p.text;
                break;
            case REPLACE:
                const newNode = (p.newNode instanceof Element)?render(p.newNode):document.createTextNode(p.newNode)
                rNode.parentNode.replaceChild(newNode,rNode);
                break;
            case REMOVE:
                rNode.parentNode.removeChild(rNode);
                break;
            default:
                break;
        }
    })
}

export default doPatch

/*
vNode = virtual Node;
vnPatch = virtual Node Patch
rNode = real Node
rnPatch = real Node Patch;
*/ 