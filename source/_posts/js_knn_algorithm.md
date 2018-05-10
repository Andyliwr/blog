---
layout: post
title: 人工智能入门---使用js实现k近邻算法
date: 2018-01-09 22:49:15
tags:
  - javascript
  - 人工智能
toc: true
reproduced: true
---

![手写数字识别](https://fs.andylistudio.com/blog/2018_01_09/ai.png)

#### 机器学习中的“hello world!”

就像我们学习编程语言一样，我们的第一个尝试就是在终端命令行中输出的 “Hello World”。机器学习中的 “Hello World” 便是识别手写字数据集。
![数字](https://fs.andylistudio.com/blog/2018_01_09/ai1.png/default)
想想在得到一张手写数字图片的数据之后如何分析出正确的数字？
[keras-js 的实际 demo](https://transcranial.github.io/keras-js/#/mnist-cnn)

#### 数据的表示和收集

图片其实放大来看其实就是一个个像素点，对于黑白图像，每个像素点就只有黑白两种颜色以及黑白深度的区别，怎样用一种程序的方式来表达一张白底黑字的图像的像素点分布以及它的黑白深度呢？
![图形的表示](https://fs.andylistudio.com/blog/2018_01_09/ai2.png/default)
如何将一张图转化成深度矩阵的格式是图像识别要做的，这是另一个广泛的课题，这里不展开。我们直接使用[MNIST 的数据集](http://yann.lecun.com/exdb/mnist/)，它的数据表示方式正如上面所描述的那样，只是 MNIST 数据集中每一张图片是包含 28 \* 28 个像素点的。

确定了数据的表示方式，接下来我们还需要对每个数据的实际含义进行标识。

回想一下我们自己是如何认识这些数字的？即我们是怎样认定图像中的 1 形状表示的就是数字 1？————事物的认识。认知是由他人（数学老师教的，告诉我们这样是 1，这样是 2）教育的。

为了收集训练数据，我们可以随机找人在手写识别程序中画数字，然后标识它的结果，最终以任何的形式（文本、表格…）储存。以手写字为例，我们可以用文本的方式存储，格式可以是这样：

```
0 0 0.3 0 1 0 ... n(=28) | 4
1 0 0.1 0 0 0 ... n(=28) | 6
....
n(=1000)
```

其中每一行代表一个训练数据（一个 MNIST 数据，有多少行表示有多少个数据），使用 “|” 分割数据的表示和它对应的数字。

在本文中我们将直接使用 MNIST 数据集，因此如何收集数据在这里不再展开。**在机器学习中经常会使用公开的数据集来进行训练和测试**。

通过确定数据的表示和收集，我们可以了解到的是：

* 数据是一切机器学习的基础；
* 训练数据的好坏将会影响到我们机器学习算法预测的准确率：
  * 想象一下如果某些数据我们标识错误，把 1 标识成 2；
  * 想象一下如果训练数据中有大量的重复值，或某个数字的数据量特别大而另外一些数字的数据量很小。

#### 准备数据

我们收集到的数据可能会以任何的一种形式存储，例如文本、表格、二进制文件等等。MNIST 数据集是使用二进制存储的，因此在程序中我们需要将它转换为 Javascript 比较容易操作的的数据格式，例如数组。

本文中我们将使用一个 NPM 包 [mnist](https://github.com/cazala/mnist) 提供的，已经转换好的数据，它的格式如下：

```
[
  {
    input: [0, 0.4, 0.5, 0, 0.1, 0, 0, 0, 0, ..., n], // n = 728
    output: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  },
  {
    input: [1, 0.4, 0.5, 0, 0.8, 0, 0.1, 0, 1, ..., n], // n = 728
    output: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 2
  },
  ....
]
```

**PS**: 这里不知道是不是写错了，28\*28 应该是 784，总之意思呢，就是 input 是 MNIST 的一个数据，output 是这个数据表示的数字，采用了一种叫做[One-Hot](https://www.jianshu.com/p/00f2affe553a)的编码方式，表达方式有点怪，有点像二进制，第一项为 1 的话就是 0，第二项为 1 的话就是 1，依次类推...

#### 选择一种算法

通过上面的数据准备，我们已经把一个现实中的问题转化成了一个数学问题：给定 728 个 0 到 1 之间数值的特征，应该将它分类到 0 ~ 9 哪个数字中？

这就是机器学习中的主要任务——分类。有很多的机器学习算法可以用来解决分类问题，文本将使用 k-近邻算法[k-NN](https://zh.wikipedia.org/wiki/%E6%9C%80%E8%BF%91%E9%84%B0%E5%B1%85%E6%B3%95)来解决这个问题，因为它非常有效且容易理解。

#### k-近邻算法概述

在一个 10 \* 10 的二维平面内画一条线把它分成 2 个区域(A/B)。假设我们不知道线是如何画的，但现已知有 4 个点，a 点坐标是 (1, 1) 属于区域 A，b 点坐标是 (2, 2) 属于区域 A，c 点坐标是 (9, 9) 属于区域 B，d 点坐标是 (8, 8) 属于区域 B。这时候再给定一个 e 点坐标是 (8.5, 8.5) ，请问它最有可能在哪个区域内？
![matlab](https://fs.andylistudio.com/blog/2018_01_09/ai3.png)

绝大多数人都会说“可能是 B”。我们是如何得出这个答案的？——因为它和 c, d “看起来更接近一些，更有可能在同一个区域”。同样的推论可以延伸至三维、四维甚至更多维度的数据中。MNIST 的数据表示就是 728 个特征的多纬数据，k-近邻算法同样适用。

> 存在一个训练样本集，并且样本集中每个数据都存在标签，即我们知道样本集中每一数据与所属分类的对应关系。输入没有标签的新数据后，将新数据的每个特征与样本集中数据对应的特征进行比较，然后算法提取样本特征最近邻的分类标签。一般来说，我们只选择样本数据集中前 k 个最相似的数据，这就是 k-近邻算法的 k 的出处。
> ——《机器学习实战》k 近邻算法

两个向量之间的距离可以通过欧几里得距离公式求得：
![欧几里得距离公式](https://fs.andylistudio.com/blog/2018_01_09/a4.png)

#### k-近邻算法实现

我们来使用 js 来实现 k-近邻算法（ps: 加了点注释，方便大家理解）
![算法分析](https://fs.andylistudio.com/blog/2018_01_09/ai5.png)

```js
/**
 * k-近邻算法函数
 * @param {Object} x 目标点的坐标，值类似与这种 [0, 0.4, 0.5, 0, 0.1, 0, 0, 0, 0, ..., n]
 * @param {Array} trainingData 训练数据，是一个二维数组，数组中每一项和x的格式差不多
 * @param {Array} labels 结果集，trainingData的每一项在labels中都会有一个值
 * @param {Number} k 人为定义的参数，就是选择样本数据集中前 k 个最相似的数据，后期可以通过调整来提高精确率
 */
function classify(x, trainingData, labels, k) {
  // 确定目标点 x 与训练数据中每个点的距离（欧几里得距离公式）
  const distances = [];
  trainingData.forEach(element => {
    let distance = 0;
    element.forEach((value, index) => {
      const diff = x[index] - value;
      distance += diff * diff;
    });
    distances.push(Math.sqrt(distance));
  });

  // 将训练数据按照与 x 点的距离从近到远排序
  const sortedDistIndicies = distances
    // 这一步是将距离数组转化成[{value: xxx, index: xxx}...]的格式，因为index属性后面会用到
    .map((value, index) => {
      return { value, index };
    })
    .sort((a, b) => a.value - b.value);

  // 确定前 k 个点类别的出现频率
  const classCount = {};
  for (let i = 0; k > i; i++) {
    // 得到当前距离值对应的label值，也就是在结果集对应的值
    const voteLabel = labels[sortedDistIndicies[i].index];
    classCount[voteLabel] = (classCount[voteLabel] || 0) + 1;
  }

  // 返回出现频率最高的类别作为当前点的预测分类
  let predictedClass = '';
  let topCount = 0;
  for (const voteLabel in classCount) {
    if (classCount[voteLabel] > topCount) {
      predictedClass = voteLabel;
      topCount = classCount[voteLabel];
    }
  }

  return predictedClass;
}
```

#### 测试算法

为了验证我们的算法的效果，我们需要对其进行测试。这就需要引入测试数据。在机器学习中通常会将收集到的数据通过一定的方法划分为训练数据和测试数据然后用于训练和测试。如何划分数据在这里不展开，在本示例中，我们按照 80:20 的比例来划分训练和测试数据，互斥性和随机性由 MNIST 库进行保证。

拿到训练和测试数据后我们就可以对上一步编写的算法进行测试了，我们用错误率来评估算法的可靠性，错误率越低则越可靠：

```js
const classify = require('./kNN');

// 1. 收集数据：忽略，直接使用 MNIST
const mnist = require('mnist');

// 2. 准备数据
let trainingImages = [];
let labels = [];

// 划分数据
const trainingCount = 8000;
const testCount = 2000;
const set = mnist.set(trainingCount, testCount);
const trainingSet = set.training;
const testSet = set.test;

// 为我们的 k-NN 算法准备特定的数据格式
trainingSet.forEach(({ input, output }) => {
  // One-Hot to number
  const number = output.indexOf(output.reduce((max, activation) => Math.max(max, activation), 0));
  trainingImages.push(input);
  labels.push(number);
});

// 3. 分析数据：在命令行中检查数据，确保它的格式符合要求
console.log('trainingImages', JSON.stringify(trainingImages));
console.log('labels', JSON.stringify(labels));

// 4. 测试算法
let errorCount = 0;
const startTime = Date.now();
testSet.forEach(({ input, output }, key) => {
  const number = output.indexOf(output.reduce((max, activation) => Math.max(max, activation), 0));
  const predicted = classify(input, trainingImages, labels, 3);
  const result = predicted == number;
  console.log(`${key}. number is ${number}, predicted is ${predicted}, result is ${result}`);

  if (!result) {
    errorCount++;
  }
});

console.log(`The total number of errors is: ${errorCount}`);
console.log(`The total error rate is: ${errorCount / testCount}`);
console.log(`Spend: ${(Date.now() - startTime) / 1000}s`);
```

如无意外，你的终端将会输出这样的结果：
![运行结果](https://fs.andylistudio.com/blog/2018_01_09/ai7.png)
最终错误率的值大约是 5%。这个结果好吗？并不好。我们可以通过改变 k 的值、改变训练样本的数目影响 k-近邻算法的错误率，读者可以尝试改变这些变量值观察错误率的变化。实际上，只要将 k-近邻算法稍加改良，我们就能够把错误率降到 1% 以下！
![更多的k-近邻算法](https://fs.andylistudio.com/blog/2018_01_09/ai6.png)

我们也应该注意到的是，我们的算法在 8000 条训练数据集和 2000 条测试数据集上进行测试，运行了 325 秒！这是一个很差的结果。在实际生产环境中，我们不仅应该关注准确率也应该关注算法的执行效率。

#### 使用算法

只要测试的算法效果符合预期，我们就可以将算法部署到生产环境进行使用了。我们可以将算法和手写识别程序结合起来，完成一整套获取输入 -> 算法预测 -> 输出结果的流程：首先手写识别程序将用户输入的图像转换为我们期望的数据格式，然后执行我们的算法获取预测的分类。代码可能是这样：

```js
// 手写识别程序将用户输入的图像转换为我们期望的数据格式
const input = [0, 0.3, 1, 1, 0, 0, 0.2, ...];

// 执行算法
classify(input, trainingImages, labels, 3);
```

很遗憾，在执行算法时我们还是看到了 trainingImages 的存在。这意味着每次预测我们的机器都需要给训练数据准备格外的存储空间。假设训练数据很大（这很常见），则会给我们的生产环境机器造成巨大的内存压力。

每次调用算法还需要传入训练数据的方式即浪费存储空间也不优雅，它只能作为我们的示例进行使用。

#### 进一步思考

本文我们使用 Javascript 实现了一个非常简单的机器学习算法，并用其来测试 MNIST 数据集，完整代码实现在这个仓库中。这只是一个简单的示例，但从中我们了解到了机器学习的基本概念和解决问题的一般过程。进一步思考，上面的流程中每一步都可能被优化：

* 对于手写字，还有没有其他的数据表示方式？例如我们非要用 0 到 1 的数值来表示点的黑白度吗？
* 训练数据集是越大越好吗？例如我们将手写字所有的特征排列组合 (28^28) 个数据量作为训练数据集；
* 如何调整算法参数以获得最佳的收益（准确率和效率）？

**原文地址**：http://taobaofed.org/blog/2017/12/07/machine-learning/
**github 项目地址**: https://github.com/alvinhui/machine_learning
