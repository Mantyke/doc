import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import envService from "./EnvService.ts";

const notion = new Client({
  auth: envService.envs.NOTION_KEY,
});
const databaseId = envService.envs.NOTION_DATABASE_ID;
const newsDBId = envService.envs.NOTION_NEWS_DB_ID;

const n2m = new NotionToMarkdown({
  notionClient: notion,
  config: {
    parseChildPages: false,
  },
});

async function getNotionPageStr(pageId: string) {
  const blocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(blocks).parent;
  return mdString;
}

export async function getPosts() {
  try {
    const { results: myPosts } = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "publish",
            checkbox: {
              equals: true,
            }
          }, {
            property: "lastUpdateDate",
            last_edited_time: {
              on_or_after: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(),
            }
          }
        ]
      }
    });
    console.log(`成功获取${myPosts.length}条posts`);
    const fullPosts = await Promise.all(
      myPosts.map(async (post: any, index: number) => {
        // console.log(post.id);
        return {
          ...post,
          content: await getNotionPageStr(post.id),
        };
      }),
    );
    console.log(`成功获取posts的md内容`);
    return fullPosts;
  } catch (error: any) {
    console.error(error.body);
    return [];
  }
}

export async function getFEDNews() {
  try {
    const { results: myNews } = await notion.databases.query({
      database_id: newsDBId,
      filter: {
        property: "lastUpdateDate",
        last_edited_time: {
          on_or_after: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(),
        }
      }
    });
    console.log(`成功获取${myNews.length}条FED news`);
    return myNews;
  } catch (error: any) {
    console.error(error.body);
    return [];
  }
}

function formatDate(date: string | Date) {
  date = new Date(date);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${date.getFullYear()}-${month}-${date.getDate().toString().padStart(2, '0')}`;
}

export function postToMDFile(posts: any) {
  console.log(" \r\n开始构建md文件... \r\n");
  // console.log(posts[0].properties.img.files[0]);
  posts.forEach((post: any) => {
    // console.log(JSON.stringify(post));
    const slug = post.properties.slug.rich_text?.map((i: any) => i.plain_text || '')?.join('');
    const title = post.properties.title.title?.map((i: any) => i.plain_text || '')?.join('');
    const author = post.properties.author.rich_text?.map((i: any) => i.plain_text || '')?.join('');
    const tags = post.properties.tags.multi_select.map((i: any) => i.name);
    const categories=post.properties.categories.select.name;
    const date = formatDate(post.properties.date.created_time);
    const description = post.properties.description.rich_text?.map((i: any) => i.plain_text || '')?.join('');
    const toc = post.properties.toc.checkbox ? 1 : 0;
    // const tags = post.properties.tags.multi_select.map((i:any)=>i.name);
    let front = `---
author: ${author}
title: ${title}
tags:`
    front += tags.map((tag: string) => (`
    - ${tag}`)).join('')
    front += `
categories:
    - ${categories}
date: '${date}'
description: ${description}
toc: ${toc}
---
`;
    let content = front + post.content;
    content += `
    
---

`
    console.log(`构建文章《${title}》成功\n`);
    // console.log(content);
    const filePath = `./content/${date}+{slug}.md`;
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }
    fs.appendFile(filePath, content, { encoding: 'utf8' }, function (err) {
      if (err) throw err;
      console.log(`写入文件${date}+{slug}.md成功`);
    });
  });
}

export async function updateNewsFile(newsList: any) {
  if (!newsList.length) return
  console.log(" \r\n开始更新/news/fed.json文件... \r\n");
  console.log(newsList[0].properties);
  const filePath = `./src/content/news/fed.json`;
  const fileBuf = await fs.readFileSync(filePath)
  if (!fileBuf) return
  const fileJSON = JSON.parse(fileBuf.toString())
  fileJSON.name = fileJSON.name || "前端资讯"
  fileJSON.list = fileJSON.list || []
  newsList.forEach((news: any) => {
    // console.log(JSON.stringify(news));
    const title = news.properties.title.title?.map((i: any) => i.plain_text || '')?.join('');
    const source = news.properties.source.rich_text?.map((i: any) => i.plain_text || '')?.join('');
    const desc = news.properties.desc.rich_text?.map((i: any) => i.plain_text || '')?.join('');
    const url = news.properties.url.url;
    const tags = news.properties.tags.multi_select.map((i: any) => i.name);
    const date = formatDate(news.properties.date.date.start);
    let newsObj = {
      title,
      tags,
      source,
      date,
      desc,
      url
    }
    console.log(`构建news《${title}》成功\n`);
    const dupIndex = fileJSON.list.findIndex((i: any) => i.title === title)
    if (dupIndex > -1) {
      fileJSON.list.splice(dupIndex, 1, newsObj)
    } else {
      fileJSON.list.unshift(newsObj)
    }

  })
  // console.log(fileJSON)
  fs.writeFileSync(filePath, "");
  fs.appendFile(filePath, JSON.stringify(fileJSON), { encoding: 'utf8' }, function (err) {
    if (err) throw err;
    console.log(`写入文件/news/fed.json成功`);
  });
}
