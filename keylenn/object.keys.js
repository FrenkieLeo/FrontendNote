obj 
    a1(sort) [1, 2, 3, 4]
    b1 [0.1, 'a', -3]   
keys => a1 + b1
length > 100
root - 0.1
     - 'a'
     - -3 

js obj
obj.a
1. 数据属性 {
    value
}
2. 访问器属性: definedProperty {

}

vue2
data() {
    return {
        a: 1,
        b: {}
        c: [],
    }
}

1. getter， 依赖注入
2. setter 
    this.a = 2
    this.b.c = 2
    this.$set(b, 'c', 1)
3. 为什么要重写数组方法??
this.c.push(3)
this.c[2]=3

vue3 Proxy + Reflect
元编程




vue2 vs vue3

es --- js() 

{}
Object
Object.create()