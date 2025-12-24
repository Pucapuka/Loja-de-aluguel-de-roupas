import React, { useState, useEffect } from "react";
import icon from '../../assets/icon.png';

export default function Home() {
    
    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
            {/* Header Hero com Logo - Grande */}
            <div className="text-center py-6 px-4 flex-shrink-0">
                <div className="flex justify-center mb-4">
                    <img
                        src={icon}
                        alt="Sônia Batista Ateliê"
                        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded"
                        onError={(e) => {
                            console.error('❌ Erro ao carregar imagem.');
                            console.log('🔄 Tentando fallback...');
                            
                            // Tentar caminhos alternativos sequencialmente
                            const fallbackPaths = [
                                './logo.jpeg',
                                './public/logo.jpeg',
                                '../public/logo.jpeg',
                                '../../public/logo.jpeg',
                                'logo.jpeg',
                                '/logo.jpeg'
                            ];
                            
                            let currentSrc = e.target.src;
                            let currentIndex = fallbackPaths.indexOf(currentSrc);
                            
                            if (currentIndex === -1) {
                                // Primeira tentativa falhou, tentar primeiro fallback
                                e.target.src = fallbackPaths[0];
                            } else if (currentIndex < fallbackPaths.length - 1) {
                                // Tentar próximo fallback
                                e.target.src = fallbackPaths[currentIndex + 1];
                            } else {
                                // Todos os caminhos falharam, esconder imagem
                                console.log('❌ Todos os caminhos falharam, escondendo imagem');
                                e.target.style.display = 'none';
                            }
                        }}
                        onLoad={() => {
                            console.log('✅ Imagem carregada com sucesso!');
                        }}
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    Sônia Batista Ateliê
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Sistema de gestão para controle de estoque, clientes e aluguéis
                </p>
            </div>

            {/* Cards de Navegação - Centralizados com mais espaço */}
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-grow flex items-center">
                {/* Card Produtos */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="text-5xl mb-4 text-center">👗</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">Gerenciar Produtos</h2>
                    <p className="text-gray-600 mb-4 text-center text-sm flex-grow">
                        Controle estoque e cadastre produtos
                    </p>
                    <div className="text-center">
                        <a 
                            href="#/produtos" 
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                        >
                            Acessar Estoque
                        </a>
                    </div>
                </div>

                {/* Card Clientes */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="text-5xl mb-4 text-center">👥</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">Gerenciar Clientes</h2>
                    <p className="text-gray-600 mb-4 text-center text-sm flex-grow">
                        Cadastre e gerencie clientes
                    </p>
                    <div className="text-center">
                        <a 
                            href="#/clientes" 
                            className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                        >
                            Ver Clientes
                        </a>
                    </div>
                </div>

                {/* Card Aluguéis */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="text-5xl mb-4 text-center">📦</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">Gerenciar Aluguéis</h2>
                    <p className="text-gray-600 mb-4 text-center text-sm flex-grow">
                        Controle aluguéis e devoluções
                    </p>
                    <div className="text-center">
                        <a 
                            href="#/alugueis" 
                            className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold"
                        >
                            Controle Aluguéis
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Compacto */}
            <div className="bg-gray-800 text-white py-6 px-4 text-center flex-shrink-0">
                <p className="text-md">Sônia Batista Ateliê - Sistema de Gestão</p>
                <p className="text-gray-400 mt-1 text-sm">Desenvolvido por Magic Soluções em TI</p>
                <p className="text-gray-400 mt-1 text-sm">✉️ solucoes.magic.ti@gmail.com</p>
                <p className="text-gray-400 mt-1 text-sm">🕻 (99)9 8408-0173</p>
            </div>
        </div>
    )
}