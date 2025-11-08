@echo off
REM Script para limpar e resetar o ambiente Docker no Windows

echo 🧹 Limpando ambiente Docker...

REM Parar todos os containers
echo ⏹️ Parando containers...
docker-compose down

REM Remover volumes (dados serão perdidos)
echo 🗑️ Removendo volumes...
docker-compose down -v

REM Remover imagens do projeto
echo 🖼️ Removendo imagens...
docker-compose down --rmi local

REM Limpeza geral do Docker
echo 🧽 Limpeza geral do Docker...
docker system prune -f

echo ✅ Limpeza concluída!
echo    Para reiniciar: scripts\start-docker.bat
pause