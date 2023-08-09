function errorHandler(error: Error) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);

import * as dotenv from "dotenv";

dotenv.config();

import { getFEDNews, updateNewsFile } from "./service/NotionService.ts";

async function main() {
  await updateNewsFile(await getFEDNews() || []);
}

main();
