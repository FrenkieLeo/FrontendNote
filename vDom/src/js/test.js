// 制作补丁的内容(节点的编号与变化的内容)
/*
    type代表补丁的类型
    attr，text，index代表变化后的内容
*/ 
const patches = {
    0:[
        {
            type:'ATTR',//attr属性发生改变
            attrs:{
                class:'list-wrap'
            }//class修改为list-wrap
        }
    ],
    2:[
        {
            type:'ATTR',
            attrs:{
                class:'title'
            },
        }
    ],
    3:[
        {
            type:'TEXT',
            text:'特殊列表项'
        }
    ],
    6:[
        {
            type:'REMOVE',//删除
            index:6
        }
    ],
    7:[
        {
            type:'REPLACE',//替换
            newNode:newNode
        }
    ]
}

// 如果设计到节点的增加，这里不涉及，因为涉及到标号