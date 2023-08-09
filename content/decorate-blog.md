---
author: 
title: 装修笔记
tags:
    - Blog
    - 装修
categories:
    - 关于博客本身
date: '2023-08-03'
description: 就是你看到的这样
toc: 1
---
- [x] 加上盘古之白

### 修改代码样式


```css
/* code */
pre {
  border: 1px solid #ddd;
  box-shadow: 5px 5px 5px #eee;
  overflow-x: auto;
}
code { background: #f6f6f6; }
pre code {
  background: #f6f6f6;
  padding: .5em;
  display: block;
}
```


### 调整行距


```css
body {
  margin: 0;
  line-height: 1.8em;
  background: #CFC9BD;
}
```


### 歪门邪道给H2添加上边距


```css
h2{ padding: 50px 0px 0px 0; }
```


### 修改标题目录样式 


```css
#TableOfContents, #TOC, .comments {
    /* border-radius: 5px; */
    border: 4px double;
    margin-top: 20px;
    background: #f6f6f6
}
```


```css
.article-meta {
  text-decoration: none;
  background: #f6f6f6;
  padding: 5px;
  border-radius: 5px;
  border: 4px double;
}
```


```python
<div class="category">
    {{ range $i, $e := .Params.categories }}
    {{ default "分类： " (index $.Site.Params.text "tags") }}{{ if $i }} &hercon; {{ end }}<a href="{{ relURL (print "/categories/" $e | urlize) }}">{{ $e }}</a><a> | </a>
    {{ end }}
    {{ with .Params.tags }}
    {{ default "Tags: " (index $.Site.Params.text "tags") }}{{ range $i, $e := . }}{{ if $i }}; {{ end }}<a href="{{ relURL (print "/tags/" $e | urlize) }}">{{ $e }}</a>{{ end }}
    {{ end }}
  </div>
  {{ partial "meta.html" . }}
</div>
```


```python
.category {
text-align: right
}

.menu, .article-meta, footer, .post-nav {
    font-weight: bold;
    padding: 0px 20px;
}
```


    
---

本篇文章使用[Notion](https://notion.so)创作，由我的[自动化工具](https://scarsu.com/notion_to_blog)从Notion同步。
