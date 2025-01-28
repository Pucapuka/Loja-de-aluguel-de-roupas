import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionString: process.env.DATABASE_URL,
});

db.connect()
  .then(() => console.log('Conexão com o banco de dados estabelecida'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));
