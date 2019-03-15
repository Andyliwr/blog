---
title: Two Sum question
date: 2019-03-15 16:31:00
---

### 前言
时隔3个月我又来了，leetcode第二题，大数字相加

### 问题描述
>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.
>You may assume the two numbers do not contain any leading zero, except the number 0 itself.
>Example:
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```
我的四级英语翻译：
> 给定两个用户链表表示的非空数字，数字以相反的顺序存储，每个节点包含一个数字。添加两个数字并将其作为链接列表返回。。
> 您可以假设这两个数字不包含任何前导零，除了数字0本身。。
> 

这题不愧是中等难度提，把我脑壳都想破了，我的想法是这样，链表在js中好像没搞过呀，但是数字相加跟简单呀，能不能先将链表转化成数字，最后两个数字相加，再讲相加的结果重新转化成链表
于是balabala写了两个函数
```
// 将ListNode转化成数字
let transListNodeToNum = function(listNode) {
  let result = ''
  result = listNode.val + result
  if (listNode.next) {
    result = transListNodeToNum(listNode.next) + result
  }
  return result
}

// 将数字转化成ListNode
let transNumToListNode = function(num) {
  let result = {}
  let array = num.split('').reverse()
  result = new ListNode(array[0])
  if (array.length > 1) {
     result.next = transNumToListNode(array.slice(1).reverse().join(''))
  }
  return result
}
```
写这两个函数可费了很大力气，一开始想要用遍历去做，发现根本写不下去，于是改成用递归，还真的实现了。
最后欢欢乐乐去提交代码，结果出错了
![大数字相加错误](https://img.vim-cn.com/28/40dee6d4df70f0a256a2b8e501b7459b1b345c.png)
原因很简单，Javascript在表示大数字的时候会将其转化成科学计数法，这个时候将数字parseInt就会得到”+“，”e“这些乱七八糟的字符。
当然想着将科学计算法的数字转化成正常数字也没用，因为即使使用new Number(xxx)然后在toLocalString转了，精度就会有损失，比如10000000022就变成10000000000，最后两位没了。
经过上面的折腾我明白了，使用两个数字直接相加是没用的。然后我想起了之前学习算法的时候不是学了一个大数字相加的算法，于是去翻笔记把它找到了：
```js
function bigNumberAdd(num1, num2) {
  if (parseInt(num1) + parseInt(num2) === 10) {
    return '10'
  }
  let arr1 = num1.split('').reverse()
  let arr2 = num2.split('').reverse()
  let maxLen = arr1.length > arr2.length ? arr1.length : arr2.length
  let result = []
  let addNum = 0
  for(let i=0; i<maxLen; i++) {
    result[i] = parseInt(arr1[i] || 0) + parseInt(arr2[i] || 0) + addNum
    if (result[i] >= 10) {
      addNum = 1
      result[i] = result[i] % 10
    } else {
      addNum = 0
    }
  }
  return result.reverse().join('')
}
```
最后我使用bigNumberAdd去替换两数字直接相加，又重新提交了一遍，发现还是报错了，竟然连`[5], [5]`这么简单的用例都出错了，结果显示为`0`
我就纳闷了不应该是`[1,0]`吗？结果一检查发现bigNumberAdd的算法是有问题的，bigNumberAdd(5, 5)的结果竟然是0，因为执行过程中maxLen=1，所以循环只执行了一次，所以最后一个1没有附加到result上
我意识到是bigNumberAdd算法的问题于是动手改进下:
```
function bigNumberAdd(num1, num2) {
  let arr1 = num1.split('').reverse()
  let arr2 = num2.split('').reverse()
  let maxLen = arr1.length > arr2.length ? arr1.length : arr2.length
  let result = []
  let addNum = 0
  // 将循环条件改成i<=maxLen，让循环每次多执行一次
  for(let i=0; i<=maxLen; i++) {
    result[i] = parseInt(arr1[i] || 0) + parseInt(arr2[i] || 0) + addNum
    if (result[i] >= 10) {
      addNum = 1
      result[i] = result[i] % 10
    } else {
      addNum = 0
    }
  }
  // 因为每次循环都多执行了一次，所以可能会在数字开头多一个0，使用replace将其删除
  return result.reverse().join('').replace(/^0{1}/g, '')
}
```
至此所有的问题都解决了，重新提交一遍，结果通过了，不过算法的效率评分好低，哈哈
![编译结果](https://img.vim-cn.com/1a/5ffa1d252f1f8c87bf4fccb0ddf865a8d5a55b.jpg)

偷偷去看了下别人写的算法，不过还没来得及研究，粘贴下代码：
```js
var addTwoNumbers = function(l1, l2) {
  var l1p = l1; // list 1 pointer
  var l2p = l2; // list 2 pointer

  var prev = new ListNode(null);
  var prevp = prev; // prev pointer
  var carry = false;
  while(l1p || l2p) {
    var curr = l1p != null ? l1p : l2p;
    var val1 = l1p != null ? l1p.val : 0;
    var val2 = l2p != null ? l2p.val : 0;
    var val3 = carry ? 1:0;
    var sum = val1 + val2 + val3;
    if(sum > 9) {
      sum = sum - 10;
      carry = true;
    } else {
      carry = false;
    }
    curr.val = sum;
    prevp.next = curr;
    prevp = prevp.next;
    if(l1p) l1p = l1p.next;
    if(l2p) l2p = l2p.next;
  }
  if(carry) {
    prevp.next = new ListNode(1);
  }   
  return prev.next;
};
```


### 心得体会
1. 递归在手，天下我有
2. 大数字相加算法
3. 比我厉害的人还很多很多呀，多努力
