declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SALT_ROUNDS: string;
      DISCORD_ID: string;
      DISCORD_SECRET: string;
    }
  }
}
export {};
