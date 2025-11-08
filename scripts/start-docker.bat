@echo off
REM Script para configurar e executar o ambiente Docker local no Windows

echo 🚀 Configurando ambiente Docker para AquiFaz...

REM Parar containers existentes
echo 📦 Parando containers existentes...
docker-compose down

REM Backup do .env.local atual
if exist ".env.local" (
    echo 💾 Fazendo backup do .env.local atual...
    copy ".env.local" ".env.local.backup" >nul
)

REM Usar configuração Docker
echo ⚙️ Configurando variáveis de ambiente para Docker...
copy ".env.docker" ".env.local" >nul

REM Construir e iniciar serviços
echo 🔧 Construindo e iniciando serviços...
docker-compose up --build -d

echo ⏳ Aguardando serviços ficarem prontos...
timeout /t 30 /nobreak >nul

REM Verificar status dos serviços
echo 🔍 Verificando status dos serviços...
docker-compose ps

echo.
echo ✅ Ambiente Docker configurado com sucesso!
echo.
echo 📋 Serviços disponíveis:
echo   • Frontend Next.js: http://localhost:3000
echo   • Supabase API: http://localhost:8000
echo   • PostgREST: http://localhost:3001
echo   • MinIO Console: http://localhost:9001 ^(admin: minioadmin/minioadmin123^)
echo   • Supabase Studio: http://localhost:3002
echo   • PostgreSQL: localhost:5432 ^(user: postgres, pass: postgres^)
echo   • Redis: localhost:6379
echo.
echo 🔧 Comandos úteis:
echo   • Ver logs: docker-compose logs -f [serviço]
echo   • Parar tudo: docker-compose down
echo   • Reset completo: docker-compose down -v ^&^& docker-compose up --build
echo.

REM Perguntar sobre migration
set /p migrate="📥 Deseja executar as migrations agora? (y/n): "
if /i "%migrate%"=="y" (
    echo 🗄️ Executando migrations...
    REM Aguardar postgres estar pronto
    timeout /t 10 /nobreak >nul
    
    REM Executar migration via docker exec
    docker exec aquifaz_postgres psql -U postgres -d aquifaz -f /docker-entrypoint-initdb.d/migrations/20241107000001_admin_setup.sql
    
    echo ✅ Migrations executadas!
)

echo.
echo 🎉 Ambiente está pronto para uso!
echo    Acesse http://localhost:3000 para ver a aplicação
pause