# PrintShop - E-commerce de Gráfica

E-commerce moderno de gráfica inspirado no design minimalista do LS.Graphics, construído com Next.js 15, Supabase e TailwindCSS.

## 🚀 Stack Tecnológica

- **Next.js 15** - App Router + React Server Components
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Framer Motion** - Animações
- **Supabase** - Backend (Auth, Database, Storage, RLS)
- **Vercel** - Deploy e otimização de imagens

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repo>
cd loja-grafica
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

4. Configure o banco de dados Supabase:
   - Crie um novo projeto no [Supabase](https://supabase.com)
   - Execute o SQL em `supabase-schema.sql` no SQL Editor do Supabase
   - Isso criará todas as tabelas e políticas RLS necessárias

5. Execute o projeto:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗂️ Estrutura do Projeto

```
loja-grafica/
├── app/
│   ├── api/
│   │   ├── carrinho/route.ts    # API de carrinho
│   │   └── checkout/route.ts    # API de checkout
│   ├── produtos/
│   │   ├── [slug]/page.tsx      # Página de produto individual
│   │   └── page.tsx             # Listagem de produtos
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Estilos globais
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx   # Provider de tema dark/light
│   └── ui/
│       ├── carousel/
│       │   └── product-carousel.tsx
│       ├── footer/
│       │   └── footer.tsx
│       ├── header/
│       │   └── navbar.tsx
│       ├── hero/
│       │   ├── hero-carousel.tsx
│       │   └── hero-section.tsx
│       ├── pricing-section.tsx
│       └── product-card.tsx
├── lib/
│   ├── animations/
│   │   └── variants.ts          # Variantes de animação
│   ├── supabase/
│   │   ├── client.ts            # Cliente Supabase (browser)
│   │   └── server.ts            # Cliente Supabase (server)
│   ├── types.ts                 # Tipos TypeScript
│   └── utils.ts                 # Funções utilitárias
└── supabase-schema.sql          # Schema do banco de dados
```

## 🎨 Características

### Design
- ✅ Layout minimalista inspirado no LS.Graphics
- ✅ Navbar com duas linhas (tagline + menu)
- ✅ Hero section com carrossel 3D animado
- ✅ Cards de produtos com hover effects
- ✅ Carrosséis horizontais por categoria
- ✅ Seção de preços com planos
- ✅ Footer organizado e limpo
- ✅ Tema dark/light mode

### Funcionalidades
- ✅ Listagem de produtos com ISR (revalidação a cada hora)
- ✅ Filtro por categoria
- ✅ Página de detalhes do produto
- ✅ Integração com WhatsApp
- ✅ Carrinho de compras (API)
- ✅ Sistema de checkout
- ✅ Autenticação via Supabase
- ✅ Row Level Security (RLS)

### Performance
- ✅ React Server Components
- ✅ Incremental Static Regeneration (ISR)
- ✅ Otimização de imagens com Next/Image
- ✅ Code splitting automático
- ✅ Lazy loading de componentes

## 🔐 Segurança

- Row Level Security (RLS) ativado em todas as tabelas
- Políticas de acesso configuradas:
  - Produtos: leitura pública, escrita apenas autenticados
  - Pedidos: usuários veem apenas seus próprios pedidos
  - Carrinho: usuários acessam apenas seu próprio carrinho

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

```bash
npm run build
```

## 📝 Próximos Passos

- [ ] Implementar sistema de pagamento (Stripe/Mercado Pago)
- [ ] Adicionar painel administrativo
- [ ] Sistema de upload de arquivos para personalização
- [ ] Calculadora de preços dinâmica
- [ ] Sistema de avaliações
- [ ] Integração com correios para frete
- [ ] Email notifications
- [ ] Dashboard de pedidos do usuário

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
