export interface Produto {
    id?: number;
    tipo: string;
    tamanho?: string;
    cor?: string;
    preco: number;
    disponibilidade?: boolean;
    created_at?: Date;
  }
  