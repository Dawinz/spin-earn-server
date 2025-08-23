declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      MONGODB_URI?: string;
      JWT_ACCESS_SECRET?: string;
      JWT_REFRESH_SECRET?: string;
      JWT_ACCESS_EXPIRES_IN?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      ALLOWED_ORIGINS?: string;
      SSV_SHARED_SECRET?: string;
      ADMOB_APP_ID_ANDROID?: string;
      ADMOB_APP_ID_IOS?: string;
      RATE_LIMIT_WINDOW_MS?: string;
      RATE_LIMIT_MAX_REQUESTS?: string;
      BCRYPT_ROUNDS?: string;
      DEFAULT_DAILY_SPIN_LIMIT?: string;
      DEFAULT_MIN_WITHDRAWAL?: string;
      [key: string]: string | undefined;
    }
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
  exit: (code?: number) => never;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
};

export {};
