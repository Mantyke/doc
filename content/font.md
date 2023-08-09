---
author: 
title: 全站更换京华老宋体
tags:
    - Blog
    - 字体
categories:
    - 关于博客本身
date: '2023-08-05'
description: 每次给网站换字体都像拍摄神秘学综艺
toc: 1
---

思源宋体用腻了，想给这个站点配个复古一点的印刷体


## 字体来源


[【新字发布】京華老宋体](https://mp.weixin.qq.com/s/JWyx3mXpgsEacZ4ADTOd-Q)


[其他可商用复古字体参考](https://wumanzoo.com/10-retro-fonts-for-free-download)

<details>
<summary>京華老宋体授权声明</summary>
1. 本字体免费商用，可随意用于各类平面、包装、宣传、影视、网页等美术设计中，也可以嵌入电子产品、软件应用之中。<br>
2. 本字体可随意复制传播，但不可单独作为字体文件出售、盈利。<br>
3. 请勿随意修改本字体字形，更不许传播修改版文件。<br>
4. 本字体字形不符合任何地区的现有文字规范，切勿将本字体用于教育或其他用字讲究的正规场合。<br>
5. 切不可将本字体用于违法犯罪活动。

</details>


## Step1 给字体抽子集


字体源文件TTF格式有31M，三万余字，作为博客来说，用不到这么多。


常规给字体抽子集是用[字蛛](https://github.com/allanguys/font-spider-plus)，理论上来说，就是以指定的文字内容，来生成新的字体文件，但使用的时候报错


`'NoneType' object has no attribute 'Axis’` 寻找解决方法无果，猜测是这个字体文件本身可能有点问题，于是作罢。


类似的还有[Fontmin](http://ecomfe.github.io/fontmin/)，原理和字蛛类似，也还是不能用


另一个看起来更优雅的方案是[**Font Tailo**](https://github.com/levythu/Font-tailor)[r](https://github.com/levythu/Font-tailor)，但我没看明白怎么用，暂时搁置


最后使用了[FontSubsetGUI](https://gitcode.net/linxinfa/fontmaker)，有个图形化界面确实好操作一点


至于指定的文字内容，一开始找到了一个[常用字库](https://github.com/kaienfr/Font/tree/master/learnfiles)，但实际操作之后发现并不适用，比如网站标题的“槎”就不包含在常用字符内。如果要量身定制，最好的素材就是我自己写过的博客文章。


```python
import os
import shutil

# 获取目录下所有.md文件名
file_list = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.md'):
            file_list.append(os.path.join(root, file))

# 将所有md文件内容写入新文件中
with open('all.md', 'wb') as f:
    for file_name in file_list:
        with open(file_name, 'rb') as file:
            shutil.copyfileobj(file, f)
```


## Step2 导入站点


在CSS文件中写入以下内容：


```python
@font-face {
  font-family: "KingHwa_OldSong";
  src: url("/font/KingHwa_OldSong-blog.woff2") format("woff2");
}
```


并加入：


```python
body {
  font-family: 'KingHwa_OldSong', 'Source Han Serif CN';
}
```


## 遇见的坑

1. python看太多，忘记了css有一对大括号（……）
2. 用网页工具给ttf转woff2，转出的字体正常加载，但不能被读取（……）
3. 第二个问题也遇见了太多次了吧……

    
---

本篇文章使用[Notion](https://notion.so)创作，由我的[自动化工具](https://scarsu.com/notion_to_blog)从Notion同步。
