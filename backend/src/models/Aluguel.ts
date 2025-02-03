export interface Aluguel {
    id?: number;
    cliente_id: number;
    produto_id: number;
    data_retirada: Date;
    data_devolucao?: Date;
    valor_total?: number;
    finalizado?: boolean;
    created_at?: Date;
  }
  