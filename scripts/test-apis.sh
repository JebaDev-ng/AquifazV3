#!/bin/bash

# Script para testar APIs do ambiente Docker local

BASE_URL="http://localhost:8000"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

echo "🧪 Testando APIs do AquiFaz Local..."
echo ""

# Teste 1: Auth Settings
echo "1️⃣ Testando Auth Settings..."
curl -s "$BASE_URL/auth/v1/settings" | jq '.' || echo "❌ Auth Settings falhou"
echo ""

# Teste 2: PostgREST Health
echo "2️⃣ Testando PostgREST..."
curl -s "$BASE_URL/rest/v1/" -H "Authorization: Bearer $ANON_KEY" | jq '.' || echo "❌ PostgREST falhou"
echo ""

# Teste 3: Listar Produtos
echo "3️⃣ Testando endpoint de produtos..."
curl -s "$BASE_URL/rest/v1/products" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" | jq '.' || echo "❌ Produtos falhou"
echo ""

# Teste 4: Listar Profiles
echo "4️⃣ Testando endpoint de profiles..."
curl -s "$BASE_URL/rest/v1/profiles" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "apikey: $SERVICE_KEY" | jq '.' || echo "❌ Profiles falhou"
echo ""

# Teste 5: Frontend
echo "5️⃣ Testando frontend..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200" && echo "✅ Frontend OK" || echo "❌ Frontend falhou"
echo ""

# Teste 6: MinIO
echo "6️⃣ Testando MinIO..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:9001 | grep -q "200" && echo "✅ MinIO OK" || echo "❌ MinIO falhou"
echo ""

# Teste 7: PostgreSQL
echo "7️⃣ Testando PostgreSQL..."
docker exec aquifaz_postgres pg_isready -U postgres && echo "✅ PostgreSQL OK" || echo "❌ PostgreSQL falhou"
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "📋 Para mais detalhes:"
echo "  • Logs gerais: docker-compose logs"
echo "  • Status: docker-compose ps"
echo "  • Frontend: http://localhost:3000"
echo "  • Admin Panel: http://localhost:3000/admin"