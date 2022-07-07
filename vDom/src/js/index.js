import { createElement, render, renderDOM } from "./virtualDom";
import domDiff from './domDiff'
import doPatch from './doPatch'
// vDom1是老的虚拟节点，vDom2是新的虚拟节点
const vDom1 = createElement(
    'ul',
    {
        class: 'list',
        style: 'width:300pxl height:300px; background-color: orange;'
    },
    [
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 0
            },
            [
                createElement('p',
                    {
                        class: 'text'
                    }, [
                    '第一个列表项'
                ])
            ]),
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 1
            },
            [
                createElement('p',
                    {
                        class: 'text'
                    }, [
                    createElement(
                        'span', {
                        class: 'title'
                    }, [
                        '第2个列表项'
                    ])
                ])
            ]),
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 2
            },
            [
                '第三个列表项'
            ]),

    ]);

const vDom2 = createElement(
    'ul',
    {
        class: 'list-wrap',
        style: 'width:300pxl height:300px; background-color: orange;'
    },
    [
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 0
            },
            [
                createElement('p',
                    {
                        class: 'title'
                    }, [
                    '特殊列表项'
                ])
            ]),
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 1
            },
            [
                createElement('p',
                    {
                        class: 'text'
                    }, [])
            ]),
        createElement(
            'li',
            {
                class: 'item',
                'data-index': 2
            },
            [
                '第三个列表项'
            ]),

    ]);

// 将虚拟节点转换成一个长得像dom的结构，这就是虚拟dom的过程，但现在缺一个render函数去支撑渲染的行为。const realDom = render(vDom)

const rDom = render(vDom1)
renderDOM(rDom, document.getElementById('app'))//正式开始渲染



const patches = domDiff(vDom1, vDom2)//制作一个补丁包，然后打到页面当中去。
console.log(patches)

/*
打入补丁包
*/ 

doPatch(rDom,patches)