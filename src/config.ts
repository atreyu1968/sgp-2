interface Config {
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  api: {
    url: string;
  };
}

export const config: Config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'fpinnova',
    password: process.env.DB_PASSWORD || 'fpinnova',
    name: process.env.DB_NAME || 'fpinnova',
  },
  api: {
    url: process.env.VITE_API_URL || 'http://localhost:3000/api',
  },
};