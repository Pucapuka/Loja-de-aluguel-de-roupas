import React, { useState, useEffect } from "react";

export default function FormClientes({ onSave, editar }) {
  const [form, setForm] = useState({ 
    nome: "",
    cpf: "",
    telefone: "", 
    email: "", 
    endereco: "" 
  });
  const [mensagem, setMensagem] = useState(null);
  const [cpfValido, setCpfValido] = useState(true);

  const validarCPF = (cpf) => {
    if (!cpf) return false;
    
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica tamanho e sequências inválidas
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    
    // Função para calcular dígito verificador
    const calcularDigito = (slice) => {
        let soma = 0;
        for (let i = 0; i < slice.length; i++) {
            soma += parseInt(slice[i]) * (slice.length + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };
    
    // Verifica primeiro dígito
    const digito1 = calcularDigito(cpf.slice(0, 9));
    if (digito1 !== parseInt(cpf[9])) {
        return false;
    }
    
    // Verifica segundo dígito
    const digito2 = calcularDigito(cpf.slice(0, 10));
    if (digito2 !== parseInt(cpf[10])) {
        return false;
    }
    
    return true;
  };

  const formatarCpf = (cpf) => {
    if(!cpf) return '';
    
    const numeros = cpf.replace(/\D/g, '').slice(0, 11);

    if(numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  };

  useEffect(() => { 
    if (editar) {
      setForm({
        nome: editar.nome || "",
        cpf: editar.cpf ? formatarCpf(editar.cpf) : "", // Formata o CPF ao editar
        telefone: editar.telefone || "",
        email: editar.email || "",
        endereco: editar.endereco || ""
      });
    }
  }, [editar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfFormatado = formatarCpf(value);
      setForm({ ...form, [name]: cpfFormatado });
      
      // Valida em tempo real quando tiver 11 dígitos
      const cpfNumeros = cpfFormatado.replace(/\D/g, '');
      if (cpfNumeros.length === 11) {
        setCpfValido(validarCPF(cpfFormatado));
      } else {
        setCpfValido(true); // Reset até ter 11 dígitos
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida CPF se estiver preenchido
    if (form.cpf && form.cpf.replace(/\D/g, '').length > 0) {
      if (!validarCPF(form.cpf)) {
        setMensagem({ tipo: "error", texto: "CPF inválido!" });
        return;
      }
    }

    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/clientes/${editar.id}` : "http://localhost:5000/api/clientes",
        { 
          method: editar ? "PUT" : "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({
            ...form,
            cpf: form.cpf.replace(/\D/g, '') // Salva sem formatação
          }) 
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar cliente");
      }
      
      setMensagem({ 
        tipo: "success", 
        texto: editar ? "Cliente atualizado!" : "Cliente cadastrado!" 
      });
      setForm({ 
        nome: "", 
        cpf: "", 
        telefone: "", 
        email: "", 
        endereco: "" 
      });
      setCpfValido(true);
      onSave();
    } catch (err) {
      setMensagem({ tipo: "error", texto: err.message });
    }
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-gray-100 rounded shadow-md">
      {mensagem && (
        <div className={`p-2 rounded ${mensagem.tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input 
            name="nome" 
            placeholder="Nome completo" 
            value={form.nome} 
            onChange={handleChange} 
            required 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
          <input
            name="cpf"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={handleChange}
            maxLength="14"
            className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              !cpfValido && form.cpf ? 'border-red-500 bg-red-50' : ''
            }`}
          />
          {!cpfValido && form.cpf && (
            <p className="text-red-500 text-sm mt-1">CPF inválido</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input 
            name="telefone" 
            placeholder="(00) 00000-0000" 
            value={form.telefone} 
            onChange={handleChange} 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input 
          name="email" 
          type="email"
          placeholder="email@exemplo.com" 
          value={form.email} 
          onChange={handleChange} 
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <textarea 
          name="endereco" 
          placeholder="Endereço completo" 
          value={form.endereco} 
          onChange={handleChange} 
          rows="3"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
        />
      </div>

      <button 
        type="submit" 
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors w-full md:w-auto"
      >
        {editar ? "Salvar edição" : "Cadastrar cliente"}
      </button>
    </form>
  );
}