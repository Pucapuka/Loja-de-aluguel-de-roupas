import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});
pool.on('connect', () => {
  console.log('Conectado ao banco de dados');
});

pool.on('error', (err, client) => {
  console.error('Erro no banco de dados:', err);
});

export default pool; // Exportando como default


/////////////////////////////////////////////////////////////////

//Usando o campo abaixo para testes, não deletar

// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// // Define qual arquivo de ambiente carregar
// const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
// dotenv.config({ path: envFile });

// const pool = new Pool({
//   connectionString: process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL,
// });

// export default pool;
