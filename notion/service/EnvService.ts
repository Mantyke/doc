class EnvService {
  envs = {
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || "",
    NOTION_KEY: process.env.NOTION_KEY || "",
    NOTION_NEWS_DB_ID: process.env.NOTION_NEWS_DB_ID || "",
  };

  requiredEnvs: (keyof typeof this.envs)[] = ["NOTION_KEY"];

  constructor() {
    const lackEnvs = (
      Object.keys(this.envs) as Array<keyof typeof this.envs>
    ).filter((key) => {
      if (!this.requiredEnvs.includes(key)) {
        return false;
      }
      return !this.envs[key];
    });

    if (lackEnvs.length) {
      throw new Error(`缺少环境变量 ${lackEnvs.join("、")}`);
    }
  }
}

const envService = new EnvService();

export default envService;
