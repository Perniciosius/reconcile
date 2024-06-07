interface Config {
  port: number;
  database: DbConfig;
}

interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}
