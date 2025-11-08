@echo off
REM =====================================================
REM Script para aplicar migrations do Supabase (Windows)
REM =====================================================

echo 🚀 Iniciando aplicação das migrations do banco de dados...

REM Verificar se as variáveis de ambiente estão definidas
if "%NEXT_PUBLIC_SUPABASE_URL%"=="" (
    echo ❌ Erro: NEXT_PUBLIC_SUPABASE_URL não encontrada
    echo Configure as variáveis de ambiente do Supabase
    exit /b 1
)

if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo ❌ Erro: SUPABASE_SERVICE_ROLE_KEY não encontrada
    echo Configure as variáveis de ambiente do Supabase
    exit /b 1
)

echo 📄 Migration encontrada: supabase/migrations/20241107000001_admin_setup.sql

echo.
echo 🔄 Para aplicar a migration manualmente:
echo 1. Abra o painel do Supabase
echo 2. Vá para SQL Editor
echo 3. Cole o conteúdo do arquivo supabase/migrations/20241107000001_admin_setup.sql
echo 4. Execute o script
echo.

echo ✅ Script preparado!
echo.
echo 📋 Próximos passos:
echo 1. Execute a migration no painel do Supabase
echo 2. Execute 'npm run dev' para iniciar o servidor
echo 3. Acesse '/admin' para testar o painel
echo 4. Crie o primeiro usuário admin via Supabase Auth
echo.
echo 🔐 Para criar o primeiro admin:
echo 1. Vá para o painel do Supabase
echo 2. Authentication → Users → Create User
echo 3. Depois execute: UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@exemplo.com';

pause