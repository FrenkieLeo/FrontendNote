/*
原型对象：String，Number，Object等也是原型对象之一
let a = new String('string');

以String为例：a 为实例对象，属于儿子中的儿子，
__proto__视为找爷爷，所以a.__proto__ == String.prototype //true
prototype视为爸爸找爷爷，所以String.prototype == String
constructor 构造器可以作为爷爷找爸爸的东西，通过String.prototype.constructor == String // true
所以constructor指向构造a的对象

面试题：new一个对象的过程


*/
function Mother(lastName){
    this.lastName = lastName;
}

let son = new Mother('Da') // Da的构造函数返回新对象，如果只有let son = Mother('Da')，如果没有返回值的话就会自动返回这个新对象，相当于return this

/*
1、创建一个新对象 son
2、新对象会被执行[[prototype]]连接 : son.__proto__  = Monther.prototype;
3、新对象会对函数调用的this绑定起来
4、执行构造函数中的代码
5、如果函数没有返回值，那么就会自动返回这个新对象
*/ 

/*
原型链： 当儿子找不到属性时会通过__proto__原型对象中查找，如果爷爷当中找不到就顺着原型链继续查找
*/ 

let F = function(){}

Object.prototype.a = function(){}
Function.prototype.b = function(){}

let f = new F();

console.log(f.a) 
//输出a的function，这是因为f找不到a == F当中没有a，所以顺着f.__proto__  == F.prototype找a 也没有，然后再顺着F.__proto__ == Object.prototype
// 如果a