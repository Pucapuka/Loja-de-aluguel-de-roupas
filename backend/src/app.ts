import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clienteRoutes from './routes/clienteRoutes';
import produtoRoutes from './routes/produtoRoutes';
import aluguelRoutes from './routes/aluguelRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/alugueis', aluguelRoutes);

export default app;
