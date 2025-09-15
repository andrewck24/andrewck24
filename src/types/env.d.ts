declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    // Site Configuration
    GOOGLE_SITE_VERIFICATION?: string;
    NEXT_PUBLIC_APP_URL: string;

    // Analytics (future)
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GTAG_ID?: string;

    // Database (future)
    DATABASE_URL?: string;
    POSTGRES_URL?: string;
    POSTGRES_PRISMA_URL?: string;
    POSTGRES_URL_NON_POOLING?: string;
  }
}
