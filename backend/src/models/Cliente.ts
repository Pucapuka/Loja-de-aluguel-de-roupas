export interface Cliente {
    id?: number; // Opcional, pois o banco gera automaticamente
    nome: string;
    telefone?: string;
    email: string;
    created_at?: Date; // O banco gera automaticamente
  }
  