# Container único Full-Stack - VERSÃO FINAL OTIMIZADA
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Copiar apenas arquivos necessários para npm install (melhora cache)
COPY package*.json ./
COPY webpack.config.js ./
RUN npm ci

# 2. Copiar resto e buildar frontend
COPY . .
RUN npm run build:web

# 3. Backend - instalar apenas produção
WORKDIR /app/backend
RUN npm ci --only=production

# 4. Imagem final com segurança
FROM node:18-alpine

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar apenas o necessário com permissões corretas
RUN apk add --no-cache su-exec
COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/backend ./backend
COPY --from=builder --chown=nodejs:nodejs /app/dist ./public

# VARIÁVEIS DE AMBIENTE (antes de mudar usuário)
ENV NODE_ENV=production
ENV PORT=5000
ENV DOCKER_ENV=true

# CRIAR DIRETÓRIO /data COMO ROOT (antes de mudar para nodejs)
RUN mkdir -p /data && chown nodejs:nodejs /data
RUN mkdir -p /home/nodejs/data && chown -R nodejs:nodejs /home/nodejs
VOLUME /data

# MUDAR para usuário não-root (APÓS criar /data)
# Copiar e configurar script de entrypoint para ajustar permissões
COPY --chown=nodejs:nodejs docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Expor porta
EXPOSE 5000

# Health check robusto
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); \
    const req = http.get('http://localhost:5000/api/health', (res) => { \
      process.exit(res.statusCode === 200 ? 0 : 1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.setTimeout(5000, () => { req.destroy(); process.exit(1); });"

# Comando para iniciar
CMD ["node", "backend/server.js"]
