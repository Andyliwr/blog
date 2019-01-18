---
title: Two Sum question
date: 2018-11-21 23:21:00
---

### 前言
今天是我使用leetcode学习算法的第一天，记录下自己的解题过程，以及学习到的东西

### 问题描述
>Given an array of integers, return indices of the two numbers such that they add up to a specific target.
>You may assume that each input would have exactly one solution, and you may not use the same element twice.
>Example:
```
Given nums = [2, 7, 11, 15], target = 9,
Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```
我的四级英语翻译：
> 给定一个整数数组，返回两个数字的索引，使它们相加到特定目标。
> 您可以假设每个输入只有一个解决方案，并且您可能不会两次使用相同的元素。

虽然是个算法菜鸟，我还是能写出解答的，第一次提交的算法是这样的：
```
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let result = []
    outer: // 外层循环标记
    for(let i=0; i<nums.length; i++) {
      let max = nums.length - i -1;
      for(let j=1; j<=max; j++) {
        if (nums[i] + nums[i+j] === target) {
          result = [i, i+j]
          break outer
        }
      }
    }
    return result
};
```
算法执行通过了，时间是163ms，竟然只打败了36%的人，也就是还有64%的人算法比我优秀 >_<
<font color="#666666" size="2">PS: Javascript允许跳出指定循环，方法就是在循环迁定义一个 tag，然后将跳出循环的语句变成 break tag 就好了</font>

然后我又改进了下自己的算法，变成了下面这个：
```
var twoSum = function(nums, target) {
    let result = []
    for(let i=0; i<nums.length; i++) {
      let sub = nums.slice(i+1);
      let index = sub.indexOf(target - nums[i])
      if (index > -1) {
        result = [i, i+index+1]
      }
    }
    return result
};
```
自以为信心满满，结果跑出来的结果比上一次还差，用了240ms，看来用js内置的方法并不能减少算法的执行时间
没办法了我已经黔驴技穷了，只能去别人的代码了。

```
var twoSum = function(nums, target) {
  let dict = {}
  for(var i = 0; i<nums.length; i++) {
    let inp = nums[i];
    let diff = target-inp;
    if(diff in dict) return [dict[diff], i];
    dict[inp] = i;
  }
  return null;
}
```
大神的代码大致思想就是，将数组转化成带索引的对象，然后每次循环的时候判断目标值减去当前值最后剩余的值在不在对象中，在的话就得到了结果。
这种方法是要聪明很多，将原来的O(n^2)的复杂度降低到了O(n)

### 心得体会
1. javascript跳出指定循环的方法
2. 用js内置的方法并不能减少算法的执行时间
3. 比我厉害的人还很多很多呀，多努力
