//默认绑定
// 如果this的指向为空，那么就指向window对象，如果this有use strict限制，那么会自动指向undefined

function a(){
    function b(){
        console.log(this)
        function c(){
            "use strict";
            console.log(this);
        }
        c();
    }
    b()
}
a()  


//隐式绑定
// this指向调用该方法的对象
let name = 'A';
function special(){
    console.log('name:',this.name);
}

let girl = {
    name:'B',
    detail:function(){
        console.log('name:',this.name);
    },
    woman:{
        name:'C',
        detail:function(){
            console.log('name:',this.name);
        }
    }
}

girl.detail()//girl调用，因此this指向girl
girl.woman.detail()//最后是woman调用的，所以this指向woman
girl.special()//尽管是定义在全局的函数，但归根结底也还是girl调用了函数，所以指向girl

 



//硬绑定
let girlName = {
    name:'小红',
    sayName:function(){
        console.log('我的女朋友是'+this.name);
    }
}

let girl1 = {
    name:'小白'
}

let girl2 = {
    name:'小黄'
}

girlName.sayName.call(girl1);//小白
girlName.sayName.call(girl2);//小黄


//构造函数的绑定
function lover(Cname){
    this.Cname = Cname;
    this.sayName = function(){
        console.log('我的老婆是',this.Cname);
    }
}

let Cname = '小白';
let xiaohong = new lover('小红');
xiaohong.sayName();//输出小红，毕竟构造函数以构造函数的内部Cname被绑定




