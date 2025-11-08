#!/bin/bash

# Script para limpar e resetar o ambiente Docker

echo "🧹 Limpando ambiente Docker..."

# Parar todos os containers
echo "⏹️ Parando containers..."
docker-compose down

# Remover volumes (dados serão perdidos)
echo "🗑️ Removendo volumes..."
docker-compose down -v

# Remover imagens do projeto
echo "🖼️ Removendo imagens..."
docker-compose down --rmi local

# Limpeza geral do Docker
echo "🧽 Limpeza geral do Docker..."
docker system prune -f

echo "✅ Limpeza concluída!"
echo "   Para reiniciar: ./scripts/start-docker.sh"