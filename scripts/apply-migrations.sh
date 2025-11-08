#!/bin/bash

# =====================================================
# Script para aplicar migrations do Supabase
# =====================================================

echo "🚀 Iniciando aplicação das migrations do banco de dados..."

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Erro: Variáveis de ambiente do Supabase não encontradas"
    echo "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Criar diretório temporário para o SQL
TEMP_SQL="temp_migration.sql"

echo "📄 Preparando migration..."

# Copiar conteúdo da migration
cp "./supabase/migrations/20241107000001_admin_setup.sql" "$TEMP_SQL"

echo "🔄 Aplicando migration no banco de dados..."

# Aplicar migration usando curl
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": $(cat $TEMP_SQL | jq -Rs .)}"

# Limpar arquivo temporário
rm -f "$TEMP_SQL"

echo "✅ Migration aplicada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute 'npm run dev' para iniciar o servidor"
echo "2. Acesse '/admin' para testar o painel"
echo "3. Crie o primeiro usuário admin via Supabase Auth"
echo ""
echo "🔐 Para criar o primeiro admin:"
echo "1. Vá para o painel do Supabase"
echo "2. Authentication → Users → Create User"
echo "3. Depois execute: UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@exemplo.com';"