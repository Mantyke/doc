---
author: 
title: Notion-to-Hugo
tags:
    - Blog
categories:
    - 关于博客本身
date: '2023-08-03'
description: 不如分类叫做“关于踩坑本身”
toc: 1
---

流程工具来源：[**Notion到博客的自动化更新**](https://scarsu.com/notion_to_blog/)


实现：Notion写作，自动转化为md文件，推送至博客仓库，并部署至博客。


## 踩到的坑


### 少文件了


报错：`“notion/notion_news.ts(13,44): error TS5097: An import path can only end with a ‘.ts’ extension when ‘allowImportingTsExtensions’ is enabled.”`  
解决：除了复制workflow文件及仓库内`/notion`文件夹文件之外，还需要加入`package.json`和`tsconfig.json`文件。


### 创建不行，得连接


报错：`Could not find database with ID”Database id”，Make sure the relevant pages and databases are shared with your integration`  
解决：创建Notion Database之后，进入Database（也是一个踩坑点，如果Database内联在文章中，文章的ID不能作为Database ID），右上角点击三个圆点，选择connection到之前所创建的API中，Database才能正常被读取


### 粗心大意失荆州


报错如下，需要Database内字段属性与`NotionService.ts`内属性一一对应


```typescript
TypeError: Cannot read properties of undefined (reading 'created_time')
    at file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:97:50
    at Array.forEach (<anonymous>)
    at postToMDFile (file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:90:9)
    at main (file:///home/runner/work/magazine-blog/magazine-blog/notion/notion_post.ts:17:3)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```


### 论学好英语的重要性


报错如下，其实原因是因为Database内字段名称与`NotionService.ts`不一致，但可以将相应行改成：`const category=post.properties.category.select.name?post.properties.category.name:'default name'`，当值为空时赋值`'default name'`


```typescript
TypeError: Cannot read properties of null (reading 'name')
    at file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:96:54
    at Array.forEach (<anonymous>)
    at postToMDFile (file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:90:9)
    at main (file:///home/runner/work/magazine-blog/magazine-blog/notion/notion_post.ts:17:3)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
Error: Process completed with exit code 1.
```


```typescript
TypeError: Cannot read properties of undefined (reading '0')
    at file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:102:32
    at Array.forEach (<anonymous>)
    at postToMDFile (file:///home/runner/work/magazine-blog/magazine-blog/notion/service/NotionService.ts:90:9)
    at main (file:///home/runner/work/magazine-blog/magazine-blog/notion/notion_post.ts:17:3)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
Error: Process completed with exit code 1.
```


### 一些适配工作


正确读取Notion文章，但是Front Matter不能正确拉取：

1. Hugo默认Front Matter分类名称为`categories`
2. 记得在转化Front Matter的代码最后一段，`---` 前加入一个空行，保证Frontmatter被正确读取。
3. 修改`date: ${date}`为`date: '${date}'` ，Hugo要求日期前后以引号包裹。
4. Hugo要求时间格式为yyyy-MM-dd，其中月份为个位数时，如8月，写作“08”，因此需要修改时间格式化相关代码。

```typescript
function formatDate(date: string | Date) {
  date = new Date(date);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${date.getFullYear()}-${month}-${date.getDate().toString().padStart(2, '0')}`;
}
```


### 发生了什么？


报错：我也不知道怎么出现的，但写了个`.gitignore` 文件加入这两个文件就OK了。
千万不要尝试`git add`这两个文件，Gtihub Action跑出来的行数还挺吓人的。


```typescript
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	node_modules/
	package-lock.json
nothing added to commit but untracked files present (use "git add" to track)
Error: Process completed with exit code 1.
```


### Vercel你也来了


Vercel构建博客时报错，报错信息没存，用`.vercelignore`解决了，构建时忽略以下文件：


```arduino
tsconfig.json
notion_news.ts
notion_post.ts
EnvService.ts
NotionService.ts
package.json
```


### 想起来再补


还有一些零零碎碎的其他问题但没有太大印象了，看报错内容就能意识到是怎么回事……


## 其他类似实现方案：


[notion实现自动发布到hugo github博客](https://www.cnblogs.com/Akkuman/p/15672566.html)


[Notion 笔记的自动备份方案](https://www.v2ex.com/t/815654)


[语雀/Notion云端博客写作，同步部署到Hexo/Vitepress/Confluence等多平台](https://juejin.cn/post/7229259138919366716)


[使用 Notion Database 管理静态博客文章](https://lailin.xyz/post/notion-markdown-blog.html)


    
---

本篇文章使用[Notion](https://notion.so)创作，由我的[自动化工具](https://scarsu.com/notion_to_blog)从Notion同步。
