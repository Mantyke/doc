function errorHandler(error: Error) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);

import * as dotenv from "dotenv";

dotenv.config();

import { getPosts, postToMDFile } from "./service/NotionService.ts";

async function main() {
  const posts = await getPosts();
  postToMDFile(posts);
}

main();
